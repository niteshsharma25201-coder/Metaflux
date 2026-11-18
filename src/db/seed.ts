import { count } from 'drizzle-orm';
import { db } from './index.ts';
import {
  caseStudies,
  portfolioProjects,
  pricingPlans,
  teamMembers,
} from './schema.ts';

let seeded = false;

export async function ensureSeedData(): Promise<void> {
  if (seeded) return;

  try {
    const [{ value: portfolioCount }] = await db
      .select({ value: count() })
      .from(portfolioProjects);

    if (portfolioCount === 0) {
      await db.insert(portfolioProjects).values([
        {
          title: 'Kairos Audio — D2C Meta Conversion Funnel',
          category: 'Meta Ads Campaigns',
          description:
            'Full-funnel Facebook & Instagram conversion architecture pairing dynamic catalog retargeting with high-contrast studio product reels.',
          mediaUrl: '/src/assets/images/portfolio_meta_ads_1794976621146.jpg',
          mediaType: 'image',
          clientLabel: 'Sample D2C Tech Brand',
          metricSummary: 'Sample Work · 3.8x Target ROAS Framework',
          isDemo: true,
          sortOrder: 1,
        },
        {
          title: 'Aurora Botanicals — Visual Identity & Carousel Ads',
          category: 'Brand Campaigns',
          description:
            'Editorial product photography and multi-frame Story/Feed creatives designed to lower thumb-stop ratio and elevate perceived brand value.',
          mediaUrl:
            '/src/assets/images/portfolio_brand_campaign_1794976621525.jpg',
          mediaType: 'image',
          clientLabel: 'Sample Skincare Label',
          metricSummary: 'Sample Work · Brand Awareness & Retargeting',
          isDemo: true,
          sortOrder: 2,
        },
        {
          title: 'Veloce EV — Commercial Motion & Reel Suite',
          category: 'Promotional Videos',
          description:
            'High-energy 9:16 vertical Reels and 16:9 launch film cut into 3 hook variations for systematic creative testing on Meta.',
          mediaUrl:
            '/src/assets/images/portfolio_video_production_1794976622752.jpg',
          mediaType: 'image',
          clientLabel: 'Sample Mobility Launch',
          metricSummary: 'Sample Work · 42% 3-Second Hook Hold',
          isDemo: true,
          sortOrder: 3,
        },
        {
          title: 'Solstice Estates — WhatsApp & Instant Form Lead Engine',
          category: 'Lead Generation Projects',
          description:
            'Geo-targeted luxury property lead generation campaign routing pre-qualified inquiries directly into automated WhatsApp concierge follow-ups.',
          mediaUrl: '/src/assets/images/portfolio_lead_gen_1794976622637.jpg',
          mediaType: 'image',
          clientLabel: 'Sample Real Estate Group',
          metricSummary: 'Sample Work · Qualified Buyer Funnel',
          isDemo: true,
          sortOrder: 4,
        },
        {
          title: 'Obsidian Tech — Social Grid & Creative Direction',
          category: 'Social Media Creatives',
          description:
            'Cohesive dark-mode Instagram feed system, typography templates, and carousel storytelling engineered for organic authority.',
          mediaUrl:
            '/src/assets/images/about_creative_direction_1794976621133.jpg',
          mediaType: 'image',
          clientLabel: 'Sample SaaS & Hardware',
          metricSummary: 'Sample Work · Monthly Content System',
          isDemo: true,
          sortOrder: 5,
        },
        {
          title: 'Studio Kinetic — 15s Hook-First Reels Pack',
          category: 'Instagram Reels',
          description:
            'Fast-paced vertical editing with kinetic captions, sound design, and native-feeling UGC hooks built for organic reach and paid amplification.',
          mediaUrl: '/src/assets/images/hero_agency_studio_1794976621038.jpg',
          mediaType: 'image',
          clientLabel: 'Sample Creative Brand',
          metricSummary: 'Sample Work · Vertical Reel Framework',
          isDemo: true,
          sortOrder: 6,
        },
      ]);
    }

    const [{ value: plansCount }] = await db
      .select({ value: count() })
      .from(pricingPlans);

    if (plansCount === 0) {
      await db.insert(pricingPlans).values([
        {
          slug: 'starter',
          name: 'STARTER',
          tagline:
            'Foundational social presence and structured ad launch for emerging businesses.',
          priceDisplay: 'Custom Quote',
          billingNote: 'Ad budget is separate from agency management fees',
          featuresJson: JSON.stringify([
            'Social Media Strategy',
            'Basic Ad Campaign Setup',
            'Creative Consultation',
            'Monthly Performance Report',
          ]),
          isFeatured: false,
          sortOrder: 1,
        },
        {
          slug: 'growth',
          name: 'GROWTH',
          tagline:
            'Consistent lead generation, active campaign optimization, and ad creative support.',
          priceDisplay: 'Custom Quote',
          billingNote: 'Ad budget is separate from agency management fees',
          featuresJson: JSON.stringify([
            'Facebook & Instagram Ads',
            'Lead Generation Campaigns',
            'Ad Creative Support',
            'Campaign Optimization',
            'Monthly Reporting',
          ]),
          isFeatured: true,
          sortOrder: 2,
        },
        {
          slug: 'premium',
          name: 'PREMIUM',
          tagline:
            'End-to-end growth partner with multi-campaign scaling and dedicated creative production.',
          priceDisplay: 'Custom Quote',
          billingNote: 'Ad budget is separate from agency management fees',
          featuresJson: JSON.stringify([
            'Complete Social Media Management',
            'Multiple Meta Ad Campaigns',
            'Advanced Lead Generation',
            'Creative & Reel Production',
            'Dedicated Account Manager',
            'Performance Reports',
          ]),
          isFeatured: false,
          sortOrder: 3,
        },
      ]);
    }

    const [{ value: teamCount }] = await db
      .select({ value: count() })
      .from(teamMembers);

    if (teamCount === 0) {
      await db.insert(teamMembers).values([
        {
          name: 'Aarav Mehta',
          designation: 'Founder & CEO',
          bio: 'Leads agency growth architecture, client partnerships, and full-funnel Meta Ads scaling systems for ambitious brands.',
          avatarUrl: '/src/assets/images/team_founder_portrait_1794976623177.jpg',
          sortOrder: 1,
          isDemo: true,
        },
        {
          name: 'Neha Kapoor',
          designation: 'Meta Ads Specialist',
          bio: 'Specializes in CBO/ABO campaign structuring, pixel & CAPI attribution, and aggressive CPL optimization across Meta placements.',
          avatarUrl:
            '/src/assets/images/team_strategist_portrait_1794976623549.jpg',
          sortOrder: 2,
          isDemo: true,
        },
        {
          name: 'Rohan Verma',
          designation: 'Social Media Manager',
          bio: 'Crafts editorial content calendars, community engagement workflows, and brand voice consistency across Instagram and Facebook.',
          avatarUrl:
            '/src/assets/images/team_creative_portrait_1794976624646.jpg',
          sortOrder: 3,
          isDemo: true,
        },
        {
          name: 'Ananya Rao',
          designation: 'Creative Designer',
          bio: 'Designs high-converting static ad creatives, carousel storytelling systems, and cohesive brand visual languages.',
          avatarUrl:
            '/src/assets/images/team_strategist_portrait_1794976623549.jpg',
          sortOrder: 4,
          isDemo: true,
        },
        {
          name: 'Kabir Nair',
          designation: 'Video Editor',
          bio: 'Produces scroll-stopping Instagram Reels, motion graphics, and hook-driven video ad variations tested for retention.',
          avatarUrl:
            '/src/assets/images/team_creative_portrait_1794976624646.jpg',
          sortOrder: 5,
          isDemo: true,
        },
        {
          name: 'Devansh Joshi',
          designation: 'Performance Marketing Executive',
          bio: 'Monitors daily ad pacing, executes A/B split experiments, and compiles transparent weekly ROI and lead quality reports.',
          avatarUrl: '/src/assets/images/team_founder_portrait_1794976623177.jpg',
          sortOrder: 6,
          isDemo: true,
        },
      ]);
    }

    const [{ value: caseCount }] = await db
      .select({ value: count() })
      .from(caseStudies);

    if (caseCount === 0) {
      await db.insert(caseStudies).values([
        {
          clientName: 'Solstice Luxury Realty (Demo)',
          industry: 'Real Estate & Architecture',
          objective: 'High-Intent Buyer Lead Generation via WhatsApp & Instant Forms',
          strategy:
            'Paired twilight property walkthrough Reels with qualifying lead forms and instant WhatsApp routing for site-visit bookings.',
          duration: '90 Days',
          adBudget: '$4,500 (Demo)',
          leadsGenerated: 312,
          costPerLead: '$14.42',
          resultsSummary:
            'Illustrative demonstration: 312 qualified property inquiries with 41% cost-per-lead reduction from Month 1 to Month 3.',
          monthlyTrendJson: JSON.stringify([
            { label: 'Month 1', leads: 74, cpl: 20.2 },
            { label: 'Month 2', leads: 106, cpl: 14.1 },
            { label: 'Month 3', leads: 132, cpl: 11.8 },
          ]),
          isDemo: true,
          sortOrder: 1,
        },
        {
          clientName: 'Aurora Clinical Aesthetics (Demo)',
          industry: 'Healthcare & Wellness',
          objective: 'Appointment Bookings via Instagram & Click-to-WhatsApp Ads',
          strategy:
            'Doctor-led trust Reels combined with hyper-local 10km radius retargeting and frictionless WhatsApp consultation scheduling.',
          duration: '60 Days',
          adBudget: '$2,800 (Demo)',
          leadsGenerated: 428,
          costPerLead: '$6.54',
          resultsSummary:
            'Illustrative demonstration: 428 consultation inquiries in 60 days through iterative creative hook testing every 14 days.',
          monthlyTrendJson: JSON.stringify([
            { label: 'Week 1-2', leads: 68, cpl: 9.8 },
            { label: 'Week 3-4', leads: 96, cpl: 7.4 },
            { label: 'Week 5-6', leads: 124, cpl: 5.9 },
            { label: 'Week 7-8', leads: 140, cpl: 5.1 },
          ]),
          isDemo: true,
          sortOrder: 2,
        },
        {
          clientName: 'Kairos Consumer Tech (Demo)',
          industry: 'D2C Electronics & Lifestyle',
          objective: 'Scale Meta Purchase Conversions & Lower Acquisition Cost',
          strategy:
            'Consolidated Advantage+ Shopping campaigns with 12 modular UGC and studio product ad variations refreshed bi-weekly.',
          duration: '90 Days',
          adBudget: '$8,200 (Demo)',
          leadsGenerated: 690,
          costPerLead: '$11.88',
          resultsSummary:
            'Illustrative demonstration: 690 direct purchase & wholesale leads with steadily improving conversion velocity across Q1.',
          monthlyTrendJson: JSON.stringify([
            { label: 'Month 1', leads: 165, cpl: 15.6 },
            { label: 'Month 2', leads: 235, cpl: 11.4 },
            { label: 'Month 3', leads: 290, cpl: 9.5 },
          ]),
          isDemo: true,
          sortOrder: 3,
        },
      ]);
    }

    seeded = true;
  } catch (error) {
    console.error('Failed to ensure seed data:', error);
    throw new Error('Failed to initialize agency data.', { cause: error });
  }
}
