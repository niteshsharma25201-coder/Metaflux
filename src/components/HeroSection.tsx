import { useState } from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onGetConsultation: () => void;
  onExploreWork: () => void;
}

const FOCUS_STRIP = [
  {
    index: '01',
    title: 'Meta Ads Architecture',
    detail: 'Facebook & Instagram conversion funnels built for measurable ROAS.',
  },
  {
    index: '02',
    title: 'Creative Reels Studio',
    detail: 'Hook-first vertical video & ad creatives engineered for thumb-stop.',
  },
  {
    index: '03',
    title: 'WhatsApp Lead Funnels',
    detail: 'High-intent Click-to-WhatsApp flows that accelerate sales replies.',
  },
  {
    index: '04',
    title: 'Transparent Attribution',
    detail: 'Pixel, CAPI & clear monthly reporting tied to qualified leads.',
  },
];

export function HeroSection({
  onGetConsultation,
  onExploreWork,
}: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-white/10 bg-[#05070E]"
    >
      {/* Subtle Animated Ambient Background Glow (transform/opacity only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{ opacity: [0.32, 0.48, 0.32], scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.25, 0.4, 0.25], scale: [1.04, 0.98, 1.04] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 right-1/6 h-[460px] w-[460px] rounded-full bg-blue-600/20 blur-[120px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-16 sm:px-6 lg:px-8 lg:pt-20 lg:pb-20">
        {/* 2-Column Split Grid with Balanced Height */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <p className="text-sm font-medium tracking-wide text-violet-300">
              We Turn Attention Into Growth
            </p>

            <h1
              className="mt-4 font-display font-bold tracking-tight text-white"
              style={{
                fontSize: 'clamp(2.25rem, 4.4vw, 3.85rem)',
                lineHeight: 1.08,
                textWrap: 'balance',
              }}
            >
              Scale Your Brand.{' '}
              <span className="accent-gradient-text">Amplify Your Growth.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              We help businesses grow through strategic Meta Ads, creative social
              media marketing and performance-driven digital campaigns.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onGetConsultation}
                className="inline-flex items-center gap-2.5 rounded-lg px-6 py-3.5 text-sm font-semibold text-white accent-gradient-btn shadow-xl shadow-violet-950/50 transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <span>Get Free Consultation</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onExploreWork}
                className="inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 transition-colors duration-150 hover:border-violet-400/50 hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <PlayCircle className="h-4 w-4 text-violet-300" />
                <span>Explore Our Work</span>
              </button>
            </div>

            <p className="mt-8 text-xs text-slate-400">
              Your Growth. Our Strategy. Measurable Results. · Facebook Ads ·
              Instagram Reels · Lead Generation
            </p>
          </motion.div>

          {/* Right High-Impact Visual */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative h-full min-h-[320px] sm:min-h-[400px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B1020]">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_agency_studio_1794976621038.jpg"
                  alt="META FLUX digital marketing and creative production studio"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#131936] to-[#080B14] p-8 text-center">
                  <span className="font-display text-2xl font-bold text-white">
                    META FLUX Studio
                  </span>
                  <span className="mt-2 text-sm text-slate-400">
                    Creative Production &amp; Performance Media Buying
                  </span>
                </div>
              )}

              {/* Measured Scrim for 4.5:1+ contrast */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070E]/90 via-[#05070E]/20 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="text-xs font-medium text-violet-300">
                  Performance Creative &amp; Media Buying
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-white">
                  Full-Funnel Meta Advertising Under One Roof
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Agency Focus Strip Below Split */}
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS_STRIP.map((item) => (
            <div key={item.index} className="bg-[#080C18] p-6">
              <div className="font-mono text-xs text-violet-300 tabular-nums">
                {item.index}.
              </div>
              <h2 className="mt-2 font-display text-base font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
