import React from 'react';
import { Bookmark, CarFront, ExternalLink, Trash2, X } from 'lucide-react';
import { LiveNewsItem } from './NewsFeedSection';
import { ActiveBooking } from './RideAggregator';

interface SavedBriefsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeBooking: ActiveBooking | null;
  onAdvanceBooking: () => void;
  onCancelBooking: () => void;
  savedArticles: LiveNewsItem[];
  onRemoveSaved: (article: LiveNewsItem) => void;
  pushTopicsCount: number;
}

export const SavedBriefsDrawer: React.FC<SavedBriefsDrawerProps> = ({
  isOpen,
  onClose,
  activeBooking,
  onAdvanceBooking,
  onCancelBooking,
  savedArticles,
  onRemoveSaved,
  pushTopicsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Commute pass and saved briefs"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full border-l border-slate-200 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Commute &amp; Briefing Pass
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {pushTopicsCount} push alert channels active
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Active Ride Section */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 mb-3">
                Current Dispatched Ride
              </h3>
              {activeBooking ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-slate-900">
                      {activeBooking.quote.operatorName} · {activeBooking.quote.serviceName}
                    </span>
                    <span className="font-mono tabular-nums font-bold text-emerald-700">
                      S${activeBooking.quote.totalFare.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {activeBooking.fromName} → {activeBooking.toName}
                  </p>
                  <p className="text-xs font-medium text-slate-800">
                    Status:{' '}
                    {activeBooking.stage === 'matching'
                      ? 'Confirming operator dispatch'
                      : activeBooking.stage === 'assigned'
                        ? `Driver ${activeBooking.quote.driverName} (${activeBooking.quote.etaMinutes} min away)`
                        : 'Arrived at designated bay'}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    {activeBooking.stage !== 'arriving' && (
                      <button
                        type="button"
                        onClick={onAdvanceBooking}
                        className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                      >
                        Advance Status
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onCancelBooking}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                  <CarFront className="w-6 h-6 text-slate-400 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-800">No active ride dispatched</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Compare Grab, Gojek, Ryde, Tada, and Zig above to book your next trip.
                  </p>
                </div>
              )}
            </div>

            {/* Saved Articles Section */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 mb-3">
                Saved Google News Briefs ({savedArticles.length})
              </h3>
              {savedArticles.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                  <Bookmark className="w-6 h-6 text-slate-400 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-800">No saved briefs yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Bookmark stories in the Singapore Briefing feed to open them anytime on Google News.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedArticles.map((article) => (
                    <div
                      key={article.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-slate-800">{article.source}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{article.publishedAgo}</span>
                        </div>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-slate-900 hover:text-emerald-700 leading-snug inline-flex items-start gap-1"
                        >
                          <span>{article.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 mt-1" aria-hidden="true" />
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveSaved(article)}
                        aria-label={`Remove ${article.title} from saved`}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
          Live headlines link directly to Google News Singapore.
        </div>
      </div>
    </div>
  );
};
