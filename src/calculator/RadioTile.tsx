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
    <div className="radio-tile">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`radio-tile__button ${selected ? 'radio-tile__button--selected' : ''}`}
      >
        <span className="radio-tile__icon">{icon}</span>
        <strong className="radio-tile__title">{title}</strong>
        {subtitle && <span className="radio-tile__subtitle">{subtitle}</span>}
      </button>
      <InfoButton label={title} description={infoDescription} />
    </div>
  );
}
