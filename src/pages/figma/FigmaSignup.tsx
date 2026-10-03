import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import ImageSlot from '../../components/figma/ImageSlot';
import { GoogleMark, AppleMark } from '../../components/figma/BrandMarks';
import { img } from './images';

/* ───────────────────────────────────────────────────────────────────────────
 *  "S 19" — Create Your Account.  Every number below is lifted straight from
 *  the Figma node tree (node 164:3060) so the page lands on the design.
 *
 *    frame         1440 × 919, white
 *    left panel    x=10 y=10, 612 × 899  — a SINGLE image fill. The headline,
 *                  green rule and paragraph are BAKED INTO that photo, so we
 *                  only draw our own copy while the slot is still empty.
 *    right column  x=722 → 1340 (818 panel − 100px padding each side = 618),
 *                  content runs y=50 → 869 and is vertically centred.
 *
 *    H1         y=50    Montserrat 600 40px / lh 48.76
 *    subtitle   y=119   Lora 400 24px / lh 30.72
 *    fields     y=185   4 × 65px, 18px apart, r=15, border #B5B5B5
 *    sign up    y=530   618 × 65, r=15, #1AC212
 *    divider    y=625   line 235 · gap 10 · label 128 · gap 10 · line 235
 *    google     y=674   618 × 65, r=15, border #B5B5B5
 *    apple      y=754   618 × 65, r=15, border #B5B5B5
 *    footer     y=849   Lora 500 16px
 * ─────────────────────────────────────────────────────────────────────────── */

const FIELD = 'h-[65px] w-full rounded-[15px] border border-[#B5B5B5] bg-white';
const FIELD_INPUT = `${FIELD} pl-[75px] pr-[60px] font-lora text-[14px] text-black outline-none placeholder:text-[#505050] focus:border-[#17AD10]`;
const FIELD_ICON = 'pointer-events-none absolute left-[29px] top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-[#3F3F3F]';
const EYE = 'absolute right-[29px] top-1/2 -translate-y-1/2 text-[#3F3F3F] hover:text-black';
const SOCIAL =
  'flex h-[65px] w-full items-center justify-center gap-[20px] rounded-[15px] border border-[#B5B5B5] bg-white font-lora text-[16px] font-medium text-black transition-colors hover:bg-neutral-50';

export default function FigmaSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const hasPanelImage = Boolean(img('signup-panel'));

  return (
    <div className="flex min-h-screen flex-col bg-white lg:h-[919px] lg:flex-row lg:py-[10px] lg:pl-[10px]">
      {/* ── Left photo panel ─────────────────────────────────────────────── */}
      <div className="relative min-h-[320px] w-full shrink-0 lg:h-[899px] lg:min-h-0 lg:w-[612px]">
        <ImageSlot
          slot="signup-panel"
          label="Hands holding a coconut, palm trees behind"
          hint="612 × 899"
          labelPosition="corner"
          className="absolute inset-0 h-full w-full"
          imgClassName="object-left"
          overlay={hasPanelImage ? undefined : 'bg-black/55'}
        />

        {/* Placeholder-only copy — the real photo already contains this text. */}
        {!hasPanelImage && (
          <div className="relative flex h-full flex-col justify-center pl-8 pt-[25px] sm:pl-[69px]">
            <h2 className="font-lora text-[38px] font-bold leading-[1.16] text-white sm:text-[50px] sm:leading-[57.8px]">
              A<br />
              Greener
              <br />
              Brighter
              <br />
              Future.
            </h2>
            <span
              className="mt-[24px] block h-[9px] w-[74px] bg-[#17AD10]"
              aria-hidden="true"
            />
            <p className="mt-[19px] max-w-[235px] font-lora text-[19px] leading-[1.24] text-white sm:text-[24px] sm:leading-[29.6px]">
              Create an account and be part of the coconut value chain transformation.
            </p>
          </div>
        )}
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-14 sm:px-10 lg:px-[100px] lg:py-[50px]">
        <div className="relative w-full max-w-[618px]">
          <Link
            to="/"
            aria-label="Close"
            className="absolute right-0 top-[7px] flex h-[35px] w-[35px] items-center justify-center text-[#101010] transition-opacity hover:opacity-60"
          >
            {/* Figma draws this at 27 × 27 inside the 35 px hit area — a plain
                lucide X is only half that at the same box size. */}
            <svg viewBox="0 0 27 27" className="h-[27px] w-[27px]" aria-hidden="true">
              <path
                d="M2 2 25 25M25 2 2 25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </Link>

          {/* `pr-12` keeps the headline clear of the absolutely-positioned close
              button: at 430px the 40px-tall title would otherwise run under it. */}
          <h1 className="pr-12 font-montserrat text-[32px] font-semibold leading-[1.22] text-black sm:text-[40px] sm:leading-[48.76px]">
            Create Your Account
          </h1>
          <p className="mt-[20px] font-lora text-[20px] leading-[1.28] text-black sm:text-[24px] sm:leading-[30.72px]">
            Join Coconoto today
          </p>

          <form className="mt-[35px]" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-[18px]">
              {/* Full name */}
              <div className="relative">
                <User className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Full name"
                  aria-label="Full name"
                  className={FIELD_INPUT}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                <input
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  className={FIELD_INPUT}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  aria-label="Password"
                  className={FIELD_INPUT}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className={EYE}
                >
                  {showPassword ? (
                    <EyeOff className="h-[24px] w-[24px]" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-[24px] w-[24px]" strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {/* Confirm password */}
              <div className="relative">
                <Lock className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  aria-label="Confirm password"
                  className={FIELD_INPUT}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className={EYE}
                >
                  {showConfirm ? (
                    <EyeOff className="h-[24px] w-[24px]" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-[24px] w-[24px]" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-[31px] h-[65px] w-full rounded-[15px] bg-[#1AC212] font-lora text-[16px] font-medium leading-[20.48px] text-white transition-colors hover:bg-[#17ad10]"
            >
              Sign Up
            </button>
          </form>

          {/* Divider — 235px rule, 10px gap, 128px label, 10px gap, 235px rule */}
          <div className="mt-[30px] flex h-[20px] items-center gap-[10px]">
            <span className="h-px flex-1 bg-[#D3D3D3]" />
            <span className="font-lora text-[16px] leading-[20.48px] text-black">
              Or continue with
            </span>
            <span className="h-px flex-1 bg-[#D3D3D3]" />
          </div>

          <button type="button" className={`mt-[29px] ${SOCIAL}`}>
            <span className="flex h-[46px] w-[46px] items-center justify-center">
              <GoogleMark className="h-[30px] w-[30px]" />
            </span>
            Continue with Google
          </button>

          <button type="button" className={`mt-[15px] ${SOCIAL}`}>
            <span className="flex h-[46px] w-[46px] items-center justify-center">
              <AppleMark className="h-[44px] w-[44px]" />
            </span>
            Continue with Apple
          </button>

          <p className="mt-[30px] text-center font-lora text-[16px] font-medium leading-[20.48px] text-black">
            Already have an account?{' '}
            <Link to="/login" className="text-[#17AD10] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
