import React from 'react';
import { Link } from 'react-router-dom';
import { profiles } from '../data/profiles';

export default function ProfileLinksPage() {
  const sorted = [...profiles].sort((a, b) => {
    const aHas = Boolean(a.linkedIn);
    const bHas = Boolean(b.linkedIn);
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="container mx-auto px-6 py-16 sm:py-24">
        <section className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-10">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-semibold">Profile links</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">Everyone has a unique personal profile link.</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              Tap or copy a link to see each team member’s individual profile page with no footer and mobile-ready layout.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {sorted.map((profile) => (
              <Link
                key={profile.id}
                to={`/profile/${profile.id}`}
                className="group rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-500 bg-white shadow-sm">
                    <img src={profile.profileImage} alt={`${profile.firstName} ${profile.lastName}`} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{profile.firstName} {profile.lastName}</p>
                    <p className="text-sm text-slate-600">{profile.role}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Link</p>
                  <p className="break-all text-emerald-700">{`${window.location.origin}/profile/${profile.id}`}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
