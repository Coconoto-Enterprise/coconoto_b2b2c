import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import ImageSlot from '../../components/figma/ImageSlot';
import { GoogleMark, AppleMark } from '../../components/figma/BrandMarks';
import { img } from './images';

const inputClass =
  'h-[60px] w-full rounded-[8px] border border-[#DCDCDC] bg-white pl-[52px] pr-4 font-lora text-[15px] text-black outline-none transition-colors placeholder:text-[#505050] focus:border-[#17AD10]';

/**
 * Desktop 20 — "Welcome Back" login. Split layout: photo panel on the left,
 * credentials on the right. No navbar in the design.
 */
export default function FigmaLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // The panel artwork has the headline, green rule and paragraph painted into
  // it. Once the real photo is in place the HTML stand-in below must go, or the
  // two sets of text render on top of each other.
  const hasPanelImage = Boolean(img('login-panel'));

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* ── Left photo panel ───────────────────────────────────────────── */}
      <div className="relative min-h-[320px] w-full shrink-0 lg:min-h-screen lg:w-[612px]">
        <ImageSlot
          slot="login-panel"
          label="Palm trees and coconuts photo"
          hint="612 × 899"
          labelPosition="corner"
          className="absolute inset-0 h-full w-full"
          overlay={hasPanelImage ? undefined : 'bg-black/40'}
        />
        {!hasPanelImage && (
          <div className="relative flex h-full flex-col justify-center px-8 py-16 lg:px-[67px]">
            <h2 className="max-w-[290px] font-lora text-[34px] font-bold leading-[1.25] text-white lg:text-[46px]">
              Good People. Greater Tomorrows.
            </h2>
            <span className="mt-7 block h-[4px] w-[58px] bg-[#17AD10]" aria-hidden="true" />
            <p className="mt-7 max-w-[240px] font-lora text-[17px] leading-[1.6] text-white lg:text-[20px]">
              Join a growing community building a more sustainable coconut industry.
            </p>
          </div>
        )}
      </div>

      {/* ── Right form panel ───────────────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <Link
          to="/"
          aria-label="Close"
          className="absolute right-8 top-6 text-[#101010] transition-opacity hover:opacity-60"
        >
          <X className="h-[26px] w-[26px]" strokeWidth={1.6} />
        </Link>

        <div className="w-full max-w-[620px]">
          <h1 className="font-montserrat text-[32px] font-semibold text-black sm:text-[40px]">
            Welcome Back
          </h1>
          <p className="mt-4 font-lora text-[20px] text-black sm:text-[24px]">
            Log in to your Coconoto account
          </p>

          <form className="mt-9" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 h-[19px] w-[19px] -translate-y-1/2 text-[#505050]"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <input
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="relative mt-6">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[19px] w-[19px] -translate-y-1/2 text-[#505050]"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                aria-label="Password"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#505050] hover:text-black"
              >
                {showPassword ? (
                  <EyeOff className="h-[19px] w-[19px]" strokeWidth={1.6} />
                ) : (
                  <Eye className="h-[19px] w-[19px]" strokeWidth={1.6} />
                )}
              </button>
            </div>

            {/* Remember / forgot */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-[18px] w-[18px] rounded-[4px] border border-[#C4C4C4] accent-[#1AC212]"
                />
                <span className="font-lora text-[16px] text-black">Remember me</span>
              </label>
              <Link to="/buyer-login" className="font-lora text-[16px] text-[#17AD10] hover:underline">
                Forget password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-8 h-[60px] w-full rounded-[8px] bg-[#1AC212] font-lora text-[16px] font-medium text-white transition-colors hover:bg-[#17ad10]"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#DCDCDC]" />
            <span className="font-lora text-[16px] text-black">Or continue with</span>
            <span className="h-px flex-1 bg-[#DCDCDC]" />
          </div>

          <div className="space-y-4">
            <button
              type="button"
              className="flex h-[60px] w-full items-center justify-center gap-4 rounded-[8px] border border-[#DCDCDC] bg-white font-lora text-[16px] font-medium text-black transition-colors hover:bg-neutral-50"
            >
              <GoogleMark />
              Continue with Google
            </button>
            <button
              type="button"
              className="flex h-[60px] w-full items-center justify-center gap-4 rounded-[8px] border border-[#DCDCDC] bg-white font-lora text-[16px] font-medium text-black transition-colors hover:bg-neutral-50"
            >
              <AppleMark />
              Continue with Apple
            </button>
          </div>

          <p className="mt-9 text-center font-lora text-[16px] text-black">
            Don&rsquo;t have an account?{' '}
            <Link to="/signup" className="text-[#17AD10] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
