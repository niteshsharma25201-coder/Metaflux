import { useState } from 'react';
import { motion } from 'motion/react';
import type { CaseStudy, CaseStudyPoint } from '../types/agency.ts';

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
}

function CasePerformanceChart({ points }: { points: CaseStudyPoint[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!points.length) return null;

  const maxLeads = Math.max(...points.map((p) => p.leads), 1);
  const maxCpl = Math.max(...points.map((p) => p.cpl), 1);

  const width = 420;
  const height = 160;
  const padX = 28;
  const padTop = 20;
  const padBottom = 26;
  const chartHeight = height - padTop - padBottom;
  const stepX = (width - padX * 2) / points.length;

  const linePoints = points
    .map((point, i) => {
      const x = padX + stepX * i + stepX / 2;
      const y = padTop + chartHeight - (point.cpl / (maxCpl * 1.15)) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const activePoint =
    hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-700">
          Leads Volume vs. CPL Trend
        </span>
        <div className="flex items-center gap-3 font-mono text-slate-700 tabular-nums">
          <span className="font-semibold text-violet-700">
            {activePoint.label}: {activePoint.leads} leads
          </span>
          <span aria-hidden="true" className="text-slate-300">
            /
          </span>
          <span className="font-semibold text-sky-600">
            ${activePoint.cpl.toFixed(2)} CPL
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-3 h-40 w-full overflow-visible"
        role="img"
        aria-label="Campaign leads and cost per lead progression chart"
      >
        <defs>
          <linearGradient id="leadBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Horizontal subtle baseline grid */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padTop + chartHeight * (1 - ratio);
          return (
            <line
              key={ratio}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="rgba(15,23,42,0.08)"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Bars */}
        {points.map((point, i) => {
          const barWidth = Math.min(34, stepX * 0.48);
          const barHeight = (point.leads / (maxLeads * 1.15)) * chartHeight;
          const x = padX + stepX * i + (stepX - barWidth) / 2;
          const y = padTop + chartHeight - barHeight;
          const isHovered = hoveredIndex === i;

          return (
            <g
              key={point.label}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 4)}
                rx={4}
                fill="url(#leadBarGrad)"
                opacity={hoveredIndex === null || isHovered ? 1 : 0.55}
              />
              <text
                x={x + barWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fill="#475569"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {point.label}
              </text>
            </g>
          );
        })}

        {/* CPL Trend Line */}
        <polyline
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePoints}
        />

        {points.map((point, i) => {
          const cx = padX + stepX * i + stepX / 2;
          const cy =
            padTop + chartHeight - (point.cpl / (maxCpl * 1.15)) * chartHeight;
          return (
            <circle
              key={`dot-${point.label}`}
              cx={cx}
              cy={cy}
              r={hoveredIndex === i ? 4.5 : 3.2}
              fill="#0ea5e9"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
}

export function CaseStudiesSection({ caseStudies }: CaseStudiesSectionProps) {
  const parseTrend = (jsonStr: string): CaseStudyPoint[] => {
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <section
      id="case-studies"
      className="border-b border-slate-200 bg-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-violet-700">
              Campaign Case Studies
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Structured Execution &amp; Performance Benchmarks
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-slate-500">
            Note: Campaigns marked Demonstration Data illustrate our reporting
            architecture and sample benchmarks until verified client numbers are
            entered in Admin.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {caseStudies.map((study, idx) => {
            const trendPoints = parseTrend(study.monthlyTrendJson);
            return (
              <motion.article
                key={study.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-surface rounded-2xl border border-slate-200 p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                  {/* Left Narrative & Details */}
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-sky-600">
                        {study.industry}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {study.isDemo
                          ? 'Demonstration Data'
                          : 'Verified Campaign'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {study.duration}
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-display text-2xl font-bold text-slate-950">
                      {study.clientName}
                    </h3>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Campaign Objective
                        </p>
                        <p className="mt-1 text-sm text-slate-800">
                          {study.objective}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Advertising Strategy
                        </p>
                        <p className="mt-1 text-sm text-slate-800">
                          {study.strategy}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-5">
                      <p className="text-xs font-semibold text-violet-700">
                        Campaign Results
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">
                        {study.resultsSummary}
                      </p>
                    </div>
                  </div>

                  {/* Right KPI Grid & SVG Chart */}
                  <div className="space-y-4 lg:col-span-5">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                        <p className="text-xs text-slate-500">Ad Budget</p>
                        <p className="mt-1 font-mono text-base font-semibold text-slate-900 tabular-nums">
                          {study.adBudget}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                        <p className="text-xs text-slate-500">Leads Generated</p>
                        <p className="mt-1 font-mono text-base font-semibold text-violet-700 tabular-nums">
                          {study.leadsGenerated.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                        <p className="text-xs text-slate-500">Cost Per Lead</p>
                        <p className="mt-1 font-mono text-base font-semibold text-sky-600 tabular-nums">
                          {study.costPerLead}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                        <p className="text-xs text-slate-500">Duration</p>
                        <p className="mt-1 font-mono text-base font-semibold text-slate-900 tabular-nums">
                          {study.duration}
                        </p>
                      </div>
                    </div>

                    <CasePerformanceChart points={trendPoints} />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
