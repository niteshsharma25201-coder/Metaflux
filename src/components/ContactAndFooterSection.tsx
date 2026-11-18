import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  CheckCircle2,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from 'lucide-react';
import {
  AGENCY_EMAIL,
  AGENCY_PHONE,
  AGENCY_WHATSAPP_NUMBER,
  BUDGET_OPTIONS,
  SERVICES,
} from '../data/agencyStatic.ts';

interface ContactAndFooterProps {
  preselectedService: string;
  onOpenAdmin: () => void;
}

const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => s.title),
  'STARTER Package',
  'GROWTH Package',
  'PREMIUM Package',
];

export function ContactAndFooterSection({
  preselectedService,
  onOpenAdmin,
}: ContactAndFooterProps) {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceRequired, setServiceRequired] = useState(
    'Meta Ads Campaign Management',
  );
  const [monthlyBudget, setMonthlyBudget] = useState(BUDGET_OPTIONS[1]);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    businessName: string;
    serviceRequired: string;
    monthlyBudget: string;
  } | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setServiceRequired(preselectedService);
    }
  }, [preselectedService]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (
      !name.trim() ||
      !businessName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      setErrorMsg('Please complete all required fields before submitting.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid business or personal email address.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          businessName: businessName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          serviceRequired,
          monthlyBudget,
          message: message.trim(),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Could not submit your enquiry.');
      }

      setSubmittedData({
        name: name.trim(),
        businessName: businessName.trim(),
        serviceRequired,
        monthlyBudget,
      });
      setName('');
      setBusinessName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Unable to submit enquiry right now.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const buildWhatsAppHref = (customText?: string) => {
    const text =
      customText ||
      `Hi META FLUX, I would like to discuss a growth consultation for my business.`;
    return `https://wa.me/${AGENCY_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="border-b border-white/10 bg-[#070A13] py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Direct Contact Info */}
            <div className="lg:col-span-5">
              <p className="text-sm font-medium text-violet-300">
                Start a Conversation
              </p>
              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Ready to Grow Your Business?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Share your goals, current ad channels, and target monthly
                budget. We will review your funnel and respond with a tailored
                consultation plan.
              </p>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-8">
                <div className="flex items-center gap-3.5 text-sm text-slate-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-violet-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email Us</p>
                    <a
                      href={`mailto:${AGENCY_EMAIL}`}
                      className="font-medium hover:text-violet-300 transition-colors"
                    >
                      {AGENCY_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-sm text-slate-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-blue-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Call Strategy Desk</p>
                    <a
                      href={`tel:${AGENCY_PHONE.replace(/\s+/g, '')}`}
                      className="font-mono font-medium hover:text-blue-300 transition-colors tabular-nums"
                    >
                      {AGENCY_PHONE}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 glass-surface rounded-xl border border-white/10 p-6">
                <p className="font-display text-base font-semibold text-white">
                  Prefer Instant WhatsApp Chat?
                </p>
                <p className="mt-1.5 text-sm text-slate-400">
                  Message our strategy team directly on WhatsApp for quick
                  discovery questions or campaign audits.
                </p>
                <a
                  href={buildWhatsAppHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/25"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7">
              <div className="glass-surface rounded-2xl border border-white/10 p-6 sm:p-8">
                {submittedData ? (
                  <div className="py-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-300">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold text-white">
                      Consultation Request Received
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      Thank you,{' '}
                      <span className="font-semibold text-white">
                        {submittedData.name}
                      </span>
                      . Your enquiry for{' '}
                      <span className="font-semibold text-white">
                        {submittedData.businessName}
                      </span>{' '}
                      ({submittedData.serviceRequired}) has been saved securely.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a
                        href={buildWhatsAppHref(
                          `Hi META FLUX, I just submitted a consultation request for ${submittedData.businessName} (${submittedData.serviceRequired}, Budget: ${submittedData.monthlyBudget}).`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/35 bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/30"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Continue on WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setSubmittedData(null)}
                        className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-white/10 cursor-pointer"
                      >
                        Send Another Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {errorMsg && (
                      <div
                        role="alert"
                        className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                      >
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-medium text-slate-300"
                        >
                          Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#050811] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-business"
                          className="block text-xs font-medium text-slate-300"
                        >
                          Business Name *
                        </label>
                        <input
                          id="contact-business"
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Company or brand name"
                          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#050811] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-xs font-medium text-slate-300"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#050811] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-medium text-slate-300"
                        >
                          Email *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#050811] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-service"
                          className="block text-xs font-medium text-slate-300"
                        >
                          Service Required *
                        </label>
                        <select
                          id="contact-service"
                          value={serviceRequired}
                          onChange={(e) => setServiceRequired(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#050811] px-4 py-2.5 text-sm text-white focus:border-violet-400 focus:outline-none"
                        >
                          {SERVICE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-budget"
                          className="block text-xs font-medium text-slate-300"
                        >
                          Monthly Advertising Budget *
                        </label>
                        <select
                          id="contact-budget"
                          value={monthlyBudget}
                          onChange={(e) => setMonthlyBudget(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#050811] px-4 py-2.5 text-sm text-white focus:border-violet-400 focus:outline-none"
                        >
                          {BUDGET_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your business, offer, and target lead/sales goals..."
                        className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#050811] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white accent-gradient-btn shadow-lg shadow-violet-950/50 transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        <span>
                          {submitting
                            ? 'Submitting Enquiry...'
                            : 'Get Free Consultation'}
                        </span>
                      </button>

                      <span className="text-xs text-slate-400">
                        Response within 1 business day
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#04060C] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <a
                href="#home"
                className="font-display text-xl font-bold tracking-tight text-white"
              >
                META FLUX
              </a>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                We Turn Attention Into Growth. Strategic Meta Ads, creative
                social media marketing, and high-converting lead generation
                systems for ambitious businesses.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="META FLUX on Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/50 hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="META FLUX on Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/50 hover:text-white transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="META FLUX on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/50 hover:text-white transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={buildWhatsAppHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="META FLUX on WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="md:col-span-2">
              <h3 className="font-display text-sm font-semibold text-white">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#portfolio"
                    className="hover:text-white transition-colors"
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="#case-studies"
                    className="hover:text-white transition-colors"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#team" className="hover:text-white transition-colors">
                    Our Team
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing Plans
                  </a>
                </li>
              </ul>
            </div>

            {/* Services Links */}
            <div className="md:col-span-3">
              <h3 className="font-display text-sm font-semibold text-white">
                Services
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                {SERVICES.slice(0, 6).map((service) => (
                  <li key={service.id}>
                    <a
                      href="#services"
                      className="hover:text-white transition-colors"
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Admin */}
            <div className="md:col-span-3">
              <h3 className="font-display text-sm font-semibold text-white">
                Contact
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>{AGENCY_EMAIL}</li>
                <li className="font-mono tabular-nums">{AGENCY_PHONE}</li>
                <li>
                  <a
                    href={buildWhatsAppHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    WhatsApp Consultation
                  </a>
                </li>
              </ul>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-violet-400/50 hover:text-white transition-colors cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-violet-300" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} META FLUX. All rights reserved.</p>
            <p>Your Growth. Our Strategy. Measurable Results.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
