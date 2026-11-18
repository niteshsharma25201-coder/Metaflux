export type PortfolioCategory =
  | 'All'
  | 'Meta Ads Campaigns'
  | 'Social Media Creatives'
  | 'Instagram Reels'
  | 'Promotional Videos'
  | 'Brand Campaigns'
  | 'Lead Generation Projects';

export interface PortfolioProject {
  id: number;
  title: string;
  category: Exclude<PortfolioCategory, 'All'> | string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | string;
  clientLabel?: string | null;
  metricSummary?: string | null;
  isDemo: boolean;
  sortOrder: number;
}

export interface PricingPlan {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  priceDisplay: string;
  billingNote: string;
  featuresJson: string;
  isFeatured: boolean;
  sortOrder: number;
}

export interface TeamMember {
  id: number;
  name: string;
  designation: string;
  bio: string;
  avatarUrl: string;
  sortOrder: number;
  isDemo: boolean;
}

export interface CaseStudyPoint {
  label: string;
  leads: number;
  cpl: number;
}

export interface CaseStudy {
  id: number;
  clientName: string;
  industry: string;
  objective: string;
  strategy: string;
  duration: string;
  adBudget: string;
  leadsGenerated: number;
  costPerLead: string;
  resultsSummary: string;
  monthlyTrendJson: string;
  isDemo: boolean;
  sortOrder: number;
}

export interface ContactEnquiry {
  id: number;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  serviceRequired: string;
  monthlyBudget: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface MediaAsset {
  id: number;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  mediaType: 'image' | 'video';
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  iconName:
    | 'Target'
    | 'Megaphone'
    | 'MessageCircle'
    | 'LayoutGrid'
    | 'Film'
    | 'Scissors'
    | 'Sparkles'
    | 'TrendingUp'
    | 'Compass';
  deliverables: string[];
  outcome: string;
}

export interface TestimonialItem {
  id: number;
  clientName: string;
  role: string;
  businessName: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  isDemo: boolean;
}
