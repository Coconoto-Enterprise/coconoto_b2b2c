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
  imageHeight = 'h-[651px]',
  reverse = false,
  orderTo = '/contact',
  id,
}: NumberedRowProps) {
  return (
    <div id={id} className="mx-auto grid max-w-[1266px] grid-cols-1 items-stretch gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-6">
      {/* Image */}
      <ImageSlot
        slot={imageSlot}
        label={imageLabel}
        hint={imageHint}
        className={`w-full rounded-[6px] ${imageHeight} ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
      />

      {/* Copy */}
      <div
        className={`relative flex flex-col justify-center py-2 lg:px-6 ${
          reverse ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        {/* Watermark numeral */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 right-2 select-none font-open-sans text-[220px] font-bold leading-none text-[#F7F7F7] lg:-top-4 lg:right-6 lg:text-[300px]"
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
            <Link
              to={orderTo}
              className="group inline-flex items-center gap-2 font-lora text-[16px] font-semibold text-[#1AC212] transition-opacity hover:opacity-80"
            >
              order
              <LongArrow className="w-[34px] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
