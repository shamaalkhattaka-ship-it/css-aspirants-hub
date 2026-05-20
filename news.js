// api/news.js — Vercel Serverless Function
// Proxies NewsAPI requests server-side so CORS is never an issue

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q = 'Pakistan', category = 'general', pageSize = 20 } = req.query;

  const API_KEY = process.env.NEWS_API_KEY || '4377b4352dae470da7f91a286661cd00';

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'ok') {
      return res.status(400).json({ error: data.message || 'NewsAPI error' });
    }

    // Clean and normalise articles
    const articles = (data.articles || [])
      .filter(a => a.title && a.title !== '[Removed]' && a.description)
      .map(a => ({
        id: Buffer.from(a.url).toString('base64').slice(0, 12),
        title: a.title,
        summary: a.description || '',
        source: a.source?.name || 'Unknown',
        url: a.url,
        image: a.urlToImage || null,
        date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
        rawDate: a.publishedAt,
      }));

    return res.status(200).json({ articles, total: data.totalResults });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
