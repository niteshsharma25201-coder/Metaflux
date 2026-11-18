import { useState } from 'react';
import { motion } from 'motion/react';
import { WHY_CHOOSE_PILLARS } from '../data/agencyStatic.ts';
import type { TeamMember } from '../types/agency.ts';

interface TeamAndWhySectionProps {
  team: TeamMember[];
}

function TeamAvatar({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false);

  const initials = member.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (imgError || !member.avatarUrl) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-violet-100 via-white to-sky-100">
        <span className="font-display text-3xl font-bold text-violet-700">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={member.avatarUrl}
      alt={`${member.name} — ${member.designation}`}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className="aspect-square w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export function TeamAndWhySection({ team }: TeamAndWhySectionProps) {
  return (
    <>
      {/* OUR TEAM */}
      <section
        id="team"
        className="border-b border-slate-200 bg-gradient-to-b from-violet-50/35 via-slate-50/70 to-white py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-violet-700">
                Leadership &amp; Specialists
              </p>
              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                The Strategists &amp; Creators Behind Your Campaigns
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-slate-500">
              Team names, roles, portraits, and bios are editable directly in
              the agency admin portal.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, idx) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group glass-surface overflow-hidden rounded-xl border border-slate-200 transition-all duration-200 hover:border-violet-300 hover:shadow-lg hover:shadow-sky-100/60"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <TeamAvatar member={member} />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent"
                  />
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold text-violet-700">
                    {member.designation}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-slate-950">
                    {member.name}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {member.bio}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE META FLUX */}
      <section
        id="why-choose"
        className="border-b border-slate-200 bg-white py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-sm font-semibold text-sky-600">
                Why Choose META FLUX
              </p>
              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Built for Accountability, Not Vanity Metrics.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Most agencies separate media buying from creative production.
                META FLUX integrates both inside tight weekly feedback loops so
                every creative decision improves ad performance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:col-span-8">
              {WHY_CHOOSE_PILLARS.map((pillar) => (
                <div key={pillar.number} className="bg-white p-6 sm:p-7">
                  <span className="font-mono text-xs font-semibold text-violet-600 tabular-nums">
                    {pillar.number}.
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
