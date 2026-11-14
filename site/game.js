"use strict";

const SAVE_KEY = "adult-life-1-1";

const CAST = {
  puppy: { name: "小白（我）", alt: "小白", src: "assets/puppy.webp", pill: "pill-me", w: 432, h: 720, scale: 1 },
  fox: { name: "狐狸房仲 阿狐", alt: "狐狸房仲 阿狐", src: "assets/fox.webp", pill: "pill-fox", w: 447, h: 720, scale: 1 },
  owl: { name: "貓頭鷹老師", alt: "貓頭鷹老師", src: "assets/owl.webp", pill: "pill-owl", w: 554, h: 720, scale: 0.86 },
  raccoon: { name: "浣熊阿姨", alt: "浣熊阿姨", src: "assets/raccoon.webp", pill: "pill-raccoon", w: 515, h: 720, scale: 1 },
  system: { name: "養成所", alt: "", pill: "pill-sys" }
};

const CARDS = {
  c1: {
    icon: "📏",
    title: "權狀坪數三兄弟",
    body: "主建物（門內真正住的空間）、附屬建物（主要是陽台）、公設（大廳、走廊、電梯、樓梯間、機房等全棟共用，按比例分攤）。"
  },
  c2: {
    icon: "🔍",
    title: "比大小看主建物",
    body: "總坪數大不代表住得大；先看主建物坪數，再算公設比。"
  },
  c3: {
    icon: "⚠️",
    title: "坪數陷阱",
    body: "雨遮看建照年份（107/1/1 後不登記）；車位要分開算單價；買賣前查實價登錄。"
  }
};

const ITEMS = [
  { id: "living", label: "客廳", bin: "main" },
  { id: "bed", label: "臥室", bin: "main" },
  { id: "kitchen", label: "廚房", bin: "main" },
  { id: "bath", label: "浴室", bin: "main" },
  { id: "balcony", label: "陽台", bin: "annex" },
  { id: "elevator", label: "電梯", bin: "public" },
  { id: "lobby", label: "一樓大廳", bin: "public" },
  { id: "stairs", label: "樓梯間", bin: "public" },
  { id: "tank", label: "頂樓水箱機房", bin: "public" }
];

const BINS = [
  { id: "main", label: "🏠 主建物", sub: "門內真正住的空間" },
  { id: "annex", label: "🌿 附屬建物", sub: "自家的，但在門外" },
  { id: "public", label: "🏢 公設", sub: "全棟住戶一起用" }
];

const SCRIPT = [
  { id: "s1-hello", scene: 0, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    text: "歡迎歡迎～這間『30 坪、三房兩廳』，超大的喔！" },
  { id: "s1-think", scene: 0, type: "say", speaker: "puppy", cast: ["puppy"],
    text: "咦…一進門怎麼覺得沒那麼大？" },
  { id: "s1-ask", scene: 0, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "q1",
    text: "先別急著簽名。你覺得該先問阿狐什麼？",
    choices: [
      { icon: "📏", text: "這 30 坪是權狀坪數嗎？裡面公設佔多少？", correct: true },
      { icon: "💰", text: "可以算便宜一點嗎？", hint: "價錢之後再談，先搞清楚你買的『30 坪』裡面有什麼。你想先問哪一件？" },
      { icon: "🍜", text: "附近有什麼好吃的？", hint: "生活機能也重要，但現在的疑問是『怎麼沒那麼大』。要不要改問坪數？" }
    ] },
  { id: "s1-ok1", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "問得好。先搞清楚坪數，才不會被『超大』兩個字帶走。" },
  { id: "s1-ok2", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "1 坪約 3.3 平方公尺（精確是 3.3058），大約兩張單人床併起來。" },
  { id: "s1-ok3", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "廣告的坪數通常是『權狀坪數』，等於主建物 + 附屬建物 + 公設（共有部分）。" },
  { id: "s1-ok4", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "房價常用『權狀坪數 × 每坪單價』來算，所以公設也要付錢。" },
  { id: "s1-card", scene: 0, type: "card", card: "c1", speaker: "owl", cast: ["puppy", "owl"],
    text: "第一張知識卡幫你記住：權狀上的坪數，有三兄弟。" },

  { id: "s2-sort", scene: 1, type: "sort", speaker: "owl", cast: ["puppy", "owl"],
    text: "把這些空間放進正確的格子！" },
  { id: "s2-wrap", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "真正住得到的只有主建物。公設越多，同樣坪數的室內就越小。" },

  { id: "s3-q", scene: 2, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "q3", extra: "houses",
    text: "兩間總價一樣，哪一間室內比較大？",
    choices: [
      { icon: "🏠", text: "A 屋，因為 30 坪比較多", hint: "30 坪裡有 10 坪是公設，室內主建物只有多少？再比一次。" },
      { icon: "🏡", text: "B 屋，因為主建物 20 坪比 18 坪大", correct: true },
      { icon: "🤝", text: "一樣大", hint: "兩間不一樣大喔。比較看看兩間的『主建物』。" }
    ] },
  { id: "s3-ok1", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "對，比室內大小要看主建物。B 屋主建物 20 坪，比 A 屋的 18 坪大。" },
  { id: "s3-ok2", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "A 屋公設比是 10 ÷ 30 ≈ 33%，B 屋是 5 ÷ 26 ≈ 19%。公設比的算法是：公設 ÷ 權狀總坪數。" },
  { id: "s3-card", scene: 2, type: "card", card: "c2", speaker: "owl", cast: ["puppy", "owl"],
    text: "總坪數大，不代表住得大。這張卡幫你記得怎麼比。" },

  { id: "s4-intro", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "阿狐還會繼續說。有些是事實，有些是陷阱。先一句一句聽，再點出可疑的那句。" },
  { id: "s4-a1", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    text: "這間有登記雨遮，雨遮坪數一樣照單價算喔～" },
  { id: "s4-a2", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    text: "陽台是附屬建物，有登記在權狀上。" },
  { id: "s4-a3", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    text: "公設包含大廳和電梯。" },
  { id: "s4-q1", scene: 3, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "trap1",
    text: "哪一句要特別小心？",
    choices: [
      { icon: "💬", text: "這間有登記雨遮，雨遮坪數一樣照單價算喔～", correct: true },
      { icon: "💬", text: "陽台是附屬建物，有登記在權狀上。", hint: "這句是對的。陽台是附屬建物，有登記的話會寫在權狀上。再找找哪一句在算錢。" },
      { icon: "💬", text: "公設包含大廳和電梯。", hint: "這句是對的。大廳和電梯都算公設。再聽一次，哪一句要把雨遮算進價錢？" }
    ] },
  { id: "s4-ex1", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "抓到了。雨遮能不能登記、能不能算錢，要看申請建造執照的年份。" },
  { id: "s4-ex2", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "107 年（2018 年）1 月 1 日以後申請建造執照的新建物，屋簷、雨遮不能再登記。更早申請建照的房子，權狀上可能還有雨遮。" },
  { id: "s4-ex3", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "而從 100 年（2011 年）5 月起，預售屋的雨遮就規定不能計價。看到雨遮要算錢，一定要問清楚、看權狀。" },
  { id: "s4-intro2", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "還有一個陷阱。再聽三句。" },
  { id: "s4-b1", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    text: "每坪 60 萬，總共 40 坪，含車位喔！" },
  { id: "s4-b2", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    text: "主建物有 22 坪。" },
  { id: "s4-b3", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    text: "這棟是 2020 年蓋好的。" },
  { id: "s4-q2", scene: 3, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "trap2",
    text: "哪一句可疑？",
    choices: [
      { icon: "💬", text: "每坪 60 萬，總共 40 坪，含車位喔！", correct: true },
      { icon: "💬", text: "主建物有 22 坪。", hint: "主建物有幾坪，可以先記下來。可疑的是總價怎麼把車位算進去。" },
      { icon: "💬", text: "這棟是 2020 年蓋好的。", hint: "年份本身可以是事實。想想『含車位』會不會把每坪單價算糊塗？" }
    ] },
  { id: "s4-ex4", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "對。車位的坪數有時會跟房子算在一起。" },
  { id: "s4-ex5", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "要請房仲把『房屋』和『車位』分開報價，算出房屋每坪真正多少錢。也可以上內政部『實價登錄』，查附近的成交價來比較。" },
  { id: "s4-card", scene: 3, type: "card", card: "c3", speaker: "owl", cast: ["puppy", "owl"],
    text: "最後一張卡，把雨遮和車位兩個陷阱收好。" },

  { id: "s5-1", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "今天記住三件事。第一，權狀坪數是主建物、附屬建物和公設加起來，公設也算在價錢裡。" },
  { id: "s5-2", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "第二，室內大不大要看主建物，再用公設比看共用空間佔多少。" },
  { id: "s5-3", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    text: "第三，雨遮要看建照年份，車位要分開算單價，買賣前查實價登錄。" },
  { id: "s5-raccoon", scene: 4, type: "say", speaker: "raccoon", cast: ["puppy", "raccoon"],
    text: "下一關要不要來我家看看租屋呀？" },
  { id: "s5-soon", scene: 4, type: "say", speaker: "system", cast: ["puppy", "raccoon"], allBright: true,
    text: "第 1-2 關 即將推出" },
  { id: "s5-end", scene: 4, type: "end", speaker: "raccoon", cast: ["puppy", "raccoon"], allBright: true }
];

const MAX_XP = SCRIPT.filter((node) => node.type === "choice").length * 20;
const TITLE_LINE = "這間廣告寫著『30 坪、三房兩廳』。進門之前，我想先搞懂：坪數到底是什麼。";

let S = load();
let selected = null;
let sortMsg = "";
let sortTone = "info";
let lineReady = false;
let gen = 0;
let typeTimer = 0;
let autoTimer = 0;
let choiceLock = false;
let choiceToken = 0;
let endingCue = false;

function fresh() {
  return {
    started: false,
    step: 0,
    xp: 0,
    cards: [],
    seen: [],
    missed: {},
    awarded: {},
    placed: [],
    auto: false,
    phase: "line",
    hint: ""
  };
}

function load() {
  const blank = fresh();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return blank;
    const data = JSON.parse(raw);
    blank.started = !!data.started;
    blank.step = Number.isInteger(data.step) ? data.step : 0;
    blank.xp = Number.isFinite(data.xp) ? Math.max(0, data.xp) : 0;
    blank.cards = Array.isArray(data.cards) ? data.cards.filter((id) => CARDS[id]) : [];
    blank.seen = Array.isArray(data.seen) ? data.seen.filter((id) => CARDS[id]) : [];
    blank.missed = data.missed && typeof data.missed === "object" ? data.missed : {};
    blank.awarded = data.awarded && typeof data.awarded === "object" ? data.awarded : {};
    blank.placed = Array.isArray(data.placed) ? data.placed.filter((id) => ITEMS.some((item) => item.id === id)) : [];
    blank.auto = !!data.auto;
    blank.phase = data.phase === "hint" && typeof data.hint === "string" && data.hint ? "hint" : "line";
    blank.hint = blank.phase === "hint" ? data.hint : "";
    if (blank.step < 0 || blank.step >= SCRIPT.length) blank.step = 0;
    return blank;
  } catch (err) {
    return fresh();
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    started: S.started,
    step: S.step,
    xp: S.xp,
    cards: S.cards,
    seen: S.seen,
    missed: S.missed,
    awarded: S.awarded,
    placed: S.placed,
    auto: S.auto,
    phase: S.phase,
    hint: S.hint
  }));
}

function current() {
  return SCRIPT[S.step];
}

function viewName() {
  if (!S.started) return "title";
  if (S.phase === "hint") return "hint";
  return current().type;
}

function speechText() {
  if (!S.started) return TITLE_LINE;
  if (S.phase === "hint") return S.hint;
  const node = current();
  if (node.type === "end") return "";
  return node.text;
}

function starCount() {
  const ratio = S.xp / MAX_XP;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

function starBlurb(count) {
  if (count >= 3) return "問問題、拆坪數、抓陷阱，一次就看穿。小白可以放心再往下看房子了。";
  if (count === 2) return "大觀念都抓到了。再玩一次，把猶豫的地方問到清楚。";
  return "沒關係，知識卡都收好了。再走一次，坪數會更清楚。";
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function ensureRewards() {
  if (!S.started) return;
  const node = current();
  if (node && node.type === "card" && !S.cards.includes(node.card)) {
    S.cards.push(node.card);
    save();
    AdultAudio.sfx("card");
  }
}

function renderChrome() {
  document.getElementById("xp-num").textContent = String(S.xp);
  document.getElementById("card-count").textContent = S.cards.length + "/3";
  document.getElementById("card-badge").hidden = !S.cards.some((id) => !S.seen.includes(id));
  const auto = document.getElementById("btn-auto");
  auto.classList.toggle("on", S.auto);
  auto.setAttribute("aria-pressed", S.auto ? "true" : "false");
  const scene = S.started ? current().scene : 0;
  const finished = S.started && current().type === "end";
  const dots = document.getElementById("dots");
  dots.replaceChildren();
  for (let i = 0; i < 5; i += 1) {
    const dot = el("i", "dot");
    if (finished || i < scene) dot.classList.add("done");
    else if (i === scene) dot.classList.add("now");
    dots.appendChild(dot);
  }
  document.getElementById("hud").dataset.view = viewName();
}

function renderCast() {
  const stage = document.getElementById("stage");
  let cast;
  let speaker;
  let allBright = false;
  if (!S.started) {
    cast = ["puppy"];
    speaker = "puppy";
  } else {
    const node = current();
    cast = node.cast;
    speaker = S.phase === "hint" ? "owl" : node.speaker;
    allBright = !!node.allBright && S.phase !== "hint";
  }
  const inner = el("div", "stage-inner " + (cast.length === 1 ? "solo" : "duo"));
  cast.forEach((who) => {
    const meta = CAST[who];
    const speaking = allBright || cast.length === 1 || who === speaker;
    const fig = el("div", "char" + (speaking ? " speaker" : " dim"));
    fig.style.setProperty("--grow", String((meta.w / meta.h) * meta.scale));
    const img = document.createElement("img");
    img.src = meta.src;
    img.alt = meta.alt;
    img.width = meta.w;
    img.height = meta.h;
    img.draggable = false;
    fig.append(img, el("i", "shadow"));
    inner.appendChild(fig);
  });
  stage.replaceChildren(inner);
}

function makeDialogue(speakerKey) {
  const meta = CAST[speakerKey] || CAST.system;
  const box = el("div", "dialogue");
  box.id = "dialogue";
  box.dataset.testid = "dialogue";
  box.append(el("div", "name " + meta.pill, meta.name));
  const text = el("p", "");
  text.id = "dialogue-text";
  text.dataset.testid = "dialogue-text";
  box.append(text, el("div", "tap-hint"));
  box.lastChild.id = "tap-hint";
  return box;
}

function makeChoices(node) {
  const wrap = el("div", "choices");
  wrap.dataset.testid = "choices";
  node.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.dataset.choice = String(index);
    const icon = el("span", "choice-icon", choice.icon);
    icon.setAttribute("aria-hidden", "true");
    btn.append(icon, el("span", "choice-text", choice.text));
    wrap.appendChild(btn);
  });
  return wrap;
}

function makeHouses() {
  const wrap = el("div", "houses");
  wrap.dataset.testid = "houses";
  [
    { name: "A 屋", deed: "權狀 30 坪", rows: ["主建物 18", "陽台 2", "公設 10"], tone: "a" },
    { name: "B 屋", deed: "權狀 26 坪", rows: ["主建物 20", "陽台 1", "公設 5"], tone: "b" }
  ].forEach((house) => {
    const card = el("article", "house house-" + house.tone);
    card.append(el("h3", "", house.name), el("p", "deed", house.deed));
    const list = el("ul", "");
    house.rows.forEach((row) => list.appendChild(el("li", "", row)));
    card.appendChild(list);
    wrap.appendChild(card);
  });
  return wrap;
}

function goButton(label, testid) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "choice choice-mint choice-go";
  btn.dataset.advance = "1";
  if (testid) {
    btn.dataset.testid = testid;
    btn.id = testid;
  }
  btn.appendChild(el("span", "choice-text", label));
  return btn;
}

function makeCard(id) {
  const card = CARDS[id];
  const art = el("article", "kcard preview");
  art.append(el("div", "kcard-tag", "新的知識卡"), el("h3", "", card.icon + " " + card.title), el("p", "", card.body));
  return art;
}

function makeSort() {
  const wrap = el("div", "sort");
  wrap.dataset.testid = "sort";
  const tray = el("div", "chip-tray");
  tray.id = "chip-tray";
  const bins = el("div", "bins");
  bins.id = "bins";
  BINS.forEach((bin) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bin";
    btn.dataset.bin = bin.id;
    const head = el("span", "bin-head");
    head.append(el("span", "bin-title", bin.label), el("span", "bin-sub", bin.sub));
    const slots = el("span", "bin-slots");
    slots.dataset.slots = bin.id;
    btn.append(head, slots);
    bins.appendChild(btn);
  });
  wrap.append(tray, bins, goButton("繼續", "sort-next"));
  return wrap;
}

function makeEnding() {
  const count = starCount();
  const box = el("section", "ending");
  box.dataset.testid = "ending";
  box.append(el("p", "end-kicker", "第 1-1 關完成"), el("h2", "", "「30 坪」到底有多大？"));
  const stars = el("div", "stars");
  stars.setAttribute("aria-label", count + " 顆星");
  for (let i = 0; i < 3; i += 1) {
    stars.appendChild(el("span", i < count ? "star on" : "star", i < count ? "★" : "☆"));
  }
  box.append(stars, el("p", "end-xp", "XP " + S.xp + " / " + MAX_XP), el("p", "end-note", starBlurb(count)), el("p", "soon", "第 1-2 關 即將推出"));
  const again = goButton("再玩一次", "replay");
  again.classList.add("choice-go");
  again.removeAttribute("data-advance");
  again.dataset.replay = "1";
  const see = goButton("看知識卡");
  see.classList.remove("choice-mint");
  see.removeAttribute("data-advance");
  see.dataset.openCards = "1";
  box.append(again, see);
  return box;
}

function buildPanel() {
  const panel = document.getElementById("panel");
  const view = viewName();
  if (view === "title") {
    panel.replaceChildren(makeDialogue("puppy"), goButton("開始", "start"));
    panel.lastChild.removeAttribute("data-advance");
    panel.lastChild.dataset.start = "1";
    return;
  }
  const node = current();
  if (view === "end") {
    panel.replaceChildren(makeEnding());
    return;
  }
  const speaker = view === "hint" ? "owl" : node.speaker;
  const dialogue = makeDialogue(speaker);
  const parts = [dialogue];
  if (view === "choice") {
    if (node.extra === "houses") parts.push(makeHouses());
    parts.push(makeChoices(node));
  } else if (view === "card") {
    parts.push(makeCard(node.card), goButton("繼續"));
  } else if (view === "sort") {
    const status = el("p", "sort-status");
    status.id = "sort-status";
    dialogue.appendChild(status);
    parts.push(makeSort());
  }
  panel.replaceChildren(...parts);
}

function fillSort() {
  const tray = document.getElementById("chip-tray");
  if (!tray) return;
  tray.replaceChildren();
  ITEMS.forEach((item) => {
    if (S.placed.includes(item.id)) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (selected === item.id ? " selected" : "");
    btn.dataset.item = item.id;
    btn.textContent = item.label;
    tray.appendChild(btn);
  });
  BINS.forEach((bin) => {
    const slots = document.querySelector('[data-slots="' + bin.id + '"]');
    slots.replaceChildren();
    const mine = ITEMS.filter((item) => item.bin === bin.id && S.placed.includes(item.id));
    if (!mine.length) {
      slots.appendChild(el("span", "bin-empty", "點這裡放入"));
      return;
    }
    mine.forEach((item) => slots.appendChild(el("span", "placed", item.label)));
  });
  document.getElementById("bins").classList.toggle("armed", !!selected);
  const status = document.getElementById("sort-status");
  const left = ITEMS.length - S.placed.length;
  if (!sortMsg) {
    if (left === 0) {
      status.textContent = "全部放對了。";
      status.dataset.tone = "ok";
    } else if (left === ITEMS.length) {
      status.textContent = "先點一個空間，再點下面的格子。";
      status.dataset.tone = "info";
    } else {
      status.textContent = "還有 " + left + " 個空間。";
      status.dataset.tone = "info";
    }
  } else {
    status.textContent = sortMsg;
    status.dataset.tone = sortTone || "info";
  }
  const next = document.getElementById("sort-next");
  if (next) next.hidden = S.placed.length !== ITEMS.length;
}

function wrongHint(item) {
  if (item.id === "balcony") return "它是你家的，但在門外、不算室內喔。";
  if (item.bin === "public") return "整棟住戶都會用到的空間屬於哪一格？";
  return "這是門內真正住的空間，要放進主建物喔。";
}

function finishLine(token) {
  if (token != null && token !== gen) return;
  const textNode = document.getElementById("dialogue-text");
  if (textNode) textNode.textContent = speechText();
  lineReady = true;
  document.getElementById("phone").dataset.ready = "1";
  const hint = document.getElementById("tap-hint");
  const view = viewName();
  if (hint) hint.textContent = view === "say" || view === "hint" ? "▼ 點一下繼續" : "";
  AdultAudio.setTalking(false);
  queueAuto();
}

function startType() {
  gen += 1;
  const token = gen;
  clearTimeout(typeTimer);
  clearTimeout(autoTimer);
  lineReady = false;
  AdultAudio.setTalking(true);
  document.getElementById("phone").dataset.ready = "0";
  const textNode = document.getElementById("dialogue-text");
  const hint = document.getElementById("tap-hint");
  if (!textNode) {
    finishLine(token);
    return;
  }
  const chars = Array.from(speechText());
  textNode.textContent = "";
  if (hint) hint.textContent = "";
  let index = 0;
  const tick = () => {
    if (token !== gen) return;
    index += 1;
    textNode.textContent = chars.slice(0, index).join("");
    if (index < chars.length) typeTimer = setTimeout(tick, 16);
    else finishLine(token);
  };
  if (!chars.length) finishLine(token);
  else typeTimer = setTimeout(tick, 16);
}

function canAuto() {
  const view = viewName();
  return view === "say" || view === "hint";
}

function queueAuto() {
  clearTimeout(autoTimer);
  if (!S.auto || !lineReady || !canAuto()) return;
  const token = gen;
  autoTimer = setTimeout(() => {
    if (token !== gen) return;
    advance(false);
  }, 1050);
}

function render() {
  choiceToken += 1;
  choiceLock = false;
  ensureRewards();
  const phone = document.getElementById("phone");
  const view = viewName();
  phone.dataset.view = view;
  phone.dataset.node = S.started ? current().id : "title";
  renderChrome();
  renderCast();
  buildPanel();
  if (view === "sort") fillSort();
  if (view === "end") {
    lineReady = true;
    phone.dataset.ready = "1";
    gen += 1;
    AdultAudio.setTalking(false);
    AdultAudio.sync("end");
    if (!endingCue) {
      endingCue = true;
      AdultAudio.stars(starCount());
    }
    return;
  }
  endingCue = false;
  AdultAudio.sync(view);
  startType();
}

function advance(fromUser) {
  clearTimeout(autoTimer);
  if (!S.started) return;
  if (S.phase === "hint") {
    if (fromUser) AdultAudio.sfx("tap");
    S.phase = "line";
    S.hint = "";
    save();
    render();
    return;
  }
  const node = current();
  if (!node || node.type === "choice" || node.type === "end") return;
  if (node.type === "sort" && S.placed.length < ITEMS.length) return;
  if (fromUser) AdultAudio.sfx("tap");
  if (S.step < SCRIPT.length - 1) S.step += 1;
  save();
  render();
}

function onSkip() {
  const view = viewName();
  if (view === "title" || view === "end" || view === "sort") return;
  if (!lineReady) {
    AdultAudio.sfx("tap");
    gen += 1;
    clearTimeout(typeTimer);
    finishLine(gen);
    return;
  }
  if (view === "choice") return;
  advance(true);
}

function award(qid) {
  if (S.awarded[qid]) return 0;
  const gain = S.missed[qid] ? 10 : 20;
  S.awarded[qid] = true;
  S.xp += gain;
  return gain;
}

function popXP(amount) {
  AdultAudio.sfx("xp");
  document.querySelectorAll(".xp-pop").forEach((node) => node.remove());
  const pop = el("div", "xp-pop", "+" + amount + " XP");
  document.getElementById("lv-pill").appendChild(pop);
  setTimeout(() => pop.remove(), 1100);
}

function onChoice(index, button) {
  if (choiceLock) return;
  const node = current();
  if (!node || node.type !== "choice" || S.phase === "hint") return;
  const choice = node.choices[index];
  AdultAudio.sfx("option");
  if (!choice.correct) {
    AdultAudio.sfx("wrong");
    choiceLock = true;
    const token = choiceToken;
    button.classList.add("shake");
    setTimeout(() => {
      if (token !== choiceToken) return;
      choiceLock = false;
      S.missed[node.qid] = true;
      S.phase = "hint";
      S.hint = choice.hint;
      save();
      render();
    }, 320);
    return;
  }
  AdultAudio.sfx("correct");
  const gain = award(node.qid);
  S.step += 1;
  save();
  render();
  if (gain) popXP(gain);
}

function onPickItem(id) {
  if (S.placed.includes(id)) return;
  selected = selected === id ? null : id;
  if (selected) AdultAudio.sfx("tap");
  sortMsg = selected ? "再點它該去的格子。" : "";
  sortTone = "info";
  fillSort();
}

function onBin(binId) {
  if (!selected) {
    sortMsg = "先點上面的一個空間喔。";
    sortTone = "info";
    fillSort();
    return;
  }
  const item = ITEMS.find((entry) => entry.id === selected);
  if (item.bin !== binId) {
    AdultAudio.sfx("wrong");
    sortMsg = wrongHint(item);
    sortTone = "bad";
    fillSort();
    const chip = document.querySelector('[data-item="' + item.id + '"]');
    if (chip) {
      chip.classList.remove("shake");
      void chip.offsetWidth;
      chip.classList.add("shake");
    }
    return;
  }
  S.placed.push(item.id);
  selected = null;
  AdultAudio.sfx("place");
  const left = ITEMS.length - S.placed.length;
  sortMsg = left === 0 ? "全部放對了。真正住得到的空間，就是主建物這些。" : "放對了。";
  sortTone = "ok";
  save();
  fillSort();
}

function startGame() {
  AdultAudio.unlock();
  S.started = true;
  S.step = 0;
  S.phase = "line";
  S.hint = "";
  selected = null;
  sortMsg = "";
  save();
  render();
}

function resetGame() {
  S = fresh();
  selected = null;
  sortMsg = "";
  sortTone = "info";
  document.querySelectorAll(".xp-pop").forEach((node) => node.remove());
  localStorage.removeItem(SAVE_KEY);
  closeModals();
  render();
}

function closeModals() {
  document.querySelectorAll(".modal").forEach((modal) => { modal.hidden = true; });
}

function openCards() {
  S.cards.forEach((id) => {
    if (!S.seen.includes(id)) S.seen.push(id);
  });
  save();
  renderChrome();
  const list = document.getElementById("cards-list");
  list.replaceChildren();
  ["c1", "c2", "c3"].forEach((id) => {
    const art = el("article", "kcard");
    if (!S.cards.includes(id)) {
      art.classList.add("locked");
      art.append(el("h3", "", "？？？"), el("p", "", "尚未獲得"));
    } else {
      const card = CARDS[id];
      art.append(el("h3", "", card.icon + " " + card.title), el("p", "", card.body));
    }
    list.appendChild(art);
  });
  document.getElementById("cards-lead").textContent = "已收集 " + S.cards.length + " / 3";
  closeModals();
  document.getElementById("modal-cards").hidden = false;
}

function openMenu() {
  document.getElementById("menu-lead").textContent = S.started
    ? "第 1-1 關　⭐ XP " + S.xp
    : "第 1-1 關　還沒開始";
  document.getElementById("modal-menu").hidden = false;
}

function anyModalOpen() {
  return Array.from(document.querySelectorAll(".modal")).some((modal) => !modal.hidden);
}

function onPanelClick(event) {
  const choice = event.target.closest("[data-choice]");
  if (choice) {
    onChoice(Number(choice.dataset.choice), choice);
    return;
  }
  const item = event.target.closest("[data-item]");
  if (item) {
    onPickItem(item.dataset.item);
    return;
  }
  const bin = event.target.closest("[data-bin]");
  if (bin) {
    onBin(bin.dataset.bin);
    return;
  }
  if (event.target.closest("[data-start]")) {
    startGame();
    return;
  }
  if (event.target.closest("[data-replay]")) {
    resetGame();
    return;
  }
  if (event.target.closest("[data-open-cards]")) {
    openCards();
    return;
  }
  if (event.target.closest("[data-advance]")) {
    advance(true);
    return;
  }
  if (event.target.closest("#dialogue")) onSkip();
}

function bind() {
  document.getElementById("phone").addEventListener("pointerdown", function (event) {
    AdultAudio.unlock();
    if (event.target.closest("#menu-sound")) return;
    AdultAudio.sync(viewName());
  }, true);
  document.getElementById("panel").addEventListener("click", onPanelClick);
  document.getElementById("menu-sound").addEventListener("click", function () {
    AdultAudio.toggle();
  });
  AdultAudio.paint();
  document.getElementById("btn-skip").addEventListener("click", onSkip);
  document.getElementById("btn-auto").addEventListener("click", () => {
    S.auto = !S.auto;
    save();
    renderChrome();
    if (S.auto) queueAuto();
    else clearTimeout(autoTimer);
  });
  document.getElementById("btn-cards").addEventListener("click", openCards);
  document.getElementById("btn-menu").addEventListener("click", openMenu);
  document.getElementById("menu-resume").addEventListener("click", closeModals);
  document.getElementById("menu-cards").addEventListener("click", openCards);
  document.getElementById("menu-restart").addEventListener("click", () => {
    document.getElementById("modal-menu").hidden = true;
    document.getElementById("modal-confirm").hidden = false;
  });
  document.getElementById("confirm-yes").addEventListener("click", resetGame);
  document.getElementById("confirm-no").addEventListener("click", () => {
    document.getElementById("modal-confirm").hidden = true;
  });
  document.getElementById("cards-close").addEventListener("click", closeModals);
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target !== modal) return;
      if (modal.id === "modal-confirm") return;
      modal.hidden = true;
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModals();
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("button")) return;
    if (anyModalOpen()) return;
    event.preventDefault();
    onSkip();
  });
}

bind();
render();
