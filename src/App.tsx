import { useState } from 'react';
import type { CalculatorConfig } from './types';
import { Calculator } from './calculator/Calculator';
import { defaultCalculatorConfig } from './pricing';
import { PRICING_CONFIG } from './pricingConfig';

export function App() {
  const [config, setConfig] = useState<CalculatorConfig>(defaultCalculatorConfig);

  return (
    <main className="app">
      <div className="app__header">
        <div>
          <h1 className="app__title">Kalkulator modelu koncepcyjnego</h1>
          <p className="app__intro">
            Skonfiguruj model: od typu budynku po dodatki widoczne na fizycznym modelu. Wycena jest orientacyjna —
            ostateczna oferta powstaje po sprawdzeniu dokumentacji technicznej.
          </p>
        </div>
        <span className="card app__badge">Wycena orientacyjna</span>
      </div>

      <Calculator config={config} onChange={setConfig} pricing={PRICING_CONFIG} />
    </main>
  );
}
