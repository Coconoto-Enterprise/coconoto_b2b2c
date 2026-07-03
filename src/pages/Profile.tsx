import React from 'react';
import { Linkedin, Mail, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { profiles } from '../data/profiles';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-20">
        <section className="bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(180deg,#0f766e_0%,#ffffff_100%)] py-16">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-semibold">Team profiles</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl text-slate-950">
              Meet the people powering Coconoto.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              Responsive desktop and mobile profile cards built from your submitted team details. Browse each member's role, background, and contact information.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {(() => {
              const sorted = [...profiles].sort((a, b) => {
                const aHas = Boolean(a.linkedIn);
                const bHas = Boolean(b.linkedIn);
                if (aHas === bHas) return 0;
                return aHas ? -1 : 1;
              });

              // Move Enoch directly after Jamiu if both exist
              const jIndex = sorted.findIndex((p) => p.id === 'adetonajamiu');
              const eIndex = sorted.findIndex((p) => p.id === 'enoch-bamigboye');
              if (jIndex !== -1 && eIndex !== -1) {
                const [enoch] = sorted.splice(eIndex, 1);
                const insertIndex = sorted.findIndex((p) => p.id === 'adetonajamiu');
                sorted.splice(insertIndex + 1, 0, enoch);
              }

              return sorted.map((profile) => (
                <article
                  key={profile.id}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                >
                  <div className="p-6 sm:p-8">
                    <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-500 bg-slate-100 shadow-sm">
                      <img
                        src={profile.profileImage}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                        {profile.role}
                      </p>
                      <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                        {profile.firstName} {profile.lastName}
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-slate-600 min-h-[7rem]">
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-8 h-28 sm:h-32">
                    <a
                      href={`mailto:${profile.email}`}
                      className="group flex items-center gap-3 text-slate-900 transition hover:text-emerald-700"
                    >
                      <Mail className="h-5 w-5 text-emerald-600 transition group-hover:text-emerald-800" />
                      <span className="text-sm font-medium">{profile.email}</span>
                    </a>

                    <a
                      href={`tel:${profile.phone}`}
                      className="group flex items-center gap-3 text-slate-900 transition hover:text-emerald-700"
                    >
                      <Phone className="h-5 w-5 text-emerald-600 transition group-hover:text-emerald-800" />
                      <span className="text-sm font-medium">{profile.phone}</span>
                    </a>

                    {profile.linkedIn ? (
                      <a
                        href={profile.linkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 text-slate-900 transition hover:text-emerald-700"
                      >
                        <Linkedin className="h-5 w-5 text-emerald-600 transition group-hover:text-emerald-800" />
                        <span className="text-sm font-medium break-all">View LinkedIn profile</span>
                      </a>
                    ) : null}
                  </div>
                </article>
              ));
            })()}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
