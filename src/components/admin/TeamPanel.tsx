import React, { useMemo, useState } from 'react';
import { profiles } from '../../data/profiles';
import {
  Search,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  CalendarDays,
  User,
  Users
} from 'lucide-react';

const TeamPanel: React.FC = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) => {
      const fullName = `${p.firstName} ${p.middleName ?? ''} ${p.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.personalEmail ?? '').toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5 text-green-600" />
            Team Directory
          </h2>
          <p className="text-sm text-gray-500">
            {profiles.length} team members · combined details from profile, team form &amp; profile card submissions
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, role or email…"
            className="w-full rounded-full border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          No team members match “{query}”.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={member.profileImage}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-green-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = 'hidden';
                  }}
                />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {member.firstName} {member.middleName ? `${member.middleName} ` : ''}
                    {member.lastName}
                  </h3>
                  <span className="mt-1 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    {member.role}
                  </span>
                </div>
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <Detail icon={<Mail className="h-4 w-4" />} label="Email" value={member.email} />
                {member.personalEmail && (
                  <Detail icon={<Mail className="h-4 w-4" />} label="Personal Email" value={member.personalEmail} />
                )}
                <Detail icon={<Phone className="h-4 w-4" />} label="Phone" value={member.phone} />
                {member.dateOfBirth && (
                  <Detail icon={<CalendarDays className="h-4 w-4" />} label="Date of Birth" value={member.dateOfBirth} />
                )}
                {member.courseOfStudy && (
                  <Detail icon={<GraduationCap className="h-4 w-4" />} label="Course" value={member.courseOfStudy} />
                )}
                {member.institution && (
                  <Detail icon={<GraduationCap className="h-4 w-4" />} label="Institution" value={member.institution} />
                )}
                {member.linkedIn && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="mt-0.5 text-green-600">
                      <Linkedin className="h-4 w-4" />
                    </span>
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-green-700 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </dl>

              <div className="mt-4 border-t border-gray-100 pt-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <User className="h-3.5 w-3.5" />
                  About
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface DetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const Detail: React.FC<DetailProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 text-gray-600">
    <span className="mt-0.5 text-green-600">{icon}</span>
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="break-words text-gray-700">{value}</dd>
    </div>
  </div>
);

export default TeamPanel;
