import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface LightboxCertificate {
  kind: string;
  title: string;
  description: string;
  certificateNo: string;
  issueDate: string;
  /** Resolved image URL for the full-size certificate. */
  src?: string;
}

interface CertificateLightboxProps {
  cert: LightboxCertificate | null;
  onClose: () => void;
}

/**
 * Centred modal card showing a certificate in full.
 *
 * The card in the section shows a cropped band of a portrait A4 document, so
 * this is where the whole certificate becomes readable. Rendered through a
 * portal so the fixed overlay is never clipped by an ancestor's `overflow` or
 * `transform`.
 */
export default function CertificateLightbox({ cert, onClose }: CertificateLightboxProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);

  // Close on Escape, and remember what had focus so it can be restored.
  React.useEffect(() => {
    if (!cert) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // Lock the page behind the overlay. Restoring the *previous* value (rather
    // than clearing it) keeps a scroll lock owned by an outer layer intact.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [cert, onClose]);

  if (!cert) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-lightbox-title"
        // Stop clicks inside the card from reaching the backdrop's close handler.
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[780px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="font-lora text-[12px] font-semibold text-[#5A3015]">{cert.kind}</p>
            <h3
              id="certificate-lightbox-title"
              className="mt-1 font-montserrat text-[18px] font-bold leading-snug text-black"
            >
              {cert.title}
            </h3>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close certificate"
            className="-mr-1 -mt-1 shrink-0 rounded-full p-2 text-[#777777] transition-colors hover:bg-neutral-100 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1AC212] focus-visible:ring-offset-2"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F7F7F7] px-6 py-5">
          {cert.src ? (
            <img
              src={cert.src}
              alt={`${cert.title} — full certificate`}
              className="mx-auto block h-auto max-h-[64vh] w-auto max-w-full rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
            />
          ) : (
            <p className="py-16 text-center font-lora text-[13px] text-[#777777]">
              Certificate image not available yet.
            </p>
          )}
        </div>

        <div className="border-t border-neutral-200 px-6 py-4">
          <p className="font-lora text-[12px] leading-[1.8] text-[#777777]">
            {cert.description}
            <br />
            Certificate No: {cert.certificateNo} &nbsp;·&nbsp; Issue Date: {cert.issueDate}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
