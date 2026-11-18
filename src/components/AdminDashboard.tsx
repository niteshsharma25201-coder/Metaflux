import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  ArrowLeft,
  Check,
  Edit3,
  FolderKanban,
  Inbox,
  LogOut,
  MessageCircle,
  Plus,
  Trash2,
  Upload,
  Users,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { PORTFOLIO_CATEGORIES } from '../data/agencyStatic.ts';
import type {
  CaseStudy,
  ContactEnquiry,
  MediaAsset,
  PortfolioProject,
  PricingPlan,
  TeamMember,
} from '../types/agency.ts';

interface AdminDashboardProps {
  portfolio: PortfolioProject[];
  pricing: PricingPlan[];
  team: TeamMember[];
  caseStudies: CaseStudy[];
  onRefreshAgencyData: () => Promise<void>;
  onCloseAdmin: () => void;
}

type AdminTab = 'portfolio' | 'pricing' | 'team' | 'cases' | 'enquiries';

const PROJECT_CATEGORIES = PORTFOLIO_CATEGORIES.filter((c) => c !== 'All');

export function AdminDashboard({
  portfolio,
  pricing,
  team,
  caseStudies,
  onRefreshAgencyData,
  onCloseAdmin,
}: AdminDashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('portfolio');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaAsset[]>([]);

  // Portfolio Form State
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState<string>(PROJECT_CATEGORIES[0]);
  const [projDescription, setProjDescription] = useState('');
  const [projMediaUrl, setProjMediaUrl] = useState('');
  const [projMediaType, setProjMediaType] = useState<'image' | 'video'>('image');
  const [projClientLabel, setProjClientLabel] = useState('');
  const [projMetricSummary, setProjMetricSummary] = useState('');
  const [projIsDemo, setProjIsDemo] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Pricing Edit State
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [planPrice, setPlanPrice] = useState('');
  const [planTagline, setPlanTagline] = useState('');
  const [planBillingNote, setPlanBillingNote] = useState('');
  const [planFeaturesText, setPlanFeaturesText] = useState('');
  const [planFeatured, setPlanFeatured] = useState(false);

  // Team Edit State
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamAvatar, setTeamAvatar] = useState('');
  const [teamIsDemo, setTeamIsDemo] = useState(true);

  // Case Study Edit State
  const [editingCaseId, setEditingCaseId] = useState<number | null>(null);
  const [caseClient, setCaseClient] = useState('');
  const [caseIndustry, setCaseIndustry] = useState('');
  const [caseObjective, setCaseObjective] = useState('');
  const [caseStrategy, setCaseStrategy] = useState('');
  const [caseDuration, setCaseDuration] = useState('');
  const [caseBudget, setCaseBudget] = useState('');
  const [caseLeads, setCaseLeads] = useState('0');
  const [caseCpl, setCaseCpl] = useState('');
  const [caseResults, setCaseResults] = useState('');
  const [caseIsDemo, setCaseIsDemo] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!user) throw new Error('Please sign in first.');
    const token = await user.getIdToken();
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed.');
    }
    return data;
  };

  const loadAdminExtras = async () => {
    if (!user) return;
    try {
      const [enqData, mediaData] = await Promise.all([
        authFetch('/api/admin/enquiries'),
        authFetch('/api/admin/media'),
      ]);
      setEnquiries(enqData);
      setMediaLibrary(mediaData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      loadAdminExtras();
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Google sign-in could not be completed.',
      );
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const showSuccess = (msg: string) => {
    setErrorNotice(null);
    setStatusNotice(msg);
  };

  const showError = (msg: string) => {
    setStatusNotice(null);
    setErrorNotice(msg);
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitle('');
    setProjCategory(PROJECT_CATEGORIES[0]);
    setProjDescription('');
    setProjMediaUrl('');
    setProjMediaType('image');
    setProjClientLabel('');
    setProjMetricSummary('');
    setProjIsDemo(false);
  };

  const handleMediaFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    target: 'portfolio' | 'team',
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingMedia(true);
    setErrorNotice(null);
    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploaded = await response.json();
      if (!response.ok) {
        throw new Error(uploaded.error || 'Media upload failed.');
      }

      if (target === 'portfolio') {
        setProjMediaUrl(uploaded.url);
        setProjMediaType(uploaded.mediaType);
      } else {
        setTeamAvatar(uploaded.url);
      }

      await loadAdminExtras();
      showSuccess(`Uploaded "${uploaded.filename}" to persistent media storage.`);
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Unable to upload media file.',
      );
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleSavePortfolioProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDescription.trim() || !projMediaUrl.trim()) {
      showError(
        'Project title, description, and an uploaded image/video are required.',
      );
      return;
    }

    setSavingProject(true);
    try {
      const payload = {
        title: projTitle.trim(),
        category: projCategory,
        description: projDescription.trim(),
        mediaUrl: projMediaUrl.trim(),
        mediaType: projMediaType,
        clientLabel: projClientLabel.trim() || undefined,
        metricSummary: projMetricSummary.trim() || undefined,
        isDemo: projIsDemo,
      };

      if (editingProjectId) {
        await authFetch(`/api/admin/portfolio/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        showSuccess('Portfolio project updated.');
      } else {
        await authFetch('/api/admin/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        showSuccess('New portfolio project published.');
      }

      resetProjectForm();
      await onRefreshAgencyData();
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Could not save portfolio project.',
      );
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await authFetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      setConfirmDeleteId(null);
      if (editingProjectId === id) resetProjectForm();
      await onRefreshAgencyData();
      showSuccess('Portfolio project deleted.');
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Failed to delete project.',
      );
    }
  };

  const handleSavePricingPlan = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPlanId) return;
    try {
      const features = planFeaturesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      await authFetch(`/api/admin/pricing/${editingPlanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceDisplay: planPrice,
          tagline: planTagline,
          billingNote: planBillingNote,
          features,
          isFeatured: planFeatured,
        }),
      });
      setEditingPlanId(null);
      await onRefreshAgencyData();
      showSuccess('Pricing package updated.');
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Failed to update pricing plan.',
      );
    }
  };

  const handleSaveTeamMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTeamId) return;
    try {
      await authFetch(`/api/admin/team/${editingTeamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          designation: teamRole,
          bio: teamBio,
          avatarUrl: teamAvatar,
          isDemo: teamIsDemo,
        }),
      });
      setEditingTeamId(null);
      await onRefreshAgencyData();
      showSuccess('Team member profile updated.');
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Failed to update team member.',
      );
    }
  };

  const handleSaveCaseStudy = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCaseId) return;
    try {
      await authFetch(`/api/admin/case-studies/${editingCaseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: caseClient,
          industry: caseIndustry,
          objective: caseObjective,
          strategy: caseStrategy,
          duration: caseDuration,
          adBudget: caseBudget,
          leadsGenerated: Number(caseLeads) || 0,
          costPerLead: caseCpl,
          resultsSummary: caseResults,
          isDemo: caseIsDemo,
        }),
      });
      setEditingCaseId(null);
      await onRefreshAgencyData();
      showSuccess('Case study updated.');
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Failed to update case study.',
      );
    }
  };

  const handleUpdateEnquiryStatus = async (id: number, status: string) => {
    try {
      await authFetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await loadAdminExtras();
      showSuccess('Enquiry status updated.');
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Failed to update enquiry status.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCloseAdmin}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Website</span>
            </button>
            <h1 className="font-display text-lg font-bold text-slate-950">
              META FLUX Agency Admin
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-slate-500">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {authLoading ? (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-600">Checking authentication...</p>
          </div>
        ) : !user ? (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-950">
              Agency Owner Sign In
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in with Google to manage portfolio projects, upload project
              images and videos, edit pricing plans, and review client
              enquiries.
            </p>

            {authError && (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {authError}
              </p>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white accent-gradient-btn shadow-md shadow-violet-500/20 cursor-pointer"
            >
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Status Banners */}
            {statusNotice && (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <span>{statusNotice}</span>
                <button
                  type="button"
                  onClick={() => setStatusNotice(null)}
                  className="text-xs underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {errorNotice && (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <span>{errorNotice}</span>
                <button
                  type="button"
                  onClick={() => setErrorNotice(null)}
                  className="text-xs underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Admin Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab('portfolio')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'accent-gradient-btn text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                <FolderKanban className="h-4 w-4" />
                <span>Portfolio &amp; Media</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'accent-gradient-btn text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Pricing Plans</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('team')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${
                  activeTab === 'team'
                    ? 'accent-gradient-btn text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Team</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cases')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${
                  activeTab === 'cases'
                    ? 'accent-gradient-btn text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Case Studies</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('enquiries')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${
                  activeTab === 'enquiries'
                    ? 'accent-gradient-btn text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                <Inbox className="h-4 w-4" />
                <span>Enquiries ({enquiries.length})</span>
              </button>
            </div>

            {/* TAB 1: PORTFOLIO & MEDIA */}
            {activeTab === 'portfolio' && (
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Form Column */}
                <div className="lg:col-span-5">
                  <form
                    onSubmit={handleSavePortfolioProject}
                    className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-lg font-bold text-slate-950">
                        {editingProjectId
                          ? 'Edit Portfolio Project'
                          : 'Add Portfolio Project'}
                      </h2>
                      {editingProjectId && (
                        <button
                          type="button"
                          onClick={resetProjectForm}
                          className="text-xs font-semibold text-violet-700 hover:underline cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        placeholder="e.g., Nova Dental — Meta Lead Funnel"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        Category *
                      </label>
                      <select
                        value={projCategory}
                        onChange={(e) => setProjCategory(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none"
                      >
                        {PROJECT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        Upload Project Image or Video (max 25MB)
                      </label>
                      <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-violet-300 bg-violet-50/70 px-4 py-3 text-xs font-semibold text-violet-700 hover:bg-violet-100/70">
                        <Upload className="h-4 w-4" />
                        <span>
                          {uploadingMedia
                            ? 'Uploading to Database Storage...'
                            : 'Choose Image or Video File'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          disabled={uploadingMedia}
                          onChange={(e) =>
                            handleMediaFileUpload(e, 'portfolio')
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Media URL *
                        </label>
                        <input
                          type="text"
                          required
                          value={projMediaUrl}
                          onChange={(e) => setProjMediaUrl(e.target.value)}
                          placeholder="/api/media/1 or asset path"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">
                          Media Type
                        </label>
                        <select
                          value={projMediaType}
                          onChange={(e) =>
                            setProjMediaType(
                              e.target.value === 'video' ? 'video' : 'image',
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>

                    {projMediaUrl && (
                      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
                        {projMediaType === 'video' ? (
                          <video
                            src={projMediaUrl}
                            controls
                            className="h-36 w-full object-contain"
                          />
                        ) : (
                          <img
                            src={projMediaUrl}
                            alt="Selected preview"
                            referrerPolicy="no-referrer"
                            className="h-36 w-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        Project Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={projDescription}
                        onChange={(e) => setProjDescription(e.target.value)}
                        placeholder="Describe campaign objective, creative format, and outcome..."
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">
                          Client Label
                        </label>
                        <input
                          type="text"
                          value={projClientLabel}
                          onChange={(e) => setProjClientLabel(e.target.value)}
                          placeholder="e.g., Nova Dental"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">
                          Result Note
                        </label>
                        <input
                          type="text"
                          value={projMetricSummary}
                          onChange={(e) => setProjMetricSummary(e.target.value)}
                          placeholder="e.g., 140 Qualified Leads"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projIsDemo}
                        onChange={(e) => setProjIsDemo(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span>Label as Sample Work (demo project)</span>
                    </label>

                    <button
                      type="submit"
                      disabled={savingProject}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white accent-gradient-btn cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>
                        {savingProject
                          ? 'Saving...'
                          : editingProjectId
                            ? 'Save Project Changes'
                            : 'Publish Portfolio Project'}
                      </span>
                    </button>
                  </form>

                  {mediaLibrary.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                      <h3 className="font-display text-sm font-semibold text-slate-950">
                        Uploaded Media Library ({mediaLibrary.length})
                      </h3>
                      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                        {mediaLibrary.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-800">
                                {item.filename}
                              </p>
                              <p className="text-slate-500">
                                {item.mediaType} ·{' '}
                                {Math.round(item.sizeBytes / 1024)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setProjMediaUrl(item.url);
                                setProjMediaType(item.mediaType);
                              }}
                              className="shrink-0 rounded border border-violet-300 bg-violet-50 px-2.5 py-1 font-medium text-violet-700 hover:bg-violet-100 cursor-pointer"
                            >
                              Use
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Existing Projects List */}
                <div className="space-y-4 lg:col-span-7">
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Published Portfolio Items ({portfolio.length})
                  </h2>

                  {portfolio.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
                          {project.mediaType === 'video' ? (
                            <video
                              src={project.mediaUrl}
                              muted
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <img
                              src={project.mediaUrl}
                              alt={project.title}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-violet-700">
                            {project.category} ·{' '}
                            {project.isDemo ? 'Sample Work' : 'Client Project'}
                          </p>
                          <h3 className="font-display text-base font-semibold text-slate-950">
                            {project.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(project.id);
                            setProjTitle(project.title);
                            setProjCategory(project.category);
                            setProjDescription(project.description);
                            setProjMediaUrl(project.mediaUrl);
                            setProjMediaType(
                              project.mediaType === 'video' ? 'video' : 'image',
                            );
                            setProjClientLabel(project.clientLabel || '');
                            setProjMetricSummary(project.metricSummary || '');
                            setProjIsDemo(project.isDemo);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        {confirmDeleteId === project.id ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Confirm</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(project.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: PRICING PLANS */}
            {activeTab === 'pricing' && (
              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {pricing.map((plan) => {
                  const isEditing = editingPlanId === plan.id;
                  let features: string[] = [];
                  try {
                    features = JSON.parse(plan.featuresJson);
                  } catch {
                    features = [];
                  }

                  return (
                    <div
                      key={plan.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                    >
                      {isEditing ? (
                        <form
                          onSubmit={handleSavePricingPlan}
                          className="space-y-4"
                        >
                          <h3 className="font-display text-lg font-bold text-slate-950">
                            Edit {plan.name}
                          </h3>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700">
                              Price Display
                            </label>
                            <input
                              type="text"
                              value={planPrice}
                              onChange={(e) => setPlanPrice(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700">
                              Tagline
                            </label>
                            <input
                              type="text"
                              value={planTagline}
                              onChange={(e) => setPlanTagline(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700">
                              Billing Note
                            </label>
                            <input
                              type="text"
                              value={planBillingNote}
                              onChange={(e) =>
                                setPlanBillingNote(e.target.value)
                              }
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700">
                              Deliverables (one per line)
                            </label>
                            <textarea
                              rows={5}
                              value={planFeaturesText}
                              onChange={(e) =>
                                setPlanFeaturesText(e.target.value)
                              }
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900"
                            />
                          </div>
                          <label className="flex items-center gap-2 text-xs text-slate-700">
                            <input
                              type="checkbox"
                              checked={planFeatured}
                              onChange={(e) =>
                                setPlanFeatured(e.target.checked)
                              }
                            />
                            <span>Highlight as Most Popular</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="rounded-lg px-4 py-2 text-xs font-semibold text-white accent-gradient-btn cursor-pointer"
                            >
                              Save Package
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPlanId(null)}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-display text-xl font-bold text-slate-950">
                              {plan.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPlanId(plan.id);
                                setPlanPrice(plan.priceDisplay);
                                setPlanTagline(plan.tagline);
                                setPlanBillingNote(plan.billingNote);
                                setPlanFeaturesText(features.join('\n'));
                                setPlanFeatured(plan.isFeatured);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                          </div>
                          <p className="mt-2 font-mono text-xl font-bold text-violet-700">
                            {plan.priceDisplay}
                          </p>
                          <p className="mt-2 text-xs text-slate-600">
                            {plan.tagline}
                          </p>
                          <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                            {features.map((f) => (
                              <li key={f}>• {f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: TEAM */}
            {activeTab === 'team' && (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {team.map((member) => {
                  const isEditing = editingTeamId === member.id;
                  return (
                    <div
                      key={member.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                    >
                      {isEditing ? (
                        <form
                          onSubmit={handleSaveTeamMember}
                          className="space-y-3"
                        >
                          <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Name"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <input
                            type="text"
                            value={teamRole}
                            onChange={(e) => setTeamRole(e.target.value)}
                            placeholder="Designation"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <textarea
                            rows={3}
                            value={teamBio}
                            onChange={(e) => setTeamBio(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900"
                          />
                          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-violet-300 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload New Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleMediaFileUpload(e, 'team')}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            value={teamAvatar}
                            onChange={(e) => setTeamAvatar(e.target.value)}
                            placeholder="Photo URL"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="rounded-lg px-4 py-2 text-xs font-semibold text-white accent-gradient-btn cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTeamId(null)}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                referrerPolicy="no-referrer"
                                className="h-12 w-12 rounded-full object-cover object-top"
                              />
                              <div>
                                <p className="text-xs font-semibold text-violet-700">
                                  {member.designation}
                                </p>
                                <h3 className="font-display text-base font-semibold text-slate-950">
                                  {member.name}
                                </h3>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTeamId(member.id);
                                setTeamName(member.name);
                                setTeamRole(member.designation);
                                setTeamBio(member.bio);
                                setTeamAvatar(member.avatarUrl);
                                setTeamIsDemo(member.isDemo);
                              }}
                              className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:text-slate-950 cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-slate-600">
                            {member.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 4: CASE STUDIES */}
            {activeTab === 'cases' && (
              <div className="mt-8 space-y-5">
                {caseStudies.map((study) => {
                  const isEditing = editingCaseId === study.id;
                  return (
                    <div
                      key={study.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                    >
                      {isEditing ? (
                        <form
                          onSubmit={handleSaveCaseStudy}
                          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                          <input
                            type="text"
                            value={caseClient}
                            onChange={(e) => setCaseClient(e.target.value)}
                            placeholder="Client Name"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <input
                            type="text"
                            value={caseIndustry}
                            onChange={(e) => setCaseIndustry(e.target.value)}
                            placeholder="Industry"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <input
                            type="text"
                            value={caseDuration}
                            onChange={(e) => setCaseDuration(e.target.value)}
                            placeholder="Duration"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <input
                            type="text"
                            value={caseBudget}
                            onChange={(e) => setCaseBudget(e.target.value)}
                            placeholder="Ad Budget"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <input
                            type="number"
                            value={caseLeads}
                            onChange={(e) => setCaseLeads(e.target.value)}
                            placeholder="Leads Generated"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <input
                            type="text"
                            value={caseCpl}
                            onChange={(e) => setCaseCpl(e.target.value)}
                            placeholder="Cost Per Lead"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <textarea
                            rows={2}
                            value={caseObjective}
                            onChange={(e) => setCaseObjective(e.target.value)}
                            placeholder="Objective"
                            className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <textarea
                            rows={2}
                            value={caseStrategy}
                            onChange={(e) => setCaseStrategy(e.target.value)}
                            placeholder="Strategy"
                            className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <textarea
                            rows={2}
                            value={caseResults}
                            onChange={(e) => setCaseResults(e.target.value)}
                            placeholder="Campaign Results"
                            className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                          />
                          <label className="sm:col-span-2 flex items-center gap-2 text-xs text-slate-700">
                            <input
                              type="checkbox"
                              checked={caseIsDemo}
                              onChange={(e) => setCaseIsDemo(e.target.checked)}
                            />
                            <span>Mark as Demonstration Data</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="rounded-lg px-4 py-2 text-xs font-semibold text-white accent-gradient-btn cursor-pointer"
                            >
                              Save Case Study
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCaseId(null)}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold text-sky-600">
                              {study.industry} ·{' '}
                              {study.isDemo
                                ? 'Demonstration Data'
                                : 'Verified Campaign'}
                            </p>
                            <h3 className="font-display text-lg font-bold text-slate-950">
                              {study.clientName}
                            </h3>
                            <p className="mt-1 text-xs text-slate-600">
                              Budget: {study.adBudget} · Leads:{' '}
                              {study.leadsGenerated} · CPL: {study.costPerLead}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCaseId(study.id);
                              setCaseClient(study.clientName);
                              setCaseIndustry(study.industry);
                              setCaseObjective(study.objective);
                              setCaseStrategy(study.strategy);
                              setCaseDuration(study.duration);
                              setCaseBudget(study.adBudget);
                              setCaseLeads(String(study.leadsGenerated));
                              setCaseCpl(study.costPerLead);
                              setCaseResults(study.resultsSummary);
                              setCaseIsDemo(study.isDemo);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Edit Case Study</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 5: CLIENT ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="mt-8 space-y-4">
                {enquiries.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
                    <p className="font-display text-lg font-semibold text-slate-950">
                      No consultation enquiries yet
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Leads submitted from the contact form will appear here.
                    </p>
                  </div>
                ) : (
                  enquiries.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-violet-700">
                              {item.serviceRequired}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {item.monthlyBudget}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="mt-1 font-display text-lg font-bold text-slate-950">
                            {item.name} — {item.businessName}
                          </h3>
                          <p className="mt-1 text-xs text-slate-600">
                            {item.email} · {item.phone}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                            {item.message}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleUpdateEnquiryStatus(item.id, e.target.value)
                            }
                            aria-label="Lead status"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="archived">Archived</option>
                          </select>

                          <a
                            href={`https://wa.me/${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hi ${item.name}, thanks for reaching out to META FLUX regarding ${item.serviceRequired} for ${item.businessName}.`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
