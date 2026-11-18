import { useState } from 'react';
import { Expand, Film, Lock, Play, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PORTFOLIO_CATEGORIES } from '../data/agencyStatic.ts';
import type { PortfolioCategory, PortfolioProject } from '../types/agency.ts';

interface PortfolioSectionProps {
  projects: PortfolioProject[];
  loading: boolean;
  onOpenAdmin: () => void;
}

function ProjectThumbnail({ project }: { project: PortfolioProject }) {
  const [imgError, setImgError] = useState(false);

  if (project.mediaType === 'video') {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <video
          src={project.mediaUrl}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/15 to-transparent"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-slate-950/65 text-white backdrop-blur-md transition-transform duration-200 group-hover:scale-110">
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
      {!imgError ? (
        <img
          src={project.mediaUrl}
          alt={project.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-violet-100 via-white to-sky-100 p-6 text-center">
          <Film className="h-8 w-8 text-violet-600" />
          <p className="mt-2 font-display text-sm font-semibold text-slate-900">
            {project.title}
          </p>
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent"
      />
    </div>
  );
}

export function PortfolioSection({
  projects,
  loading,
  onOpenAdmin,
}: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<PortfolioCategory>('All');
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(
    null,
  );

  const filtered =
    selectedCategory === 'All'
      ? projects
      : projects.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="portfolio"
      className="border-b border-slate-200 bg-gradient-to-b from-sky-50/45 via-slate-50/70 to-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-violet-700">
              Creative &amp; Campaign Portfolio
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Selected Campaigns &amp; Creative Systems
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Sample showcase projects are clearly labeled until replaced with
              verified client campaign assets in the Agency Admin Studio.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-xs transition-colors hover:border-violet-300 hover:bg-violet-50/50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5 text-violet-600" />
            <span>Manage Portfolio</span>
          </button>
        </div>

        {/* Category Filter Bar */}
        <div
          role="tablist"
          aria-label="Portfolio categories"
          className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-5"
        >
          {PORTFOLIO_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'accent-gradient-btn text-white shadow-md shadow-violet-500/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-slate-950'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="font-display text-lg font-semibold text-slate-900">
              No projects in &ldquo;{selectedCategory}&rdquo; yet
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Switch categories or upload a new image/video project via Manage
              Portfolio.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, idx) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="group glass-surface flex flex-col overflow-hidden rounded-xl border border-slate-200 transition-all duration-200 hover:border-violet-300 hover:shadow-lg hover:shadow-sky-100/60"
              >
                <button
                  type="button"
                  onClick={() => setPreviewProject(project)}
                  className="relative block w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
                  aria-label={`Preview ${project.title}`}
                >
                  <ProjectThumbnail project={project} />
                  <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/30 bg-slate-950/60 text-white opacity-0 backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                  </span>
                </button>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-violet-700">
                        {project.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {project.isDemo ? 'Sample Work' : 'Client Project'}
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-display text-lg font-semibold text-slate-950">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {project.description}
                    </p>
                  </div>

                  {(project.clientLabel || project.metricSummary) && (
                    <div className="mt-5 border-t border-slate-100 pt-3.5 text-xs font-medium text-sky-700">
                      {project.metricSummary || project.clientLabel}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-lightbox-title"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-medium text-violet-700">
                  {previewProject.category} ·{' '}
                  {previewProject.isDemo ? 'Sample Work' : 'Client Project'}
                </p>
                <h3
                  id="portfolio-lightbox-title"
                  className="font-display text-lg font-bold text-slate-950"
                >
                  {previewProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                aria-label="Close project preview"
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:text-slate-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-slate-950">
              {previewProject.mediaType === 'video' ? (
                <video
                  src={previewProject.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[60vh] w-full object-contain"
                />
              ) : (
                <img
                  src={previewProject.mediaUrl}
                  alt={previewProject.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] w-full object-contain"
                />
              )}
            </div>

            <div className="p-6">
              <p className="text-sm leading-relaxed text-slate-700">
                {previewProject.description}
              </p>
              {(previewProject.clientLabel || previewProject.metricSummary) && (
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
                  {previewProject.clientLabel && (
                    <span>Client: {previewProject.clientLabel}</span>
                  )}
                  {previewProject.metricSummary && (
                    <span className="font-medium text-sky-700">
                      Note: {previewProject.metricSummary}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
