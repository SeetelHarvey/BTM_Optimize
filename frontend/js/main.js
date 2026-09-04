/* BTM Optimize SPA — import / bill / charts / settings */

const I18N = {
  "zh-TW": {
    nav: {
      items: { import: "匯入", charts: "視覺化", dashboard: "電費試算", simulate: "模擬試算", settings: "設定" },
      language: "語言",
      languageToggle: "切換語言",
    },
    dashboard: {
      title: "電費試算",
      empty: "尚無電費結果",
      overageNone: "無超約",
      basic: "基本電費",
      overage: "超約",
      energy: "流動電費",
      total: "合計",
      annual: "年化（粗估）",
      months: "月明細",
      monthCol: "月份",
      subtotal: "小計",
      breakdown: "電費結構",
      amount: "金額",
      peakKw: "最高需量",
      ceilingKw: "上限",
      x2: "2 倍超約",
      x3: "3 倍超約",
      kwhCol: "kWh",
      price: "電價",
      season: "季節",
      splitMonth: "5／10 月",
      period: "時段",
      item: "項目",
      kw: "kW",
      loading: "電費計算中…",
      component: {
        regular: "經常契約",
        half_peak: "半尖峰契約",
        saturday_off_peak: "週六＋離峰",
        non_summer: "非夏月契約",
      },
    },
    charts: {
      title: "視覺化",
      loading: "圖表計算中…",
      heatmap: "熱力圖",
      boxplot: "箱型圖",
      line: "折線圖",
      peak: "日最高",
      mean: "日平均",
      seasonAll: "全部",
      dayAll: "全部",
      weekday: "平日",
      holiday: "假日",
    },
    import: {
      title: "資料匯入",
      upload: "本機上傳",
      sample: "範例檔",
      loadSample: "載入",
      expired: "資料逾期，請重新匯入",
      needReselect: "重新整理後無法沿用原檔，請再選一次檔案後匯入。",
      currentTitle: "當前資料",
      currentLive: "有效",
      currentExpired: "已逾期",
      currentRows: "{n} 列",
      start: "開始日",
      end: "結束日",
      contracts: "契約容量",
      range: "區間／方案",
      bill: "匯入",
      rebill: "重算電費",
      clear: "清除資料",
      cleared: "已清除匯入資料",
      needFile: "請先選檔",
      needDates: "請先有開始／結束日（選檔會自動偵測）",
      needSchema: "契約欄位尚未載入",
    },
    settings: {
      title: "設定",
      load: "重新載入系統預設",
      energy: "流動電價（元／kWh）",
      demand: "基本電費單價（元／kW）",
      na: "不適用",
      summerRange: "夏月區間",
      schedule: "時段時間軸",
      shared: "通用",
      holidays: "假日",
      addHoliday: "新增假日",
      season: "季節",
      day: "日類型",
      summer: "夏月",
      nonSummer: "非夏月",
      startMonth: "起始月",
      startDay: "起始日",
      endMonth: "結束月",
      endDay: "結束日",
      period: {
        peak: "尖峰",
        half_peak: "半尖峰",
        saturday_half_peak: "週六半尖峰",
        off_peak: "離峰",
      },
      demandKey: {
        base_prices: "經常契約",
        non_summer_base_prices: "非夏月契約",
        half_peak_base_prices: "半尖峰契約",
        saturday_base_prices: "週六半尖峰契約",
        off_peak_base_prices: "離峰契約",
      },
    },
    fields: {
      regular_kw: "經常契約",
      half_peak_kw: "半尖峰契約",
      non_summer_kw: "非夏月契約",
      saturday_half_peak_kw: "週六半尖峰",
      off_peak_kw: "離峰契約",
    },
    simulate: {
      title: "模擬試算",
      functions: "功能選擇（可複選）",
      demand: "契約容量",
      tou: "時間電價",
      reserve: "即時備轉",
      backup: "緊急備援",
      backupReserveKwh: "保留電量（kWh）",
      backupReserveHint: "從可調度能量扣減；少數案場選用",
      largeUser: "用電大戶",
      run: "開始試算",
      simRerun: "重新試算",
      simClearResult: "清除結果",
      simRunningKeep: "配置組合試算中…（保留上次報告）",
      simResultStale: "參數或契約已變更，報告可能與目前設定不符，請重新試算。",
      simResultSummary: "上次試算",
      simLastRunRerun: "重新試算中，以下為先前結果",
      simLastRunCleared: "已清除以下試算報告",
      simLastRunDismiss: "關閉",
      simCleared: "已清除試算報告",
      simParams: "試算參數",
      loading: "匯入資料中…",
      simErr: "試算失敗",
      simSavings: "預估節省（元）",
      simSkipped: "略過功能",
      simPcs: "PCS（kW）",
      simBatt: "Battery（kWh）",
      simHours: "時數（h）",
      simReport: "試算報告",
      simKpiBefore: "無儲能電費",
      simKpiAfter: "建議配置電費",
      simKpiSave: "節省",
      simKpiSavePct: "節省率",
      simKpiSize: "建議 PCS / 電池",
      simSizingRunning: "配置組合試算中…",
      simSampleRunning: "計算樣本中…",
      simSample: "負載樣本",
      simPeakLoad: "尖峰負載 kW",
      simOffMargin: "離峰裕度 kW",
      simPcsSeed: "PCS 樣本 kW",
      simPeakEssUtil: "尖峰儲能使用率",
      simPeakCoverage: "尖峰負載覆蓋率",
      simPeakEssUtilHint: "PCS 在尖峰被用到多少：mean(min(尖峰需量÷PCS, 1))×100%，上限 100%。需量常大於 PCS → 接近滿載。",
      simPeakCoverageHint: "PCS 能蓋住多少尖峰：mean(min(PCS÷尖峰需量, 1))×100%，上限 100%。PCS 偏小 → 覆蓋率低。",
      simSampleMeta: "試算 {pts} 組配置 · 夏月尖峰 {h} h",
      simSampleMetaTwoCycle: " · 兩充兩放 2～{h2} h",
      simTwoCycle: "兩充兩放",
      simFullCover: "全覆蓋",
      simMaxPeakKw: "尖峰最大需量",
      simMaxDayPeakKwh: "單日尖峰最大電量",
      simHalfPeakNs: "非夏半尖峰",
      simMidOffMargin: "日中離峰裕度",
      simPcsResult: "PCS 樣本",
      simSampleBasis: "取樣依據",
      simStatMax: "最大",
      simStatAvg: "平均",
      simStatMin: "最小",
      simGridResults: "配置組合試算",
      simBillCompare: "電費對照",
      simViewPanel: "配置檢視",
      simViewRec: "推薦",
      simViewMaxSave: "金額最大",
      simViewMaxUtil: "使用率最大",
      simTagBest: "最大節省",
      simNoViable: "配置組合內無正向節省；以下為虧損最少參考，非建議裝置。",
      simSavingsChart: "節省曲線（依 PCS）",
      simPcsUtil: "PCS 使用率",
      simPcsDailyAvg: "PCS日均使用率",
      simDailyCycle: "SOC日循環",
      simGridLegendRec: "推薦",
      simGridLegendSave: "金額最大",
      simGridLegendUtil: "使用率最大",
      simDispatchCharts: "調度曲線",
      simDispatchFilterHourly: "時均圖",
      simDispatchFilterHourlyHint: "SOC、功率、日趨勢；箱型圖亦受季節／日類型影響",
      simDispatchFilterDist: "熱力／箱型序列",
      simDispatchFilterDistHint: "僅下方熱力圖與箱型圖",
      simDispatchDailyHint: "全試算期間",
      simDispatchLoading: "載入調度圖…",
      simDispatchHourlySoc: "時均 SOC",
      simDispatchHourlyPower: "時均功率",
      simDispatchDaily: "日趨勢",
      simDispatchHeatmap: "熱力圖",
      simDispatchBoxplot: "箱型圖",
      simDispatchLoad: "原始負載",
      simDispatchEss: "儲能功率",
      simDispatchNet: "淨負載",
      simDispatchSoc: "SOC",
      simDispatchMetric: "序列",
      simChartHours: "電池時數（h）",
      simChartSavings: "節省（元）",
      simAfterBill: "含儲能電費",
      simFns: "啟用功能",
      batterySoc: "電池",
      socMin: "SOC 下限（%）",
      socMax: "SOC 上限（%）",
      chargeEff: "充放電效率（%）",
      demandBufferKw: "裕度預留（kW）",
      demandBufferHint: "大於 0 即啟用需量控制；併網硬上限＝契約上限 − 裕度（含充電）",
      offPeakContractBoost: "離峰契約調整",
      offPeakBoostApplied: "離峰調整 +{kw} kW",
      offPeakBoostSkipped: "離峰調整未套用",
      antiExportKw: "負載預留（kW）",
      antiExportHint: "不逆送",
      gridReserve: "用電預留",
      fnHint: "時間電價固定；勾選其他功能可展開設定。",
      scheduleMode: "排程設定",
      scheduleAuto: "自動",
      scheduleManual: "手動",
      touTargetSoc: "目標 SOC（%）",
      reserveBidMw: "投標量體（MW）",
      reserveMaxLabel: "投標上限",
      reserveNoContract: "尚未填寫經常契約",
      summer: "夏月",
      nonSummer: "非夏月",
      weekday: "平日",
      saturday: "週六",
      sunday: "週日",
      largeUserRatio: "義務比例",
      largeUserMinKw: "適用判定",
      largeUserApplies: "適用",
      largeUserExempt: "不適用",
      largeUserPowerRatio: "運轉功率下限",
      largeUserOblKw: "義務裝置容量",
      largeUserNoContract: "尚未填寫經常契約",
    },
    common: { voltage: "電壓", tou: "方案", needImport: "請先匯入資料", goImport: "去匯入" },
  },
  en: {
    nav: {
      items: { import: "Import", charts: "Charts", dashboard: "Bill estimate", simulate: "Sizing", settings: "Settings" },
      language: "Language",
      languageToggle: "Toggle language",
    },
    dashboard: {
      title: "Bill estimate",
      empty: "No bill yet",
      overageNone: "No overage",
      basic: "Basic",
      overage: "Overage",
      energy: "Energy",
      total: "Total",
      annual: "Annualized",
      months: "Monthly bills",
      monthCol: "Month",
      subtotal: "Subtotal",
      breakdown: "Bill structure",
      amount: "Amount",
      peakKw: "Demand",
      ceilingKw: "Ceiling",
      x2: "2×",
      x3: "3×",
      kwhCol: "kWh",
      price: "Rate",
      season: "Season",
      splitMonth: "May / Oct",
      period: "Period",
      item: "Item",
      kw: "kW",
      loading: "Calculating bill…",
      component: {
        regular: "Regular",
        half_peak: "Half-peak",
        saturday_off_peak: "Sat + off-peak",
        non_summer: "Non-summer",
      },
    },
    charts: {
      title: "Charts",
      loading: "Building charts…",
      heatmap: "Heatmap",
      boxplot: "Box plot",
      line: "Line",
      peak: "Daily peak",
      mean: "Daily mean",
      seasonAll: "All",
      dayAll: "All",
      weekday: "Weekday",
      holiday: "Holiday",
    },
    import: {
      title: "Import data",
      upload: "Upload",
      sample: "Sample",
      loadSample: "Load",
      expired: "Data expired. Please import again.",
      needReselect: "The file is not kept after refresh. Select it again, then import.",
      currentTitle: "Current data",
      currentLive: "Active",
      currentExpired: "Expired",
      currentRows: "{n} rows",
      start: "Start",
      end: "End",
      contracts: "Contract kW",
      range: "Range / plan",
      bill: "Import",
      rebill: "Recalculate bill",
      clear: "Clear import",
      cleared: "Import cleared",
      needFile: "Select a file first",
      needDates: "Need start / end (auto-detected on file select)",
      needSchema: "Contract schema not loaded",
    },
    settings: {
      title: "Settings",
      load: "Reload defaults",
      energy: "Energy price (NT$/kWh)",
      demand: "Demand rate (NT$/kW)",
      na: "N/A",
      summerRange: "Summer range",
      schedule: "TOU timeline",
      shared: "Shared",
      holidays: "Holidays",
      addHoliday: "Add holiday",
      season: "Season",
      day: "Day type",
      summer: "Summer",
      nonSummer: "Non-summer",
      startMonth: "Start month",
      startDay: "Start day",
      endMonth: "End month",
      endDay: "End day",
      period: {
        peak: "Peak",
        half_peak: "Half-peak",
        saturday_half_peak: "Saturday half-peak",
        off_peak: "Off-peak",
      },
      demandKey: {
        base_prices: "Regular",
        non_summer_base_prices: "Non-summer",
        half_peak_base_prices: "Half-peak",
        saturday_base_prices: "Saturday half-peak",
        off_peak_base_prices: "Off-peak",
      },
    },
    fields: {
      regular_kw: "Regular",
      half_peak_kw: "Half-peak",
      non_summer_kw: "Non-summer",
      saturday_half_peak_kw: "Saturday half-peak",
      off_peak_kw: "Off-peak",
    },
    simulate: {
      title: "Sizing simulation",
      functions: "Functions (multi-select)",
      demand: "Demand shaving",
      tou: "TOU arbitrage",
      reserve: "Ancillary service",
      backup: "Emergency backup",
      backupReserveKwh: "Reserved energy (kWh)",
      backupReserveHint: "Deducted from dispatchable energy; optional",
      largeUser: "Large user obligation",
      run: "Run simulation",
      simRerun: "Run again",
      simClearResult: "Clear report",
      simRunningKeep: "Running… (keeping previous report)",
      simResultStale: "Settings changed — report may be outdated. Run again to refresh.",
      simResultSummary: "Last run",
      simLastRunRerun: "Re-running — previous result below",
      simLastRunCleared: "Cleared report shown below",
      simLastRunDismiss: "Dismiss",
      simCleared: "Simulation report cleared",
      simParams: "Sizing params",
      loading: "Importing…",
      simErr: "Simulation failed",
      simSavings: "Est. savings",
      simSkipped: "Skipped",
      simPcs: "PCS (kW)",
      simBatt: "Battery (kWh)",
      simHours: "Hours (h)",
      simReport: "Sizing report",
      simKpiBefore: "Bill without BESS",
      simKpiAfter: "Bill at recommended size",
      simKpiSave: "Savings",
      simKpiSavePct: "Savings %",
      simKpiSize: "Recommended PCS / battery",
      simSizingRunning: "Running combination trials…",
      simSampleRunning: "Computing sample…",
      simSample: "Load sample",
      simPeakLoad: "Peak load kW",
      simOffMargin: "Off-peak headroom kW",
      simPcsSeed: "PCS sample kW",
      simPeakEssUtil: "Peak ESS utilization",
      simPeakCoverage: "Peak load coverage",
      simPeakEssUtilHint: "How hard the PCS works at peak: mean(min(peak kW÷PCS, 1))×100%, capped at 100%. Load often above PCS → near full.",
      simPeakCoverageHint: "How much peak load the PCS can cover: mean(min(PCS÷peak kW, 1))×100%, capped at 100%. Small PCS → low coverage.",
      simSampleMeta: "{pts} combinations · summer peak {h} h",
      simSampleMetaTwoCycle: " · two-cycle 2–{h2} h",
      simTwoCycle: "Two-cycle",
      simFullCover: "Full cover",
      simMaxPeakKw: "Max peak demand",
      simMaxDayPeakKwh: "Max daily peak energy",
      simHalfPeakNs: "Non-summer half-peak",
      simMidOffMargin: "Midday off-peak headroom",
      simPcsResult: "PCS sample",
      simSampleBasis: "Sizing basis",
      simStatMax: "Max",
      simStatAvg: "Avg",
      simStatMin: "Min",
      simGridResults: "Combination trials",
      simBillCompare: "Bill comparison",
      simViewPanel: "Configuration view",
      simViewRec: "Recommended",
      simViewMaxSave: "Max savings",
      simViewMaxUtil: "Max utilization",
      simTagBest: "Max savings",
      simNoViable: "No positive savings in combinations; least-loss reference only — not a sizing recommendation.",
      simSavingsChart: "Savings curves (by PCS)",
      simPcsUtil: "PCS utilization",
      simPcsDailyAvg: "PCS daily avg util",
      simDailyCycle: "SOC daily cycle",
      simGridLegendRec: "Recommended",
      simGridLegendSave: "Max savings",
      simGridLegendUtil: "Max utilization",
      simDispatchCharts: "Dispatch curves",
      simDispatchFilterHourly: "Hourly charts",
      simDispatchFilterHourlyHint: "SOC, power, daily; box plot season/day",
      simDispatchFilterDist: "Heatmap / box series",
      simDispatchFilterDistHint: "Lower heatmap & box plot only",
      simDispatchDailyHint: "Full trial period",
      simDispatchLoading: "Loading dispatch charts…",
      simDispatchHourlySoc: "Hourly mean SOC",
      simDispatchHourlyPower: "Hourly mean power",
      simDispatchDaily: "Daily trend",
      simDispatchHeatmap: "Heatmap",
      simDispatchBoxplot: "Box plot",
      simDispatchLoad: "Original load",
      simDispatchEss: "ESS power",
      simDispatchNet: "Net load",
      simDispatchSoc: "SOC",
      simDispatchMetric: "Series",
      simChartHours: "Battery hours (h)",
      simChartSavings: "Savings",
      simAfterBill: "With BESS",
      simFns: "Functions",
      batterySoc: "Battery",
      socMin: "SOC min (%)",
      socMax: "SOC max (%)",
      chargeEff: "Charge/discharge efficiency (%)",
      demandBufferKw: "Headroom (kW)",
      demandBufferHint: "A value above 0 enables demand control; grid cap = ceiling − headroom (incl. charge).",
      offPeakContractBoost: "Off-peak contract boost",
      offPeakBoostApplied: "Off-peak +{kw} kW",
      offPeakBoostSkipped: "Off-peak boost not applied",
      antiExportKw: "Load reserve (kW)",
      antiExportHint: "No reverse export",
      gridReserve: "Site reserve",
      fnHint: "TOU is always on; check other functions to unlock their tab.",
      scheduleMode: "Schedule",
      scheduleAuto: "Auto",
      scheduleManual: "Manual",
      touTargetSoc: "Target SOC (%)",
      reserveBidMw: "Bid quantity (MW)",
      reserveMaxLabel: "Bid max",
      reserveNoContract: "No regular contract",
      summer: "Summer",
      nonSummer: "Non-summer",
      weekday: "Weekday",
      saturday: "Saturday",
      sunday: "Sunday",
      largeUserRatio: "Obligation ratio",
      largeUserMinKw: "Eligibility",
      largeUserApplies: "Applies",
      largeUserExempt: "Not applicable",
      largeUserPowerRatio: "Min avg power ratio",
      largeUserOblKw: "Obligation capacity",
      largeUserNoContract: "No regular contract",
    },
    common: { voltage: "Voltage", tou: "TOU", needImport: "Import data first", goImport: "Go to import" },
  },
};

const LOCALE_KEY = "btm_optimize-locale";
const SESSION_KEY = "btm_optimize-session-v3";
const ROUTES = { DASHBOARD: "dashboard", CHARTS: "charts", IMPORT: "import", SIMULATE: "simulate", SETTINGS: "settings" };

let locale = localStorage.getItem(LOCALE_KEY) === "en" ? "en" : "zh-TW";
let currentRoute = null;
let renderGeneration = 0;

const TOU_OPTIONS = ["TwoStage", "ThreeStage", "BatchStage"];

function defaultTouSlots(touType) {
  // null＝維持 SOC（對齊 auto HOLD）；有數字才是絕對目標 %
  return Array(touSlotCount(touType)).fill(null);
}

function defaultReserveHourly() {
  // Manual reserve bid defaults to 0; max is applied as an input constraint.
  // 即時備轉固定 1 小時一格。
  return Array(24).fill(0);
}

function activeSimulateTou() {
  try {
    const t = session.simulate && session.simulate.simulateTou;
    if (TOU_OPTIONS.includes(t)) return t;
    if (TOU_OPTIONS.includes(session.tou)) return session.tou;
  } catch { /* session 尚未就緒 */ }
  return "ThreeStage";
}

function touStepMinutes(touType) {
  try {
    const step = Number(scheduleStep(touType != null ? touType : activeSimulateTou())) || 60;
    return step === 30 ? 30 : 60;
  } catch {
    return 60;
  }
}

function touSlotCount(touType) {
  return Math.round((24 * 60) / touStepMinutes(touType));
}

function cloneHourly(hours) {
  return hours.slice();
}

function makeDayMatrix(factory) {
  const weekday = factory();
  const saturday = factory();
  const sunday = factory();
  return { weekday: cloneHourly(weekday), saturday: cloneHourly(saturday), sunday: cloneHourly(sunday) };
}

function makeSeasonMatrix(factory) {
  return { summer: makeDayMatrix(factory), non_summer: makeDayMatrix(factory) };
}

/** 對齊 step 槽數；長度不符則重設為預設。 */
function ensureSlots(arr, n, fill) {
  if (Array.isArray(arr) && arr.length === n) return arr.slice();
  return Array(n).fill(fill);
}

function normalizeScheduleMatrix(raw, factory) {
  const sample = factory();
  const n = sample.length;
  const fill = sample[0];
  const base = makeSeasonMatrix(factory);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return base;
  for (const season of ["summer", "non_summer"]) {
    const src = raw[season] || {};
    for (const day of ["weekday", "saturday", "sunday"]) {
      base[season][day] = ensureSlots(src[day], n, fill);
    }
  }
  return base;
}

const LARGE_USER_MIN_KW = 5000; // 用電大戶法規門檻（經常契約）

let simulateDefaults = {};

function clamp01(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : fallback;
}

function activeEnergyPrices(season) {
  const v = session.voltage;
  const tou = session.tou;
  if (!session.rates || !v || !tou) return null;
  const row = session.rates[v] && session.rates[v][tou];
  return row && row.prices && row.prices[season] ? row.prices[season] : null;
}

/** 價差是否蓋過 η² 往返損耗（對齊後端 worth_arbitrage）。 */
function worthArbitrage(pHi, pLo, chargeEff) {
  const hi = Number(pHi);
  const lo = Number(pLo);
  const eta = Number(chargeEff);
  if (!(hi > 0) || !(lo > 0) || !(eta > 0)) return false;
  return hi / lo >= 1 / (eta * eta);
}

/** 時段地圖：同日下一個不同時段，或跨日首段。 */
function nextPeriodInMap(map, season, day, slot) {
  if (!map || !map[season] || !map[season][day]) return null;
  const row = map[season][day];
  const cur = row[slot];
  for (let j = slot + 1; j < row.length; j++) {
    if (row[j] != null && row[j] !== cur) return row[j];
  }
  const nextDay = { weekday: "weekday", saturday: "sunday", sunday: "weekday" }[day];
  const nrow = (map[season] && map[season][nextDay]) || [];
  for (let j = 0; j < nrow.length; j++) {
    if (nrow[j] != null) return nrow[j];
  }
  return null;
}

/**
 * auto／手動種子目標 SOC%：
 * 最高→0、最低→100（須過效率門檻）；中價僅當下一相鄰時段更貴且過門檻→100；否則 null=維持。
 */
function targetSocPct(season, period, nextPeriod, chargeEff) {
  if (period == null || season == null) return null;
  const seasonPrices = activeEnergyPrices(season);
  if (!seasonPrices || seasonPrices[period] == null) return null;
  const vals = Object.values(seasonPrices).map(Number).filter((n) => Number.isFinite(n));
  if (!vals.length) return null;
  const pMin = Math.min(...vals);
  const pMax = Math.max(...vals);
  if (pMax <= pMin) return null;
  const eta = chargeEff != null ? Number(chargeEff) : Number(session.simulate && session.simulate.chargeEff) || 0.85;
  const price = Number(seasonPrices[period]);
  if (price >= pMax) return worthArbitrage(pMax, pMin, eta) ? 0 : null;
  if (price <= pMin) return worthArbitrage(pMax, pMin, eta) ? 100 : null;
  if (!nextPeriod || seasonPrices[nextPeriod] == null) return null;
  const nextPrice = Number(seasonPrices[nextPeriod]);
  if (nextPrice > price && worthArbitrage(nextPrice, price, eta)) return 100;
  return null;
}

function baseSimulateTemplate() {
  const d = simulateDefaults || {};
  const tou = TOU_OPTIONS.includes(d.simulateTou) ? d.simulateTou : "ThreeStage";
  return {
    functions: ["tou"],
    detailTab: "tou",
    ...d,
    simulateTou: tou,
    touSchedule: makeSeasonMatrix(() => defaultTouSlots(tou)),
    reserveSchedule: makeSeasonMatrix(defaultReserveHourly),
    seededImportKey: "",
  };
}

function pctDisplay(v) {
  // session 0–1 → 表單 %
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 1000) / 10 : 0;
}

function normalizeSimulate(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const base = baseSimulateTemplate();
  const sim = { ...base };
  for (const key of Object.keys(base)) {
    if (Object.prototype.hasOwnProperty.call(src, key)) sim[key] = src[key];
  }
  const opts = (sim.functions || []).filter((f) => f !== "tou");
  sim.functions = ["tou", ...opts];
  if (!TOU_OPTIONS.includes(sim.simulateTou)) sim.simulateTou = base.simulateTou;
  sim.touSchedule = normalizeScheduleMatrix(sim.touSchedule, () => defaultTouSlots(sim.simulateTou));
  sim.reserveSchedule = normalizeScheduleMatrix(sim.reserveSchedule, defaultReserveHourly);
  sim.chargeEff = Math.max(0.5, Math.min(1, clamp01(sim.chargeEff, 0.85)));
  let lo = clamp01(sim.socMin, 0.1);
  let hi = clamp01(sim.socMax, 0.9);
  if (lo > hi) [lo, hi] = [hi, lo];
  sim.socMin = lo;
  sim.socMax = hi;
  sim.autoAdjustOffPeakContract = !!sim.autoAdjustOffPeakContract;
  sim.backupReserveKwh = Math.max(0, Number(sim.backupReserveKwh) || 0);
  if (!["auto", "manual"].includes(sim.touScheduleMode)) sim.touScheduleMode = "auto";
  if (!["auto", "manual"].includes(sim.reserveScheduleMode)) sim.reserveScheduleMode = "auto";
  return sim;
}

const session = {
  file: null,
  fileLabel: "",
  start: "",
  end: "",
  voltage: "HV",
  tou: "ThreeStage",
  schemas: null,
  contractValues: {},
  rates: null,
  schedule: null,
  holidays: null,
  lastBill: null,
  lastSimulateSize: null,
  lastSimulateSample: null,
  simulateError: null,
  simulateResultKey: null,
  lastCharts: null,
  samples: [],
  importId: null,
  importRowCount: null,
  simulate: normalizeSimulate({}),
  _hadPersistedSimulate: false,
  _simulateDefaultsReady: false,
};

function persistSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      fileLabel: session.fileLabel,
      start: session.start,
      end: session.end,
      voltage: session.voltage,
      tou: session.tou,
      contractValues: session.contractValues,
      rates: session.rates,
      schedule: session.schedule,
      holidays: session.holidays,
      lastBill: session.lastBill,
      lastCharts: session.lastCharts,
      lastSimulateSize: session.lastSimulateSize,
      lastSimulateSample: session.lastSimulateSample,
      simulateError: session.simulateError,
      simulateResultKey: session.simulateResultKey,
      importId: session.importId,
      importRowCount: session.importRowCount,
      simulate: session.simulate,
    }));
  } catch { /* quota */ }
}

function restoreSession() {
  try {
    const data = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (!data || typeof data !== "object") return;
    session._hadPersistedSimulate = !!(data.simulate && typeof data.simulate === "object");
    Object.assign(session, data);
    session.file = null;
    session._simulateDefaultsReady = false;
    session.simulate = normalizeSimulate(session.simulate);
    session.lastSimulateSize = normalizeSimulateSizeResult(session.lastSimulateSize);
    session.importRowCount = session.importRowCount != null ? Number(session.importRowCount) : null;
    if (normalizeSimulateSizeResult(session.lastSimulateSize) && !session.simulateResultKey) {
      session.simulateResultKey = simulateRunKey();
    }
  } catch { /* ignore */ }
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function t(key, params = {}) {
  let text = getByPath(I18N[locale], key);
  if (text == null) text = getByPath(I18N.en, key);
  if (typeof text !== "string") return key;
  return text.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`));
}

function parseRoute(pathname = location.pathname) {
  const raw = pathname.replace(/^\//, "").split("/")[0];
  if (Object.values(ROUTES).includes(raw)) return raw;
  return ROUTES.IMPORT;
}

function routeUrl(route) {
  return "/" + route;
}

function syncUrl(route, replace) {
  const url = routeUrl(route);
  if (location.pathname === url && !location.hash) return;
  if (replace) history.replaceState(null, "", url);
  else history.pushState(null, "", url);
}

function go(route, options = {}) {
  syncUrl(route, !!options.replace);
  renderPage(options);
}

function fmt(n, digits = 0) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString(locale === "en" ? "en-US" : "zh-TW", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function periodLabel(p) {
  const k = "settings.period." + p;
  const v = t(k);
  return v === k ? p : v;
}

function seasonLabel(s) {
  if (!s) return "—";
  if (s === "summer") return t("settings.summer");
  if (s === "non_summer") return t("settings.nonSummer");
  if (s === "split") return t("dashboard.splitMonth");
  return s;
}

function componentLabel(c) {
  const k = "dashboard.component." + c;
  const v = t(k);
  return v === k ? c : v;
}

function detailMessage(data, fallback) {
  const d = data && data.detail;
  if (typeof d === "string") return d;
  if (d != null) return JSON.stringify(d);
  return fallback || "error";
}

async function apiJson(url, opts) {
  const r = await fetch(url, opts);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = detailMessage(data, r.status + " " + r.statusText);
    if (r.status === 404 && msg === "import not found") {
      markImportGone();
      throw new Error(t("import.expired"));
    }
    throw new Error(msg);
  }
  return data;
}

function markImportGone() {
  const hadLive = !!session.importId;
  session.importId = null;
  session.importRowCount = null;
  if (hadLive) resetImportFormDefaults();
  persistSession();
}

function resetImportFormDefaults() {
  /** 暫存失效：匯入表單還原；結果頁仍可用 fileLabel 標示來源。 */
  session.file = null;
  session.start = "";
  session.end = "";
  session.contractValues = {};
  if (session.simulate) session.simulate.seededImportKey = "";
}

async function probeImport() {
  if (!session.importId) return;
  try {
    const st = await apiJson("/api/import/" + encodeURIComponent(session.importId));
    session.importRowCount = st.row_count;
  } catch {
    /* 404 已 markImportGone；其餘維持現況等使用者操作時再失敗 */
  }
}

function redirectImportExpired() {
  session._importNotice = t("import.expired");
  if (parseRoute() === ROUTES.IMPORT) {
    renderPage({ animate: false, preserveScroll: true });
  } else {
    go(ROUTES.IMPORT, { animate: true });
  }
}

function requireLiveImportOrRedirect() {
  if (session.importId) return true;
  redirectImportExpired();
  return false;
}

function isImportExpiredError(err) {
  return String(err && err.message ? err.message : err) === t("import.expired");
}

/** 清除本次匯入結果（前端 session + 後端暫存）；保留已選檔與契約欄位。 */
async function clearImportedData() {
  const iid = session.importId;
  billJob += 1;
  chartsJob += 1;
  billFetch = null;
  chartsFetch = null;
  session.importId = null;
  session.importRowCount = null;
  session.lastBill = null;
  session.lastSimulateSize = null;
  session.lastSimulateSample = null;
  session.simulateError = null;
  session.simulateResultKey = null;
  session.lastCharts = null;
  session.billError = null;
  session.chartsError = null;
  simulateJob += 1;
  simulateFetch = null;
  simulateSampleFetch = null;
  simPinnedRun = null;
  simDismissedSnapshot = null;
  simDispatchChartKey = null;
  simViewMode = "recommended";
  simDispatchChartCache = {};
  simDispatchChartPending = {};
  simDispatchCacheResultKey = null;
  simDispatchChartLoadId += 1;
  Object.assign(simDispatchFilter, {
    season: "all",
    day: "weekday",
    heatmap: "net_kw",
  });
  if (session.simulate) session.simulate.seededImportKey = "";
  persistSession();
  if (iid) {
    try {
      await apiJson("/api/import/" + encodeURIComponent(iid), { method: "DELETE" });
    } catch { /* 過期／已刪都當清乾淨 */ }
  }
}

function appendOverrides(fd) {
  if (session.rates) fd.append("rates", JSON.stringify(session.rates));
  if (session.schedule) fd.append("schedule", JSON.stringify(session.schedule));
  if (session.holidays) fd.append("holidays", JSON.stringify(session.holidays));
}

function currentSchema() {
  return session.schemas && session.schemas[session.tou];
}

function readFormCommon() {
  const start = document.getElementById("start");
  const end = document.getElementById("end");
  const voltage = document.getElementById("voltage");
  const tou = document.getElementById("tou");
  if (start) session.start = start.value;
  if (end) session.end = end.value;
  if (voltage) session.voltage = voltage.value;
  if (tou) session.tou = tou.value;
}

function updateSidebarI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
  document.getElementById("lang-zh").classList.toggle("lang-active", locale === "zh-TW");
  document.getElementById("lang-en").classList.toggle("lang-active", locale === "en");
}

function setActiveNav(route) {
  document.querySelectorAll(".nav-item[data-route]").forEach((el) => {
    el.classList.toggle("nav-active", el.getAttribute("data-route") === route);
  });
}

function bindSidebar() {
  const sidebar = document.getElementById("sidebar");
  let timer = null;
  sidebar.addEventListener("mouseenter", () => {
    if (timer) clearTimeout(timer);
    sidebar.classList.add("sidebar-expanded");
  });
  sidebar.addEventListener("mouseleave", () => {
    timer = setTimeout(() => sidebar.classList.remove("sidebar-expanded"), 150);
  });
  document.getElementById("lang-toggle").addEventListener("click", () => {
    locale = locale === "en" ? "zh-TW" : "en";
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale === "en" ? "en" : "zh-Hant";
    updateSidebarI18n();
    renderPage({ animate: false, preserveScroll: true });
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(a.href, location.origin);
    if (url.origin !== location.origin) return;
    if (url.pathname.startsWith("/api/")) return;
    const route = parseRoute(url.pathname);
    e.preventDefault();
    go(route, { animate: true });
  });
}

function headerHtml(titleKey, extra = "", descKey = "") {
  return `<header class="btm-header hud-panel hud-frame">
    <h1 class="btm-header__title">${t(titleKey)}</h1>
    ${descKey ? `<p class="btm-header__desc">${t(descKey)}</p>` : ""}
    ${extra ? `<div class="btm-header__extra">${extra}</div>` : ""}
  </header>`;
}


/** 各頁共用：請先匯入資料 */
function emptyImportHtml({ message, err = false, id = "" } = {}) {
  const idAttr = id ? ` id="${id}"` : "";
  const expired = !session.importId && !!session.fileLabel;
  const msg = message || (expired ? t("import.expired") : t("common.needImport"));
  return `<section class="btm-card hud-panel hud-frame empty-import"${idAttr}>
    <div class="empty-import__icon" aria-hidden="true"><i class="fa-solid fa-file-import"></i></div>
    <p class="empty-import__text${err || expired ? " btm-meta--err" : ""}">${msg}</p>
    <div class="empty-import__action">
      <a class="btm-btn btm-btn--primary" href="/import">${t("common.goImport")}</a>
    </div>
  </section>`;
}

/** 計算中區塊（與電費／圖表／調度同一套） */
function busyBlockHtml(msg) {
  return `<div class="page-busy page-busy--inline" role="status" aria-live="polite">
    <div class="page-busy__icon" aria-hidden="true"><i class="fa-solid fa-spinner fa-spin"></i></div>
    <p class="page-busy__text">${msg}</p>
  </div>`;
}

/** 整頁計算中 */
function pageBusyHtml(titleKey, msgKey) {
  return `<div class="btm-page">
    ${headerHtml(titleKey)}
    <section class="btm-card hud-panel hud-frame page-busy" role="status" aria-live="polite">
      <div class="page-busy__icon" aria-hidden="true"><i class="fa-solid fa-spinner fa-spin"></i></div>
      <p class="page-busy__text">${t(msgKey)}</p>
    </section>
  </div>`;
}

/** 各頁共用：有進行中的請求就擋住舊結果，避免以為沒變／失敗 */
function routeBusyHtml(route) {
  if (route === ROUTES.DASHBOARD && billFetch) {
    return pageBusyHtml("dashboard.title", "dashboard.loading");
  }
  if (route === ROUTES.CHARTS && (chartsFetch || (billFetch && !session.lastCharts))) {
    return pageBusyHtml("charts.title", "charts.loading");
  }
  if (route === ROUTES.SIMULATE && billFetch && !session.importId) {
    return pageBusyHtml("simulate.title", "simulate.loading");
  }
  return null;
}

function metaChipsHtml() {
  const src = session.lastBill || session.lastCharts || {};
  const dates = src.start_date && src.end_date
    ? `${src.start_date} ~ ${src.end_date}`
    : (session.start && session.end ? `${session.start} ~ ${session.end}` : "");
  const fileChip = session.fileLabel
    ? (session.importId
      ? `<span class="btm-chip btm-chip--on btm-chip--file"><span class="btm-chip__dot" aria-hidden="true"></span>${session.fileLabel}</span>`
      : `<span class="btm-chip btm-chip--file">${session.fileLabel}</span>`)
    : "";
  return `<div class="dash-chips">
      ${fileChip}
      ${dates ? `<span class="btm-chip">${dates}</span>` : ""}
      <span class="btm-chip">${session.voltage} / ${session.tou}</span>
    </div>`;
}

function importCurrentCardHtml() {
  const live = !!session.importId;
  const hasSnapshot = !!(
    session.lastBill
    || session.lastCharts
    || normalizeSimulateSizeResult(session.lastSimulateSize)
  );
  const expired = !live && !!session.fileLabel && hasSnapshot;
  if (!live && !expired) return "";

  const src = session.lastBill || session.lastCharts || {};
  const start = src.start_date || session.start || "";
  const end = src.end_date || session.end || "";
  const dates = start && end ? `${start} ~ ${end}` : "";
  const rows = live && session.importRowCount != null
    ? `<span class="btm-chip">${t("import.currentRows", { n: session.importRowCount })}</span>`
    : "";
  const status = live
    ? `<span class="btm-chip btm-chip--on btm-chip--file"><span class="btm-chip__dot" aria-hidden="true"></span>${t("import.currentLive")}</span>`
    : `<span class="btm-chip">${t("import.currentExpired")}</span>`;

  return `<section class="btm-card hud-panel hud-frame import-current${expired ? " import-current--expired" : ""}">
    <h2 class="btm-card__title seetel-title">${t("import.currentTitle")}</h2>
    <div class="dash-chips import-current__chips">
      ${status}
      ${session.fileLabel ? `<span class="btm-chip${live ? " btm-chip--on" : ""}">${session.fileLabel}</span>` : ""}
      ${dates ? `<span class="btm-chip">${dates}</span>` : ""}
      <span class="btm-chip">${session.voltage} / ${session.tou}</span>
      ${rows}
    </div>
    ${expired ? `<p class="btm-meta btm-meta--err">${t("import.expired")}</p>` : ""}
  </section>`;
}

function planSelectsHtml() {
  return `<label class="ts-field"><span class="ts-field__label">${t("common.voltage")}</span>
      <select class="ts-select" id="voltage">
        <option ${session.voltage === "HV" ? "selected" : ""}>HV</option>
        <option ${session.voltage === "EHV" ? "selected" : ""}>EHV</option>
      </select></label>
    <label class="ts-field"><span class="ts-field__label">${t("common.tou")}</span>
      <select class="ts-select" id="tou">
        <option ${session.tou === "TwoStage" ? "selected" : ""}>TwoStage</option>
        <option ${session.tou === "ThreeStage" ? "selected" : ""}>ThreeStage</option>
        <option ${session.tou === "BatchStage" ? "selected" : ""}>BatchStage</option>
      </select></label>`;
}

function contractFieldsHtml() {
  const schema = currentSchema();
  if (!schema) return `<p class="btm-meta--err">${t("import.needSchema")}</p>`;
  return schema.fields
    .map((f) => {
      const v = session.contractValues[f] ?? 0;
      return `<label class="ts-field" data-field="${f}"><span class="ts-field__label">${t("fields." + f)}</span>
        <input class="ts-input" type="number" id="kw-${f}" min="0" step="1" value="${v}"></label>`;
    })
    .join("");
}

function billMonthsHtml(bill) {
  if (!bill || !bill.months || !bill.months.length) return "";
  const rows = bill.months
    .map((m) => {
      const basic = m.basic_total != null ? m.basic_total : m.total;
      const over = (m.overage && m.overage.total) || 0;
      const energy = (m.energy && m.energy.total) || 0;
      const sub = m.bill_total != null ? m.bill_total : Number(basic) + Number(over) + Number(energy);
      return `<tr>
        <td>${m.month}</td>
        <td class="num">${fmt(basic)}</td>
        <td class="num">${fmt(over)}</td>
        <td class="num">${fmt(energy)}</td>
        <td class="num">${fmt(sub)}</td>
      </tr>`;
    })
    .join("");
  return `<div class="btm-table-wrap btm-table-wrap--tall">
    <table class="btm-table btm-table--dash">
      <thead><tr>
        <th>${t("dashboard.monthCol")}</th>
        <th class="num">${t("dashboard.basic")}</th>
        <th class="num">${t("dashboard.overage")}</th>
        <th class="num">${t("dashboard.energy")}</th>
        <th class="num">${t("dashboard.subtotal")}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td class="btm-table__subtotal-label">${t("dashboard.total")}</td>
        <td class="num">${fmt(bill.basic_total)}</td>
        <td class="num">${fmt(bill.overage_total)}</td>
        <td class="num">${fmt(bill.energy_total)}</td>
        <td class="num"><b>${fmt(bill.total)}</b></td>
      </tr></tfoot>
    </table>
  </div>`;
}

function tierKw(row, multiplier) {
  const hit = (row.tiers || []).find((x) => Number(x.multiplier) === multiplier);
  return hit && hit.kw != null ? hit.kw : null;
}

/** 帳單區間涵蓋日數（含首尾）；用於年化。 */
function billSpanDays(bill) {
  const a = (bill && bill.start_date) || session.start;
  const b = (bill && bill.end_date) || session.end;
  if (!a || !b) return null;
  const t0 = Date.parse(a);
  const t1 = Date.parse(b);
  if (!Number.isFinite(t0) || !Number.isFinite(t1) || t1 < t0) return null;
  return Math.round((t1 - t0) / 86400000) + 1;
}

// 年化用日數線性放大（365/days）；季節／尖峰結構不重算。要更準再改成按月加總×12。
function annualizeAmount(amount, days) {
  if (!days || days <= 0) return null;
  return Math.round((Number(amount) || 0) * 365 / days);
}

function dashKpiHtml(label, amount, days, extraClass = "") {
  const ann = annualizeAmount(amount, days);
  const annualLine = ann == null
    ? ""
    : `<div class="dash-kpi__annual"><span>${t("dashboard.annual")}</span> <strong>${fmt(ann)}</strong></div>`;
  return `<article class="dash-kpi hud-panel hud-frame${extraClass}">
    <div class="dash-kpi__label">${label}</div>
    <div class="dash-kpi__value">${fmt(amount)}</div>
    ${annualLine}
  </article>`;
}

function fmtPrice(row) {
  const price = row.rate != null ? row.rate
    : row.base_rate != null ? row.base_rate
    : row.price != null ? row.price
    : row.avg_price;
  return fmt(price, 2);
}

function basicRowsFromBill(bill) {
  const fromSummary = (bill.summary && bill.summary.basic) || [];
  if (fromSummary.length) return fromSummary;
  const by = {};
  for (const m of bill.months || []) {
    for (const line of m.lines || []) {
      const c = line.component;
      if (!by[c]) {
        by[c] = {
          component: c,
          kw: line.kw,
          contract_kw: line.contract_kw,
          amount: 0,
        };
      }
      by[c].amount += Number(line.amount) || 0;
    }
  }
  return Object.values(by);
}

function isOverageRow(row) {
  return Number(row.billed_over_kw) > 0 || Number(row.amount) > 0;
}

function overageRowsFromBill(bill) {
  const out = [];
  for (const m of bill.months || []) {
    for (const row of (m.overage && m.overage.periods) || []) {
      if (!isOverageRow(row)) continue;
      out.push({ month: m.month, ...row });
    }
  }
  if (out.length) return out;
  return ((bill.summary && bill.summary.overage) || []).filter(isOverageRow);
}

function billSummaryHtml(bill) {
  const summary = bill.summary || {};
  const basic = basicRowsFromBill(bill);
  const overage = overageRowsFromBill(bill);
  const energy = summary.energy || [];

  const basicRows = basic
    .map(
      (row) => `<tr>
        <td>${componentLabel(row.component)}</td>
        <td class="num">${fmt(row.kw != null ? row.kw : row.contract_kw, 1)}</td>
        <td class="num">${fmt(row.amount)}</td>
      </tr>`
    )
    .join("");
  const overRows = overage
    .map(
      (row) => `<tr>
        <td>${row.month || ""}</td>
        <td>${periodLabel(row.period)}</td>
        <td class="num">${fmt(row.peak_kw, 1)}</td>
        <td class="num">${fmt(row.ceiling_kw, 1)}</td>
        <td class="num">${fmtPrice(row)}</td>
        <td class="num">${fmt(tierKw(row, 2), 1)}</td>
        <td class="num">${fmt(tierKw(row, 3), 1)}</td>
        <td class="num">${fmt(row.amount)}</td>
      </tr>`
    )
    .join("");
  const energyRows = energy
    .map(
      (row) => `<tr>
        <td>${seasonLabel(row.season)}</td>
        <td>${periodLabel(row.period)}</td>
        <td class="num">${fmt(row.kwh, 1)}</td>
        <td class="num">${fmtPrice(row)}</td>
        <td class="num">${fmt(row.amount)}</td>
      </tr>`
    )
    .join("");

  const overageBlock = overRows
    ? `<div class="btm-table-wrap btm-table-wrap--tall">
      <table class="btm-table btm-table--dash">
        <thead><tr>
          <th>${t("dashboard.monthCol")}</th>
          <th>${t("dashboard.period")}</th>
          <th class="num">${t("dashboard.peakKw")}</th>
          <th class="num">${t("dashboard.ceilingKw")}</th>
          <th class="num">${t("dashboard.price")}</th>
          <th class="num">${t("dashboard.x2")}</th>
          <th class="num">${t("dashboard.x3")}</th>
          <th class="num">${t("dashboard.amount")}</th>
        </tr></thead>
        <tbody>${overRows}</tbody>
        <tfoot><tr>
          <td colspan="7" class="num btm-table__subtotal-label">${t("dashboard.total")}</td>
          <td class="num"><b>${fmt(bill.overage_total)}</b></td>
        </tr></tfoot>
      </table>
    </div>`
    : `<p class="btm-empty">${t("dashboard.overageNone")}</p>`;

  return `<section class="btm-card hud-panel hud-frame dash-breakdown">
    <h2 class="btm-card__title seetel-title">${t("dashboard.breakdown")}</h2>
    <h3 class="btm-section-title">${t("dashboard.basic")}</h3>
    <div class="btm-table-wrap btm-table-wrap--tall">
      <table class="btm-table btm-table--dash">
        <thead><tr>
          <th>${t("dashboard.item")}</th>
          <th class="num">${t("dashboard.kw")}</th>
          <th class="num">${t("dashboard.amount")}</th>
        </tr></thead>
        <tbody>${basicRows || `<tr><td colspan="3">${t("dashboard.empty")}</td></tr>`}</tbody>
        <tfoot><tr>
          <td colspan="2" class="num btm-table__subtotal-label">${t("dashboard.total")}</td>
          <td class="num"><b>${fmt(bill.basic_total)}</b></td>
        </tr></tfoot>
      </table>
    </div>
    <h3 class="btm-section-title">${t("dashboard.overage")}</h3>
    ${overageBlock}
    <h3 class="btm-section-title">${t("dashboard.energy")}</h3>
    <div class="btm-table-wrap btm-table-wrap--tall">
      <table class="btm-table btm-table--dash">
        <thead><tr>
          <th>${t("dashboard.season")}</th>
          <th>${t("dashboard.period")}</th>
          <th class="num">${t("dashboard.kwhCol")}</th>
          <th class="num">${t("dashboard.price")}</th>
          <th class="num">${t("dashboard.amount")}</th>
        </tr></thead>
        <tbody>${energyRows || `<tr><td colspan="5">${t("dashboard.empty")}</td></tr>`}</tbody>
        <tfoot><tr>
          <td colspan="2" class="num btm-table__subtotal-label">${t("dashboard.total")}</td>
          <td class="num">${fmt(bill.energy_kwh, 1)}</td>
          <td></td>
          <td class="num"><b>${fmt(bill.energy_total)}</b></td>
        </tr></tfoot>
      </table>
    </div>
  </section>`;
}

function renderDashboard() {
  const busy = routeBusyHtml(ROUTES.DASHBOARD);
  if (busy) return busy;
  const bill = session.lastBill;
  if (!bill) {
    return `<div class="btm-page">
      ${headerHtml("dashboard.title")}
      ${emptyImportHtml({
        message: session.billError || undefined,
        err: !!session.billError,
      })}
    </div>`;
  }
  const days = billSpanDays(bill);
  return `<div class="btm-page">
    ${headerHtml("dashboard.title", metaChipsHtml())}
    <div class="dash-kpis">
      ${dashKpiHtml(t("dashboard.basic"), bill.basic_total, days)}
      ${dashKpiHtml(t("dashboard.overage"), bill.overage_total, days, " dash-kpi--overage")}
      ${dashKpiHtml(t("dashboard.energy"), bill.energy_total, days, " dash-kpi--energy")}
      ${dashKpiHtml(t("dashboard.total"), bill.total, days, " dash-kpi--total")}
    </div>
    ${billSummaryHtml(bill)}
    <section class="btm-card hud-panel hud-frame">
      <h2 class="btm-card__title seetel-title">${t("dashboard.months")}</h2>
      ${billMonthsHtml(bill)}
    </section>
  </div>`;
}

const chartFilter = { season: "all", day: "all" };
let echartsHandles = [];
let simSavingsChart = null;
let simDispatchCharts = [];
let simDispatchChartKey = null;
let simViewMode = "recommended";
let simDispatchChartCache = {};
let simDispatchChartPending = {};
let simDispatchCacheResultKey = null;
let simDispatchChartLoadId = 0;
const simDispatchFilter = { season: "all", day: "weekday", heatmap: "net_kw" };
let simChartResize = null;
let chartsResize = null;
let boxChart = null;
let chartsFetch = null;
let chartsJob = 0;
let billFetch = null;
let billJob = 0;
let simulateFetch = null;
let simulateSampleFetch = null;
let simulateJob = 0;
/** 重新試算進行中：凍結的上一筆摘要（不寫入 sessionStorage） */
let simPinnedRun = null;
/** 清除結果後短暫顯示的摘要卡 */
let simDismissedSnapshot = null;

function chartsFormData() {
  const fd = new FormData();
  fd.append("import_id", session.importId);
  return fd;
}

function fetchCharts(replace) {
  if (!session.importId) return Promise.resolve(null);
  if (chartsFetch && !replace) return chartsFetch;
  const id = ++chartsJob;
  chartsFetch = apiJson("/api/charts", { method: "POST", body: chartsFormData() })
    .then((data) => {
      if (id !== chartsJob) return data;
      chartsFetch = null;
      session.lastCharts = data;
      persistSession();
      if (parseRoute() === ROUTES.CHARTS) renderPage({ animate: false, preserveScroll: true });
      return data;
    })
    .catch((err) => {
      if (id !== chartsJob) return null;
      chartsFetch = null;
      session.chartsError = String(err.message || err);
      if (parseRoute() === ROUTES.CHARTS) renderPage({ animate: false, preserveScroll: true });
      return null;
    })
    .finally(() => {
      if (id === chartsJob) chartsFetch = null;
    });
  return chartsFetch;
}

function disposeCharts() {
  if (chartsResize) {
    window.removeEventListener("resize", chartsResize);
    chartsResize = null;
  }
  if (simChartResize) {
    window.removeEventListener("resize", simChartResize);
    simChartResize = null;
  }
  for (const c of echartsHandles) {
    try { c.dispose(); } catch { /* ignore */ }
  }
  echartsHandles = [];
  if (simSavingsChart) {
    try { simSavingsChart.dispose(); } catch { /* ignore */ }
    simSavingsChart = null;
  }
  for (const c of simDispatchCharts) {
    try { c.dispose(); } catch { /* ignore */ }
  }
  simDispatchCharts = [];
  boxChart = null;
}

function renderCharts() {
  const busy = routeBusyHtml(ROUTES.CHARTS);
  if (busy) return busy;
  if (session.chartsError && !session.lastCharts) {
    return `<div class="btm-page">
      ${headerHtml("charts.title")}
      ${emptyImportHtml({ message: session.chartsError, err: true })}
    </div>`;
  }
  if (!session.lastCharts) {
    if (!session.importId) {
      return `<div class="btm-page">
        ${headerHtml("charts.title")}
        ${emptyImportHtml()}
      </div>`;
    }
    return pageBusyHtml("charts.title", "charts.loading");
  }
  const sea = chartFilter.season;
  const day = chartFilter.day;
  return `<div class="btm-page">
    ${headerHtml("charts.title", metaChipsHtml())}
    <section class="btm-card hud-panel hud-frame">
      <h2 class="btm-card__title seetel-title">${t("charts.heatmap")}</h2>
      <div class="dash-chart dash-chart--heatmap" id="chart-heatmap"></div>
    </section>
    <section class="btm-card hud-panel hud-frame">
      <div class="btm-section-row">
        <h2 class="btm-card__title seetel-title">${t("charts.boxplot")}</h2>
        <div class="chart-filters">
          <label class="ts-field"><span class="ts-field__label">${t("settings.season")}</span>
            <select class="ts-select" id="chartSeason">
              <option value="all" ${sea === "all" ? "selected" : ""}>${t("charts.seasonAll")}</option>
              <option value="summer" ${sea === "summer" ? "selected" : ""}>${t("settings.summer")}</option>
              <option value="non_summer" ${sea === "non_summer" ? "selected" : ""}>${t("settings.nonSummer")}</option>
            </select></label>
          <label class="ts-field"><span class="ts-field__label">${t("settings.day")}</span>
            <select class="ts-select" id="chartDay">
              <option value="all" ${day === "all" ? "selected" : ""}>${t("charts.dayAll")}</option>
              <option value="weekday" ${day === "weekday" ? "selected" : ""}>${t("charts.weekday")}</option>
              <option value="holiday" ${day === "holiday" ? "selected" : ""}>${t("charts.holiday")}</option>
            </select></label>
        </div>
      </div>
      <div class="dash-chart" id="chart-boxplot"></div>
    </section>
    <section class="btm-card hud-panel hud-frame">
      <h2 class="btm-card__title seetel-title">${t("charts.line")}</h2>
      <div class="dash-chart" id="chart-line"></div>
    </section>
  </div>`;
}

const CHART_AXIS = "#94a3b8";
const CHART_SPLIT = "rgba(255,255,255,0.12)";
const ECHART_NO_ANIM = { animation: false, animationDuration: 0, animationDurationUpdate: 0 };

function heatmapOption(data) {
  const hm = data.heatmap || {};
  const dates = hm.dates || [];
  const values = hm.values || [];
  const points = [];
  values.forEach((row, y) => {
    (row || []).forEach((v, x) => {
      if (v == null) return;
      points.push([x, y, v]);
    });
  });
  const slots = Array.from({ length: 96 }, (_, i) => {
    const h = String(Math.floor(i / 4)).padStart(2, "0");
    const m = String((i % 4) * 15).padStart(2, "0");
    return `${h}:${m}`;
  });
  const vmin = data.kW && data.kW.min != null ? Number(data.kW.min) : 0;
  const vmax = data.kW && data.kW.max != null ? Number(data.kW.max) : 1;
  return {
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    textStyle: { color: CHART_AXIS },
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        if (!p || !p.value) return "";
        const [x, y, v] = p.value;
        return `${dates[y] || ""} ${slots[x] || ""}<br/>${fmt(v, 1)} kW`;
      },
    },
    grid: { left: 88, right: 20, top: 12, bottom: 92 },
    xAxis: {
      type: "category",
      data: slots,
      axisLabel: { color: CHART_AXIS, interval: 7, fontSize: 10 },
      axisLine: { lineStyle: { color: CHART_SPLIT } },
      splitLine: { show: false },
    },
    yAxis: {
      type: "category",
      data: dates,
      inverse: true,
      axisLabel: { color: CHART_AXIS, fontSize: 10 },
      axisLine: { lineStyle: { color: CHART_SPLIT } },
      splitLine: { show: false },
    },
    visualMap: {
      min: vmin,
      max: vmax > vmin ? vmax : vmin + 1,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 4,
      itemWidth: 10,
      itemHeight: 220,
      textStyle: { color: CHART_AXIS },
      inRange: { color: ["#0b1c28", "#00d4ff", "#fbbf24", "#f87171"] },
    },
    series: [{ type: "heatmap", data: points }],
  };
}

function boxplotOption(data) {
  const bp = data.boxplot || {};
  const hours = bp.hours && bp.hours.length ? bp.hours : Array.from({ length: 24 }, (_, i) => i);
  const group = (((bp.groups || {})[chartFilter.season] || {})[chartFilter.day]) || {};
  const labels = [];
  const boxes = [];
  const outliers = [];
  hours.forEach((h) => {
    const s = group[h] || group[String(h)];
    if (!s) return;
    const hh = String(h).padStart(2, "0") + ":00";
    labels.push(hh);
    const lo = s.whisker_low != null ? s.whisker_low : s.min;
    const hi = s.whisker_high != null ? s.whisker_high : s.max;
    boxes.push({
      value: [lo, s.q1, s.median, s.q3, hi],
      itemStyle: { color: "transparent", borderColor: "#5eeaff", borderWidth: 2 },
    });
    for (const v of s.outliers || []) outliers.push([labels.length - 1, v]);
  });
  return {
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    textStyle: { color: CHART_AXIS },
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        if (p.seriesType === "scatter") {
          return `${p.name || labels[p.value[0]] || ""}<br/>${fmt(p.value[1], 1)} kW`;
        }
        const v = p && p.value;
        if (!v || !Array.isArray(v)) return (p && p.name) || "";
        const nums = v.length > 5 ? v.slice(1) : v;
        if (nums.length < 5) return p.name || "";
        return `${p.name}<br/>min ${fmt(nums[0], 1)}<br/>Q1 ${fmt(nums[1], 1)}<br/>median ${fmt(nums[2], 1)}<br/>Q3 ${fmt(nums[3], 1)}<br/>max ${fmt(nums[4], 1)}`;
      },
    },
    grid: { left: 64, right: 16, top: 16, bottom: 40 },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: CHART_AXIS, fontSize: 10, rotate: labels.length > 18 ? 40 : 0 },
      axisLine: { lineStyle: { color: CHART_SPLIT } },
    },
    yAxis: {
      type: "value",
      name: "kW",
      nameLocation: "middle",
      nameGap: 44,
      nameRotate: 90,
      nameTextStyle: { color: CHART_AXIS },
      axisLabel: { color: CHART_AXIS },
      splitLine: { lineStyle: { color: CHART_SPLIT } },
    },
    series: [
      { type: "boxplot", data: boxes },
      {
        type: "scatter",
        data: outliers,
        symbolSize: 6,
        itemStyle: { color: "#fbbf24" },
        tooltip: { trigger: "item" },
      },
    ],
  };
}

function lineOption(data) {
  const ln = data.line || {};
  const dates = ln.dates || [];
  const peak = ln.peak_kw || [];
  const mean = ln.mean_kw || [];
  const series = [
    {
      name: t("charts.peak"),
      type: "line",
      data: peak,
      showSymbol: dates.length <= 60,
      symbolSize: 4,
      lineStyle: { width: 2, color: "#5eeaff" },
      itemStyle: { color: "#5eeaff" },
    },
    {
      name: t("charts.mean"),
      type: "line",
      data: mean,
      showSymbol: dates.length <= 60,
      symbolSize: 4,
      lineStyle: { width: 2, color: "#34d399" },
      itemStyle: { color: "#34d399" },
    },
  ];
  return {
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    textStyle: { color: CHART_AXIS },
    legend: { textStyle: { color: CHART_AXIS }, top: 0 },
    tooltip: { trigger: "axis", confine: true },
    grid: { left: 52, right: 16, top: 36, bottom: 40 },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: { color: CHART_AXIS, fontSize: 10, hideOverlap: true },
      axisLine: { lineStyle: { color: CHART_SPLIT } },
    },
    yAxis: {
      type: "value",
      name: "kW",
      nameTextStyle: { color: CHART_AXIS },
      axisLabel: { color: CHART_AXIS },
      splitLine: { lineStyle: { color: CHART_SPLIT } },
    },
    series,
  };
}

function bindCharts() {
  if (!session.lastCharts && session.importId) fetchCharts();
  if (typeof echarts === "undefined" || !session.lastCharts) return;
  const data = session.lastCharts;
  const hmEl = document.getElementById("chart-heatmap");
  const boxEl = document.getElementById("chart-boxplot");
  const lineEl = document.getElementById("chart-line");
  if (!hmEl || !boxEl || !lineEl) return;

  const hm = echarts.init(hmEl);
  const box = echarts.init(boxEl);
  const line = echarts.init(lineEl);
  hm.setOption(heatmapOption(data));
  box.setOption(boxplotOption(data));
  line.setOption(lineOption(data));
  echartsHandles = [hm, box, line];
  boxChart = box;

  const seasonEl = document.getElementById("chartSeason");
  const dayEl = document.getElementById("chartDay");
  if (seasonEl) {
    seasonEl.onchange = () => {
      chartFilter.season = seasonEl.value;
      if (boxChart) boxChart.setOption(boxplotOption(data), true);
    };
  }
  if (dayEl) {
    dayEl.onchange = () => {
      chartFilter.day = dayEl.value;
      if (boxChart) boxChart.setOption(boxplotOption(data), true);
    };
  }

  chartsResize = () => { echartsHandles.forEach((c) => c.resize()); };
  window.addEventListener("resize", chartsResize);
}

function renderImport() {
  const samples = session.samples.map((f) => `<option value="${f}">${f}</option>`).join("");

  return `<div class="btm-page">
    ${headerHtml("import.title")}
    <section class="btm-card hud-panel hud-frame">
      <div class="clean-import">
        <div class="clean-import__col">
          <h3 class="btm-subhead">${t("import.upload")}</h3>
          <label class="ts-field">
            <input class="ts-input" type="file" id="upload" accept=".csv,.xlsx,.xls,.xlsm">
          </label>
        </div>
        <div class="clean-import__col">
          <h3 class="btm-subhead">${t("import.sample")}</h3>
          <div class="btm-row">
            <label class="ts-field">
              <select class="ts-select" id="sample"><option value="">--</option>${samples}</select>
            </label>
            <div class="ts-field ts-field--btn">
              <button type="button" class="btm-btn btm-btn--ghost" id="btnSample">${t("import.loadSample")}</button>
            </div>
          </div>
        </div>
      </div>
      <hr class="btm-rule">
      <h3 class="btm-subhead">${t("import.range")}</h3>
      <div class="btm-row">
        <label class="ts-field"><span class="ts-field__label">${t("import.start")}</span>
          <input class="ts-input" type="date" id="start" value="${session.start}"></label>
        <label class="ts-field"><span class="ts-field__label">${t("import.end")}</span>
          <input class="ts-input" type="date" id="end" value="${session.end}"></label>
        ${planSelectsHtml()}
      </div>
      <h3 class="btm-subhead">${t("import.contracts")}</h3>
      <div class="btm-row" id="contractFields">${contractFieldsHtml()}</div>
      <div class="btm-actions">
        ${session.importId
          ? `<button type="button" class="btm-btn btm-btn--ghost" id="btnClearImport"${billFetch ? " disabled" : ""}>${t("import.clear")}</button>
        <button type="button" class="btm-btn btm-btn--primary" id="btnRebill"${billFetch ? " disabled" : ""}>${t("import.rebill")}</button>`
          : `<button type="button" class="btm-btn btm-btn--primary" id="btnBill"${billFetch ? " disabled" : ""}>${t("import.bill")}</button>`}
      </div>
      <p class="btm-meta" id="runMeta"></p>
    </section>
    ${importCurrentCardHtml()}
  </div>`;
}

const PERIOD_COLORS = {
  peak: "#f87171",
  half_peak: "#fb923c",
  saturday_half_peak: "#fbbf24",
  off_peak: "#34d399",
};
const DEMAND_KEYS = [
  "base_prices",
  "non_summer_base_prices",
  "half_peak_base_prices",
  "saturday_base_prices",
  "off_peak_base_prices",
];
const DEMAND_CONTRACT_FIELD = {
  half_peak_base_prices: "half_peak_kw",
  non_summer_base_prices: "non_summer_kw",
};
const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

let timelineDrag = null;

function rateSlice() {
  if (!session.rates) return null;
  return session.rates[session.voltage] && session.rates[session.voltage][session.tou];
}

function energyPeriods() {
  return session.tou === "ThreeStage"
    ? ["peak", "half_peak", "saturday_half_peak", "off_peak"]
    : ["peak", "saturday_half_peak", "off_peak"];
}

function fmtHour(h) {
  const m = Math.round(Number(h) * 60);
  return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
}

function snapHour(h, stepMin) {
  const stepH = stepMin / 60;
  return Math.round(h / stepH) * stepH;
}

function slotsToState(slots) {
  if (!slots || !slots.length) return { bounds: [0, 24], periods: ["off_peak"] };
  const bounds = [slots[0].start];
  const periods = [];
  for (const s of slots) {
    periods.push(s.period);
    bounds.push(s.end);
  }
  return { bounds, periods };
}

function stateToSlots(bounds, periods) {
  return periods.map((period, i) => ({ start: bounds[i], end: bounds[i + 1], period }));
}

function scheduleStep(touType) {
  const key = touType || session.tou;
  try {
    const sch = session.schedule && session.schedule[key];
    return (sch && sch.step_minutes) || 60;
  } catch {
    return 60;
  }
}

function currentSlots() {
  const sch = session.schedule && session.schedule[session.tou];
  const season = document.getElementById("editSeason")?.value || "summer";
  const day = document.getElementById("editDay")?.value || "weekday";
  return sch && sch[season] && sch[season][day];
}

function writeCurrentSlots(slots) {
  if (!session.schedule) return;
  if (!session.schedule[session.tou]) session.schedule[session.tou] = { step_minutes: 60 };
  const season = document.getElementById("editSeason").value;
  const day = document.getElementById("editDay").value;
  if (!session.schedule[session.tou][season]) session.schedule[session.tou][season] = {};
  session.schedule[session.tou][season][day] = slots;
}

function energyCellHtml(prices, season, period) {
  const bag = prices[season];
  if (!bag || !Object.prototype.hasOwnProperty.call(bag, period)) {
    return `<td class="btm-na">${t("settings.na")}</td>`;
  }
  return `<td><input class="ts-input" type="number" step="0.01" min="0" data-energy="${period}" data-season="${season}" value="${bag[period]}"></td>`;
}

function energyTableHtml() {
  const slice = rateSlice();
  if (!slice) return `<p class="btm-meta">${t("settings.load")}</p>`;
  const prices = slice.prices || {};
  let html = `<table class="btm-table btm-edit-table"><thead><tr>
    <th></th><th>${t("settings.summer")}</th><th>${t("settings.nonSummer")}</th>
  </tr></thead><tbody>`;
  for (const p of energyPeriods()) {
    html += `<tr><th>${t("settings.period." + p)}</th>
      ${energyCellHtml(prices, "summer", p)}
      ${energyCellHtml(prices, "non_summer", p)}
    </tr>`;
  }
  return html + "</tbody></table>";
}

function demandKeyApplies(key) {
  const field = DEMAND_CONTRACT_FIELD[key];
  if (!field) return true;
  const schema = currentSchema();
  if (!schema) return true;
  return schema.fields.includes(field);
}

function demandCellHtml(key, season, row) {
  if (!demandKeyApplies(key)) {
    return `<td class="btm-na">${t("settings.na")}</td>`;
  }
  const v = row && row[season] != null ? row[season] : 0;
  return `<td><input class="ts-input" type="number" step="0.1" min="0" data-demand="${key}" data-season="${season}" value="${v}"></td>`;
}

function demandTableHtml() {
  const slice = rateSlice();
  if (!slice) return "";
  let html = `<table class="btm-table btm-edit-table"><thead><tr>
    <th></th><th>${t("settings.summer")}</th><th>${t("settings.nonSummer")}</th>
  </tr></thead><tbody>`;
  for (const key of DEMAND_KEYS) {
    const row = slice[key] || {};
    html += `<tr><th>${t("settings.demandKey." + key)}</th>
      ${demandCellHtml(key, "summer", row)}
      ${demandCellHtml(key, "non_summer", row)}
    </tr>`;
  }
  return html + "</tbody></table>";
}

function summerRangeHtml() {
  const r = (session.schedule && session.schedule.summer_range) || {};
  return `<div class="btm-row">
    <label class="ts-field"><span class="ts-field__label">${t("settings.startMonth")}</span>
      <input class="ts-input" type="number" min="1" max="12" id="sr-sm" value="${r.start_month || 5}"></label>
    <label class="ts-field"><span class="ts-field__label">${t("settings.startDay")}</span>
      <input class="ts-input" type="number" min="1" max="31" id="sr-sd" value="${r.start_day || 16}"></label>
    <label class="ts-field"><span class="ts-field__label">${t("settings.endMonth")}</span>
      <input class="ts-input" type="number" min="1" max="12" id="sr-em" value="${r.end_month || 10}"></label>
    <label class="ts-field"><span class="ts-field__label">${t("settings.endDay")}</span>
      <input class="ts-input" type="number" min="1" max="31" id="sr-ed" value="${r.end_day || 15}"></label>
  </div>`;
}

function holidayTableHtml() {
  const rows = session.holidays || [];
  let html = `<table class="btm-table btm-edit-table"><thead><tr>
    <th>date</th><th>name</th><th></th></tr></thead><tbody>`;
  rows.forEach((h, i) => {
    html += `<tr>
      <td><input class="ts-input" type="date" data-hol-date="${i}" value="${h.date || ""}"></td>
      <td><input class="ts-input" type="text" data-hol-name="${i}" value="${h.name || ""}"></td>
      <td><button type="button" class="btm-btn btm-btn--ghost" data-hol-del="${i}">×</button></td>
    </tr>`;
  });
  return html + "</tbody></table>";
}

function renderSettings() {
  return `<div class="btm-page">
    ${headerHtml("settings.title")}
    <section class="btm-card hud-panel hud-frame">
      <div class="btm-toolbar btm-toolbar--fill">
        ${planSelectsHtml()}
        <div class="ts-field ts-field--btn">
          <span class="ts-field__label">&nbsp;</span>
          <button type="button" class="btm-btn btm-btn--ghost" id="btnLoad">${t("settings.load")}</button>
            </div>
          </div>
    </section>
    <div class="btm-pair">
      <section class="btm-card hud-panel hud-frame">
        <h2 class="btm-card__title seetel-title">${t("settings.demand")}</h2>
        <div class="btm-table-wrap btm-table-wrap--tall">${demandTableHtml()}</div>
      </section>
      <section class="btm-card hud-panel hud-frame">
        <h2 class="btm-card__title seetel-title">${t("settings.energy")}</h2>
        <div class="btm-table-wrap btm-table-wrap--tall">${energyTableHtml()}</div>
      </section>
            </div>
    <section class="btm-card hud-panel hud-frame">
      <h2 class="btm-card__title seetel-title">${t("settings.schedule")}</h2>
      <div class="btm-toolbar">
        <label class="ts-field"><span class="ts-field__label">${t("settings.season")}</span>
          <select class="ts-select" id="editSeason">
            <option value="summer">${t("settings.summer")}</option>
            <option value="non_summer">${t("settings.nonSummer")}</option>
          </select></label>
        <label class="ts-field"><span class="ts-field__label">${t("settings.day")}</span>
          <select class="ts-select" id="editDay">
            <option value="weekday">weekday</option>
            <option value="saturday">saturday</option>
            <option value="sunday">sunday</option>
          </select></label>
          </div>
      <div class="btm-timeline" id="timeline"></div>
      <p class="btm-meta" id="timelineMeta"></p>
      <p class="btm-legend" id="matrixLegend"></p>
      <div id="matrix"></div>
    </section>
    <section class="btm-card hud-panel hud-frame">
      <h2 class="btm-card__title seetel-title">${t("settings.shared")}</h2>
      <h3 class="btm-section-title">${t("settings.summerRange")}</h3>
      ${summerRangeHtml()}
      <hr class="btm-rule" />
      <div class="btm-section-row">
        <h3 class="btm-section-title">${t("settings.holidays")}</h3>
        <button type="button" class="btm-btn btm-btn--ghost" id="btnAddHol">${t("settings.addHoliday")}</button>
        </div>
      <div class="btm-table-wrap">${holidayTableHtml()}</div>
    </section>
    </div>`;
}

async function detectDateRange() {
  const fd = new FormData();
  fd.append("file", session.file);
  return apiJson("/api/cleaning/filter-date", { method: "POST", body: fd });
}

function readContractInputs() {
  const schema = currentSchema();
  if (!schema) return;
  for (const f of schema.fields) {
    const el = document.getElementById("kw-" + f);
    if (el) session.contractValues[f] = Number(el.value || 0);
  }
  persistSession();
}

function bindPlanSelects(onChange) {
  const v = document.getElementById("voltage");
  const tou = document.getElementById("tou");
  if (v) {
    v.onchange = () => {
      session.voltage = v.value;
      onChange();
    };
  }
  if (tou) {
    tou.onchange = () => {
      session.tou = tou.value;
      onChange();
    };
  }
}

function setRunMeta(el, msg, err) {
  if (!el) return;
  el.textContent = msg || "";
  el.classList.toggle("btm-meta--err", !!err);
}

function bindImport() {
  const runMeta = document.getElementById("runMeta");
  if (session._importNotice) {
    setRunMeta(runMeta, session._importNotice, true);
    session._importNotice = null;
  }
  const fields = document.getElementById("contractFields");
  if (fields) {
    fields.addEventListener("change", readContractInputs);
    fields.addEventListener("input", readContractInputs);
  }
  bindPlanSelects(() => {
    readContractInputs();
    renderPage({ animate: false, preserveScroll: true });
  });

  async function afterFile(file, label) {
    session.file = file;
    session.fileLabel = label;
    await clearImportedData();
    try {
      const data = await detectDateRange();
      session.start = data.date_min;
      session.end = data.date_max;
      renderPage({ animate: false, preserveScroll: true });
    } catch (err) {
      setRunMeta(runMeta, String(err.message || err), true);
    }
  }

  document.getElementById("upload").onchange = (e) => {
    const f = e.target.files[0];
    if (f) afterFile(f, f.name);
  };
  document.getElementById("btnSample").onclick = async () => {
    const name = document.getElementById("sample").value;
    if (!name) return;
    try {
      const r = await fetch("/api/import/samples/" + encodeURIComponent(name));
      if (!r.ok) throw new Error("load failed");
      const blob = await r.blob();
      await afterFile(new File([blob], name), name);
    } catch (err) {
      setRunMeta(runMeta, String(err.message || err), true);
    }
  };
  const btnBill = document.getElementById("btnBill");
  if (btnBill) btnBill.onclick = async () => {
    readFormCommon();
    readContractInputs();
    if (!session.file) {
      setRunMeta(runMeta, session.fileLabel ? t("import.needReselect") : t("import.needFile"), true);
      return;
    }
    if (!session.start || !session.end) { setRunMeta(runMeta, t("import.needDates"), true); return; }
    const schema = currentSchema();
    if (!schema) { setRunMeta(runMeta, t("import.needSchema"), true); return; }
    const contracts = {};
    for (const f of schema.fields) contracts[f] = Number(session.contractValues[f] || 0);
    const fdRun = new FormData();
    fdRun.append("file", session.file);
    fdRun.append("voltage_level", session.voltage);
    fdRun.append("tou_type", session.tou);
    fdRun.append("start_date", session.start);
    fdRun.append("end_date", session.end);
    appendOverrides(fdRun);
    const id = ++billJob;
    session.billError = null;
    session.lastCharts = null;
    session.chartsError = null;
    session.importId = null;
    billFetch = apiJson("/api/import", { method: "POST", body: fdRun })
      .then((imported) => {
        if (id !== billJob) return null;
        session.importId = imported.import_id;
        session.importRowCount = imported.row_count;
        ensureSettingsLoaded().then(() => seedSimulateFromImport(true));
        fetchCharts(true);
        if (parseRoute() === ROUTES.CHARTS) {
          renderPage({ animate: false, preserveScroll: true });
        }
        const fdBill = new FormData();
        fdBill.append("import_id", imported.import_id);
        fdBill.append("contracts", JSON.stringify(contracts));
        appendOverrides(fdBill);
        return apiJson("/api/billing/basic", { method: "POST", body: fdBill });
      })
      .then((bill) => {
        if (!bill || id !== billJob) return;
        billFetch = null;
        session.lastBill = bill;
        persistSession();
        // 視覺化只等 charts；電費完成不要整頁重繪（會 dispose／重建 echarts）
        if (parseRoute() === ROUTES.DASHBOARD) {
          renderPage({ animate: false, preserveScroll: true });
        }
      })
      .catch((err) => {
        if (id !== billJob) return;
        billFetch = null;
        session.billError = String(err.message || err);
        if (parseRoute() === ROUTES.DASHBOARD) {
          renderPage({ animate: false, preserveScroll: true });
        } else if (parseRoute() !== ROUTES.CHARTS) {
          setRunMeta(document.getElementById("runMeta"), session.billError, true);
        }
      })
      .finally(() => {
        if (id === billJob) billFetch = null;
      });
    go(ROUTES.CHARTS);
  };

  const btnClear = document.getElementById("btnClearImport");
  if (btnClear) btnClear.onclick = async () => {
    btnClear.disabled = true;
    await clearImportedData();
    renderPage({ animate: false, preserveScroll: true });
    setRunMeta(document.getElementById("runMeta"), t("import.cleared"), false);
  };

  const btnRebill = document.getElementById("btnRebill");
  if (btnRebill) btnRebill.onclick = () => {
    const runMeta = document.getElementById("runMeta");
    if (!requireLiveImportOrRedirect()) return;
    readFormCommon();
    readContractInputs();
    const schema = currentSchema();
    if (!schema) { setRunMeta(runMeta, t("import.needSchema"), true); return; }
    const contracts = {};
    for (const f of schema.fields) contracts[f] = Number(session.contractValues[f] || 0);
    // 重算＝規格更新：依目前方案／step／時段重種功能排程（手動 TOU／備轉會被覆寫為預設）
    ensureSettingsLoaded().then(() => seedSimulateFromImport(true));
    const fdBill = new FormData();
    fdBill.append("import_id", session.importId);
    fdBill.append("contracts", JSON.stringify(contracts));
    appendOverrides(fdBill);
    const id = ++billJob;
    session.billError = null;
    billFetch = apiJson("/api/billing/basic", { method: "POST", body: fdBill })
      .then((bill) => {
        if (id !== billJob) return;
        billFetch = null;
        session.lastBill = bill;
        persistSession();
        if (parseRoute() === ROUTES.DASHBOARD) renderPage({ animate: false, preserveScroll: true });
      })
      .catch((err) => {
        if (id !== billJob) return;
        billFetch = null;
        session.billError = String(err.message || err);
        if (isImportExpiredError(err)) {
          redirectImportExpired();
          return;
        }
        if (parseRoute() === ROUTES.DASHBOARD) renderPage({ animate: false, preserveScroll: true });
        else setRunMeta(document.getElementById("runMeta"), session.billError, true);
      })
      .finally(() => {
        if (id === billJob) billFetch = null;
      });
    go(ROUTES.DASHBOARD);
  };
}

async function ensureSettingsLoaded(opts) {
  const reloadRates = !!(opts && opts.reloadRates);
  if (!reloadRates && session.rates && session.schedule && session._simulateDefaultsReady) {
    return true;
  }
  try {
    const data = await apiJson("/api/settings/defaults");
    if (reloadRates || !session.rates) session.rates = data.rates;
    if (reloadRates || !session.schedule) session.schedule = data.schedule;
    if (reloadRates || session.holidays == null) session.holidays = data.holidays;
    const needSimulateSeed = !session._simulateDefaultsReady;
    if (data.simulate && typeof data.simulate === "object") {
      simulateDefaults = data.simulate;
    }
    session._simulateDefaultsReady = true;
    // 僅首次灌入伺服器預設；設定頁重載電價不得清掉試算 input
    if (needSimulateSeed) {
      session.simulate = normalizeSimulate(
        session._hadPersistedSimulate ? session.simulate : {},
      );
    }
    return true;
  } catch {
    return false;
  }
}

function writeEnergyInput(el) {
  const slice = rateSlice();
  if (!slice) return;
  if (!slice.prices) slice.prices = {};
  const season = el.dataset.season;
  const period = el.dataset.energy;
  if (!slice.prices[season]) slice.prices[season] = {};
  const v = el.value.trim();
  if (v === "") delete slice.prices[season][period];
  else slice.prices[season][period] = Number(v);
}

function writeDemandInput(el) {
  const slice = rateSlice();
  if (!slice) return;
  const key = el.dataset.demand;
  if (!slice[key]) slice[key] = { summer: 0, non_summer: 0 };
  slice[key][el.dataset.season] = Number(el.value || 0);
}

function writeSummerRange() {
  if (!session.schedule) return;
  session.schedule.summer_range = {
    start_month: Number(document.getElementById("sr-sm").value || 5),
    start_day: Number(document.getElementById("sr-sd").value || 16),
    end_month: Number(document.getElementById("sr-em").value || 10),
    end_day: Number(document.getElementById("sr-ed").value || 15),
  };
}

function renderTimeline() {
  const box = document.getElementById("timeline");
  const meta = document.getElementById("timelineMeta");
  if (!box || !meta) return;
  box.innerHTML = "";
  const stepMin = scheduleStep();
  const state = slotsToState(currentSlots());
  const { bounds, periods } = state;
  const minGap = stepMin / 60;

  periods.forEach((period, i) => {
    const seg = document.createElement("div");
    seg.className = "btm-timeline__seg";
    seg.style.left = (bounds[i] / 24) * 100 + "%";
    seg.style.width = ((bounds[i + 1] - bounds[i]) / 24) * 100 + "%";
    seg.style.background = PERIOD_COLORS[period] || "#64748b";
    seg.textContent = t("settings.period." + period);
    seg.title = period + " [" + fmtHour(bounds[i]) + "–" + fmtHour(bounds[i + 1]) + ")";
    seg.onclick = () => {
      const cycle = energyPeriods();
      const next = cycle[(cycle.indexOf(periods[i]) + 1) % cycle.length] || cycle[0];
      periods[i] = next;
      writeCurrentSlots(stateToSlots(bounds, periods));
      renderTimeline();
      fetchPlanPreview();
    };
    box.appendChild(seg);
  });

  if (periods.length > 1) {
    for (let i = 1; i < bounds.length - 1; i++) {
      const handle = document.createElement("div");
      handle.className = "btm-timeline__handle";
      handle.style.left = (bounds[i] / 24) * 100 + "%";
      handle.title = fmtHour(bounds[i]);
      handle.onmousedown = (ev) => startTimelineDrag(ev, i, bounds, periods, stepMin, minGap);
      handle.ontouchstart = (ev) => startTimelineDrag(ev, i, bounds, periods, stepMin, minGap);
      box.appendChild(handle);
    }
  }

  for (let h = 0; h <= 24; h += 6) {
    const tick = document.createElement("div");
    tick.className = "btm-timeline__tick";
    tick.style.left = (h / 24) * 100 + "%";
    tick.textContent = fmtHour(h);
    box.appendChild(tick);
  }

  meta.textContent = bounds.map(fmtHour).join(" → ") + " · step " + stepMin + " min";
}

function startTimelineDrag(ev, idx, bounds, periods, stepMin, minGap) {
  ev.preventDefault();
  timelineDrag = {
    idx,
    bounds: bounds.slice(),
    periods: periods.slice(),
    stepMin,
    minGap,
    box: document.getElementById("timeline"),
  };
  document.addEventListener("mousemove", onTimelineDrag);
  document.addEventListener("mouseup", endTimelineDrag);
  document.addEventListener("touchmove", onTimelineDrag, { passive: false });
  document.addEventListener("touchend", endTimelineDrag);
}

function onTimelineDrag(ev) {
  if (!timelineDrag) return;
  ev.preventDefault();
  const rect = timelineDrag.box.getBoundingClientRect();
  const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
  let h = snapHour((x / rect.width) * 24, timelineDrag.stepMin);
  const i = timelineDrag.idx;
  h = Math.max(timelineDrag.bounds[i - 1] + timelineDrag.minGap, Math.min(timelineDrag.bounds[i + 1] - timelineDrag.minGap, h));
  timelineDrag.bounds[i] = Math.round(h * 1000) / 1000;
  writeCurrentSlots(stateToSlots(timelineDrag.bounds, timelineDrag.periods));
  renderTimeline();
}

function endTimelineDrag() {
  if (!timelineDrag) return;
  timelineDrag = null;
  document.removeEventListener("mousemove", onTimelineDrag);
  document.removeEventListener("mouseup", endTimelineDrag);
  document.removeEventListener("touchmove", onTimelineDrag);
  document.removeEventListener("touchend", endTimelineDrag);
  fetchPlanPreview();
  persistSession();
}

function slotRange(i, step) {
  const m0 = i * step;
  const m1 = (i + 1) * step;
  const fmt = (m) => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  return fmt(m0) + "–" + fmt(m1);
}

function renderMatrix(mat, step, season) {
  if (!mat || !mat.length) return "";
  const n = mat[0].length;
  const dense = n > 24;
  let html = `<h3 class="btm-matrix__title">${season}${step < 60 ? ` · ${step}′` : ""}</h3>
    <div class="btm-matrix-wrap${dense ? " btm-matrix-wrap--scroll" : ""}"><table class="btm-matrix${dense ? " btm-matrix--dense" : ""}"><thead><tr><th></th>`;
  for (let i = 0; i < n; i++) {
    html += `<th title="${slotRange(i, step)}">${fmtSimSlotHeader(i, step)}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (let d = 0; d < 7; d++) {
    html += `<tr><th>週${WEEKDAYS[d]}</th>`;
    for (let i = 0; i < mat[d].length; i++) {
      const p = mat[d][i];
      html += `<td style="background:${PERIOD_COLORS[p] || "#64748b"}" title="${p} · ${slotRange(i, step)}"></td>`;
    }
    html += "</tr>";
  }
  return html + "</tbody></table></div>";
}

async function fetchPlanPreview() {
  const legend = document.getElementById("matrixLegend");
  const matrix = document.getElementById("matrix");
  if (!session.rates || !session.schedule) return;
  try {
    const plan = await apiJson("/api/settings/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voltage: session.voltage,
        tou_type: session.tou,
        rates: session.rates,
        schedule: session.schedule,
        holidays: session.holidays,
      }),
    });
    if (legend) {
      legend.innerHTML = energyPeriods()
        .map((p) => `<span class="btm-chip" style="border-color:${PERIOD_COLORS[p]};color:${PERIOD_COLORS[p]}">${t("settings.period." + p)}</span>`)
        .join("");
    }
    if (matrix) {
      matrix.innerHTML =
        renderMatrix(plan.matrix.summer, plan.tou_slot_minutes, "summer") +
        renderMatrix(plan.matrix.non_summer, plan.tou_slot_minutes, "non_summer");
    }
  } catch {
    /* matrix stays empty */
  }
}

function bindSettings() {
  bindPlanSelects(() => renderPage({ animate: false, preserveScroll: true }));

  if (!session.rates) {
    ensureSettingsLoaded().then((ok) => {
      if (ok) renderPage({ animate: false, preserveScroll: true });
    });
    return;
  }

  document.getElementById("btnLoad").onclick = async () => {
    session.rates = session.schedule = session.holidays = null;
    const ok = await ensureSettingsLoaded({ reloadRates: true });
    if (!ok) return;
    renderPage({ animate: false, preserveScroll: true });
  };

  document.querySelectorAll("[data-energy]").forEach((el) => {
    el.addEventListener("change", () => { writeEnergyInput(el); fetchPlanPreview(); });
  });
  document.querySelectorAll("[data-demand]").forEach((el) => {
    el.addEventListener("change", () => writeDemandInput(el));
  });
  ["sr-sm", "sr-sd", "sr-em", "sr-ed"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", writeSummerRange);
  });
  document.querySelectorAll("[data-hol-date]").forEach((el) => {
    el.addEventListener("change", () => {
      const i = Number(el.dataset.holDate);
      if (session.holidays[i]) session.holidays[i].date = el.value;
    });
  });
  document.querySelectorAll("[data-hol-name]").forEach((el) => {
    el.addEventListener("change", () => {
      const i = Number(el.dataset.holName);
      if (session.holidays[i]) session.holidays[i].name = el.value;
    });
  });
  document.querySelectorAll("[data-hol-del]").forEach((el) => {
    el.addEventListener("click", () => {
      session.holidays.splice(Number(el.dataset.holDel), 1);
      renderPage({ animate: false, preserveScroll: true });
    });
  });
  const addHol = document.getElementById("btnAddHol");
  if (addHol) {
    addHol.onclick = () => {
      if (!session.holidays) session.holidays = [];
      session.holidays.push({ date: "", name: "" });
      renderPage({ animate: false, preserveScroll: true });
    };
  }

  document.getElementById("editSeason").onchange = () => { renderTimeline(); fetchPlanPreview(); };
  document.getElementById("editDay").onchange = () => { renderTimeline(); fetchPlanPreview(); };

  renderTimeline();
  fetchPlanPreview();
}

/* ── simulate page ── */

function simNumField(id, label, value, step, min, max, hint) {
  const maxAttr = max != null ? ` max="${max}"` : "";
  const tip = hint
    ? ` <i class="fa-solid fa-circle-question ts-tip" data-tip="${hint}" aria-label="${hint}"></i>`
    : "";
  return `<label class="ts-field"><span class="ts-field__label">${label}${tip}</span>
    <input class="ts-input" type="number" id="${id}" data-sim="${id}" min="${min}" step="${step}"${maxAttr} value="${value}"></label>`;
}

function simSelectField(id, label, value, options) {
  const opts = options.map(([v, t]) => `<option value="${v}"${v === value ? " selected" : ""}>${t}</option>`).join("");
  return `<label class="ts-field"><span class="ts-field__label">${label}</span>
    <select class="ts-select" id="${id}" data-sim="${id}">${opts}</select></label>`;
}

const BESS_OPTIONAL = [
  { id: "demand", icon: "fa-bolt" },
  { id: "reserve", icon: "fa-tower-broadcast" },
  { id: "backup", icon: "fa-shield-halved" },
  { id: "large_user", icon: "fa-building" },
];

function simMaxReserveBidMw() {
  const kw = Number(session.contractValues.regular_kw || 0);
  if (!(kw > 0)) return 0;
  // BTM 投標上限先用經常契約換算 MW；真正 PCS 上限等 sizing 後再收斂
  return Math.round((kw / 1000) * 10) / 10;
}

function seedTouScheduleFromPeriods(touType) {
  const tou = touType || activeSimulateTou();
  const step = touStepMinutes(tou);
  const map = buildPeriodMap(step, tou);
  if (!map) return makeSeasonMatrix(() => defaultTouSlots(tou));
  const eta = Number(session.simulate && session.simulate.chargeEff) || 0.85;
  const out = { summer: {}, non_summer: {} };
  const n = touSlotCount(tou);
  for (const season of ["summer", "non_summer"]) {
    out[season] = {};
    for (const day of ["weekday", "saturday", "sunday"]) {
      const row = (map[season] && map[season][day]) || Array(n).fill(null);
      out[season][day] = row.map((p, i) => {
        if (p == null) return null;
        const next = nextPeriodInMap(map, season, day, i);
        return targetSocPct(season, p, next, eta);
      });
    }
  }
  return out;
}

function simulateImportSeedKey() {
  return [
    session.importId || "",
    session.tou || "",
    session.contractValues.regular_kw || 0,
    session.schedule ? "sch" : "nosch",
    touStepMinutes(session.tou),
    Number(session.simulate && session.simulate.chargeEff) || 0.85,
  ].join("|");
}

function seedSimulateFromImport(force) {
  if (!session.importId) return;
  const sim = session.simulate;
  const key = simulateImportSeedKey();
  if (!force && sim.seededImportKey === key) return;
  sim.simulateTou = TOU_OPTIONS.includes(session.tou) ? session.tou : "ThreeStage";
  sim.touSchedule = seedTouScheduleFromPeriods(sim.simulateTou);
  sim.reserveSchedule = makeSeasonMatrix(defaultReserveHourly);
  sim.seededImportKey = key;
  persistSession();
}

/** 依匯入方案的 step／時段，把時段槽對到每個手動格。 */
function buildPeriodMap(stepMin, touType) {
  const tou = touType || activeSimulateTou();
  const sch = session.schedule && session.schedule[tou];
  if (!sch) return null;
  const step = stepMin || touStepMinutes(tou);
  const n = Math.round((24 * 60) / step);
  const map = {};
  for (const season of ["summer", "non_summer"]) {
    map[season] = {};
    for (const day of ["weekday", "saturday", "sunday"]) {
      const slots = (sch[season] && sch[season][day]) || [];
      const row = Array(n).fill(null);
      for (const slot of slots) {
        const startH = Number(slot.start) || 0;
        const endH = Number(slot.end) || 0;
        const i0 = Math.floor((startH * 60) / step);
        const i1 = Math.ceil((endH * 60) / step);
        for (let i = i0; i < i1 && i < n; i++) row[i] = slot.period;
      }
      map[season][day] = row;
    }
  }
  return map;
}

function fmtSimSlotHeader(i, stepMin) {
  if (stepMin >= 60) return String(i).padStart(2, "0");
  const m = i * stepMin;
  // 30 分：整點顯示時、半點顯示 30，避免 00:30 把欄位撐爆又擠扁
  if (m % 60 === 0) return String(Math.floor(m / 60)).padStart(2, "0");
  return "30";
}

function renderSimMatrix(schedKey, matrix, T, cfg) {
  const days = [
    ["weekday", T.weekday],
    ["saturday", T.saturday],
    ["sunday", T.sunday],
  ];
  const seasons = [
    ["summer", T.summer],
    ["non_summer", T.nonSummer],
  ];
  const maxAttr = cfg.max != null ? ` max="${cfg.max}"` : "";
  const minAttr = cfg.min != null ? ` min="${cfg.min}"` : "";
  const stepAttr = cfg.step != null ? ` step="${cfg.step}"` : "";
  const slotMin = cfg.slotMinutes != null ? cfg.slotMinutes : 60;
  const n = Math.round((24 * 60) / slotMin);
  const periodMap = buildPeriodMap(slotMin, cfg.touType || activeSimulateTou());
  const dense = n > 24;
  const denseCls = dense ? " sim-matrix--dense btm-matrix--dense" : "";

  return seasons.map(([season, seasonLab]) => {
    let html = `<h3 class="btm-matrix__title">${seasonLab} · ${cfg.header}${slotMin < 60 ? ` · ${slotMin}′` : ""}</h3>
      <div class="btm-matrix-wrap${dense ? " btm-matrix-wrap--scroll" : ""}"><table class="btm-matrix sim-matrix${denseCls}"><thead><tr><th></th>`;
    for (let i = 0; i < n; i++) {
      html += `<th title="${slotRange(i, slotMin)}">${fmtSimSlotHeader(i, slotMin)}</th>`;
    }
    html += "</tr></thead><tbody>";
    for (const [day, dayLab] of days) {
      const raw = (((matrix || {})[season] || {})[day]) || [];
      const fill = schedKey === "touSchedule" ? null : 0;
      const hours = ensureSlots(raw, n, fill);
      html += `<tr><th>${dayLab}</th>`;
      for (let i = 0; i < n; i++) {
        const period = periodMap && periodMap[season] && periodMap[season][day] && periodMap[season][day][i];
        const base = PERIOD_COLORS[period];
        const bg = base ? `style="background:${base}29"` : "";
        const cell = hours[i];
        const val = cell == null || cell === "" ? "" : cell;
        const ph = schedKey === "touSchedule" ? ` placeholder="—"` : "";
        html += `<td ${bg}><input class="sim-matrix__input" type="number" data-sched="${schedKey}" data-season="${season}" data-day="${day}" data-slot="${i}"${minAttr}${maxAttr}${stepAttr}${ph} value="${val}"></td>`;
      }
      html += "</tr>";
    }
    return html + "</tbody></table></div>";
  }).join("")
    + (periodMap ? simPeriodLegend(T) : "");
}

function simPeriodLegend(T) {
  const periods = activeSimulateTou() === "ThreeStage"
    ? ["peak", "half_peak", "saturday_half_peak", "off_peak"]
    : ["peak", "saturday_half_peak", "off_peak"];
  return `<div class="sim-period-legend">${periods.map((p) =>
    `<span class="sim-period-chip" style="border-color:${PERIOD_COLORS[p]};color:${PERIOD_COLORS[p]}">${t("settings.period." + p)}</span>`
  ).join("")}</div>`;
}

function renderScheduleBlock(prefix, modeKey, schedKey, sim, T, cfg) {
  const mode = sim[modeKey];
  const open = mode === "manual";
  const badge = cfg.badge ? `<span class="sim-schedule__badge">${cfg.badge}</span>` : "";
  return `<div class="sim-schedule">
    <div class="sim-schedule__bar">
      <div class="sim-schedule__lead">
        <span class="sim-schedule__title"><i class="fa-solid fa-calendar-days"></i> ${T.scheduleMode}</span>
        ${badge}
      </div>
      <div class="sim-schedule__switch" role="group">
        <label class="sim-seg${mode === "auto" ? " sim-seg--on" : ""}">
          <input type="radio" name="${modeKey}" value="auto"${mode === "auto" ? " checked" : ""}> ${T.scheduleAuto}
        </label>
        <label class="sim-seg${mode === "manual" ? " sim-seg--on" : ""}">
          <input type="radio" name="${modeKey}" value="manual"${mode === "manual" ? " checked" : ""}> ${T.scheduleManual}
        </label>
      </div>
    </div>
    <div class="sim-schedule__grid${open ? " sim-schedule__grid--open" : ""}" id="${prefix}HourlyGrid">
      ${renderSimMatrix(schedKey, sim[schedKey], T, cfg)}
    </div>
  </div>`;
}

function readSimulateForm() {
  const sim = session.simulate;
  const opts = [...document.querySelectorAll('[name="bessFn"]:checked')].map((c) => c.value);
  sim.functions = ["tou", ...opts];

  document.querySelectorAll("[data-sched]").forEach((el) => {
    const schedKey = el.dataset.sched;
    const season = el.dataset.season;
    const day = el.dataset.day;
    const slot = Number(el.dataset.slot);
    const factory = schedKey === "touSchedule"
      ? () => defaultTouSlots(activeSimulateTou())
      : defaultReserveHourly;
    const n = factory().length;
    if (!sim[schedKey]) sim[schedKey] = makeSeasonMatrix(factory);
    if (!sim[schedKey][season]) sim[schedKey][season] = {};
    if (!Array.isArray(sim[schedKey][season][day]) || sim[schedKey][season][day].length !== n) {
      sim[schedKey][season][day] = ensureSlots(sim[schedKey][season][day], n, factory()[0]);
    }
    if (schedKey === "touSchedule" && String(el.value).trim() === "") {
      sim[schedKey][season][day][slot] = null;
      return;
    }
    let v = Number(el.value);
    if (schedKey === "reserveSchedule") {
      const maxMw = simMaxReserveBidMw();
      if (maxMw > 0) v = Math.min(v, maxMw);
      v = Math.max(0, v);
    } else if (schedKey === "touSchedule") {
      v = Math.max(0, Math.min(100, v));
    }
    sim[schedKey][season][day][slot] = v;
  });

  document.querySelectorAll("[data-sim]").forEach((el) => {
    const key = el.dataset.sim;
    if (!key || !(key in baseSimulateTemplate())) return;
    sim[key] = el.tagName === "SELECT" ? el.value : Number(el.value);
  });
  // 表單 % → session 小數（SOC／效率）
  if (document.querySelector('[data-sim="chargeEff"]')) {
    sim.chargeEff = Math.max(0.5, Math.min(1, (Number(sim.chargeEff) || 85) / 100));
  }
  if (document.querySelector('[data-sim="socMin"]') || document.querySelector('[data-sim="socMax"]')) {
    let lo = Math.max(0, Math.min(1, (Number(sim.socMin) || 0) / 100));
    let hi = Math.max(0, Math.min(1, (Number(sim.socMax) || 0) / 100));
    if (lo > hi) [lo, hi] = [hi, lo];
    sim.socMin = lo;
    sim.socMax = hi;
  }
  document.querySelectorAll("[data-sim-check]").forEach((el) => {
    sim[el.dataset.simCheck] = el.checked;
  });
  // 方案固定跟匯入；不可在模擬頁改
  if (TOU_OPTIONS.includes(session.tou)) sim.simulateTou = session.tou;
  const touMode = document.querySelector('[name="touScheduleMode"]:checked');
  if (touMode) sim.touScheduleMode = touMode.value;
  const reserveMode = document.querySelector('[name="reserveScheduleMode"]:checked');
  if (reserveMode) sim.reserveScheduleMode = reserveMode.value;
  persistSession();
}

function syncSimulateTabs() {
  const sim = session.simulate;
  const fns = new Set(sim.functions);
  if (!fns.has(sim.detailTab) && sim.detailTab !== "tou") sim.detailTab = "tou";
  document.querySelectorAll(".sim-tab").forEach((el) => {
    const tab = el.dataset.tab;
    const enabled = tab === "tou" || fns.has(tab);
    el.classList.toggle("sim-tab--dim", !enabled);
    el.classList.toggle("sim-tab--active", tab === sim.detailTab && (tab === "tou" || enabled));
  });
  document.querySelectorAll(".sim-tab-panel").forEach((el) => {
    const on = el.dataset.panel === sim.detailTab;
    el.classList.toggle("sim-tab-panel--hidden", !on);
    el.setAttribute("aria-hidden", on ? "false" : "true");
  });
  document.getElementById("touHourlyGrid")?.classList.toggle("sim-schedule__grid--open", sim.touScheduleMode === "manual");
  document.getElementById("reserveHourlyGrid")?.classList.toggle("sim-schedule__grid--open", sim.reserveScheduleMode === "manual");
  document.querySelectorAll(".sim-seg").forEach((el) => {
    const input = el.querySelector("input");
    if (input) el.classList.toggle("sim-seg--on", input.checked);
  });
}

function renderSimulateTabs(T, sim) {
  // TOU: always shown, locked (no checkbox)
  const touTab = `<button type="button" class="sim-tab sim-tab--locked${sim.detailTab === "tou" ? " sim-tab--active" : ""}" data-tab="tou" role="tab">
    <i class="fa-solid fa-clock"></i><span>${T.tou}</span>
    <span class="sim-tab-lock"><i class="fa-solid fa-thumbtack"></i></span>
  </button>`;

  const optTabs = BESS_OPTIONAL.map(({ id, icon }) => {
    const labelKey = id === "large_user" ? "largeUser" : id;
    const checked = sim.functions.includes(id);
    const active = sim.detailTab === id && checked ? " sim-tab--active" : "";
    const dimmed = checked ? "" : " sim-tab--dim";
    return `<button type="button" class="sim-tab${active}${dimmed}" data-tab="${id}" role="tab">
      <label class="sim-tab-check" onclick="event.stopPropagation()">
        <input type="checkbox" name="bessFn" value="${id}"${checked ? " checked" : ""}>
        <span class="sim-tab-check__box"></span>
      </label>
      <i class="fa-solid ${icon}"></i><span>${T[labelKey]}</span>
    </button>`;
  }).join("");

  return `<div class="sim-tabs" role="tablist">
    <div class="sim-tabs__row sim-tabs__row--primary">${touTab}</div>
    <div class="sim-tabs__row sim-tabs__row--optional">${optTabs}</div>
  </div>`;
}

function buildContractsFromSession() {
  const schema = currentSchema();
  if (!schema) return null;
  const contracts = {};
  for (const f of schema.fields) contracts[f] = Number(session.contractValues[f] || 0);
  return contracts;
}

function simReportDays() {
  if (!session.start || !session.end) return 0;
  const a = new Date(session.start);
  const b = new Date(session.end);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

function simFnLabel(id) {
  const key = id === "large_user" ? "largeUser" : id;
  return I18N[locale].simulate[key] || id;
}

function simRowChartKey(row) {
  if (!row) return null;
  const p = Math.round(Number(row.pcs_kw) * 1000) / 1000;
  const b = Math.round(Number(row.batt_kwh) * 1000) / 1000;
  return `${p}_${b}`;
}

function simViewRow(res, mode) {
  if (!res) return null;
  const m = mode || simViewMode;
  if (m === "max_savings") {
    return res.best_effort || (res.grid || []).find((r) => r.best_effort) || null;
  }
  if (m === "max_util") {
    return res.max_util || (res.grid || []).find((r) => r.max_util) || null;
  }
  return res.recommended
    || (res.grid || []).find((r) => r.recommended)
    || simViewRow(res, "max_savings");
}

function simSyncViewChartKey(res) {
  const row = simViewRow(res);
  simDispatchChartKey = simRowChartKey(row);
}

function simGridRowClass(row) {
  const parts = [];
  if (row.recommended) parts.push("sim-grid-row--rec");
  if (row.best_effort) parts.push("sim-grid-row--save");
  if (row.max_util) parts.push("sim-grid-row--util");
  return parts.join(" ");
}

function simGridLegendHtml(res, T) {
  const marks = [
    ["rec", res.recommended, T.simGridLegendRec],
    ["save", res.best_effort, T.simGridLegendSave],
    ["util", res.max_util, T.simGridLegendUtil],
  ];
  const items = marks.flatMap(([cls, row, label]) => {
    if (!row) return [];
    return [`<span class="sim-grid-legend__swatch sim-grid-legend__swatch--${cls}"></span>${label}`];
  });
  if (!res.viable) {
    items.push(`<span class="sim-grid-legend__hint">${T.simNoViable}</span>`);
  }
  return `<div class="sim-grid-legend btm-meta">${items.map((x) => `<span class="sim-grid-legend__item">${x}</span>`).join("")}</div>`;
}

function simGridMetricTh(main, sub) {
  return `<th class="num sim-grid-th" title="${main} · ${sub}"><span>${main}</span><small>${sub}</small></th>`;
}

function simSnapshotFromResult(res) {
  const r = res.recommended || res.best_effort;
  if (!r) return null;
  return {
    pcs_kw: r.pcs_kw,
    batt_kwh: r.batt_kwh,
    hours: r.hours,
    savings: res.savings != null ? res.savings : r.savings,
    savings_pct: r.savings_pct != null ? r.savings_pct : res.savings_pct,
    viable: !!res.viable,
    after_total: r.after_total,
  };
}

function simPcsTierLabels(stats, T) {
  const out = {};
  if (!stats || !stats.ok) return out;
  const raw = stats.pcs_sample || {};
  const labels = {
    full_cover: T.simFullCover,
    max: T.simStatMax,
    avg: T.simStatAvg,
    min: T.simStatMin,
    two_cycle: T.simTwoCycle,
  };
  for (const [tier, label] of Object.entries(labels)) {
    const v = Number(raw[tier]);
    if (v > 0) out[Math.round(v * 10) / 10] = label;
  }
  return out;
}

function simLastRunCardHtml(snap, T, { mode }) {
  if (!snap) return "";
  const sizeLabel = snap.viable ? T.simKpiSize : T.simTagBest;
  const saveCls = Number(snap.savings) >= 0 ? " sim-last-run__save--pos" : " sim-last-run__save--neg";
  const note = mode === "dismissed" ? T.simLastRunCleared : T.simLastRunRerun;
  const dismissBtn = mode === "dismissed"
    ? `<button type="button" class="btm-btn btm-btn--ghost" id="btnSimDismissSnapshot">${T.simLastRunDismiss}</button>`
    : "";
  return `<section class="sim-last-run hud-panel hud-frame" role="status">
    <div class="sim-last-run__head">
      <h3 class="sim-last-run__title">${T.simResultSummary}</h3>
      ${dismissBtn}
    </div>
    <p class="btm-meta sim-last-run__note">${note}</p>
    <div class="sim-last-run__body">
      <div class="sim-last-run__metric">
        <span class="sim-last-run__label">${sizeLabel}</span>
        <span class="sim-last-run__value">${fmt(snap.pcs_kw, 0)} <small>kW</small> / ${fmt(snap.batt_kwh, 0)} <small>kWh</small></span>
        <span class="btm-meta">${T.simHours} ${fmt(snap.hours, 1)}</span>
      </div>
      <div class="sim-last-run__metric${saveCls}">
        <span class="sim-last-run__label">${T.simKpiSave}</span>
        <span class="sim-last-run__value">${fmt(snap.savings, 0)}</span>
        <span class="btm-meta">${T.simKpiSavePct} ${fmt(snap.savings_pct, 1)}%</span>
      </div>
    </div>
  </section>`;
}

function renderSimLastRunCard(T) {
  const running = !!simulateFetch || !!simulateSampleFetch;
  if (simDismissedSnapshot) {
    return simLastRunCardHtml(simDismissedSnapshot, T, { mode: "dismissed" });
  }
  if (running && simPinnedRun) {
    return simLastRunCardHtml(simPinnedRun, T, { mode: "pinned" });
  }
  return "";
}

function simMetricPct(row, key) {
  const v = row && row[key];
  return v != null && v !== "" ? `${fmt(v, 1)}%` : "—";
}

function simSeasonMetricCells(row) {
  return `<td class="num">${simMetricPct(row, "pcs_daily_avg_pct_summer")}</td>
        <td class="num">${simMetricPct(row, "pcs_daily_avg_pct_non_summer")}</td>
        <td class="num">${simMetricPct(row, "daily_cycle_pct_summer")}</td>
        <td class="num">${simMetricPct(row, "daily_cycle_pct_non_summer")}</td>`;
}

function simSeasonMetricsTooltip(point, T) {
  if (!point) return "";
  return `<br>${T.simPcsDailyAvg}（${T.summer}）: ${fmt(point.pcs_daily_avg_pct_summer, 1)}%
            <br>${T.simPcsDailyAvg}（${T.nonSummer}）: ${fmt(point.pcs_daily_avg_pct_non_summer, 1)}%
            <br>${T.simDailyCycle}（${T.summer}）: ${fmt(point.daily_cycle_pct_summer, 1)}%
            <br>${T.simDailyCycle}（${T.nonSummer}）: ${fmt(point.daily_cycle_pct_non_summer, 1)}%`;
}

function simGridResultsHtml(res, T) {
  const rows = res.grid || [];
  if (!rows.length) return `<p class="btm-meta">—</p>`;
  const tiers = simPcsTierLabels(res.profile_stats, T);
  const byPcs = {};
  for (const row of rows) {
    const k = Math.round(Number(row.pcs_kw) * 10) / 10;
    if (!byPcs[k]) byPcs[k] = [];
    byPcs[k].push(row);
  }
  const groups = Object.keys(byPcs).map((k) => {
    const pcs = Number(k);
    const grp = byPcs[k].sort((a, b) => Number(b.savings) - Number(a.savings));
    return { pcs, rows: grp, topSave: Number(grp[0].savings) };
  }).sort((a, b) => b.topSave - a.topSave);

  const blocks = groups.map((g) => {
    const tierLab = tiers[g.pcs]
      ? `<span class="sim-grid-group__tier">${tiers[g.pcs]}</span>`
      : "";
    const body = g.rows.map((row) => {
      const rowCls = simGridRowClass(row);
      return `<tr class="${rowCls}">
        <td class="num">${fmt(row.batt_kwh, 0)}</td>
        <td class="num">${fmt(row.hours, 1)}</td>
        ${simSeasonMetricCells(row)}
        <td class="num">${fmt(row.after_total)}</td>
        <td class="num">${fmt(row.savings)}</td>
        <td class="num">${fmt(row.savings_pct, 1)}%</td>
      </tr>`;
    }).join("");
    return `<section class="sim-grid-group hud-panel hud-frame">
      <header class="sim-grid-group__head">
        <div class="sim-grid-group__lead">
          <span class="sim-grid-group__pcs">${fmt(g.pcs, 1)}<small>kW</small></span>
          ${tierLab}
        </div>
        <div class="sim-grid-group__stat">
          <span class="sim-grid-group__stat-val">${fmt(g.topSave, 0)}</span>
          <span class="sim-grid-group__stat-lab">${T.simSavings}</span>
        </div>
      </header>
      <div class="btm-table-wrap sim-grid-table-wrap">
        <table class="btm-table btm-table--dash sim-grid-table">
          <thead><tr>
            <th class="num">${T.simBatt}</th>
            <th class="num">${T.simHours}</th>
            ${simGridMetricTh(T.simPcsDailyAvg, T.summer)}
            ${simGridMetricTh(T.simPcsDailyAvg, T.nonSummer)}
            ${simGridMetricTh(T.simDailyCycle, T.summer)}
            ${simGridMetricTh(T.simDailyCycle, T.nonSummer)}
            <th class="num">${T.simAfterBill}</th>
            <th class="num">${T.simSavings}</th>
            <th class="num">${T.simKpiSavePct}</th>
          </tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </section>`;
  }).join("");

  return `${simGridLegendHtml(res, T)}<div class="sim-grid-groups">${blocks}</div>`;
}

function simBillCompareHtml(res, T, row) {
  const r = row || simViewRow(res);
  if (!r) return `<p class="btm-meta">—</p>`;
  const before = res.before || {};
  const after = {
    basic_total: r.after_basic_total,
    overage_total: r.after_overage_total,
    energy_total: r.after_energy_total,
    total: r.after_total,
  };
  const delta = {
    basic_total: Number(after.basic_total || 0) - Number(before.basic_total || 0),
    overage_total: Number(after.overage_total || 0) - Number(before.overage_total || 0),
    energy_total: Number(after.energy_total || 0) - Number(before.energy_total || 0),
    total: Number(after.total || 0) - Number(before.total || 0),
  };
  const rows = [
    [t("dashboard.basic"), before.basic_total, after.basic_total, delta.basic_total],
    [t("dashboard.overage"), before.overage_total, after.overage_total, delta.overage_total],
    [t("dashboard.energy"), before.energy_total, after.energy_total, delta.energy_total],
    [t("dashboard.total"), before.total, after.total, delta.total],
  ];
  const body = rows.map(([label, b, a, d]) => `<tr>
      <td>${label}</td>
      <td class="num">${fmt(b)}</td>
      <td class="num">${fmt(a)}</td>
      <td class="num${Number(d) < 0 ? " sim-delta--save" : ""}">${fmt(d)}</td>
    </tr>`).join("");
  return `<div class="btm-table-wrap">
    <table class="btm-table btm-table--dash">
      <thead><tr>
        <th>${t("dashboard.item")}</th>
        <th class="num">${T.simKpiBefore}</th>
        <th class="num">${T.simKpiAfter}</th>
        <th class="num">Δ</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
}

function normalizeSimulateSizeResult(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.grid) || !raw.grid.length) {
    return null;
  }
  const grid = raw.grid.map((r) => ({ ...r }));
  const findFlag = (flag) => grid.find((r) => r[flag]) || null;
  return {
    ...raw,
    grid,
    // 以 grid 標記為準，避免 session 反序列化後指標列與 tabs 脫鉤
    recommended: findFlag("recommended") || raw.recommended || null,
    best_effort: findFlag("best_effort") || raw.best_effort || null,
    max_util: findFlag("max_util") || raw.max_util || null,
  };
}

function renderSimSavingsChart(res, T) {
  const el = document.getElementById("simSavingsChart");
  if (!el || typeof echarts === "undefined" || !res || !(res.grid || []).length) return;

  try {
  if (simSavingsChart) {
    try { simSavingsChart.dispose(); } catch { /* ignore */ }
    simSavingsChart = null;
  }

  const byPcs = {};
  for (const row of res.grid) {
    const pcs = Number(row.pcs_kw);
    if (!byPcs[pcs]) byPcs[pcs] = [];
    byPcs[pcs].push(row);
  }

  const palette = ["#34d399", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa"];
  const series = Object.keys(byPcs).sort((a, b) => Number(a) - Number(b)).map((pcs, i) => {
    const pts = byPcs[pcs].sort((a, b) => Number(a.hours) - Number(b.hours));
    const color = palette[i % palette.length];
    const markPoint = { data: [], symbolSize: 42 };
    for (const p of pts) {
      if (p.recommended) {
        markPoint.data.push({
          name: T.simViewRec,
          coord: [Number(p.hours), Number(p.savings)],
          itemStyle: { color: "#34d399" },
        });
      }
      if (p.best_effort) {
        markPoint.data.push({
          name: T.simViewMaxSave,
          coord: [Number(p.hours), Number(p.savings)],
          itemStyle: { color: "#fbbf24" },
        });
      }
      if (p.max_util) {
        markPoint.data.push({
          name: T.simViewMaxUtil,
          coord: [Number(p.hours), Number(p.savings)],
          itemStyle: { color: "#a78bfa" },
        });
      }
    }
    return {
      name: `${pcs} kW`,
      type: "line",
      smooth: true,
      showSymbol: true,
      symbolSize: 6,
      lineStyle: { width: 2, color },
      itemStyle: { color },
      data: pts.map((p) => [Number(p.hours), Number(p.savings)]),
      markPoint,
    };
  });

  simSavingsChart = echarts.init(el);
  simSavingsChart.setOption({
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    grid: { left: 56, right: 24, top: 36, bottom: 40 },
    tooltip: {
      trigger: "item",
      formatter(params) {
        if (!params.value) return "";
        const [h, s] = params.value;
        const point = (res.grid || []).find((p) =>
          Number(p.pcs_kw) === Number(params.seriesName.replace(" kW", "")) &&
          Number(p.hours) === Number(h));
        const metrics = simSeasonMetricsTooltip(point, T);
        return `${params.seriesName}<br>${T.simHours}: ${h}<br>${T.simSavings}: ${fmt(s)}${metrics}`;
      },
    },
    legend: { top: 0, textStyle: { color: "#94a3b8" } },
    xAxis: {
      type: "value",
      name: T.simChartHours,
      nameTextStyle: { color: "#94a3b8" },
      axisLine: { lineStyle: { color: "#334155" } },
      splitLine: { lineStyle: { color: "#1e293b" } },
    },
    yAxis: {
      type: "value",
      name: T.simChartSavings,
      nameTextStyle: { color: "#94a3b8" },
      axisLine: { lineStyle: { color: "#334155" } },
      splitLine: { lineStyle: { color: "#1e293b" } },
    },
    series,
  });

  if (simChartResize) window.removeEventListener("resize", simChartResize);
  simChartResize = () => { if (simSavingsChart) simSavingsChart.resize(); };
  window.addEventListener("resize", simChartResize);
  requestAnimationFrame(() => { if (simSavingsChart) simSavingsChart.resize(); });
  } catch (err) {
    console.warn("sim savings chart", err);
  }
}

function seedSimDispatchCache(res) {
  const resultKey = session.simulateResultKey || null;
  if (simDispatchCacheResultKey !== resultKey) {
    simDispatchChartCache = {};
    simDispatchChartPending = {};
    simDispatchCacheResultKey = resultKey;
    simViewMode = res?.viable ? "recommended" : "max_savings";
  }
  const defaultKey = simRowChartKey(res?.recommended || res?.best_effort);
  if (defaultKey && res?.dispatch_charts) {
    simDispatchChartCache[defaultKey] = res.dispatch_charts;
  }
  simSyncViewChartKey(res);
}

function simDispatchChartsForKey(res, key) {
  const k = key || simDispatchChartKey || simRowChartKey(simViewRow(res));
  return (k && simDispatchChartCache[k]) || null;
}

function disposeSimDispatchCharts() {
  for (const c of simDispatchCharts) {
    try { c.dispose(); } catch { /* ignore */ }
  }
  simDispatchCharts = [];
}

function setSimDispatchLoading(loading, msg) {
  const msgEl = document.getElementById("simDispatchLoadMsg");
  if (msgEl) {
    if (loading && msg) {
      msgEl.innerHTML = busyBlockHtml(msg);
      msgEl.hidden = false;
    } else {
      msgEl.hidden = true;
      msgEl.innerHTML = "";
    }
  }
  for (const id of ["simDispatchGridTop", "simDispatchGridBottom", "simDispatchGrid"]) {
    const grid = document.getElementById(id);
    if (!grid) continue;
    grid.hidden = !!loading;
    grid.classList.toggle("sim-dispatch-grid--loading", !!loading);
  }
  const filters = document.querySelectorAll(".sim-dispatch-filter-group");
  filters.forEach((el) => { el.hidden = !!loading; });
}

function resizeSimDispatchCharts() {
  requestAnimationFrame(() => {
    simDispatchCharts.forEach((c) => {
      try { c.resize(); } catch { /* ignore */ }
    });
  });
}

async function fetchSimDispatchChartRow(row, T) {
  if (!row) return null;
  const key = simRowChartKey(row);
  if (!key) return null;
  if (simDispatchChartCache[key]) return key;
  if (simDispatchChartPending[key]) return simDispatchChartPending[key];
  const contracts = buildContractsFromSession();
  if (!contracts || !session.importId) throw new Error(T.simErr);
  const resultKey = session.simulateResultKey;
  let request;
  request = (async () => {
    try {
      const fd = new FormData();
      fd.append("import_id", session.importId);
      fd.append("contracts", JSON.stringify(contracts));
      fd.append("simulate", JSON.stringify(session.simulate));
      fd.append("pcs_kw", String(row.pcs_kw));
      fd.append("batt_kwh", String(row.batt_kwh));
      appendOverrides(fd);
      const data = await apiJson("/api/simulate/dispatch-charts", { method: "POST", body: fd });
      if (resultKey !== session.simulateResultKey) return key;
      const charts = data && data.charts;
      if (charts) {
        simDispatchChartCache[key] = charts;
        // 後端 key 若捨入不同，兩邊都存，切換才找得到
        if (data.key && data.key !== key) simDispatchChartCache[data.key] = charts;
      }
      return key;
    } finally {
      if (simDispatchChartPending[key] === request) delete simDispatchChartPending[key];
    }
  })();
  simDispatchChartPending[key] = request;
  return simDispatchChartPending[key];
}

async function ensureSimDispatchCharts(res, T) {
  const row = simViewRow(res);
  if (!row) return;
  simSyncViewChartKey(res);
  const key = simRowChartKey(row);
  if (key && simDispatchChartCache[key]) {
    setSimDispatchLoading(false);
    renderSimDispatchCharts(res, T);
    resizeSimDispatchCharts();
    return;
  }

  const loadId = ++simDispatchChartLoadId;
  // 先清掉上一配置的圖，避免「電費已換、曲線還是舊的」
  disposeSimDispatchCharts();
  setSimDispatchLoading(true, T.simDispatchLoading);
  try {
    await fetchSimDispatchChartRow(row, T);
    if (loadId !== simDispatchChartLoadId) return;
    // 必須先顯示容器再 init，否則 ECharts 在 hidden 裡寬高為 0
    setSimDispatchLoading(false);
    renderSimDispatchCharts(res, T);
    resizeSimDispatchCharts();
  } catch (err) {
    if (loadId !== simDispatchChartLoadId) return;
    console.warn("sim dispatch lazy", err);
    const meta = document.getElementById("simMeta");
    setRunMeta(meta, `${T.simErr}: ${err.message || err}`, true);
  } finally {
    if (loadId === simDispatchChartLoadId) setSimDispatchLoading(false);
  }
}

function simViewModesFor(res) {
  const modes = ["max_savings", "max_util"];
  if (res?.viable) modes.unshift("recommended");
  return modes;
}

function simUniqueViewRows(res) {
  const seen = new Set();
  const rows = [];
  for (const mode of simViewModesFor(res)) {
    const row = simViewRow(res, mode);
    const key = simRowChartKey(row);
    if (!row || !key || seen.has(key)) continue;
    seen.add(key);
    rows.push(row);
  }
  return rows;
}

async function prefetchSimViewCharts(res, T) {
  const pending = simUniqueViewRows(res).filter((row) => {
    const key = simRowChartKey(row);
    return key && !simDispatchChartCache[key];
  });
  if (!pending.length) return;
  await Promise.all(pending.map((row) =>
    fetchSimDispatchChartRow(row, T).catch((err) => {
      console.warn("sim dispatch prefetch", err);
    })));
}

function simUtilScore(row) {
  if (!row) return null;
  const vals = [
    Number(row.pcs_daily_avg_pct_summer) || 0,
    Number(row.pcs_daily_avg_pct_non_summer) || 0,
    Number(row.daily_cycle_pct_summer) || 0,
    Number(row.daily_cycle_pct_non_summer) || 0,
  ];
  return vals.reduce((a, b) => a + b, 0) / 4;
}

function simViewTabMeta(row, T) {
  if (!row) return "—";
  const score = simUtilScore(row);
  const peak = ((Number(row.pcs_daily_avg_pct_summer) + Number(row.pcs_daily_avg_pct_non_summer)) / 2);
  const cycle = ((Number(row.daily_cycle_pct_summer) || 0)
    + (Number(row.daily_cycle_pct_non_summer) || 0)) / 2;
  const scoreTxt = score != null
    ? ` · ${T.simViewMaxUtil} ${fmt(score, 1)}%`
    : "";
  const detail = row.pcs_daily_avg_pct_summer != null
    ? ` · ${T.simPcsDailyAvg} ${fmt(peak, 1)}% · ${T.simDailyCycle} ${fmt(cycle, 1)}%`
    : "";
  return `${fmt(row.pcs_kw, 0)} kW · ${fmt(row.batt_kwh, 0)} kWh · ${T.simSavings} ${fmt(row.savings)}${scoreTxt}${detail}`;
}

function simViewTabsHtml(res, T) {
  const modes = [
    { id: "recommended", label: T.simViewRec, cls: "rec", disabled: !res?.viable },
    { id: "max_savings", label: T.simViewMaxSave, cls: "save" },
    { id: "max_util", label: T.simViewMaxUtil, cls: "util" },
  ];
  const seen = new Set();
  const visible = modes.filter((m) => {
    if (m.disabled) return false;
    const key = simRowChartKey(simViewRow(res, m.id));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return `<div class="sim-view-tabs" role="tablist" aria-label="${T.simViewPanel}">
    ${visible.map((m) => {
      const row = simViewRow(res, m.id);
      const active = simViewMode === m.id;
      return `<button type="button" class="sim-view-tab sim-view-tab--${m.cls}${active ? " sim-view-tab--active" : ""}"
        data-mode="${m.id}" role="tab" aria-selected="${active}">
        <span class="sim-view-tab__label">${m.label}</span>
        <span class="sim-view-tab__meta">${simViewTabMeta(row, T)}</span>
      </button>`;
    }).join("")}
  </div>`;
}

function simDispatchSeasonDayOpts(T) {
  const seasons = [
    ["all", t("charts.seasonAll")],
    ["summer", T.summer],
    ["non_summer", T.nonSummer],
  ];
  const days = [
    ["all", t("charts.dayAll")],
    ["weekday", t("charts.weekday")],
    ["holiday", t("charts.holiday")],
  ];
  const sOpts = seasons.map(([v, lab]) =>
    `<option value="${v}"${simDispatchFilter.season === v ? " selected" : ""}>${lab}</option>`).join("");
  const dOpts = days.map(([v, lab]) =>
    `<option value="${v}"${simDispatchFilter.day === v ? " selected" : ""}>${lab}</option>`).join("");
  return { sOpts, dOpts };
}

function simDispatchHourlyFiltersHtml(T) {
  const { sOpts, dOpts } = simDispatchSeasonDayOpts(T);
  return `<div class="sim-dispatch-toolbar sim-dispatch-filter-group sim-dispatch-filter-group--hourly">
    <div class="sim-dispatch-toolbar__lead">
      <span class="sim-dispatch-toolbar__title">${T.simDispatchFilterHourly}</span>
      <span class="sim-dispatch-toolbar__hint">${T.simDispatchFilterHourlyHint}</span>
    </div>
    <div class="sim-dispatch-toolbar__controls">
      <label class="ts-field"><span class="ts-field__label">${t("settings.season")}</span>
        <select class="ts-select" id="simDispatchSeason">${sOpts}</select></label>
      <label class="ts-field"><span class="ts-field__label">${t("settings.day")}</span>
        <select class="ts-select" id="simDispatchDay">${dOpts}</select></label>
    </div>
  </div>`;
}

function simDispatchDistFiltersHtml(T) {
  const metrics = [
    ["load_kw", T.simDispatchLoad],
    ["ess_kw", T.simDispatchEss],
    ["net_kw", T.simDispatchNet],
    ["soc_pct", T.simDispatchSoc],
  ];
  const mOpts = metrics.map(([v, lab]) =>
    `<option value="${v}"${simDispatchFilter.heatmap === v ? " selected" : ""}>${lab}</option>`).join("");
  return `<div class="sim-dispatch-toolbar sim-dispatch-filter-group sim-dispatch-filter-group--dist">
    <div class="sim-dispatch-toolbar__lead">
      <span class="sim-dispatch-toolbar__title">${T.simDispatchFilterDist}</span>
      <span class="sim-dispatch-toolbar__hint">${T.simDispatchFilterDistHint}</span>
    </div>
    <div class="sim-dispatch-toolbar__controls sim-dispatch-toolbar__controls--single">
      <label class="ts-field"><span class="ts-field__label">${T.simDispatchMetric}</span>
        <select class="ts-select" id="simDispatchMetric">${mOpts}</select></label>
    </div>
  </div>`;
}

function simViewPanelHtml(res, T) {
  if (!simViewRow(res, "max_savings") && !res?.dispatch_charts) return "";
  const row = simViewRow(res);
  return `<section class="sim-view-panel">
    <h3 class="btm-subhead sim-view-panel__title">${T.simViewPanel}</h3>
    ${simViewTabsHtml(res, T)}
    <div class="sim-view-section">
      <h4 class="sim-view-section__title">${T.simBillCompare}</h4>
      <div id="simBillCompare">${simBillCompareHtml(res, T, row)}</div>
    </div>
    <div class="sim-view-section">
      <h4 class="sim-view-section__title">${T.simDispatchCharts}</h4>
      <div class="sim-dispatch-load-msg" id="simDispatchLoadMsg" hidden></div>
      ${simDispatchHourlyFiltersHtml(T)}
      <div id="simDispatchGridTop" class="sim-dispatch-grid sim-dispatch-grid--top">
        <section class="sim-dispatch-panel">
          <h5 class="sim-dispatch-panel__title">${T.simDispatchHourlySoc}</h5>
          <div id="simHourlySocChart" class="sim-dispatch-chart"></div>
        </section>
        <section class="sim-dispatch-panel">
          <h5 class="sim-dispatch-panel__title">${T.simDispatchHourlyPower}</h5>
          <div id="simHourlyPowerChart" class="sim-dispatch-chart"></div>
        </section>
        <section class="sim-dispatch-panel sim-dispatch-panel--wide">
          <h5 class="sim-dispatch-panel__title">${T.simDispatchDaily} <span class="sim-dispatch-panel__hint">${T.simDispatchDailyHint}</span></h5>
          <div id="simDailyDispatchChart" class="sim-dispatch-chart"></div>
        </section>
      </div>
      ${simDispatchDistFiltersHtml(T)}
      <div id="simDispatchGridBottom" class="sim-dispatch-grid sim-dispatch-grid--bottom">
        <section class="sim-dispatch-panel">
          <h5 class="sim-dispatch-panel__title">${T.simDispatchHeatmap}</h5>
          <div id="simDispatchHeatmap" class="sim-dispatch-chart sim-dispatch-chart--tall"></div>
        </section>
        <section class="sim-dispatch-panel">
          <h5 class="sim-dispatch-panel__title">${T.simDispatchBoxplot}</h5>
          <div id="simDispatchBoxplot" class="sim-dispatch-chart"></div>
        </section>
      </div>
    </div>
  </section>`;
}

async function setSimViewMode(mode, res, T) {
  if (!mode || simViewMode === mode) return;
  simViewMode = mode;
  simSyncViewChartKey(res);
  document.querySelectorAll(".sim-view-tab").forEach((btn) => {
    const on = btn.dataset.mode === mode;
    btn.classList.toggle("sim-view-tab--active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  const billEl = document.getElementById("simBillCompare");
  if (billEl) billEl.innerHTML = simBillCompareHtml(res, T, simViewRow(res));

  const tabs = document.querySelectorAll(".sim-view-tab");
  tabs.forEach((b) => { b.disabled = true; });
  try {
    // 一律走 ensure：有快取秒切；無快取顯示載入中再拉 API
    await ensureSimDispatchCharts(res, T);
  } finally {
    tabs.forEach((b) => { b.disabled = false; });
  }
}

function simDispatchHourlyData(dc, metric, season, day) {
  const hm = dc?.hourly_mean?.[metric];
  if (!hm) return [];
  const hours = hm.hours || Array.from({ length: 24 }, (_, i) => i);
  const group = (((hm.groups || {})[season] || {})[day]) || {};
  return hours.map((h) => (group[String(h)] != null ? group[String(h)] : null));
}

function simMetricHeatmapOption(dc, metric, unit) {
  const hm = dc?.heatmap?.[metric] || {};
  const rng = dc?.ranges?.[metric] || {};
  const base = heatmapOption({ heatmap: hm, kW: rng });
  if (base.tooltip) {
    base.tooltip.formatter = (p) => {
      if (!p || !p.value) return "";
      const slots = Array.from({ length: 96 }, (_, i) => {
        const h = String(Math.floor(i / 4)).padStart(2, "0");
        const m = String((i % 4) * 15).padStart(2, "0");
        return `${h}:${m}`;
      });
      const [x, y, v] = p.value;
      const dates = hm.dates || [];
      return `${dates[y] || ""} ${slots[x] || ""}<br/>${fmt(v, metric === "soc_pct" ? 1 : 1)} ${unit}`;
    };
  }
  return base;
}

function simMetricBoxplotOption(dc, metric, unit) {
  const bp = dc?.boxplot?.[metric] || {};
  const hours = bp.hours && bp.hours.length ? bp.hours : Array.from({ length: 24 }, (_, i) => i);
  const group = (((bp.groups || {})[simDispatchFilter.season] || {})[simDispatchFilter.day]) || {};
  const labels = [];
  const boxes = [];
  const outliers = [];
  hours.forEach((h) => {
    const s = group[h] || group[String(h)];
    if (!s) return;
    const hh = String(h).padStart(2, "0") + ":00";
    labels.push(hh);
    const lo = s.whisker_low != null ? s.whisker_low : s.min;
    const hi = s.whisker_high != null ? s.whisker_high : s.max;
    boxes.push({
      value: [lo, s.q1, s.median, s.q3, hi],
      itemStyle: { color: "transparent", borderColor: "#5eeaff", borderWidth: 2 },
    });
    for (const v of s.outliers || []) outliers.push([labels.length - 1, v]);
  });
  return {
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    textStyle: { color: CHART_AXIS },
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        if (p.seriesType === "scatter") {
          return `${labels[p.value[0]] || ""}<br/>${fmt(p.value[1], 1)} ${unit}`;
        }
        const v = p && p.value;
        if (!v || !Array.isArray(v)) return (p && p.name) || "";
        const nums = v.length > 5 ? v.slice(1) : v;
        if (nums.length < 5) return p.name || "";
        return `${p.name}<br/>min ${fmt(nums[0], 1)}<br/>Q1 ${fmt(nums[1], 1)}<br/>median ${fmt(nums[2], 1)}<br/>Q3 ${fmt(nums[3], 1)}<br/>max ${fmt(nums[4], 1)} ${unit}`;
      },
    },
    grid: { left: 64, right: 16, top: 16, bottom: 40 },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: CHART_AXIS, fontSize: 10, rotate: labels.length > 18 ? 40 : 0 },
      axisLine: { lineStyle: { color: CHART_SPLIT } },
    },
    yAxis: {
      type: "value",
      name: unit,
      nameTextStyle: { color: CHART_AXIS },
      axisLabel: { color: CHART_AXIS },
      splitLine: { lineStyle: { color: CHART_SPLIT } },
    },
    series: [
      { type: "boxplot", data: boxes },
      { type: "scatter", data: outliers, symbolSize: 6, itemStyle: { color: "#fbbf24" } },
    ],
  };
}

function simHourlySocOption(dc, T) {
  const hours = dc?.hourly_mean?.soc_pct?.hours || Array.from({ length: 24 }, (_, i) => i);
  const labels = hours.map((h) => String(h).padStart(2, "0") + ":00");
  const { season, day } = simDispatchFilter;
  const series = [];
  const addLine = (s, color, name) => {
    series.push({
      name,
      type: "line",
      smooth: true,
      showSymbol: false,
      data: simDispatchHourlyData(dc, "soc_pct", s, day),
      lineStyle: { width: 2, color },
      itemStyle: { color },
    });
  };
  if (season === "all") {
    addLine("summer", "#f87171", T.summer);
    addLine("non_summer", "#60a5fa", T.nonSummer);
  } else {
    addLine(season, "#34d399", T.simDispatchSoc);
  }
  return {
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    textStyle: { color: CHART_AXIS },
    legend: series.length > 1 ? { textStyle: { color: CHART_AXIS }, top: 0 } : undefined,
    tooltip: { trigger: "axis", confine: true, valueFormatter: (v) => `${fmt(v, 1)} %` },
    grid: { left: 52, right: 16, top: series.length > 1 ? 36 : 16, bottom: 40 },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: CHART_AXIS, fontSize: 10 },
      axisLine: { lineStyle: { color: CHART_SPLIT } },
    },
    yAxis: {
      type: "value",
      name: "%",
      min: 0,
      max: 100,
      nameTextStyle: { color: CHART_AXIS },
      axisLabel: { color: CHART_AXIS },
      splitLine: { lineStyle: { color: CHART_SPLIT } },
    },
    series,
  };
}

function simHourlyPowerOption(dc, T) {
  const hours = dc?.hourly_mean?.load_kw?.hours || Array.from({ length: 24 }, (_, i) => i);
  const labels = hours.map((h) => String(h).padStart(2, "0") + ":00");
  const { season, day } = simDispatchFilter;
  const sea = season === "all" ? "all" : season;
  const palette = [
    ["load_kw", T.simDispatchLoad, "#5eeaff"],
    ["ess_kw", T.simDispatchEss, "#fbbf24"],
    ["net_kw", T.simDispatchNet, "#34d399"],
  ];
  const series = palette.map(([metric, name, color]) => ({
    name,
    type: "line",
    smooth: true,
    showSymbol: false,
    data: simDispatchHourlyData(dc, metric, sea, day),
    lineStyle: { width: 2, color },
    itemStyle: { color },
  }));
  return {
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    textStyle: { color: CHART_AXIS },
    legend: { textStyle: { color: CHART_AXIS }, top: 0 },
    tooltip: { trigger: "axis", confine: true, valueFormatter: (v) => `${fmt(v, 1)} kW` },
    grid: { left: 52, right: 16, top: 36, bottom: 40 },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: CHART_AXIS, fontSize: 10 },
      axisLine: { lineStyle: { color: CHART_SPLIT } },
    },
    yAxis: {
      type: "value",
      name: "kW",
      nameTextStyle: { color: CHART_AXIS },
      axisLabel: { color: CHART_AXIS },
      splitLine: { lineStyle: { color: CHART_SPLIT } },
    },
    series,
  };
}

function simDailyDispatchOption(dc, T) {
  const lnLoad = dc?.line?.load_kw || {};
  const lnEss = dc?.line?.ess_kw || {};
  const lnNet = dc?.line?.net_kw || {};
  const lnSoc = dc?.line?.soc_pct || {};
  const dates = lnLoad.dates || lnNet.dates || [];
  return {
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    textStyle: { color: CHART_AXIS },
    legend: { textStyle: { color: CHART_AXIS }, top: 0 },
    tooltip: { trigger: "axis", confine: true },
    grid: { left: 52, right: 48, top: 36, bottom: 40 },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: { color: CHART_AXIS, fontSize: 10, hideOverlap: true },
      axisLine: { lineStyle: { color: CHART_SPLIT } },
    },
    yAxis: [
      {
        type: "value",
        name: "kW",
        nameTextStyle: { color: CHART_AXIS },
        axisLabel: { color: CHART_AXIS },
        splitLine: { lineStyle: { color: CHART_SPLIT } },
      },
      {
        type: "value",
        name: "%",
        min: 0,
        max: 100,
        nameTextStyle: { color: CHART_AXIS },
        axisLabel: { color: CHART_AXIS },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: T.simDispatchLoad,
        type: "line",
        data: lnLoad.mean_kw || [],
        showSymbol: dates.length <= 60,
        symbolSize: 4,
        lineStyle: { width: 2, color: "#5eeaff" },
        itemStyle: { color: "#5eeaff" },
      },
      {
        name: T.simDispatchEss,
        type: "line",
        data: lnEss.mean_kw || [],
        showSymbol: dates.length <= 60,
        symbolSize: 4,
        lineStyle: { width: 2, color: "#fbbf24" },
        itemStyle: { color: "#fbbf24" },
      },
      {
        name: T.simDispatchNet,
        type: "line",
        data: lnNet.mean_kw || [],
        showSymbol: dates.length <= 60,
        symbolSize: 4,
        lineStyle: { width: 2, color: "#34d399" },
        itemStyle: { color: "#34d399" },
      },
      {
        name: T.simDispatchSoc,
        type: "line",
        yAxisIndex: 1,
        data: lnSoc.mean_kw || [],
        showSymbol: dates.length <= 60,
        symbolSize: 4,
        lineStyle: { width: 2, color: "#fbbf24" },
        itemStyle: { color: "#fbbf24" },
      },
    ],
  };
}

function simDispatchMetricUnit(metric) {
  return metric === "soc_pct" ? "%" : "kW";
}

function renderSimDispatchCharts(res, T) {
  const key = simDispatchChartKey || simRowChartKey(simViewRow(res));
  const dc = simDispatchChartsForKey(res, key);
  if (!dc || typeof echarts === "undefined") {
    disposeSimDispatchCharts();
    return;
  }

  try {
    disposeSimDispatchCharts();

    const panels = [
      ["simHourlySocChart", () => simHourlySocOption(dc, T)],
      ["simHourlyPowerChart", () => simHourlyPowerOption(dc, T)],
      ["simDailyDispatchChart", () => simDailyDispatchOption(dc, T)],
      ["simDispatchHeatmap", () => simMetricHeatmapOption(dc, simDispatchFilter.heatmap, simDispatchMetricUnit(simDispatchFilter.heatmap))],
      ["simDispatchBoxplot", () => simMetricBoxplotOption(dc, simDispatchFilter.heatmap, simDispatchMetricUnit(simDispatchFilter.heatmap))],
    ];
    for (const [id, optFn] of panels) {
      const el = document.getElementById(id);
      if (!el) continue;
      const chart = echarts.init(el);
      chart.setOption(optFn());
      simDispatchCharts.push(chart);
    }

    if (simChartResize) window.removeEventListener("resize", simChartResize);
    simChartResize = () => {
      if (simSavingsChart) simSavingsChart.resize();
      simDispatchCharts.forEach((c) => c.resize());
    };
    window.addEventListener("resize", simChartResize);
    resizeSimDispatchCharts();
  } catch (err) {
    console.warn("sim dispatch charts", err);
  }
}

function bindSimDispatchCharts(res, T) {
  const seasonEl = document.getElementById("simDispatchSeason");
  const dayEl = document.getElementById("simDispatchDay");
  const metricEl = document.getElementById("simDispatchMetric");
  const rerender = () => renderSimDispatchCharts(res, T);
  document.querySelectorAll(".sim-view-tab").forEach((btn) => {
    btn.onclick = () => setSimViewMode(btn.dataset.mode, res, T);
  });
  if (seasonEl) {
    seasonEl.onchange = () => {
      simDispatchFilter.season = seasonEl.value;
      rerender();
    };
  }
  if (dayEl) {
    dayEl.onchange = () => {
      simDispatchFilter.day = dayEl.value;
      rerender();
    };
  }
  if (metricEl) {
    metricEl.onchange = () => {
      simDispatchFilter.heatmap = metricEl.value;
      rerender();
    };
  }
}

function simulateRunKey() {
  try {
    const {
      detailTab: _detailTab,
      seededImportKey: _seededImportKey,
      ...simulate
    } = session.simulate || {};
    return [
      session.importId || "",
      session.tou || "",
      session.voltage || "",
      JSON.stringify(session.contractValues || {}),
      JSON.stringify(simulate),
      JSON.stringify(session.rates || {}),
      JSON.stringify(session.schedule || {}),
      JSON.stringify(session.holidays || []),
    ].join("|");
  } catch {
    return "";
  }
}

function isSimulateResultStale() {
  if (!normalizeSimulateSizeResult(session.lastSimulateSize)) return false;
  if (!session.simulateResultKey) return false;
  return session.simulateResultKey !== simulateRunKey();
}

function clearSimulateResult() {
  simulateJob += 1;
  simulateFetch = null;
  simulateSampleFetch = null;
  simPinnedRun = null;
  simDispatchChartKey = null;
  simViewMode = "recommended";
  simDispatchChartCache = {};
  simDispatchChartPending = {};
  simDispatchCacheResultKey = null;
  simDispatchChartLoadId += 1;
  Object.assign(simDispatchFilter, {
    season: "all",
    day: "weekday",
    heatmap: "net_kw",
  });
  session.lastSimulateSize = null;
  session.lastSimulateSample = null;
  session.simulateError = null;
  session.simulateResultKey = null;
  session._scrollSimReport = false;
  persistSession();
}

function renderSimRunBar(T) {
  const sizing = !!simulateFetch;
  const sampling = !!simulateSampleFetch;
  const running = sizing || sampling;
  const res = normalizeSimulateSizeResult(session.lastSimulateSize);
  const hasResult = !!res;
  const stale = isSimulateResultStale();
  let metaMsg = "";
  let metaErr = false;
  if (session.simulateError) {
    metaMsg = `${T.simErr}: ${session.simulateError}`;
    metaErr = true;
  } else if (stale && hasResult && !running) {
    metaMsg = T.simResultStale;
    metaErr = true;
  }
  const runLabel = hasResult ? T.simRerun : T.run;
  const clearBtn = hasResult || running
    ? `<button type="button" class="btm-btn btm-btn--ghost" id="btnSimulateClear"${running ? " disabled" : ""}>${T.simClearResult}</button>`
    : "";
  const metaHtml = metaMsg
    ? `<p class="btm-meta${metaErr ? " btm-meta--err" : ""}" id="simMeta">${metaMsg}</p>`
    : `<p class="btm-meta btm-meta--hidden" id="simMeta" hidden></p>`;

  return `<div class="sim-run-bar">
    <div class="sim-run-bar__actions">
      <button type="button" class="btm-btn btm-btn--primary" id="btnSimulate"${running ? " disabled" : ""}>${runLabel}</button>
      ${clearBtn}
    </div>
    ${metaHtml}
  </div>`;
}

function renderSimReportSection(T) {
  const sizing = !!simulateFetch;
  const sampling = !!simulateSampleFetch;
  const res = normalizeSimulateSizeResult(session.lastSimulateSize);
  // 樣本階段：報告區先不出現；樣本完成後才顯示試算中
  if (sampling && !sizing) return "";
  if (sizing && simPinnedRun) {
    const msg = res ? T.simRunningKeep : T.simSizingRunning;
    return `<section class="btm-card hud-panel hud-frame sim-report sim-report--busy">
      <h2 class="btm-card__title seetel-title">${T.simReport}</h2>
      ${busyBlockHtml(msg)}
    </section>`;
  }
  if (!sizing && !res) return "";

  if (sizing) {
    const msg = res ? T.simRunningKeep : T.simSizingRunning;
    return `<section class="btm-card hud-panel hud-frame sim-report sim-report--busy">
      <h2 class="btm-card__title seetel-title">${T.simReport}</h2>
      ${busyBlockHtml(msg)}
    </section>`;
  }

  return renderSimulateResult(T, res);
}

function activeSimulateSample() {
  if (session.lastSimulateSample && typeof session.lastSimulateSample === "object") {
    return session.lastSimulateSample;
  }
  const res = normalizeSimulateSizeResult(session.lastSimulateSize);
  if (!res || !res.profile_stats) return null;
  return {
    profile_stats: res.profile_stats,
    grid_points: res.grid_points,
    peak_hours_max: res.peak_hours_max,
    two_cycle_hours_max: res.two_cycle_hours_max,
    contract_adjustment: res.contract_adjustment,
  };
}

function simSampleKw(v) {
  return v != null && v !== "" ? `${fmt(v, 1)} <small>kW</small>` : "—";
}

function simSampleKwh(v) {
  return v != null && v !== "" ? `${fmt(v, 1)} <small>kWh</small>` : "—";
}

function simSampleHours(v) {
  return v != null && v !== "" ? `${fmt(v, 1)} <small>h</small>` : "—";
}

function simSamplePct(v) {
  return v != null && v !== "" ? `${fmt(v, 1)}%` : "—";
}

function simSampleTierCardHtml(tier, title, basisRows, pcsKw, util, cov, T) {
  const basis = basisRows.map(([lab, valHtml]) => `
    <div class="sim-sample-tier__row">
      <span class="sim-sample-tier__lab">${lab}</span>
      <span class="sim-sample-tier__val">${valHtml}</span>
    </div>`).join("");
  return `<article class="sim-sample-tier hud-panel hud-frame sim-sample-tier--${tier}">
    <header class="sim-sample-tier__head">
      <h3 class="sim-sample-tier__title">${title}</h3>
      <p class="btm-meta sim-sample-tier__basis-lab">${T.simSampleBasis}</p>
    </header>
    <div class="sim-sample-tier__basis">${basis}</div>
    <div class="sim-sample-tier__pcs">
      <span class="sim-sample-tier__lab">${T.simPcsResult}</span>
      <span class="sim-sample-tier__pcs-val">${simSampleKw(pcsKw)}</span>
    </div>
    <div class="sim-sample-tier__metrics">
      <div class="sim-sample-tier__metric">
        <span class="sim-sample-tier__lab">${T.simPeakEssUtil}</span>
        <span class="sim-sample-tier__metric-val">${simSamplePct(util)}</span>
      </div>
      <div class="sim-sample-tier__metric">
        <span class="sim-sample-tier__lab">${T.simPeakCoverage}</span>
        <span class="sim-sample-tier__metric-val">${simSamplePct(cov)}</span>
      </div>
    </div>
  </article>`;
}

function simSampleTierCardsHtml(stats, T) {
  if (!stats || !stats.ok) {
    return `<p class="btm-meta">${stats && stats.reason ? stats.reason : "—"}</p>`;
  }
  const pcs = stats.pcs_sample || {};
  const peak = stats.peak_load || {};
  const off = stats.off_margin || {};
  const util = stats.peak_ess_util || {};
  const cov = stats.peak_coverage || {};
  const fc = stats.full_cover_sources || null;
  const tc = stats.two_cycle_sources || null;
  const tierLabel = {
    full_cover: T.simFullCover,
    max: T.simStatMax,
    avg: T.simStatAvg,
    min: T.simStatMin,
    two_cycle: T.simTwoCycle,
  };
  const cards = [];
  if (Number(pcs.full_cover) > 0 && fc) {
    cards.push(simSampleTierCardHtml(
      "full_cover",
      tierLabel.full_cover,
      [
        [T.simMaxPeakKw, simSampleKw(fc.max_peak_kw)],
        [T.simMaxDayPeakKwh, simSampleKwh(fc.max_day_peak_kwh)],
      ],
      pcs.full_cover,
      util.full_cover,
      cov.full_cover,
      T
    ));
  }
  for (const k of ["max", "avg", "min"]) {
    if (!(Number(pcs[k]) > 0)) continue;
    cards.push(simSampleTierCardHtml(
      k,
      tierLabel[k],
      [
        [T.simPeakLoad, simSampleKw(peak[k])],
        [T.simOffMargin, simSampleKw(off[k])],
      ],
      pcs[k],
      util[k],
      cov[k],
      T
    ));
  }
  if (Number(pcs.two_cycle) > 0 && tc) {
    cards.push(simSampleTierCardHtml(
      "two_cycle",
      tierLabel.two_cycle,
      [
        [T.simHalfPeakNs, simSampleKw((tc.half_peak || {}).avg)],
        [T.simOffMargin, simSampleKw((tc.off_margin || {}).avg)],
        [T.simMidOffMargin, simSampleKw((tc.mid_off_margin || {}).avg)],
      ],
      pcs.two_cycle,
      util.two_cycle,
      cov.two_cycle,
      T
    ));
  }
  return `<div class="sim-sample-tiers">${cards.join("")}</div>`;
}

function renderSimSampleSection(T) {
  const sampling = !!simulateSampleFetch;
  const sizing = !!simulateFetch;
  // 取樣中不回退到舊報告的 profile，避免舊表＋「計算中」疊在一起
  const sample = sampling ? session.lastSimulateSample : activeSimulateSample();
  if (!sampling && !sample) return "";
  let metaLine = "";
  if (sample) {
    metaLine = T.simSampleMeta
      .replace("{pts}", sample.grid_points != null ? sample.grid_points : "—")
      .replace("{h}", sample.peak_hours_max != null ? sample.peak_hours_max : "—");
    if (sample.two_cycle_hours_max) {
      metaLine += T.simSampleMetaTwoCycle.replace("{h2}", sample.two_cycle_hours_max);
    }
  }
  const chip = sample ? simContractAdjustChip(T, sample.contract_adjustment) : "";
  const body = sampling && !sample
    ? busyBlockHtml(T.simSampleRunning)
    : `${sampling ? busyBlockHtml(T.simSampleRunning) : ""}
      ${sample ? simSampleTierCardsHtml(sample.profile_stats, T) : ""}
      <div class="sim-sample__footer">
        ${sample && metaLine ? `<span class="btm-chip btm-chip--dim">${metaLine}</span>` : ""}
        ${chip}
      </div>`;
  return `<section class="btm-card hud-panel hud-frame sim-sample${sampling || sizing ? " sim-sample--busy" : ""}">
    <h2 class="btm-card__title seetel-title">${T.simSample}</h2>
    ${body}
  </section>`;
}

function simContractAdjustChip(T, adj) {
  if (!adj || typeof adj !== "object" || adj.reason === "disabled") return "";
  if (adj.applied) {
    return `<span class="btm-chip btm-chip--on">${T.offPeakBoostApplied.replace("{kw}", fmt(adj.added_kw, 1))}</span>`;
  }
  return `<span class="btm-chip btm-chip--dim">${T.offPeakBoostSkipped}</span>`;
}

function renderSimulateResult(T, res) {
  const r = res.recommended || res.best_effort;
  if (!r) return "";
  const viable = !!res.viable;
  const days = simReportDays();
  const fnChips = (res.functions || ["tou"]).map((f) =>
    `<span class="btm-chip btm-chip--dim">${simFnLabel(f)}</span>`).join("");
  const skipped = (res.skipped || []).length
    ? `<p class="btm-meta">${T.simSkipped}: ${res.skipped.join(", ")}</p>`
    : "";
  const warn = viable
    ? ""
    : `<p class="sim-report__warn btm-meta btm-meta--err">${T.simNoViable}</p>`;
  const sizeLabel = viable ? T.simKpiSize : T.simTagBest;
  const saveKpiClass = Number(res.savings) >= 0 ? " dash-kpi--energy" : " dash-kpi--loss";
  const metaLine = (() => {
    let s = T.simSampleMeta
      .replace("{pts}", res.grid_points != null ? res.grid_points : (res.grid || []).length)
      .replace("{h}", res.peak_hours_max != null ? res.peak_hours_max : "—");
    if (res.two_cycle_hours_max) {
      s += T.simSampleMetaTwoCycle.replace("{h2}", res.two_cycle_hours_max);
    }
    return s;
  })();

  return `<section class="btm-card hud-panel hud-frame sim-report">
    <h2 class="btm-card__title seetel-title">${T.simReport}</h2>
    ${warn}
    <div class="sim-report__meta">
      <span class="btm-chip btm-chip--dim">${metaLine}</span>
      ${fnChips}
      ${simContractAdjustChip(T, res.contract_adjustment)}
    </div>
    <div class="dash-kpis sim-report__kpis">
      ${dashKpiHtml(T.simKpiBefore, res.before && res.before.total, days)}
      ${dashKpiHtml(T.simKpiAfter, res.after && res.after.total, days)}
      ${dashKpiHtml(T.simKpiSave, res.savings, days, saveKpiClass)}
      <article class="dash-kpi hud-panel hud-frame${viable ? " dash-kpi--total" : ""}">
        <div class="dash-kpi__label">${sizeLabel}</div>
        <div class="dash-kpi__value sim-size-kpi">${fmt(r.pcs_kw, 0)} <span>kW</span> / ${fmt(r.batt_kwh, 0)} <span>kWh</span></div>
        <div class="dash-kpi__annual"><span>${T.simHours}</span> <strong>${fmt(r.hours, 1)}</strong>
        · <span>${T.simKpiSavePct}</span> <strong>${fmt(r.savings_pct != null ? r.savings_pct : res.savings_pct, 1)}%</strong></div>
      </article>
    </div>

    <h3 class="btm-subhead">${T.simSavingsChart}</h3>
    <div id="simSavingsChart" class="sim-savings-chart" role="img" aria-label="${T.simSavingsChart}"></div>

    ${simViewPanelHtml(res, T)}

    <h3 class="btm-subhead">${T.simGridResults}</h3>
    ${simGridResultsHtml(res, T)}
    ${skipped}
  </section>`;
}

function renderSimulateParams(T, sim) {
  return `<section class="btm-card hud-panel hud-frame">
      <h2 class="btm-card__title seetel-title">${T.simParams}</h2>
      <div class="sim-params-block">
        <h3 class="btm-subhead">${T.batterySoc}</h3>
        <div class="btm-row">
          ${simNumField("socMax", T.socMax, pctDisplay(sim.socMax), 1, 0, 100)}
          ${simNumField("socMin", T.socMin, pctDisplay(sim.socMin), 1, 0, 100)}
          ${simNumField("chargeEff", T.chargeEff, pctDisplay(sim.chargeEff), 0.1, 50, 100)}
        </div>
      </div>
      <div class="sim-params-block">
        <h3 class="btm-subhead">${T.gridReserve}</h3>
        <div class="btm-row">
          ${simNumField("demandBufferKw", T.demandBufferKw, sim.demandBufferKw, 1, 0, undefined, T.demandBufferHint)}
          ${simNumField("antiExportKw", T.antiExportKw, sim.antiExportKw, 1, 0, undefined, T.antiExportHint)}
        </div>
      </div>
    </section>`;
}

function renderSimulateFunctions(T, sim) {
  return `<section class="btm-card hud-panel hud-frame" id="simDetails">
      <h2 class="btm-card__title seetel-title">${T.functions}</h2>
      <p class="btm-meta sim-fn-hint">${T.fnHint}</p>
      ${renderSimulateTabs(T, sim)}
      <div class="sim-tab-panels">
        ${renderSimulatePanelTou(T, sim)}
        ${renderSimulatePanelDemand(T, sim)}
        ${renderSimulatePanelReserve(T, sim)}
        ${renderSimulatePanelBackup(T, sim)}
        ${renderSimulatePanelLargeUser(T, sim)}
      </div>
    </section>
    ${renderSimRunBar(T)}
    ${renderSimLastRunCard(T)}
    ${renderSimSampleSection(T)}
    ${renderSimReportSection(T)}`;
}

function renderSimulate() {
  const busy = routeBusyHtml(ROUTES.SIMULATE);
  if (busy) return busy;
  const T = I18N[locale].simulate;
  const sim = session.simulate;
  const hasImport = !!session.importId;
  const hasSimResult = !!normalizeSimulateSizeResult(session.lastSimulateSize);
  if (hasImport) seedSimulateFromImport(false);
  const simTou = activeSimulateTou();
  sim.touSchedule = normalizeScheduleMatrix(sim.touSchedule, () => defaultTouSlots(simTou));
  sim.reserveSchedule = normalizeScheduleMatrix(sim.reserveSchedule, defaultReserveHourly);

  return `<div class="btm-page btm-page--sim">
    ${headerHtml("simulate.title", hasImport || hasSimResult ? metaChipsHtml() : "")}
    ${renderSimulateParams(T, sim)}
    ${hasImport ? renderSimulateFunctions(T, sim) : `${emptyImportHtml({ id: "simDetails" })}${renderSimReportSection(T)}`}
  </div>`;
}

function renderSimulatePanelTou(T, sim) {
  const tou = activeSimulateTou();
  return `<div class="sim-tab-panel${sim.detailTab === "tou" ? "" : " sim-tab-panel--hidden"}" data-panel="tou">
    ${renderScheduleBlock("tou", "touScheduleMode", "touSchedule", sim, T, {
      header: T.touTargetSoc,
      min: 0,
      max: 100,
      step: 1,
      slotMinutes: touStepMinutes(tou),
      touType: tou,
    })}
  </div>`;
}

function renderSimulatePanelDemand(T, sim) {
  return `<div class="sim-tab-panel${sim.detailTab === "demand" ? "" : " sim-tab-panel--hidden"}" data-panel="demand">
    <label class="sim-check sim-check--block">
      <input type="checkbox" data-sim-check="autoAdjustOffPeakContract"${sim.autoAdjustOffPeakContract ? " checked" : ""}>
      ${T.offPeakContractBoost}
    </label>
  </div>`;
}

function renderSimulatePanelReserve(T, sim) {
  const maxMw = simMaxReserveBidMw();
  return `<div class="sim-tab-panel${sim.detailTab === "reserve" ? "" : " sim-tab-panel--hidden"}" data-panel="reserve">
    ${renderScheduleBlock("reserve", "reserveScheduleMode", "reserveSchedule", sim, T, {
      header: T.reserveBidMw,
      min: 0,
      max: maxMw > 0 ? maxMw : undefined,
      step: 0.1,
      slotMinutes: 60,
      badge: maxMw > 0
        ? `<span class="btm-chip btm-chip--dim">${T.reserveMaxLabel} ${maxMw} MW</span>`
        : `<span class="btm-chip btm-chip--warn">${T.reserveNoContract}</span>`,
    })}
  </div>`;
}

function renderSimulatePanelBackup(T, sim) {
  return `<div class="sim-tab-panel${sim.detailTab === "backup" ? "" : " sim-tab-panel--hidden"}" data-panel="backup">
    <div class="btm-row">
      ${simNumField("backupReserveKwh", T.backupReserveKwh, sim.backupReserveKwh, 1, 0, undefined, T.backupReserveHint)}
    </div>
  </div>`;
}

function renderSimulatePanelLargeUser(T, sim) {
  const regular = Number(session.contractValues.regular_kw || 0);
  const ratio = Number(sim.largeUserRatio) || 0;
  const applies = regular >= LARGE_USER_MIN_KW;
  const oblKw = regular > 0 ? Math.round(regular * ratio * 10) / 10 : null;
  const preview = oblKw == null
    ? `<p class="btm-meta">${T.largeUserNoContract}</p>`
    : `<div class="sim-obl-preview">
        <div class="sim-obl-preview__item"><span>${T.largeUserMinKw}</span><strong class="${applies ? "sim-obl--ok" : "sim-obl--warn"}">${applies ? T.largeUserApplies : T.largeUserExempt}（≥ ${LARGE_USER_MIN_KW} kW）</strong></div>
        <div class="sim-obl-preview__item"><span>${T.largeUserOblKw}</span><strong>${oblKw} kW</strong></div>
      </div>`;

  return `<div class="sim-tab-panel${sim.detailTab === "large_user" ? "" : " sim-tab-panel--hidden"}" data-panel="large_user">
    <div class="btm-row">
      ${simNumField("largeUserRatio", T.largeUserRatio, sim.largeUserRatio, 0.01, 0, 1)}
      ${simNumField("largeUserPowerRatio", T.largeUserPowerRatio, sim.largeUserPowerRatio, 0.01, 0, 1)}
    </div>
    ${preview}
  </div>`;
}

function bindSimulate() {
  if (session.importId && !session.schedule) {
    ensureSettingsLoaded().then((ok) => {
      if (ok) {
        seedSimulateFromImport(true);
        renderPage({ animate: false, preserveScroll: true });
      }
    });
  }

  document.querySelectorAll('[name="bessFn"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      if (el.checked) {
        session.simulate.detailTab = el.value;
        persistSession();
      }
      syncSimulateTabs();
    });
  });
  document.querySelectorAll(".sim-tab").forEach((el) => {
    el.addEventListener("click", (ev) => {
      if (ev.target.closest(".sim-tab-check")) return;
      const tab = el.dataset.tab;
      const fns = session.simulate.functions;
      if (tab !== "tou" && !fns.includes(tab)) return;
      session.simulate.detailTab = tab;
      persistSession();
      syncSimulateTabs();
    });
  });
  document.querySelectorAll('[name="touScheduleMode"], [name="reserveScheduleMode"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      syncSimulateTabs();
    });
  });
  document.querySelectorAll('[data-sim="largeUserRatio"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      renderPage({ animate: false, preserveScroll: true });
    });
  });
  document.querySelectorAll("[data-sim], [data-sim-check], [data-sched]").forEach((el) => {
    if (el.dataset.sim === "largeUserRatio") return;
    el.addEventListener("change", () => {
      readSimulateForm();
    });
    if (el.dataset.sched) {
      el.addEventListener("input", () => {
        readSimulateForm();
      });
    }
  });
  syncSimulateTabs();

  async function startSimulateRun() {
    if (simulateFetch || simulateSampleFetch) return;
    readSimulateForm();
    const meta = document.getElementById("simMeta");
    if (!requireLiveImportOrRedirect()) return;
    await ensureSettingsLoaded();
    const contracts = buildContractsFromSession();
    if (!contracts) {
      setRunMeta(meta, t("import.needSchema"), true);
      return;
    }
    const fdSample = new FormData();
    fdSample.append("import_id", session.importId);
    fdSample.append("contracts", JSON.stringify(contracts));
    fdSample.append("simulate", JSON.stringify(session.simulate));
    appendOverrides(fdSample);
    const fdSize = new FormData();
    fdSize.append("import_id", session.importId);
    fdSize.append("contracts", JSON.stringify(contracts));
    fdSize.append("simulate", JSON.stringify(session.simulate));
    appendOverrides(fdSize);
    const id = ++simulateJob;
    const prev = normalizeSimulateSizeResult(session.lastSimulateSize);
    if (prev) {
      simPinnedRun = simSnapshotFromResult(prev);
      simDismissedSnapshot = null;
    }
    session.simulateError = null;
    session._scrollSimReport = false;
    // 重新試算：先清舊樣本，顯示「計算樣本中」
    session.lastSimulateSample = null;
    simulateSampleFetch = apiJson("/api/simulate/sample", { method: "POST", body: fdSample });
    renderPage({ animate: false, preserveScroll: !!prev });

    try {
      const sample = await simulateSampleFetch;
      if (id !== simulateJob) return;
      session.lastSimulateSample = sample;
      simulateSampleFetch = null;
      persistSession();
      simulateFetch = apiJson("/api/simulate/size", { method: "POST", body: fdSize });
      renderPage({ animate: false, preserveScroll: !!prev });

      const res = await simulateFetch;
      if (id !== simulateJob) return;
      simDispatchChartKey = null;
      simViewMode = "recommended";
      simDispatchChartCache = {};
      simDispatchChartLoadId += 1;
      session.lastSimulateSize = normalizeSimulateSizeResult(res);
      // 保留 /sample 完整 profile；勿用 /size 精簡結果覆寫（否則卡片依據會空掉）
      if (res) {
        const prevSample = session.lastSimulateSample;
        const rich = prevSample?.profile_stats?.peak_load
          || prevSample?.profile_stats?.two_cycle_sources
          || prevSample?.profile_stats?.full_cover_sources;
        session.lastSimulateSample = {
          profile_stats: rich
            ? prevSample.profile_stats
            : (res.profile_stats || prevSample?.profile_stats || null),
          grid_points: res.grid_points ?? prevSample?.grid_points,
          peak_hours_max: res.peak_hours_max ?? prevSample?.peak_hours_max,
          two_cycle_hours_max: res.two_cycle_hours_max ?? prevSample?.two_cycle_hours_max,
          contract_adjustment: res.contract_adjustment ?? prevSample?.contract_adjustment,
          sample_source: res.sample_source ?? prevSample?.sample_source,
        };
      }
      session.simulateResultKey = simulateRunKey();
      session.simulateError = null;
      simPinnedRun = null;
      simDismissedSnapshot = null;
      session._scrollSimReport = true;
      persistSession();
    } catch (err) {
      if (id !== simulateJob) return;
      session.simulateError = String(err.message || err);
      persistSession();
      if (isImportExpiredError(err)) {
        redirectImportExpired();
        return;
      }
    } finally {
      if (id !== simulateJob) return;
      simulateFetch = null;
      simulateSampleFetch = null;
      if (parseRoute() === ROUTES.SIMULATE) {
        renderPage({ animate: false, preserveScroll: !session._scrollSimReport });
      }
    }
  }

  const btn = document.getElementById("btnSimulate");
  if (btn) btn.onclick = () => { startSimulateRun(); };

  const clearBtn = document.getElementById("btnSimulateClear");
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (simulateFetch || simulateSampleFetch) return;
      const prev = normalizeSimulateSizeResult(session.lastSimulateSize);
      if (prev) simDismissedSnapshot = simSnapshotFromResult(prev);
      simPinnedRun = null;
      clearSimulateResult();
      renderPage({ animate: false, preserveScroll: true });
    };
  }

  document.getElementById("btnSimDismissSnapshot")?.addEventListener("click", () => {
    simDismissedSnapshot = null;
    renderPage({ animate: false, preserveScroll: true });
  });

  const simRes = normalizeSimulateSizeResult(session.lastSimulateSize);
  if (simRes) {
    requestAnimationFrame(() => {
      renderSimSavingsChart(simRes, I18N[locale].simulate);
      const T = I18N[locale].simulate;
      seedSimDispatchCache(simRes);
      bindSimDispatchCharts(simRes, T);
      ensureSimDispatchCharts(simRes, T).then(() => {
        prefetchSimViewCharts(simRes, T).catch((err) => {
          console.warn("sim dispatch prefetch", err);
        });
      });
      if (session._scrollSimReport) {
        session._scrollSimReport = false;
        document.querySelector(".sim-report")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

function buildPageHtml(route) {
  if (route === ROUTES.SETTINGS) return renderSettings();
  if (route === ROUTES.IMPORT) return renderImport();
  if (route === ROUTES.CHARTS) return renderCharts();
  if (route === ROUTES.SIMULATE) return renderSimulate();
  return renderDashboard();
}

function bindCurrentPage(route) {
  disposeCharts();
  if (route === ROUTES.SETTINGS) bindSettings();
  else if (route === ROUTES.IMPORT) bindImport();
  else if (route === ROUTES.CHARTS) bindCharts();
  else if (route === ROUTES.SIMULATE) bindSimulate();
}

function renderPage(options = {}) {
  const main = document.getElementById("main-content");
  const root = document.getElementById("page-root");
  if (!main || !root) return;

  const prevRoute = currentRoute;
  const nextRoute = parseRoute();
  const isRouteChange = prevRoute !== nextRoute;
  const animate = options.animate ?? isRouteChange;
  const preserveScroll = options.preserveScroll ?? !isRouteChange;
  const scrollTop = preserveScroll ? main.scrollTop : 0;
  const gen = ++renderGeneration;

  const commit = () => {
    if (gen !== renderGeneration) return;
    currentRoute = nextRoute;
    root.classList.remove("page-fade", "page-fade-out");
    root.style.opacity = "";
    setActiveNav(currentRoute);
    root.innerHTML = buildPageHtml(currentRoute);
    bindCurrentPage(currentRoute);
    persistSession();
    if (preserveScroll) main.scrollTop = scrollTop;
    if (animate) {
      root.classList.add("page-fade");
      const onEnd = () => {
        root.classList.remove("page-fade");
        root.removeEventListener("animationend", onEnd);
      };
      root.addEventListener("animationend", onEnd);
    }
  };

  if (animate && root.childElementCount > 0) {
    root.classList.remove("page-fade");
    root.classList.add("page-fade-out");
    let settled = false;
    const finishOut = () => {
      if (settled || gen !== renderGeneration) return;
      settled = true;
      root.removeEventListener("animationend", finishOut);
      commit();
    };
    root.addEventListener("animationend", finishOut);
    window.setTimeout(finishOut, 180);
    return;
  }
  commit();
}

async function boot() {
  restoreSession();
  bindSidebar();
  updateSidebarI18n();
  document.documentElement.lang = locale === "en" ? "en" : "zh-Hant";
  await ensureSettingsLoaded();
  try {
    session.schemas = await apiJson("/api/settings/contracts");
  } catch {
    session.schemas = null;
  }
  try {
    const data = await apiJson("/api/import/samples");
    session.samples = data.files || [];
  } catch {
    session.samples = [];
  }
  await probeImport();
  window.addEventListener("popstate", () => renderPage({ animate: true }));
  const route = parseRoute();
  syncUrl(route, true);
  renderPage();
}

boot();
