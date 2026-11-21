/* Lesson 1-3 「房屋類型與屋齡」. Loaded before game.js. */
var LEVEL_13 = {
  id: "1-3",
  saveKey: "adult-life-1-3",
  saveVersion: 1,
  shortTitle: "1-3 房屋類型與屋齡",
  sub: "",
  endKicker: "第 1-3 關完成",
  endTitle: "房屋類型與屋齡",
  soon: "第1章的三關都走到這裡了。",
  next: null,
  sortDone: "三種類型都放對了。這是市場上的習慣分法，不是法律上的正式名稱。",
  cards: {
    e1: {
      icon: "🏘️",
      title: "房屋類型三兄弟",
      body: "市場上常這樣分：**公寓**大約 ==5 樓以下==、沒電梯，公設大約 ==0～10%==；**華廈**大約 ==7～10 樓==、有電梯，公設大約 ==20～30%==；**電梯大樓**大約 ==11 樓以上==，公設大約 ==30%== 以上。這是習慣分法，各棟仍要看權狀。"
    },
    e2: {
      icon: "📅",
      title: "屋齡要一起看",
      body: "銀行常把**屋齡**和貸款年限加在一起看，常見的內部上限大約 ==50～60 年==，各家不同。老房子的成數通常較低，維修也較多。==1999== 年 921 之後耐震規範變嚴；大約 ==2000== 年以後的建造執照，多半適用較新規定，年份不是安全保證。"
    },
    e3: {
      icon: "⚠️",
      title: "三個價錢陷阱",
      body: "!!等都更就賺!!要看同意比例，時程又長。!!頂樓加蓋!!多半是違建，不在權狀。!!海砂屋!!外觀看不出，要做氯離子檢測，不動產說明書也要標已知的海砂屋、輻射屋。比實價登錄先把**車位**拆開。"
    }
  },
  items: [
    { id: "walk", label: "5 樓以下、沒有電梯", bin: "apt", hint: "樓層少、又要走樓梯，這是**公寓**的典型。" },
    { id: "lowshare", label: "公設很少，大約 0～10%", bin: "apt", hint: "公設很低、常常沒有管理員，要放進**公寓**。" },
    { id: "midrise", label: "大約 7～10 樓、有電梯", bin: "mid", hint: "有電梯，樓層大約停在 10 樓上下，這是**華廈**。" },
    { id: "midshare", label: "公設比大約 20～30%", bin: "mid", hint: "這個公設範圍，市場上多半拿來形容**華廈**。" },
    { id: "highrise", label: "11 樓以上", bin: "tower", hint: "樓層再上去，就是**電梯大樓**。" },
    { id: "lobby", label: "大廳、管理員，公設約 30% 以上", bin: "tower", hint: "大廳和管理員，再加上較高的公設，是**電梯大樓**。" }
  ],
  bins: [
    { id: "apt", label: "🚶 公寓", sub: "約 5 樓以下、無電梯" },
    { id: "mid", label: "🏢 華廈", sub: "約 7～10 樓、有電梯" },
    { id: "tower", label: "🏙️ 電梯大樓", sub: "約 11 樓以上" }
  ],
  script: [
    { id: "open-pup", scene: 0, type: "say", speaker: "puppy", cast: ["puppy", "fox"],
      expr: { puppy: "thinking", fox: "smug" },
      houses: [
        { name: "A 公寓", deed: "屋齡 ==40 年==", rows: ["總價 ==1,280 萬==", "沒有電梯"], tone: "a" },
        { name: "B 電梯大樓", deed: "屋齡 ==5 年==", rows: ["總價 ==1,350 萬==", "有電梯"], tone: "b" }
      ],
      text: "這兩間總價差不多。一間是屋齡 ==40 年==的公寓，一間是屋齡 ==5 年==的電梯大樓。（範例數字）" },
    { id: "open-fox", scene: 0, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "worried" },
      text: "老公寓沒公設，超划算！大樓那些大廳、電梯，你又用不到。" },
    { id: "open-think", scene: 0, type: "say", speaker: "puppy", cast: ["puppy"],
      expr: { puppy: "thinking" },
      text: "沒公設是比較划算，還是少了什麼？我先別急著點頭。" },

    { id: "q-why", scene: 1, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qWhy",
      expr: { owl: "smile", puppy: "thinking" },
      text: "為什麼同一區的公寓，總價常常比電梯大樓便宜？",
      choices: [
        { icon: "🚶", text: "通常沒電梯、公設少，買方願意付的總價比較低", correct: true },
        { icon: "🏦", text: "因為公寓依法不能貸款", hint: "老房子多半還是能貸，只是成數和年限常常比較緊。先想便利性和公設。" },
        { icon: "📉", text: "沒公設就代表房子比較差、不值得買", hint: "沒公設，代表你付的坪數比較接近真正住的。總價便宜，多半還有別的原因。" }
      ],
      skip: { resume: "why-ok", text: "正解：公寓通常沒電梯、公設少，買方願意付的總價比較低。這不代表每一坪室內都比較便宜。這題跳過，不加經驗值。" } },
    { id: "why-ok", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "surprised" },
      text: "公寓多半是大約 ==5 樓以下==、沒有電梯，要自己走樓梯，也很少有大廳和管理員。" },
    { id: "why-ok2", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "大樓把電梯和公設算進總價。所以同一區的公寓看起來比較便宜，不代表每一坪室內都比較便宜。" },
    { id: "why-pup", scene: 1, type: "say", speaker: "puppy", cast: ["puppy", "owl"],
      expr: { puppy: "surprised", owl: "smile" },
      text: "原來「沒公設」不是白賺的坪數，是少了電梯和那些服務。" },

    { id: "q-type", scene: 2, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qType",
      expr: { owl: "smile", puppy: "thinking" },
      text: "一棟大約 ==9 樓==、有電梯，公設比大約 ==25%==。市場上比較像哪一類？",
      choices: [
        { icon: "🚶", text: "公寓", hint: "公寓通常沒有電梯，樓層也比較少。" },
        { icon: "🏢", text: "華廈", correct: true },
        { icon: "🏙️", text: "電梯大樓", hint: "電梯大樓通常再高一些，大約從 11 樓往上，公設也常常更高。" }
      ],
      skip: { card: "e1", resume: "type-apt", text: "正解：**華廈**。市場上大約 ==7～10 樓==、有電梯、公設大約 ==20～30%== 常被這樣叫。這是習慣分法。這題跳過，不加經驗值。" } },
    { id: "type-ok", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "對，這種大約 ==7～10 樓==、有電梯的，市場上常叫**華廈**。下面三類是習慣分法，不是法律上的正式名稱。" },
    { id: "type-apt", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "**公寓**：大約 ==5 樓以下==、沒有電梯。公設比常常很低，大約 ==0～10%==。管理費低，或甚至沒有。適合走得動樓梯、在意室內坪數的人。" },
    { id: "type-mid", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "**華廈**：大約 ==7～10 樓==、有電梯。公設比大約 ==20～30%==。有基本的電梯和梯廳，管理費中等。" },
    { id: "type-tower", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "thinking" },
      text: "**電梯大樓**：大約 ==11 樓以上==。公設比大約 ==30%== 以上，有大廳、管理員，有的還有健身房。管理費通常比較高，適合在意便利和社區管理的人。" },
    { id: "sort", scene: 2, type: "sort", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "thinking" },
      text: "來分類。這些描述比較像**公寓**、**華廈**，還是**電梯大樓**？",
      skip: { resume: "sort-wrap", text: "正解：5 樓以下、沒電梯、公設大約 ==0～10%== 是**公寓**；約 ==7～10 樓==、公設大約 ==20～30%== 是**華廈**；==11 樓以上==、大廳管理員、公設大約 ==30%== 以上是**電梯大樓**。這題跳過，不加經驗值。" } },
    { id: "sort-wrap", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "同一區裡，公寓總價常常比較低，管理費也比較少；大樓則把電梯和公設一起算進價錢。" },
    { id: "type-card", scene: 2, type: "card", card: "e1", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第一張卡：三種類型先用樓層、電梯和公設抓一個範圍，真正數字還是看權狀。" },

    { id: "q-loan", scene: 3, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qLoan",
      expr: { owl: "serious", puppy: "worried" },
      text: "屋齡 ==40 年==的公寓，跟屋齡 ==5 年==的大樓，銀行貸款最常差在哪？",
      choices: [
        { icon: "🏦", text: "銀行常把屋齡和貸款年限加在一起看，老房子通常比較緊", correct: true },
        { icon: "🙅", text: "屋齡不影響貸款", hint: "很多銀行會看屋齡。老房子的年限和成數常常比較短、比較低。" },
        { icon: "⚖️", text: "法律規定屋齡超過 30 年就不能貸", hint: "沒有一條法律這樣規定。是各銀行的內規，常見的上限大約落在屋齡加年限 50 到 60 年。" }
      ],
      skip: { card: "e2", resume: "loan-ok", text: "正解：銀行常把**屋齡**和貸款年限加在一起看。常見的內部上限大約 ==50～60 年==，各家不同，老房子成數通常較低。這題跳過，不加經驗值。" } },
    { id: "loan-ok", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "thinking" },
      text: "各銀行內規不同。常見的算法是屋齡加上貸款年限，上限大約落在 ==50～60 年==。屋齡愈高，能貸的成數通常愈低、年限愈短。" },
    { id: "loan-fix", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "老房子的水管、防水、外牆，維修費通常也比較高。總價便宜的時候，要把以後修的錢算進去。" },
    { id: "quake", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "==1999== 年 921 地震之後，耐震設計規範變嚴。大約 ==2000== 年以後取得建造執照的房子，多半適用較新的規定。年份不是安全保證，還是要看結構。" },
    { id: "renew", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "**都更**要一定比例的所有權人同意，整合和審議往往要很多年，結果不確定。**危老**重建是另一條路，也要符合條件，不是等著就會賺錢。" },
    { id: "age-card", scene: 3, type: "card", card: "e2", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第二張卡：屋齡要跟貸款、維修和耐震規定一起看。" },

    { id: "t1-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "surprised" },
      text: "這間屋齡 ==40 年==，等都更就賺翻！" },
    { id: "t1-q", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t1",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「屋齡 40 年，等都更就賺翻。」這句呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "📈", text: "沒問題，老房子就是在等都更", hint: "都更要所有權人同意，時間常常要很多年。這句把結果說得太確定了。" }
      ],
      skip: { resume: "t2-fox", text: "正解：!!這是陷阱!!。都更要一定比例的所有權人同意，時程長、結果不確定，不是等著就會賺。這題跳過，不加經驗值。" } },
    { id: "t1-ex", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。都更要湊齊同意比例，程序長，結果不確定。不能把「以後會賺」算進今天的價錢。" },

    { id: "t2-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "worried" },
      text: "頂樓加蓋送你，多一層不用錢！" },
    { id: "t2-q", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t2",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「頂樓加蓋送你。」這句呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "🎁", text: "沒問題，送的坪數不用登記", hint: "沒寫進權狀的加蓋，算誰的？別人能不能檢舉？" }
      ],
      skip: { resume: "t3-fox", text: "正解：!!這是陷阱!!。沒登記的頂樓加蓋多半是違建，不在權狀裡，可能被檢舉拆除。這題跳過，不加經驗值。" } },
    { id: "t2-ex", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。沒登記的頂樓加蓋多半是**違建**，不在**權狀**裡，可能被檢舉拆除。不能當成白送的坪數。" },

    { id: "t3-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "thinking" },
      text: "海砂屋看不出來，不用查啦。" },
    { id: "t3-q", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t3",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「海砂屋看不出來，不用查。」這句呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "👀", text: "沒問題，外觀正常就安全", hint: "外觀正常，就能知道牆裡的氯離子高不高嗎？" }
      ],
      skip: { resume: "t-panic", text: "正解：!!這是陷阱!!。海砂屋外觀看不出，要做氯離子檢測。不動產說明書也要標出已知的海砂屋、輻射屋。這題跳過，不加經驗值。" } },
    { id: "t3-ex", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。海砂屋外觀看不出，要做**氯離子檢測**。買賣時的不動產說明書，也要把已知的海砂屋、輻射屋標出來。" },
    { id: "t-panic", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "panic", puppy: "worried" },
      text: "那些…那些是以後的事，我先講好聽的嘛…" },

    { id: "q-price", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qPrice", extra: "houses",
      expr: { owl: "smile", puppy: "thinking" },
      houses: [
        { name: "同路公寓", deed: "權狀 ==25 坪==", rows: ["總價 ==1,200 萬==", "沒有車位"], tone: "a" },
        { name: "同路大樓", deed: "權狀 ==42 坪==", rows: ["總價 ==2,400 萬==", "車位 ==10 坪==、==280 萬=="], tone: "b" }
      ],
      text: "同一條路、去年的兩筆成交（範例數字）。先拆掉車位，房屋單價哪一間比較高？",
      choices: [
        { icon: "🚶", text: "公寓。總價比較低，單價一定比較高", hint: "總價低不代表單價高。公寓沒有車位，大樓的車位要先扣掉。" },
        { icon: "🏙️", text: "大樓。拆開車位之後單價比較高", correct: true },
        { icon: "⚖️", text: "兩間差不多", hint: "算一下 ==1,200 ÷ 25==，和 ==(2,400 − 280) ÷ (42 − 10)==。" }
      ],
      skip: { card: "e3", resume: "price-ok", text: "正解：大樓比較高。公寓 ==1,200 ÷ 25 = 48 萬/坪==；大樓 ==(2,400 − 280) ÷ (42 − 10) = 66.25 萬/坪==。這是範例數字。比實價登錄要先拆**車位**。這題跳過，不加經驗值。" } },
    { id: "price-ok", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "surprised" },
      text: "公寓是 ==1,200 ÷ 25 = 48 萬/坪==。大樓先拆車位：==(2,400 − 280) ÷ (42 − 10) = 66.25 萬/坪==。" },
    { id: "price-point", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "公寓總價比較低，有一部分是因為沒車位、公設少、屋齡高。用**實價登錄**比的時候，先拆**車位**，再看是不是同一條路、類型和屋齡差多少。" },
    { id: "price-card", scene: 5, type: "card", card: "e3", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第三張卡：都更、加蓋、海砂屋這三句要停一下，比價也要先拆車位。" },

    { id: "sum1", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "今天三句。第一，**公寓**、**華廈**、**電梯大樓**先看樓層、電梯和公設，這是市場上的習慣分法。" },
    { id: "sum2", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "thinking" },
      text: "第二，**屋齡**要跟貸款年限、維修和耐震規定一起看。都更、危老都不是保證獲利。" },
    { id: "sum3", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第三，!!等都更!!、!!頂樓加蓋!!、!!海砂屋不用查!!都是陷阱。比實價登錄要先拆車位。" },
    { id: "end", scene: 6, type: "end", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" } }
  ]
};
