import type { ReactNode } from 'react';
import { InfoButton } from './InfoButton';

/** Kafelek radio (bez comboboxów — patrz DND-16) z ikoną, opisem i info-modalem w rogu. */
export function RadioTile({
  selected,
  onClick,
  icon,
  title,
  subtitle,
  infoDescription,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  infoDescription: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`grid min-h-[112px] w-full content-start gap-2 rounded-card border p-4 pr-8 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          selected ? 'border-brand bg-brand-light ring-2 ring-brand/15' : 'border-line bg-field hover:border-brand'
        }`}
      >
        <span className="grid h-9 w-11 place-items-end text-ink">{icon}</span>
        <strong className="text-sm">{title}</strong>
        {subtitle && <span className="text-xs text-muted">{subtitle}</span>}
      </button>
      <InfoButton label={title} description={infoDescription} />
    </div>
  );
}
