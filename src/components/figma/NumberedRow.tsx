import React from 'react';
import { Link } from 'react-router-dom';
import ImageSlot from './ImageSlot';

/** Long thin arrow used by the "order ⟶" links. */
export function LongArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 34 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M0 6h31" />
      <path d="M25 1l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface NumberedRowProps {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  imageSlot: string;
  imageLabel: string;
  imageHint: string;
  /** Tailwind height class for the image, e.g. "h-[651px]" */
  imageHeight?: string;
  /** When true the image sits on the right and the text on the left. */
  reverse?: boolean;
  orderTo?: string;
  /**
   * When set, the "order" control opens a form instead of navigating. The
   * machine rows use this so their order forms are reachable from the page.
   */
  onOrder?: () => void;
  /** Overrides the control's label. Defaults to "order". */
  orderLabel?: string;
  /**
   * Renders the control as inert grey text instead of a link/button — for
   * products that are not on sale yet. Takes precedence over `onOrder`.
   */
  orderDisabled?: boolean;
  id?: string;
}

/**
 * One entry of the numbered product / machine list ("01 Coconut Desheller").
 * Image on one side, copy on the other, giant watermark numeral behind it.
 */
export default function NumberedRow({
  number,
  title,
  description,
  bullets,
  imageSlot,
  imageLabel,
  imageHint,
  imageHeight = 'lg:h-[651px]',
  reverse = false,
  orderTo = '/contact',
  onOrder,
  orderLabel = 'order',
  orderDisabled = false,
  id,
}: NumberedRowProps) {
  // Shared so the <Link> and the modal-opening <button> render identically.
  // `cursor-pointer` is needed on the button — Tailwind preflight does not add it.
  const orderClass =
    'group inline-flex cursor-pointer items-center gap-2 font-lora text-[16px] font-semibold text-[#1AC212] transition-opacity hover:opacity-80';

  // Not-yet-available products: same position and type as the real control, but
  // muted and with no arrow, so it reads as a status rather than an action.
  const disabledClass =
    'inline-flex items-center gap-2 font-lora text-[16px] font-semibold text-[#9CA3AF] select-none';

  return (
    // Side padding is deliberately tighter than the rest of the site (px-4/sm:px-6,
    // not px-5/sm:px-8) and the column gap is deliberately much wider than the
    // Figma default (24px): the image and the copy should each hug their own edge
    // with a wide empty channel between them, rather than sitting bunched in the
    // middle with big margins outside. The max-width grew by the same amount the
    // gap did, so the columns keep their ~600px width instead of shrinking to pay
    // for the wider gutter.
    //
    // The gap steps up at `xl`: a flat 140px from 1024px upward leaves the columns
    // only 418px wide, which is too narrow for the 520px copy to read well.
    <div
      id={id}
      className="mx-auto grid max-w-[1400px] grid-cols-1 items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-[72px] xl:gap-[140px]"
    >
      {/* Image.
          `imageHeight` is an `lg:`-prefixed class (the Figma frame's pixel
          height), which left the wrapper with no height at all below lg: every
          child of ImageSlot is `absolute`, so the box collapsed to 0px and the
          machine photos were invisible on phones. The explicit mobile heights
          below are the base that the caller's `lg:` value overrides. */}
      <ImageSlot
        slot={imageSlot}
        label={imageLabel}
        hint={imageHint}
        className={`h-[240px] w-full rounded-[6px] sm:h-[360px] ${imageHeight} ${
          reverse ? 'lg:order-2' : 'lg:order-1'
        }`}
      />

      {/* Copy */}
      <div
        className={`relative flex flex-col justify-center py-2 lg:px-6 ${
          reverse ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        {/* Watermark numeral. 220px on a 390px screen swamped the copy it sits
            behind, so it steps up with the breakpoint. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 right-1 select-none font-open-sans text-[110px] font-bold leading-none text-[#F7F7F7] sm:text-[160px] lg:-top-4 lg:right-6 lg:text-[300px]"
        >
          {number}
        </span>

        <div className="relative">
          <h3 className="font-montserrat text-[26px] font-bold leading-tight text-black sm:text-[30px]">
            {title}
          </h3>

          <p className="mt-5 max-w-[520px] font-lora text-[16px] leading-[1.75] text-[#101010]">
            {description}
          </p>

          <ul className="mt-6 max-w-[520px] list-disc space-y-[6px] pl-5 font-lora text-[16px] leading-[1.6] text-[#101010]">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <div className="mt-9 flex justify-end">
            {orderDisabled ? (
              <span className={disabledClass}>{orderLabel}</span>
            ) : onOrder ? (
              <button type="button" onClick={onOrder} className={orderClass}>
                {orderLabel}
                <LongArrow className="w-[34px] transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <Link to={orderTo} className={orderClass}>
                {orderLabel}
                <LongArrow className="w-[34px] transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
