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
  const cls = 'h-5 w-5 text-violet-600';
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
      className="border-b border-slate-200 bg-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-violet-700">
              Capabilities &amp; Services
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Performance Advertising &amp; Social Growth Under One Roof
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
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
              className="group glass-surface flex flex-col justify-between rounded-xl border border-slate-200 p-6 transition-all duration-200 hover:border-violet-300 hover:shadow-lg hover:shadow-sky-100/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-violet-200/80 bg-gradient-to-br from-violet-50 to-sky-50">
                    <ServiceIcon name={service.iconName} />
                  </div>
                  <span className="font-mono text-xs font-medium text-sky-600 tabular-nums">
                    {service.number}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {service.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveService(service)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 transition-colors hover:text-sky-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 rounded-sm"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          onClick={() => setActiveService(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-violet-200 bg-gradient-to-br from-violet-50 to-sky-50">
                  <ServiceIcon name={activeService.iconName} />
                </div>
                <div>
                  <span className="font-mono text-xs font-medium text-sky-600 tabular-nums">
                    Service {activeService.number}
                  </span>
                  <h3
                    id="service-modal-title"
                    className="font-display text-xl font-bold text-slate-950"
                  >
                    {activeService.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveService(null)}
                aria-label="Close service details"
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              {activeService.shortDescription}
            </p>

            <div className="mt-6">
              <h4 className="text-xs font-semibold tracking-wide text-slate-500">
                What&apos;s Included
              </h4>
              <ul className="mt-3 space-y-2.5">
                {activeService.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-violet-200/70 bg-gradient-to-r from-violet-50/70 to-sky-50/70 p-4">
              <p className="text-xs font-semibold text-violet-700">
                Business Outcome
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {activeService.outcome}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
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
