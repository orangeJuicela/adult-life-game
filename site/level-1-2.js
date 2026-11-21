/* Lesson 1-2 「每坪到底多少錢？」. Loaded before game.js. saveVersion 2 drops old 1-2 saves. */
var LEVEL_12 = {
  id: "1-2",
  saveKey: "adult-life-1-2",
  saveVersion: 2,
  shortTitle: "1-2 每坪到底多少錢？",
  sub: "",
  endKicker: "第 1-2 關完成",
  endTitle: "每坪到底多少錢？",
  soon: "下一關：1-3 房屋類型與屋齡",
  next: "1-3",
  nextLabel: "前往 1-3 房屋類型與屋齡",
  cards: {
    d1: {
      icon: "💰",
      title: "比室內單價",
      body: "室內單價 = ==總價 ÷ 室內坪數==。不同公設比的房子，用**室內單價**比才公平。管理費多半按**權狀坪數**收，公設越多，**每個月都要繼續付**。"
    },
    d2: {
      icon: "🚗",
      title: "車位拆開算",
      body: "房屋單價 = ==(總價 − 車位價) ÷ (權狀坪數 − 車位坪數)==。"
    },
    d3: {
      icon: "🔎",
      title: "實價登錄比價",
      body: "找**同區**、**屋齡相近**、**近一年**的成交。單價要確認**車位拆開**。備註裡的!!親友間交易、含裝潢、特殊交易!!不拿來比。"
    }
  },
  items: [],
  bins: [],
  script: [
    { id: "open-fox", scene: 0, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "surprised" },
      text: "這間大樓每坪才 ==60 萬==！權狀 ==30 坪==，總價 ==1,800 萬==～" },
    { id: "open-pup", scene: 0, type: "say", speaker: "puppy", cast: ["puppy"],
      expr: { puppy: "thinking" },
      text: "每坪 60 萬…聽起來好便宜。可是 1-1 學過，權狀裡有公設。" },

    { id: "q-in", scene: 1, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qIn", extra: "houses",
      expr: { owl: "smile", puppy: "thinking" },
      houses: [
        { name: "這間大樓", deed: "權狀 ==30 坪==", rows: ["每坪 ==60 萬==", "總價 ==1,800 萬==", "公設比 ==35%=="], tone: "a" }
      ],
      text: "1-1 學過：==公設比 = 公設 ÷ 權狀==。這間公設比 ==35%==，扣掉公設後，『真正住得到的每坪』要多少錢？（範例數字）",
      choices: [
        { icon: "🏷️", text: "約 60 萬", hint: "==60 萬==是用權狀 ==30 坪==算的，公設也算進去了。" },
        { icon: "💰", text: "約 92 萬", correct: true },
        { icon: "📉", text: "約 39 萬", hint: "室內坪數變少，每坪會變貴還是變便宜？" }
      ],
      skip: { card: "d1", resume: "why-pup", text: "正解：約 ==92 萬/坪==。室內約 ==30 × (1 − 35%) = 19.5 坪==，==1,800 ÷ 19.5 ≈ 92 萬==。老公寓若權狀 24 坪、公設比 5%、總價 1,560 萬，室內單價約 ==68 萬/坪==。**權狀單價**低不代表划算，要比 **室內單價**。這題跳過，不加經驗值。" } },
    { id: "q-in-ok", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "surprised" },
      text: "室內約 ==30 × (1 − 35%) = 19.5 坪==。==1,800 ÷ 19.5 ≈ 92 萬/坪==。" },
    { id: "q-in-cmp", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "surprised" },
      houses: [
        { name: "大樓", deed: "室內 ==19.5 坪==", rows: ["總價 ==1,800 萬==", "室內單價約 ==92 萬=="], tone: "a" },
        { name: "老公寓", deed: "室內 ==22.8 坪==", rows: ["總價 ==1,560 萬==", "室內單價約 ==68 萬=="], tone: "b" }
      ],
      text: "對照老公寓：權狀 ==24 坪==、公設比 ==5%==、每坪 ==65 萬==、總價 ==1,560 萬==。室內 ==22.8 坪==，室內單價約 ==68 萬/坪==。" },
    { id: "q-in-point", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "surprised" },
      text: "**權狀單價**低，不代表划算。要比 **室內單價**。" },
    { id: "q-in-pup", scene: 1, type: "say", speaker: "puppy", cast: ["puppy", "owl"],
      expr: { puppy: "surprised", owl: "smile" },
      text: "60 萬是權狀每坪。真正住到的每一坪，要貴上好多。" },
    { id: "q-in-card", scene: 1, type: "card", card: "d1", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "收一張卡：用**室內單價**比，不同公設比才公平。" },

    { id: "why-pup", scene: 2, type: "say", speaker: "puppy", cast: ["puppy", "owl"],
      expr: { puppy: "thinking", owl: "smile" },
      text: "那為什麼還有人買公設比 ==35%== 的？" },
    { id: "q-why", scene: 2, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qWhy",
      expr: { owl: "smile", puppy: "thinking" },
      text: "公設多，換到了什麼？",
      choices: [
        { icon: "🏢", text: "電梯、管理員和保全、大廳與社區設施", correct: true },
        { icon: "🚫", text: "什麼都沒有", hint: "電梯、大廳、管理員，這些算不算你換到的東西？" }
      ],
      skip: { resume: "fee-q", text: "正解：換到電梯、管理員和保全、大廳與社區設施。公設比大約是公寓 ==0～10%==、華廈 ==20～30%==、電梯大樓 ==30～40%==。高不高，要看那些公設你用不用得到。這題跳過，不加經驗值。" } },
    { id: "q-why-ok", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "這些都是公設換來的。公設比高不一定不好，要看你用不用得到、願不願意付錢。" },
    { id: "q-why-range", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "thinking" },
      text: "大約抓一下：公寓（無電梯）==0～10%==、華廈 ==20～30%==、電梯大樓 ==30～40%==。" },

    { id: "fee-q", scene: 3, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qFee",
      expr: { owl: "serious", puppy: "thinking" },
      text: "管理費常常是按 **權狀坪數** 收。每坪 ==80 元==、權狀 ==30 坪==，一個月多少？",
      choices: [
        { icon: "🏠", text: "1,560 元", hint: "用權狀坪數，不是室內。" },
        { icon: "🧾", text: "==2,400 元==", correct: true },
        { icon: "🪙", text: "800 元", hint: "==80 元==是每一坪，還要乘上權狀 ==30 坪==。" }
      ],
      skip: { resume: "park-fox", text: "正解：==80 × 30 = 2,400 元/月==，一年 ==28,800 元==。若每坪 120 元，就是 ==3,600 元/月==、一年 43,200 元。公設越多越豪華，**每個月都要繼續付**。這題跳過，不加經驗值。" } },
    { id: "fee-ok", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "worried" },
      text: "==80 × 30 = 2,400 元/月==，一年 ==28,800 元==。" },
    { id: "fee-lux", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "如果社區有游泳池、健身房，管理費每坪 ==120 元==，就是 ==3,600 元/月==、一年 ==43,200 元==。" },
    { id: "fee-point", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "公設越多越豪華，**每個月都要繼續付**。" },
    { id: "fee-pup", scene: 3, type: "say", speaker: "puppy", cast: ["puppy", "owl"],
      expr: { puppy: "worried", owl: "serious" },
      text: "買的時候算過總價，每個月還要再付一次公設。" },

    { id: "park-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "thinking" },
      text: "這間權狀 ==40 坪==、總價 ==2,400 萬==，每坪才 ==60 萬==，還含車位喔！" },
    { id: "q-park", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qPark", extra: "houses",
      expr: { owl: "smile", puppy: "thinking" },
      houses: [
        { name: "含車位報價", deed: "權狀 ==40 坪==", rows: ["總價 ==2,400 萬==", "每坪 ==60 萬=="], tone: "a" },
        { name: "車位要拆開", deed: "車位 ==10 坪==", rows: ["價值 ==250 萬=="], tone: "b" }
      ],
      text: "車位登記 ==10 坪==、價值 ==250 萬==。房子本身每坪其實多少？",
      choices: [
        { icon: "🏷️", text: "60 萬", hint: "車位的坪數和價錢都混在裡面。" },
        { icon: "🚗", text: "約 72 萬", correct: true },
        { icon: "📉", text: "約 54 萬", hint: "扣掉車位後，總價和坪數都要扣。" }
      ],
      skip: { card: "d2", resume: "where-q", text: "正解：約 ==72 萬/坪==。==(2,400 − 250) ÷ (40 − 10) = 2,150 ÷ 30 ≈ 71.7 萬/坪==。車位混進去會把單價拉低，要請房仲把 **房屋** 和 **車位** 分開報價。這題跳過，不加經驗值。" } },
    { id: "q-park-ok", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "surprised" },
      text: "==(2,400 − 250) ÷ (40 − 10) = 2,150 ÷ 30 ≈ 71.7 萬/坪==。" },
    { id: "q-park-why", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "車位每坪通常比房子便宜。混在一起算，單價會看起來比較低。" },
    { id: "q-park-ask", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "要請房仲把 **房屋** 和 **車位** 分開報價。" },
    { id: "q-park-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "guilty", puppy: "surprised" },
      text: "含在一起報，數字比較好看…房屋本身其實比較貴。" },
    { id: "q-park-card", scene: 4, type: "card", card: "d2", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第二張卡：**車位拆開算**，才看得到房子本身的單價。" },

    { id: "where-q", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qWhere",
      expr: { owl: "smile", puppy: "thinking" },
      text: "想知道 ==92 萬==貴不貴，要去哪裡查？",
      choices: [
        { icon: "🦊", text: "問阿狐", hint: "阿狐的開價還要對一下真正的成交價。去哪裡查？" },
        { icon: "🔎", text: "內政部 **實價登錄**（不動產交易實價查詢服務網）", correct: true },
        { icon: "📰", text: "看廣告", hint: "廣告是開價，不是成交價。要查哪裡的紀錄？" }
      ],
      skip: { resume: "check1", text: "正解：上內政部 **實價登錄**（不動產交易實價查詢服務網），看真正成交的價錢。這題跳過，不加經驗值。" } },
    { id: "where-ok", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "上內政部 **實價登錄**，也就是不動產交易實價查詢服務網，看真正成交的價錢。" },
    { id: "check1", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "找 **同社區或附近**、**屋齡相近**、**近一年** 的成交。" },
    { id: "check2", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "看單價時，確認 **車位有沒有拆開**。" },
    { id: "check3", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "再看 **備註欄**。!!親友間交易、含裝潢、特殊交易!! 的價格，不適合拿來比。" },

    { id: "cmp1", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "cmp1",
      expr: { owl: "smile", puppy: "thinking" },
      text: "同社區、去年成交的一筆。要不要拿來比？",
      choices: [
        { icon: "✅", text: "要比", correct: true },
        { icon: "🚫", text: "不比", hint: "同社區、時間又近，這種成交適合拿來比。" }
      ],
      skip: { resume: "cmp2", text: "正解：要比。同社區、去年成交，地點近、也在近一年裡。這題跳過，不加經驗值。" } },
    { id: "cmp1-ok", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "同社區、去年成交，地點近、時間也在近一年裡，可以比。" },

    { id: "cmp2", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "cmp2",
      expr: { owl: "serious", puppy: "thinking" },
      text: "備註寫著親友間交易。要不要拿來比？",
      choices: [
        { icon: "✅", text: "要比", hint: "!!親友間交易!! 的價格常常不是市價。" },
        { icon: "🚫", text: "不比", correct: true }
      ],
      skip: { resume: "cmp3", text: "正解：不比。!!親友間交易!! 寫在備註欄，價格不適合拿來比。這題跳過，不加經驗值。" } },
    { id: "cmp2-ok", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!親友間交易!! 常常不是市價，不拿來比。" },

    { id: "cmp3", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "cmp3",
      expr: { owl: "serious", puppy: "thinking" },
      text: "隔壁區一間 30 年老公寓，拿來跟這間新大樓比。要不要？",
      choices: [
        { icon: "✅", text: "要比", hint: "區域不同、屋齡差了 30 年，產品差太多。" },
        { icon: "🚫", text: "不比", correct: true }
      ],
      skip: { resume: "cmp4", text: "正解：不比。隔壁區、屋齡差很多的老公寓和新大樓，不好放在一起比。這題跳過，不加經驗值。" } },
    { id: "cmp3-ok", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "區域不同、屋齡差了 ==30 年==，不拿來比。" },

    { id: "cmp4", scene: 5, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "cmp4",
      expr: { owl: "smile", puppy: "thinking" },
      text: "附近、屋齡相近、半年前成交。要不要拿來比？",
      choices: [
        { icon: "✅", text: "要比", correct: true },
        { icon: "🚫", text: "不比", hint: "附近、屋齡相近、半年內，三個條件都靠近。" }
      ],
      skip: { card: "d3", resume: "t1-fox", text: "正解：要比。附近、屋齡相近、半年前，符合拿來比的條件。比價要同區、屋齡相近、近一年，車位拆開，特殊交易不比。這題跳過，不加經驗值。" } },
    { id: "cmp4-ok", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "附近、屋齡相近、半年前，可以拿來比。" },
    { id: "cmp-card", scene: 5, type: "card", card: "d3", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第三張卡：用**實價登錄**比的時候，先看條件像不像。" },

    { id: "t1-fox", scene: 6, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "thinking" },
      text: "這間公設比很低，才 ==20%== 喔！" },
    { id: "t1-q", scene: 6, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t1",
      expr: { owl: "serious", puppy: "thinking" },
      text: "阿狐說「公設比很低，才 20%」。你怎麼看？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "👌", text: "沒問題，20% 算低", hint: "口頭說 ==20%==，你有沒有用權狀自己除一次？" }
      ],
      skip: { resume: "t2-fox", text: "正解：!!這是陷阱!!。不能只聽口頭，用權狀自己算 ==公設 ÷ 權狀總坪數==（1-1 學過）。這題跳過，不加經驗值。" } },
    { id: "t1-ex", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。不能只聽口頭。用權狀自己算 ==公設 ÷ 權狀總坪數==，這是 1-1 學過的。" },

    { id: "t2-fox", scene: 6, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "surprised" },
      text: "每坪 ==55 萬==，含車位一起算的啦～" },
    { id: "t2-q", scene: 6, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t2",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「每坪 55 萬，含車位一起算。」這句呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "👌", text: "沒問題，有算到車位", hint: "含車位一起算，單價會被拉高還是拉低？" }
      ],
      skip: { resume: "t3-fox", text: "正解：!!這是陷阱!!。含車位的單價會被拉低，房屋和車位要拆開算。這題跳過，不加經驗值。" } },
    { id: "t2-ex", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。含車位的單價會被拉低，要拆開算。" },

    { id: "t3-fox", scene: 6, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "happy" },
      text: "管理費一坪才 ==100 元==，超便宜！" },
    { id: "t3-q", scene: 6, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t3",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「管理費一坪才 100 元，超便宜！」呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "👌", text: "沒問題，100 元很便宜", hint: "一坪 ==100 元==，權狀 ==30 坪==，一個月是多少？" }
      ],
      skip: { resume: "t-panic", text: "正解：!!這是陷阱!!。要乘上權狀坪數，==30 坪==就是一個月 ==3,000 元==，一年 ==36,000 元==。這題跳過，不加經驗值。" } },
    { id: "t3-ex", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。要乘上**權狀坪數**。==30 坪==就是一個月 ==3,000 元==，一年 ==36,000 元==。" },
    { id: "t-panic", scene: 6, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "panic", puppy: "worried" },
      text: "那些…那些用每坪講比較好聽嘛…" },

    { id: "sum1", scene: 7, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "今天三句。第一，比 **室內單價**，不要只看權狀單價。" },
    { id: "sum2", scene: 7, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "thinking" },
      text: "第二，**車位拆開算**。房屋和車位分開報價。" },
    { id: "sum3", scene: 7, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第三，用 **實價登錄** 比價。另外記得，公設會帶來管理費。" },
    { id: "tease", scene: 7, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "thinking" },
      text: "下一關，我們來看**房屋類型**和**屋齡**。公寓、華廈、電梯大樓，差在哪。" },
    { id: "end", scene: 7, type: "end", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" } }
  ]
};
