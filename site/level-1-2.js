/* Lesson 1-2. Loaded before game.js. */
var LEVEL_12 = {
  id: "1-2",
  saveKey: "adult-life-1-2",
  shortTitle: "1-2 公設比",
  sub: "與實際坪數",
  endKicker: "第 1-2 關完成",
  endTitle: "公設比與實際坪數",
  soon: "1-3 房價怎麼看、實價登錄怎麼查 即將推出",
  next: null,
  sortDone: "全部放對了。健身房也是公設，不是白送的。",
  cards: {
    d1: {
      icon: "🏢",
      title: "公設算進權狀",
      body: "電梯、大廳、樓梯間是**共有部分**。你分攤到的**公設**，已經算在**權狀坪數**裡，不是建商另送的。"
    },
    d2: {
      icon: "🏠",
      title: "看室內坪數",
      body: "==公設比 = 公設坪數 ÷ 權狀坪數==。扣掉公設，才是比較接近實際住的坪數。這關的例子把陽台簡化、先不另拆。常見範圍大約是：公寓 ==0～10%==、華廈 ==20～30%==、電梯大樓 ==30～40%==，還是要看權狀自己算。"
    },
    d3: {
      icon: "💰",
      title: "用室內單價比較",
      body: "室內單價 ≈ ==總價 ÷ 室內坪數==。不要只用「總價差 ÷ 權狀差」來判斷划不划算。"
    }
  },
  items: [
    { id: "living", label: "客廳", bin: "indoor", hint: "這是門內真正住的空間，要放進**室內**喔。" },
    { id: "bed", label: "臥室", bin: "indoor", hint: "這是門內真正住的空間，要放進**室內**喔。" },
    { id: "balcony", label: "陽台", bin: "annex", hint: "它是你家的，但在門外，算**附屬建物**喔。" },
    { id: "elevator", label: "電梯", bin: "public", hint: "整棟住戶都會用到，算**公設**喔。" },
    { id: "lobby", label: "大廳", bin: "public", hint: "整棟住戶都會用到，算**公設**喔。" },
    { id: "stairs", label: "樓梯間", bin: "public", hint: "整棟住戶都會用到，算**公設**喔。" },
    { id: "gym", label: "健身房", bin: "public", hint: "大家一起用的設施算**公設**，坪數和管理費都會算進去喔。" }
  ],
  bins: [
    { id: "indoor", label: "🏠 室內", sub: "主建物，門內住的" },
    { id: "annex", label: "🌿 陽台（附屬）", sub: "自家的，在門外" },
    { id: "public", label: "🏢 公設", sub: "全棟分攤" }
  ],
  script: [
    { id: "o1", scene: 0, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "happy" },
      houses: [
        { name: "A 大樓", deed: "**權狀** ==30 坪==", rows: ["總價 ==1,800 萬=="], tone: "a" },
        { name: "B 公寓", deed: "**權狀** ==24 坪==", rows: ["總價 ==1,500 萬=="], tone: "b" }
      ],
      text: "你看，新大樓 A：權狀 ==30 坪==，總價 ==1,800 萬==。旁邊老公寓 B：權狀 ==24 坪==，只要 ==1,500 萬==。" },
    { id: "o2", scene: 0, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "happy" },
      text: "A 大了 ==6 坪==，一坪才多 ==50 萬==，超划算！" },
    { id: "o3", scene: 0, type: "say", speaker: "puppy", cast: ["puppy"],
      expr: { puppy: "happy" },
      text: "大 6 坪，一坪才多 50 萬…好像真的比較划算。等等，我先別急著心動。" },

    { id: "qShare", scene: 1, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qShare",
      expr: { owl: "smile", puppy: "thinking" },
      text: "大樓的電梯、大廳、樓梯間，是誰的？算不算在這 ==30 坪==裡？",
      choices: [
        { icon: "🎁", text: "建商送的，不算在坪數裡", hint: "如果是送的，權狀上那些公設坪數要不要付錢？先想想這 30 坪裡有沒有別人的空間。" },
        { icon: "🏢", text: "算在每戶的權狀坪數裡，大家分攤", correct: true },
        { icon: "📋", text: "只有管委會的，跟你無關", hint: "管委會是管理這些空間的人。空間本身算不算在你的權狀裡？" }
      ],
      skip: { card: "d1", resume: "def1", text: "正解：電梯、大廳、樓梯間是**共有部分**，分攤進每戶的**權狀坪數**，不是建商另送的。這題跳過，不加經驗值。" } },
    { id: "qShare-ok", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "對。這些是**共有部分**，也就是**公設**。你分攤到的部分，已經算在**權狀坪數**裡。" },
    { id: "qShare-card", scene: 1, type: "card", card: "d1", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "先收一張卡：公設不是禮物，是算在權狀裡的。" },

    { id: "def1", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "**權狀坪數** = **主建物**（室內）+ **附屬建物**（陽台等）+ **共有部分**（**公設**）。" },
    { id: "def2", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "==公設比 = 公設坪數 ÷ 權狀坪數==。公設比越高，同樣權狀裡真正住的就越少。" },
    { id: "def3", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "民國 ==107 年==起，**雨遮**不登記、不計價。車位如果有登記，也可能含在權狀裡，要拆開看。" },

    { id: "sort", scene: 3, type: "sort", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "thinking" },
      text: "來分類。哪些是**室內**、哪些是**陽台**、哪些是**公設**？",
      skip: { resume: "qSize", text: "正解：客廳、臥室是**室內**；陽台是**附屬建物**；電梯、大廳、樓梯間、健身房都是**公設**。" } },
    { id: "sort-wrap", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "健身房、大廳、電梯都是**公設**。它們很豪華，但也算進你要付的坪數裡。" },

    { id: "qSize", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qSize", extra: "houses",
      expr: { owl: "smile", puppy: "thinking" },
      houses: [
        { name: "A 大樓", deed: "**權狀** ==30 坪==", rows: ["總價 ==1,800 萬=="], tone: "a" },
        { name: "B 公寓", deed: "**權狀** ==24 坪==", rows: ["總價 ==1,500 萬=="], tone: "b" }
      ],
      text: "先別算錢。扣掉公設，哪間實際住起來比較大？",
      choices: [
        { icon: "🏢", text: "A 屋，因為權狀多了 6 坪", hint: "權狀多 6 坪，如果公設也多很多，室內還比較大嗎？" },
        { icon: "🏠", text: "B 屋，老公寓公設少，室內可能更大", correct: true },
        { icon: "⚖️", text: "權狀不同就沒辦法比", hint: "可以比。先估公設占掉多少，再看剩下的室內。" }
      ],
      skip: { card: "d2", resume: "qPrice", text: "正解：B 的室內比較大。A 公設比 ==35%==，室內約 ==19.5 坪==；B 公設比 ==5%==，室內約 ==22.8 坪==。例子把陽台簡化、先不另拆。這題跳過，不加經驗值。" } },
    { id: "qSize-ok", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "surprised" },
      text: "A 的公設比若是 ==35%==，室內大約 ==30 × (1 − 0.35) = 19.5 坪==。B 若是 ==5%==，室內大約 ==24 × 0.95 = 22.8 坪==。" },
    { id: "qSize-note", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "surprised" },
      text: "所以 B 實際住起來比較大。這是簡化的例子，陽台先不另外拆。" },
    { id: "qSize-card", scene: 4, type: "card", card: "d2", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "收進卡片：先看**室內坪數**，不要只看權狀。" },

    { id: "qPrice", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qPrice", extra: "houses",
      expr: { owl: "smile", puppy: "thinking" },
      houses: [
        { name: "A 大樓", deed: "室內約 ==19.5 坪==", rows: ["總價 ==1,800 萬==", "公設比 ==35%=="], tone: "a" },
        { name: "B 公寓", deed: "室內約 ==22.8 坪==", rows: ["總價 ==1,500 萬==", "公設比 ==5%=="], tone: "b" }
      ],
      text: "再用「室內每坪單價」比比看。哪間的室內實際比較貴？",
      choices: [
        { icon: "💸", text: "A 比較便宜，因為一坪才多 50 萬", hint: "那 50 萬是用權狀差算的。改用總價 ÷ 室內坪數，A 還比較便宜嗎？" },
        { icon: "🏠", text: "B 的室內單價比較低", correct: true },
        { icon: "⚖️", text: "兩間的室內單價差不多", hint: "算一下 ==1,800 ÷ 19.5== 和 ==1,500 ÷ 22.8==。" }
      ],
      skip: { card: "d3", resume: "t1-line", text: "正解：B 的室內單價比較低。A ≈ ==1,800 ÷ 19.5 ≈ 92 萬/坪==，B ≈ ==1,500 ÷ 22.8 ≈ 66 萬/坪==。這題跳過，不加經驗值。" } },
    { id: "qPrice-ok", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "surprised" },
      text: "A 的室內單價大約 ==1,800 ÷ 19.5 ≈ 92 萬/坪==。B 大約 ==1,500 ÷ 22.8 ≈ 66 萬/坪==。" },
    { id: "qPrice-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "guilty", puppy: "surprised" },
      text: "那個「一坪多 50 萬」，是總價差除以權狀差…不是室內單價。" },
    { id: "qPrice-card", scene: 4, type: "card", card: "d3", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第三張卡：用**室內單價**比，才不會被權狀差騙到。" },

    { id: "t1-line", scene: 5, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "thinking" },
      text: "這間公設比很低喔！" },
    { id: "t1-q", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t1",
      expr: { owl: "serious", puppy: "thinking" },
      text: "阿狐說「這間公設比很低喔！」你怎麼看？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "👌", text: "沒問題，公設比低代表住得大", hint: "口頭說很低，你手上有沒有權狀上的公設坪數可以自己除一次？" }
      ],
      skip: { resume: "t2-line", text: "正解：!!這是陷阱!!。公設比不能只聽口頭，要用權狀自己算。" } },
    { id: "t1-ex", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。公設比要看權狀自己算，不能只聽口頭的「很低」。" },

    { id: "t2-line", scene: 5, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "surprised" },
      text: "送你陽台跟雨遮！" },
    { id: "t2-q", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t2",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「送你陽台跟雨遮！」這句呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "🎁", text: "沒問題，送的就不要錢", hint: "**雨遮**從規定上本來怎麼計價？**陽台**有沒有本來就在權狀裡？" }
      ],
      skip: { resume: "t3-line", text: "正解：!!這是陷阱!!。雨遮依規定本來就不計價；陽台是附屬建物，本來就算在權狀裡，不是送的。" } },
    { id: "t2-ex", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。**雨遮**依規定本來就不計價。**陽台**是**附屬建物**，本來就算在權狀裡，不是額外送的。" },

    { id: "t3-line", scene: 5, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "happy" },
      text: "有健身房、游泳池，超豪華！" },
    { id: "t3-q", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t3",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「有健身房、游泳池，超豪華！」呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "🏊", text: "沒問題，公共設施越多越好", hint: "這些設施是誰的空間？會不會算進你的坪數，管理費也跟著變高？" }
      ],
      skip: { resume: "t-panic", text: "正解：!!這是陷阱!!。健身房、游泳池是公設，算進你的坪數付錢，管理費通常也更高。" } },
    { id: "t3-ex", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。健身房、游泳池都是**公設**，算進你的坪數裡付錢，管理費通常也更高。" },
    { id: "t-panic", scene: 5, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "panic", puppy: "worried" },
      text: "那些…那些用說的比較快嘛…" },

    { id: "cheat", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "thinking" },
      text: "速記一下常見的公設比，只是大約：公寓 ==0～10%==，華廈 ==20～30%==，電梯大樓 ==30～40%==。真正數字還是看權狀。" },

    { id: "sum1", scene: 7, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "今天三句話。第一，先看**室內坪數**，不要只看權狀。" },
    { id: "sum2", scene: 7, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "thinking" },
      text: "第二，**公設比**要自己用權狀算，別只聽口頭。" },
    { id: "sum3", scene: 7, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第三，用**室內單價**，也就是總價 ÷ 室內坪數，來比較。" },
    { id: "tease", scene: 7, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "thinking" },
      text: "1-3 房價怎麼看、實價登錄怎麼查，即將推出。" },
    { id: "end", scene: 7, type: "end", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" } }
  ]
};
