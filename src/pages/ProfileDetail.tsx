import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Linkedin, Mail, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import { profiles } from '../data/profiles';

export default function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const profile = profiles.find((item) => item.id === profileId);
  const [copied, setCopied] = useState(false);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="container mx-auto px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-semibold">Team profile</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Profile not found</h1>
          <p className="mt-4 text-base leading-8 text-slate-700">
            The profile you are looking for does not exist. You can return to the team page to choose another member.
          </p>
        </main>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/profile/${profile.id}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Copy failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="container mx-auto px-6 py-16 sm:py-24">
        <section className="mx-auto max-w-4xl">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-500 bg-slate-50 shadow-sm">
                <img
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4 text-center lg:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  {profile.role}
                </p>
                <h2 className="text-3xl font-semibold text-slate-950">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-sm leading-7 text-slate-600">
                  {profile.description}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              <a
                href={`mailto:${profile.email}`}
                className="group w-full min-w-0 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <div className="flex min-w-0 items-start gap-3 text-slate-900">
                  <Mail className="mt-1 h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium break-words">{profile.email}</span>
                </div>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="group w-full min-w-0 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <div className="flex min-w-0 items-start gap-3 text-slate-900">
                  <Phone className="mt-1 h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium break-words">{profile.phone || 'Phone not provided'}</span>
                </div>
              </a>

              <div className="group w-full min-w-0 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50">
                <div className="flex min-w-0 items-start gap-3 text-slate-900">
                  <Linkedin className="mt-1 h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium">
                    {profile.linkedIn ? 'LinkedIn profile' : 'LinkedIn unavailable'}
                  </span>
                </div>
                {profile.linkedIn ? (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-xs text-slate-600 underline hover:text-emerald-700"
                  >
                    View profile
                  </a>
                ) : null}
              </div>
            </div>

            <div className="mt-8 rounded-[20px] border border-emerald-100 bg-emerald-50 p-4 text-sm text-slate-700 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">Share this profile</p>
                  <p className="mt-1 break-all">{shareUrl}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
