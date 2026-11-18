import { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { DEMO_TESTIMONIALS } from '../data/agencyStatic.ts';
import type { PricingPlan } from '../types/agency.ts';

interface TestimonialsAndPricingProps {
  pricingPlans: PricingPlan[];
  onSelectPlan: (planName: string) => void;
}

export function TestimonialsAndPricingSection({
  pricingPlans,
  onSelectPlan,
}: TestimonialsAndPricingProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [avatarErrors, setAvatarErrors] = useState<Record<number, boolean>>({});

  const currentTestimonial = DEMO_TESTIMONIALS[activeSlide];

  const handlePrev = () => {
    setActiveSlide((prev) =>
      prev === 0 ? DEMO_TESTIMONIALS.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveSlide((prev) =>
      prev === DEMO_TESTIMONIALS.length - 1 ? 0 : prev + 1,
    );
  };

  const parseFeatures = (json: string): string[] => {
    try {
      const arr = JSON.parse(json);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  return (
    <>
      {/* CLIENT TESTIMONIALS CAROUSEL */}
      <section
        id="testimonials"
        className="border-b border-slate-200 bg-gradient-to-b from-sky-50/45 via-slate-50/70 to-white py-20 lg:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-violet-700">
                Client Feedback
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Client Testimonials
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-10 glass-surface rounded-2xl border border-slate-200 p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex items-center gap-1"
                aria-label={`${currentTestimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: currentTestimonial.rating }).map(
                  (_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ),
                )}
              </div>
              <span className="text-xs font-medium text-slate-500">
                Demo Content · Placeholder Client Review
              </span>
            </div>

            <blockquote className="mt-6 text-lg leading-relaxed text-slate-800 sm:text-xl">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-4">
                {!avatarErrors[currentTestimonial.id] ? (
                  <img
                    src={currentTestimonial.avatarUrl}
                    alt={currentTestimonial.clientName}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setAvatarErrors((prev) => ({
                        ...prev,
                        [currentTestimonial.id]: true,
                      }))
                    }
                    className="h-12 w-12 rounded-full object-cover object-top border border-slate-200"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-200 bg-violet-100 font-display text-sm font-bold text-violet-700">
                    {currentTestimonial.clientName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                )}

                <div>
                  <p className="font-display text-base font-semibold text-slate-950">
                    {currentTestimonial.clientName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentTestimonial.role} · {currentTestimonial.businessName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {DEMO_TESTIMONIALS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`View testimonial ${idx + 1}`}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeSlide
                        ? 'w-7 bg-gradient-to-r from-violet-600 to-sky-500'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section
        id="pricing"
        className="border-b border-slate-200 bg-white py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-violet-700">
              Engagement Packages
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Flexible Retainer Plans Tailored to Your Growth Stage
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Advertising budget is paid directly to Meta and is separate from
              agency management fees. Retainer pricing can be customized in the
              agency admin portal.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
            {pricingPlans.map((plan) => {
              const features = parseFeatures(plan.featuresJson);
              return (
                <article
                  key={plan.id}
                  className={`flex flex-col justify-between rounded-2xl border p-7 sm:p-8 ${
                    plan.isFeatured
                      ? 'border-violet-400 bg-gradient-to-b from-violet-50/75 via-white to-sky-50/60 shadow-xl shadow-violet-200/45'
                      : 'glass-surface border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-xl font-bold tracking-wide text-slate-950">
                        {plan.name}
                      </h3>
                      {plan.isFeatured && (
                        <span className="text-xs font-semibold text-violet-700">
                          Most Popular
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {plan.tagline}
                    </p>

                    <div className="mt-6 border-y border-slate-200 py-5">
                      <p className="font-display text-2xl font-bold text-slate-950 font-mono tabular-nums">
                        {plan.priceDisplay}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {plan.billingNote}
                      </p>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm text-slate-700"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(`${plan.name} Package`)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer ${
                        plan.isFeatured
                          ? 'accent-gradient-btn text-white shadow-lg shadow-violet-500/25'
                          : 'border border-slate-200 bg-slate-50 text-slate-900 hover:border-violet-300 hover:bg-violet-50/60'
                      }`}
                    >
                      <span>Get Custom Quote</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Important: Meta advertising spend is billed directly to your ad
            account and is separate from META FLUX agency management fees.
          </p>
        </div>
      </section>
    </>
  );
}
