import React from 'react';
import { BookmarkCheck, CarFront } from 'lucide-react';

export type NavTab = 'ride-compare' | 'route-map' | 'news-feed' | 'corporate-hub';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
  hasActiveBooking: boolean;
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  hasActiveBooking,
  onOpenDrawer,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'ride-compare', label: 'Ride Compare' },
    { id: 'route-map', label: 'Route Map' },
    { id: 'news-feed', label: 'News Feed' },
    { id: 'corporate-hub', label: 'Corporate Hub' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#ride-compare"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('ride-compare');
          }}
          className="font-display text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 rounded"
        >
          AnchorSG
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-7 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 ${
                  isActive
                    ? 'text-slate-900 border-emerald-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="shrink-0 hidden sm:block">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {hasActiveBooking ? (
              <>
                <CarFront className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Active Trip</span>
              </>
            ) : (
              <>
                <BookmarkCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Saved Briefs ({savedCount})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
