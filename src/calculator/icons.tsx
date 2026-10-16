import type { RoofType } from '../types';

/** Ikony rzutu bocznego domu — jedna sylwetka na kondygnacje/dach, uzywane w kafelkach radio. */

export function FloorsIcon({ levels }: { levels: 1 | 2 }) {
  return (
    <svg viewBox="0 0 48 40" className="h-8 w-10" aria-hidden="true">
      <polygon points="6,18 24,6 42,18" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="18" width="32" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
      {levels === 2 && <line x1="8" y1="26" x2="40" y2="26" stroke="currentColor" strokeWidth="2" />}
    </svg>
  );
}

export function RoofIcon({ roofType }: { roofType: RoofType }) {
  switch (roofType) {
    case 'FLAT':
      return (
        <svg viewBox="0 0 48 40" className="h-8 w-10" aria-hidden="true">
          <rect x="8" y="14" width="32" height="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="8" y="18" width="32" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'GABLE':
      return (
        <svg viewBox="0 0 48 40" className="h-8 w-10" aria-hidden="true">
          <polygon points="6,18 24,6 42,18" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="8" y="18" width="32" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'HIP':
      return (
        <svg viewBox="0 0 48 40" className="h-8 w-10" aria-hidden="true">
          <polygon points="6,18 18,8 30,8 42,18" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="8" y="18" width="32" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'MULTI_HIP':
      return (
        <svg viewBox="0 0 48 40" className="h-8 w-10" aria-hidden="true">
          <polygon points="6,18 14,10 24,14 34,7 42,18" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="8" y="18" width="32" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}

export function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line x1="10" y1="9" x2="10" y2="14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}
