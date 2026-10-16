import { useMemo } from 'react';
import type { BuildingType, CalculatorConfig, PricingConfig, RoofType } from '../types';
import {
  ALL_OPTION_KEYS,
  BUILDING_DESC,
  OPTION_LABEL,
  OPTION_TO_CONFIG,
  ROOF_LABEL,
  areaSqmLabel,
  estimatePrice,
  formatPriceEstimate,
  levelsFieldLabel,
  optionIsActive,
  roofApplies,
} from '../pricing';
import { Alert } from './Alert';
import { ModelPreview } from './ModelPreview';
import { RadioTile } from './RadioTile';
import { InfoButton } from './InfoButton';
import { FloorsIcon, RoofIcon } from './icons';
import { BUILDING_INFO, FLOORS_INFO, OPTION_INFO, ROOF_INFO } from './optionInfo';

/**
 * "Typ budynku" pokazuje dom jednorodzinny i mieszkanie jako pojedyncze kafelki — poziomy/
 * kondygnacje wybiera się osobno w sekcji "Kondygnacje". HOUSE_1F/HOUSE_2F i APARTMENT_1L/APARTMENT_2L
 * zostają odrębnymi wartościami BuildingType (osobno wycenianymi w cenniku), ten selektor jest czysto prezentacyjny.
 */
type BuildingFamily = 'APARTMENT' | 'HOUSE' | 'DUPLEX' | 'TERRACED';
const FAMILIES: BuildingFamily[] = ['APARTMENT', 'HOUSE', 'DUPLEX', 'TERRACED'];

const FAMILY_LABEL: Record<BuildingFamily, string> = {
  APARTMENT: 'Mieszkanie',
  HOUSE: 'Dom jednorodzinny',
  DUPLEX: 'Bliźniak',
  TERRACED: 'Zabudowa szeregowa',
};

const FAMILY_DESC: Record<BuildingFamily, string> = {
  APARTMENT: 'Jednopoziomowe lub dwupoziomowe — liczbę poziomów wybierzesz poniżej.',
  HOUSE: 'Parterowy lub piętrowy — liczbę kondygnacji wybierzesz poniżej.',
  DUPLEX: BUILDING_DESC.DUPLEX,
  TERRACED: BUILDING_DESC.TERRACED,
};

const FAMILY_INFO: Record<BuildingFamily, string> = {
  APARTMENT: `${BUILDING_INFO.APARTMENT_1L} ${BUILDING_INFO.APARTMENT_2L}`,
  HOUSE: `${BUILDING_INFO.HOUSE_1F} ${BUILDING_INFO.HOUSE_2F}`,
  DUPLEX: BUILDING_INFO.DUPLEX,
  TERRACED: BUILDING_INFO.TERRACED,
};

function isHouseType(buildingType: BuildingType): buildingType is 'HOUSE_1F' | 'HOUSE_2F' {
  return buildingType === 'HOUSE_1F' || buildingType === 'HOUSE_2F';
}
function isApartmentType(buildingType: BuildingType): buildingType is 'APARTMENT_1L' | 'APARTMENT_2L' {
  return buildingType === 'APARTMENT_1L' || buildingType === 'APARTMENT_2L';
}

function familyOf(buildingType: BuildingType): BuildingFamily {
  if (isHouseType(buildingType)) return 'HOUSE';
  if (isApartmentType(buildingType)) return 'APARTMENT';
  return buildingType;
}

const ROOFS: RoofType[] = ['FLAT', 'GABLE', 'HIP', 'MULTI_HIP'];

/**
 * Kalkulator modelu koncepcyjnego — wycięty z `ConfiguratorForm` sklepu: tylko parametry modelu,
 * podgląd i cena, bez dokumentacji, notatki, regulaminu i przejścia do zamówienia.
 * Stan i cennik należą do wywołującego.
 */
export function Calculator({
  config,
  onChange,
  pricing,
}: {
  config: CalculatorConfig;
  onChange: (config: CalculatorConfig) => void;
  pricing: PricingConfig;
}) {
  const estimate = useMemo(() => estimatePrice(config, pricing), [config, pricing]);
  const showRoof = roofApplies(config.buildingType);
  const levels = config.levels;
  const visibleOptionKeys = ALL_OPTION_KEYS.filter((k) => optionIsActive(pricing, k));

  function patch(p: Partial<CalculatorConfig>) {
    onChange({ ...config, ...p });
  }
  function toggleOption(key: (typeof ALL_OPTION_KEYS)[number]) {
    const field = OPTION_TO_CONFIG[key];
    onChange({ ...config, options: { ...config.options, [field]: !config.options[field] } });
  }
  function selectFamily(family: BuildingFamily) {
    if (family === 'HOUSE') {
      patch({ buildingType: levels === 2 ? 'HOUSE_2F' : 'HOUSE_1F' });
    } else if (family === 'APARTMENT') {
      patch({ buildingType: levels === 2 ? 'APARTMENT_2L' : 'APARTMENT_1L' });
    } else {
      patch({ buildingType: family, levels: 1 });
    }
  }
  function selectLevels(n: 1 | 2) {
    let buildingType = config.buildingType;
    if (isHouseType(buildingType)) buildingType = n === 2 ? 'HOUSE_2F' : 'HOUSE_1F';
    else if (isApartmentType(buildingType)) buildingType = n === 2 ? 'APARTMENT_2L' : 'APARTMENT_1L';
    onChange({ ...config, levels: n, buildingType });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6">
        <section className="card shadow-panel">
          <SectionHead title="Typ budynku" hint="Wybierz wariant najbliższy projektowi z dokumentacji." />
          <div className="grid gap-3 p-5 pt-3 sm:grid-cols-2">
            {FAMILIES.map((family) => (
              <RadioTile
                key={family}
                selected={familyOf(config.buildingType) === family}
                onClick={() => selectFamily(family)}
                icon={<FloorsIcon levels={(family === 'HOUSE' || family === 'APARTMENT') && levels === 2 ? 2 : 1} />}
                title={FAMILY_LABEL[family]}
                subtitle={FAMILY_DESC[family]}
                infoDescription={FAMILY_INFO[family]}
              />
            ))}
          </div>
        </section>

        <section className="card shadow-panel">
          <SectionHead title="Parametry modelu" hint="Standardowa oferta obejmuje budynki do 25 × 25 m." />
          <div className="grid gap-5 p-5 pt-3">
            <div>
              <label className="label">Powierzchnia budynku</label>
              <div className="grid grid-cols-[1fr_80px] items-center gap-3">
                <input
                  type="range"
                  min={30}
                  max={400}
                  value={config.areaSqm}
                  onChange={(e) => patch({ areaSqm: Number(e.target.value) })}
                  className="accent-brand"
                />
                <input
                  type="number"
                  min={1}
                  className="input min-h-[40px]"
                  value={config.areaSqm}
                  onChange={(e) => patch({ areaSqm: Number(e.target.value) })}
                />
              </div>
              <p className="hint mt-1.5">
                {config.areaSqm} m² {areaSqmLabel(config.buildingType)}
              </p>
            </div>

            <div>
              <label className="label">{levelsFieldLabel(config.buildingType)}</label>
              <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                {([1, 2] as const).map((n) => (
                  <RadioTile
                    key={n}
                    selected={levels === n}
                    onClick={() => selectLevels(n)}
                    icon={<FloorsIcon levels={n} />}
                    title={
                      isApartmentType(config.buildingType)
                        ? n === 1
                          ? 'Jednopoziomowe'
                          : 'Dwupoziomowe'
                        : n === 1
                          ? 'Parterowy'
                          : 'Piętrowy'
                    }
                    infoDescription={FLOORS_INFO[n]}
                  />
                ))}
              </div>
            </div>

            {showRoof && (
              <div>
                <label className="label">Rodzaj dachu</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ROOFS.map((r) => (
                    <RadioTile
                      key={r}
                      selected={config.roofType === r}
                      onClick={() => patch({ roofType: r })}
                      icon={<RoofIcon roofType={r} />}
                      title={ROOF_LABEL[r]}
                      subtitle={r !== 'FLAT' ? `+${pricing.roofSurcharges[r]} zł` : 'w cenie'}
                      infoDescription={ROOF_INFO[r]}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="label" htmlFor="copies">
                Liczba egzemplarzy
              </label>
              <input
                id="copies"
                type="number"
                min={1}
                max={20}
                className="input"
                value={config.copies}
                onChange={(e) => patch({ copies: Math.max(1, Number(e.target.value) || 1) })}
              />
              <p className="hint mt-1.5">Kolejne egzemplarze z obniżonym kosztem produkcji.</p>
            </div>
          </div>
        </section>

        <section className="card shadow-panel">
          <SectionHead title="Elementy modelu" hint="Dodatki drukowane są w kontrastowym kolorze." />
          <div className="grid gap-5 p-5 pt-3">
            <div>
              <label className="label">Rozszerzenia</label>
              <div className="flex flex-wrap gap-2">
                {visibleOptionKeys.map((key) => (
                  <div key={key} className="relative">
                    <Toggle active={config.options[OPTION_TO_CONFIG[key]]} onClick={() => toggleOption(key)}>
                      {OPTION_LABEL[key]} +{pricing.optionPrices[key]} zł
                    </Toggle>
                    <InfoButton label={OPTION_LABEL[key]} description={OPTION_INFO[key]} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="grid content-start gap-4 lg:sticky lg:top-6">
        <ModelPreview config={config} />

        <div className="card p-5">
          <p className="text-xs text-muted">Szacunkowy przedział</p>
          <p className="my-1 text-3xl font-extrabold">{formatPriceEstimate(estimate)}</p>
          <p className="hint">
            {estimate.status === 'out_of_range'
              ? 'Ten rozmiar wykracza poza standardowy zakres cennika.'
              : 'Cena wymaga potwierdzenia po analizie dokumentacji technicznej.'}
          </p>
        </div>

        <Alert kind="warning">
          Większe obiekty, nietypowe dachy i modele poza standardem 25 × 25 m przechodzą do wyceny indywidualnej.
        </Alert>
      </aside>
    </div>
  );
}

function SectionHead({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="p-5 pb-0">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="hint mt-1">{hint}</p>
    </div>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-card border px-3 py-2 pr-8 text-sm transition-colors ${
        active ? 'border-brand bg-brand-light text-brand-dark' : 'border-line bg-field text-ink hover:border-brand'
      }`}
    >
      {children}
    </button>
  );
}
