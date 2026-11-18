import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureSeedData } from './src/db/seed.ts';
import {
  createContactEnquiry,
  createPortfolioProject,
  deletePortfolioProject,
  getUploadedMediaById,
  listCaseStudies,
  listContactEnquiries,
  listMediaLibrary,
  listPortfolioProjects,
  listPricingPlans,
  listTeamMembers,
  saveUploadedMedia,
  updateCaseStudy,
  updateEnquiryStatus,
  updatePortfolioProject,
  updatePricingPlan,
  updateTeamMember,
} from './src/db/queries.ts';
import { requireAuth } from './src/middleware/auth.ts';
import type { AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed.'));
    }
  },
});

// Public Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Public Agency Payload
app.get('/api/agency-data', async (_req: Request, res: Response) => {
  try {
    await ensureSeedData();
    const [portfolio, pricing, team, cases] = await Promise.all([
      listPortfolioProjects(),
      listPricingPlans(),
      listTeamMembers(),
      listCaseStudies(),
    ]);
    res.json({
      portfolio,
      pricing,
      team,
      caseStudies: cases,
    });
  } catch (error) {
    console.error('Error loading agency data:', error);
    res.status(500).json({ error: 'Unable to load agency content right now.' });
  }
});

// Public Media Streaming (supports Range requests for video playback)
app.get('/api/media/:id', async (req: Request, res: Response) => {
  const mediaId = Number(req.params.id);
  if (!Number.isInteger(mediaId) || mediaId <= 0) {
    return res.status(400).json({ error: 'Invalid media ID.' });
  }

  try {
    const media = await getUploadedMediaById(mediaId);
    if (!media) {
      return res.status(404).json({ error: 'Media not found.' });
    }

    const buffer = Buffer.from(media.dataBase64, 'base64');
    const total = buffer.length;
    const range = req.headers.range;

    res.setHeader('Content-Type', media.mimeType);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start >= total ||
        end >= total
      ) {
        res.status(416).setHeader('Content-Range', `bytes */${total}`).end();
        return;
      }
      const chunkSize = end - start + 1;
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
      res.setHeader('Content-Length', String(chunkSize));
      res.end(buffer.subarray(start, end + 1));
      return;
    }

    res.setHeader('Content-Length', String(total));
    res.end(buffer);
  } catch (error) {
    console.error('Failed to stream media:', error);
    res.status(500).json({ error: 'Failed to retrieve media file.' });
  }
});

// Public Contact Enquiry Submission
app.post('/api/enquiries', async (req: Request, res: Response) => {
  const {
    name,
    businessName,
    phone,
    email,
    serviceRequired,
    monthlyBudget,
    message,
  } = req.body || {};

  if (
    !name ||
    !businessName ||
    !phone ||
    !email ||
    !serviceRequired ||
    !monthlyBudget ||
    !message
  ) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const enquiry = await createContactEnquiry({
      name: String(name).trim(),
      businessName: String(businessName).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      serviceRequired: String(serviceRequired).trim(),
      monthlyBudget: String(monthlyBudget).trim(),
      message: String(message).trim(),
    });
    res.status(201).json(enquiry);
  } catch (error) {
    console.error('Enquiry creation error:', error);
    res.status(500).json({ error: 'Unable to save your enquiry right now.' });
  }
});

// Protected Admin Routes
app.get('/api/admin/me', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({
    uid: req.user?.uid,
    email: req.user?.email,
    name: req.user?.name || req.user?.email,
  });
});

app.get(
  '/api/admin/enquiries',
  requireAuth,
  async (_req: AuthRequest, res: Response) => {
    try {
      const items = await listContactEnquiries();
      res.json(items);
    } catch (error) {
      console.error('Admin enquiries fetch failed:', error);
      res.status(500).json({ error: 'Failed to load enquiries.' });
    }
  },
);

app.patch(
  '/api/admin/enquiries/:id',
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    if (!Number.isInteger(id) || !status) {
      return res.status(400).json({ error: 'Invalid enquiry update payload.' });
    }
    try {
      const updated = await updateEnquiryStatus(id, String(status));
      if (!updated) return res.status(404).json({ error: 'Enquiry not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Update enquiry status failed:', error);
      res.status(500).json({ error: 'Failed to update enquiry status.' });
    }
  },
);

app.get(
  '/api/admin/media',
  requireAuth,
  async (_req: AuthRequest, res: Response) => {
    try {
      const files = await listMediaLibrary();
      res.json(
        files.map((file) => ({
          ...file,
          url: `/api/media/${file.id}`,
          mediaType: file.mimeType.startsWith('video/') ? 'video' : 'image',
        })),
      );
    } catch (error) {
      console.error('Media list failed:', error);
      res.status(500).json({ error: 'Failed to load media library.' });
    }
  },
);

app.post(
  '/api/admin/media',
  requireAuth,
  (req: AuthRequest, res: Response) => {
    upload.single('file')(req, res, async (err: unknown) => {
      if (err) {
        const message =
          err instanceof Error ? err.message : 'File upload failed.';
        return res.status(400).json({ error: message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No media file provided.' });
      }

      try {
        const saved = await saveUploadedMedia({
          filename: req.file.originalname,
          mimeType: req.file.mimetype,
          sizeBytes: req.file.size,
          dataBase64: req.file.buffer.toString('base64'),
          uploadedByUid: req.user?.uid || 'unknown',
        });

        res.status(201).json({
          ...saved,
          url: `/api/media/${saved.id}`,
          mediaType: saved.mimeType.startsWith('video/') ? 'video' : 'image',
        });
      } catch (uploadError) {
        console.error('Media save failed:', uploadError);
        res.status(500).json({ error: 'Failed to save uploaded media.' });
      }
    });
  },
);

app.post(
  '/api/admin/portfolio',
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const {
      title,
      category,
      description,
      mediaUrl,
      mediaType,
      clientLabel,
      metricSummary,
      isDemo,
    } = req.body || {};

    if (!title || !category || !description || !mediaUrl) {
      return res
        .status(400)
        .json({ error: 'Title, category, description, and media are required.' });
    }

    try {
      const created = await createPortfolioProject({
        title: String(title).trim(),
        category: String(category).trim(),
        description: String(description).trim(),
        mediaUrl: String(mediaUrl).trim(),
        mediaType: mediaType === 'video' ? 'video' : 'image',
        clientLabel: clientLabel ? String(clientLabel).trim() : undefined,
        metricSummary: metricSummary ? String(metricSummary).trim() : undefined,
        isDemo: Boolean(isDemo),
      });
      res.status(201).json(created);
    } catch (error) {
      console.error('Portfolio create failed:', error);
      res.status(500).json({ error: 'Failed to create project.' });
    }
  },
);

app.put(
  '/api/admin/portfolio/:id',
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const {
      title,
      category,
      description,
      mediaUrl,
      mediaType,
      clientLabel,
      metricSummary,
      isDemo,
    } = req.body || {};

    if (!Number.isInteger(id) || !title || !category || !description || !mediaUrl) {
      return res.status(400).json({ error: 'Invalid portfolio project payload.' });
    }

    try {
      const updated = await updatePortfolioProject(id, {
        title: String(title).trim(),
        category: String(category).trim(),
        description: String(description).trim(),
        mediaUrl: String(mediaUrl).trim(),
        mediaType: mediaType === 'video' ? 'video' : 'image',
        clientLabel: clientLabel ? String(clientLabel).trim() : undefined,
        metricSummary: metricSummary ? String(metricSummary).trim() : undefined,
        isDemo: Boolean(isDemo),
      });
      if (!updated) return res.status(404).json({ error: 'Project not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Portfolio update failed:', error);
      res.status(500).json({ error: 'Failed to update project.' });
    }
  },
);

app.delete(
  '/api/admin/portfolio/:id',
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid project ID.' });
    }
    try {
      const deleted = await deletePortfolioProject(id);
      if (!deleted) return res.status(404).json({ error: 'Project not found.' });
      res.json({ deletedId: id });
    } catch (error) {
      console.error('Portfolio delete failed:', error);
      res.status(500).json({ error: 'Failed to delete project.' });
    }
  },
);

app.put(
  '/api/admin/pricing/:id',
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const { tagline, priceDisplay, billingNote, features, isFeatured } =
      req.body || {};

    if (!Number.isInteger(id) || !tagline || !priceDisplay || !Array.isArray(features)) {
      return res.status(400).json({ error: 'Invalid pricing update payload.' });
    }

    try {
      const updated = await updatePricingPlan(id, {
        tagline: String(tagline).trim(),
        priceDisplay: String(priceDisplay).trim(),
        billingNote: String(
          billingNote || 'Ad budget is separate from agency management fees',
        ).trim(),
        featuresJson: JSON.stringify(
          features.map((item: unknown) => String(item).trim()).filter(Boolean),
        ),
        isFeatured: Boolean(isFeatured),
      });
      if (!updated) return res.status(404).json({ error: 'Pricing plan not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Pricing update failed:', error);
      res.status(500).json({ error: 'Failed to update pricing plan.' });
    }
  },
);

app.put(
  '/api/admin/team/:id',
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const { name, designation, bio, avatarUrl, isDemo } = req.body || {};
    if (!Number.isInteger(id) || !name || !designation || !bio || !avatarUrl) {
      return res.status(400).json({ error: 'Invalid team member payload.' });
    }
    try {
      const updated = await updateTeamMember(id, {
        name: String(name).trim(),
        designation: String(designation).trim(),
        bio: String(bio).trim(),
        avatarUrl: String(avatarUrl).trim(),
        isDemo: Boolean(isDemo),
      });
      if (!updated) return res.status(404).json({ error: 'Team member not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Team update failed:', error);
      res.status(500).json({ error: 'Failed to update team member.' });
    }
  },
);

app.put(
  '/api/admin/case-studies/:id',
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const {
      clientName,
      industry,
      objective,
      strategy,
      duration,
      adBudget,
      leadsGenerated,
      costPerLead,
      resultsSummary,
      isDemo,
    } = req.body || {};
    if (!Number.isInteger(id) || !clientName || !industry || !objective) {
      return res.status(400).json({ error: 'Invalid case study payload.' });
    }
    try {
      const updated = await updateCaseStudy(id, {
        clientName: String(clientName).trim(),
        industry: String(industry).trim(),
        objective: String(objective).trim(),
        strategy: String(strategy).trim(),
        duration: String(duration).trim(),
        adBudget: String(adBudget).trim(),
        leadsGenerated: Number(leadsGenerated) || 0,
        costPerLead: String(costPerLead).trim(),
        resultsSummary: String(resultsSummary).trim(),
        isDemo: Boolean(isDemo),
      });
      if (!updated) return res.status(404).json({ error: 'Case study not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Case study update failed:', error);
      res.status(500).json({ error: 'Failed to update case study.' });
    }
  },
);

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`META FLUX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
