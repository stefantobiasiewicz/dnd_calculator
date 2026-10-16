/**
 * Zdjęcie przykładowej realizacji w modalu informacyjnym — na razie zamockowane (patrz DND-16),
 * docelowo podmienione na prawdziwe zdjęcia klientów.
 */
export function MockPhoto({ label }: { label: string }) {
  return (
    <div
      className="grid aspect-[4/3] w-full place-items-center rounded-card border border-dashed border-line bg-field text-center"
      role="img"
      aria-label={`Przykładowa realizacja: ${label} (zdjęcie poglądowe)`}
    >
      <div className="grid gap-2 px-4 text-muted">
        <svg viewBox="0 0 48 48" className="mx-auto h-10 w-10" aria-hidden="true">
          <rect x="6" y="10" width="36" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M10 32 20 22 28 28 34 20 40 32" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="text-xs">Przykładowe zdjęcie — wkrótce prawdziwa realizacja</span>
      </div>
    </div>
  );
}
