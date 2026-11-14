import React, { useState } from 'react';
import { ArrowRight, Clock, Compass, MapPin, Navigation } from 'lucide-react';
import {
  SINGAPORE_LOCATIONS,
  TOURIST_ROUTE_GUIDES,
  TouristRouteGuide,
} from '../data/platformData';
import { EditorialIllustration } from './EditorialIllustrations';

interface TouristRoutesSectionProps {
  onSelectRoute: (fromId: string, toId: string) => void;
}

const GUIDE_VISUALS: Record<string, 'changi' | 'skyline' | 'mrt'> = {
  guide_changi_marina: 'changi',
  guide_orchard_sentosa: 'mrt',
  guide_little_india_gardens: 'skyline',
};

export const TouristRoutesSection: React.FC<TouristRoutesSectionProps> = ({
  onSelectRoute,
}) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(
    TOURIST_ROUTE_GUIDES[0].id
  );

  const conditionTone = (cond: TouristRouteGuide['trafficCondition']) => {
    if (cond === 'Smooth') return 'text-emerald-700';
    if (cond === 'Moderate Peak') return 'text-amber-700';
    return 'text-rose-700';
  };

  return (
    <section className="bg-white border-t border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1.5">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Singapore Visitor &amp; Scenic Route Intelligence</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Curated Singapore routes with insider traffic &amp; departure prompts
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Tap any route below to plot it on the live Google Map above and compare instant fares across all five operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOURIST_ROUTE_GUIDES.map((guide) => {
            const isSelected = guide.id === selectedGuideId;
            const visual = GUIDE_VISUALS[guide.id] ?? 'skyline';
            const fromName =
              SINGAPORE_LOCATIONS.find((l) => l.id === guide.fromId)?.name.split(' (')[0] ??
              guide.fromId;
            const toName =
              SINGAPORE_LOCATIONS.find((l) => l.id === guide.toId)?.name.split(' (')[0] ??
              guide.toId;

            return (
              <article
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-50 border-slate-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  {/* Graphic Visual Header */}
                  <div className="h-40 w-full bg-slate-100 border-b border-slate-200 relative overflow-hidden">
                    <EditorialIllustration variant={visual} />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold text-slate-800">
                        {guide.corridor}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-semibold ${conditionTone(guide.trafficCondition)}`}>
                        {guide.trafficCondition}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                      {fromName} → {toName}
                    </h3>

                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{guide.bestTimePrompt}</span>
                    </div>

                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                      {guide.insiderTip}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-200/70 space-y-3">
                  <div className="flex items-start gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{guide.pickupInstruction}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGuideId(guide.id);
                      onSelectRoute(guide.fromId, guide.toId);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Load Route on Google Map</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
