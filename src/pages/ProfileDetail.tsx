import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Linkedin, Mail, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import { profiles } from '../data/profiles';

export default function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const profile = profiles.find((item) => item.id === profileId);

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
          <Link
            to="/profile"
            className="mt-8 inline-flex rounded-full bg-emerald-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Back to team profiles
          </Link>
        </main>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/profile/${profile.id}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="container mx-auto px-6 py-16 sm:py-24">
        <section className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-10">
          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-semibold">Personal profile</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                A clean individual profile page for every team member with their role, contact details, and unique URL.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-500 bg-white shadow-sm">
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

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="group rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <div className="flex items-center gap-3 text-slate-900">
                    <Mail className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">{profile.email}</span>
                  </div>
                </a>

                <a
                  href={`tel:${profile.phone}`}
                  className="group rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <div className="flex items-center gap-3 text-slate-900">
                    <Phone className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">{profile.phone || 'Phone not provided'}</span>
                  </div>
                </a>

                <div className="group rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50">
                  <div className="flex items-center gap-3 text-slate-900">
                    <Linkedin className="h-5 w-5 text-emerald-600" />
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

              <div className="mt-8 rounded-[20px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-slate-700 sm:px-6">
                <p className="font-medium text-slate-900">Share this profile</p>
                <p className="mt-1 break-all">{shareUrl}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Back to team profiles
                </Link>
                <p className="text-sm text-slate-600">Mobile-friendly personal profile view with no footer.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
