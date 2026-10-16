import type { PricingConfig } from './types';

/** Cennik zahardkodowany na potrzeby demo — skopiowany z LIVE `PRICING_CONFIG` (app_config). */
export const PRICING_CONFIG: PricingConfig = {
  limits: { maxFileSizeMb: 50 },
  basePrices: [
    { type: 'APARTMENT_1L', brackets: [{ areaMax: null, areaMin: 0, priceMax: 290, priceMin: 200 }] },
    { type: 'APARTMENT_2L', brackets: [{ areaMax: null, areaMin: 0, priceMax: 390, priceMin: 300 }] },
    {
      type: 'HOUSE_1F',
      brackets: [
        { areaMax: 100, areaMin: 0, priceMax: 400, priceMin: 350 },
        { areaMax: null, areaMin: 100, priceMax: 550, priceMin: 400 },
      ],
    },
    {
      type: 'HOUSE_2F',
      brackets: [
        { areaMax: 110, areaMin: 0, priceMax: 500, priceMin: 400 },
        { areaMax: null, areaMin: 110, priceMax: 700, priceMin: 500 },
      ],
    },
    {
      type: 'DUPLEX',
      brackets: [
        { areaMax: 120, areaMin: 0, priceMax: null, priceMin: 700 },
        { areaMax: null, areaMin: 120, priceMax: null, priceMin: 950 },
      ],
    },
    {
      type: 'TERRACED',
      brackets: [
        { areaMax: 120, areaMin: 0, priceMax: null, priceMin: 800 },
        { areaMax: null, areaMin: 120, priceMax: null, priceMin: 1200 },
      ],
    },
  ],
  copyDiscount: { '2': 0.35, '3': 0.75 },
  optionActive: {
    GATE: true,
    PERGOLA: false,
    TERRACE: false,
    PHOTOVOLTAIC: true,
    WINDOW_FRAMES: true,
    INTERIOR_WALLS: true,
  },
  optionPrices: { GATE: 25, PERGOLA: 50, TERRACE: 50, PHOTOVOLTAIC: 25, WINDOW_FRAMES: 50, INTERIOR_WALLS: 0 },
  roofSurcharges: { HIP: 75, FLAT: 0, GABLE: 50, MULTI_HIP: 100 },
};
