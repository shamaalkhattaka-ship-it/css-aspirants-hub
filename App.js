import { useState, useEffect, useRef, useCallback } from "react";

// ─── Static Data (your original content preserved) ───────────────────────────

const CATEGORIES = [
  { id: "all", label: "All Topics", icon: "🌐" },
  { id: "conflicts", label: "Conflicts & Security", icon: "⚔️" },
  { id: "foreign-policy", label: "Foreign Policy", icon: "🤝" },
  { id: "economy", label: "Economy", icon: "📈" },
  { id: "politics", label: "Politics", icon: "🏛️" },
  { id: "climate", label: "Climate", icon: "🌿" },
  { id: "governance", label: "Governance", icon: "⚖️" },
  { id: "social", label: "Social Issues", icon: "👥" },
  { id: "science", label: "Science & Tech", icon: "🔬" },
];

const NEWS_TOPICS = [
  { label: "Pakistan", query: "Pakistan politics economy" },
  { label: "Kashmir", query: "Kashmir India Pakistan" },
  { label: "IMF Pakistan", query: "IMF Pakistan economy" },
  { label: "Gaza", query: "Gaza Palestine ceasefire" },
  { label: "Climate", query: "Pakistan climate heatwave" },
  { label: "Afghanistan", query: "Pakistan Afghanistan TTP" },
  { label: "Geopolitics", query: "US China geopolitics 2026" },
  { label: "Economy", query: "Pakistan economy trade" },
];

const ISSUES = [
  {
    id: 1, title: "Operation Sindoor & the India-Pakistan Ceasefire",
    category: "conflicts", scope: "national", date: "May 10, 2026", source: "Dawn / Express Tribune",
    summary: "India launched cross-border strikes on May 7 under 'Operation Sindoor' targeting nine alleged militant camps inside Pakistan and Pakistan-administered Kashmir, citing the April 22 Pahalgam attack that killed 26 civilians. Pakistan retaliated with Operation Bunyan-un-Marsoos, downing five Indian jets including Rafales and intercepting 77 Israeli-origin Harop drones. After four days of the most intense cross-border fighting since 1971, a ceasefire was brokered by the US on May 10 — with Trump personally claiming credit during his Gulf tour. India frames the strikes as 'non-escalatory and precise'; Pakistan calls the Wagah closure and Indus Waters Treaty suspension 'acts of war'.",
    editorial: { author: "Zahid Hussain", outlet: "Dawn", date: "May 7, 2026", text: "The ceasefire is holding — for now. But both sides' domestic politics make de-escalation a fragile enterprise. Modi cannot afford to appear weak ahead of state elections; Islamabad's military cannot be seen to have conceded. The real test is not whether missiles fly again, but whether the two states can find a legal and diplomatic off-ramp." },
    tags: ["Operation Sindoor", "Ceasefire", "Kashmir", "India-Pakistan"]
  },
  {
    id: 2, title: "Pakistan's US-Iran Mediation & the Islamabad Talks",
    category: "foreign-policy", scope: "national", date: "April–May 2026", source: "Al Jazeera / Dawn",
    summary: "Pakistan brokered a landmark two-week US-Iran ceasefire on April 8, 2026 — later extended indefinitely — ending weeks of fighting that began with joint US-Israeli strikes killing Iran's Supreme Leader in late February. PM Shehbaz Sharif announced the ceasefire publicly, positioning Islamabad as the venue for the 'Islamabad Talks'. Pakistan's unique leverage: it holds Iranian interests in Washington, shares a 900km border with Iran, has a mutual defence pact with Saudi Arabia.",
    editorial: { author: "Maleeha Lodhi", outlet: "Dawn", date: "April 20, 2026", text: "The security, economic and diplomatic consequences of the Iran war will be felt for a long time. Pakistan's mediation is a genuine diplomatic achievement — but it is also hostage to forces beyond Islamabad's control. Pakistan must resist the temptation to overstate its leverage." },
    tags: ["Iran War", "Islamabad Talks", "Pakistan Diplomacy", "US-Iran"]
  },
  {
    id: 3, title: "Gaza: Phase Two Ceasefire & Trump's 'Board of Peace'",
    category: "conflicts", scope: "global", date: "January–May 2026", source: "Dawn / UN Press",
    summary: "Gaza's phase-two ceasefire remains fragile, with the UN reporting continued Israeli strikes, rapid West Bank deterioration, and a looming risk of collapse. Trump's 'Board of Peace' — a parallel multilateral framework replacing UN oversight — has drawn fierce criticism. Pakistan controversially joined the board in January 2026, drawing rare cross-party condemnation domestically.",
    editorial: { author: "Zahid Hussain", outlet: "Dawn", date: "January 22, 2026", text: "Pakistan has done this in a hurry. They should have waited. The board raises a fundamental question about our foreign policy: do we simply follow Trump's diktat? Pakistan will be sitting with Israel — the very perpetrator — on this board, while Palestinians have no representation." },
    tags: ["Gaza", "Board of Peace", "Palestine", "Trump"]
  },
  {
    id: 4, title: "Trump's Gulf Tour & the New Petrodollar Diplomacy",
    category: "foreign-policy", scope: "global", date: "May 13–16, 2025", source: "Express Tribune / Reuters",
    summary: "Trump's first major foreign trip of his second term — to Saudi Arabia, Qatar, and the UAE — redefined American engagement in the Middle East. In Riyadh, Trump secured pledges worth hundreds of billions in US investment and used 'trade as diplomacy' to claim credit for the India-Pakistan ceasefire.",
    editorial: { author: "Maleeha Lodhi", outlet: "Dawn", date: "May 4, 2026", text: "Trump's trade-for-peace framing is analytically shallow but politically real: for a transactional White House, every intervention is a future invoice. Pakistan must not mistake American brokerage for American commitment." },
    tags: ["Trump", "Gulf Tour", "Saudi Arabia", "Transactional Diplomacy"]
  },
  {
    id: 5, title: "Pakistan-Afghanistan: Border War & TTP Escalation",
    category: "conflicts", scope: "national", date: "February–May 2026", source: "Dawn / Al Jazeera",
    summary: "Pakistan is simultaneously engaged in what officials describe as an 'open war' against the Afghan Taliban, while fighting TTP militancy domestically. Islamabad closed the border and halted trade in February 2026, raising costs for Kabul's inaction on TTP.",
    editorial: { author: "Maleeha Lodhi", outlet: "Dawn", date: "February 16, 2026", text: "By closing the border and halting trade, Islamabad is raising the costs for Kabul's inaction on TTP. This is a calibrated coercive diplomacy — but it carries risks. Pakistan needs a dual-track approach: pressure alongside a credible political offer." },
    tags: ["TTP", "Afghanistan", "Border War", "Security"]
  },
  {
    id: 6, title: "IMF Programme & Pakistan's Fiscal Consolidation",
    category: "economy", scope: "national", date: "2025–2026", source: "Dawn / Express Tribune",
    summary: "Pakistan's ongoing IMF stabilisation programme has imposed stringent fiscal conditions, including energy subsidy removal, tax base expansion, and SOE restructuring. The Iran war disrupted global oil markets — Brent crude spiked toward $110/barrel — worsening Pakistan's import bill, before the US-Iran ceasefire brought prices down 15%.",
    editorial: { author: "Zahid Hussain", outlet: "Dawn", date: "May 7, 2026", text: "Pakistan's recurring IMF cycles are symptoms of a structural pathology: an economy that taxes the poor through energy tariffs while exempting the powerful through political patronage. The real question is whether it can build the tax base and institutional capacity to stop needing bailouts every three years." },
    tags: ["IMF", "Fiscal Policy", "Oil Prices", "Economy"]
  },
  {
    id: 7, title: "West Bank Annexation & the Collapse of Two-State Horizon",
    category: "conflicts", scope: "global", date: "2025–2026", source: "UN Security Council / Chatham House",
    summary: "The UN Under-Secretary-General for Political Affairs told the Security Council in February 2026 that the world is 'witnessing the gradual de facto annexation of the West Bank' as Israeli unilateral steps transform the landscape.",
    editorial: { author: "Maleeha Lodhi", outlet: "Dawn", date: "January 26, 2026", text: "What is being constructed in the West Bank is not a peace process — it is the administrative apparatus of permanent occupation. True solidarity with Palestine is not joining Trump's board — it is insisting, in every multilateral forum, that occupation is the root cause and statehood the only solution." },
    tags: ["West Bank", "Annexation", "Two-State Solution", "Israel"]
  },
  {
    id: 8, title: "Pakistan's Digital Economy & Governance of the Internet",
    category: "governance", scope: "national", date: "2025–2026", source: "Dawn",
    summary: "Pakistan has made meaningful progress in digital financial services, but PECA amendments, VPN bans, and episodic internet shutdowns have created a contradictory policy environment. Dawn reported that internet shutdowns cost Pakistan billions annually and undermine investor confidence.",
    editorial: { author: "Zahid Hussain", outlet: "Dawn", date: "February 2026", text: "Pakistan's digital economy cannot be simultaneously open to fintech and closed to political expression — the infrastructure is the same. Every internet shutdown sends a signal not just to dissidents but to foreign investors and digital entrepreneurs." },
    tags: ["Digital Economy", "PECA", "Cyber Governance", "Internet"]
  },
  {
    id: 9, title: "AI Governance & the Global Regulatory Race",
    category: "science", scope: "global", date: "2025–2026", source: "MIT Technology Review / Dawn",
    summary: "The EU AI Act came into effect progressively through 2025. DeepSeek triggered a $1 trillion-plus global equity sell-off by releasing a competitive reasoning model at a fraction of Western costs. For Pakistan and developing nations, the risk is 'regulatory colonialism' — having AI governance frameworks imposed rather than co-designed.",
    editorial: { author: "Maleeha Lodhi", outlet: "Dawn", date: "February 9, 2026", text: "The next decade of geopolitics will be shaped not by troop deployments but by who controls the algorithms that run financial systems, power grids, and weapons platforms. Pakistan's absence from these conversations is a strategic deficit." },
    tags: ["AI Governance", "DeepSeek", "EU AI Act", "Tech Geopolitics"]
  },
  {
    id: 10, title: "Pakistan's Youth Bulge & the Education Emergency",
    category: "social", scope: "national", date: "2025–2026", source: "Dawn",
    summary: "With 26 million out-of-school children and education spending below 2% of GDP, Pakistan's education crisis is a structural threat to its demographic dividend. Article 25-A's constitutional guarantee of free and compulsory education for children aged 5–16 remains largely unimplemented.",
    editorial: { author: "Maleeha Lodhi", outlet: "Dawn", date: "March 2, 2026", text: "The young feel ignored and excluded even though it is they who will determine Pakistan's future. Pakistan's political class speaks endlessly of demographic dividends but treats education as a budget line, not a national project." },
    tags: ["Education", "Youth", "Article 25-A", "Social Policy"]
  },
  {
    id: 11, title: "Pakistan's Climate Vulnerability Post-Iran War",
    category: "climate", scope: "national", date: "May 2026", source: "Dawn",
    summary: "Pakistan's climate vulnerability is compounded by the Iran war's disruption of energy supply chains. The 2026 heatwave season arrived early. The Strait of Hormuz crisis drove fuel prices to record highs, affecting agriculture, transport, and industry simultaneously.",
    editorial: { author: "Dawn Editorial Board", outlet: "Dawn", date: "May 6, 2026", text: "Another heatwave season has begun, and once again, the state is scrambling to respond to conditions it has long been warned about. Climate adaptation is not a future challenge — it is a present emergency." },
    tags: ["Climate", "Heatwave", "Loss and Damage", "COP"]
  },
  {
    id: 12, title: "Trump's Tariffs & the Fracturing of Global Trade",
    category: "economy", scope: "global", date: "2025–2026", source: "Express Tribune / Dawn",
    summary: "Trump's second-term tariff regime triggered a global financial freefall before a partial retreat. Pakistan faces a dual vulnerability: export exposure to US tariffs on textiles and a dependence on the dollar-based financial system Trump is weaponising.",
    editorial: { author: "Maleeha Lodhi", outlet: "Dawn", date: "March 16, 2026", text: "A global financial freefall triggered by sudden tariffs forced a partial retreat — demonstrating that even hegemonic powers are constrained by market interdependence. For Pakistan, the lesson is not to align uncritically with either Washington or Beijing." },
    tags: ["Trump Tariffs", "Global Trade", "WTO", "Protectionism"]
  },
];

const FLASHCARDS = [
  { id: 1, category: "conflicts", front: "What was Operation Sindoor (May 2026)?", back: "India's tri-service cross-border strikes on nine alleged militant camps inside Pakistan and Pakistan-administered Kashmir on May 7, 2026, in retaliation for the April 22 Pahalgam attack killing 26 civilians. Pakistan responded with Operation Bunyan-un-Marsoos. A US-brokered ceasefire followed on May 10." },
  { id: 2, category: "foreign-policy", front: "What were the Islamabad Talks (April 2026)?", back: "US-Iran peace negotiations hosted by Pakistan following the April 8 ceasefire. Pakistan brokered the ceasefire leveraging its unique position: representing Iran's interests in Washington, sharing a 900km border with Iran, and holding a defence pact with Saudi Arabia. Talks stalled on nuclear enrichment and sanctions." },
  { id: 3, category: "conflicts", front: "What is Trump's 'Board of Peace'?", back: "A multilateral framework proposed by Trump to oversee post-war Gaza reconstruction and governance — widely criticised as a parallel UN bypass. Pakistan controversially joined in January 2026. Zahid Hussain called it 'strategic bankruptcy'." },
  { id: 4, category: "economy", front: "How did the Iran war affect Pakistan's economy?", back: "Disruptions to the Strait of Hormuz drove Brent crude toward $110/barrel, worsening Pakistan's import bill and inflation. The US-Iran ceasefire dropped oil prices 15%, saving Pakistan approximately $1.5bn per $10 fall." },
  { id: 5, category: "foreign-policy", front: "Define 'Flattery as Foreign Policy' (Pakistan 2026)", back: "Pakistan's diplomatic strategy of publicly praising Trump while privately leveraging its unique geographic and institutional position to broker the US-Iran ceasefire." },
  { id: 6, category: "conflicts", front: "What is the Pahalgam Attack significance?", back: "The April 22, 2026 attack in Indian Illegally Occupied Jammu and Kashmir killed 26 civilians. India blamed Pakistan-based elements. The attack triggered Operation Sindoor, the worst India-Pakistan military confrontation in nearly three decades." },
  { id: 7, category: "governance", front: "What is Article 25-A of Pakistan's Constitution?", back: "Guarantees free and compulsory education for all children aged 5–16. Inserted by the 18th Amendment (2010). Despite being law, 26 million Pakistani children remain out of school." },
  { id: 8, category: "economy", front: "What is the Thucydides Trap in US-China context?", back: "A theory by Graham Allison suggesting that when a rising power threatens a ruling power, conflict is likely. Applied to US-China competition over trade, tech, and Taiwan." },
];

const QUIZZES = {
  conflicts: [
    { q: "Operation Sindoor was India's retaliation for which attack?", options: ["Uri 2016", "Pahalgam April 2026", "Pulwama 2019", "Parliament attack 2001"], correct: 1 },
    { q: "Which country brokered the US-Iran ceasefire in April 2026?", options: ["Turkey", "Qatar", "Pakistan", "China"], correct: 2 },
    { q: "Pakistan's Operation Bunyan-un-Marsoos reportedly downed how many Indian jets?", options: ["2", "3", "5", "7"], correct: 2 },
  ],
  "foreign-policy": [
    { q: "The Islamabad Talks aimed to resolve which conflict?", options: ["India-Pakistan", "US-Iran", "Russia-Ukraine", "Israel-Palestine"], correct: 1 },
    { q: "Pakistan's 'flattery as foreign policy' approach primarily targeted:", options: ["Xi Jinping", "Donald Trump", "Narendra Modi", "Saudi MBS"], correct: 1 },
    { q: "Which Trump family member was reportedly named as a possible US delegate to Islamabad Talks?", options: ["Melania Trump", "Ivanka Trump", "Jared Kushner", "Don Jr."], correct: 2 },
  ],
  economy: [
    { q: "IMF programme benchmarks required which three countries to maintain deposits in Pakistan?", options: ["US, UK, France", "Saudi Arabia, China, UAE", "Turkey, Qatar, Kuwait", "Germany, Japan, South Korea"], correct: 1 },
    { q: "Pakistan's education spending as % of GDP is approximately:", options: ["Under 2%", "3-4%", "5-6%", "7-8%"], correct: 0 },
    { q: "What triggered DeepSeek's global market impact in 2026?", options: ["A cyberattack on US banks", "Releasing a competitive AI model at far lower cost", "China banning Western AI", "EU imposing AI tariffs"], correct: 1 },
  ],
  politics: [
    { q: "Pakistan's 26th Constitutional Amendment primarily dealt with:", options: ["Electoral reforms", "Judicial appointments and constitutional benches", "Provincial autonomy expansion", "Military courts extension"], correct: 1 },
    { q: "Which article guarantees compulsory education in Pakistan?", options: ["Article 9", "Article 19-A", "Article 25-A", "Article 37"], correct: 2 },
    { q: "Zahid Hussain described Pakistan joining Trump's Board of Peace as:", options: ["A diplomatic masterstroke", "Strategic bankruptcy", "A necessary compromise", "An overdue alignment"], correct: 1 },
  ],
};

const NAV = ["Home", "Live News", "Updates & Editorials", "Quizzes", "Flashcards", "My Library"];

// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (darkMode) => {
  const p = {
    bg: darkMode ? "#0d1117" : "#f4f1eb",
    card: darkMode ? "#161b27" : "#ffffff",
    border: darkMode ? "#262d3d" : "#e4dfd5",
    text: darkMode ? "#e6e4de" : "#1a1814",
    muted: darkMode ? "#7a7870" : "#6b6860",
    accent: "#9a7b2f",
    accentHover: "#b8950e",
    accentLight: darkMode ? "#221d08" : "#fdf8ec",
    navy: "#1a3a5c",
    navyMid: darkMode ? "#162d47" : "#1f4a78",
    navyLight: darkMode ? "#0e1f30" : "#eaf1f8",
    liveGreen: "#22c55e",
    liveRed: "#ef4444",
  };

  return {
    p,
    app: { minHeight: "100vh", background: p.bg, color: p.text, fontFamily: "Georgia, 'Times New Roman', serif", transition: "background 0.3s, color 0.3s" },
    header: { background: darkMode ? "#111827" : "#1a3a5c", color: "#fff", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.25)" },
    headerInner: { maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", padding: "0.6rem 0" },
    logo: { fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px", color: "#fff", display: "block" },
    logoSub: { fontSize: "10px", color: "#9a7b2f", textTransform: "uppercase", letterSpacing: "2px", fontFamily: "sans-serif", display: "block" },
    navBtn: (active) => ({ background: active ? p.accent : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.75)", border: active ? "none" : "1px solid rgba(255,255,255,0.15)", borderRadius: "5px", padding: "0.3rem 0.75rem", fontSize: "12px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "600", transition: "all 0.15s", whiteSpace: "nowrap" }),
    main: { maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem 3rem" },
    card: { background: p.card, border: `1px solid ${p.border}`, borderRadius: "8px", padding: "1.1rem 1.25rem", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.15s", boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.05)" },
    issueGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" },
    cardTitle: { fontSize: "15px", fontWeight: "700", lineHeight: "1.4", marginBottom: "0.5rem", margin: "0 0 0.5rem" },
    cardBody: { fontFamily: "sans-serif", fontSize: "12.5px", lineHeight: "1.65", color: p.muted, margin: "0 0 0.5rem" },
    tag: { display: "inline-block", background: p.accentLight, color: p.accent, border: `1px solid ${darkMode ? "#3a2e10" : "#e8d89a"}`, borderRadius: "3px", padding: "2px 7px", fontSize: "10px", fontFamily: "sans-serif", fontWeight: "600" },
    scopeTag: (scope) => ({ display: "inline-block", background: scope === "global" ? (darkMode ? "#1a2a3a" : "#e3f0fa") : (darkMode ? "#1a2e1a" : "#e8f5e9"), color: scope === "global" ? "#1a6a9a" : "#1b7a3a", borderRadius: "3px", padding: "2px 8px", fontSize: "10px", fontFamily: "sans-serif", fontWeight: "700", textTransform: "uppercase" }),
    catBtn: (active) => ({ background: active ? p.navy : p.card, color: active ? "#fff" : p.text, border: `1px solid ${active ? p.navy : p.border}`, borderRadius: "5px", padding: "0.35rem 0.85rem", fontSize: "12px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "600", transition: "all 0.15s", whiteSpace: "nowrap" }),
    filterBtn: (active) => ({ background: active ? p.accentLight : "transparent", color: active ? p.accent : p.muted, border: `1px solid ${active ? p.accent : p.border}`, borderRadius: "4px", padding: "0.3rem 0.75rem", fontSize: "12px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "600" }),
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" },
    modalCard: { background: p.card, borderRadius: "10px", padding: "1.75rem 2rem", maxWidth: "680px", width: "100%", maxHeight: "85vh", overflowY: "auto", position: "relative", border: `1px solid ${p.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
    editorialBox: { background: darkMode ? "#0f1e2e" : "#eaf1f8", border: `1px solid ${darkMode ? "#1f3a55" : "#c0d8ee"}`, borderLeft: `4px solid ${p.navy}`, borderRadius: "4px", padding: "1rem 1.25rem", marginBottom: "1.1rem" },
    aiBox: { background: darkMode ? "#160f24" : "#f3eeff", border: `1px solid ${darkMode ? "#2d1f4a" : "#d0b8ff"}`, borderRadius: "6px", padding: "1rem 1.25rem", fontSize: "13.5px", lineHeight: "1.8", fontFamily: "sans-serif", color: p.text },
    aiBtn: { background: p.navy, color: "#fff", border: "none", borderRadius: "5px", padding: "0.55rem 1.1rem", fontSize: "12.5px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "600", transition: "background 0.2s" },
    hlBtn: (active) => ({ background: active ? "#f9a825" : "transparent", color: active ? "#000" : p.accent, border: `1px solid ${active ? "#f9a825" : p.accent}`, borderRadius: "4px", padding: "0.3rem 0.75rem", fontSize: "12px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "600" }),
    bmBtn: (saved) => ({ background: saved ? (darkMode ? "#251e08" : "#fdf8ec") : "transparent", color: saved ? p.accent : p.muted, border: `1px solid ${saved ? p.accent : p.border}`, borderRadius: "4px", padding: "0.3rem 0.75rem", fontSize: "11px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "600", transition: "all 0.15s" }),
    liveBadge: { display: "inline-flex", alignItems: "center", gap: "5px", background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", fontFamily: "sans-serif", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" },
    rssBadge: { display: "inline-flex", alignItems: "center", gap: "4px", background: darkMode ? "#1a1200" : "#fff8e1", color: "#d97706", border: "1px solid #fbbf24", borderRadius: "4px", padding: "2px 7px", fontSize: "10px", fontFamily: "sans-serif", fontWeight: "700" },
    searchBox: { width: "100%", background: p.card, border: `1px solid ${p.border}`, borderRadius: "6px", padding: "0.6rem 1rem", fontSize: "14px", color: p.text, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box" },
  };
};

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [bookmarks, setBookmarks] = useState(() => { try { return JSON.parse(localStorage.getItem("css_bookmarks") || "[]"); } catch { return []; } });
  const [highlights, setHighlights] = useState(() => { try { return JSON.parse(localStorage.getItem("css_highlights") || "[]"); } catch { return []; } });
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [loadingAI, setLoadingAI] = useState({});
  const [quizState, setQuizState] = useState({ category: "conflicts", current: 0, answers: {}, done: false });
  const [flippedCards, setFlippedCards] = useState({});
  const [fcCategory, setFcCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(() => { try { return JSON.parse(localStorage.getItem("css_dark") || "false"); } catch { return false; } });
  const [highlightMode, setHighlightMode] = useState(false);
  const [libTab, setLibTab] = useState("bookmarks");
  const [liveNews, setLiveNews] = useState([]);
  const [rssNews, setRssNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [activeTopic, setActiveTopic] = useState(NEWS_TOPICS[0]);
  const [newsSearch, setNewsSearch] = useState("");
  const [newsTab, setNewsTab] = useState("rss");
  const [lastFetched, setLastFetched] = useState(null);
  const modalRef = useRef(null);

  const { p, ...s } = makeStyles(darkMode);

  // Persist settings
  useEffect(() => { localStorage.setItem("css_dark", JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem("css_bookmarks", JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem("css_highlights", JSON.stringify(highlights)); }, [highlights]);

  // ── Fetch Live News ──
  const fetchNews = useCallback(async (query) => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      // Fetch RSS and NewsAPI in parallel
      const [rssRes, newsRes] = await Promise.allSettled([
        fetch(`/api/rss`),
        fetch(`/api/news?q=${encodeURIComponent(query)}&pageSize=20`)
      ]);

      if (rssRes.status === "fulfilled" && rssRes.value.ok) {
        const data = await rssRes.value.json();
        setRssNews(data.articles || []);
      }
      if (newsRes.status === "fulfilled" && newsRes.value.ok) {
        const data = await newsRes.value.json();
        setLiveNews(data.articles || []);
      }
      setLastFetched(new Date());
    } catch (err) {
      setNewsError("Unable to load live news. Check your connection.");
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeNav === "Live News") fetchNews(activeTopic.query);
  }, [activeNav, activeTopic, fetchNews]);

  // ── AI Analysis ──
  const getAIAnalysis = async (issue) => {
    setLoadingAI(prev => ({ ...prev, [issue.id]: true }));
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a senior foreign policy analyst writing for CSS (Pakistan's Central Superior Services) exam aspirants. Write concise, analytically rigorous perspectives in 3–4 paragraphs. Focus on: (1) root causes, (2) Pakistan's strategic interests, (3) international law/IR theory implications, (4) what a CSS essay answer should argue. Write in authoritative but accessible prose.",
          messages: [{ role: "user", content: `Provide analytical perspective on: "${issue.title}"\n\nContext: ${issue.summary}` }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "Analysis unavailable.";
      setAiAnalysis(prev => ({ ...prev, [issue.id]: text }));
    } catch {
      setAiAnalysis(prev => ({ ...prev, [issue.id]: "Could not generate analysis. Please try again." }));
    } finally {
      setLoadingAI(prev => ({ ...prev, [issue.id]: false }));
    }
  };

  // ── News AI Analysis ──
  const getNewsAIAnalysis = async (article) => {
    const key = `news_${article.id}`;
    setLoadingAI(prev => ({ ...prev, [key]: true }));
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: "You are a CSS exam analyst. Given a news headline and summary, provide: (1) Why this matters for Pakistan, (2) The IR/policy angle, (3) One CSS essay angle. Be concise — 2–3 paragraphs.",
          messages: [{ role: "user", content: `News: "${article.title}"\n\nSummary: ${article.summary}\nSource: ${article.source}` }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "Analysis unavailable.";
      setAiAnalysis(prev => ({ ...prev, [key]: text }));
    } catch {
      setAiAnalysis(prev => ({ ...prev, [key]: "Could not generate analysis." }));
    } finally {
      setLoadingAI(prev => ({ ...prev, [key]: false }));
    }
  };

  // ── Highlights ──
  const handleTextSelection = useCallback(() => {
    if (!highlightMode || !selectedIssue) return;
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && text.length > 10) {
      const newH = { id: Date.now(), text, issueTitle: selectedIssue.title, date: new Date().toLocaleDateString() };
      setHighlights(prev => [...prev, newH]);
      sel.removeAllRanges();
    }
  }, [highlightMode, selectedIssue]);

  // ── Bookmarks ──
  const isBookmarked = (item, type) => bookmarks.some(b => b.key === `${type}_${item.id}`);
  const toggleBookmark = (item, type) => {
    const key = `${type}_${item.id}`;
    setBookmarks(prev => isBookmarked(item, type) ? prev.filter(b => b.key !== key) : [...prev, { ...item, key, type }]);
  };

  const filtered = ISSUES.filter(i =>
    (activeCategory === "all" || i.category === activeCategory) &&
    (scopeFilter === "all" || i.scope === scopeFilter)
  );

  const displayedNews = newsTab === "rss" ? rssNews : liveNews;
  const filteredNews = newsSearch
    ? displayedNews.filter(a => a.title.toLowerCase().includes(newsSearch.toLowerCase()) || a.summary.toLowerCase().includes(newsSearch.toLowerCase()))
    : displayedNews;

  // ── IssueCard ──
  const IssueCard = ({ issue }) => (
    <div style={{ ...s.card, display: "flex", flexDirection: "column", gap: "0.4rem" }}
      onClick={() => setSelectedIssue(issue)}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
        <span style={s.scopeTag(issue.scope)}>{issue.scope}</span>
        <span style={{ fontFamily: "sans-serif", fontSize: "10px", color: p.muted }}>{issue.date}</span>
      </div>
      <p style={s.cardTitle}>{issue.title}</p>
      <p style={{ ...s.cardBody, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{issue.summary}</p>
      <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: p.accent, marginTop: "0.25rem" }}>✎ {issue.editorial.author} — {issue.editorial.outlet}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.25rem" }}>
        {issue.tags.slice(0, 3).map(t => <span key={t} style={s.tag}>{t}</span>)}
      </div>
    </div>
  );

  // ── NewsCard ──
  const NewsCard = ({ article }) => {
    const key = `news_${article.id}`;
    const [expanded, setExpanded] = useState(false);
    return (
      <div style={{ ...s.card, cursor: "default" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <span style={s.liveBadge}>● Live</span>
          <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: p.muted }}>{article.source} · {article.date}</span>
          {isBookmarked(article, "news") && <span style={{ ...s.tag, marginLeft: "auto" }}>★ Saved</span>}
        </div>
        <p style={{ ...s.cardTitle, cursor: "pointer" }} onClick={() => article.url && window.open(article.url, "_blank")}>{article.title}</p>
        {article.summary && <p style={s.cardBody}>{article.summary}</p>}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          {article.url && (
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              style={{ ...s.filterBtn(false), textDecoration: "none", fontSize: "11px" }}>
              Read Full ↗
            </a>
          )}
          <button style={s.hlBtn(false)} onClick={() => { setExpanded(true); getNewsAIAnalysis(article); }}>
            {loadingAI[key] ? "Analysing…" : "CSS Analysis"}
          </button>
          <button style={s.bmBtn(isBookmarked(article, "news"))} onClick={() => toggleBookmark(article, "news")}>
            {isBookmarked(article, "news") ? "★ Saved" : "☆ Save"}
          </button>
        </div>
        {expanded && (
          <div style={{ marginTop: "0.75rem" }}>
            {aiAnalysis[key]
              ? <div style={s.aiBox}>{aiAnalysis[key]}</div>
              : loadingAI[key]
                ? <div style={{ ...s.aiBox, color: p.muted }}>Generating CSS analysis…</div>
                : null}
          </div>
        )}
      </div>
    );
  };

  // ── RSS Card ──
  const RssCard = ({ article }) => (
    <div style={{ ...s.card, cursor: "default" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        <span style={s.rssBadge}>RSS</span>
        <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: p.muted }}>{article.source} · {article.date}</span>
      </div>
      <p style={{ ...s.cardTitle, cursor: "pointer" }} onClick={() => article.url && window.open(article.url, "_blank")}>{article.title}</p>
      {article.summary && <p style={s.cardBody}>{article.summary.slice(0, 200)}{article.summary.length > 200 ? "…" : ""}</p>}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        {article.url && (
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            style={{ ...s.filterBtn(false), textDecoration: "none", fontSize: "11px" }}>
            Read on {article.source} ↗
          </a>
        )}
        <button style={s.bmBtn(isBookmarked(article, "news"))} onClick={() => toggleBookmark(article, "news")}>
          {isBookmarked(article, "news") ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );

  // ── Quiz Section ──
  const QuizSection = () => {
    const qs = QUIZZES[quizState.category] || [];
    const q = qs[quizState.current];
    const score = Object.entries(quizState.answers).filter(([i, a]) => qs[parseInt(i)]?.correct === a).length;
    return (
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "0.25rem" }}>Knowledge Quizzes</h2>
        <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: p.muted, marginBottom: "1.25rem" }}>Test your grasp of current issues — CSS style</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {Object.keys(QUIZZES).map(cat => (
            <button key={cat} style={s.catBtn(quizState.category === cat)} onClick={() => setQuizState({ category: cat, current: 0, answers: {}, done: false })}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
        {!quizState.done ? (
          <div style={{ ...s.card, maxWidth: "600px", cursor: "default" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: p.muted, marginBottom: "0.4rem" }}>Question {quizState.current + 1} of {qs.length}</div>
            <div style={{ height: "3px", background: p.border, borderRadius: "2px", marginBottom: "1.25rem" }}>
              <div style={{ height: "100%", width: `${(quizState.current / qs.length) * 100}%`, background: p.accent, borderRadius: "2px", transition: "width 0.3s" }} />
            </div>
            <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "1.25rem", lineHeight: "1.5", fontFamily: "sans-serif" }}>{q?.q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {q?.options.map((opt, i) => {
                const answered = quizState.answers[quizState.current] !== undefined;
                const isSelected = quizState.answers[quizState.current] === i;
                const isCorrect = q.correct === i;
                let bg = p.card, border = p.border, color = p.text;
                if (answered) {
                  if (isCorrect) { bg = darkMode ? "#1a2e1a" : "#e8f5e9"; border = "#4caf50"; color = darkMode ? "#81c784" : "#1b5e20"; }
                  else if (isSelected) { bg = darkMode ? "#2e1a1a" : "#ffebee"; border = "#ef5350"; color = darkMode ? "#ef9a9a" : "#b71c1c"; }
                }
                return (
                  <button key={i} onClick={() => { if (!answered) setQuizState(prev => ({ ...prev, answers: { ...prev.answers, [prev.current]: i } })); }}
                    style={{ background: bg, border: `1px solid ${border}`, borderRadius: "6px", padding: "0.7rem 1rem", textAlign: "left", cursor: answered ? "default" : "pointer", fontFamily: "sans-serif", fontSize: "13px", color, transition: "all 0.2s" }}>
                    <span style={{ fontWeight: "700", marginRight: "8px" }}>{String.fromCharCode(65 + i)}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {quizState.answers[quizState.current] !== undefined && (
              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                {quizState.current < qs.length - 1
                  ? <button style={s.aiBtn} onClick={() => setQuizState(prev => ({ ...prev, current: prev.current + 1 }))}>Next →</button>
                  : <button style={s.aiBtn} onClick={() => setQuizState(prev => ({ ...prev, done: true }))}>See Results</button>}
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...s.card, maxWidth: "520px", cursor: "default", textAlign: "center", padding: "2.5rem" }}>
            <div style={{ fontSize: "44px", marginBottom: "0.75rem" }}>{score === qs.length ? "🏆" : score >= Math.ceil(qs.length / 2) ? "👍" : "📚"}</div>
            <h3 style={{ fontSize: "22px", marginBottom: "0.4rem", fontFamily: "sans-serif" }}>{score}/{qs.length} Correct</h3>
            <p style={{ color: p.muted, fontFamily: "sans-serif", fontSize: "13px", marginBottom: "1.5rem" }}>
              {score === qs.length ? "Full marks — excellent analytical command." : score >= Math.ceil(qs.length / 2) ? "Solid grasp. Review missed answers." : "Keep revising. Focus on editorial perspectives for depth."}
            </p>
            <button style={s.aiBtn} onClick={() => setQuizState(prev => ({ ...prev, current: 0, answers: {}, done: false }))}>Retry</button>
          </div>
        )}
      </div>
    );
  };

  // ── Flashcard Section ──
  const FlashcardSection = () => {
    const cards = fcCategory === "all" ? FLASHCARDS : FLASHCARDS.filter(f => f.category === fcCategory);
    return (
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "0.25rem" }}>Flashcards</h2>
        <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: p.muted, marginBottom: "1.25rem" }}>Click to flip — key concepts for CSS revision</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <button style={s.catBtn(fcCategory === "all")} onClick={() => setFcCategory("all")}>All</button>
          {[...new Set(FLASHCARDS.map(f => f.category))].map(cat => (
            <button key={cat} style={s.catBtn(fcCategory === cat)} onClick={() => setFcCategory(cat)}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1rem" }}>
          {cards.map(card => (
            <div key={card.id} onClick={() => setFlippedCards(prev => ({ ...prev, [card.id]: !prev[card.id] }))}
              style={{ ...s.card, minHeight: "150px", background: flippedCards[card.id] ? p.navyLight : p.card, borderColor: flippedCards[card.id] ? p.navy : p.border, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: p.accent, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.6rem" }}>
                  {flippedCards[card.id] ? "Answer" : "Question"} · {card.category.replace("-", " ")}
                </div>
                <p style={{ fontSize: "13.5px", lineHeight: "1.65", margin: 0, color: p.text }}>{flippedCards[card.id] ? card.back : card.front}</p>
              </div>
              <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: p.muted, marginTop: "0.75rem" }}>
                {flippedCards[card.id] ? "↩ Flip back" : "→ Click to reveal"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Library Section ──
  const LibrarySection = () => (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "0.25rem" }}>My Library</h2>
      <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: p.muted, marginBottom: "1.25rem" }}>{bookmarks.length} saved · {highlights.length} highlights</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["bookmarks", "highlights"].map(t => (
          <button key={t} style={s.filterBtn(libTab === t)} onClick={() => setLibTab(t)}>
            {t === "bookmarks" ? `☆ Bookmarks (${bookmarks.length})` : `✎ Highlights (${highlights.length})`}
          </button>
        ))}
      </div>
      {libTab === "bookmarks" && (
        bookmarks.length === 0
          ? <div style={{ ...s.card, textAlign: "center", padding: "3rem", cursor: "default" }}>
              <p style={{ fontSize: "36px", marginBottom: "0.75rem" }}>🔖</p>
              <p style={{ color: p.muted, fontFamily: "sans-serif", fontSize: "13px" }}>No saved items yet. Bookmark articles and news to build your library.</p>
            </div>
          : <div style={s.issueGrid}>
              {bookmarks.map(b => (
                <div key={b.key} style={s.card} onClick={() => b.type === "issue" && setSelectedIssue(b)}>
                  <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: p.accent, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.4rem" }}>{b.type}</div>
                  <p style={s.cardTitle}>{b.title || b.front}</p>
                  {b.summary && <p style={{ ...s.cardBody, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.summary}</p>}
                  <button style={s.bmBtn(true)} onClick={e => { e.stopPropagation(); toggleBookmark(b, b.type); }}>Remove</button>
                </div>
              ))}
            </div>
      )}
      {libTab === "highlights" && (
        highlights.length === 0
          ? <div style={{ ...s.card, textAlign: "center", padding: "3rem", cursor: "default" }}>
              <p style={{ fontSize: "36px", marginBottom: "0.75rem" }}>✎</p>
              <p style={{ color: p.muted, fontFamily: "sans-serif", fontSize: "13px" }}>No highlights yet. Open an article, enable Highlight Mode, then select any text to save it here.</p>
            </div>
          : <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {highlights.map(h => (
                <div key={h.id} style={{ ...s.card, cursor: "default", borderLeft: `4px solid #f9a825` }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: p.muted, marginBottom: "0.4rem" }}>{h.issueTitle} · {h.date}</div>
                  <p style={{ fontSize: "14px", lineHeight: "1.7", fontStyle: "italic", margin: 0, background: darkMode ? "#2a2200" : "#fffde7", padding: "0.5rem 0.75rem", borderRadius: "4px" }}>"{h.text}"</p>
                  <button style={{ ...s.bmBtn(false), marginTop: "0.5rem", fontSize: "11px" }} onClick={() => setHighlights(prev => prev.filter(x => x.id !== h.id))}>Remove</button>
                </div>
              ))}
            </div>
      )}
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={{ padding: "0.3rem 0" }}>
            <span style={s.logoSub}>CSS Aspirants Hub</span>
            <span style={s.logo}>Pakistan Current Affairs</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
            {NAV.map(n => (
              <button key={n} style={s.navBtn(activeNav === n)} onClick={() => setActiveNav(n)}>
                {n === "Live News" ? "📡 " + n : n}
              </button>
            ))}
            <button style={{ ...s.navBtn(false), border: "1px solid rgba(255,255,255,0.2)" }} onClick={() => setDarkMode(d => !d)}>
              {darkMode ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </div>

      <div style={s.main}>
        {/* ── Home ── */}
        {activeNav === "Home" && (
          <div>
            <div style={{ background: p.navy, borderRadius: "10px", padding: "2rem 2rem 1.75rem", marginBottom: "2rem", borderBottom: `4px solid ${p.accent}` }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: p.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>Updated May 2026</div>
              <h1 style={{ color: "#ffffff", fontSize: "24px", marginBottom: "0.6rem", fontWeight: "700", lineHeight: "1.3" }}>Pakistan CSS Exam: Current Affairs & Editorial Analysis</h1>
              <p style={{ color: "#b8c8d8", fontFamily: "sans-serif", fontSize: "14px", lineHeight: "1.65", margin: "0 0 1.25rem" }}>
                Live news from Dawn, Express Tribune, and Geo News — paired with editorial analysis from Maleeha Lodhi, Zahid Hussain, and AI-generated CSS perspectives.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button style={{ ...s.aiBtn, background: p.accent, fontSize: "13px" }} onClick={() => setActiveNav("Live News")}>📡 Live News Feed</button>
                <button style={{ ...s.aiBtn, background: "rgba(255,255,255,0.15)", fontSize: "13px" }} onClick={() => setActiveNav("Updates & Editorials")}>Browse All Issues</button>
              </div>
            </div>

            {/* Stats Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
              {[
                { label: "Curated Issues", value: ISSUES.length, icon: "📰" },
                { label: "Flashcards", value: FLASHCARDS.length, icon: "🃏" },
                { label: "Quiz Questions", value: Object.values(QUIZZES).flat().length, icon: "❓" },
                { label: "Live Sources", value: "5 RSS Feeds", icon: "📡" },
              ].map(stat => (
                <div key={stat.label} style={{ ...s.card, textAlign: "center", cursor: "default" }}>
                  <div style={{ fontSize: "24px", marginBottom: "0.25rem" }}>{stat.icon}</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: p.accent }}>{stat.value}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: p.muted }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
              {CATEGORIES.slice(1).map(cat => (
                <div key={cat.id} style={{ ...s.card, cursor: "pointer", textAlign: "center", padding: "0.85rem 0.5rem" }}
                  onClick={() => { setActiveNav("Updates & Editorials"); setActiveCategory(cat.id); }}>
                  <div style={{ fontSize: "22px", marginBottom: "0.35rem" }}>{cat.icon}</div>
                  <div style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600", color: p.text }}>{cat.label}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "0.25rem" }}>Top Stories</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: p.muted, marginBottom: "1.25rem" }}>Most critical issues for CSS 2026</p>
            <div style={s.issueGrid}>
              {ISSUES.slice(0, 6).map(i => <IssueCard key={i.id} issue={i} />)}
            </div>
          </div>
        )}

        {/* ── Live News ── */}
        {activeNav === "Live News" && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "0.25rem" }}>📡 Live News Feed</h2>
                <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: p.muted, margin: 0 }}>
                  Real-time headlines from Dawn, Express Tribune & Geo News
                  {lastFetched && <span> · Updated {lastFetched.toLocaleTimeString()}</span>}
                </p>
              </div>
              <button style={{ ...s.aiBtn, fontSize: "12px" }} onClick={() => fetchNews(activeTopic.query)} disabled={newsLoading}>
                {newsLoading ? "Refreshing…" : "↻ Refresh"}
              </button>
            </div>

            {/* Tab: RSS / NewsAPI */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <button style={s.filterBtn(newsTab === "rss")} onClick={() => setNewsTab("rss")}>
                RSS Feeds ({rssNews.length})
              </button>
              <button style={s.filterBtn(newsTab === "newsapi")} onClick={() => setNewsTab("newsapi")}>
                NewsAPI ({liveNews.length})
              </button>
            </div>

            {/* Topic Filters (NewsAPI only) */}
            {newsTab === "newsapi" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                {NEWS_TOPICS.map(t => (
                  <button key={t.label} style={s.catBtn(activeTopic.label === t.label)} onClick={() => setActiveTopic(t)}>
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: "1.25rem" }}>
              <input
                style={s.searchBox}
                placeholder="Search headlines…"
                value={newsSearch}
                onChange={e => setNewsSearch(e.target.value)}
              />
            </div>

            {newsLoading && (
              <div style={{ textAlign: "center", padding: "3rem", color: p.muted, fontFamily: "sans-serif" }}>
                <div style={{ fontSize: "32px", marginBottom: "0.75rem" }}>📡</div>
                Loading live news…
              </div>
            )}

            {newsError && (
              <div style={{ ...s.card, background: darkMode ? "#2a1515" : "#fff0f0", border: "1px solid #ef4444", cursor: "default", textAlign: "center", padding: "2rem" }}>
                <p style={{ color: "#ef4444", fontFamily: "sans-serif", marginBottom: "0.75rem" }}>{newsError}</p>
                <p style={{ color: p.muted, fontFamily: "sans-serif", fontSize: "12px" }}>
                  Note: Live news requires deployment to Vercel. In development, the API proxy is not available.
                </p>
              </div>
            )}

            {!newsLoading && !newsError && filteredNews.length === 0 && (
              <div style={{ ...s.card, textAlign: "center", padding: "3rem", cursor: "default" }}>
                <p style={{ fontSize: "32px", marginBottom: "0.75rem" }}>📭</p>
                <p style={{ color: p.muted, fontFamily: "sans-serif", fontSize: "13px" }}>
                  {newsSearch ? "No articles match your search." : "No articles loaded yet. Click Refresh to fetch live news."}
                </p>
              </div>
            )}

            <div style={s.issueGrid}>
              {!newsLoading && filteredNews.map(article =>
                newsTab === "rss"
                  ? <RssCard key={article.id} article={article} />
                  : <NewsCard key={article.id} article={article} />
              )}
            </div>
          </div>
        )}

        {/* ── Updates & Editorials ── */}
        {activeNav === "Updates & Editorials" && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "0.25rem" }}>Updates & Editorials</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: p.muted, marginBottom: "1.25rem" }}>Curated current affairs with editorial analysis from Pakistan's leading commentators</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} style={s.catBtn(activeCategory === cat.id)} onClick={() => setActiveCategory(cat.id)}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {["all", "national", "global"].map(sc => (
                <button key={sc} style={s.filterBtn(scopeFilter === sc)} onClick={() => setScopeFilter(sc)}>
                  {sc === "all" ? "All Scope" : sc.charAt(0).toUpperCase() + sc.slice(1)}
                </button>
              ))}
              <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: p.muted, alignSelf: "center", marginLeft: "auto" }}>{filtered.length} articles</span>
            </div>
            <div style={s.issueGrid}>{filtered.map(i => <IssueCard key={i.id} issue={i} />)}</div>
          </div>
        )}

        {activeNav === "Quizzes" && <QuizSection />}
        {activeNav === "Flashcards" && <FlashcardSection />}
        {activeNav === "My Library" && <LibrarySection />}
      </div>

      {/* ── Article Modal ── */}
      {selectedIssue && (
        <div style={s.modal} onClick={() => setSelectedIssue(null)}>
          <div ref={modalRef} style={s.modalCard} onClick={e => e.stopPropagation()} onMouseUp={handleTextSelection}>
            <button onClick={() => setSelectedIssue(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: p.muted }}>✕</button>

            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <span style={s.scopeTag(selectedIssue.scope)}>{selectedIssue.scope}</span>
              <span style={{ ...s.tag, fontSize: "10px", background: "transparent", color: p.muted }}>{selectedIssue.date} · {selectedIssue.source}</span>
            </div>

            <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "0.85rem", lineHeight: "1.4", paddingRight: "2rem" }}>{selectedIssue.title}</h2>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
              <button style={s.hlBtn(highlightMode)} onClick={() => setHighlightMode(m => !m)}>
                {highlightMode ? "✎ Highlight ON — select text to save" : "✎ Highlight Mode"}
              </button>
              {highlightMode && <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#f9a825" }}>Select any passage to save to library</span>}
            </div>

            <div style={{ borderBottom: `1px solid ${p.border}`, paddingBottom: "1rem", marginBottom: "1.1rem" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: p.muted, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.5rem" }}>Article Summary</div>
              <p style={{ fontSize: "14px", lineHeight: "1.8", margin: 0, fontFamily: "sans-serif", color: p.text, cursor: highlightMode ? "text" : "default", userSelect: highlightMode ? "text" : "auto" }}>
                {selectedIssue.summary}
              </p>
            </div>

            <div style={s.editorialBox}>
              <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: p.accent, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
                Editorial · {selectedIssue.editorial.author} — {selectedIssue.editorial.outlet}, {selectedIssue.editorial.date}
              </div>
              <p style={{ fontSize: "14px", lineHeight: "1.85", margin: 0, fontStyle: "italic", color: p.text, cursor: highlightMode ? "text" : "default", userSelect: highlightMode ? "text" : "auto" }}>
                "{selectedIssue.editorial.text}"
              </p>
            </div>

            <div style={{ marginBottom: "1.1rem" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: p.navy, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.5rem" }}>AI Analytical Perspective</div>
              {aiAnalysis[selectedIssue.id] ? (
                <div style={{ ...s.aiBox, cursor: highlightMode ? "text" : "default", userSelect: highlightMode ? "text" : "auto" }}>{aiAnalysis[selectedIssue.id]}</div>
              ) : (
                <button style={s.aiBtn} onClick={() => getAIAnalysis(selectedIssue)} disabled={loadingAI[selectedIssue.id]}>
                  {loadingAI[selectedIssue.id] ? "Generating analysis…" : "Generate AI Analysis"}
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderTop: `1px solid ${p.border}`, paddingTop: "1rem" }}>
              {selectedIssue.tags.map(t => <span key={t} style={s.tag}>{t}</span>)}
              <button style={{ ...s.bmBtn(isBookmarked(selectedIssue, "issue")), marginLeft: "auto" }} onClick={() => toggleBookmark(selectedIssue, "issue")}>
                {isBookmarked(selectedIssue, "issue") ? "★ Saved" : "☆ Save to Library"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
