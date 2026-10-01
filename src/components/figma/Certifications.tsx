import React from 'react';
import ImageSlot from './ImageSlot';
import CertificateLightbox from './CertificateLightbox';
import { img } from '../../pages/figma/images';

interface Certificate {
  kind: 'Patent' | 'License';
  title: string;
  description: string;
  certificateNo: string;
  issueDate: string;
  /** Registry slot holding the certificate document scan. */
  slot: string;
  /** The scan's own aspect ratio (width / height), used to size the frame. */
  ratio: number;
}

const CERTIFICATES: Certificate[] = [
  {
    kind: 'Patent',
    title: 'Certificate of Registration of Utility Model Patent',
    description: 'Federal Republic of Nigeria Utility Model Patent for Coconut Deshelling Machine.',
    certificateNo: 'NG/PT/NC/O/2024/14257',
    issueDate: '2024',
    slot: 'cert-1-photo',
    ratio: 1239 / 1756,
  },
  {
    kind: 'Patent',
    title: 'Certificate of Registration of Utility Model Patent',
    description: 'Federal Republic of Nigeria Utility Model Patent for Coconut Dehusking Machine.',
    certificateNo: 'NG/PT/NC/O/2024/14257',
    issueDate: '2024',
    slot: 'cert-2-photo',
    ratio: 1238 / 1762,
  },
  {
    kind: 'License',
    title: 'Certificate of Registration',
    description: 'Business Name Registration for Coconoto Limited, Nigeria.',
    certificateNo: '3674818',
    issueDate: '2022',
    slot: 'cert-3-photo',
    ratio: 654 / 850,
  },
];

/**
 * Backdrop photo sitting behind every certificate.
 *
 * The certificate scans are portrait A4 sheets on a plain cream field, so they
 * are laid *inside* a photo rather than filling the slot themselves — the
 * artwork reads as a certificate sitting on the plantation floor.
 */
const BACKDROP_SLOT = 'cert-backdrop';

/**
 * Geometry lifted off the Figma frame, as a percentage of the photo box
 * (319 × 270 in the file, ratio 1.181). Measured from the render, not guessed:
 *
 *   dark plate    x 17.0% → 82.8%   (66% wide),  y 17.0% → 100%
 *   certificate   x 26.0% → 72.7%   (46.7% wide), y 29.8% → past the bottom
 *
 * Both are centred on the box, and both run off the bottom edge — the plate is
 * flush with it, the certificate bleeds a little past it and is clipped, which
 * is why the thumbnail looks like a sheet lying on the floor rather than a
 * floating card. The popup is what shows the sheet in full.
 *
 * The plate's opacity was solved from the frame: sampling the photo 3px either
 * side of the plate's top edge gives in/out = 0.62, i.e. a 38% black scrim.
 */
const PLATE = 'absolute left-1/2 top-[17%] h-[83%] w-[66%] -translate-x-1/2 bg-black/40';
const DOC = 'absolute left-1/2 top-[29.8%] w-[46.7%] -translate-x-1/2';

/**
 * "Our Certifications" — shared by Desktop 8 and Desktop 11.
 * Pass `band="grey"` for the light grey band version used on Desktop 11.
 */
export default function Certifications({ band = 'white' }: { band?: 'white' | 'grey' }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const openCert = openIndex === null ? null : CERTIFICATES[openIndex];

  return (
    <section className={band === 'grey' ? 'bg-[#F7F7F7]' : 'bg-white'}>
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-20 sm:px-8 lg:px-[100px]">
        <div className="text-center">
          <h2 className="font-montserrat text-[32px] font-bold leading-tight text-black sm:text-[40px]">
            Our Certifications
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] font-lora text-[16px] leading-[1.6] text-[#101010]">
            Recognized and certified for excellence in coconut processing technology
          </p>
        </div>

        <div className="mt-14 grid gap-y-12 md:grid-cols-3 md:gap-y-0">
          {CERTIFICATES.map((cert, i) => (
            <article
              key={cert.title + i}
              // 64px at xl reproduces the frame's 285px box exactly; the padding
              // steps down below that so the box does not collapse (a flat
              // lg:px-16 left it only 147px wide at 1024).
              className={`px-0 md:px-6 lg:px-10 xl:px-16 ${i > 0 ? 'md:border-l md:border-neutral-200' : ''}`}
            >
              {/* The certificate sits in a box whose background is a photo.
                  `aspect-[118/100]` reproduces the frame's 319 x 270 slot, and
                  `overflow-hidden` is what clips the plate and the sheet at the
                  bottom edge — exactly as the frame does. */}
              <div className="group relative aspect-[118/100] w-full overflow-hidden">
                <ImageSlot
                  slot={BACKDROP_SLOT}
                  label="Certificate backdrop photo"
                  hint="hands holding cocopeat"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="object-cover"
                />

                {/* The dark translucent plate. It sits *above* the photo but
                    *below* the certificate, and its top edge is 12.8% higher up
                    than the sheet's — so it reads as a panel the sheet is laid
                    on, not a scrim over it. */}
                <div className={PLATE} aria-hidden="true" />

                {/* The sheet itself, sized from its own aspect ratio so it runs
                    off the bottom edge at every breakpoint. */}
                <ImageSlot
                  slot={cert.slot}
                  label={`Certificate ${i + 1} document`}
                  hint="portrait A4 scan"
                  className={DOC}
                  imgClassName="object-cover object-top"
                  style={{ aspectRatio: String(cert.ratio) }}
                />

                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`View the full certificate: ${cert.title}`}
                  className="absolute inset-0 z-10 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1AC212]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20"
                  >
                    <span className="rounded-full bg-white/95 px-4 py-2 font-montserrat text-[12px] font-semibold text-[#101010] opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
                      View certificate
                    </span>
                  </span>
                </button>
              </div>

              <p className="mt-6 font-lora text-[12px] font-semibold text-[#5A3015]">{cert.kind}</p>
              <h3 className="mt-2 max-w-[260px] font-montserrat text-[16px] font-bold leading-snug text-black">
                {cert.title}
              </h3>
              {/* `max-w` is load-bearing: the copy must break after "Patent"
                  (as the frame does), so the box has to sit between the width of
                  "…Model Patent" (265.7px at 12px Lora) and "…Model Patent for"
                  (285px) — which is also the full column width, hence the cap. */}
              <p className="mt-3 max-w-[275px] font-lora text-[12px] leading-[1.65] text-[#101010]">
                {cert.description}
              </p>
              <p className="mt-7 font-lora text-[10px] leading-[1.8] text-[#777777]">
                Certificate No: {cert.certificateNo}
                <br />
                Issue Date: {cert.issueDate}
              </p>
            </article>
          ))}
        </div>
      </div>

      <CertificateLightbox
        cert={
          openCert
            ? {
                kind: openCert.kind,
                title: openCert.title,
                description: openCert.description,
                certificateNo: openCert.certificateNo,
                issueDate: openCert.issueDate,
                src: img(openCert.slot),
              }
            : null
        }
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
