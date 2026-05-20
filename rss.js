// api/rss.js — Vercel Serverless Function
// Fetches and parses RSS feeds from Dawn, Express Tribune, Geo

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const feeds = [
    { name: 'Dawn', url: 'https://www.dawn.com/feeds/home', category: 'national' },
    { name: 'Dawn World', url: 'https://www.dawn.com/feeds/world-news', category: 'global' },
    { name: 'Dawn Business', url: 'https://www.dawn.com/feeds/business', category: 'economy' },
    { name: 'Express Tribune', url: 'https://tribune.com.pk/feed', category: 'national' },
    { name: 'Geo News', url: 'https://www.geo.tv/rss/1/news', category: 'national' },
  ];

  const results = [];

  for (const feed of feeds) {
    try {
      const resp = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 CSS-Hub/1.0' },
        signal: AbortSignal.timeout(5000),
      });
      const xml = await resp.text();

      // Parse XML items
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
      for (const item of items.slice(0, 8)) {
        const content = item[1];
        const title = stripTags(extract(content, 'title'));
        const link = extract(content, 'link') || extractCDATA(content, 'link');
        const description = stripTags(extractCDATA(content, 'description') || extract(content, 'description'));
        const pubDate = extract(content, 'pubDate');

        if (!title || title === '[Removed]') continue;

        results.push({
          id: Buffer.from(link || title).toString('base64').slice(0, 12),
          title,
          summary: description?.slice(0, 300) || '',
          source: feed.name,
          url: link,
          date: pubDate ? new Date(pubDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
          rawDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          category: feed.category,
          isRSS: true,
        });
      }
    } catch (e) {
      // Feed failed silently — continue with others
    }
  }

  // Sort by date newest first
  results.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

  return res.status(200).json({ articles: results.slice(0, 40) });
}

function extract(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`));
  return m ? m[1].trim() : '';
}

function extractCDATA(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
}

function stripTags(str) {
  return (str || '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}
