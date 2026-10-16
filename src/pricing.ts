import type { BuildingType, CalculatorConfig, OptionKey, OrderOptions, PricingConfig, RoofType } from './types';

export const BUILDING_DESC: Record<BuildingType, string> = {
  APARTMENT_1L: 'Model układu jednopoziomowego lokalu.',
  APARTMENT_2L: 'Model układu dwupoziomowego lokalu z rozbieralnymi kondygnacjami.',
  HOUSE_1F: 'Parterowy dom z dachem i wnętrzem.',
  HOUSE_2F: 'Piętrowy dom z rozbieralnymi kondygnacjami.',
  DUPLEX: 'Dwa segmenty — oferta po weryfikacji zakresu.',
  TERRACED: 'Powtarzalne segmenty szeregówki.',
};

const APARTMENT_TYPES: BuildingType[] = ['APARTMENT_1L', 'APARTMENT_2L'];

/** Czy dla danego typu budynku dach ma znaczenie (mieszkanie — nie, niezaleznie od liczby poziomow). */
export function roofApplies(buildingType: BuildingType): boolean {
  return !APARTMENT_TYPES.includes(buildingType);
}

/** Etykieta pola "levels" — mieszkanie ma poziomy, dom ma kondygnacje. */
export function levelsFieldLabel(buildingType: BuildingType): string {
  return APARTMENT_TYPES.includes(buildingType) ? 'Poziomy' : 'Kondygnacje';
}

/** Bliźniak i szeregówka skladaja sie z wielu segmentow — podana powierzchnia dotyczy jednego z nich. */
export function areaSqmLabel(buildingType: BuildingType): string {
  return buildingType === 'DUPLEX' || buildingType === 'TERRACED'
    ? 'powierzchni użytkowej jednego segmentu'
    : 'powierzchni użytkowej';
}

export const ROOF_LABEL: Record<RoofType, string> = {
  FLAT: 'Dach płaski',
  GABLE: 'Dach dwuspadowy',
  HIP: 'Dach czterospadowy',
  MULTI_HIP: 'Dach wielospadowy',
};

export const OPTION_LABEL: Record<OptionKey, string> = {
  INTERIOR_WALLS: 'Ściany działowe',
  WINDOW_FRAMES: 'Ramy okienne',
  PERGOLA: 'Pergola',
  TERRACE: 'Taras',
  PHOTOVOLTAIC: 'Fotowoltaika',
  GATE: 'Brama',
};

/** Mapowanie klucza cennika <-> pola OrderOptions. */
export const OPTION_TO_CONFIG: Record<OptionKey, keyof OrderOptions> = {
  INTERIOR_WALLS: 'interiorWalls',
  WINDOW_FRAMES: 'windowFrames',
  PERGOLA: 'pergola',
  TERRACE: 'terrace',
  PHOTOVOLTAIC: 'photovoltaic',
  GATE: 'gate',
};

export const ALL_OPTION_KEYS: OptionKey[] = [
  'INTERIOR_WALLS',
  'WINDOW_FRAMES',
  'PERGOLA',
  'TERRACE',
  'PHOTOVOLTAIC',
  'GATE',
];

/** interiorWalls to pakiet standardowy — domyslnie wlaczony, w odroznieniu od pozostalych dodatkow. */
export function emptyOptions(): OrderOptions {
  return { interiorWalls: true, windowFrames: false, pergola: false, terrace: false, photovoltaic: false, gate: false };
}

/** Startowa konfiguracja kalkulatora — ta sama co w sklepie. */
export function defaultCalculatorConfig(): CalculatorConfig {
  return {
    buildingType: 'HOUSE_1F',
    areaSqm: 92,
    levels: 1,
    roofType: 'GABLE',
    copies: 1,
    options: emptyOptions(),
  };
}

/** Czy dane rozszerzenie jest wlaczone w cenniku (admin moze je ukryc bez usuwania ceny). */
export function optionIsActive(pricing: PricingConfig, key: OptionKey): boolean {
  return pricing.optionActive?.[key] !== false;
}

export type PriceEstimate =
  | { status: 'range'; min: number; max: number }
  | { status: 'open'; min: number }
  | { status: 'out_of_range' };

function findBracket(config: PricingConfig, buildingType: BuildingType, areaSqm: number) {
  const building = config.basePrices.find((b) => b.type === buildingType);
  return building?.brackets.find(
    (b) => areaSqm >= b.areaMin && (b.areaMax == null || areaSqm <= b.areaMax),
  ) ?? null;
}

/**
 * Stawka rabatu za kolejne egzemplarze: najwyzszy skonfigurowany prog rownania lub ponizej
 * `copies`. Liczby egzemplarzy powyzej najwyzszego progu dostaja stawke tego najwyzszego progu.
 */
function copyDiscountRate(pricing: PricingConfig, copies: number): number {
  const applicableTiers = Object.keys(pricing.copyDiscount)
    .map(Number)
    .filter((tier) => tier <= copies)
    .sort((a, b) => b - a);
  return applicableTiers.length ? pricing.copyDiscount[String(applicableTiers[0])] : 0;
}

/**
 * Wylicza przedzial cenowy (lub cene otwarta "od X zl") na podstawie przedzialu
 * powierzchniowo-cenowego dopasowanego do typu budynku i powierzchni — kopia logiki sklepu.
 */
export function estimatePrice(config: CalculatorConfig, pricing: PricingConfig): PriceEstimate {
  const bracket = findBracket(pricing, config.buildingType, config.areaSqm);
  if (!bracket) return { status: 'out_of_range' };

  const roof = roofApplies(config.buildingType) ? pricing.roofSurcharges[config.roofType] ?? 0 : 0;

  let options = 0;
  for (const key of ALL_OPTION_KEYS) {
    if (config.options[OPTION_TO_CONFIG[key]] && optionIsActive(pricing, key)) {
      options += pricing.optionPrices[key] ?? 0;
    }
  }

  const copies = Math.max(1, config.copies);
  const discountRate = copyDiscountRate(pricing, copies);

  function withExtras(base: number): number {
    const unit = base + roof + options;
    const extra = copies > 1 ? unit * (copies - 1) * (1 - discountRate) : 0;
    return Math.round(unit + extra);
  }

  const min = withExtras(bracket.priceMin);
  if (bracket.priceMax == null) return { status: 'open', min };
  return { status: 'range', min, max: withExtras(bracket.priceMax) };
}

export function formatPriceEstimate(estimate: PriceEstimate): string {
  if (estimate.status === 'out_of_range') return 'Wymaga wyceny indywidualnej';
  if (estimate.status === 'open') return `od ${formatPln(estimate.min)}`;
  return `${formatPln(estimate.min)} – ${formatPln(estimate.max)}`;
}

export function formatPln(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 2,
  }).format(value);
}
