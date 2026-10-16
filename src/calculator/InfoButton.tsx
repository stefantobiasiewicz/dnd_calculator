import { useState } from 'react';
import { Modal } from './Modal';
import { InfoIcon } from './icons';
import { MockPhoto } from './MockPhoto';

/** Ikonka info w rogu kafelka/toggle'a opcji — otwiera modal z opisem i przykładowym zdjęciem. */
export function InfoButton({ label, description }: { label: string; description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-soft hover:text-brand-dark"
        aria-label={`Informacje: ${label}`}
      >
        <InfoIcon />
      </button>
      <Modal open={open} title={label} onClose={() => setOpen(false)}>
        <div className="grid gap-3">
          <MockPhoto label={label} />
          <p className="text-sm text-muted">{description}</p>
        </div>
      </Modal>
    </>
  );
}
