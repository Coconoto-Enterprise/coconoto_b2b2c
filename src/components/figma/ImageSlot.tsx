import React from 'react';
import { ImageIcon } from 'lucide-react';
import { img } from '../../pages/figma/images';

interface ImageSlotProps {
  /** Slot key from `src/pages/figma/images.ts` */
  slot: string;
  /**
   * Explicit image URL, overriding the shared registry.
   *
   * Used so one page can show a real picture while another page rendering the
   * exact same section keeps its placeholder — the registry is global, so it
   * cannot express "only on `/`".
   */
  src?: string;
  /** Human readable name shown on the placeholder */
  label: string;
  /** Recommended size, e.g. "634 × 651" */
  hint?: string;
  /** Extra classes applied to the wrapper (sizing, rounding, positioning) */
  className?: string;
  /** Extra classes applied to the <img> itself */
  imgClassName?: string;
  /** Content rendered on top of the image / placeholder */
  children?: React.ReactNode;
  /** Adds a dark scrim over the image — used for hero banners with white text */
  overlay?: string;
  /**
   * `content` (default) — a solid grey box, for pictures that sit in the layout.
   * `background`      — invisible, just a small corner tag, for full-bleed
   *                     decorative artwork that text is laid on top of.
   */
  variant?: 'content' | 'background';
  /**
   * Where the placeholder label sits. Use `corner` for wide bands and heroes
   * where centred copy would otherwise cover it.
   */
  labelPosition?: 'center' | 'corner';
  style?: React.CSSProperties;
}

/** Small corner pill marking an image slot without covering the layout. */
function CornerTag({ slot, hint }: { slot: string; hint?: string }) {
  return (
    <span className="absolute left-3 top-3 z-10 inline-flex max-w-[calc(100%-24px)] items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium tracking-[0.02em] text-white backdrop-blur-sm">
      <ImageIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate font-mono">{slot}</span>
      {hint ? <span className="shrink-0 font-normal opacity-70">{hint}</span> : null}
    </span>
  );
}

/**
 * Renders the real image once a URL exists in the registry, otherwise a clearly
 * marked placeholder naming the exact slot key so it is obvious which picture
 * goes where — copy the key straight into `src/pages/figma/images.ts`.
 */
export default function ImageSlot({
  slot,
  src: srcOverride,
  label,
  hint,
  className = '',
  imgClassName = '',
  children,
  overlay,
  variant = 'content',
  labelPosition = 'center',
  style,
}: ImageSlotProps) {
  const src = srcOverride ?? img(slot);

  // The wrapper is `relative` by default so the image / placeholder can fill it.
  // When the caller positions it themselves (hero backgrounds, logo overlays, …)
  // we must NOT add `relative` — Tailwind emits `.relative` after `.absolute`, so
  // both classes would resolve to `relative` and the overlay would collapse.
  const callerPositions = /(^|\s)!?(absolute|fixed|sticky|static)(\s|$)/.test(className);

  // Same trap, one property over: Tailwind emits `.object-cover` *after*
  // `.object-contain`, so a caller asking for `contain` silently got `cover`
  // and their picture was cropped instead of letterboxed. Only fall back to
  // the default when the caller has not chosen a fit of their own.
  // (`object-top` / `object-left` are `object-position`, not a fit — excluded.)
  const callerObjectFit = /(^|\s)!?object-(contain|cover|fill|none|scale-down)(\s|$)/.test(
    imgClassName,
  );

  return (
    <div
      className={`overflow-hidden ${callerPositions ? '' : 'relative'} ${className}`}
      style={style}
      data-image-slot={slot}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          loading="lazy"
          className={`absolute inset-0 h-full w-full ${callerObjectFit ? '' : 'object-cover'} ${imgClassName}`}
        />
      ) : variant === 'background' ? (
        // Decorative full-bleed artwork: stay out of the way of the copy, just
        // tag the corner so it is obvious where the picture belongs.
        <CornerTag slot={slot} hint={hint} />
      ) : labelPosition === 'corner' ? (
        // Wide bands / heroes: keep the fill (so white copy stays readable) but
        // move the tag out of the way of the centred content.
        <>
          <div className="absolute inset-0 border border-dashed border-neutral-300 bg-neutral-100" />
          <CornerTag slot={slot} hint={hint} />
        </>
      ) : (
        <div
          aria-label={`Placeholder for ${slot}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 border border-dashed border-neutral-300 bg-neutral-100 px-3 text-center"
        >
          <ImageIcon className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <span className="max-w-full break-all font-mono text-[11px] font-semibold leading-tight text-neutral-700">
            {slot}
          </span>
          <span className="max-w-full text-[10px] leading-tight text-neutral-500">{label}</span>
          {hint && <span className="text-[10px] leading-tight text-neutral-400">{hint}</span>}
        </div>
      )}

      {overlay && <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />}
      {children}
    </div>
  );
}
