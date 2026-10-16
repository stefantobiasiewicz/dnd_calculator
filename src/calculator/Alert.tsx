import type { ReactNode } from 'react';

type AlertKind = 'error' | 'info' | 'success' | 'warning';
const ALERT_CLASS: Record<AlertKind, string> = {
  error: 'alert--error',
  info: 'alert--info',
  success: 'alert--success',
  warning: 'alert--warning',
};

export function Alert({ kind = 'info', children }: { kind?: AlertKind; children: ReactNode }) {
  return (
    <div className={`alert ${ALERT_CLASS[kind]}`}>{children}</div>
  );
}
