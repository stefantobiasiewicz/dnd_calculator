import type { ReactNode } from 'react';

type AlertKind = 'error' | 'info' | 'success' | 'warning';
const ALERT_CLASS: Record<AlertKind, string> = {
  error: 'border-l-danger bg-[#fbecea] text-danger',
  info: 'border-l-info bg-[#eef3f8] text-info',
  success: 'border-l-brand bg-brand-light text-brand-dark',
  warning: 'border-l-amber bg-amber-soft text-amber-ink',
};

export function Alert({ kind = 'info', children }: { kind?: AlertKind; children: ReactNode }) {
  return (
    <div className={`rounded-card border border-line border-l-4 px-4 py-3 text-sm leading-snug ${ALERT_CLASS[kind]}`}>
      {children}
    </div>
  );
}
