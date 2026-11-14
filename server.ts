import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

interface TopicConfig {
  googleRssUrl: string;
  googleUrl: string;
  illustration: LiveNewsItem['illustration'];
  companionRssUrls: string[];
  keywords: string[];
}

const TOPIC_CONFIGS: Record<string, TopicConfig> = {
  'Top Stories': {
    googleRssUrl: 'https://news.google.com/rss?hl=en-SG&gl=SG&ceid=SG:en',
    googleUrl: 'https://news.google.com/?hl=en-SG&gl=SG&ceid=SG:en',
    illustration: 'skyline',
    companionRssUrls: [
      'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=10416',
      'https://mothership.sg/feed/',
    ],
    keywords: [],
  },
  'Transport & ERP': {
    googleRssUrl:
      'https://news.google.com/rss/search?q=Singapore+transport+OR+MRT+OR+LTA+OR+traffic+OR+Grab&hl=en-SG&gl=SG&ceid=SG:en',
    googleUrl:
      'https://news.google.com/search?q=Singapore+transport+OR+MRT+OR+LTA+OR+Grab&hl=en-SG&gl=SG&ceid=SG:en',
    illustration: 'mrt',
    companionRssUrls: [
      'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=10416',
      'https://mothership.sg/feed/',
    ],
    keywords: ['mrt', 'lta', 'bus', 'train', 'traffic', 'road', 'car', 'taxi', 'grab', 'gojek', 'erp', 'cycling', 'changi', 'airport', 'rail', 'expressway'],
  },
  'Business & Tech': {
    googleRssUrl:
      'https://news.google.com/rss/search?q=Singapore+business+OR+fintech+OR+economy&hl=en-SG&gl=SG&ceid=SG:en',
    googleUrl:
      'https://news.google.com/search?q=Singapore+business+OR+fintech+OR+economy&hl=en-SG&gl=SG&ceid=SG:en',
    illustration: 'cbd',
    companionRssUrls: [
      'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6936',
      'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=10416',
    ],
    keywords: ['ai', 'tech', 'bank', 'fintech', 'market', 'economy', 'trade', 'nvidia', 'mas', 'singapore', 'firm', 'company', 'investment'],
  },
  'Travel & Dining': {
    googleRssUrl:
      'https://news.google.com/rss/search?q=Singapore+Changi+OR+Sentosa+OR+tourism+OR+dining&hl=en-SG&gl=SG&ceid=SG:en',
    googleUrl:
      'https://news.google.com/search?q=Singapore+Changi+OR+Sentosa+OR+tourism+OR+dining&hl=en-SG&gl=SG&ceid=SG:en',
    illustration: 'changi',
    companionRssUrls: [
      'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=10416',
      'https://mothership.sg/feed/',
    ],
    keywords: ['changi', 'flight', 'airline', 'sentosa', 'hotel', 'restaurant', 'food', 'ramen', 'dining', 'tourist', 'travel', 'sia', 'scoot'],
  },
  'Singapore Culture': {
    googleRssUrl:
      'https://news.google.com/rss/search?q=Singapore+events+OR+arts+OR+heritage+OR+lifestyle&hl=en-SG&gl=SG&ceid=SG:en',
    googleUrl:
      'https://news.google.com/search?q=Singapore+events+OR+arts+OR+heritage+OR+lifestyle&hl=en-SG&gl=SG&ceid=SG:en',
    illustration: 'skyline',
    companionRssUrls: [
      'https://mothership.sg/feed/',
      'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=10416',
    ],
    keywords: ['festival', 'art', 'heritage', 'culture', 'museum', 'park', 'concert', 'community', 'singapore', 'school', 'family'],
  },
  'Corporate Policy': {
    googleRssUrl:
      'https://news.google.com/rss/search?q=Singapore+workplace+OR+HR+OR+corporate+OR+MOM&hl=en-SG&gl=SG&ceid=SG:en',
    googleUrl:
      'https://news.google.com/search?q=Singapore+workplace+OR+HR+OR+corporate+OR+MOM&hl=en-SG&gl=SG&ceid=SG:en',
    illustration: 'cbd',
    companionRssUrls: [
      'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6936',
      'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=10416',
    ],
    keywords: ['work', 'job', 'salary', 'mom', 'hr', 'corporate', 'office', 'policy', 'budget', 'tax', 'gst', 'singapore'],
  },
};

const feedCache: Record<
  string,
  { fetchedAt: number; items: LiveNewsItem[]; googleUrl: string; googleLogoUrl: string | null }
> = {};
const CACHE_TTL_MS = 3 * 60 * 1000;

function decodeXmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatRelativeTime(pubDateStr: string): string {
  const dateMs = Date.parse(pubDateStr);
  if (Number.isNaN(dateMs)) return 'Recent';
  const diffMin = Math.max(1, Math.floor((Date.now() - dateMs) / 60000));
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1] : '';
}

function extractImageFromItem(rawItem: string): string | null {
  // 1. Check <media:content url="..."> or <media:thumbnail url="...">
  const mediaMatch = rawItem.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch?.[1] && !mediaMatch[1].includes('apple-touch-icon')) {
    return decodeXmlEntities(mediaMatch[1]);
  }
  // 2. Check <enclosure url="..." type="image/...">
  const enclosureMatch = rawItem.match(/<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (enclosureMatch?.[1]) {
    return decodeXmlEntities(enclosureMatch[1]);
  }
  // 3. Check <img src="..."> inside description/content:encoded
  const decodedContent = rawItem
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  const imgMatch = decodedContent.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (imgMatch?.[1] && !imgMatch[1].includes('pixel') && !imgMatch[1].includes('1x1')) {
    return imgMatch[1];
  }
  return null;
}

function normalizeWords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}

function wordOverlapScore(a: string, b: string): number {
  const setA = normalizeWords(a);
  const setB = normalizeWords(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let shared = 0;
  for (const w of setA) {
    if (setB.has(w)) shared++;
  }
  return shared / Math.min(setA.size, setB.size);
}

interface CompanionStory {
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  sourceDomain: string;
  pubDate: string;
}

async function fetchCompanionStories(urls: string[]): Promise<CompanionStory[]> {
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnchorSG/1.0)' },
          signal: AbortSignal.timeout(4500),
        });
        if (!res.ok) return [];
        const xml = await res.text();
        const isCna = url.includes('channelnewsasia.com');
        const source = isCna ? 'CNA' : 'Mothership';
        const sourceDomain = isCna ? 'channelnewsasia.com' : 'mothership.sg';
        const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

        const stories: CompanionStory[] = [];
        for (const block of itemBlocks.slice(0, 15)) {
          const title = decodeXmlEntities(extractTag(block, 'title'));
          const imageUrl = extractImageFromItem(block);
          const desc = decodeXmlEntities(extractTag(block, 'description'));
          const pubDate = decodeXmlEntities(extractTag(block, 'pubDate'));
          if (title && imageUrl) {
            stories.push({
              title,
              summary: desc || `Latest Singapore reporting from ${source}.`,
              imageUrl,
              source,
              sourceDomain,
              pubDate,
            });
          }
        }
        return stories;
      } catch {
        return [];
      }
    })
  );
  return results.flat();
}

function parseGoogleNewsRss(
  xml: string,
  topic: string,
  defaultIllustration: LiveNewsItem['illustration'],
  companions: CompanionStory[]
): { items: LiveNewsItem[]; googleLogoUrl: string | null } {
  const channelLogoMatch = xml.match(/<image>[\s\S]*?<url>([^<]+)<\/url>[\s\S]*?<\/image>/i);
  const googleLogoUrl = channelLogoMatch?.[1]?.trim() ?? null;

  const items: LiveNewsItem[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];
  const illustrations: LiveNewsItem['illustration'][] = ['skyline', 'mrt', 'changi', 'cbd'];

  for (let i = 0; i < Math.min(itemMatches.length, 14); i++) {
    const rawItem = itemMatches[i];
    const rawTitle = decodeXmlEntities(extractTag(rawItem, 'title'));
    const rawLink = decodeXmlEntities(extractTag(rawItem, 'link'));
    const rawPubDate = decodeXmlEntities(extractTag(rawItem, 'pubDate'));
    const rawSource = decodeXmlEntities(extractTag(rawItem, 'source'));
    const rawDesc = decodeXmlEntities(extractTag(rawItem, 'description'));
    const sourceUrlMatch = rawItem.match(/<source[^>]+url=["']([^"']+)["']/i);
    const sourceUrl = sourceUrlMatch?.[1] ?? '';

    if (!rawTitle || !rawLink) continue;

    let cleanTitle = rawTitle;
    let sourceName = rawSource || 'Google News';
    const dashIdx = rawTitle.lastIndexOf(' - ');
    if (dashIdx > 12) {
      cleanTitle = rawTitle.slice(0, dashIdx).trim();
      if (!rawSource) {
        sourceName = rawTitle.slice(dashIdx + 3).trim();
      }
    }

    let sourceDomain = '';
    try {
      if (sourceUrl) sourceDomain = new URL(sourceUrl).hostname;
    } catch {
      sourceDomain = '';
    }

    const sourceFaviconUrl = sourceDomain
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(sourceDomain)}&sz=64`
      : null;

    // Check inline RSS image or match against companion story photo
    let imageUrl = extractImageFromItem(rawItem);
    if (!imageUrl) {
      let bestScore = 0;
      for (const c of companions) {
        const score = wordOverlapScore(cleanTitle, c.title);
        if (score >= 0.4 && score > bestScore) {
          bestScore = score;
          imageUrl = c.imageUrl;
        }
      }
    }

    const cleanSummary =
      rawDesc && rawDesc !== cleanTitle
        ? rawDesc.replace(cleanTitle, '').replace(sourceName, '').trim() ||
          `Coverage from ${sourceName} via Google News Singapore.`
        : `Read full reporting from ${sourceName} on Google News.`;

    const illustration = i === 0 ? defaultIllustration : illustrations[i % illustrations.length];
    const linkHash = crypto.createHash('sha1').update(rawLink).digest('hex').slice(0, 16);

    items.push({
      id: `gn-${linkHash}-${i}`,
      title: cleanTitle,
      summary: cleanSummary,
      url: rawLink,
      imageUrl,
      sourceFaviconUrl,
      source: sourceName,
      publishedAt: rawPubDate,
      publishedAgo: formatRelativeTime(rawPubDate),
      topic,
      illustration,
    });
  }

  return { items, googleLogoUrl };
}

function getRuntimeMapsApiKey(): string {
  return (
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    ''
  ).trim();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get('/api/maps-config', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ apiKey: getRuntimeMapsApiKey() });
  });

  app.get('/api/news', async (req, res) => {
    const requestedTopic = typeof req.query.topic === 'string' ? req.query.topic : 'Top Stories';
    const topicConfig = TOPIC_CONFIGS[requestedTopic] ?? TOPIC_CONFIGS['Top Stories'];
    const topicName = TOPIC_CONFIGS[requestedTopic] ? requestedTopic : 'Top Stories';

    const cached = feedCache[topicName];
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      res.json({
        topic: topicName,
        googleNewsPortalUrl: cached.googleUrl,
        googleLogoUrl: cached.googleLogoUrl,
        items: cached.items,
        fetchedAt: new Date(cached.fetchedAt).toISOString(),
      });
      return;
    }

    try {
      const [gnResponse, companions] = await Promise.all([
        fetch(topicConfig.googleRssUrl, {
          headers: {
            'User-Agent': 'AnchorSG-FeedReader/1.0 (+https://news.google.com/)',
            Accept: 'application/rss+xml, application/xml, text/xml',
          },
        }),
        fetchCompanionStories(topicConfig.companionRssUrls),
      ]);

      if (!gnResponse.ok) {
        throw new Error(`Upstream Google News RSS returned ${gnResponse.status}`);
      }

      const xml = await gnResponse.text();
      const { items: googleItems, googleLogoUrl } = parseGoogleNewsRss(
        xml,
        topicName,
        topicConfig.illustration,
        companions
      );

      // Build photo-rich items from matched companion stories whose titles match topic keywords
      const usedTitles = new Set(googleItems.map((it) => it.title.toLowerCase()));
      const matchingCompanions = companions
        .filter((c) => {
          if (usedTitles.has(c.title.toLowerCase())) return false;
          if (topicConfig.keywords.length === 0) return true;
          const lower = `${c.title} ${c.summary}`.toLowerCase();
          return topicConfig.keywords.some((kw) => lower.includes(kw));
        })
        .slice(0, 6)
        .map((c, idx): LiveNewsItem => {
          const gnSearchUrl = `https://news.google.com/search?q=${encodeURIComponent(c.title)}&hl=en-SG&gl=SG&ceid=SG:en`;
          const hash = crypto.createHash('sha1').update(gnSearchUrl).digest('hex').slice(0, 16);
          return {
            id: `gn-photo-${hash}-${idx}`,
            title: c.title,
            summary: c.summary,
            url: gnSearchUrl,
            imageUrl: c.imageUrl,
            sourceFaviconUrl: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(c.sourceDomain)}&sz=64`,
            source: c.source,
            publishedAt: c.pubDate,
            publishedAgo: formatRelativeTime(c.pubDate),
            topic: topicName,
            illustration: topicConfig.illustration,
          };
        });

      // Prioritize items that have real news photographs at the top of the feed
      const combined = [...googleItems, ...matchingCompanions];
      const withPhotos = combined.filter((it) => Boolean(it.imageUrl));
      const withoutPhotos = combined.filter((it) => !it.imageUrl);
      const finalItems = [...withPhotos, ...withoutPhotos].slice(0, 12);

      feedCache[topicName] = {
        fetchedAt: Date.now(),
        items: finalItems,
        googleUrl: topicConfig.googleUrl,
        googleLogoUrl,
      };

      res.json({
        topic: topicName,
        googleNewsPortalUrl: topicConfig.googleUrl,
        googleLogoUrl,
        items: finalItems,
        fetchedAt: new Date().toISOString(),
      });
    } catch {
      if (cached) {
        res.json({
          topic: topicName,
          googleNewsPortalUrl: cached.googleUrl,
          googleLogoUrl: cached.googleLogoUrl,
          items: cached.items,
          fetchedAt: new Date(cached.fetchedAt).toISOString(),
        });
        return;
      }
      res.status(502).json({
        error: 'Unable to reach Google News RSS feed right now.',
        googleNewsPortalUrl: topicConfig.googleUrl,
        googleLogoUrl: null,
        items: [],
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const distIndexPath = path.join(distPath, 'index.html');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (_req, res) => {
      try {
        const html = fs.readFileSync(distIndexPath, 'utf8');
        const runtimeScript = `<script>window.__ANCHORSG_CONFIG__=${JSON.stringify({
          googleMapsApiKey: getRuntimeMapsApiKey(),
        })};</script>`;
        const injectedHtml = html.includes('</head>')
          ? html.replace('</head>', `${runtimeScript}</head>`)
          : `${runtimeScript}${html}`;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.send(injectedHtml);
      } catch {
        res.sendFile(distIndexPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnchorSG server running on http://localhost:${PORT}`);
  });
}

startServer();
