import type { CalculatorConfig, RoofType } from '../types';
import { roofApplies } from '../pricing';

const WALL = '#d8dedb';
const BODY = '#fefefe';
const AMBER = '#b57923';
const BLUE = '#386b8f';

/** Schematyczny podgląd modelu reagujący na konfigurację (poglądowy, nie w skali). */
export function ModelPreview({ config }: { config: CalculatorConfig }) {
  const twoLevels = config.levels > 1;
  const showRoof = roofApplies(config.buildingType);
  const o = config.options;

  return (
    <div className="model-preview">
      <svg viewBox="0 0 240 200" className="model-preview__image">
        {/* podłoga / płyta */}
        <polygon points="40,150 120,180 200,150 120,120" fill="#e6ece9" stroke={WALL} strokeWidth="2" />

        {/* parter */}
        <g>
          <polygon points="40,150 40,110 120,140 120,180" fill={BODY} stroke={WALL} strokeWidth="2" />
          <polygon points="200,150 200,110 120,140 120,180" fill="#f4f7f5" stroke={WALL} strokeWidth="2" />
        </g>

        {/* piętro */}
        {twoLevels && (
          <g>
            <polygon points="40,110 40,78 120,108 120,140" fill={BODY} stroke={WALL} strokeWidth="2" />
            <polygon points="200,110 200,78 120,108 120,140" fill="#f4f7f5" stroke={WALL} strokeWidth="2" />
          </g>
        )}

        {/* ściany działowe */}
        {o.interiorWalls && (
          <g opacity="0.55">
            <line x1="80" y1="125" x2="80" y2="165" stroke={WALL} strokeWidth="3" />
            <line x1="160" y1="125" x2="160" y2="165" stroke={WALL} strokeWidth="3" />
          </g>
        )}

        {/* dach */}
        {showRoof ? (
          <RoofShape roofType={config.roofType} top={twoLevels ? 78 : 110} pv={o.photovoltaic} />
        ) : (
          <polygon
            points={`40,${twoLevels ? 78 : 110} 120,${twoLevels ? 108 : 140} 200,${twoLevels ? 78 : 110} 120,${twoLevels ? 48 : 80}`}
            fill="#eef2ef"
            stroke={WALL}
            strokeWidth="2"
          />
        )}

        {/* ramy okienne */}
        {o.windowFrames && (
          <g stroke={BLUE} strokeWidth="3">
            <rect x="58" y="128" width="14" height="12" fill="none" />
            <rect x="90" y="140" width="14" height="12" fill="none" />
          </g>
        )}

        {/* taras */}
        {o.terrace && (
          <polygon points="120,180 160,165 200,180 160,196" fill={AMBER} opacity="0.45" stroke={AMBER} strokeWidth="2" />
        )}

        {/* brama */}
        {o.gate && <rect x="150" y="150" width="18" height="14" fill="none" stroke={AMBER} strokeWidth="3" />}

        {/* pergola */}
        {o.pergola && (
          <g stroke={AMBER} strokeWidth="2" opacity="0.85">
            <rect x="126" y="150" width="34" height="16" fill="none" />
            <line x1="134" y1="150" x2="134" y2="166" />
            <line x1="144" y1="150" x2="144" y2="166" />
            <line x1="154" y1="150" x2="154" y2="166" />
          </g>
        )}
      </svg>
    </div>
  );
}

function RoofShape({ roofType, top, pv }: { roofType: RoofType; top: number; pv: boolean }) {
  const ridge = top - 34;
  switch (roofType) {
    case 'FLAT':
      return (
        <g>
          <polygon points={`40,${top} 120,${top + 30} 200,${top} 120,${top - 30}`} fill="#f0f3f1" stroke="#c8d1cd" strokeWidth="2" />
          {pv && <polygon points={`92,${top - 6} 148,${top - 6} 132,${top - 18} 76,${top - 18}`} fill={BLUE} opacity="0.85" />}
        </g>
      );
    case 'GABLE':
      return (
        <g>
          <polygon points={`40,${top} 120,${top - 44} 120,${ridge - 6} 40,${ridge + 32}`} fill="#f7f8f7" stroke="#c8d1cd" strokeWidth="2" />
          <polygon points={`200,${top} 120,${top - 44} 120,${ridge - 6} 200,${ridge + 32}`} fill="#e9eeeb" stroke="#c8d1cd" strokeWidth="2" />
          {pv && <polygon points={`70,${top - 14} 108,${top - 28} 108,${top - 40} 70,${top - 26}`} fill={BLUE} opacity="0.85" />}
        </g>
      );
    case 'HIP':
      return (
        <g>
          <polygon points={`40,${top} 120,${top + 26} 120,${ridge} 90,${ridge - 10}`} fill="#f7f8f7" stroke="#c8d1cd" strokeWidth="2" />
          <polygon points={`200,${top} 120,${top + 26} 120,${ridge} 150,${ridge - 10}`} fill="#e9eeeb" stroke="#c8d1cd" strokeWidth="2" />
          <polygon points={`40,${top} 120,${top - 40} 200,${top} 150,${ridge - 10} 90,${ridge - 10}`} fill="#eef2ef" stroke="#c8d1cd" strokeWidth="2" />
        </g>
      );
    case 'MULTI_HIP':
      return (
        <g>
          <polygon points={`40,${top} 120,${top + 26} 120,${ridge} 88,${ridge - 8}`} fill="#f7f8f7" stroke="#c8d1cd" strokeWidth="2" />
          <polygon points={`200,${top} 120,${top + 26} 120,${ridge} 152,${ridge - 8}`} fill="#e9eeeb" stroke="#c8d1cd" strokeWidth="2" />
          <polygon points={`120,${top - 40} 200,${top} 152,${ridge - 8} 120,${ridge - 20}`} fill="#eef2ef" stroke="#c8d1cd" strokeWidth="2" />
          <polygon points={`120,${top - 40} 40,${top} 88,${ridge - 8} 120,${ridge - 20}`} fill="#f2f5f3" stroke="#c8d1cd" strokeWidth="2" />
        </g>
      );
  }
}
