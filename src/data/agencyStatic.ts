import type {
  PortfolioCategory,
  ServiceItem,
  TestimonialItem,
} from '../types/agency.ts';

export const AGENCY_WHATSAPP_NUMBER = '919876543210';
export const AGENCY_EMAIL = 'hello@metaflux.agency';
export const AGENCY_PHONE = '+91 98765 43210';

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  'All',
  'Meta Ads Campaigns',
  'Social Media Creatives',
  'Instagram Reels',
  'Promotional Videos',
  'Brand Campaigns',
  'Lead Generation Projects',
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'meta-ads-management',
    number: '01',
    title: 'Meta Ads Campaign Management',
    shortDescription:
      'End-to-end campaign architecture, audience testing, pixel/CAPI tracking, and daily bid optimization built for predictable scaling.',
    iconName: 'Target',
    deliverables: [
      'Full-funnel CBO & ABO campaign structuring',
      'Meta Pixel & Conversions API event verification',
      'Weekly creative & audience split testing',
      'Transparent CPL, CPA, and ROAS reporting',
    ],
    outcome: 'Turns ad spend into measurable pipeline and lower customer acquisition costs.',
  },
  {
    id: 'facebook-instagram-ads',
    number: '02',
    title: 'Facebook & Instagram Advertising',
    shortDescription:
      'Placement-tailored feed, Story, and Reels ad campaigns engineered to capture buyer attention across the entire Meta ecosystem.',
    iconName: 'Megaphone',
    deliverables: [
      'Feed, Story, and Reels format adaptation',
      'Lookalike & retargeting audience layering',
      'Direct-response ad copywriting variations',
      'Frequency and creative fatigue monitoring',
    ],
    outcome: 'Reaches high-intent buyers wherever they scroll with native creative fit.',
  },
  {
    id: 'whatsapp-lead-generation',
    number: '03',
    title: 'WhatsApp Lead Generation',
    shortDescription:
      'Click-to-WhatsApp ad funnels with pre-qualifying prompts that route warm prospects directly into your sales team inbox.',
    iconName: 'MessageCircle',
    deliverables: [
      'Click-to-WhatsApp Meta ad setup & routing',
      'Automated greeting & lead qualification flows',
      'High-intent inquiry capture scripts',
      'Speed-to-lead conversion optimization',
    ],
    outcome: 'Reduces friction between ad click and live sales conversations.',
  },
  {
    id: 'social-media-management',
    number: '04',
    title: 'Social Media Management',
    shortDescription:
      'Consistent brand presence across Instagram and Facebook with structured content calendars, grid design, and community engagement.',
    iconName: 'LayoutGrid',
    deliverables: [
      'Monthly content calendar & publishing workflow',
      'Cohesive visual grid & caption copywriting',
      'Hashtag & organic discovery positioning',
      'Monthly audience growth & engagement audit',
    ],
    outcome: 'Builds lasting brand credibility that amplifies paid campaign trust.',
  },
  {
    id: 'instagram-reels-content',
    number: '05',
    title: 'Instagram Reels & Content Creation',
    shortDescription:
      'Hook-first vertical storytelling, scripted talking-head formats, and trend-aligned Reels crafted for organic reach and paid conversion.',
    iconName: 'Film',
    deliverables: [
      '3-second visual & verbal hook scripting',
      'Shot lists and creator/founder direction',
      'Vertical 9:16 production & pacing optimization',
      'Retention-focused caption & audio layering',
    ],
    outcome: 'Captures organic attention and feeds winning creatives into Meta Ads.',
  },
  {
    id: 'video-editing-creatives',
    number: '06',
    title: 'Video Editing & Ad Creatives',
    shortDescription:
      'Performance-oriented video editing, kinetic typography, and modular static ad packs built specifically for rapid ad testing.',
    iconName: 'Scissors',
    deliverables: [
      'Multi-hook video variations per raw shoot',
      'High-contrast static & carousel ad designs',
      'Motion graphics, subtitles, and sound design',
      'Platform-safe zones for Reels and Stories',
    ],
    outcome: 'Eliminates creative bottlenecks with ad assets designed to convert.',
  },
  {
    id: 'brand-awareness-campaigns',
    number: '07',
    title: 'Brand Awareness Campaigns',
    shortDescription:
      'Strategic reach and video-view campaigns that establish regional and category authority before retargeting prospects to convert.',
    iconName: 'Sparkles',
    deliverables: [
      'Reach & ThruPlay video campaign orchestration',
      'Warm engagement custom audience building',
      'Brand recall messaging sequence',
      'Cross-placement visual consistency',
    ],
    outcome: 'Grows a warm, high-trust audience pool ready for direct offers.',
  },
  {
    id: 'lead-generation-strategy',
    number: '08',
    title: 'Lead Generation Strategy',
    shortDescription:
      'High-converting Meta Instant Forms, landing page funnels, and lead scoring workflows designed for service and B2B brands.',
    iconName: 'TrendingUp',
    deliverables: [
      'Offer positioning & lead magnet structuring',
      'High-intent Meta Instant Form configuration',
      'Landing page conversion architecture audit',
      'CRM / WhatsApp lead delivery integration',
    ],
    outcome: 'Delivers qualified sales conversations instead of low-intent clicks.',
  },
  {
    id: 'digital-marketing-consultation',
    number: '09',
    title: 'Digital Marketing Consultation',
    shortDescription:
      'One-on-one strategic audits of your ad account, creative pipeline, and conversion funnel with an actionable 90-day growth roadmap.',
    iconName: 'Compass',
    deliverables: [
      'Complete Meta Ad Account & pixel audit',
      'Creative & messaging gap diagnosis',
      'Budget allocation & scaling projections',
      '90-day channel execution roadmap',
    ],
    outcome: 'Gives founders clarity on where ad dollars are leaking and how to scale.',
  },
];

export const WHY_CHOOSE_PILLARS = [
  {
    number: '01',
    title: 'Result-Oriented Marketing',
    description:
      'Every creative, audience test, and campaign structure is tied directly to qualified leads, booked appointments, or profitable sales—never vanity likes.',
  },
  {
    number: '02',
    title: 'Data-Driven Advertising',
    description:
      'Decisions are backed by clean pixel/CAPI attribution, hook-rate diagnostics, and cost-per-lead benchmarks reviewed continuously.',
  },
  {
    number: '03',
    title: 'Creative Campaign Strategies',
    description:
      'In modern Meta Ads, creative does the targeting. We pair media buying with thumb-stopping Reels, motion graphics, and conversion copy.',
  },
  {
    number: '04',
    title: 'Transparent Reporting',
    description:
      'Clear monthly and weekly breakdowns showing exact ad spend, cost per lead, winning creatives, and next-sprint optimizations.',
  },
  {
    number: '05',
    title: 'Dedicated Account Management',
    description:
      'Direct communication with your campaign strategist—no disappearing account reps or delayed ticket queues.',
  },
  {
    number: '06',
    title: 'Customized Marketing Solutions',
    description:
      'No cookie-cutter templates. Funnels, ad budgets, and creative formats are tailored to your industry margins and sales cycle.',
  },
];

export const DEMO_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    clientName: 'Vikram Deshmukh',
    role: 'Managing Director',
    businessName: 'Solstice Realty Group (Demo)',
    quote:
      'Before working with a structured Meta Ads framework, our inquiries were inconsistent. Within 90 days of launching Reels and WhatsApp lead routing, our sales team had steady qualified site visits every week.',
    rating: 5,
    avatarUrl: '/src/assets/images/team_founder_portrait_1794976623177.jpg',
    isDemo: true,
  },
  {
    id: 2,
    clientName: 'Dr. Meera Kulkarni',
    role: 'Founder',
    businessName: 'Aurora Skin Studio (Demo)',
    quote:
      'Their creative team knew exactly how to turn clinical expertise into short, relatable Instagram Reels. Our Click-to-WhatsApp consultation pipeline stayed consistently booked without inflating ad spend.',
    rating: 5,
    avatarUrl: '/src/assets/images/team_strategist_portrait_1794976623549.jpg',
    isDemo: true,
  },
  {
    id: 3,
    clientName: 'Siddharth Malhotra',
    role: 'Co-Founder',
    businessName: 'Kairos Consumer Tech (Demo)',
    quote:
      'What stood out most was transparent reporting and weekly creative iteration. Whenever an ad set showed fatigue, new hooks and static variations were already queued to protect our acquisition cost.',
    rating: 5,
    avatarUrl: '/src/assets/images/team_creative_portrait_1794976624646.jpg',
    isDemo: true,
  },
];

export const BUDGET_OPTIONS = [
  'Under $1,000 / mo (Starter Test)',
  '$1,000 – $3,000 / mo',
  '$3,000 – $7,500 / mo',
  '$7,500 – $15,000 / mo',
  '$15,000+ / mo (Scale)',
];
