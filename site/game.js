"use strict";

let SAVE_KEY = "adult-life-1-1";
let levelId = null;

const CAST = {
  puppy: { name: "小白（我）", alt: "小白", src: "assets/puppy.webp", pill: "pill-me", w: 432, h: 720, scale: 1 },
  fox: { name: "狐狸房仲 阿狐", alt: "狐狸房仲 阿狐", src: "assets/fox.webp", pill: "pill-fox", w: 447, h: 720, scale: 1 },
  owl: { name: "貓頭鷹老師", alt: "貓頭鷹老師", src: "assets/owl.webp", pill: "pill-owl", w: 554, h: 720, scale: 0.73 },
  raccoon: { name: "浣熊阿姨", alt: "浣熊阿姨", src: "assets/raccoon.webp", pill: "pill-raccoon", w: 515, h: 720, scale: 1 },
  system: { name: "養成所", alt: "", pill: "pill-sys" }
};

const EXPR_SRC = {
  puppy: {
    neutral: "assets/puppy.webp",
    happy: "assets/expr/puppy_happy.webp",
    surprised: "assets/expr/puppy_surprised.webp",
    worried: "assets/expr/puppy_worried.webp",
    thinking: "assets/expr/puppy_thinking.webp"
  },
  fox: {
    neutral: "assets/fox.webp",
    smug: "assets/expr/fox_smug.webp",
    guilty: "assets/expr/fox_guilty.webp",
    panic: "assets/expr/fox_panic.webp"
  },
  owl: {
    neutral: "assets/owl.webp",
    smile: "assets/expr/owl_smile.webp",
    serious: "assets/expr/owl_serious.webp",
    praise: "assets/expr/owl_praise.webp"
  },
  raccoon: { neutral: "assets/raccoon.webp" }
};

function preloadExpressions() {
  Object.keys(EXPR_SRC).forEach((who) => {
    Object.keys(EXPR_SRC[who]).forEach((name) => {
      const img = new Image();
      img.src = EXPR_SRC[who][name];
    });
  });
}

function expressionName(who, node) {
  if (!S.started) return who === "puppy" ? "happy" : "neutral";
  if (S.phase === "hint") {
    if (who === "puppy") return "worried";
    if (who === "owl") return "serious";
  }
  if (S.phase === "reveal") {
    if (who === "puppy") return node && node.type === "sort" ? "thinking" : "worried";
    if (who === "owl") return "serious";
    if (who === "fox") return "panic";
  }
  const chosen = node && node.expr && node.expr[who];
  return chosen || "neutral";
}

function expressionSrc(who, name) {
  const book = EXPR_SRC[who] || {};
  return book[name] || book.neutral;
}

let CARDS = {
  c1: {
    icon: "📏",
    title: "權狀坪數三兄弟",
    body: "**主建物**（門內真正住的空間）、**附屬建物**（主要是陽台）、**公設**（大廳、走廊、電梯、樓梯間、機房等全棟共用，按比例分攤）。"
  },
  c2: {
    icon: "🔍",
    title: "比大小看主建物",
    body: "==總坪數大不代表住得大==；先看**主建物**坪數，再算**公設比**。"
  },
  c3: {
    icon: "⚠️",
    title: "坪數陷阱",
    body: "**雨遮**看建照年份（==107/1/1== 後不登記）；**車位**要分開算單價；買賣前查實價登錄。"
  }
};

let ITEMS = [
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

let BINS = [
  { id: "main", label: "🏠 主建物", sub: "門內真正住的空間" },
  { id: "annex", label: "🌿 附屬建物", sub: "自家的，但在門外" },
  { id: "public", label: "🏢 公設", sub: "全棟住戶一起用" }
];

let SCRIPT = [
  { id: "s1-hello", scene: 0, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    expr: { fox: "smug", puppy: "surprised" },
    text: "歡迎歡迎～這間『==30 坪==、三房兩廳』，超大的喔！" },
  { id: "s1-think", scene: 0, type: "say", speaker: "puppy", cast: ["puppy"],
    expr: { puppy: "thinking" },
    text: "咦…一進門怎麼覺得沒那麼大？" },
  { id: "s1-ask", scene: 0, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "q1",
    expr: { owl: "smile", puppy: "thinking" },
    text: "!!先別急著簽名!!。你覺得該先問阿狐什麼？",
    choices: [
      { icon: "📏", text: "這 30 坪是**權狀坪數**嗎？裡面**公設**佔多少？", correct: true },
      { icon: "💰", text: "可以算便宜一點嗎？", hint: "價錢之後再談，先搞清楚你買的『==30 坪==』裡面有什麼。你想先問哪一件？" },
      { icon: "🍜", text: "附近有什麼好吃的？", hint: "生活機能也重要，但現在的疑問是『怎麼沒那麼大』。要不要改問**坪數**？" }
    ],
    skip: { card: "c1", resume: "s2-sort", text: "正解：先問**權狀坪數**和**公設**。==30 坪==通常含公設，公設也要付錢。這題跳過，不加經驗值。" } },
  { id: "s1-legend", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "thinking" },
    text: "問得好。先看顏色：**橘色是名詞**、==藍色是重點數字==、!!紅色是陷阱!!。" },
  { id: "s1-ok1", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "praise", puppy: "happy" },
    text: "先搞清楚**坪數**，才不會被『超大』兩個字帶走。" },
  { id: "s1-ok2", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "surprised" },
    text: "==1 坪 ≈ 3.3058 m²==（約 3.3 平方公尺），大約兩張單人床併起來。" },
  { id: "s1-ok3", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "thinking" },
    text: "廣告的坪數通常是『**權狀坪數**』，等於**主建物** + **附屬建物** + **公設**（共有部分）。" },
  { id: "s1-ok4", scene: 0, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "serious", puppy: "worried" },
    text: "房價常用『==權狀坪數 × 每坪單價==』來算，所以**公設**也要付錢。" },
  { id: "s1-card", scene: 0, type: "card", card: "c1", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "praise", puppy: "happy" },
    text: "第一張知識卡幫你記住：權狀上的坪數，有三兄弟。" },

  { id: "s2-sort", scene: 1, type: "sort", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "thinking" },
    text: "把這些空間放進**主建物**、**附屬建物**或**公設**。",
    skip: { resume: "s3-q", text: "正解：客廳、臥室、廚房、浴室是**主建物**；陽台是**附屬建物**；電梯、大廳、樓梯、機房是**公設**。==真正住得到的只有主建物==。" } },
  { id: "s2-wrap", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "serious", puppy: "thinking" },
    text: "==真正住得到的只有主建物==。**公設**越多，同樣坪數的室內就越小。" },

  { id: "s3-q", scene: 2, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "q3", extra: "houses",
    expr: { owl: "smile", puppy: "thinking" },
    text: "兩間總價一樣，哪一間**室內**比較大？",
    choices: [
      { icon: "🏠", text: "A 屋，因為 ==30 坪==比較多", hint: "==30 坪==裡有 10 坪是**公設**，室內**主建物**只有多少？再比一次。" },
      { icon: "🏡", text: "B 屋，因為**主建物** ==20 坪==比 ==18 坪==大", correct: true },
      { icon: "🤝", text: "一樣大", hint: "兩間不一樣大喔。比較看看兩間的『**主建物**』。" }
    ],
    skip: { card: "c2", resume: "s4-intro", text: "正解：比**室內**要看**主建物**。B 屋 ==20 坪==，比 A 屋 ==18 坪==大。這題跳過，不加經驗值。" } },
  { id: "s3-ok1", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "praise", puppy: "happy" },
    text: "對，比室內大小要看**主建物**。B 屋主建物 ==20 坪==，比 A 屋的 ==18 坪==大。" },
  { id: "s3-ok2", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "surprised" },
    text: "A 屋公設比是 ==10 ÷ 30 ≈ 33%==，B 屋是 ==5 ÷ 26 ≈ 19%==。算法是：==公設 ÷ 權狀總坪數==。" },
  { id: "s3-card", scene: 2, type: "card", card: "c2", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "praise", puppy: "happy" },
    text: "總坪數大，不代表住得大。這張卡幫你記得怎麼比。" },

  { id: "s4-intro", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "serious", puppy: "worried" },
    text: "阿狐還會繼續說。有些是事實，有些是!!陷阱!!。先一句一句聽，再點出可疑的那句。" },
  { id: "s4-a1", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    expr: { fox: "smug", puppy: "worried" },
    text: "這間有登記**雨遮**，雨遮坪數一樣照單價算喔～" },
  { id: "s4-a2", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    expr: { fox: "guilty", puppy: "thinking" },
    text: "**陽台**是**附屬建物**，有登記在權狀上。" },
  { id: "s4-a3", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    expr: { fox: "guilty", puppy: "thinking" },
    text: "**公設**包含大廳和電梯。" },
  { id: "s4-q1", scene: 3, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "trap1",
    expr: { owl: "serious", puppy: "thinking" },
    text: "哪一句要!!特別小心!!？",
    choices: [
      { icon: "💬", text: "這間有登記**雨遮**，雨遮坪數一樣照單價算喔～", correct: true },
      { icon: "💬", text: "**陽台**是**附屬建物**，有登記在權狀上。", hint: "這句是對的。**陽台**是**附屬建物**，有登記的話會寫在權狀上。再找找哪一句在!!算錢!!。" },
      { icon: "💬", text: "**公設**包含大廳和電梯。", hint: "這句是對的。大廳和電梯都算**公設**。再聽一次，哪一句要把**雨遮**!!算進價錢!!？" }
    ],
    skip: { resume: "s4-intro2", text: "正解：!!雨遮照單價算!!是陷阱。==107 年 1 月 1 日==後不能再登記。這題跳過，不加經驗值。" } },
  { id: "s4-ex1", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "praise", puppy: "happy" },
    text: "抓到了。**雨遮**能不能登記、能不能算錢，要看**建造執照**的年份。" },
  { id: "s4-ex2", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "serious", puppy: "surprised" },
    text: "==107 年（2018 年）1 月 1 日==以後申請建造執照的新建物，屋簷、**雨遮**!!不能再登記!!。更早申請建照的房子，權狀上可能還有雨遮。" },
  { id: "s4-ex3", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "serious", puppy: "worried" },
    text: "而從 ==100 年（2011 年）5 月==起，預售屋的**雨遮**就規定!!不能計價!!。看到雨遮要算錢，一定要問清楚、看權狀。" },
  { id: "s4-intro2", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "serious", puppy: "worried" },
    text: "還有一個!!陷阱!!。再聽三句。" },
  { id: "s4-b1", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    expr: { fox: "smug", puppy: "surprised" },
    text: "每坪 ==60 萬==，總共 ==40 坪==，含**車位**喔！" },
  { id: "s4-b2", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    expr: { fox: "guilty", puppy: "thinking" },
    text: "**主建物**有 ==22 坪==。" },
  { id: "s4-b3", scene: 3, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    expr: { fox: "panic", puppy: "surprised" },
    text: "這棟是 ==2020 年==蓋好的。" },
  { id: "s4-q2", scene: 3, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "trap2",
    expr: { owl: "serious", puppy: "thinking" },
    text: "哪一句可疑？",
    choices: [
      { icon: "💬", text: "每坪 60 萬，總共 40 坪，含**車位**喔！", correct: true },
      { icon: "💬", text: "**主建物**有 22 坪。", hint: "**主建物**有幾坪，可以先記下來。可疑的是總價怎麼把**車位**算進去。" },
      { icon: "💬", text: "這棟是 2020 年蓋好的。", hint: "年份本身可以是事實。想想『含**車位**』會不會把每坪單價算糊塗？" }
    ],
    skip: { card: "c3", resume: "s5-1", text: "正解：!!含車位!!會把單價算糊。房屋和車位要!!分開報價!!，再查==實價登錄==。這題跳過，不加經驗值。" } },
  { id: "s4-ex4", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "praise", puppy: "happy" },
    text: "對。**車位**的坪數有時會跟房子!!算在一起!!。" },
  { id: "s4-ex5", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "serious", puppy: "thinking" },
    text: "要請房仲把『房屋』和『**車位**』!!分開報價!!，算出房屋每坪真正多少錢。也可以上內政部『==實價登錄==』，查附近的成交價來比較。" },
  { id: "s4-card", scene: 3, type: "card", card: "c3", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "praise", puppy: "happy" },
    text: "最後一張卡，把**雨遮**和**車位**兩個!!陷阱!!收好。" },

  { id: "s5-1", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "thinking" },
    text: "今天記住三件事。第一，**權狀坪數**是主建物、附屬建物和**公設**加起來，==公設也算在價錢裡==。" },
  { id: "s5-2", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "thinking" },
    text: "第二，室內大不大要看**主建物**，再用**公設比**看共用空間佔多少。" },
  { id: "s5-3", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "serious", puppy: "worried" },
    text: "第三，**雨遮**要看建照年份，**車位**要分開算單價，買賣前查==實價登錄==。" },
  { id: "s5-tease-owl", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "thinking" },
    text: "下一關，我們來算**每坪到底多少錢**。權狀單價、室內單價，還有車位，分開看。" },
  { id: "s5-tease-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
    expr: { fox: "smug", puppy: "surprised" },
    text: "每坪 ==60 萬==？我這張表算得很漂亮喔！" },
  { id: "s5-end", scene: 4, type: "end", speaker: "owl", cast: ["puppy", "owl"],
    expr: { owl: "smile", puppy: "happy" } }
];

let MAX_XP = SCRIPT.filter((node) => node.type === "choice").length * 20;
const TITLE_LINE = "這間廣告寫著『30 坪、三房兩廳』。進門之前，我想先搞懂：坪數到底是什麼。";

const LEVELS = {
  "1-1": {
    id: "1-1",
    saveKey: "adult-life-1-1",
    shortTitle: "1-1 「30 坪」",
    sub: "到底有多大？",
    endKicker: "第 1-1 關完成",
    endTitle: "「30 坪」到底有多大？",
    soon: "下一關：1-2 每坪到底多少錢？",
    next: "1-2",
    nextLabel: "前往 1-2 每坪到底多少錢？",
    sortDone: "全部放對了。真正住得到的只有主建物。",
    cards: CARDS,
    items: ITEMS,
    bins: BINS,
    script: SCRIPT
  },
  "1-2": LEVEL_12
};

const CHAPTERS = [
  {
    title: "第1章 房地產基本觀念",
    levels: [
      { id: "1-1", motif: "pitch" },
      { id: "1-2", motif: "price" },
      { id: "1-3", locked: true, motif: "lock", title: "1-3 房屋類型與屋齡", note: "即將推出" }
    ]
  }
];

let S = fresh();
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
let lastPoseKey = "";

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
    hint: "",
    skipped: {}
  };
}

function load() {
  const blank = fresh();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return blank;
    const data = JSON.parse(raw);
    if ((data.v || 1) !== saveVersion()) return blank;
    blank.started = !!data.started;
    blank.step = Number.isInteger(data.step) ? data.step : 0;
    blank.xp = Number.isFinite(data.xp) ? Math.max(0, data.xp) : 0;
    blank.cards = Array.isArray(data.cards) ? data.cards.filter((id) => CARDS[id]) : [];
    blank.seen = Array.isArray(data.seen) ? data.seen.filter((id) => CARDS[id]) : [];
    blank.missed = data.missed && typeof data.missed === "object" ? data.missed : {};
    blank.awarded = data.awarded && typeof data.awarded === "object" ? data.awarded : {};
    blank.placed = Array.isArray(data.placed) ? data.placed.filter((id) => ITEMS.some((item) => item.id === id)) : [];
    blank.auto = !!data.auto;
    blank.skipped = data.skipped && typeof data.skipped === "object" ? data.skipped : {};
    if (data.phase === "reveal") blank.phase = "reveal";
    else if (data.phase === "hint" && typeof data.hint === "string" && data.hint) blank.phase = "hint";
    else blank.phase = "line";
    blank.hint = blank.phase === "hint" ? data.hint : "";
    if (blank.step < 0 || blank.step >= SCRIPT.length) blank.step = 0;
    if (blank.phase === "reveal") {
      const node = SCRIPT[blank.step];
      if (!node || (node.type !== "choice" && node.type !== "sort") || !node.skip) blank.phase = "line";
    }
    return blank;
  } catch (err) {
    return fresh();
  }
}

function saveVersion() {
  if (!levelId || !LEVELS[levelId]) return 1;
  return LEVELS[levelId].saveVersion || 1;
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    v: saveVersion(),
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
    hint: S.hint,
    skipped: S.skipped
  }));
}

function current() {
  return SCRIPT[S.step];
}

function viewName() {
  if (!levelId) return "select";
  if (!S.started) return "title";
  if (S.phase === "hint") return "hint";
  if (S.phase === "reveal") return "reveal";
  return current().type;
}

function speechText() {
  if (!levelId) return "點下面的關卡，就會從上次的進度接著玩。";
  if (!S.started) return TITLE_LINE;
  if (S.phase === "reveal") return (current().skip && current().skip.text) || "";
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

function skippedCount() {
  return Object.keys(S.skipped).filter((id) => S.skipped[id]).length;
}

function starBlurb(count) {
  let line;
  if (count >= 3) line = "問問題、拆坪數、抓陷阱，一次就看穿。小白可以放心再往下看房子了。";
  else if (count === 2) line = "大觀念都抓到了。再玩一次，把猶豫的地方問到清楚。";
  else line = "沒關係，知識卡都收好了。再走一次，坪數會更清楚。";
  if (skippedCount()) line += "跳過的題沒有算進星星。";
  return line;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function parseRich(raw) {
  const parts = [];
  const text = raw || "";
  const pattern = /\*\*((?:(?!\*\*).)+)\*\*|==((?:(?!==).)+)==|!!((?:(?!!!)[^])+)!!/g;
  let last = 0;
  let match = pattern.exec(text);
  while (match) {
    if (match.index > last) parts.push({ kind: "", text: text.slice(last, match.index) });
    if (match[1] != null) parts.push({ kind: "term", text: match[1] });
    else if (match[2] != null) parts.push({ kind: "fact", text: match[2] });
    else parts.push({ kind: "warn", text: match[3] });
    last = match.index + match[0].length;
    match = pattern.exec(text);
  }
  if (last < text.length) parts.push({ kind: "", text: text.slice(last) });
  return parts;
}

function plainLength(parts) {
  return parts.reduce((sum, part) => sum + Array.from(part.text).length, 0);
}

function fillRich(node, raw, count) {
  const parts = parseRich(raw);
  let left = count == null ? plainLength(parts) : count;
  node.replaceChildren();
  parts.forEach((part) => {
    if (left <= 0) return;
    const chars = Array.from(part.text);
    const take = chars.slice(0, left).join("");
    left -= Math.min(left, chars.length);
    if (!take) return;
    if (!part.kind) node.append(document.createTextNode(take));
    else node.append(el("span", "mark mark-" + part.kind, take));
  });
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

function cardTotal() {
  return Math.max(Object.keys(CARDS).length, 1);
}

function sceneTotal() {
  if (!levelId) return 1;
  return SCRIPT.reduce((max, node) => Math.max(max, node.scene), 0) + 1;
}

function renderChrome() {
  const meta = levelId ? LEVELS[levelId] : null;
  document.getElementById("ch-title").textContent = meta ? meta.shortTitle : "目錄";
  document.getElementById("ch-sub").textContent = meta ? meta.sub : "第1章";
  document.getElementById("xp-num").textContent = String(levelId ? S.xp : 0);
  document.getElementById("card-count").textContent = (levelId ? S.cards.length : 0) + "/" + (levelId ? cardTotal() : 3);
  document.getElementById("card-badge").hidden = !levelId || !S.cards.some((id) => !S.seen.includes(id));
  const auto = document.getElementById("btn-auto");
  auto.classList.toggle("on", S.auto);
  auto.setAttribute("aria-pressed", S.auto ? "true" : "false");
  const scene = levelId && S.started ? current().scene : 0;
  const finished = levelId && S.started && current().type === "end";
  const dots = document.getElementById("dots");
  dots.replaceChildren();
  if (!levelId) {
    document.getElementById("hud").dataset.view = viewName();
    return;
  }
  for (let i = 0; i < sceneTotal(); i += 1) {
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
  let node = null;
  let allBright = false;
  if (!S.started) {
    cast = ["puppy"];
    speaker = "puppy";
  } else {
    node = current();
    cast = node.cast;
    speaker = S.phase === "hint" || S.phase === "reveal" ? "owl" : node.speaker;
    allBright = !!node.allBright && S.phase !== "hint" && S.phase !== "reveal";
  }
  const poseKey = S.started ? S.step + "|" + S.phase : "title";
  const freshLine = poseKey !== lastPoseKey;
  lastPoseKey = poseKey;
  const inner = el("div", "stage-inner " + (cast.length === 1 ? "solo" : "duo"));
  cast.forEach((who) => {
    const meta = CAST[who];
    const expr = expressionName(who, node);
    const speaking = allBright || cast.length === 1 || who === speaker;
    const fig = el("div", "char" + (speaking ? " speaker" : " dim"));
    fig.dataset.who = who;
    fig.dataset.expr = expr;
    if (freshLine && speaking) fig.classList.add("just-spoke");
    if (freshLine && (expr === "surprised" || expr === "panic")) fig.classList.add("emote-hot");
    const widthBoost = who === "fox" ? 1.08 : 1;
    fig.style.setProperty("--grow", String((meta.w / meta.h) * meta.scale * widthBoost));
    fig.style.setProperty("--scale", String(meta.scale));
    const img = document.createElement("img");
    img.src = expressionSrc(who, expr);
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

function makeChoices(node, revealed) {
  const wrap = el("div", "choices");
  wrap.dataset.testid = "choices";
  node.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.dataset.choice = String(index);
    const icon = el("span", "choice-icon", choice.icon);
    icon.setAttribute("aria-hidden", "true");
    const label = el("span", "choice-text");
    fillRich(label, choice.text);
    btn.append(icon, label);
    if (revealed) {
      btn.disabled = true;
      if (choice.correct) {
        btn.classList.add("is-correct");
        btn.append(el("span", "choice-badge", "正解"));
      }
    }
    wrap.appendChild(btn);
  });
  return wrap;
}

function makeHouses() {
  const wrap = el("div", "houses");
  wrap.dataset.testid = "houses";
  const houses = (current() && current().houses) || [
    { name: "A 屋", deed: "**權狀** ==30 坪==", rows: ["**主建物** ==18==", "**陽台** ==2==", "**公設** ==10=="], tone: "a" },
    { name: "B 屋", deed: "**權狀** ==26 坪==", rows: ["**主建物** ==20==", "**陽台** ==1==", "**公設** ==5=="], tone: "b" }
  ];
  houses.forEach((house) => {
    const card = el("article", "house house-" + house.tone);
    const deed = el("p", "deed");
    fillRich(deed, house.deed);
    card.append(el("h3", "", house.name), deed);
    const list = el("ul", "");
    house.rows.forEach((row) => {
      const item = el("li", "");
      fillRich(item, row);
      list.appendChild(item);
    });
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
  const body = el("p", "");
  fillRich(body, card.body);
  art.append(el("div", "kcard-tag", "新的知識卡"), el("h3", "", card.icon + " " + card.title), body);
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
  const meta = LEVELS[levelId];
  const box = el("section", "ending");
  box.dataset.testid = "ending";
  box.append(el("p", "end-kicker", meta.endKicker), el("h2", "", meta.endTitle));
  const stars = el("div", "stars");
  stars.setAttribute("aria-label", count + " 顆星");
  for (let i = 0; i < 3; i += 1) {
    stars.appendChild(el("span", i < count ? "star on" : "star", i < count ? "★" : "☆"));
  }
  box.append(stars, el("p", "end-xp", "XP " + S.xp + " / " + MAX_XP), el("p", "end-note", starBlurb(count)), el("p", "soon", meta.soon));
  const back = goButton("📚 回到目錄", "back-catalog");
  back.classList.remove("choice-mint");
  back.classList.add("choice-catalog");
  back.removeAttribute("data-advance");
  back.dataset.catalog = "1";
  box.append(back);
  if (meta.next) {
    const next = goButton(meta.nextLabel, "next-level");
    next.removeAttribute("data-advance");
    next.dataset.level = meta.next;
    box.append(next);
  }
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
  if (!levelId) {
    panel.replaceChildren(makeCatalog());
    return;
  }
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
  const speaker = view === "hint" || view === "reveal" ? "owl" : node.speaker;
  const dialogue = makeDialogue(speaker);
  const parts = [dialogue];
  if (view === "reveal" && node.type === "choice") {
    if (node.extra === "houses") parts.push(makeHouses());
    parts.push(makeChoices(node, true));
  } else if (view === "reveal" && node.type === "sort") {
    const status = el("p", "sort-status");
    status.id = "sort-status";
    dialogue.appendChild(status);
    parts.push(makeSort());
  } else if (view === "choice") {
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
  if (view === "say" && node.houses) parts.splice(1, 0, makeHouses());
  panel.replaceChildren(...parts);
}

function fillSort() {
  const tray = document.getElementById("chip-tray");
  if (!tray) return;
  tray.replaceChildren();
  const showingAnswer = S.phase === "reveal" && current().type === "sort";
  const placedIds = showingAnswer ? ITEMS.map((item) => item.id) : S.placed;
  ITEMS.forEach((item) => {
    if (placedIds.includes(item.id)) return;
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
    const mine = ITEMS.filter((item) => item.bin === bin.id && placedIds.includes(item.id));
    if (!mine.length) {
      slots.appendChild(el("span", "bin-empty", "點這裡放入"));
      return;
    }
    mine.forEach((item) => slots.appendChild(el("span", "placed", item.label)));
  });
  document.getElementById("bins").classList.toggle("armed", !!selected);
  const status = document.getElementById("sort-status");
  const left = ITEMS.length - placedIds.length;
  if (showingAnswer) {
    fillRich(status, "下面是正解。點一下繼續。");
    status.dataset.tone = "ok";
  } else if (!sortMsg) {
    if (left === 0) {
      fillRich(status, "全部放對了。");
      status.dataset.tone = "ok";
    } else if (left === ITEMS.length) {
      fillRich(status, "先點一個空間，再點下面的格子。");
      status.dataset.tone = "info";
    } else {
      fillRich(status, "還有 " + left + " 個空間。");
      status.dataset.tone = "info";
    }
  } else {
    fillRich(status, sortMsg);
    status.dataset.tone = sortTone || "info";
  }
  const next = document.getElementById("sort-next");
  if (next) next.hidden = showingAnswer || placedIds.length !== ITEMS.length;
}

function levelTitle(level) {
  return [level.shortTitle, level.sub].filter(Boolean).join("");
}

function levelProgress(level) {
  const saved = peekSave(level.saveKey);
  const maxXp = level.script.filter((node) => node.type === "choice").length * 20;
  const cardMax = Object.keys(level.cards || {}).length;
  const started = !!(saved && saved.started);
  const xp = started ? (saved.xp || 0) : 0;
  const cards = started && Array.isArray(saved.cards) ? saved.cards.filter((id) => level.cards[id]).length : 0;
  const node = started ? level.script[saved.step] : null;
  const done = !!(node && node.type === "end");
  const ratio = maxXp ? xp / maxXp : 0;
  let stars = 0;
  if (done) stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
  else if (ratio >= 0.9) stars = 3;
  else if (ratio >= 0.6) stars = 2;
  else if (xp > 0) stars = 1;
  return { xp: xp, maxXp: maxXp, cards: cards, cardMax: cardMax, stars: stars, done: done, started: started };
}

function catalogTotals() {
  const totals = { stars: 0, starMax: 0, xp: 0, cards: 0, cardMax: 0 };
  CHAPTERS.forEach((chapter) => {
    chapter.levels.forEach((entry) => {
      if (entry.locked || !LEVELS[entry.id]) return;
      const progress = levelProgress(LEVELS[entry.id]);
      totals.stars += progress.stars;
      totals.starMax += 3;
      totals.xp += progress.xp;
      totals.cards += progress.cards;
      totals.cardMax += progress.cardMax;
    });
  });
  return totals;
}

function starRow(count, label) {
  const stars = el("span", "wall-stars");
  stars.setAttribute("aria-label", label || count + " 顆星");
  for (let i = 0; i < 3; i += 1) {
    stars.appendChild(el("span", i < count ? "on" : "", i < count ? "★" : "☆"));
  }
  return stars;
}

function makeArt(motif) {
  const art = el("div", "wall-art art-" + motif);
  if (motif === "pitch") {
    art.append(el("div", "plan"), wallImg("assets/expr/fox_smug.webp", ""));
  } else if (motif === "price") {
    art.append(el("span", "coin", "坪"), el("span", "coin coin-b", "萬"), wallImg("assets/expr/owl_smile.webp", ""));
  } else {
    const house = el("div", "sil");
    house.append(el("i", "roof"), el("i", "base"));
    art.append(house, el("span", "lock", "🔒"));
  }
  return art;
}

function wallImg(src, alt) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.draggable = false;
  return img;
}

function makeCatalog() {
  const wrap = el("div", "wall");
  wrap.dataset.testid = "catalog";
  const totals = catalogTotals();

  const head = el("header", "wall-head");
  const brand = el("div", "wall-brand");
  const cap = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  cap.setAttribute("viewBox", "0 0 24 24");
  cap.setAttribute("width", "28");
  cap.setAttribute("height", "28");
  cap.setAttribute("aria-hidden", "true");
  cap.innerHTML = '<path fill="#2174c4" d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3z"/><path fill="#2174c4" d="M6.5 13.1v3.1C6.5 18 9 19.5 12 19.5s5.5-1.5 5.5-3.3v-3.1L12 16.2l-5.5-3.1z"/>';
  const menu = document.createElement("button");
  menu.type = "button";
  menu.className = "wall-menu";
  menu.dataset.openMenu = "1";
  menu.setAttribute("aria-label", "選單");
  menu.append(el("span", ""), el("span", ""), el("span", ""));
  brand.append(cap, el("b", "", "高級大人養成所"), menu);

  const hello = el("div", "wall-hello");
  const avatar = wallImg("assets/expr/puppy_happy.webp", "小白");
  avatar.className = "wall-avatar";
  const greet = el("p", "");
  greet.textContent = "嗨，我是小白。點一張卡，我們就接著上次的進度看房。";
  hello.append(avatar, greet);

  const stats = el("div", "wall-stats");
  stats.append(
    el("span", "wall-stat", "★ " + totals.stars + "/" + totals.starMax),
    el("span", "wall-stat", "XP " + totals.xp),
    el("span", "wall-stat", "知識卡 " + totals.cards + "/" + totals.cardMax)
  );
  head.append(brand, hello, stats);
  wrap.appendChild(head);

  CHAPTERS.forEach((chapter) => {
    const section = el("section", "wall-chapter");
    section.appendChild(el("h2", "", chapter.title));
    const playable = chapter.levels.filter((entry) => !entry.locked && LEVELS[entry.id]);
    let doneCount = 0;
    let fill = 0;
    playable.forEach((entry) => {
      const progress = levelProgress(LEVELS[entry.id]);
      if (progress.done) {
        doneCount += 1;
        fill += 1;
      } else if (progress.maxXp) {
        fill += Math.min(0.99, progress.xp / progress.maxXp);
      }
    });
    const ratio = playable.length ? fill / playable.length : 0;
    const track = el("div", "wall-chbar");
    track.setAttribute("aria-hidden", "true");
    const bar = el("i", "");
    bar.style.width = Math.round(ratio * 100) + "%";
    track.appendChild(bar);
    section.append(track, el("p", "wall-chmeta", doneCount + "/" + playable.length + " 關完成"));
    const list = el("div", "wall-list");
    chapter.levels.forEach((entry) => list.appendChild(makeLevelCard(entry)));
    section.appendChild(list);
    wrap.appendChild(section);
  });
  return wrap;
}

function makeLevelCard(entry) {
  const card = el("article", "wall-card");
  const motif = entry.motif || (entry.locked ? "lock" : "pitch");
  const art = makeArt(motif);
  const badge = el("span", "wall-num", entry.locked ? entry.title.split(" ")[0] : entry.id);
  art.appendChild(badge);
  const body = el("div", "wall-body");
  if (entry.locked) {
    card.classList.add("is-locked");
    const title = el("h3", "wall-title", entry.title);
    const state = el("p", "wall-state", "🔒 即將推出");
    const track = el("div", "xpbar");
    track.appendChild(el("i", ""));
    body.append(title, starRow(0, "尚未開放"), el("p", "wall-xp", "XP —"), track, el("p", "wall-cards", "知識卡 —"), state);
    card.append(art, body);
    return card;
  }
  const level = LEVELS[entry.id];
  const progress = levelProgress(level);
  const title = el("h3", "wall-title", levelTitle(level));
  const xpLine = el("p", "wall-xp", "XP " + progress.xp + " / " + progress.maxXp);
  const track = el("div", "xpbar");
  const fill = el("i", "");
  fill.style.width = (progress.maxXp ? Math.round(progress.xp / progress.maxXp * 100) : 0) + "%";
  track.appendChild(fill);
  const cards = el("p", "wall-cards", "知識卡 " + progress.cards + "/" + progress.cardMax);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "wall-go";
  if (progress.done) {
    art.appendChild(el("span", "wall-stamp", "完成"));
    body.append(title, starRow(progress.stars), el("p", "wall-state is-done", "完成"), xpLine, track, cards);
    btn.classList.add("go-replay");
    btn.dataset.replayLevel = entry.id;
    btn.textContent = "再玩一次";
  } else if (progress.started) {
    body.append(title, starRow(progress.stars), el("p", "wall-state is-now", "進行中"), xpLine, track, cards);
    btn.classList.add("go-resume");
    btn.dataset.level = entry.id;
    btn.textContent = "繼續";
  } else {
    body.append(title, starRow(0), xpLine, track, cards);
    btn.classList.add("go-start");
    btn.dataset.level = entry.id;
    btn.textContent = "開始";
  }
  body.appendChild(btn);
  card.append(art, body);
  return card;
}

function replayLevel(id) {
  const level = LEVELS[id];
  if (!level) return;
  localStorage.removeItem(level.saveKey);
  enterLevel(id);
}

function peekSave(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "null");
    if (!data) return null;
    const level = Object.keys(LEVELS).map((id) => LEVELS[id]).find((item) => item.saveKey === key);
    const need = level && level.saveVersion ? level.saveVersion : 1;
    if ((data.v || 1) !== need) return null;
    return data;
  } catch (err) {
    return null;
  }
}

function enterLevel(id) {
  const level = LEVELS[id];
  if (!level) return;
  if (levelId && S.started) save();
  levelId = id;
  SAVE_KEY = level.saveKey;
  CARDS = level.cards;
  ITEMS = level.items;
  BINS = level.bins;
  SCRIPT = level.script;
  MAX_XP = SCRIPT.filter((node) => node.type === "choice").length * 20;
  const saved = load();
  selected = null;
  sortMsg = "";
  sortTone = "info";
  endingCue = false;
  lastPoseKey = "";
  if (saved.started) S = saved;
  else {
    S = fresh();
    S.started = true;
  }
  AdultAudio.unlock();
  save();
  closeModals();
  render();
}

function showSelect() {
  if (levelId && S.started) save();
  levelId = null;
  S = fresh();
  selected = null;
  sortMsg = "";
  sortTone = "info";
  endingCue = false;
  lastPoseKey = "";
  closeModals();
  render();
}

function wrongHint(item) {
  if (item.hint) return item.hint;
  if (item.id === "balcony") return "它是你家的，但==在門外、不算室內==喔。";
  if (item.bin === "public") return "整棟住戶都會用到的空間屬於哪一格？";
  return "這是門內真正住的空間，要放進**主建物**喔。";
}

function finishLine(token) {
  if (token != null && token !== gen) return;
  const textNode = document.getElementById("dialogue-text");
  if (textNode) fillRich(textNode, speechText());
  lineReady = true;
  document.getElementById("phone").dataset.ready = "1";
  const hint = document.getElementById("tap-hint");
  const view = viewName();
  if (hint) hint.textContent = view === "say" || view === "hint" || view === "reveal" ? "▼ 點一下繼續" : "";
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
  const raw = speechText();
  const total = plainLength(parseRich(raw));
  fillRich(textNode, "", 0);
  if (hint) hint.textContent = "";
  let index = 0;
  const tick = () => {
    if (token !== gen) return;
    index += 1;
    fillRich(textNode, raw, index);
    if (index < total) typeTimer = setTimeout(tick, 16);
    else finishLine(token);
  };
  if (!total) finishLine(token);
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
  const nodeNow = S.started ? current() : null;
  phone.dataset.view = view;
  phone.dataset.node = nodeNow ? nodeNow.id : "title";
  phone.dataset.crowded = nodeNow && (nodeNow.houses || nodeNow.type === "choice" || nodeNow.type === "sort") ? "1" : "0";
  renderChrome();
  if (view === "select") document.getElementById("stage").replaceChildren();
  else renderCast();
  buildPanel();
  if (view === "sort" || (view === "reveal" && current().type === "sort")) fillSort();
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

function showReveal() {
  const node = current();
  if (!node || !node.skip) return;
  S.phase = "reveal";
  S.hint = "";
  if (node.qid) {
    S.skipped[node.qid] = true;
    S.awarded[node.qid] = true;
  }
  if (node.skip.card && !S.cards.includes(node.skip.card)) S.cards.push(node.skip.card);
  AdultAudio.sfx("tap");
  save();
  render();
}

function confirmReveal() {
  const node = current();
  const resume = node && node.skip ? SCRIPT.findIndex((item) => item.id === node.skip.resume) : -1;
  S.phase = "line";
  S.hint = "";
  if (resume >= 0) S.step = resume;
  AdultAudio.sfx("tap");
  save();
  render();
}

function onSkip() {
  const view = viewName();
  if (view === "reveal") {
    if (!lineReady) {
      AdultAudio.sfx("tap");
      gen += 1;
      clearTimeout(typeTimer);
      finishLine(gen);
      return;
    }
    confirmReveal();
    return;
  }
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

function isGate(node) {
  return !!node && (node.type === "choice" || node.type === "sort" || node.type === "card" || node.type === "end");
}

function skipSequence() {
  if (!S.started) return;
  clearTimeout(autoTimer);
  clearTimeout(typeTimer);
  if (S.phase === "reveal") {
    confirmReveal();
    return;
  }
  const node = current();
  if (S.phase === "hint" || (node && (node.type === "choice" || node.type === "sort"))) {
    showReveal();
    return;
  }
  if (isGate(node)) {
    if (!lineReady) {
      gen += 1;
      finishLine(gen);
    }
    return;
  }
  const fromScene = node.scene;
  let target = S.step;
  for (let i = S.step + 1; i < SCRIPT.length; i += 1) {
    const next = SCRIPT[i];
    if (isGate(next) || next.scene !== fromScene) {
      target = i;
      break;
    }
  }
  if (target === S.step) return;
  AdultAudio.sfx("tap");
  S.step = target;
  S.phase = "line";
  S.hint = "";
  save();
  render();
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
  if (!node || node.type !== "choice" || S.phase === "hint" || S.phase === "reveal") return;
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
  if (S.phase === "reveal" || S.placed.includes(id)) return;
  selected = selected === id ? null : id;
  if (selected) AdultAudio.sfx("tap");
  sortMsg = selected ? "再點它該去的格子。" : "";
  sortTone = "info";
  fillSort();
}

function onBin(binId) {
  if (S.phase === "reveal") return;
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
  sortMsg = left === 0 ? (LEVELS[levelId].sortDone || "全部放對了。") : "放對了。";
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
  if (!levelId) return;
  S = fresh();
  S.started = true;
  selected = null;
  sortMsg = "";
  sortTone = "info";
  endingCue = false;
  lastPoseKey = "";
  document.querySelectorAll(".xp-pop").forEach((node) => node.remove());
  localStorage.removeItem(SAVE_KEY);
  closeModals();
  save();
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
  Object.keys(CARDS).forEach((id) => {
    const art = el("article", "kcard");
    if (!S.cards.includes(id)) {
      art.classList.add("locked");
      art.append(el("h3", "", "？？？"), el("p", "", "尚未獲得"));
    } else {
      const card = CARDS[id];
      const body = el("p", "");
      fillRich(body, card.body);
      art.append(el("h3", "", card.icon + " " + card.title), body);
    }
    list.appendChild(art);
  });
  document.getElementById("cards-lead").textContent = "已收集 " + S.cards.length + " / " + cardTotal();
  closeModals();
  document.getElementById("modal-cards").hidden = false;
}

function openMenu() {
  const meta = levelId ? LEVELS[levelId] : null;
  document.getElementById("menu-lead").textContent = meta
    ? meta.shortTitle + "　⭐ XP " + S.xp
    : "目錄";
  document.getElementById("modal-menu").hidden = false;
}

function anyModalOpen() {
  return Array.from(document.querySelectorAll(".modal")).some((modal) => !modal.hidden);
}

function onPanelClick(event) {
  if (event.target.closest("[data-open-menu]")) {
    openMenu();
    return;
  }
  const replayBtn = event.target.closest("[data-replay-level]");
  if (replayBtn) {
    replayLevel(replayBtn.dataset.replayLevel);
    return;
  }
  const levelBtn = event.target.closest("[data-level]");
  if (levelBtn) {
    enterLevel(levelBtn.dataset.level);
    return;
  }
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
  if (event.target.closest("[data-catalog]")) {
    showSelect();
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
  document.getElementById("btn-skip").addEventListener("click", skipSequence);
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
  document.getElementById("menu-levels").addEventListener("click", showSelect);
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

preloadExpressions();
bind();
render();
