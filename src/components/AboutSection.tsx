import { useState } from 'react';
import { motion } from 'motion/react';

const PILLARS = [
  {
    number: '01',
    title: 'Our Mission',
    description:
      'To turn advertising spend into predictable, measurable business growth by combining sharp Meta media buying with high-converting creative storytelling.',
  },
  {
    number: '02',
    title: 'Our Vision',
    description:
      'To be the most trusted performance and social growth partner for modern businesses seeking clarity, creative differentiation, and sustainable customer acquisition.',
  },
  {
    number: '03',
    title: 'Our Approach',
    description:
      'Strategy before spend. We audit your offer, craft platform-native Reels and static creatives, test methodically, and scale only what converts profitably.',
  },
];

export function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="about"
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50/90 to-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5"
          >
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg shadow-slate-200/50">
              {!imgError ? (
                <img
                  src="/src/assets/images/about_creative_direction_1794976621133.jpg"
                  alt="META FLUX strategy and creative direction team"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-gradient-to-br from-violet-100 to-sky-100 p-8 text-center">
                  <span className="font-display text-xl font-semibold text-slate-900">
                    META FLUX Strategy Room
                  </span>
                  <span className="mt-2 text-sm text-slate-600">
                    Creative Direction &amp; Performance Planning
                  </span>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-medium text-sky-300">
                  About META FLUX
                </p>
                <p className="mt-1 text-sm text-slate-100">
                  Built for brands that demand creative craft and accountable ROI.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Narrative + Mission / Vision / Approach */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-sm font-semibold text-violet-700">
              Your Growth. Our Strategy. Measurable Results.
            </p>
            <h2
              className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Creative Minds. Strategic Marketing. Real Business Growth.
            </h2>

            <p className="mt-5 text-base leading-relaxed text-slate-600">
              META FLUX helps ambitious businesses attract qualified customers,
              capture consistent sales leads, and build unmistakable visibility
              across Facebook and Instagram. Instead of running disconnected
              boosts or generic templates, we align audience architecture,
              persuasive ad creative, and conversion tracking into one cohesive
              growth system.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-slate-200 pt-8 sm:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div key={pillar.number} className="space-y-2.5">
                  <span className="font-mono text-xs font-semibold text-sky-600 tabular-nums">
                    {pillar.number}.
                  </span>
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
