import { useState } from 'react';
import type { CalculatorConfig } from './types';
import { Calculator } from './calculator/Calculator';
import { defaultCalculatorConfig } from './pricing';
import { PRICING_CONFIG } from './pricingConfig';

export function App() {
  const [config, setConfig] = useState<CalculatorConfig>(defaultCalculatorConfig);

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kalkulator modelu koncepcyjnego</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Skonfiguruj model: od typu budynku po dodatki widoczne na fizycznym modelu. Wycena jest orientacyjna —
            ostateczna oferta powstaje po sprawdzeniu dokumentacji technicznej.
          </p>
        </div>
        <span className="card px-3 py-2 text-sm text-brand-dark">Wycena orientacyjna</span>
      </div>

      <Calculator config={config} onChange={setConfig} pricing={PRICING_CONFIG} />
    </main>
  );
}
