import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Compass,
  Film,
  LayoutGrid,
  Megaphone,
  MessageCircle,
  Scissors,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SERVICES } from '../data/agencyStatic.ts';
import type { ServiceItem } from '../types/agency.ts';

interface ServicesSectionProps {
  onSelectServiceForEnquiry: (serviceTitle: string) => void;
}

function ServiceIcon({ name }: { name: ServiceItem['iconName'] }) {
  const cls = 'h-5 w-5 text-violet-300';
  switch (name) {
    case 'Target':
      return <Target className={cls} />;
    case 'Megaphone':
      return <Megaphone className={cls} />;
    case 'MessageCircle':
      return <MessageCircle className={cls} />;
    case 'LayoutGrid':
      return <LayoutGrid className={cls} />;
    case 'Film':
      return <Film className={cls} />;
    case 'Scissors':
      return <Scissors className={cls} />;
    case 'Sparkles':
      return <Sparkles className={cls} />;
    case 'TrendingUp':
      return <TrendingUp className={cls} />;
    case 'Compass':
      return <Compass className={cls} />;
  }
}

export function ServicesSection({
  onSelectServiceForEnquiry,
}: ServicesSectionProps) {
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  return (
    <section
      id="services"
      className="border-b border-white/10 bg-[#05070E] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-violet-300">
              Capabilities &amp; Services
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Performance Advertising &amp; Social Growth Under One Roof
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Every engagement combines structured Meta media buying with
            platform-native creative production. Click any service to inspect
            deliverables.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, idx) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
              className="group glass-surface flex flex-col justify-between rounded-xl border border-white/10 p-6 transition-colors duration-200 hover:border-violet-400/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-violet-500/10">
                    <ServiceIcon name={service.iconName} />
                  </div>
                  <span className="font-mono text-xs text-slate-500 tabular-nums">
                    {service.number}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                  {service.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveService(service)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition-colors hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-sm"
                >
                  <span>Learn More</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Interactive Service Detail Modal */}
      {activeService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          onClick={() => setActiveService(null)}
        >
          <div
            className="glass-surface w-full max-w-lg rounded-2xl border border-white/15 p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-violet-500/15">
                  <ServiceIcon name={activeService.iconName} />
                </div>
                <div>
                  <span className="font-mono text-xs text-violet-300 tabular-nums">
                    Service {activeService.number}
                  </span>
                  <h3
                    id="service-modal-title"
                    className="font-display text-xl font-bold text-white"
                  >
                    {activeService.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveService(null)}
                aria-label="Close service details"
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-300">
              {activeService.shortDescription}
            </p>

            <div className="mt-6">
              <h4 className="text-xs font-semibold tracking-wide text-slate-400">
                What&apos;s Included
              </h4>
              <ul className="mt-3 space-y-2.5">
                {activeService.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-slate-200"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium text-violet-300">
                Business Outcome
              </p>
              <p className="mt-1 text-sm text-slate-200">
                {activeService.outcome}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const title = activeService.title;
                  setActiveService(null);
                  onSelectServiceForEnquiry(title);
                }}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white accent-gradient-btn cursor-pointer"
              >
                Enquire About This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
