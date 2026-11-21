/* Lesson 1-4 「房貸怎麼算？」. Numbers come from the annuity formula below. */
function mortgagePayment(principal, annualRate, months) {
  var monthly = annualRate / 12;
  var grown = Math.pow(1 + monthly, months);
  return Math.round(principal * monthly * grown / (grown - 1));
}

function loanFromPayment(monthlyPay, annualRate, months) {
  var monthly = annualRate / 12;
  var grown = Math.pow(1 + monthly, months);
  return Math.round(monthlyPay * (grown - 1) / (monthly * grown));
}

var LOAN_14 = {
  price: 15000000,
  appraisal: 14000000,
  ltv: 0.8,
  rate: 0.02,
  years: 30,
  graceYears: 3,
  income: 90000
};
LOAN_14.loanIfEight = Math.round(LOAN_14.appraisal * LOAN_14.ltv);
LOAN_14.cashIfEight = LOAN_14.price - LOAN_14.loanIfEight;
LOAN_14.quotedDown = Math.round(LOAN_14.price * 0.2);
LOAN_14.pmt30 = mortgagePayment(12000000, LOAN_14.rate, LOAN_14.years * 12);
LOAN_14.interestOnly = Math.round(12000000 * LOAN_14.rate / 12);
LOAN_14.pmtAfterGrace = mortgagePayment(12000000, LOAN_14.rate, (LOAN_14.years - LOAN_14.graceYears) * 12);
LOAN_14.capPay = Math.round(LOAN_14.income / 3);
LOAN_14.loanFromCap = loanFromPayment(LOAN_14.capPay, LOAN_14.rate, LOAN_14.years * 12);
LOAN_14.priceFromCap = Math.round(LOAN_14.loanFromCap / 0.8);
LOAN_14.downFromCap = LOAN_14.priceFromCap - LOAN_14.loanFromCap;
if (LOAN_14.pmt30 !== 44354 || LOAN_14.pmtAfterGrace !== 47963 || LOAN_14.interestOnly !== 20000 || LOAN_14.cashIfEight !== 3800000 || LOAN_14.loanIfEight !== 11200000 || LOAN_14.capPay !== 30000 || LOAN_14.loanFromCap !== 8116455 || LOAN_14.priceFromCap !== 10145569 || LOAN_14.downFromCap !== 2029114) {
  throw new Error("房貸例題和公式不一致");
}

var LEVEL_14 = {
  id: "1-4",
  saveKey: "adult-life-1-4",
  saveVersion: 1,
  shortTitle: "1-4 房貸怎麼算？",
  sub: "",
  endKicker: "第 1-4 關完成",
  endTitle: "房貸怎麼算？",
  soon: "第1章的四關都走到這裡了。",
  next: null,
  cards: {
    f1: {
      icon: "🏦",
      title: "頭期款看估價",
      body: "貸款成數常見大約 ==7～8 成==，但是照銀行的**估價**，不是照成交價。估價比較低，**頭期款**就變多。另外要留契稅、印花稅、代書費、仲介費、貸款費用和裝潢搬家。"
    },
    f2: {
      icon: "📆",
      title: "月付與寬限",
      body: "**本息平均**每期付一樣的錢。例：借 ==1,200 萬==、==30 年==、年利率 ==2%==，月付 ==44,354 元==。前 ==3 年==只繳利息是每月 ==20,000 元==，之後 ==27 年==月付變成 ==47,963 元==。"
    },
    f3: {
      icon: "🧮",
      title: "月付抓三分之一",
      body: "房貸月付常用的建議是不超過薪水的 ==三分之一==。例：月收入 ==90,000==，上限 ==30,000==；年利率 ==2%==、==30 年==大約可貸 ==8,116,455 元==。頭期款兩成、估價等於成交價時，總價大約 ==10,145,569 元==。"
    }
  },
  items: [],
  bins: [],
  script: [
    { id: "open-pup", scene: 0, type: "say", speaker: "puppy", cast: ["puppy", "fox"],
      expr: { puppy: "happy", fox: "smug" },
      text: "這間總價 ==1,500 萬==，我好喜歡。（範例數字）" },
    { id: "open-fox", scene: 0, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "surprised" },
      text: "頭期款只要兩成，==300 萬==就能買！" },
    { id: "open-think", scene: 0, type: "say", speaker: "puppy", cast: ["puppy"],
      expr: { puppy: "thinking" },
      text: "300 萬…好像辦得到。可是簽約那天，是不是還有別的錢要付？" },

    { id: "q-cost", scene: 1, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qCost",
      expr: { owl: "smile", puppy: "thinking" },
      text: "除了**頭期款**，買房當下還要準備哪些錢？",
      choices: [
        { icon: "💸", text: "只要頭期款，稅費以後再說", hint: "過戶和貸款當下就會有稅和費用。先想契稅、代書、仲介這些。" },
        { icon: "📋", text: "契稅、印花稅、代書費、仲介費、貸款費用，再加上裝潢搬家和預備金", correct: true },
        { icon: "🤝", text: "只有仲介費", hint: "仲介費只是其中一項。稅、代書和貸款費用也要一起算。" }
      ],
      skip: { resume: "cost-ok", text: "正解：還要準備**契稅**、**印花稅**、代書費、仲介費、貸款相關費用，以及裝潢搬家和預備金。粗抓常常是總價再加幾個百分點，實際以試算為準。這題跳過，不加經驗值。" } },
    { id: "cost-ok", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "thinking" },
      text: "這些不是一個固定的「總價百分之幾」。**契稅**按核定契價算，買賣案件的稅率是 ==6%==；**印花稅**大約是契約金額的千分之一。" },
    { id: "cost-more", scene: 1, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "代書費、仲介費、貸款開辦費和保險另計，裝潢搬家也要錢。粗抓的話，頭期款之外常常再留總價的幾個百分點當預備，實際金額以試算為準。" },

    { id: "q-ltv", scene: 2, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qLtv", extra: "houses",
      expr: { owl: "serious", puppy: "thinking" },
      houses: [
        { name: "成交價", deed: "==1,500 萬==", rows: ["阿狐說頭期款 ==300 萬=="], tone: "a" },
        { name: "銀行估價", deed: "==1,400 萬==", rows: ["最多貸 ==8 成=="], tone: "b" }
      ],
      text: "如果銀行估價只有 ==1,400 萬==、最多貸 ==8 成==，頭期款變成多少？",
      choices: [
        { icon: "🏷️", text: "還是 300 萬", hint: "==300 萬==是用成交價乘兩成。銀行是照**估價**貸的。" },
        { icon: "🏦", text: "380 萬", correct: true },
        { icon: "📉", text: "200 萬", hint: "估價比成交價低，自己要準備的現金會變多還是變少？" }
      ],
      skip: { card: "f1", resume: "ltv-ok", text: "正解：==380 萬==。可貸 ==1,400 萬 × 8 成 = 1,120 萬==，頭期款 ==1,500 萬 − 1,120 萬 = 380 萬==。成數常見約 ==7～8 成==，但是照銀行估價。這題跳過，不加經驗值。" } },
    { id: "ltv-ok", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "surprised" },
      text: "可貸 ==1,400 萬 × 80% = 1,120 萬==。頭期款是 ==1,500 萬 − 1,120 萬 = 380 萬==，不是 300 萬。" },
    { id: "ltv-range", scene: 2, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "貸款成數常見大約 ==7～8 成==，各銀行不同，而且是乘銀行的**估價**。估價低於成交價，**頭期款**就變多。" },
    { id: "ltv-card", scene: 2, type: "card", card: "f1", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第一張卡：頭期款要看估價，稅和費用另外留。" },

    { id: "q-pmt", scene: 3, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "qPmt",
      expr: { owl: "smile", puppy: "thinking" },
      text: "如果貸到 ==1,200 萬==、分 ==30 年==、年利率 ==2%==，**本息平均**一個月約多少？",
      choices: [
        { icon: "➗", text: "33,333 元，本金直接除以 360 期", hint: "那樣沒有把利息算進去。本息平均每期會比「只除本金」高。" },
        { icon: "📆", text: "44,354 元", correct: true },
        { icon: "💤", text: "20,000 元，每個月只繳利息", hint: "==20,000 元==是 1,200 萬乘 2% 再除以 12，那是只繳利息、不還本金。" }
      ],
      skip: { card: "f2", resume: "pmt-ok", text: "正解：==44,354 元==。年利率 2%、360 期的本息平均月付，四捨五入到元。前 3 年若只繳利息是每月 ==20,000 元==，之後 27 年月付變成 ==47,963 元==。這題跳過，不加經驗值。" } },
    { id: "pmt-ok", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "surprised" },
      text: "**本息平均**是每一期付一樣的錢，前面利息佔比較多，後面本金佔比較多。這組條件的月付是 ==44,354 元==（四捨五入到元）。" },
    { id: "grace", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "如果前 ==3 年==是**寬限期**、只繳利息，每月是 ==1,200 萬 × 2% ÷ 12 = 20,000 元==。這三年本金幾乎沒有減少。" },
    { id: "grace-jump", scene: 3, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "寬限結束後，剩下 ==27 年==要把 ==1,200 萬==攤完，月付變成 ==47,963 元==。比一開始就攤 30 年的 ==44,354 元==還高。" },
    { id: "grace-pup", scene: 3, type: "say", speaker: "puppy", cast: ["puppy", "owl"],
      expr: { puppy: "worried", owl: "serious" },
      text: "前面輕鬆，是因為本金還在。後面每個月會跳上去。" },
    { id: "pmt-card", scene: 3, type: "card", card: "f2", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第二張卡：月付用本息平均算，寬限期結束後會變高。" },

    { id: "t1-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "surprised" },
      text: "寬限期 ==5 年==，先只繳利息，超輕鬆！" },
    { id: "t1-q", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t1",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「寬限期 5 年，先只繳利息，超輕鬆。」這句呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "😌", text: "沒問題，前面少付錢就比較輕鬆", hint: "這幾年本金有沒有減少？寬限結束後，月付會怎樣？" }
      ],
      skip: { resume: "t2-fox", text: "正解：!!這是陷阱!!。寬限期幾乎不還本金，月付之後會跳高，而且要在更短的時間裡把本金攤完。這題跳過，不加經驗值。" } },
    { id: "t1-ex", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。寬限期幾乎不還**本金**。結束以後，月付會跳高，還要在剩下的年限裡把本金攤完。" },

    { id: "t2-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "thinking" },
      text: "代書費、契稅這些小錢，不用算啦。" },
    { id: "t2-q", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t2",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「代書費、契稅這些小錢不用算。」呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "🪙", text: "沒問題，跟頭期款比起來很小", hint: "每一筆看起來不大，加起來常常是總價的幾個百分點。" }
      ],
      skip: { resume: "t3-fox", text: "正解：!!這是陷阱!!。契稅、印花稅、代書費、仲介費和貸款費用要另外準備，粗抓常常是總價再加幾個百分點。這題跳過，不加經驗值。" } },
    { id: "t2-ex", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。這些錢要另外準備。粗抓常常是總價再加幾個百分點，實際金額以試算為準，不能當小錢忽略。" },

    { id: "t3-fox", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "smug", puppy: "worried" },
      text: "月付抓薪水的一半，沒問題啦！" },
    { id: "t3-q", scene: 4, type: "choice", speaker: "owl", cast: ["puppy", "owl"], qid: "t3",
      expr: { owl: "serious", puppy: "thinking" },
      text: "「月付抓薪水一半沒問題。」這句呢？",
      choices: [
        { icon: "⚠️", text: "這是陷阱", correct: true },
        { icon: "💪", text: "沒問題，賺多少付一半很正常", hint: "生活費、保險、修繕都還在。常用的建議是月付抓在薪水的多少以內？" }
      ],
      skip: { resume: "t-panic", text: "正解：!!這是陷阱!!。常用的建議是房貸月付不超過收入的大約三分之一，一半通常太緊。這題跳過，不加經驗值。" } },
    { id: "t3-ex", scene: 4, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "worried" },
      text: "!!陷阱!!。常用的建議是房貸月付不超過收入的大約 ==三分之一==。抓到一半，生活費和修繕會很緊。" },
    { id: "t-panic", scene: 4, type: "say", speaker: "fox", cast: ["puppy", "fox"],
      expr: { fox: "panic", puppy: "worried" },
      text: "我是先讓數字看起來輕鬆一點…" },

    { id: "budget-intro", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "smile", puppy: "thinking" },
      text: "來試算。月收入 ==90,000 元==（範例）。先把房貸月付抓在薪水的 ==三分之一==。" },
    { id: "budget", scene: 5, type: "budget", speaker: "owl", cast: ["puppy", "owl"], qid: "qBudget",
      expr: { owl: "smile", puppy: "thinking" },
      income: 90000,
      start: 45000,
      min: 15000,
      max: 60000,
      step: 5000,
      text: "把滑桿調到三分之一的上限，再按試算。",
      skip: { card: "f3", resume: "budget-ok", text: "正解：月付上限 ==30,000 元==。年利率 2%、30 年、本息平均，可貸 ==8,116,455 元==。頭期款兩成且估價等於成交價時，總價約 ==10,145,569 元==。這題跳過，不加經驗值。" } },
    { id: "budget-ok", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "==30,000 元==是 ==90,000 元==的三分之一。年利率 ==2%==、==30 年==、本息平均，大約可以貸 ==8,116,455 元==。" },
    { id: "budget-price", scene: 5, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "serious", puppy: "thinking" },
      text: "如果頭期款準備兩成，而且銀行估價等於成交價，總價大約 ==10,145,569 元==，頭期款約 ==2,029,114 元==。估價如果比較低，能買的總價還要再降。" },
    { id: "budget-card", scene: 5, type: "card", card: "f3", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第三張卡：先定月付上限，再回推可以貸多少、買多少。" },

    { id: "sum1", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "今天三句。第一，**頭期款**看銀行**估價**和成數，稅費要另外留。" },
    { id: "sum2", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "thinking" },
      text: "第二，**本息平均**每期付一樣的錢。**寬限期**只繳利息，結束後月付會跳高。" },
    { id: "sum3", scene: 6, type: "say", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" },
      text: "第三，月付常用的建議是不超過薪水的大約 ==三分之一==，再回推貸得起的總價。" },
    { id: "end", scene: 6, type: "end", speaker: "owl", cast: ["puppy", "owl"],
      expr: { owl: "praise", puppy: "happy" } }
  ]
};
