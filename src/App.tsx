import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { PortfolioSection } from './components/PortfolioSection.tsx';
import { CaseStudiesSection } from './components/CaseStudiesSection.tsx';
import { TeamAndWhySection } from './components/TeamAndWhySection.tsx';
import { TestimonialsAndPricingSection } from './components/TestimonialsAndPricingSection.tsx';
import { ContactAndFooterSection } from './components/ContactAndFooterSection.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import type {
  CaseStudy,
  PortfolioProject,
  PricingPlan,
  TeamMember,
} from './types/agency.ts';

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  const [preselectedService, setPreselectedService] = useState('');

  const fetchAgencyData = useCallback(async () => {
    try {
      setLoadError(null);
      const response = await fetch('/api/agency-data');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load agency content.');
      }
      setPortfolio(data.portfolio || []);
      setPricing(data.pricing || []);
      setTeam(data.team || []);
      setCaseStudies(data.caseStudies || []);
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err.message
          : 'Unable to load agency portfolio data.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgencyData();
  }, [fetchAgencyData]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectForContact = (label: string) => {
    setPreselectedService(label);
    scrollToSection('contact');
  };

  if (adminOpen) {
    return (
      <AdminDashboard
        portfolio={portfolio}
        pricing={pricing}
        team={team}
        caseStudies={caseStudies}
        onRefreshAgencyData={fetchAgencyData}
        onCloseAdmin={() => setAdminOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenConsultation={() => scrollToSection('contact')} />

      {loadError && (
        <div
          role="alert"
          className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-center text-xs text-rose-700"
        >
          {loadError}{' '}
          <button
            type="button"
            onClick={fetchAgencyData}
            className="ml-2 underline font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <main>
        <HeroSection
          onGetConsultation={() => scrollToSection('contact')}
          onExploreWork={() => scrollToSection('portfolio')}
        />

        <AboutSection />

        <ServicesSection onSelectServiceForEnquiry={handleSelectForContact} />

        <PortfolioSection
          projects={portfolio}
          loading={loading}
          onOpenAdmin={() => setAdminOpen(true)}
        />

        <CaseStudiesSection caseStudies={caseStudies} />

        <TeamAndWhySection team={team} />

        <TestimonialsAndPricingSection
          pricingPlans={pricing}
          onSelectPlan={handleSelectForContact}
        />
      </main>

      <ContactAndFooterSection
        preselectedService={preselectedService}
        onOpenAdmin={() => setAdminOpen(true)}
      />
    </div>
  );
}
