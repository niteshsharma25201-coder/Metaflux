import { asc, desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import {
  caseStudies,
  contactEnquiries,
  portfolioProjects,
  pricingPlans,
  teamMembers,
  uploadedMedia,
} from './schema.ts';

export async function listPortfolioProjects() {
  try {
    return await db
      .select()
      .from(portfolioProjects)
      .orderBy(asc(portfolioProjects.sortOrder), desc(portfolioProjects.id));
  } catch (error) {
    console.error('listPortfolioProjects failed:', error);
    throw new Error('Failed to load portfolio projects.', { cause: error });
  }
}

export async function createPortfolioProject(input: {
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  clientLabel?: string;
  metricSummary?: string;
  isDemo: boolean;
}) {
  try {
    const [created] = await db
      .insert(portfolioProjects)
      .values({
        title: input.title,
        category: input.category,
        description: input.description,
        mediaUrl: input.mediaUrl,
        mediaType: input.mediaType || 'image',
        clientLabel: input.clientLabel || null,
        metricSummary: input.metricSummary || null,
        isDemo: input.isDemo,
        sortOrder: 0,
      })
      .returning();
    return created;
  } catch (error) {
    console.error('createPortfolioProject failed:', error);
    throw new Error('Failed to create portfolio project.', { cause: error });
  }
}

export async function updatePortfolioProject(
  id: number,
  input: {
    title: string;
    category: string;
    description: string;
    mediaUrl: string;
    mediaType: string;
    clientLabel?: string;
    metricSummary?: string;
    isDemo: boolean;
  },
) {
  try {
    const [updated] = await db
      .update(portfolioProjects)
      .set({
        title: input.title,
        category: input.category,
        description: input.description,
        mediaUrl: input.mediaUrl,
        mediaType: input.mediaType,
        clientLabel: input.clientLabel || null,
        metricSummary: input.metricSummary || null,
        isDemo: input.isDemo,
        updatedAt: new Date(),
      })
      .where(eq(portfolioProjects.id, id))
      .returning();
    return updated || null;
  } catch (error) {
    console.error('updatePortfolioProject failed:', error);
    throw new Error('Failed to update portfolio project.', { cause: error });
  }
}

export async function deletePortfolioProject(id: number) {
  try {
    const [deleted] = await db
      .delete(portfolioProjects)
      .where(eq(portfolioProjects.id, id))
      .returning();
    return deleted || null;
  } catch (error) {
    console.error('deletePortfolioProject failed:', error);
    throw new Error('Failed to delete portfolio project.', { cause: error });
  }
}

export async function saveUploadedMedia(input: {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  dataBase64: string;
  uploadedByUid: string;
}) {
  try {
    const [media] = await db
      .insert(uploadedMedia)
      .values({
        filename: input.filename,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        dataBase64: input.dataBase64,
        uploadedByUid: input.uploadedByUid,
      })
      .returning({
        id: uploadedMedia.id,
        filename: uploadedMedia.filename,
        mimeType: uploadedMedia.mimeType,
        sizeBytes: uploadedMedia.sizeBytes,
        createdAt: uploadedMedia.createdAt,
      });
    return media;
  } catch (error) {
    console.error('saveUploadedMedia failed:', error);
    throw new Error('Failed to store uploaded media file.', { cause: error });
  }
}

export async function getUploadedMediaById(id: number) {
  try {
    const [media] = await db
      .select()
      .from(uploadedMedia)
      .where(eq(uploadedMedia.id, id));
    return media || null;
  } catch (error) {
    console.error('getUploadedMediaById failed:', error);
    throw new Error('Failed to retrieve media file.', { cause: error });
  }
}

export async function listMediaLibrary() {
  try {
    return await db
      .select({
        id: uploadedMedia.id,
        filename: uploadedMedia.filename,
        mimeType: uploadedMedia.mimeType,
        sizeBytes: uploadedMedia.sizeBytes,
        createdAt: uploadedMedia.createdAt,
      })
      .from(uploadedMedia)
      .orderBy(desc(uploadedMedia.id));
  } catch (error) {
    console.error('listMediaLibrary failed:', error);
    throw new Error('Failed to load uploaded media list.', { cause: error });
  }
}

export async function listPricingPlans() {
  try {
    return await db
      .select()
      .from(pricingPlans)
      .orderBy(asc(pricingPlans.sortOrder));
  } catch (error) {
    console.error('listPricingPlans failed:', error);
    throw new Error('Failed to load pricing plans.', { cause: error });
  }
}

export async function updatePricingPlan(
  id: number,
  input: {
    tagline: string;
    priceDisplay: string;
    billingNote: string;
    featuresJson: string;
    isFeatured: boolean;
  },
) {
  try {
    const [updated] = await db
      .update(pricingPlans)
      .set({
        tagline: input.tagline,
        priceDisplay: input.priceDisplay,
        billingNote: input.billingNote,
        featuresJson: input.featuresJson,
        isFeatured: input.isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(pricingPlans.id, id))
      .returning();
    return updated || null;
  } catch (error) {
    console.error('updatePricingPlan failed:', error);
    throw new Error('Failed to update pricing plan.', { cause: error });
  }
}

export async function listTeamMembers() {
  try {
    return await db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));
  } catch (error) {
    console.error('listTeamMembers failed:', error);
    throw new Error('Failed to load team members.', { cause: error });
  }
}

export async function updateTeamMember(
  id: number,
  input: {
    name: string;
    designation: string;
    bio: string;
    avatarUrl: string;
    isDemo: boolean;
  },
) {
  try {
    const [updated] = await db
      .update(teamMembers)
      .set({
        name: input.name,
        designation: input.designation,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
        isDemo: input.isDemo,
      })
      .where(eq(teamMembers.id, id))
      .returning();
    return updated || null;
  } catch (error) {
    console.error('updateTeamMember failed:', error);
    throw new Error('Failed to update team member.', { cause: error });
  }
}

export async function listCaseStudies() {
  try {
    return await db
      .select()
      .from(caseStudies)
      .orderBy(asc(caseStudies.sortOrder), asc(caseStudies.id));
  } catch (error) {
    console.error('listCaseStudies failed:', error);
    throw new Error('Failed to load case studies.', { cause: error });
  }
}

export async function updateCaseStudy(
  id: number,
  input: {
    clientName: string;
    industry: string;
    objective: string;
    strategy: string;
    duration: string;
    adBudget: string;
    leadsGenerated: number;
    costPerLead: string;
    resultsSummary: string;
    isDemo: boolean;
  },
) {
  try {
    const [updated] = await db
      .update(caseStudies)
      .set({
        clientName: input.clientName,
        industry: input.industry,
        objective: input.objective,
        strategy: input.strategy,
        duration: input.duration,
        adBudget: input.adBudget,
        leadsGenerated: input.leadsGenerated,
        costPerLead: input.costPerLead,
        resultsSummary: input.resultsSummary,
        isDemo: input.isDemo,
      })
      .where(eq(caseStudies.id, id))
      .returning();
    return updated || null;
  } catch (error) {
    console.error('updateCaseStudy failed:', error);
    throw new Error('Failed to update case study.', { cause: error });
  }
}

export async function createContactEnquiry(input: {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  serviceRequired: string;
  monthlyBudget: string;
  message: string;
}) {
  try {
    const [created] = await db
      .insert(contactEnquiries)
      .values({
        name: input.name,
        businessName: input.businessName,
        phone: input.phone,
        email: input.email,
        serviceRequired: input.serviceRequired,
        monthlyBudget: input.monthlyBudget,
        message: input.message,
        status: 'new',
      })
      .returning();
    return created;
  } catch (error) {
    console.error('createContactEnquiry failed:', error);
    throw new Error('Failed to save enquiry.', { cause: error });
  }
}

export async function listContactEnquiries() {
  try {
    return await db
      .select()
      .from(contactEnquiries)
      .orderBy(desc(contactEnquiries.createdAt));
  } catch (error) {
    console.error('listContactEnquiries failed:', error);
    throw new Error('Failed to load contact enquiries.', { cause: error });
  }
}

export async function updateEnquiryStatus(id: number, status: string) {
  try {
    const [updated] = await db
      .update(contactEnquiries)
      .set({ status })
      .where(eq(contactEnquiries.id, id))
      .returning();
    return updated || null;
  } catch (error) {
    console.error('updateEnquiryStatus failed:', error);
    throw new Error('Failed to update enquiry status.', { cause: error });
  }
}
