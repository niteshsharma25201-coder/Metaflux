import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const portfolioProjects = pgTable('portfolio_projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type').notNull().default('image'),
  clientLabel: text('client_label'),
  metricSummary: text('metric_summary'),
  isDemo: boolean('is_demo').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const uploadedMedia = pgTable('uploaded_media', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  dataBase64: text('data_base64').notNull(),
  uploadedByUid: text('uploaded_by_uid'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pricingPlans = pgTable('pricing_plans', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  tagline: text('tagline').notNull(),
  priceDisplay: text('price_display').notNull().default('Custom Quote'),
  billingNote: text('billing_note').notNull().default('Ad spend billed separately'),
  featuresJson: text('features_json').notNull(),
  isFeatured: boolean('is_featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  designation: text('designation').notNull(),
  bio: text('bio').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isDemo: boolean('is_demo').notNull().default(true),
});

export const caseStudies = pgTable('case_studies', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  industry: text('industry').notNull(),
  objective: text('objective').notNull(),
  strategy: text('strategy').notNull(),
  duration: text('duration').notNull(),
  adBudget: text('ad_budget').notNull(),
  leadsGenerated: integer('leads_generated').notNull(),
  costPerLead: text('cost_per_lead').notNull(),
  resultsSummary: text('results_summary').notNull(),
  monthlyTrendJson: text('monthly_trend_json').notNull(),
  isDemo: boolean('is_demo').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const contactEnquiries = pgTable('contact_enquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  businessName: text('business_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  serviceRequired: text('service_required').notNull(),
  monthlyBudget: text('monthly_budget').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
});
