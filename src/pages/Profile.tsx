import React from 'react';
import { Link } from 'react-router-dom';
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
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-semibold">Unique links for every profile</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Every team member has their own personal profile page.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  Tap any member below to open their individual profile page with no footer. These unique links are available for the whole team.
                </p>
              </div>
              <Link
                to="/profile/links"
                className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                View all links
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <Link
                  key={`link-${profile.id}`}
                  to={`/profile/${profile.id}`}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <p className="text-sm font-semibold text-slate-950">{profile.firstName} {profile.lastName}</p>
                  <p className="mt-1 text-xs text-slate-600">{profile.role}</p>
                  <p className="mt-3 break-all text-xs text-emerald-700">{`${window.location.origin}/profile/${profile.id}`}</p>
                </Link>
              ))}
            </div>
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
                  className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex-1 p-6 sm:p-8">
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

                  <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-8">
                    <div className="flex flex-col justify-center space-y-4">
                      <a
                        href={`mailto:${profile.email}`}
                        className="group flex min-w-0 items-start gap-3 text-slate-900 transition hover:text-emerald-700"
                      >
                        <Mail className="mt-1 h-5 w-5 text-emerald-600 transition group-hover:text-emerald-800" />
                        <span className="min-w-0 break-words whitespace-normal text-sm font-medium">{profile.email}</span>
                      </a>

                      <a
                        href={`tel:${profile.phone}`}
                        className="group flex min-w-0 items-start gap-3 text-slate-900 transition hover:text-emerald-700"
                      >
                        <Phone className="mt-1 h-5 w-5 text-emerald-600 transition group-hover:text-emerald-800" />
                        <span className="min-w-0 break-words whitespace-normal text-sm font-medium">{profile.phone}</span>
                      </a>

                      {profile.linkedIn ? (
                        <a
                          href={profile.linkedIn}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex min-w-0 items-start gap-3 text-slate-900 transition hover:text-emerald-700"
                        >
                          <Linkedin className="h-5 w-5 text-emerald-600 transition group-hover:text-emerald-800" />
                          <span className="text-sm font-medium break-all">View LinkedIn profile</span>
                        </a>
                      ) : null}
                    </div>
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
