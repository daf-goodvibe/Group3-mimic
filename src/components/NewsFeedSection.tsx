import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  Check,
  ExternalLink,
  Newspaper,
  RefreshCw,
  Search,
} from 'lucide-react';
import { NEWS_ARTICLES } from '../data/platformData';
import { EditorialIllustration } from './EditorialIllustrations';

export interface LiveNewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string | null;
  sourceFaviconUrl: string | null;
  source: string;
  publishedAt: string;
  publishedAgo: string;
  topic: string;
  illustration: 'skyline' | 'mrt' | 'changi' | 'cbd';
}

interface NewsFeedSectionProps {
  savedArticles: LiveNewsItem[];
  onToggleSave: (article: LiveNewsItem) => void;
  pushTopics: string[];
  onTogglePushTopic: (topic: string) => void;
}

const TOPICS = [
  'Top Stories',
  'Transport & ERP',
  'Business & Tech',
  'Travel & Dining',
  'Singapore Culture',
  'Corporate Policy',
] as const;

type NewsTopic = (typeof TOPICS)[number];

const TOPIC_GOOGLE_NEWS_LINKS: Record<NewsTopic, string> = {
  'Top Stories': 'https://news.google.com/?hl=en-SG&gl=SG&ceid=SG:en',
  'Transport & ERP':
    'https://news.google.com/search?q=Singapore+transport+OR+MRT+OR+LTA+OR+Grab&hl=en-SG&gl=SG&ceid=SG:en',
  'Business & Tech':
    'https://news.google.com/search?q=Singapore+business+OR+fintech+OR+economy&hl=en-SG&gl=SG&ceid=SG:en',
  'Travel & Dining':
    'https://news.google.com/search?q=Singapore+Changi+OR+Sentosa+OR+tourism+OR+dining&hl=en-SG&gl=SG&ceid=SG:en',
  'Singapore Culture':
    'https://news.google.com/search?q=Singapore+events+OR+arts+OR+heritage+OR+lifestyle&hl=en-SG&gl=SG&ceid=SG:en',
  'Corporate Policy':
    'https://news.google.com/search?q=Singapore+workplace+OR+HR+OR+corporate+OR+MOM&hl=en-SG&gl=SG&ceid=SG:en',
};

const PUSH_CHANNELS = [
  {
    id: 'commute_morning',
    label: '07:45 Peak Commute & Business Brief',
    desc: 'ERP gantry timing + top SG market headlines',
  },
  {
    id: 'rain_surge',
    label: 'Tropical Rain & Dynamic Surge Alert',
    desc: 'Instant prompt when Tada/Zig beat Grab/Gojek surge',
  },
  {
    id: 'tourist_events',
    label: 'Singapore Heritage & Road Closure Push',
    desc: 'Weekend Marina Bay, Orchard & Changi pickup tips',
  },
  {
    id: 'corporate_digest',
    label: 'Corporate Mobility Policy & Allowance Brief',
    desc: 'Weekly GST receipt summary & cap alerts',
  },
];

function buildFallbackItems(topic: NewsTopic): LiveNewsItem[] {
  const matching =
    topic === 'Top Stories'
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter((a) => a.topic === topic);
  const list = matching.length > 0 ? matching : NEWS_ARTICLES;
  return list.map((a) => ({
    id: a.id,
    title: a.title,
    summary: a.summary,
    url: `https://news.google.com/search?q=${encodeURIComponent(a.title)}&hl=en-SG&gl=SG&ceid=SG:en`,
    imageUrl: null,
    sourceFaviconUrl: null,
    source: a.source,
    publishedAt: '',
    publishedAgo: a.publishedAgo,
    topic: a.topic,
    illustration: a.illustration,
  }));
}

function ArticleThumbnail({
  article,
  className = '',
}: {
  article: LiveNewsItem;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!article.imageUrl || imgFailed) {
    return <EditorialIllustration variant={article.illustration} className={className} />;
  }

  return (
    <img
      src={article.imageUrl}
      alt={article.title}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setImgFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}

function SourceBadge({
  source,
  faviconUrl,
}: {
  source: string;
  faviconUrl: string | null;
}) {
  const [iconFailed, setIconFailed] = useState(false);

  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
      {faviconUrl && !iconFailed && (
        <img
          src={faviconUrl}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={() => setIconFailed(true)}
          className="w-3.5 h-3.5 rounded-xs object-contain shrink-0"
        />
      )}
      <span>{source}</span>
    </span>
  );
}

export const NewsFeedSection: React.FC<NewsFeedSectionProps> = ({
  savedArticles,
  onToggleSave,
  pushTopics,
  onTogglePushTopic,
}) => {
  const [activeTopic, setActiveTopic] = useState<NewsTopic>('Top Stories');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<LiveNewsItem[]>([]);
  const [portalUrl, setPortalUrl] = useState<string>(TOPIC_GOOGLE_NEWS_LINKS['Top Stories']);
  const [googleLogoUrl, setGoogleLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  const fetchFeed = useCallback(async (topic: NewsTopic) => {
    setLoading(true);
    setUsingFallback(false);

    const attemptFetch = async () => {
      const res = await fetch(`/api/news?topic=${encodeURIComponent(topic)}`);
      const rawText = await res.text();
      let parsed: {
        items?: LiveNewsItem[];
        googleNewsPortalUrl?: string;
        googleLogoUrl?: string | null;
        error?: string;
      } | null = null;

      try {
        parsed = JSON.parse(rawText);
      } catch {
        throw new Error('Feed endpoint returned non-JSON response');
      }

      if (!res.ok || !parsed?.items || parsed.items.length === 0) {
        throw new Error(parsed?.error || 'Live feed temporarily unavailable');
      }
      return parsed;
    };

    try {
      let data;
      try {
        data = await attemptFetch();
      } catch {
        await new Promise((r) => setTimeout(r, 500));
        data = await attemptFetch();
      }
      setArticles(data.items ?? []);
      setPortalUrl(data.googleNewsPortalUrl || TOPIC_GOOGLE_NEWS_LINKS[topic]);
      setGoogleLogoUrl(data.googleLogoUrl ?? null);
    } catch {
      setArticles(buildFallbackItems(topic));
      setPortalUrl(TOPIC_GOOGLE_NEWS_LINKS[topic]);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(activeTopic);
  }, [activeTopic, fetchFeed]);

  const savedIdSet = useMemo(
    () => new Set(savedArticles.map((a) => a.id)),
    [savedArticles]
  );

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return articles;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
    );
  }, [articles, searchQuery]);

  const leadArticle = filteredArticles[0] ?? null;
  const secondaryArticles = filteredArticles.slice(1, 7);

  return (
    <section id="news-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header + Google News Portal Hotlink + Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            {googleLogoUrl && (
              <img
                src={googleLogoUrl}
                alt="Google News"
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-xs object-contain"
              />
            )}
            <span>
              {usingFallback ? 'Singapore Google News Briefings' : 'Live Singapore Headlines'}
            </span>
            <span aria-hidden="true">·</span>
            <a
              href="https://news.google.com/?hl=en-SG&gl=SG&ceid=SG:en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-700 underline underline-offset-2"
            >
              <span>Powered by Google News</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Your Singapore Briefing
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter headlines..."
              aria-label="Filter Google News headlines"
              className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => fetchFeed(activeTopic)}
            disabled={loading}
            className="h-10 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Refresh</span>
          </button>

          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open Google News</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Google News-Style Topic Filter Bar */}
      <div
        role="tablist"
        aria-label="Google News Singapore topics"
        className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-200"
      >
        {TOPICS.map((topic) => {
          const active = activeTopic === topic;
          return (
            <button
              key={topic}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setActiveTopic(topic)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {/* Main 12-Column Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Live Google News Stories */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-52 animate-pulse flex flex-col justify-between">
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-full bg-slate-100 rounded" />
                </div>
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-2xl p-5 h-56 animate-pulse space-y-3"
                  >
                    <div className="h-24 bg-slate-100 rounded-lg" />
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-5 w-full bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <Newspaper className="w-8 h-8 text-slate-400 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-display text-base font-semibold text-slate-900">
                No headlines match "{searchQuery}"
              </h3>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <>
              {/* Lead Hotlinked Google News Story */}
              {leadArticle && (
                <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                    <a
                      href={leadArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md:col-span-5 bg-slate-100 min-h-56 block overflow-hidden"
                    >
                      <ArticleThumbnail article={leadArticle} />
                    </a>
                    <div className="md:col-span-7 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                          <SourceBadge
                            source={leadArticle.source}
                            faviconUrl={leadArticle.sourceFaviconUrl}
                          />
                          <span aria-hidden="true">·</span>
                          <span>{leadArticle.publishedAgo}</span>
                          <span aria-hidden="true">·</span>
                          <span>{leadArticle.topic}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                          <a
                            href={leadArticle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-700 transition-colors inline-flex items-start gap-1.5"
                          >
                            <span>{leadArticle.title}</span>
                          </a>
                        </h3>
                        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {leadArticle.summary}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                        >
                          <span>More {activeTopic} on Google News</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => onToggleSave(leadArticle)}
                            aria-label={
                              savedIdSet.has(leadArticle.id)
                                ? 'Remove story from saved'
                                : 'Save story'
                            }
                            className={`inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                              savedIdSet.has(leadArticle.id)
                                ? 'text-emerald-700'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                savedIdSet.has(leadArticle.id) ? 'fill-emerald-700' : ''
                              }`}
                              aria-hidden="true"
                            />
                            <span>
                              {savedIdSet.has(leadArticle.id) ? 'Saved' : 'Save'}
                            </span>
                          </button>
                          <a
                            href={leadArticle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                          >
                            <span>Read on Google News</span>
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Secondary Hotlinked Stories Grid */}
              {secondaryArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {secondaryArticles.map((article) => {
                    const isSaved = savedIdSet.has(article.id);
                    return (
                      <article
                        key={article.id}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
                      >
                        <div>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-40 w-full bg-slate-100 border-b border-slate-200 block overflow-hidden"
                          >
                            <ArticleThumbnail article={article} />
                          </a>
                          <div className="p-5">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                              <SourceBadge
                                source={article.source}
                                faviconUrl={article.sourceFaviconUrl}
                              />
                              <span aria-hidden="true">·</span>
                              <span>{article.publishedAgo}</span>
                            </div>
                            <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-emerald-700 transition-colors"
                              >
                                {article.title}
                              </a>
                            </h3>
                            <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">
                              {article.summary}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                          >
                            <span>Open Story</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                          <button
                            type="button"
                            onClick={() => onToggleSave(article)}
                            aria-label={isSaved ? 'Unsave story' : 'Save story'}
                            className={`inline-flex items-center gap-1 text-xs font-medium cursor-pointer ${
                              isSaved
                                ? 'text-emerald-700'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                isSaved ? 'fill-emerald-700' : ''
                              }`}
                              aria-hidden="true"
                            />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right 4 Columns: Personalised Push Notification Subscriptions */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-slate-900">
              Personalised Push Alerts
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
            Subscribe to proactive Singapore transit, ERP, rain-surge, and Google News briefing pushes.
          </p>

          <div className="mt-4 space-y-2.5">
            {PUSH_CHANNELS.map((ch) => {
              const enabled = pushTopics.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onTogglePushTopic(ch.id)}
                  aria-pressed={enabled}
                  className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    enabled
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="block text-xs font-semibold text-slate-900">
                      {ch.label}
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {ch.desc}
                    </span>
                  </div>
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                      enabled
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Active push channels</span>
            <span className="font-mono tabular-nums font-semibold text-slate-900">
              {pushTopics.length} / {PUSH_CHANNELS.length}
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
};
