export type BuildingType = 'APARTMENT_1L' | 'APARTMENT_2L' | 'HOUSE_1F' | 'HOUSE_2F' | 'DUPLEX' | 'TERRACED';
export type RoofType = 'FLAT' | 'GABLE' | 'HIP' | 'MULTI_HIP';
export type OptionKey = 'INTERIOR_WALLS' | 'WINDOW_FRAMES' | 'PERGOLA' | 'TERRACE' | 'PHOTOVOLTAIC' | 'GATE';

export interface OrderOptions {
  interiorWalls: boolean;
  windowFrames: boolean;
  pergola: boolean;
  terrace: boolean;
  photovoltaic: boolean;
  gate: boolean;
}

/** Stan kalkulatora — odpowiednik `OrderConfig` ze sklepu bez pól zamówienia (kanał, link architekta, zapisana cena). */
export interface CalculatorConfig {
  buildingType: BuildingType;
  areaSqm: number;
  levels: 1 | 2;
  roofType: RoofType;
  copies: number;
  options: OrderOptions;
}

export interface PriceBracket {
  areaMin: number;
  areaMax: number | null;
  priceMin: number;
  priceMax: number | null;
}

export interface BuildingPricing {
  type: BuildingType;
  brackets: PriceBracket[];
}

/** Kształt 1:1 z `PricingConfig` backendu — config z backoffice da się wkleić bez zmian. */
export interface PricingConfig {
  basePrices: BuildingPricing[];
  roofSurcharges: Record<RoofType, number>;
  optionPrices: Record<OptionKey, number>;
  optionActive: Record<OptionKey, boolean>;
  copyDiscount: Record<string, number>;
  limits?: { maxFileSizeMb: number };
}
