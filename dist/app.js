const DB_NAME = "commentary-archive";
const STORE = "fragments";
const VERSION = 1;
const BUCKETS = {
  inbox: { label: "Inbox", color: "coral" },
  saved: { label: "Saved", color: "blue" }
};

const state = { records: [], bucket: "all", source: "all", query: "", newest: true, imageData: "" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const els = {
  grid: $("#cardGrid"), empty: $("#emptyState"), count: $("#resultCount"), allCount: $("#allCount"),
  title: $("#viewTitle"), eyebrow: $("#viewEyebrow"), capture: $("#captureDialog"), data: $("#dataDialog"),
  form: $("#captureForm"), sourceUrl: $("#sourceUrl"), quote: $("#quoteText"), note: $("#noteText"),
  bucket: $("#bucketSelect"), tags: $("#tagsInput"), recordId: $("#recordId"), preview: $("#imagePreview"),
  imageInput: $("#imageInput"), delete: $("#deleteRecord"), toast: $("#toast"), charCount: $("#charCount")
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
    const inBucket = state.bucket === "all" || (state.bucket === "weekly" ? weeklyIds.has(record.id) : record.bucket === state.bucket);
    const inSource = state.source === "all" || source.type === state.source;
    const haystack = [record.quote, record.note, record.url, ...(record.tags || [])].join(" ").toLowerCase();
    return inBucket && inSource && (!q || haystack.includes(q));
  }).sort((a, b) => state.newest ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
}

function render() {
  const records = filteredRecords();
  els.grid.innerHTML = records.map((record, index) => {
    const source = sourceDetails(record.url, Boolean(record.image));
    const tags = (record.tags || []).slice(0, 2).map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join("");
    const image = record.image ? `<img class="card-image" src="${record.image}" alt="Saved screenshot" />` : "";
    return `<article class="fragment-card bucket-${record.bucket}" data-id="${record.id}" tabindex="0" style="animation-delay:${Math.min(index * 45, 270)}ms">
      <div class="card-source"><span class="source-name">${source.type === "youtube" ? "▶ " : source.type === "article" ? "↗ " : source.type === "image" ? "▧ " : "✎ "}${escapeHtml(source.label)}</span><span>${escapeHtml(BUCKETS[record.bucket]?.label || "Inbox")}</span></div>
      <span class="quote-mark">“</span>
      <blockquote>${escapeHtml(record.quote)}</blockquote>
      ${record.note ? `<p class="card-note">${escapeHtml(record.note)}</p>` : ""}
      ${image}
      <div class="card-bottom">${tags}<span class="card-date">${formatDate(record.createdAt)}</span></div>
    </article>`;
  }).join("");
  els.grid.hidden = records.length === 0;
  els.empty.hidden = records.length !== 0;
  const noun = records.length === 1 ? "fragment" : "fragments";
  els.count.textContent = `${records.length} ${noun}`;
  els.allCount.textContent = state.records.length;
  [...Object.keys(BUCKETS), "weekly"].forEach(bucket => {
    const node = document.querySelector(`[data-count="${bucket}"]`);
    if (node) node.textContent = bucket === "weekly" ? weeklyRecords().length : state.records.filter(record => record.bucket === bucket).length;
  });
  $$(".fragment-card").forEach(card => {
    card.addEventListener("click", () => openEditor(card.dataset.id));
    card.addEventListener("keydown", event => { if (["Enter", " "].includes(event.key)) openEditor(card.dataset.id); });
  });
}

function setBucket(bucket) {
  state.bucket = bucket;
  $$("[data-bucket]").forEach(button => button.classList.toggle("active", button.dataset.bucket === bucket));
  $$("[data-mobile-bucket]").forEach(button => button.classList.toggle("active", button.dataset.mobileBucket === bucket));
  const config = bucket === "all"
    ? { title: "Random reason-resonating remarks online.", eyebrow: "Your archive" }
    : bucket === "weekly"
      ? { title: "Highlights this week.", eyebrow: "A fresh set every Monday" }
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
$("#mobileSearch").addEventListener("click", () => { $("#searchInput").focus(); window.scrollTo({ top: 110, behavior: "smooth" }); });
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
    const legacyRecords = state.records.filter(record => !BUCKETS[record.bucket]);
    for (const record of legacyRecords) await putRecord({ ...record, bucket: "saved", updatedAt: Date.now() });
    if (legacyRecords.length) state.records = await allRecords();
    render();
  } catch { notify("This browser blocked local storage"); }
  registerWebMcp();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js?v=5").catch(() => {});
}
init();
