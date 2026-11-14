import React from 'react';
import { Clock, ShieldCheck, TrendingDown, Zap } from 'lucide-react';
import { TIME_WINDOWS, TimeWindow } from '../data/platformData';

interface HeroShowcaseProps {
  timeWindow: TimeWindow;
  onTimeWindowChange: (tw: TimeWindow) => void;
  onJumpToCompare: () => void;
}

const PARTNER_BRANDS = [
  { name: 'Grab', monogram: 'GR', color: '#00B14F', note: 'JustGrab · Pet · Assist' },
  { name: 'Gojek', monogram: 'GJ', color: '#00AA13', note: 'GoCar · Priority' },
  { name: 'Ryde', monogram: 'RY', color: '#E11D48', note: 'RydeX · RydePET' },
  { name: 'Tada', monogram: 'TD', color: '#2563EB', note: 'Zero-Commission Fair' },
  { name: 'Zig', monogram: 'ZG', color: '#0284C7', note: 'CDG Fixed · WAV' },
];

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({
  timeWindow,
  onTimeWindowChange,
  onJumpToCompare,
}) => {
  const activeWindow =
    TIME_WINDOWS.find((t) => t.id === timeWindow) ?? TIME_WINDOWS[2];

  return (
    <section className="bg-slate-950 text-white border-b border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left 7 Cols: Bold Headline + Value Propositions + Peak Time Control */}
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold tracking-wider text-emerald-400">
              Singapore Ride-Hailing Aggregator &amp; Personalised Briefing
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1] [text-wrap:balance]">
              Beat peak surge across five operators in one view.
            </h1>
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
              Compare upfront fares, pickup ETAs, 4.9★+ drivers, pet-friendly cars, and wheelchair-accessible fleets across Grab, Gojek, Ryde, Tada, and Zig — mapped on live routes with insider Singapore traffic prompts and curated news.
            </p>

            {/* Value Props Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <TrendingDown className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Cheapest Upfront Fare</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Spots zero-commission &amp; low-surge rides instantly
                </p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                  <Zap className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Fastest Peak Pickup</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Pinpoints optimal pickup bays &amp; departure windows
                </p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Tailored Fleets</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Filter 4.9★+ drivers, pet-friendly &amp; wheelchair WAVs
                </p>
              </div>
            </div>

            {/* Peak Time Simulation & Primary Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <div
                role="group"
                aria-label="Peak traffic condition simulator"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800"
              >
                {TIME_WINDOWS.map((tw) => {
                  const active = tw.id === timeWindow;
                  return (
                    <button
                      key={tw.id}
                      type="button"
                      onClick={() => onTimeWindowChange(tw.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                        active
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tw.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onJumpToCompare}
                className="px-4 py-2.5 text-xs font-semibold bg-white text-slate-950 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Compare Live Rides
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Graphic Singapore Mobility & Partner Fleet Visual */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              {/* Custom Singapore Skyline & Route Graphic */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <svg
                  viewBox="0 0 560 220"
                  className="w-full h-44 object-cover"
                  role="img"
                  aria-label="Singapore Marina Bay expressway and mobility graphic"
                >
                  <defs>
                    <linearGradient id="heroSky" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0F172A" />
                      <stop offset="60%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#064E3B" />
                    </linearGradient>
                    <linearGradient id="routeGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  <rect width="560" height="220" fill="url(#heroSky)" />
                  {/* Subtle geometric grid */}
                  <g stroke="#334155" strokeWidth="0.6" opacity="0.35">
                    <line x1="0" y1="55" x2="560" y2="55" />
                    <line x1="0" y1="110" x2="560" y2="110" />
                    <line x1="0" y1="165" x2="560" y2="165" />
                    <line x1="140" y1="0" x2="140" y2="220" />
                    <line x1="280" y1="0" x2="280" y2="220" />
                    <line x1="420" y1="0" x2="420" y2="220" />
                  </g>
                  {/* Skyline Silhouettes */}
                  <rect x="40" y="75" width="32" height="95" fill="#1E293B" stroke="#334155" strokeWidth="1" />
                  <rect x="82" y="48" width="38" height="122" fill="#334155" />
                  <rect x="130" y="92" width="28" height="78" fill="#1E293B" />
                  {/* MBS */}
                  <rect x="215" y="64" width="22" height="106" fill="#475569" />
                  <rect x="248" y="62" width="22" height="108" fill="#64748B" />
                  <rect x="281" y="64" width="22" height="106" fill="#475569" />
                  <path d="M202 62 Q260 50 322 57 L315 68 Q260 62 206 68 Z" fill="#E2E8F0" />
                  {/* Singapore Flyer */}
                  <circle cx="385" cy="96" r="42" fill="none" stroke="#64748B" strokeWidth="2.5" />
                  <circle cx="385" cy="96" r="6" fill="#10B981" />
                  {/* Changi Control Tower */}
                  <rect x="468" y="42" width="12" height="128" fill="#475569" />
                  <ellipse cx="474" cy="46" rx="22" ry="8" fill="#94A3B8" />
                  {/* Expressway Path */}
                  <rect x="0" y="170" width="560" height="50" fill="#020617" />
                  <path
                    d="M 24 195 Q 170 176 290 192 T 536 188"
                    fill="none"
                    stroke="url(#routeGlow)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Moving Vehicle Nodes */}
                  <circle cx="115" cy="186" r="5" fill="#10B981" />
                  <circle cx="290" cy="192" r="5.5" fill="#FFFFFF" />
                  <circle cx="445" cy="191" r="5" fill="#38BDF8" />
                </svg>

                <div className="px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span className="font-mono tabular-nums font-semibold text-white">
                      {activeWindow.clock}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeWindow.surgeLabel}</span>
                  </div>
                </div>
              </div>

              {/* 5 Partner Operators Visual Grid */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2.5">
                  Connected Singapore Fleets
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {PARTNER_BRANDS.map((brand) => (
                    <div
                      key={brand.name}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center"
                    >
                      <div
                        className="w-8 h-8 rounded-md mx-auto flex items-center justify-center font-display text-xs font-extrabold text-white"
                        style={{ backgroundColor: brand.color }}
                      >
                        {brand.monogram}
                      </div>
                      <span className="block text-xs font-semibold text-white mt-1.5">
                        {brand.name}
                      </span>
                      <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                        {brand.note.split(' · ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
