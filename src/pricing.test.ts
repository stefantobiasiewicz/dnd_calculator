import { describe, expect, it } from 'vitest';
import type { CalculatorConfig, PricingConfig } from './types';
import { emptyOptions, estimatePrice } from './pricing';
import { PRICING_CONFIG } from './pricingConfig';

function pricing(overrides: Partial<PricingConfig> = {}): PricingConfig {
  return {
    basePrices: [
      {
        type: 'HOUSE_1F',
        brackets: [
          { areaMin: 0, areaMax: 80, priceMin: 350, priceMax: 400 },
          { areaMin: 80, areaMax: 150, priceMin: 400, priceMax: 500 },
        ],
      },
      {
        type: 'APARTMENT_1L',
        brackets: [{ areaMin: 0, areaMax: null, priceMin: 200, priceMax: 260 }],
      },
      {
        type: 'APARTMENT_2L',
        brackets: [{ areaMin: 0, areaMax: null, priceMin: 300, priceMax: 390 }],
      },
      {
        type: 'TERRACED',
        brackets: [
          { areaMin: 0, areaMax: 150, priceMin: 600, priceMax: null },
          { areaMin: 150, areaMax: null, priceMin: 900, priceMax: null },
        ],
      },
    ],
    roofSurcharges: { FLAT: 0, GABLE: 50, HIP: 75, MULTI_HIP: 100 },
    optionPrices: { INTERIOR_WALLS: 0, WINDOW_FRAMES: 50, PERGOLA: 50, TERRACE: 50, PHOTOVOLTAIC: 50, GATE: 50 },
    optionActive: { INTERIOR_WALLS: true, WINDOW_FRAMES: true, PERGOLA: true, TERRACE: true, PHOTOVOLTAIC: true, GATE: true },
    copyDiscount: { '2': 0.15, '3': 0.2 },
    limits: { maxFileSizeMb: 50 },
    ...overrides,
  };
}

function config(overrides: Partial<CalculatorConfig> = {}): CalculatorConfig {
  return {
    buildingType: 'HOUSE_1F',
    areaSqm: 70,
    levels: 1,
    roofType: 'GABLE',
    copies: 1,
    options: emptyOptions(),
    ...overrides,
  };
}

describe('estimatePrice', () => {
  it('returns the matching bracket range plus roof surcharge', () => {
    const result = estimatePrice(config({ areaSqm: 70, roofType: 'GABLE' }), pricing());
    expect(result).toEqual({ status: 'range', min: 400, max: 450 });
  });

  it('picks the bracket matching the upper area range', () => {
    const result = estimatePrice(config({ areaSqm: 120, roofType: 'FLAT' }), pricing());
    expect(result).toEqual({ status: 'range', min: 400, max: 500 });
  });

  it('does not apply roof surcharge for building types where roof does not apply', () => {
    const result = estimatePrice(config({ buildingType: 'APARTMENT_1L', areaSqm: 50, roofType: 'GABLE' }), pricing());
    expect(result).toEqual({ status: 'range', min: 200, max: 260 });
  });

  it('prices a two-level apartment (APARTMENT_2L) independently from a one-level apartment', () => {
    const oneLevel = estimatePrice(config({ buildingType: 'APARTMENT_1L', areaSqm: 50, roofType: 'GABLE' }), pricing());
    const twoLevel = estimatePrice(config({ buildingType: 'APARTMENT_2L', areaSqm: 50, roofType: 'GABLE' }), pricing());
    expect(oneLevel).toEqual({ status: 'range', min: 200, max: 260 });
    expect(twoLevel).toEqual({ status: 'range', min: 300, max: 390 });
  });

  it('adds selected option surcharges to both ends of the range', () => {
    const result = estimatePrice(
      config({ areaSqm: 70, roofType: 'FLAT', options: { ...emptyOptions(), terrace: true, gate: true } }),
      pricing(),
    );
    expect(result).toEqual({ status: 'range', min: 450, max: 500 });
  });

  it('ignores the surcharge of a selected option that is deactivated in the pricing config', () => {
    const result = estimatePrice(
      config({ areaSqm: 70, roofType: 'FLAT', options: { ...emptyOptions(), terrace: true } }),
      pricing({
        optionActive: { INTERIOR_WALLS: true, WINDOW_FRAMES: true, PERGOLA: true, TERRACE: false, PHOTOVOLTAIC: true, GATE: true },
      }),
    );
    expect(result).toEqual({ status: 'range', min: 350, max: 400 });
  });

  it('includes the default-on interiorWalls surcharge once the admin prices it', () => {
    const result = estimatePrice(
      config({ areaSqm: 70, roofType: 'FLAT' }),
      pricing({ optionPrices: { INTERIOR_WALLS: 30, WINDOW_FRAMES: 50, PERGOLA: 50, TERRACE: 50, PHOTOVOLTAIC: 50, GATE: 50 } }),
    );
    expect(result).toEqual({ status: 'range', min: 380, max: 430 });
  });

  it('excludes the interiorWalls surcharge once the user turns the standard package off', () => {
    const result = estimatePrice(
      config({ areaSqm: 70, roofType: 'FLAT', options: { ...emptyOptions(), interiorWalls: false } }),
      pricing({ optionPrices: { INTERIOR_WALLS: 30, WINDOW_FRAMES: 50, PERGOLA: 50, TERRACE: 50, PHOTOVOLTAIC: 50, GATE: 50 } }),
    );
    expect(result).toEqual({ status: 'range', min: 350, max: 400 });
  });

  it('returns an open estimate (min only) when the bracket has no priceMax', () => {
    const result = estimatePrice(config({ buildingType: 'TERRACED', areaSqm: 100, roofType: 'FLAT' }), pricing());
    expect(result).toEqual({ status: 'open', min: 600 });
  });

  it('reports out_of_range when no bracket covers the selected area', () => {
    const result = estimatePrice(config({ areaSqm: 500, roofType: 'FLAT' }), pricing());
    expect(result).toEqual({ status: 'out_of_range' });
  });

  it('applies the configured copy discount symmetrically to min and max', () => {
    const result = estimatePrice(config({ areaSqm: 70, roofType: 'FLAT', copies: 2 }), pricing());
    expect(result).toEqual({ status: 'range', min: Math.round(350 + 350 * 0.85), max: Math.round(400 + 400 * 0.85) });
  });

  it('applies the copy discount to the open min when the bracket has no max', () => {
    const result = estimatePrice(
      config({ buildingType: 'TERRACED', areaSqm: 100, roofType: 'FLAT', copies: 3 }),
      pricing(),
    );
    expect(result).toEqual({ status: 'open', min: Math.round(600 + 600 * 2 * 0.8) });
  });

  it('extends the highest configured copy-discount tier to counts above it, instead of dropping to no discount', () => {
    const result = estimatePrice(config({ areaSqm: 70, roofType: 'FLAT', copies: 5 }), pricing());
    expect(result).toEqual({
      status: 'range',
      min: Math.round(350 + 350 * 4 * 0.8),
      max: Math.round(400 + 400 * 4 * 0.8),
    });
  });
});

describe('hardcoded PRICING_CONFIG', () => {
  it('prices the default house with gable roof', () => {
    expect(estimatePrice(config({ areaSqm: 92, roofType: 'GABLE' }), PRICING_CONFIG)).toEqual({
      status: 'range',
      min: 400,
      max: 450,
    });
  });

  it('ignores options deactivated in the config (pergola, terrace)', () => {
    const result = estimatePrice(
      config({ areaSqm: 92, roofType: 'FLAT', options: { ...emptyOptions(), pergola: true, terrace: true } }),
      PRICING_CONFIG,
    );
    expect(result).toEqual({ status: 'range', min: 350, max: 400 });
  });
});
