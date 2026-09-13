const DB_NAME = "commentary-archive";
const STORE = "fragments";
const VERSION = 1;
const BUCKETS = {
  inbox: { label: "Inbox", color: "coral" },
  saved: { label: "Saved", color: "blue" }
};

const ARTICLE_LIBRARY_VERSION = "article-library-v1";
const CURATED_ARTICLES = [
  {
    id: "article-ai-skills-not-courses", segment: "tech", batch: "Ideas batch", sourceLabel: "Code With Masood",
    title: "You Don’t Need 50 AI Courses. You Need These 7 Skills",
    url: "https://medium.com/@CodeWithMasood/you-dont-need-50-ai-courses-you-need-these-7-skills-d60b74985ffd",
    quote: "AI engineering still rests on software engineering: APIs, databases, authentication, frontends, backends and deployment. Courses are inputs; capability shows up in what you can build.",
    relevance: "You have already spent time in the course → tutorial → roadmap loop. Your next level is not another certificate; it is building something difficult enough—like Discreet—that your missing knowledge becomes visible and specific.",
    resonance: "Build → encounter limitation → learn theory → apply → repeat.",
    tags: ["ai", "software", "building"], createdAt: Date.parse("2026-09-03T12:00:00Z")
  },
  {
    id: "article-ai-writing-tell", segment: "tech", batch: "Ideas batch", sourceLabel: "Matt the Nomad",
    title: "The Biggest Tell an Article Was Written by AI",
    url: "https://medium.com/@mattthenomad/the-biggest-tell-an-article-was-written-by-ai-196792da1499",
    quote: "The real tell is not punctuation. It is prose that looks polished and complete while containing little original observation, tension or worked-through thought.",
    relevance: "Because you use AI to analyse what you read, the risk is consuming finished-looking conclusions without wrestling with the ideas yourself. AI helps you most after you form an initial judgment, not before you have one.",
    resonance: "You → initial judgment → AI challenge → evidence → revised judgment.",
    tags: ["ai", "writing", "thinking"], createdAt: Date.parse("2026-09-03T11:00:00Z")
  },
  {
    id: "article-zero-to-zero", segment: "tech", batch: "People & identity batch", sourceLabel: "Ekmekdelum",
    title: "Jimmy Asked a Dangerous Question: What Is 0⁰?",
    url: "https://medium.com/@ekmekdelum/jimmy-asked-a-dangerous-question-what-is-0%E2%81%B0-e7da42889077",
    quote: "Two familiar rules appear to collide at a boundary case. The answer depends on context: 0⁰ is useful as 1 in some discrete settings, while it is an indeterminate form in limits.",
    relevance: "This is the kind of curiosity that transfers directly into software. Systems fail at null, zero, empty, malformed and extreme inputs; noticing where a rule stops being automatic is a serious engineering habit.",
    resonance: "Definitions and rules have domains. Ask whether the rule still applies here.",
    tags: ["math", "edge-cases", "reasoning"], createdAt: Date.parse("2026-08-19T12:00:00Z")
  },
  {
    id: "article-quiet-employee", segment: "tech", batch: "Ideas batch", sourceLabel: "Tobias Charles",
    title: "I’ve Managed People for Years. One Type of Employee Still Makes Me Nervous",
    url: "https://medium.com/@TobiasCharles/ive-managed-people-for-years-one-type-of-employee-still-makes-me-nervous-12b809b05422",
    quote: "The apparently perfect employee who never raises a problem may be satisfied—or may be disengaged, conflict-avoidant and already planning an exit. Silence is ambiguous data.",
    relevance: "If you eventually lead DEXDEV, Discreet or another team, you need deliberate channels for disagreement. A culture cannot diagnose itself from the absence of complaints.",
    resonance: "Ask ‘What am I getting wrong?’ instead of ‘Everything good?’",
    tags: ["leadership", "teams", "feedback"], createdAt: Date.parse("2026-09-03T10:00:00Z")
  },
  {
    id: "article-coaching-paradox", segment: "tech", batch: "Follow-up", sourceLabel: "Seth Godin",
    title: "A Coaching Paradox",
    url: "https://seths.blog/2021/07/a-coaching-paradox/",
    quote: "Elite performance treats coaching as infrastructure, while business often treats it as proof of weakness. The outside view reveals blind spots that effort from inside the problem cannot.",
    relevance: "Your self-directed learning is a strength, but it can become self-contained learning. A strong reviewer can compress years of experience into one question about an architectural choice or one mistake you cannot yet see.",
    resonance: "Don’t confuse independence with isolation. Build mechanisms for high-quality external feedback.",
    tags: ["mentorship", "career", "feedback"], createdAt: Date.parse("2026-08-20T12:00:00Z")
  },
  {
    id: "article-films-better-adults", segment: "life", batch: "Ideas batch", sourceLabel: "Paolo Maglione",
    title: "Want Better Adults? Make Them Watch These Films as Teens",
    url: "https://medium.com/@paolomaglione/want-better-adults-make-them-watch-these-films-as-teens-2113d566488e",
    quote: "Stories can make moral complexity, sacrifice, courage and consequences emotionally legible—but exposure to a great film is not the same thing as transformation.",
    relevance: "You are drawn to media that offers a vision of an ambitious life. The richer question is whether you would accept the sacrifices, relationships and moral compromises required to become the person on screen.",
    resonance: "Don’t only ask ‘Do I want their life?’ Ask ‘What did becoming them cost?’",
    tags: ["film", "character", "ambition"], createdAt: Date.parse("2026-09-03T09:00:00Z")
  },
  {
    id: "article-self-taught-genius-books", segment: "life", batch: "Ideas batch", sourceLabel: "Sean Kernan",
    title: "10 Books That Self-Taught Geniuses Read That Made Them Great",
    url: "https://medium.com/@Seanveaux/10-books-that-self-taught-geniuses-read-that-made-them-great-49220b1ca75f",
    quote: "Self-directed education works, but the genius-reading-list genre turns learning into intellectual FOMO. Owning or finishing the canon does not guarantee judgment.",
    relevance: "Build an intellectual stack—technical, business, human, philosophical and literary—instead of a reading flex. Five books digested deeply can change you more than a hundred collected recommendations.",
    resonance: "Read fewer things, deeper. A reading list is not a personality.",
    tags: ["books", "learning", "judgment"], createdAt: Date.parse("2026-09-03T08:00:00Z")
  },
  {
    id: "article-jesus-uncomfortable", segment: "life", batch: "Ideas batch", sourceLabel: "Dan Foster",
    title: "The One Story Jesus Told That Should Make Christians Uncomfortable",
    url: "https://medium.com/@danfosterwriter/the-one-story-jesus-told-that-should-make-christians-uncomfortable-4d2c13fcf7bf",
    quote: "The challenge beneath the interpretation is whether professed faith produces love, mercy, generosity and concern for actual people—or remains identity and intellectual assent.",
    relevance: "Your ambition for wealth, freedom, travel and impact is not automatically opposed to Christianity. But its engine matters: service and freedom are different motives from superiority, safety, admiration and becoming untouchable.",
    resonance: "What is all this ambition for—and who is it making you become?",
    tags: ["faith", "ambition", "character"], createdAt: Date.parse("2026-09-03T07:00:00Z")
  },
  {
    id: "article-fiction-books", segment: "life", batch: "Ideas batch", sourceLabel: "Rowan Pierce",
    title: "The 13 Best Fiction Books of All Time",
    url: "https://medium.com/@Rowan_Pierce/the-13-best-fiction-books-of-all-time-b296488f24bb",
    quote: "A ‘best’ fiction list is inevitably personal. Its real value is inviting you into simulations of ambition, identity, friendship, love, power, morality and society.",
    relevance: "You already cultivate technical and business range. Serious fiction develops human range—the ability to inhabit minds and motives unlike your own—which also matters when you build products for people.",
    resonance: "Fiction is a simulation environment for being human.",
    tags: ["fiction", "empathy", "people"], createdAt: Date.parse("2026-09-03T06:00:00Z")
  },
  {
    id: "article-einstein-god", segment: "life", batch: "Ideas batch", sourceLabel: "Thomas Oppong",
    title: "Einstein Believed in God—But What He Meant Will Unsettle You",
    url: "https://medium.com/@thomas-oppong/einstein-believed-in-god-but-what-he-meant-by-that-will-unsettle-you-fb1737361320",
    quote: "Einstein’s ‘God’ referred to awe before the rational order of nature, close to Spinoza—not a personal being who intervenes, answers prayers, rewards or punishes.",
    relevance: "You will keep meeting confident claims about Christianity, science, AI, capitalism and morality. Famous names and familiar labels are shortcuts; the proposition and its evidence are what deserve evaluation.",
    resonance: "Don’t ask which side sounds smarter. Ask what, exactly, is being claimed—and what would change your mind.",
    tags: ["faith", "science", "critical-thinking"], createdAt: Date.parse("2026-09-03T05:00:00Z")
  },
  {
    id: "article-not-a-priority", segment: "life", batch: "People & identity batch", sourceLabel: "Inspire Wonderland",
    title: "The Quiet Ways People Show You You’re Not a Priority",
    url: "https://medium.com/@inspirewonderland/the-quiet-ways-people-show-you-youre-not-a-priority-6a1b5343df9b",
    quote: "Neglect is often an accumulation of asymmetries—one person initiates, accommodates and clarifies while the other remains vague. A single late reply proves little; a repeated pattern carries information.",
    relevance: "You naturally analyse social context and ambiguous signals. That sensitivity is useful until every interaction becomes a research problem. Watch reciprocity across time instead of decoding isolated moments.",
    resonance: "Don’t decode isolated signals. Watch repeated behaviour, then act accordingly.",
    tags: ["relationships", "reciprocity", "boundaries"], createdAt: Date.parse("2026-08-19T11:00:00Z")
  },
  {
    id: "article-spot-a-narcissist", segment: "life", batch: "People & identity batch", sourceLabel: "Maria Cassano",
    title: "How to Instantly Spot a Narcissist, According to Psychology Experts",
    url: "https://medium.com/@mariacassano/how-to-instantly-spot-a-narcissist-according-to-psychology-experts-7f060fbb1aa7",
    quote: "Internet psychology often turns overlapping behaviours into instant diagnoses. Repeated exploitation, manipulation or lack of accountability can justify distance without proving a clinical label.",
    relevance: "Use behaviour to decide what access someone should have to you, not to make yourself their diagnostician. Someone can be incompatible, uninterested or immature without being abusive or narcissistic.",
    resonance: "Rejection ≠ abuse. Incompatibility ≠ manipulation. You don’t need a diagnosis to choose distance.",
    tags: ["psychology", "boundaries", "labels"], createdAt: Date.parse("2026-08-19T10:00:00Z")
  },
  {
    id: "article-hsp-autism", segment: "life", batch: "People & identity batch", sourceLabel: "The Autlaws",
    title: "The Highly Sensitive Person Is Autistic, Autistic, Autistic",
    url: "https://medium.com/@theautlaws/the-highly-sensitive-person-is-autistic-autistic-autistic-9da1bc531ed7",
    quote: "Sensitivity and autistic traits can overlap, and masked autism is underdiagnosed. But resonance with a trait description is not sufficient evidence for a diagnosis.",
    relevance: "Your pattern-hunting brain can move quickly from ‘I do X’ to ‘therefore I am Y.’ Keep identity claims provisional and use qualified assessment when a label would materially affect your choices.",
    resonance: "Trait recognition feels like diagnosis—but overlap is not identity.",
    tags: ["identity", "psychology", "evidence"], createdAt: Date.parse("2026-08-19T09:00:00Z")
  },
  {
    id: "article-pseudo-smart-signs", segment: "life", batch: "People & identity batch", sourceLabel: "Matt the Nomad",
    title: "The Signs of a Pseudo-Smart Person Are Easy to Spot",
    url: "https://medium.com/@mattthenomad/the-signs-of-a-pseudo-smart-person-are-easy-to-spot-226e70231040",
    quote: "Performative intelligence collects frameworks and broadcasts certainty. Real understanding can explain without decorative vocabulary, build, test, predict and notice when its own model fails.",
    relevance: "You are intensely interested in intelligence and big explanatory ideas. The nearby trap is becoming addicted to the feeling of understanding rather than developing ability that survives contact with a real problem.",
    resonance: "Can you do something with it? That is intelligence with teeth.",
    tags: ["intelligence", "humility", "action"], createdAt: Date.parse("2026-08-19T08:00:00Z")
  },
  {
    id: "article-pseudo-smart-habit", segment: "life", batch: "People & identity batch", sourceLabel: "Matt the Nomad",
    title: "One Annoying Habit Exposes a Pseudo-Smart Person Right Away",
    url: "https://medium.com/@mattthenomad/one-annoying-habit-exposes-a-pseudo-smart-person-right-away-8a6cc48d946b",
    quote: "Content about intelligence is not necessarily content that increases intelligence. Identity-flattering headlines are engineered to make recognition feel like growth.",
    relevance: "Treat ‘smart people do X’ content as entertainment until it changes how you reason or act. Your curiosity compounds only when it becomes retained knowledge, tested judgment, skill or something built.",
    resonance: "Being curious ≠ learning. Don’t optimize for looking like someone who understands.",
    tags: ["intelligence", "media", "learning"], createdAt: Date.parse("2026-08-19T07:00:00Z")
  },
  {
    id: "article-thirty-years-lessons", segment: "life", batch: "People & identity batch", sourceLabel: "A Fresh Mindset",
    title: "I Spent 30 Years Learning These 10 Lessons the Hard Way",
    url: "https://medium.com/@afreshmindset/i-spent-30-years-learning-these-10-lessons-the-hard-way-4e628c8abffe",
    quote: "Retrospective life advice is useful evidence, not universal law. Its strongest warning is that people repeatedly sacrifice relationships for things they later decide mattered less.",
    relevance: "Your future-focus can consume university life and relationships in the present. Borrow the author’s costly evidence, then decide consciously which opportunities are seasonal and cannot simply be recovered later.",
    resonance: "Borrow wisdom, not certainty. Ask: am I rehearsing the same regret?",
    tags: ["time", "family", "wisdom"], createdAt: Date.parse("2026-08-19T06:00:00Z")
  },
  {
    id: "article-green-card-africa", segment: "life", batch: "Mobility, AI & wealth", sourceLabel: "Tuko",
    title: "US Green Card Lottery: African Countries with the Most Selected Entrants",
    url: "https://www.tuko.co.ke/business-economy/economy/638979-us-green-card-lottery-list-top-10-african-countries-highest-number-selected-entrants/",
    quote: "A high number of selected entrants signals demand for mobility, not an individual guarantee. Selection begins a process; it is not the same as receiving permanent residence.",
    relevance: "Geographic optionality matters to you, but it should be built as a portfolio of routes: skills, remote income, international employment, work visas and eligible lotteries—not dependence on one random draw.",
    resonance: "Treat immigration as a portfolio of routes, not a lottery ticket.",
    tags: ["migration", "career", "optionality"], createdAt: Date.parse("2026-09-07T12:00:00Z")
  },
  {
    id: "article-right-to-disconnect", segment: "life", batch: "Latest reading", sourceLabel: "TIME",
    title: "Why You Shouldn’t Work on Labor Day",
    url: "https://time.com/article/2026/09/04/why-you-shouldn-t-work-on-labor-day/",
    quote: "Work needs an ending. Even a one-minute after-hours message can reopen an entire mental context; protected recovery matters more than allegiance to a particular weekend schedule.",
    relevance: "Your imagined future can behave like a boss that never clocks out. Coding, wealth, migration and self-improvement can turn every empty hour into evidence that you should be doing more, contaminating rest with guilt.",
    resonance: "Your future may demand disciplined hours, but it does not own every hour you survive.",
    tags: ["rest", "ambition", "attention"], createdAt: Date.parse("2026-09-13T08:00:00Z")
  }
].map(article => ({ ...article, curated: true, bucket: "saved", note: article.relevance, image: "", updatedAt: article.createdAt }));

window.CURATED_ARTICLES = CURATED_ARTICLES;
function legacyApp() {
const state = { records: [], bucket: "all", source: "all", query: "", newest: true, imageData: "" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const els = {
  grid: $("#cardGrid"), empty: $("#emptyState"), count: $("#resultCount"), allCount: $("#allCount"),
  title: $("#viewTitle"), eyebrow: $("#viewEyebrow"), capture: $("#captureDialog"), data: $("#dataDialog"),
  form: $("#captureForm"), sourceUrl: $("#sourceUrl"), quote: $("#quoteText"), note: $("#noteText"),
  bucket: $("#bucketSelect"), tags: $("#tagsInput"), recordId: $("#recordId"), preview: $("#imagePreview"),
  imageInput: $("#imageInput"), delete: $("#deleteRecord"), toast: $("#toast"), charCount: $("#charCount"),
  article: $("#articleDialog")
};

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function allRecords() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putRecord(record) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(record);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
}

async function removeRecord(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).delete(id);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
}

function sourceDetails(url, hasImage = false) {
  if (!url) return { type: hasImage ? "image" : "note", label: hasImage ? "Screenshot" : "Personal note", domain: "" };
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host.includes("youtube.com") || host === "youtu.be") {
      const commentId = parsed.searchParams.get("lc");
      return { type: "youtube", label: commentId ? "YouTube comment" : "YouTube", domain: host, commentId };
    }
    return { type: "article", label: host, domain: host };
  } catch { return { type: "note", label: "Saved link", domain: "" }; }
}

function escapeHtml(value = "") {
  return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function safeUrl(value = "") {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
}

function weekSeed() {
  const now = new Date();
  const utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((utc + 259200000) / 604800000);
}

function seededScore(value) {
  let hash = 2166136261;
  for (const char of value) { hash ^= char.codePointAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

function weeklyRecords() {
  const seed = weekSeed();
  return [...state.records].sort((a, b) => seededScore(`${seed}:${a.id}`) - seededScore(`${seed}:${b.id}`)).slice(0, 5);
}

function filteredRecords() {
  const q = state.query.trim().toLowerCase();
  const weeklyIds = new Set(weeklyRecords().map(record => record.id));
  return state.records.filter(record => {
    const source = sourceDetails(record.url, Boolean(record.image));
    const inBucket = state.bucket === "all"
      || (state.bucket === "weekly" ? weeklyIds.has(record.id)
        : ["tech", "life"].includes(state.bucket) ? record.segment === state.bucket
          : record.bucket === state.bucket);
    const inSource = state.source === "all" || source.type === state.source;
    const haystack = [record.title, record.quote, record.note, record.relevance, record.resonance, record.url, record.sourceLabel, ...(record.tags || [])].filter(Boolean).join(" ").toLowerCase();
    return inBucket && inSource && (!q || haystack.includes(q));
  }).sort((a, b) => state.newest ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
}

function render() {
  const records = filteredRecords();
  els.grid.innerHTML = records.map((record, index) => {
    const source = sourceDetails(record.url, Boolean(record.image));
    const tags = (record.tags || []).slice(0, 2).map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join("");
    const image = record.image ? `<img class="card-image" src="${record.image}" alt="Saved screenshot" />` : "";
    const cardClass = record.curated ? `curated-card segment-${record.segment}` : `bucket-${record.bucket}`;
    const sourceName = record.sourceLabel || source.label;
    const title = record.title ? `<h2 class="article-card-title">${escapeHtml(record.title)}</h2>` : "";
    const insight = record.curated ? `<p class="card-insight"><b>Relevant</b>${escapeHtml(record.relevance)}</p><p class="resonance-line">“${escapeHtml(record.resonance)}”</p>` : (record.note ? `<p class="card-note">${escapeHtml(record.note)}</p>` : "");
    const badge = record.curated ? `<span class="segment-badge">${escapeHtml(record.segment)}</span>` : `<span>${escapeHtml(BUCKETS[record.bucket]?.label || "Inbox")}</span>`;
    return `<article class="fragment-card ${cardClass}" data-id="${record.id}" tabindex="0" style="animation-delay:${Math.min(index * 45, 270)}ms">
      <div class="card-source"><span class="source-name">${source.type === "youtube" ? "▶ " : source.type === "article" ? "↗ " : source.type === "image" ? "▧ " : "✎ "}${escapeHtml(sourceName)}</span>${badge}</div>
      ${title}
      <span class="quote-mark">“</span>
      <blockquote>${escapeHtml(record.quote)}</blockquote>
      ${insight}
      ${image}
      <div class="card-bottom">${tags}<span class="card-date">${formatDate(record.createdAt)}</span></div>
    </article>`;
  }).join("");
  els.grid.hidden = records.length === 0;
  els.empty.hidden = records.length !== 0;
  const noun = records.length === 1 ? "fragment" : "fragments";
  els.count.textContent = `${records.length} ${noun}`;
  els.allCount.textContent = state.records.length;
  [...Object.keys(BUCKETS), "weekly", "tech", "life"].forEach(bucket => {
    const node = document.querySelector(`[data-count="${bucket}"]`);
    if (node) node.textContent = bucket === "weekly"
      ? weeklyRecords().length
      : ["tech", "life"].includes(bucket)
        ? state.records.filter(record => record.segment === bucket).length
        : state.records.filter(record => record.bucket === bucket).length;
  });
  $$(".fragment-card").forEach(card => {
    card.addEventListener("click", () => openRecord(card.dataset.id));
    card.addEventListener("keydown", event => { if (["Enter", " "].includes(event.key)) openRecord(card.dataset.id); });
  });
}

function setBucket(bucket) {
  state.bucket = bucket;
  if (["tech", "life"].includes(bucket)) {
    state.source = "all";
    $$("[data-source]").forEach(button => button.classList.toggle("active", button.dataset.source === "all"));
  }
  $$("[data-bucket]").forEach(button => button.classList.toggle("active", button.dataset.bucket === bucket));
  $$("[data-mobile-bucket]").forEach(button => button.classList.toggle("active", button.dataset.mobileBucket === bucket));
  const config = bucket === "all"
    ? { title: "Random reason-resonating remarks online.", eyebrow: "Your archive" }
    : bucket === "weekly"
      ? { title: "Highlights this week.", eyebrow: "A fresh set every Monday" }
      : bucket === "tech"
        ? { title: "Ideas that sharpen how you build.", eyebrow: "Reading · Tech" }
        : bucket === "life"
          ? { title: "Ideas that change how you live.", eyebrow: "Reading · Life" }
      : { title: BUCKETS[bucket].label + ".", eyebrow: "Your archive" };
  els.title.textContent = config.title;
  els.eyebrow.textContent = config.eyebrow;
  render();
}

function resetForm() {
  els.form.reset();
  els.recordId.value = "";
  state.imageData = "";
  els.preview.hidden = true;
  els.preview.removeAttribute("src");
  els.delete.hidden = true;
  $("#openSource").hidden = true;
  $("#openSource").removeAttribute("href");
  $("#dialogTitle").textContent = "What stopped you?";
  $("#saveRecord").textContent = "Save fragment";
  $("#saveRecord").disabled = false;
  $("#ocrProgress").hidden = true;
  $("#ocrBar").style.width = "0%";
  $("#imageHelp").textContent = "PNG, JPG, or WebP — text is extracted on this device";
  els.charCount.textContent = "0";
  els.bucket.value = BUCKETS[state.bucket] ? state.bucket : "inbox";
}

function openCapture() { resetForm(); els.capture.showModal(); setTimeout(() => els.sourceUrl.focus(), 30); }

function openRecord(id) {
  const record = state.records.find(item => item.id === id);
  if (record?.curated) openArticle(record);
  else openEditor(id);
}

function openArticle(record) {
  $("#articleSegment").textContent = `ARTICLE · ${record.segment.toUpperCase()} · ${record.batch}`;
  $("#articleTitle").textContent = record.title;
  $("#articleThesis").textContent = record.quote;
  $("#articleRelevance").textContent = record.relevance;
  $("#articleResonance").textContent = record.resonance;
  $("#articleSource").textContent = record.sourceLabel;
  const href = safeUrl(record.url);
  $("#articleLink").hidden = !href;
  if (href) $("#articleLink").href = href;
  els.article.showModal();
}

function openEditor(id) {
  const record = state.records.find(item => item.id === id);
  if (!record) return;
  resetForm();
  els.recordId.value = record.id;
  els.sourceUrl.value = record.url || "";
  els.quote.value = record.quote;
  els.note.value = record.note || "";
  els.bucket.value = record.bucket;
  els.tags.value = (record.tags || []).join(", ");
  state.imageData = record.image || "";
  if (record.image) { els.preview.src = record.image; els.preview.hidden = false; }
  els.charCount.textContent = record.quote.length;
  els.delete.hidden = false;
  const sourceHref = safeUrl(record.url);
  if (sourceHref) { $("#openSource").href = sourceHref; $("#openSource").hidden = false; }
  $("#dialogTitle").textContent = "Edit this fragment.";
  $("#saveRecord").textContent = "Save changes";
  els.capture.showModal();
}

function notify(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => els.toast.classList.remove("show"), 2300);
}

async function saveForm(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (!els.quote.value.trim()) { els.quote.focus(); return; }
  const existing = state.records.find(record => record.id === els.recordId.value);
  const record = {
    id: existing?.id || crypto.randomUUID(),
    quote: els.quote.value.trim(),
    note: els.note.value.trim(),
    url: els.sourceUrl.value.trim(),
    bucket: els.bucket.value,
    tags: els.tags.value.split(",").map(tag => tag.trim().replace(/^#/, "")).filter(Boolean).slice(0, 8),
    image: state.imageData,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now()
  };
  try {
    await putRecord(record);
    state.records = await allRecords();
    els.capture.close();
    render();
    notify(existing ? "Fragment updated" : "Fragment tucked away");
  } catch { notify("Could not save on this device"); }
}

async function transcribeImage(file) {
  const progress = $("#ocrProgress");
  const bar = $("#ocrBar");
  const help = $("#imageHelp");
  const save = $("#saveRecord");
  progress.hidden = false;
  save.disabled = true;
  help.textContent = "Preparing private on-device transcription…";
  let worker;
  try {
    if (!window.Tesseract?.createWorker) throw new Error("OCR engine unavailable");
    const absolute = path => new URL(path, window.location.href).href;
    worker = await Tesseract.createWorker("eng", 1, {
      workerPath: absolute("./ocr/worker.min.js"),
      corePath: absolute("./ocr/tesseract-core-lstm.wasm.js"),
      langPath: absolute("./ocr").replace(/\/$/, ""),
      gzip: true,
      logger: message => {
        const percent = Math.round((message.progress || 0) * 100);
        bar.style.width = `${percent}%`;
        help.textContent = message.status === "recognizing text" ? `Reading screenshot… ${percent}%` : "Loading the on-device reader…";
      }
    });
    const result = await worker.recognize(file);
    const text = result?.data?.text?.replace(/\n{3,}/g, "\n\n").trim();
    if (!text) throw new Error("No text found");
    els.quote.value = els.quote.value.trim() ? `${els.quote.value.trim()}\n\n${text}` : text;
    els.charCount.textContent = els.quote.value.length;
    help.textContent = "Text extracted — check it, then save";
    bar.style.width = "100%";
    notify("Screenshot turned into editable text");
  } catch {
    help.textContent = "No clear text found — you can still type or paste it above";
    notify("Could not read that screenshot clearly");
  } finally {
    if (worker) await worker.terminate();
    save.disabled = false;
    setTimeout(() => { progress.hidden = true; }, 900);
  }
}

async function handleImage(file) {
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) { notify("Please choose an image under 8 MB"); return; }
  state.imageData = await new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  });
  els.preview.src = state.imageData;
  els.preview.hidden = false;
  await transcribeImage(file);
}

async function exportArchive() {
  const payload = { app: "Commentary Archive", version: 1, exportedAt: new Date().toISOString(), fragments: state.records };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `commentary-archive-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  notify("Backup downloaded");
}

async function importArchive(file) {
  try {
    const payload = JSON.parse(await file.text());
    if (!Array.isArray(payload.fragments)) throw new Error("Invalid backup");
    for (const item of payload.fragments) {
      if (!item.id || !item.quote) continue;
      if (!BUCKETS[item.bucket]) item.bucket = "saved";
      await putRecord(item);
    }
    state.records = await allRecords();
    render();
    els.data.close();
    notify("Backup restored");
  } catch { notify("That does not look like a valid backup"); }
}

async function updateStorageLine() {
  if (!navigator.storage?.estimate) return;
  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  $("#storageLine").textContent = `${(usage / 1024 / 1024).toFixed(1)} MB used on this device · ${Math.round(quota / 1024 / 1024)} MB available`;
  navigator.storage.persist?.();
}

function registerWebMcp() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  try {
    context.registerTool({
      name: "capture_fragment",
      title: "Capture a fragment",
      description: "Save a quote or comment to the local Commentary Archive.",
      inputSchema: { type: "object", properties: { quote: { type: "string" }, note: { type: "string" }, url: { type: "string" }, bucket: { type: "string", enum: Object.keys(BUCKETS) }, tags: { type: "array", items: { type: "string" } } }, required: ["quote"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      async execute(input) {
        if (!input || typeof input.quote !== "string" || !input.quote.trim()) throw new Error("quote is required");
        const record = { id: crypto.randomUUID(), quote: input.quote.trim(), note: input.note || "", url: input.url || "", bucket: BUCKETS[input.bucket] ? input.bucket : "inbox", tags: Array.isArray(input.tags) ? input.tags.slice(0,8) : [], image: "", createdAt: Date.now(), updatedAt: Date.now() };
        await putRecord(record); state.records = await allRecords(); render(); return { id: record.id, saved: true, bucket: record.bucket };
      }
    });
    context.registerTool({
      name: "search_fragments", title: "Search fragments", description: "Search the local archive without changing it.",
      inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute(input) { if (typeof input?.query !== "string") throw new Error("query is required"); const q = input.query.toLowerCase(); return { matches: state.records.filter(r => [r.quote,r.note,r.url,...(r.tags||[])].join(" ").toLowerCase().includes(q)).slice(0,20).map(r => ({ id:r.id, quote:r.quote, bucket:r.bucket })) }; }
    });
  } catch { /* Unsupported preview implementations must not affect the app. */ }
}

$$('[data-bucket]').forEach(button => button.addEventListener("click", () => setBucket(button.dataset.bucket)));
$$('[data-mobile-bucket]').forEach(button => button.addEventListener("click", () => setBucket(button.dataset.mobileBucket)));
$$('[data-source]').forEach(button => button.addEventListener("click", () => { state.source = button.dataset.source; $$('[data-source]').forEach(item => item.classList.toggle("active", item === button)); render(); }));
$("#searchInput").addEventListener("input", event => { state.query = event.target.value; render(); });
$("#sortButton").addEventListener("click", event => { state.newest = !state.newest; event.currentTarget.textContent = state.newest ? "Newest ↓" : "Oldest ↑"; render(); });
[$("#openCapture"), $("#emptyCapture"), $("#mobileCapture")].forEach(button => button.addEventListener("click", openCapture));
[$("#openData"), $("#mobileData")].forEach(button => button.addEventListener("click", () => { updateStorageLine(); els.data.showModal(); }));
els.form.addEventListener("submit", saveForm);
els.quote.addEventListener("input", () => els.charCount.textContent = els.quote.value.length);
els.imageInput.addEventListener("change", event => handleImage(event.target.files[0]));
els.delete.addEventListener("click", async () => { await removeRecord(els.recordId.value); state.records = await allRecords(); els.capture.close(); render(); notify("Fragment deleted"); });
$("#exportData").addEventListener("click", exportArchive);
$("#importData").addEventListener("change", event => importArchive(event.target.files[0]));
document.addEventListener("keydown", event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#searchInput").focus(); } if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && els.capture.open) els.form.requestSubmit(); });

async function init() {
  try {
    state.records = await allRecords();
    if (localStorage.getItem(ARTICLE_LIBRARY_VERSION) !== "seeded") {
      const ids = new Set(state.records.map(record => record.id));
      for (const article of CURATED_ARTICLES) if (!ids.has(article.id)) await putRecord(article);
      localStorage.setItem(ARTICLE_LIBRARY_VERSION, "seeded");
      state.records = await allRecords();
    }
    const legacyRecords = state.records.filter(record => !BUCKETS[record.bucket]);
    for (const record of legacyRecords) await putRecord({ ...record, bucket: "saved", updatedAt: Date.now() });
    if (legacyRecords.length) state.records = await allRecords();
    render();
  } catch { notify("This browser blocked local storage"); }
  registerWebMcp();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js?v=5").catch(() => {});
}

$("#closeArticle").addEventListener("click", () => els.article.close());
$("#dismissArticle").addEventListener("click", () => els.article.close());
init();
}
