import { useEffect, useState } from 'react';
import { CorporateBenefitsSection } from './components/CorporateBenefitsSection';
import { Header, NavTab } from './components/Header';
import { HeroShowcase } from './components/HeroShowcase';
import { LiveNewsItem, NewsFeedSection } from './components/NewsFeedSection';
import { ActiveBooking, RideAggregator } from './components/RideAggregator';
import { SavedBriefsDrawer } from './components/SavedBriefsDrawer';
import { TouristRoutesSection } from './components/TouristRoutesSection';
import {
  CorporateTripRecord,
  INITIAL_CORPORATE_TRIPS,
  OperatorQuote,
  SINGAPORE_LOCATIONS,
  TimeWindow,
} from './data/platformData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('ride-compare');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('evening_peak');
  const [fromId, setFromId] = useState<string>('raffles_place');
  const [toId, setToId] = useState<string>('tampines_hub');

  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(null);
  const [savedArticles, setSavedArticles] = useState<LiveNewsItem[]>([]);
  const [pushTopics, setPushTopics] = useState<string[]>(['commute_morning', 'rain_surge']);
  const [corporateTrips] = useState<CorporateTripRecord[]>(INITIAL_CORPORATE_TRIPS);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState<boolean>(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setMapsQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const scrollToElement = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'corporate-hub') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToElement(tab);
    }
  };

  const handleSelectTouristRoute = (newFromId: string, newToId: string) => {
    setFromId(newFromId);
    setToId(newToId);
    setActiveTab('ride-compare');
    scrollToElement('ride-compare');
  };

  const handleBookRide = (quote: OperatorQuote) => {
    const fromLoc =
      SINGAPORE_LOCATIONS.find((l) => l.id === fromId) ?? SINGAPORE_LOCATIONS[0];
    const toLoc =
      SINGAPORE_LOCATIONS.find((l) => l.id === toId) ?? SINGAPORE_LOCATIONS[1];

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    setActiveBooking({
      quote,
      fromName: fromLoc.name.split(' (')[0],
      toName: toLoc.name.split(' (')[0],
      pickupTip: fromLoc.pickupBayTip,
      stage: 'matching',
      bookedAt: `${timeStr} SGT`,
    });
  };

  const handleAdvanceBooking = () => {
    setActiveBooking((prev) => {
      if (!prev) return null;
      if (prev.stage === 'matching') return { ...prev, stage: 'assigned' };
      if (prev.stage === 'assigned') return { ...prev, stage: 'arriving' };
      return prev;
    });
  };

  const handleToggleSave = (article: LiveNewsItem) => {
    setSavedArticles((prev) =>
      prev.some((item) => item.id === article.id)
        ? prev.filter((item) => item.id !== article.id)
        : [article, ...prev]
    );
  };

  const handleTogglePushTopic = (topicId: string) => {
    setPushTopics((prev) =>
      prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        savedCount={savedArticles.length}
        hasActiveBooking={activeBooking !== null}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'corporate-hub' ? (
          <CorporateBenefitsSection
            trips={corporateTrips}
            onBackToMain={() => handleSelectTab('ride-compare')}
          />
        ) : (
          <>
            <HeroShowcase
              timeWindow={timeWindow}
              onTimeWindowChange={setTimeWindow}
              onJumpToCompare={() => handleSelectTab('ride-compare')}
            />

            <RideAggregator
              timeWindow={timeWindow}
              fromId={fromId}
              toId={toId}
              onChangeFrom={setFromId}
              onChangeTo={setToId}
              activeBooking={activeBooking}
              onBookRide={handleBookRide}
              onAdvanceBooking={handleAdvanceBooking}
              onCancelBooking={() => setActiveBooking(null)}
            />

            <TouristRoutesSection onSelectRoute={handleSelectTouristRoute} />

            <NewsFeedSection
              savedArticles={savedArticles}
              onToggleSave={handleToggleSave}
              pushTopics={pushTopics}
              onTogglePushTopic={handleTogglePushTopic}
            />
          </>
        )}
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-slate-900 text-sm">AnchorSG</span>
            <span aria-hidden="true">·</span>
            <span>Partner operators: Grab, Gojek, Ryde, Tada, Zig</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleSelectTab('ride-compare')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Ride Compare
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('route-map')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Route Map
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('news-feed')}
              className="hover:text-slate-900 cursor-pointer"
            >
              News Feed
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('corporate-hub')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Corporate Hub
            </button>
          </div>
        </div>
      </footer>

      <SavedBriefsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeBooking={activeBooking}
        onAdvanceBooking={handleAdvanceBooking}
        onCancelBooking={() => setActiveBooking(null)}
        savedArticles={savedArticles}
        onRemoveSaved={handleToggleSave}
        pushTopicsCount={pushTopics.length}
      />
    </div>
  );
}
