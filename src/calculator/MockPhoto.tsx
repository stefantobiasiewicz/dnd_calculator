/**
 * Zdjęcie przykładowej realizacji w modalu informacyjnym — na razie zamockowane (patrz DND-16),
 * docelowo podmienione na prawdziwe zdjęcia klientów.
 */
export function MockPhoto({ label }: { label: string }) {
  return (
    <div
      className="mock-photo"
      role="img"
      aria-label={`Przykładowa realizacja: ${label} (zdjęcie poglądowe)`}
    >
      <div className="mock-photo__content">
        <svg viewBox="0 0 48 48" className="mock-photo__icon" aria-hidden="true">
          <rect x="6" y="10" width="36" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M10 32 20 22 28 28 34 20 40 32" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="mock-photo__caption">Przykładowe zdjęcie — wkrótce prawdziwa realizacja</span>
      </div>
    </div>
  );
}
