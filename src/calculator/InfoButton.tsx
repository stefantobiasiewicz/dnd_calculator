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
        className="info-button"
        aria-label={`Informacje: ${label}`}
      >
        <InfoIcon />
      </button>
      <Modal open={open} title={label} onClose={() => setOpen(false)}>
        <div className="info-modal">
          <MockPhoto label={label} />
          <p className="info-modal__description">{description}</p>
        </div>
      </Modal>
    </>
  );
}
