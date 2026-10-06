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
      overageTab: "超約電費",
      energy: "流動電費",
      total: "合計",
      annual: "年化（粗估）",
      months: "月明細",
      monthsTab: "每月明細",
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
      loading: "圖表繪製中…",
      heatmap: "熱力圖",
      boxplot: "箱型圖",
      line: "折線圖",
      peak: "日最高",
      mean: "日平均",
      seasonAll: "全部",
      dayAll: "全部",
      month: "月份",
      monthAll: "全部月份",
      weekday: "平日",
      holiday: "假日",
    },
    import: {
      title: "資料匯入",
      upload: "本機上傳",
      sample: "範例檔",
      loadSample: "載入",
      expired: "資料逾期，請重新匯入",
      start: "開始日",
      end: "結束日",
      contracts: "契約容量",
      range: "區間／方案",
      bill: "匯入",
      clear: "清除資料",
      needFile: "請先選檔",
      needDates: "請先有開始／結束日（選檔會自動偵測）",
      needSchema: "契約欄位尚未載入",
      needRegular: "經常契約須大於 0",
    },
    settings: {
      title: "設定",
      load: "重新載入系統預設",
      energy: "流動電價（元／kWh）",
      demand: "基本電費（元／kW）",
      tabRates: "電費單價",
      tabTime: "時間軸",
      tabHolidays: "紀念日及節日",
      na: "不適用",
      summerRange: "夏月區間",
      schedule: "時段",
      holidays: "假日",
      holidayDate: "日期",
      holidayName: "名稱",
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
      demand: "契約容量",
      tou: "時間電價",
      reserve: "即時備轉",
      backup: "緊急備援",
      backupReserveKwh: "保留電量（kWh）",
      largeUser: "用電大戶",
      run: "開始試算",
      simClearResult: "清除結果",
      simExportXlsx: "匯出 XLSX",
      simExporting: "匯出中…",
      simExportErr: "匯出失敗",
      simResultStale: "參數或契約已變更，報告可能與目前設定不符，請清除結果後再開始試算。",
      simStepParams: "參數",
      simStepFns: "功能",
      simStepConfig: "配置",
      simStepResult: "結果",
      simNext: "下一步",
      simBack: "上一步",
      loading: "匯入資料中…",
      simErr: "試算失敗",
      simSavings: "預估節省（元）",
      simSkipped: "略過功能",
      simBatt: "Battery（kWh）",
      simHours: "時數（h）",
      simReport: "效益報告",
      simBenefitBasic: "基本電費",
      simBenefitEnergy: "流動電費",
      simBenefitOverage: "超約電費",
      simBenefitExtra: "額外效益",
      simBenefitBefore: "原始",
      simBenefitAfter: "儲能後",
      simBenefitAmount: "效益",
      simBenefitIncrease: "增加",
      simBenefitBasicSourceContract: "契約容量調整",
      simBenefitBasicSourcePlan: "電價方案變更",
      simBenefitBasicSourceBoth: "電價方案與契約容量調整",
      simBenefitReserveCapacity: "容量費",
      simBenefitReservePerformance: "效能費",
      simBenefitReserveActivation: "調度電能",
      simKpiBefore: "原始電費",
      simKpiAfter: "更改後電費",
      simPlanChange: "方案更改",
      simScenarioPlan: "模擬電價方案",
      simScenarioContracts: "模擬契約容量",
      simKwhBefore: "原始（無儲能）",
      simKwhAfter: "更改後（含儲能）",
      simReportPlan: "方案",
      simReportBaselineTou: "原始方案",
      simReportSimulateTou: "更改方案",
      simXferSideBefore: "僅原始",
      simXferSideAfter: "僅更改後",
      simKpiSave: "節省",
      simKpiSavePct: "節省率",
      simKpiBillSave: "電費節省",
      simKpiReserveIncome: "備轉收入",
      simKpiTotalBenefit: "合計效益",
      simKpiSize: "推薦配置",
      simSizingRunning: "試算中…",
      simEvaluatingExtras: "評估契約與備轉…",
      simFullRetry: "重試契約／備轉",
      simFullFailedKeep: "契約／備轉評估失敗，已保留推薦配置",
      simSampleRunning: "計算樣本中…",
      simStrategyRefreshing: "更新策略樣本中…",
      simWorkspaceLoading: "準備功能與策略樣本中…",
      simNeedStrategy: "請至少各勾一項功率面向與電量面向",
      simSpecialRule: "特殊",
      simSeedSrcCross: "組合",
      simPeakEssUtil: "尖峰PCS使用率",
      simPeakCoverage: "尖峰負載覆蓋率",
      simSampleMetaDone: "已試算 {pts} 組",
      simShortlistSummary: "{pts} 組 · PCS {pcsMin}–{pcsMax} kW · 電池 {battMin}–{battMax} kWh",
      simStrategyChange: "變更策略",
      simSizingMode: "試算方式",
      simSizingModeGrid: "交叉",
      simSizingModeSingle: "指定",
      simManualPcs: "PCS（kW）",
      simManualBatt: "電池容量（kWh）",
      simNeedManual: "請填入大於 0 的 PCS 與電池容量",
      simPowerSeeds: "功率面向",
      simEnergySeedsAuto: "電量面向",
      simStatusOn: "已計算",
      simStatusOff: "未啟用",
      simStatusSkip: "不適用",
      simStatusPending: "評估中",
      simStatusRolled: "已回退",
      simStatusAdopted: "採用",
      simStatusUnchanged: "維持現行",
      simFeatureResults: "功能結果",
      simFeatureDemand: "契約容量",
      simFeatureBackup: "備援",
      simFeatureReserve: "即時備轉",
      simMetricMode: "模式",
      simMetricBuffer: "防超約裕度",
      simMetricRegular: "採用經常契約",
      simMetricReducible: "可降低",
      simMetricPeakMax: "尖峰最高",
      simMetricHalfPeakDelta: "半尖峰補額",
      simMetricOffPeakReplace: "離峰補額",
      simMetricBackup: "備援保留",
      simMetricSocMin: "有效 SOC 下限",
      simMetricReserveIncome: "備轉收入",
      simMetricBenefit: "效益",
      simReasonDemandBuffer: "依契約上限與裕度執行防超約。",
      simReasonContractNoGain: "規則提案未降低期間總電費，維持現行契約。",
      simReasonContractRuleAdopted: "規則提案重算後可降低期間總電費，已採用。",
      simContractFnHint: "自動調整契約容量。",
      simContractCurrent: "現行契約",
      simContractFinal: "推薦更改",
      simContractAllowance: "容許額度",
      simContractPending: "正在依尖峰最高需量評估可調整的契約容量與各時段補額…",
      simReasonSocFloor: "保留備援電量並提高有效 SOC 下限。",
      simReasonAutoBid: "依可用 PCS 與 SOC 餘裕產生投標。",
      simReasonManualBid: "依使用者設定的投標排程。",
      simReasonNoNetGain: "備轉無淨增益，已回退為 0 投標。",
      simMapAxisPcs: "PCS（kW）",
      simMapAxisBatt: "電池（kWh）",
      simMapAxisSave: "期間節省（元）",
      simMapBest: "最佳推薦",
      simOtherPlans: "其他方案",
      simChartPcsUtil: "PCS 利用率（%）",
      simChartPeriodSave: "期間節省（元）",
      simChartMarkBatt: "每 kWh 效益",
      simBillSizingOnly: "含儲能",
      simBillAfterBess: "儲能後總電費",
      simBillWithContract: "含契約調整",
      simBillWithReserve: "含即時備轉",
      simDispatchSizing: "僅儲能調度",
      simDispatchFull: "含契約與備轉",
      simPeriodNote: "試算期間",
      simSeedSrcPower: "功率",
      simSeedSrcEnergy: "電量",
      simConfigPcs: "PCS",
      simConfigBatt: "電池",
      simStrategyMax: "Max 全覆蓋",
      simStrategyP50: "P50 典型",
      simStrategyP90: "P90 穩健",
      simStrategyUnavailable: "目前不可用",
      simIncludeHalfPeak: "考量半尖峰",
      simIncludeHalfOff: "關閉",
      simRecSchedules: "排程呈現",
      simRecTou: "時間電價目標 SOC",
      simRecReserve: "即時備轉投標",
      simEnergyTransfer: "用電轉移",
      simKwhDelta: "差異 kWh",
      simKwhDeltaPct: "差異％",
      simXferAmount: "金額差異",
      simXferItemAmount: "金額",
      simXferEffective: "有效轉移量",
      simXferEnergy: "流動電費差異",
      simGridFold: "配置組合試算",
      simGridFoldOpen: "展開",
      simTwoCycle: "兩充兩放",
      simViewPanel: "配置檢視",
      simViewRec: "推薦配置",
      simViewMaxSave: "金額最大",
      simViewMaxUtil: "使用率最大",
      simTagBest: "最大節省",
      simEnergyP50: "P50 典型",
      simEnergyP90: "P90 穩健",
      simEnergyMin: "Min 尖峰最小日",
      simEnergyMax: "Max 最大日",
      simExtraBenefit: "額外收益",
      simFinalDevice: "設備",
      simBenefitSizing: "量體節省",
      simBenefitContract: "契約調整",
      simBenefitReserve: "備轉收入",
      simBenefitTotal: "合計效益",
      simBenefitSplitHint: "地圖為第1層量體節省；合計＝量體＋契約＋備轉。流動電費差異僅流動電費。",
      simBillScenario: "情境",
      simBillBaseline: "原始（無儲能）",
      simBillStage1: "含儲能",
      simBillFull: "含契約與備轉",
      simBillNet: "淨成本（電費−備轉）",
      simBillDelta: "相對原始",
      simContractRecTitle: "契約容量建議",
      simContractField: "項目",
      simContractForm: "原始",
      simContractAdopted: "採用",
      simContractDelta: "調整",
      simContractCeiling: "累計上限",
      simContractSuggested: "建議",
      simContractRegular: "經常契約",
      simContractHalfPeak: "半尖峰契約",
      simContractSatHalfPeak: "週六半尖峰",
      simContractOffPeak: "離峰契約",
      simContractNonSummer: "非夏月契約",
      simNoViable: "配置組合內無正向節省；以下為虧損最少參考，非建議裝置。",
      simSavingsChart: "組合地圖",
      simUnitSave: "每 kWh",
      simViewBusy: "計算中…",
      simPcsDailyAvg: "PCS日均使用率",
      simDailyCycle: "SOC日循環",
      simDispatchCharts: "視覺化",
      simDispatchMonth: "月份",
      simDispatchMonthAll: "全部",
      simDispatchDayProfile: "單日曲線",
      simDispatchLoading: "載入調度圖…",
      simDispatchHourlySoc: "時均 SOC",
      simDispatchHourlyPower: "時均功率",
      simDispatchHeatmap: "熱力圖",
      simDispatchBoxplot: "箱型圖",
      simDispatchLoad: "原始負載",
      simDispatchEss: "儲能功率",
      simDispatchNet: "淨負載",
      simDispatchSoc: "SOC",
      simDispatchMetric: "序列",
      simAfterBill: "含儲能電費",
      batterySoc: "電池",
      socMin: "SOC 下限（%）",
      socMax: "SOC 上限（%）",
      chargeEff: "PCS 充放電效率（%）",
      bufferPct: "預留比例（%）",
      demandBufferKw: "防超約（kW）",
      antiExportKw: "防逆送（kW）",
      autoAdjustContract: "自動調整契約容量",
      gridReserve: "預留額度",
      scheduleMode: "排程設定",
      scheduleAuto: "自動",
      scheduleManual: "手動",
      scheduleEdit: "編輯排程",
      scheduleDone: "完成",
      scheduleViewRec: "檢視推薦",
      scheduleViewPower: "檢視實際功率",
      scheduleRecPending: "試算後顯示推薦排程",
      touRecTitle: "推薦目標 SOC 排程",
      touPowerTitle: "實際 PCS 功率",
      reserveRecTitle: "推薦投標排程",
      reserveViewRec: "檢視推薦矩陣",
      reserveUseAsManual: "改為手動並套用",
      touTargetSoc: "目標 SOC（%）",
      touActualPower: "實際功率（kW）",
      reserveBidMw: "投標量體（MW）",
      reserveMaxLabel: "投標上限",
      reserveNoContract: "尚未填寫經常契約",
      reserveCapacityPrice: "容量費（元／MW·h）",
      reservePerformancePrice: "效能費（元／MW·h）",
      reserveEnergyPrice: "調度電能價格（元／MWh）",
      reserveMonthlyDispatchCount: "每月調度次數",
      reserveSectionTitle: "即時備轉",
      reserveIncomeCap: "容量費",
      reserveIncomePerf: "效能費",
      reserveIncomeEnergy: "調度電能",
      reserveIncomeTotal: "合計",
      reserveBillSavings: "電費節省",
      reserveTotalBenefit: "整體效益",
      reserveNetAfter: "試算後淨成本",
      reserveCredit: "備轉額外收入",
      reserveMonthlyTitle: "月結算",
      reserveEvents: "調度事件",
      reserveEventDate: "日期",
      reserveEventBid: "投標（MW）",
      reserveEventResult: "結果",
      reserveEventOk: "通過",
      reserveEventFail: "未通過",
      reserveFailPcs: "PCS 餘裕不足",
      reserveFailRecovery: "恢復逾時",
      reserveFailCbl: "CBL 不足",
      reserveFailSoc: "SOC 不足",
      reserveFailAntiExport: "不逆送限制",
      reserveFailFactoryRise: "廠內負載上升",
      reserveMonth: "月份",
      reserveBidMwh: "得標 MW·h",
      reserveQuality: "品質係數",
      reserveDeliveredMwh: "交付 MWh",
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
    common: { voltage: "電壓", tou: "電價方案", needImport: "請先匯入資料", goImport: "前往匯入" },
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
      overageTab: "Overage charge",
      energy: "Energy",
      total: "Total",
      annual: "Annualized",
      months: "Monthly bills",
      monthsTab: "Monthly detail",
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
      month: "Month",
      monthAll: "All months",
      weekday: "Weekday",
      holiday: "Holiday",
    },
    import: {
      title: "Import data",
      upload: "Upload",
      sample: "Sample",
      loadSample: "Load",
      expired: "Data expired. Please import again.",
      start: "Start",
      end: "End",
      contracts: "Contract kW",
      range: "Range / plan",
      bill: "Import",
      clear: "Clear import",
      needFile: "Select a file first",
      needDates: "Need start / end (auto-detected on file select)",
      needSchema: "Contract schema not loaded",
      needRegular: "Regular contract must be greater than 0",
    },
    settings: {
      title: "Settings",
      load: "Reload defaults",
      energy: "Energy price (NT$/kWh)",
      demand: "Basic charge (NT$/kW)",
      tabRates: "Rates",
      tabTime: "Timeline",
      tabHolidays: "Holidays",
      na: "N/A",
      summerRange: "Summer range",
      schedule: "Periods",
      holidays: "Holidays",
      holidayDate: "Date",
      holidayName: "Name",
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
      demand: "Contract capacity",
      tou: "TOU arbitrage",
      reserve: "Ancillary service",
      backup: "Emergency backup",
      backupReserveKwh: "Reserved energy (kWh)",
      largeUser: "Large user obligation",
      run: "Run sizing",
      simClearResult: "Clear report",
      simExportXlsx: "Export XLSX",
      simExporting: "Exporting…",
      simExportErr: "Export failed",
      simResultStale: "Settings changed — report may be outdated. Clear the report, then run sizing again.",
      simStepParams: "Params",
      simStepFns: "Functions",
      simStepConfig: "Sizing",
      simStepResult: "Result",
      simNext: "Next",
      simBack: "Back",
      loading: "Importing…",
      simErr: "Simulation failed",
      simSavings: "Est. savings",
      simSkipped: "Skipped",
      simBatt: "Battery (kWh)",
      simHours: "Hours (h)",
      simReport: "Benefit report",
      simBenefitBasic: "Basic charge",
      simBenefitEnergy: "Energy charge",
      simBenefitOverage: "Overage charge",
      simBenefitExtra: "Additional benefit",
      simBenefitBefore: "Original",
      simBenefitAfter: "With BESS",
      simBenefitAmount: "Benefit",
      simBenefitIncrease: "Increase",
      simBenefitBasicSourceContract: "Contract capacity adjustment",
      simBenefitBasicSourcePlan: "Tariff plan change",
      simBenefitBasicSourceBoth: "Tariff and contract adjustment",
      simBenefitReserveCapacity: "Capacity",
      simBenefitReservePerformance: "Performance",
      simBenefitReserveActivation: "Activation energy",
      simKpiBefore: "Original bill",
      simKpiAfter: "Changed bill",
      simPlanChange: "Plan change",
      simScenarioPlan: "Simulate TOU plan",
      simScenarioContracts: "Simulate contract kW",
      simKwhBefore: "Original (no BESS)",
      simKwhAfter: "Changed (with BESS)",
      simReportPlan: "Plan",
      simReportBaselineTou: "Baseline plan",
      simReportSimulateTou: "Changed plan",
      simXferSideBefore: "Baseline only",
      simXferSideAfter: "Changed only",
      simKpiSave: "Savings",
      simKpiSavePct: "Savings %",
      simKpiBillSave: "Bill savings",
      simKpiReserveIncome: "Reserve income",
      simKpiTotalBenefit: "Total benefit",
      simKpiSize: "Recommended size",
      simSizingRunning: "Simulating…",
      simEvaluatingExtras: "Evaluating contracts and reserve…",
      simFullRetry: "Retry contracts / reserve",
      simFullFailedKeep: "Contract/reserve step failed; recommended size kept",
      simSampleRunning: "Computing sample…",
      simStrategyRefreshing: "Updating strategy samples…",
      simWorkspaceLoading: "Preparing functions and strategy samples…",
      simNeedStrategy: "Select at least one power-facing and one energy-facing option",
      simSpecialRule: "Special",
      simSeedSrcCross: "Combo",
      simPeakEssUtil: "Peak ESS utilization",
      simPeakCoverage: "Peak load coverage",
      simSampleMetaDone: "{pts} combinations simulated",
      simShortlistSummary: "{pts} · PCS {pcsMin}–{pcsMax} kW · battery {battMin}–{battMax} kWh",
      simStrategyChange: "Change strategy",
      simSizingMode: "Run mode",
      simSizingModeGrid: "Cross",
      simSizingModeSingle: "Specify",
      simManualPcs: "PCS (kW)",
      simManualBatt: "Battery (kWh)",
      simNeedManual: "Enter a PCS and battery greater than 0",
      simPowerSeeds: "Power-facing",
      simEnergySeedsAuto: "Energy-facing",
      simStatusOn: "On",
      simStatusOff: "Off",
      simStatusSkip: "N/A",
      simStatusPending: "Pending",
      simStatusRolled: "Rolled back",
      simStatusAdopted: "Adopted",
      simStatusUnchanged: "Unchanged",
      simFeatureResults: "Function results",
      simFeatureDemand: "Contract capacity",
      simFeatureBackup: "Backup",
      simFeatureReserve: "Reserve",
      simMetricMode: "Mode",
      simMetricBuffer: "Demand buffer",
      simMetricRegular: "Adopted regular contract",
      simMetricReducible: "Reducible",
      simMetricPeakMax: "Peak max",
      simMetricHalfPeakDelta: "Half-peak top-up",
      simMetricOffPeakReplace: "Off-peak top-up",
      simMetricBackup: "Backup reserve",
      simMetricSocMin: "Effective SOC floor",
      simMetricReserveIncome: "Reserve income",
      simMetricBenefit: "Benefit",
      simReasonDemandBuffer: "Shaves demand against the contract ceiling and buffer.",
      simReasonContractNoGain: "The rule proposal does not lower the period bill; current contract retained.",
      simReasonContractRuleAdopted: "The rule proposal lowers the period bill after re-simulation and was adopted.",
      simContractFnHint: "Auto-adjust contract capacity.",
      simContractCurrent: "Current contract",
      simContractFinal: "Recommended change",
      simContractAllowance: "Allowance",
      simContractPending: "Evaluating contract capacity and period top-ups from peak max…",
      simReasonSocFloor: "Reserves backup energy by raising the effective SOC floor.",
      simReasonAutoBid: "Bid derived from available PCS and SOC headroom.",
      simReasonManualBid: "Uses the user-defined bid schedule.",
      simReasonNoNetGain: "No net reserve gain; bid rolled back to zero.",
      simMapAxisPcs: "PCS (kW)",
      simMapAxisBatt: "Battery (kWh)",
      simMapAxisSave: "Period savings",
      simMapBest: "Best pick",
      simOtherPlans: "Other options",
      simChartPcsUtil: "PCS utilization (%)",
      simChartPeriodSave: "Period savings",
      simChartMarkBatt: "Per-kWh benefit",
      simBillSizingOnly: "With BESS",
      simBillAfterBess: "Bill after BESS",
      simBillWithContract: "With contract adjust",
      simBillWithReserve: "With reserve",
      simDispatchSizing: "BESS dispatch only",
      simDispatchFull: "With contract & reserve",
      simPeriodNote: "Study period",
      simSeedSrcPower: "Power",
      simSeedSrcEnergy: "Energy",
      simConfigPcs: "PCS",
      simConfigBatt: "Battery",
      simStrategyMax: "Max full-cover",
      simStrategyP50: "P50 typical",
      simStrategyP90: "P90 robust",
      simStrategyUnavailable: "Unavailable",
      simIncludeHalfPeak: "Include half-peak",
      simIncludeHalfOff: "Off",
      simRecSchedules: "Schedule",
      simRecTou: "TOU target SOC",
      simRecReserve: "Reserve bids",
      simEnergyTransfer: "Energy shift",
      simKwhDelta: "Δ kWh",
      simKwhDeltaPct: "Δ %",
      simXferAmount: "Amount Δ",
      simXferItemAmount: "Amount",
      simXferEffective: "Effective transfer",
      simXferEnergy: "Energy difference",
      simGridFold: "Combination trials",
      simGridFoldOpen: "Expand",
      simTwoCycle: "Two-cycle",
      simViewPanel: "Configuration view",
      simViewRec: "Recommended",
      simViewMaxSave: "Max savings",
      simViewMaxUtil: "Max utilization",
      simEnergyP50: "P50 typical",
      simEnergyP90: "P90 robust",
      simEnergyMin: "Min lightest peak day",
      simEnergyMax: "Max day",
      simExtraBenefit: "Extra benefit",
      simFinalDevice: "Device",
      simBenefitSizing: "Sizing savings",
      simBenefitContract: "Contract adjustment",
      simBenefitReserve: "Reserve income",
      simBenefitTotal: "Total benefit",
      simBenefitSplitHint: "Map uses Stage-1 sizing savings; total = sizing + contract + reserve. Energy-transfer delta is energy charge only.",
      simBillScenario: "Scenario",
      simBillBaseline: "Baseline (no BESS)",
      simBillStage1: "With BESS",
      simBillFull: "With contract & reserve",
      simBillNet: "Net cost (bill − reserve)",
      simBillDelta: "vs baseline",
      simContractRecTitle: "Contract capacity suggestion",
      simContractField: "Item",
      simContractForm: "Original",
      simContractAdopted: "Adopted",
      simContractDelta: "Change",
      simContractCeiling: "Cumulative ceiling",
      simContractSuggested: "Suggested",
      simContractRegular: "Regular",
      simContractHalfPeak: "Half-peak",
      simContractSatHalfPeak: "Sat. half-peak",
      simContractOffPeak: "Off-peak",
      simContractNonSummer: "Non-summer",
      simTagBest: "Max savings",
      simNoViable: "No positive savings in combinations; least-loss reference only — not a sizing recommendation.",
      simSavingsChart: "Combination map",
      simUnitSave: "Per kWh",
      simViewBusy: "Calculating…",
      simPcsDailyAvg: "PCS daily avg util",
      simDailyCycle: "SOC daily cycle",
      simDispatchCharts: "Charts",
      simDispatchMonth: "Month",
      simDispatchMonthAll: "All",
      simDispatchDayProfile: "Single-day curve",
      simDispatchLoading: "Loading dispatch charts…",
      simDispatchHourlySoc: "Hourly mean SOC",
      simDispatchHourlyPower: "Hourly mean power",
      simDispatchHeatmap: "Heatmap",
      simDispatchBoxplot: "Box plot",
      simDispatchLoad: "Original load",
      simDispatchEss: "ESS power",
      simDispatchNet: "Net load",
      simDispatchSoc: "SOC",
      simDispatchMetric: "Series",
      simAfterBill: "With BESS",
      batterySoc: "Battery",
      socMin: "SOC min (%)",
      socMax: "SOC max (%)",
      chargeEff: "PCS charge/discharge efficiency (%)",
      bufferPct: "Reserve ratio (%)",
      demandBufferKw: "Anti-overage (kW)",
      antiExportKw: "Anti-export (kW)",
      autoAdjustContract: "Auto-adjust contract capacity",
      gridReserve: "Reserve allowance",
      scheduleMode: "Schedule",
      scheduleAuto: "Auto",
      scheduleManual: "Manual",
      scheduleEdit: "Edit schedule",
      scheduleDone: "Done",
      scheduleViewRec: "View recommendation",
      scheduleViewPower: "View actual power",
      scheduleRecPending: "Recommendation appears after you run sizing",
      touRecTitle: "Recommended target SOC schedule",
      touPowerTitle: "Actual PCS power",
      reserveRecTitle: "Recommended bid schedule",
      reserveViewRec: "View recommended matrix",
      reserveUseAsManual: "Switch to manual & apply",
      touTargetSoc: "Target SOC (%)",
      touActualPower: "Actual power (kW)",
      reserveBidMw: "Bid quantity (MW)",
      reserveMaxLabel: "Bid max",
      reserveNoContract: "No regular contract",
      reserveCapacityPrice: "Capacity fee (NTD/MW·h)",
      reservePerformancePrice: "Performance fee (NTD/MW·h)",
      reserveEnergyPrice: "Activation energy (NTD/MWh)",
      reserveMonthlyDispatchCount: "Dispatches / month",
      reserveSectionTitle: "Spinning reserve",
      reserveIncomeCap: "Capacity fee",
      reserveIncomePerf: "Performance fee",
      reserveIncomeEnergy: "Activation energy",
      reserveIncomeTotal: "Total",
      reserveBillSavings: "Bill savings",
      reserveTotalBenefit: "Overall benefit",
      reserveNetAfter: "Net cost after",
      reserveCredit: "Reserve credit",
      reserveMonthlyTitle: "Monthly settlement",
      reserveEvents: "Dispatch events",
      reserveEventDate: "Date",
      reserveEventBid: "Bid (MW)",
      reserveEventResult: "Result",
      reserveEventOk: "Pass",
      reserveEventFail: "Fail",
      reserveFailPcs: "PCS headroom",
      reserveFailRecovery: "Recovery overtime",
      reserveFailCbl: "CBL shortfall",
      reserveFailSoc: "SOC shortfall",
      reserveFailAntiExport: "Anti-export limit",
      reserveFailFactoryRise: "Factory load rise",
      reserveMonth: "Month",
      reserveBidMwh: "Won MW·h",
      reserveQuality: "Quality coeff.",
      reserveDeliveredMwh: "Delivered MWh",
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
    common: { voltage: "Voltage", tou: "Rate plan", needImport: "Import data first", goImport: "Go to import" },
  },
};

const LOCALE_KEY = "btm_optimize-locale";
const SESSION_KEY = "btm_optimize-session-v5";

/** 開機占位，數字須與 simulate_defaults.json 一致；設定 API 回來後以 JSON 為準。 */
const BUILTIN_SIMULATE_DEFAULTS = Object.freeze({
  simulateTou: "ThreeStage",
  sizingMode: "grid",
  manualPcsKw: 0,
  manualBattKwh: 0,
  sizingStrategies: ["p50", "p90", "max", "two_cycle"],
  sizingEnergySeeds: ["min", "p50", "p90", "max"],
  evaluateContractReduction: false,
  bufferPct: 3,
  demandBufferKw: 0,
  antiExportKw: 0,
  backupReserveKwh: 0,
  touScheduleMode: "auto",
  reserveScheduleMode: "auto",
  reserveCapacityPrice: 200,
  reservePerformancePrice: 100,
  reserveEnergyPrice: 4000,
  reserveMonthlyDispatchCount: 2,
  largeUserRatio: 0.1,
  largeUserPowerRatio: 0.8,
  socMin: 0.1,
  socMax: 0.9,
  chargeEff: 0.85,
  includeHalfPeak: false,
});

const SIZING_TIER_IDS = ["p50", "p90", "max", "two_cycle"];
const ENERGY_SEED_IDS = ["min", "p50", "p90", "max"];

function aliasSizingId(raw) {
  const k = String(raw || "").trim().toLowerCase();
  return k === "p95" ? "p90" : k;
}

function normalizeSizingStrategies(raw) {
  if (typeof raw === "string") raw = [raw.trim().toLowerCase()];
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = new Set();
  for (const item of raw) {
    const k = aliasSizingId(item);
    if (SIZING_TIER_IDS.includes(k) && !seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }
  return out;
}

function normalizeEnergySeeds(raw) {
  if (raw == null) return [...ENERGY_SEED_IDS];
  if (typeof raw === "string") raw = [raw];
  if (!Array.isArray(raw)) return [...ENERGY_SEED_IDS];
  const out = [];
  const seen = new Set();
  for (const item of raw) {
    const k = aliasSizingId(item);
    if (ENERGY_SEED_IDS.includes(k) && !seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }
  return out;
}

let simulateDefaults = { ...BUILTIN_SIMULATE_DEFAULTS };
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

/** 熱力 day_kind → TOU 矩陣日別（假日／週日走 sunday 列）。 */
function scheduleDayFromHeatmapKind(kind) {
  if (kind === "holiday") return "sunday";
  if (kind === "saturday") return "saturday";
  return "weekday";
}

/**
 * 將 ess_kw 熱力（15 分）聚合成與目標 SOC 同形狀的季節×日別×時段平均功率。
 * ponytail: 槽內／跨日取 mean；若要 P50／尖峰功率另開矩陣。
 */
function aggregateEssKwToTouMatrix(essHeatmap, slotMinutes) {
  const step = Math.max(1, Number(slotMinutes) || 60);
  const n = Math.round((24 * 60) / step);
  const perSlot = Math.max(1, Math.round(step / 15));
  const out = makeSeasonMatrix(() => Array(n).fill(null));
  const buckets = {
    summer: { weekday: Array.from({ length: n }, () => []), saturday: Array.from({ length: n }, () => []), sunday: Array.from({ length: n }, () => []) },
    non_summer: { weekday: Array.from({ length: n }, () => []), saturday: Array.from({ length: n }, () => []), sunday: Array.from({ length: n }, () => []) },
  };
  const dates = (essHeatmap && essHeatmap.dates) || [];
  const values = (essHeatmap && essHeatmap.values) || [];
  const meta = (essHeatmap && essHeatmap.date_meta) || {};
  dates.forEach((d, di) => {
    const m = meta[d] || {};
    const season = m.season === "non_summer" ? "non_summer" : (m.season === "summer" ? "summer" : null);
    if (!season) return;
    const day = scheduleDayFromHeatmapKind(m.day_kind);
    const row = values[di] || [];
    for (let slot = 0; slot < n; slot++) {
      const i0 = slot * perSlot;
      const i1 = Math.min(row.length, i0 + perSlot);
      for (let i = i0; i < i1; i++) {
        const v = row[i];
        if (v == null || !Number.isFinite(Number(v))) continue;
        buckets[season][day][slot].push(Number(v));
      }
    }
  });
  for (const season of ["summer", "non_summer"]) {
    for (const day of ["weekday", "saturday", "sunday"]) {
      out[season][day] = buckets[season][day].map((arr) => {
        if (!arr.length) return null;
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return Math.round(mean * 10) / 10;
      });
    }
  }
    return out;
  }

function simPcsPowerMatrixCacheKey(res, slotMinutes) {
  const row = simViewRow(res);
  const base = simChartCacheKey(row) || simRowChartKey(row);
  if (!base) return null;
  return `${base}|${slotMinutes}|${simViewContext || "sizing"}`;
}

function simPcsPowerMatrixForView(res, slotMinutes) {
  const key = simPcsPowerMatrixCacheKey(res, slotMinutes);
  if (key && simPcsPowerMatrixCache[key]) return simPcsPowerMatrixCache[key];
  const dc = simDispatchChartsForKey(res);
  const ess = dc && dc.heatmap && dc.heatmap.ess_kw;
  if (!ess) return null;
  const matrix = aggregateEssKwToTouMatrix(ess, slotMinutes);
  if (key) simPcsPowerMatrixCache[key] = matrix;
  return matrix;
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

function clamp01(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : fallback;
}

function baseSimulateTemplate() {
  const d = { ...BUILTIN_SIMULATE_DEFAULTS, ...simulateDefaults };
  const tou = TOU_OPTIONS.includes(d.simulateTou) ? d.simulateTou : "ThreeStage";
  return {
    functions: ["tou"],
    detailTab: "tou",
    ...d,
    simulateTou: tou,
    scenarioContracts: {},
    scenarioByTou: {},
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

function suggestedBufferKw(sim, contractValues) {
  const bag = (sim && sim.scenarioContracts) || {};
  const cv = contractValues || {};
  const reg = Number(bag.regular_kw || cv.regular_kw || 0);
  const pct = Math.max(0, Number(sim && sim.bufferPct) || 0);
  return ceilToStep(Math.max(0, reg) * pct / 100);
}

/** 對齊後端 quantize.ceil_to_step（預設步進 10）。 */
function ceilToStep(x, step = 10) {
  const v = Number(x);
  const s = Number(step);
  if (!(v > 0) || !(s > 0)) return 0;
  return Math.ceil(v / s - 1e-12) * s;
}

function _finiteOr(baseVal, raw) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number(baseVal) || 0;
}

function normalizeSimulate(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const base = baseSimulateTemplate();
  const sim = { ...base };

  // 只覆寫使用者有帶的欄位；缺欄用預設（內建或 API）
  for (const key of Object.keys(base)) {
    if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
    const v = src[key];
    if (v === undefined || v === null || v === "") continue;
    sim[key] = v;
  }

  const opts = (sim.functions || []).filter((f) => f !== "tou");
  sim.functions = ["tou", ...opts];
  if (!TOU_OPTIONS.includes(sim.simulateTou)) sim.simulateTou = base.simulateTou;
  if (!sim.scenarioContracts || typeof sim.scenarioContracts !== "object") {
    sim.scenarioContracts = {};
  }
  if (!sim.scenarioByTou || typeof sim.scenarioByTou !== "object") {
    sim.scenarioByTou = {};
  }
  sim.touSchedule = normalizeScheduleMatrix(sim.touSchedule, () => defaultTouSlots(sim.simulateTou));
  sim.reserveSchedule = normalizeScheduleMatrix(sim.reserveSchedule, defaultReserveHourly);

  sim.chargeEff = Math.max(0.5, Math.min(1, clamp01(sim.chargeEff, base.chargeEff)));
  let lo = clamp01(sim.socMin, base.socMin);
  let hi = clamp01(sim.socMax, base.socMax);
  if (lo > hi) [lo, hi] = [hi, lo];
  sim.socMin = lo;
  sim.socMax = hi;
  {
    // demand 功能＝自動調整契約容量；防超約是參數 demandBufferKw
    const on = (sim.functions || []).includes("demand")
      || !!sim.evaluateContractReduction;
    sim.evaluateContractReduction = on;
    delete sim.autoAdjustOffPeakContract;
    const rest = (sim.functions || []).filter((f) => f !== "tou" && f !== "demand");
    sim.functions = on ? ["tou", ...rest, "demand"] : ["tou", ...rest];
  }

  sim.backupReserveKwh = Math.max(0, _finiteOr(base.backupReserveKwh, sim.backupReserveKwh));
  sim.bufferPct = Math.max(0, Math.min(100, _finiteOr(base.bufferPct, sim.bufferPct)));
  {
    const sug = suggestedBufferKw(sim);
    // 舊 session 無新欄：用契約×比例建議值；有填也向上取 10
    if (!Object.prototype.hasOwnProperty.call(src, "demandBufferKw")) {
      sim.demandBufferKw = sug;
    } else {
      sim.demandBufferKw = ceilToStep(Math.max(0, _finiteOr(sug, sim.demandBufferKw)));
    }
    if (!Object.prototype.hasOwnProperty.call(src, "antiExportKw")) {
      sim.antiExportKw = sug;
    } else {
      sim.antiExportKw = ceilToStep(Math.max(0, _finiteOr(sug, sim.antiExportKw)));
    }
  }
  sim.reserveCapacityPrice = Math.max(0, _finiteOr(base.reserveCapacityPrice, sim.reserveCapacityPrice));
  sim.reservePerformancePrice = Math.max(0, _finiteOr(base.reservePerformancePrice, sim.reservePerformancePrice));
  sim.reserveEnergyPrice = Math.max(0, _finiteOr(base.reserveEnergyPrice, sim.reserveEnergyPrice));
  sim.reserveMonthlyDispatchCount = Math.max(
    0,
    Math.floor(_finiteOr(base.reserveMonthlyDispatchCount, sim.reserveMonthlyDispatchCount)),
  );
  sim.largeUserRatio = Math.max(0, Math.min(1, _finiteOr(base.largeUserRatio, sim.largeUserRatio)));
  sim.largeUserPowerRatio = Math.max(0, Math.min(1, _finiteOr(base.largeUserPowerRatio, sim.largeUserPowerRatio)));

  if (sim.sizingMode !== "single" && sim.sizingMode !== "grid") sim.sizingMode = "grid";
  sim.manualPcsKw = Math.max(0, _finiteOr(0, sim.manualPcsKw));
  sim.manualBattKwh = Math.max(0, _finiteOr(0, sim.manualBattKwh));
  if (!["auto", "manual"].includes(sim.touScheduleMode)) sim.touScheduleMode = "auto";
  if (!["auto", "manual"].includes(sim.reserveScheduleMode)) sim.reserveScheduleMode = "auto";
  if (!Object.prototype.hasOwnProperty.call(src, "sizingStrategies")) {
    sim.sizingStrategies = [...SIZING_TIER_IDS];
  } else {
    sim.sizingStrategies = normalizeSizingStrategies(sim.sizingStrategies);
  }
  // 舊 session：strategies=[] 且尚無電量面向欄 → 補全選（修開始試算被擋）
  if (
    !sim.sizingStrategies.length
    && !Object.prototype.hasOwnProperty.call(src, "sizingEnergySeeds")
    && Array.isArray(src.sizingStrategies)
  ) {
    sim.sizingStrategies = [...SIZING_TIER_IDS];
  }
  if (!Object.prototype.hasOwnProperty.call(src, "sizingEnergySeeds")) {
    sim.sizingEnergySeeds = [...ENERGY_SEED_IDS];
  } else {
    sim.sizingEnergySeeds = normalizeEnergySeeds(src.sizingEnergySeeds);
  }
  delete sim.sizingStrategy;
  if (typeof sim.includeHalfPeak === "boolean") {
    /* keep */
  } else {
    sim.includeHalfPeak = false;
  }
  if (src.wizardStep === 2 || src.wizardStep === 3 || ["params", "fns", "config", "result"].includes(src.wizardStep)) {
    sim.wizardStep = src.wizardStep;
  }
  if (sim.wizardStep === 2) sim.wizardStep = "config";
  else if (sim.wizardStep === 3) sim.wizardStep = "result";
  else if (!["params", "fns", "config", "result"].includes(sim.wizardStep)) sim.wizardStep = "fns";
  return sim;
}

const session = {
  file: null,
  fileLabel: "",
  fileSource: "",
  start: "",
  end: "",
  voltage: "HV",
  tou: "ThreeStage",
  settingsVoltage: "HV",
  settingsTou: "ThreeStage",
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
  simDefaultsStamp: 0,
  simulate: normalizeSimulate({}),
  _settingsLoaded: false,
};

function persistSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      fileLabel: session.fileLabel,
      fileSource: session.fileSource,
      start: session.start,
      end: session.end,
      voltage: session.voltage,
      tou: session.tou,
      settingsVoltage: session.settingsVoltage,
      settingsTou: session.settingsTou,
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
      simDefaultsStamp: session.simDefaultsStamp || 0,
      simulate: session.simulate,
    }));
  } catch { /* quota */ }
}

function restoreSession() {
  try {
    const data = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (!data || typeof data !== "object") return;
    Object.assign(session, data);
    session.file = null;
    session._settingsLoaded = false;
    if (!TOU_OPTIONS.includes(session.settingsTou)) session.settingsTou = session.tou || "ThreeStage";
    if (session.settingsVoltage !== "HV" && session.settingsVoltage !== "EHV") {
      session.settingsVoltage = session.voltage || "HV";
    }
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

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
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
  sizingDiagnosis = null;
  simWorkspaceReady = false;
  simWorkspaceBooting = false;
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

/** 清掉畫面上的檔案與區間，回到還沒選檔。 */
function forgetPickedFile() {
  session.file = null;
  session.fileLabel = "";
  session.fileSource = "";
  session.start = "";
  session.end = "";
  session.contractValues = {};
  const upload = document.getElementById("upload") || importFileHold.querySelector("#upload");
  if (upload) upload.value = "";
}

/** 重新整理後 File 不在：沒有匯入、也沒有過期結果時，不要留著看起來還能直接匯入的選擇。 */
function dropUnusableSelection() {
  if (session.file || session.importId || currentDataMode() === "expired") return;
  forgetPickedFile();
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
  clearSimAuxCaches();
  session.billError = null;
  session.chartsError = null;
  sizingDiagnosis = null;
  simWorkspaceReady = false;
  simWorkspaceBooting = false;
  simulateJob += 1;
  simulateFetch = null;
  simulateSampleFetch = null;
  simDispatchChartKey = null;
  simViewMode = "recommended";
  simViewContext = "sizing";
  simDispatchChartCache = {};
  simDispatchChartPending = {};
  simDispatchCacheResultKey = null;
  simDispatchChartLoadId += 1;
  Object.assign(simDispatchFilter, {
    season: "all",
    day: "all",
    month: "all",
    heatmap: "net_kw",
    dayIdx: 0,
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

/** 與後端 SIM_UI_ONLY_KEYS 對齊：純 UI，不進指紋／API payload。 */
const SIM_UI_ONLY_KEYS = ["wizardStep", "detailTab", "seededImportKey", "scenarioByTou"];

/** 試算 API 用 simulate（去掉導覽欄）。 */
function simulateApiPayload(sim) {
  const src = sim && typeof sim === "object" ? sim : (session.simulate || {});
  const out = { ...src };
  for (const k of SIM_UI_ONLY_KEYS) delete out[k];
  return out;
}

function simulateApiJson(sim) {
  return JSON.stringify(simulateApiPayload(sim));
}

/**
 * 組試算 FormData：import＋契約＋simulate＋overrides（＋可選 stage1／量體／scheme）。
 * @returns {FormData|null} 缺契約 schema 時回 null
 */
function buildSimulateFormData({
  simulateJson,
  stage1Key,
  pcsKw,
  battKwh,
  schemeContracts,
  contractsOverride,
} = {}) {
  if (!session.importId) return null;
  const fd = new FormData();
  fd.append("import_id", session.importId);
  if (!appendSimulateContractFields(fd, contractsOverride)) return null;
  fd.append("simulate", simulateJson != null ? simulateJson : simulateApiJson());
  appendOverrides(fd);
  if (stage1Key) fd.append("stage1_key", String(stage1Key));
  if (pcsKw != null && battKwh != null) {
    fd.append("pcs_kw", String(pcsKw));
    fd.append("batt_kwh", String(battKwh));
  }
  if (schemeContracts) fd.append("scheme_contracts", JSON.stringify(schemeContracts));
  return fd;
}

/** 本輪 size→full 凍結的 simulate JSON（略過 UI 欄）。 */
let simFrozenPayload = null;

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
  const msg = message || t("common.needImport");
  return `<section class="btm-card hud-panel hud-frame empty-import"${idAttr}>
    <div class="empty-import__icon" aria-hidden="true"><i class="fa-solid fa-file-import"></i></div>
    <p class="empty-import__text${err ? " btm-meta--err" : ""}">${msg}</p>
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
    ${pageHeader(titleKey)}
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

function pageHeader(titleKey) {
  return headerHtml(titleKey, dataBarHtml());
}

function pageStepBar(tabs, active, attr = "data-page-tab") {
  return `<ol class="sim-steps">${tabs.map((it) => {
    const cls = ["sim-steps__item"];
    if (it.id === active) cls.push("sim-steps__item--on");
    if (it.on === false) cls.push("sim-steps__item--off");
    const dis = it.on === false ? " disabled" : "";
    return `<li class="${cls.join(" ")}"><button type="button" ${attr}="${it.id}"${dis}>${it.label}</button></li>`;
  }).join("")}</ol>`;
}

function bindPageTabs(current, apply) {
  document.querySelectorAll("[data-page-tab]").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-page-tab");
      if (!id || id === current()) return;
      apply(id);
      renderPage({ animate: false, preserveScroll: true });
    };
  });
}

function currentDataMode() {
  if (session.importId) return "live";
  const hasSnapshot = !!(
    session.lastBill
    || session.lastCharts
    || normalizeSimulateSizeResult(session.lastSimulateSize)
  );
  if (session.fileLabel && hasSnapshot) return "expired";
  return "";
}

function dataBarHtml() {
  const mode = currentDataMode();
  if (!mode) return "";
  const src = session.lastBill || session.lastCharts || {};
  const start = src.start_date || session.start || "";
  const end = src.end_date || session.end || "";
  const dates = start && end ? `${escapeHtml(start)} ~ ${escapeHtml(end)}` : "";
  const tone = mode === "live" ? " btm-chip--on" : "";
  const file = session.fileLabel
    ? `<span class="btm-chip${tone}">${escapeHtml(session.fileLabel)}</span>`
    : "";
  return `<div class="btm-data-bar">
    ${file}
    ${dates ? `<span class="btm-chip${tone}">${dates}</span>` : ""}
    <span class="btm-chip${tone}">${escapeHtml(session.voltage)} / ${escapeHtml(session.tou)}</span>
  </div>`;
}

function planSelectsHtml(mode) {
  const settings = mode === "settings";
  const voltage = settings
    ? (session.settingsVoltage === "EHV" ? "EHV" : "HV")
    : session.voltage;
  const tou = settings
    ? (TOU_OPTIONS.includes(session.settingsTou) ? session.settingsTou : session.tou)
    : session.tou;
  const vId = settings ? "settingsVoltage" : "voltage";
  const tId = settings ? "settingsTou" : "tou";
  return `<label class="ts-field"><span class="ts-field__label">${t("common.voltage")}</span>
      <select class="ts-select" id="${vId}">
        <option ${voltage === "HV" ? "selected" : ""}>HV</option>
        <option ${voltage === "EHV" ? "selected" : ""}>EHV</option>
      </select></label>
    <label class="ts-field"><span class="ts-field__label">${t("common.tou")}</span>
      <select class="ts-select" id="${tId}">
        <option ${tou === "TwoStage" ? "selected" : ""}>TwoStage</option>
        <option ${tou === "ThreeStage" ? "selected" : ""}>ThreeStage</option>
        <option ${tou === "BatchStage" ? "selected" : ""}>BatchStage</option>
      </select></label>`;
}

function contractFieldsHtml() {
  const schema = currentSchema();
  if (!schema) return `<p class="btm-meta--err">${t("import.needSchema")}</p>`;
  return schema.fields
    .map((f) => {
      const v = session.contractValues[f] ?? 0;
      const min = f === "regular_kw" ? 1 : 0;
      return `<label class="ts-field" data-field="${f}"><span class="ts-field__label">${t("fields." + f)}</span>
        <input class="ts-input" type="number" id="kw-${f}" min="${min}" step="1" value="${v}"></label>`;
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
  const pending = amount == null;
  const ann = pending ? null : annualizeAmount(amount, days);
  const annualLine = ann == null
    ? ""
    : `<div class="dash-kpi__annual"><span>${t("dashboard.annual")}</span> <strong>${fmt(ann)}</strong></div>`;
  return `<article class="dash-kpi hud-panel hud-frame${extraClass}">
    <div class="dash-kpi__label">${label}</div>
    <div class="dash-kpi__value">${pending ? "…" : fmt(amount)}</div>
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

function billSummaryHtml(bill, only) {
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

  const basicTable = `<div class="btm-table-wrap btm-table-wrap--tall">
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
    </div>`;
  const energyTable = `<div class="btm-table-wrap btm-table-wrap--tall">
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
    </div>`;
  if (only === "basic") return basicTable;
  if (only === "overage") return overageBlock;
  if (only === "energy") return energyTable;

  return `<section class="btm-card hud-panel hud-frame dash-breakdown">
    <h2 class="btm-card__title seetel-title">${t("dashboard.breakdown")}</h2>
    <h3 class="btm-section-title">${t("dashboard.basic")}</h3>
    ${basicTable}
    <h3 class="btm-section-title">${t("dashboard.overage")}</h3>
    ${overageBlock}
    <h3 class="btm-section-title">${t("dashboard.energy")}</h3>
    ${energyTable}
  </section>`;
}

function renderDashboard() {
  const busy = routeBusyHtml(ROUTES.DASHBOARD);
  if (busy) return busy;
  const bill = session.lastBill;
  if (!bill) {
    return `<div class="btm-page">
      ${pageHeader("dashboard.title")}
      ${emptyImportHtml({
        message: session.billError || undefined,
        err: !!session.billError,
      })}
    </div>`;
  }
  const days = billSpanDays(bill);
  if (!["basic", "overage", "energy", "months"].includes(dashTab)) dashTab = "basic";
  const detail = dashTab === "months"
    ? (billMonthsHtml(bill) || `<p class="btm-empty">${t("dashboard.empty")}</p>`)
    : billSummaryHtml(bill, dashTab);
  return `<div class="btm-page">
    ${pageHeader("dashboard.title")}
    <div class="dash-kpis">
      ${dashKpiHtml(t("dashboard.basic"), bill.basic_total, days)}
      ${dashKpiHtml(t("dashboard.overage"), bill.overage_total, days, " dash-kpi--overage")}
      ${dashKpiHtml(t("dashboard.energy"), bill.energy_total, days, " dash-kpi--energy")}
      ${dashKpiHtml(t("dashboard.total"), bill.total, days, " dash-kpi--total")}
    </div>
    ${pageStepBar([
      { id: "basic", label: t("dashboard.basic") },
      { id: "overage", label: t("dashboard.overageTab") },
      { id: "energy", label: t("dashboard.energy") },
      { id: "months", label: t("dashboard.monthsTab") },
    ], dashTab)}
    <section class="btm-card hud-panel hud-frame">
      ${detail}
    </section>
  </div>`;
}

const chartFilter = { season: "all", day: "all", month: "all" };
let chartTab = "heatmap";
let dashTab = "basic";
let settingsTab = "rates";
let echartsHandles = [];
let simSavingsChart = null;
let simDispatchCharts = [];
let simDispatchChartKey = null;
let simViewMode = "recommended";
/** @type {"sizing" | "full"} 配置檢視：僅儲能｜含契約與備轉 */
let simViewContext = "sizing";
let simDispatchChartCache = {};
let simDispatchChartPending = {};
let simDispatchCacheResultKey = null;
let simDispatchChartLoadId = 0;
const simDispatchFilter = { season: "all", day: "all", month: "all", heatmap: "net_kw", dayIdx: 0 };
let simChartResize = null;
let chartsResize = null;
let boxChart = null;
let chartsFetch = null;
let chartsJob = 0;
let billFetch = null;
let billJob = 0;
let simulateFetch = null;
let simulateFullFetch = null;
/** 串行 /full（點擊與背景預取共用，避免並行互蓋）。 */
let simulateFullChain = Promise.resolve();
let simulateFullPrefetchToken = 0;
let simulateSampleFetch = null;
let simulateExportFetch = null;
let simulateJob = 0;
/** @type {Record<string, object>} 實際功率矩陣快取 key = chartKey|slotMin|ctx */
let simPcsPowerMatrixCache = {};
let sizingDiagnosis = null;
let simulateSampleJob = 0;
/** 匯入後診斷＋樣本就緒才顯示功能／策略區 */
let simWorkspaceReady = false;
let simWorkspaceBooting = false;
/** @type {null | "tou" | "tou-rec" | "tou-power" | "reserve" | "reserve-rec"} 排程矩陣彈窗 */
let simScheduleModal = null;
let simScheduleEscBound = false;

function closeScheduleModal({ reread = true } = {}) {
  if (!simScheduleModal) return;
  const viewOnly = simScheduleModal === "tou-rec"
    || simScheduleModal === "tou-power"
    || simScheduleModal === "reserve-rec";
  if (reread && !viewOnly) readSimulateForm();
  simScheduleModal = null;
  renderPage({ animate: false, preserveScroll: true });
}

function scheduleModalHostEl() {
  let host = document.getElementById("simSchedModalHost");
  if (host) return host;
  host = document.createElement("div");
  host.id = "simSchedModalHost";
  document.body.appendChild(host);
  return host;
}

function syncScheduleModalHost() {
  const host = scheduleModalHostEl();
  if (parseRoute() !== ROUTES.SIMULATE || !simScheduleModal) {
    host.innerHTML = "";
    document.body.classList.remove("sim-sched-modal-open");
    return;
  }
  const T = I18N[locale].simulate;
  host.innerHTML = renderScheduleModal(T, session.simulate);
  document.body.classList.add("sim-sched-modal-open");
  host.querySelectorAll("[data-sched-close]").forEach((el) => {
    el.addEventListener("click", () => closeScheduleModal());
  });
  host.querySelectorAll("[data-sched]").forEach((el) => {
    el.addEventListener("change", () => readSimulateForm());
    el.addEventListener("input", () => readSimulateForm());
  });
}

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
      ${pageHeader("charts.title")}
      ${emptyImportHtml({ message: session.chartsError, err: true })}
    </div>`;
  }
  if (!session.lastCharts) {
    if (!session.importId) {
    return `<div class="btm-page">
      ${pageHeader("charts.title")}
        ${emptyImportHtml()}
    </div>`;
  }
    return pageBusyHtml("charts.title", "charts.loading");
  }
  if (!["heatmap", "box", "line"].includes(chartTab)) chartTab = "heatmap";
  const sea = chartFilter.season;
  const day = chartFilter.day;
  const mon = chartFilter.month;
  const monthOpts = chartMonthOptions(session.lastCharts, mon);
  const filters = chartTab === "box"
    ? `<div class="chart-filters">
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
          <label class="ts-field"><span class="ts-field__label">${t("charts.month")}</span>
            <select class="ts-select" id="chartMonth">${monthOpts}</select></label>
        </div>`
    : "";
  const chartId = chartTab === "box" ? "chart-boxplot" : chartTab === "line" ? "chart-line" : "chart-heatmap";
  const chartClass = chartTab === "heatmap" ? "dash-chart dash-chart--heatmap" : "dash-chart";
  return `<div class="btm-page">
    ${pageHeader("charts.title")}
    ${pageStepBar([
      { id: "heatmap", label: t("charts.heatmap") },
      { id: "box", label: t("charts.boxplot") },
      { id: "line", label: t("charts.line") },
    ], chartTab)}
    <section class="btm-card hud-panel hud-frame">
      ${filters}
      <div class="${chartClass}" id="${chartId}"></div>
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
  let vmin = Infinity;
  let vmax = -Infinity;
  for (const p of points) {
    const v = p[2];
    if (v < vmin) vmin = v;
    if (v > vmax) vmax = v;
  }
  if (!Number.isFinite(vmin)) {
    vmin = 0;
    vmax = 1;
  }
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
    series: [{
      type: "heatmap",
      data: points,
      progressive: 0,
      animation: false,
    }],
  };
}

function chartMonthOptions(data, selected) {
  const hm = (data && data.heatmap) || {};
  const meta = hm.date_meta || {};
  const months = [];
  const seen = new Set();
  for (const d of hm.dates || []) {
    const m = (meta[d] && meta[d].month) || String(d).slice(0, 7);
    if (!m || seen.has(m)) continue;
    seen.add(m);
    months.push(m);
  }
  months.sort();
  let cur = selected || chartFilter.month || "all";
  if (cur !== "all" && !seen.has(cur)) {
    cur = "all";
    chartFilter.month = "all";
  }
  const opts = [
    `<option value="all"${cur === "all" ? " selected" : ""}>${t("charts.monthAll")}</option>`,
    ...months.map((m) =>
      `<option value="${m}"${cur === m ? " selected" : ""}>${m}</option>`),
  ];
  return opts.join("");
}

function chartDayPasses(meta, d) {
  const { season, day, month } = chartFilter;
  const m = meta[d] || {};
  const sea = m.season || "";
  const kind = m.day_kind || "";
  const mon = m.month || String(d).slice(0, 7);
  if (season !== "all" && sea !== season) return false;
  if (day !== "all" && kind !== day) return false;
  if (month !== "all" && mon !== month) return false;
  return true;
}

function boxplotOption(data) {
  const hm = (data && data.heatmap) || {};
  const dates = hm.dates || [];
  const values = hm.values || [];
  const meta = hm.date_meta || {};
  const buckets = Array.from({ length: 24 }, () => []);
  dates.forEach((d, i) => {
    if (!chartDayPasses(meta, d)) return;
    const row = values[i] || [];
    for (let slot = 0; slot < row.length; slot++) {
      const v = row[slot];
      if (v == null || !Number.isFinite(Number(v))) continue;
      buckets[Math.floor(slot / 4)].push(Number(v));
    }
  });
  const labels = [];
  const boxes = [];
  const outliers = [];
  buckets.forEach((arr, h) => {
    const s = simFiveNumber(arr);
    if (!s) return;
    const hh = String(h).padStart(2, "0") + ":00";
    labels.push(hh);
    boxes.push({
      value: [s.whisker_low, s.q1, s.median, s.q3, s.whisker_high],
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
  const hm = data.heatmap || {};
  const dates = hm.dates || [];
  const peak = [];
  const mean = [];
  for (const row of hm.values || []) {
    let mx = -Infinity;
    let sum = 0;
    let n = 0;
    for (const v of row || []) {
      if (v == null || !Number.isFinite(Number(v))) continue;
      const x = Number(v);
      if (x > mx) mx = x;
      sum += x;
      n += 1;
    }
    peak.push(n ? mx : null);
    mean.push(n ? sum / n : null);
  }
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
  bindPageTabs(() => chartTab, (id) => { chartTab = id; });
  if (typeof echarts === "undefined" || !session.lastCharts) return;
  const data = session.lastCharts;
  const mount = (id, option) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const chart = echarts.init(el);
    chart.setOption(option);
    echartsHandles.push(chart);
    return chart;
  };
  mount("chart-heatmap", heatmapOption(data));
  boxChart = mount("chart-boxplot", boxplotOption(data));
  mount("chart-line", lineOption(data));
  if (!echartsHandles.length) return;

  const seasonEl = document.getElementById("chartSeason");
  const dayEl = document.getElementById("chartDay");
  const monthEl = document.getElementById("chartMonth");
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
  if (monthEl) {
    monthEl.onchange = () => {
      chartFilter.month = monthEl.value;
      if (boxChart) boxChart.setOption(boxplotOption(data), true);
    };
  }

  chartsResize = () => { echartsHandles.forEach((c) => c.resize()); };
  window.addEventListener("resize", chartsResize);
  requestAnimationFrame(() => { if (chartsResize) chartsResize(); });
}

function renderImport() {
  const pickedSample = session.file && session.fileSource === "sample" ? session.fileLabel : "";
  const samples = session.samples.map((f) =>
    `<option value="${escapeHtml(f)}"${f === pickedSample ? " selected" : ""}>${escapeHtml(f)}</option>`
  ).join("");
  const ready = !!(session.file && session.fileLabel && session.start && session.end);
  const showClear = !!session.importId || currentDataMode() === "expired";
  const clearBtn = `<button type="button" class="btm-btn btm-btn--ghost" id="btnClearImport"${billFetch ? " disabled" : ""}>${t("import.clear")}</button>`;

  return `<div class="btm-page">
    ${pageHeader("import.title")}
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
      <p class="btm-meta" id="runMeta"></p>
      ${showClear && !ready ? `<div class="btm-actions">${clearBtn}</div>` : ""}
      <div id="importRest"${ready ? "" : " hidden"}>
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
        ${ready && session.importId
          ? clearBtn
          : `<button type="button" class="btm-btn btm-btn--primary" id="btnBill"${billFetch || !(Number(session.contractValues.regular_kw) > 0) ? " disabled" : ""}>${t("import.bill")}</button>`}
      </div>
      </div>
    </section>
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

function settingsPlanVoltage() {
  return session.settingsVoltage === "EHV" ? "EHV" : "HV";
}

function settingsPlanTou() {
  return TOU_OPTIONS.includes(session.settingsTou) ? session.settingsTou : session.tou;
}

function importPlanTou() {
  return TOU_OPTIONS.includes(session.tou) ? session.tou : "ThreeStage";
}

function rateSlice() {
  if (!session.rates) return null;
  const v = settingsPlanVoltage();
  const tou = settingsPlanTou();
  return session.rates[v] && session.rates[v][tou];
}

function energyPeriods() {
  return settingsPlanTou() === "ThreeStage"
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
  const sch = session.schedule && session.schedule[settingsPlanTou()];
  const season = document.getElementById("editSeason")?.value || "summer";
  const day = document.getElementById("editDay")?.value || "weekday";
  return sch && sch[season] && sch[season][day];
}

function writeCurrentSlots(slots) {
  if (!session.schedule) return;
  const tou = settingsPlanTou();
  if (!session.schedule[tou]) session.schedule[tou] = { step_minutes: 60 };
  const season = document.getElementById("editSeason").value;
  const day = document.getElementById("editDay").value;
  if (!session.schedule[tou][season]) session.schedule[tou][season] = {};
  session.schedule[tou][season][day] = slots;
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

function settingsSchema() {
  /** 設定頁電價／契約欄位：跟 settingsTou，不跟匯入 session.tou。 */
  return session.schemas && session.schemas[settingsPlanTou()];
}

function demandKeyApplies(key) {
  const field = DEMAND_CONTRACT_FIELD[key];
  if (!field) return true;
  const schema = settingsSchema();
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
    <span class="btm-split" aria-hidden="true"></span>
    <label class="ts-field"><span class="ts-field__label">${t("settings.endMonth")}</span>
      <input class="ts-input" type="number" min="1" max="12" id="sr-em" value="${r.end_month || 10}"></label>
    <label class="ts-field"><span class="ts-field__label">${t("settings.endDay")}</span>
      <input class="ts-input" type="number" min="1" max="31" id="sr-ed" value="${r.end_day || 15}"></label>
  </div>`;
}

function holidayTableHtml() {
  const rows = session.holidays || [];
  let html = `<table class="btm-table btm-edit-table btm-holidays"><thead><tr>
    <th>${t("settings.holidayDate")}</th><th>${t("settings.holidayName")}</th><th></th></tr></thead><tbody>`;
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
  if (!["rates", "time", "holidays"].includes(settingsTab)) settingsTab = "rates";
  const rates = `<div class="btm-pair">
      <section class="btm-card hud-panel hud-frame">
        <h2 class="btm-card__title seetel-title">${t("settings.demand")}</h2>
        <div class="btm-table-wrap btm-table-wrap--tall">${demandTableHtml()}</div>
      </section>
      <section class="btm-card hud-panel hud-frame">
        <h2 class="btm-card__title seetel-title">${t("settings.energy")}</h2>
        <div class="btm-table-wrap btm-table-wrap--tall">${energyTableHtml()}</div>
      </section>
    </div>`;
  const time = `<section class="btm-card hud-panel hud-frame">
      <h2 class="btm-card__title seetel-title">${t("settings.summerRange")}</h2>
      ${summerRangeHtml()}
    </section>
    <section class="btm-card hud-panel hud-frame">
      <div class="btm-section-row">
        <h2 class="btm-card__title seetel-title">${t("settings.schedule")}</h2>
        <p class="btm-legend" id="matrixLegend"></p>
      </div>
      <div class="btm-row">
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
      <hr class="btm-rule">
      <div class="btm-timeline" id="timeline"></div>
      <div id="matrix"></div>
    </section>`;
  const holidays = `<section class="btm-card hud-panel hud-frame">
      <div class="btm-section-row">
        <h2 class="btm-card__title seetel-title">${t("settings.holidays")}</h2>
        <button type="button" class="btm-btn btm-btn--ghost" id="btnAddHol">${t("settings.addHoliday")}</button>
      </div>
      <div class="btm-table-wrap">${holidayTableHtml()}</div>
    </section>`;
  const body = settingsTab === "time" ? time : settingsTab === "holidays" ? holidays : rates;
  return `<div class="btm-page">
    ${pageHeader("settings.title")}
    <section class="btm-card hud-panel hud-frame">
      <div class="btm-toolbar btm-toolbar--fill">
        ${planSelectsHtml("settings")}
        <div class="ts-field ts-field--btn">
          <span class="ts-field__label">&nbsp;</span>
          <button type="button" class="btm-btn btm-btn--ghost" id="btnLoad">${t("settings.load")}</button>
        </div>
      </div>
    </section>
    ${pageStepBar([
      { id: "rates", label: t("settings.tabRates") },
      { id: "time", label: t("settings.tabTime") },
      { id: "holidays", label: t("settings.tabHolidays") },
    ], settingsTab)}
    ${body}
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
  const submit = document.getElementById("btnBill");
  if (submit) submit.disabled = !!billFetch || !(Number(session.contractValues.regular_kw) > 0);
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

function bindSettingsPlanSelects(onChange) {
  const v = document.getElementById("settingsVoltage");
  const tou = document.getElementById("settingsTou");
  if (v) {
    v.onchange = () => {
      session.settingsVoltage = v.value;
      persistSession();
      onChange();
    };
  }
  if (tou) {
    tou.onchange = () => {
      session.settingsTou = tou.value;
      persistSession();
      onChange();
    };
  }
}

function setRunMeta(el, msg, err) {
  if (!el) return;
  el.textContent = msg || "";
  el.classList.toggle("btm-meta--err", !!err);
  if (msg) {
    el.hidden = false;
    el.classList.remove("btm-meta--hidden");
  }
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

  async function afterFile(file, label, source) {
    session.file = file;
    session.fileLabel = label;
    session.fileSource = source;
    await clearImportedData();
    try {
      const data = await detectDateRange();
      session.start = data.date_min;
      session.end = data.date_max;
      persistSession();
      renderPage({ animate: false, preserveScroll: true });
      if (source === "sample") {
        const upload = document.getElementById("upload");
        if (upload) upload.value = "";
      }
    } catch (err) {
      const msg = String(err.message || err);
      renderPage({ animate: false, preserveScroll: true });
      setRunMeta(document.getElementById("runMeta"), msg, true);
    }
  }

  document.getElementById("upload").onchange = (e) => {
    const f = e.target.files[0];
    if (f) afterFile(f, f.name, "upload");
  };
  document.getElementById("btnSample").onclick = async () => {
    const name = document.getElementById("sample").value;
    if (!name) return;
    try {
      const r = await fetch("/api/import/samples/" + encodeURIComponent(name));
      if (!r.ok) throw new Error("load failed");
      const blob = await r.blob();
      await afterFile(new File([blob], name), name, "sample");
    } catch (err) {
      setRunMeta(runMeta, String(err.message || err), true);
    }
  };
  const btnBill = document.getElementById("btnBill");
  if (btnBill) btnBill.onclick = async () => {
    readFormCommon();
    readContractInputs();
    if (!session.file) {
      setRunMeta(runMeta, t("import.needFile"), true);
      return;
    }
    if (!session.start || !session.end) { setRunMeta(runMeta, t("import.needDates"), true); return; }
    const schema = currentSchema();
    if (!schema) { setRunMeta(runMeta, t("import.needSchema"), true); return; }
    const contracts = {};
    for (const f of schema.fields) contracts[f] = Number(session.contractValues[f] || 0);
    if (!(contracts.regular_kw > 0)) {
      setRunMeta(runMeta, t("import.needRegular"), true);
      return;
    }
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
    sizingDiagnosis = null;
    billFetch = apiJson("/api/import", { method: "POST", body: fdRun })
      .then((imported) => {
        if (id !== billJob) return null;
        session.importId = imported.import_id;
        session.importRowCount = imported.row_count;
        session.settingsVoltage = session.voltage;
        session.settingsTou = session.tou;
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
    forgetPickedFile();
    persistSession();
    renderPage({ animate: false, preserveScroll: true });
  };
}

async function ensureSettingsLoaded(opts) {
  const reloadRates = !!(opts && opts.reloadRates);
  if (!reloadRates && session._settingsLoaded) return true;
  try {
    const data = await apiJson("/api/settings/defaults");
    if (reloadRates || !session.rates) session.rates = data.rates;
    if (reloadRates || !session.schedule) session.schedule = data.schedule;
    if (reloadRates || session.holidays == null) session.holidays = data.holidays;
    if (data.simulate && typeof data.simulate === "object") {
      simulateDefaults = { ...BUILTIN_SIMULATE_DEFAULTS, ...data.simulate };
      // 補齊缺欄；畫面上已有的值保留，試算送的是這份，不再回讀預設。
      // 上一版開機副本：2%／10／50 或 5%＋上下限。只清一次。
      const prev = session.simulate || {};
      if (!session.simDefaultsStamp || session.simDefaultsStamp < 2) {
        if (
          (Number(prev.bufferPct) === 2
            && Number(prev.bufferMinKw) === 10
            && Number(prev.bufferMaxKw) === 50)
          || (Number(prev.bufferPct) === 5
            && prev.bufferMinKw != null
            && prev.bufferMaxKw != null
            && prev.demandBufferKw == null)
        ) {
          delete prev.bufferPct;
          delete prev.demandBufferKw;
          delete prev.antiExportKw;
        }
        delete prev.bufferMinKw;
        delete prev.bufferMaxKw;
        if (Number(prev.reserveEnergyPrice) === 5000) delete prev.reserveEnergyPrice;
        session.simDefaultsStamp = 2;
      }
      session.simulate = normalizeSimulate(prev);
    }
    session._settingsLoaded = true;
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
  if (!box) return;
  box.innerHTML = "";
  const stepMin = scheduleStep(settingsPlanTou());
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
        voltage: settingsPlanVoltage(),
        tou_type: settingsPlanTou(),
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
  bindPageTabs(() => settingsTab, (id) => { settingsTab = id; });
  bindSettingsPlanSelects(() => renderPage({ animate: false, preserveScroll: true }));

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

  const editSeason = document.getElementById("editSeason");
  const editDay = document.getElementById("editDay");
  if (editSeason) editSeason.onchange = () => { renderTimeline(); fetchPlanPreview(); };
  if (editDay) editDay.onchange = () => { renderTimeline(); fetchPlanPreview(); };
  if (editSeason) {
    renderTimeline();
    fetchPlanPreview();
  }
}

/* ── simulate page ── */

function simNumField(id, label, value, step, min, max) {
  const maxAttr = max != null ? ` max="${max}"` : "";
  return `<label class="ts-field"><span class="ts-field__label">${label}</span>
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
  const scenario = buildScenarioContracts() || {};
  const kw = Number(scenario.regular_kw || session.contractValues.regular_kw || 0);
  if (!(kw > 0)) return 0;
  // 經常契約換算 MW，對 0.1 無條件捨去（對齊後端 quantize_mw）
  return Math.floor(kw / 100 + 1e-9) / 10;
}

/** Manual 空白 HOLD 矩陣（持久化設定的空預設；不重算 Auto 規則）。 */
function blankTouSchedule(touType) {
  return makeSeasonMatrix(() => defaultTouSlots(touType || activeSimulateTou()));
}

function touScheduleIsAllHold(sched) {
  if (!sched || typeof sched !== "object") return true;
  for (const season of ["summer", "non_summer"]) {
    const block = sched[season];
    if (!block || typeof block !== "object") continue;
    for (const day of ["weekday", "saturday", "sunday"]) {
      const row = block[day];
      if (!Array.isArray(row)) continue;
      for (const v of row) {
        if (v != null && String(v).trim() !== "") return false;
      }
    }
  }
  return true;
}

/** Auto→Manual：一次複製推薦；尚無推薦則空白。不依電價重算。 */
function seedManualTouFromRecommended() {
  const tou = activeSimulateTou();
  const rec = simTouMetaFromResult()?.recommended_schedule;
  if (rec) return normalizeScheduleMatrix(rec, () => defaultTouSlots(tou));
  return blankTouSchedule(tou);
}

/** Manual 且全 HOLD、已有推薦時補一次種子（跑完試算後不必再切模式）。 */
function maybeSeedManualTouOnce() {
  const sim = session.simulate;
  if (!sim || sim.touScheduleMode !== "manual") return;
  if (!touScheduleIsAllHold(sim.touSchedule)) return;
  const rec = simTouMetaFromResult()?.recommended_schedule;
  if (!rec) return;
  sim.touSchedule = normalizeScheduleMatrix(rec, () => defaultTouSlots(activeSimulateTou()));
  persistSession();
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

function remapContractsForTou(fromTou, toTou, values) {
  const src = values && typeof values === "object" ? values : {};
  const out = {
    regular_kw: Number(src.regular_kw || 0),
    half_peak_kw: Number(src.half_peak_kw || 0),
    non_summer_kw: Number(src.non_summer_kw || 0),
    saturday_half_peak_kw: Number(src.saturday_half_peak_kw || 0),
    off_peak_kw: Number(src.off_peak_kw || 0),
  };
  if (fromTou === toTou) return out;
  if (toTou === "ThreeStage") {
    if (!(out.half_peak_kw > 0) && out.non_summer_kw > 0) {
      out.half_peak_kw = out.non_summer_kw;
    }
    out.non_summer_kw = 0;
  } else {
    if (!(out.non_summer_kw > 0) && out.half_peak_kw > 0) {
      out.non_summer_kw = out.half_peak_kw;
    }
    out.half_peak_kw = 0;
  }
  return out;
}

function snapshotScenarioTouState(tou) {
  const sim = session.simulate;
  const key = TOU_OPTIONS.includes(tou) ? tou : importPlanTou();
  if (!sim.scenarioByTou) sim.scenarioByTou = {};
  sim.scenarioByTou[key] = {
    scenarioContracts: { ...(sim.scenarioContracts || {}) },
    touSchedule: normalizeScheduleMatrix(sim.touSchedule, () => defaultTouSlots(key)),
    touScheduleMode: sim.touScheduleMode === "manual" ? "manual" : "auto",
  };
}

function loadScenarioTouState(tou) {
  const sim = session.simulate;
  const key = TOU_OPTIONS.includes(tou) ? tou : importPlanTou();
  const bag = sim.scenarioByTou && sim.scenarioByTou[key];
  if (bag && bag.scenarioContracts) {
    sim.scenarioContracts = { ...(bag.scenarioContracts || {}) };
  } else {
    sim.scenarioContracts = remapContractsForTou(
      importPlanTou(),
      key,
      { ...session.contractValues, ...(sim.scenarioContracts || {}) },
    );
  }
  // 排程一律依新方案時段／步距重種；不沿用上一方案手動格（否則會混半尖峰與批次）
  sim.touScheduleMode = "auto";
  sim.touSchedule = blankTouSchedule(key);
}

function clearSimulateResultSoft() {
  simDispatchChartKey = null;
  simDispatchChartCache = {};
  simDispatchChartPending = {};
  simDispatchCacheResultKey = null;
  simDispatchChartLoadId += 1;
  session.lastSimulateSize = null;
  session.lastSimulateSample = null;
  session.simulateError = null;
  session.simulateResultKey = null;
  persistSession();
}

function seedSimulateFromImport(force) {
  if (!session.importId) return;
  const sim = session.simulate;
  const key = simulateImportSeedKey();
  if (!force && sim.seededImportKey === key) return;
  sim.simulateTou = importPlanTou();
  sim.scenarioContracts = { ...session.contractValues };
  sim.scenarioByTou = {};
  sim.touScheduleMode = "auto";
  sim.touSchedule = blankTouSchedule(sim.simulateTou);
  sim.reserveSchedule = makeSeasonMatrix(defaultReserveHourly);
  sim.includeHalfPeak = false;
  sim.sizingStrategies = [...SIZING_TIER_IDS];
  sim.sizingEnergySeeds = [...ENERGY_SEED_IDS];
  sim.seededImportKey = key;
  {
    const sug = suggestedBufferKw(sim);
    sim.demandBufferKw = sug;
    sim.antiExportKw = sug;
  }
  snapshotScenarioTouState(sim.simulateTou);
  persistSession();
}

function applySimulateTouChange(nextTou) {
  const sim = session.simulate;
  const prev = activeSimulateTou();
  const next = TOU_OPTIONS.includes(nextTou) ? nextTou : importPlanTou();
  if (next === prev) return;
  readScenarioContractInputs();
  snapshotScenarioTouState(prev);
  sim.simulateTou = next;
  loadScenarioTouState(next);
  if (next !== "ThreeStage") sim.includeHalfPeak = false;
  // 換方案＝換整套標註／策略；舊報告會混半尖峰與批次時段
  clearSimulateResultSoft();
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
      const fill = (schedKey === "touSchedule" || schedKey === "pcsPowerSchedule") ? null : 0;
      const hours = ensureSlots(raw, n, fill);
      html += `<tr><th>${dayLab}</th>`;
      for (let i = 0; i < n; i++) {
        const period = periodMap && periodMap[season] && periodMap[season][day] && periodMap[season][day][i];
        const base = PERIOD_COLORS[period];
        const bg = base ? `style="background:${base}29"` : "";
        const cell = hours[i];
        const val = cell == null || cell === "" ? "" : cell;
        const ph = (schedKey === "touSchedule" || schedKey === "pcsPowerSchedule") ? ` placeholder="—"` : "";
        const ro = (cfg.readonly || cfg.viewOnly) ? " readonly" : "";
        const schedAttr = cfg.viewOnly ? "" : ` data-sched="${schedKey}"`;
        html += `<td ${bg}><input class="sim-matrix__input" type="number"${schedAttr} data-season="${season}" data-day="${day}" data-slot="${i}"${minAttr}${maxAttr}${stepAttr}${ph}${ro} value="${val}"></td>`;
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

function renderFnModeCard(prefix, modeKey, sim, T, opts = {}) {
  const mode = sim[modeKey];
  const autoOn = mode === "auto";
  const badge = opts.badge || "";
  // 編輯鈕固定佔位：自動時 disabled，避免切換時左右重排
  return `<div class="sim-fn-subcard hud-panel hud-frame sim-fn-row" data-sched-block="${prefix}">
    <div class="sim-fn-subcard__head sim-fn-row__head">
      <div class="sim-fn-row__lead">
        <span class="sim-fn-subcard__title"><i class="fa-solid fa-calendar-days"></i> ${opts.scheduleTitle || T.scheduleMode}</span>
        ${badge ? `<span class="sim-fn-row__badge">${badge}</span>` : ""}
      </div>
      <div class="sim-fn-row__actions">
      <div class="sim-schedule__switch" role="group">
          <label class="sim-seg${autoOn ? " sim-seg--on" : ""}">
            <input type="radio" name="${modeKey}" value="auto"${autoOn ? " checked" : ""}> ${T.scheduleAuto}
        </label>
          <label class="sim-seg${!autoOn ? " sim-seg--on" : ""}">
            <input type="radio" name="${modeKey}" value="manual"${!autoOn ? " checked" : ""}> ${T.scheduleManual}
        </label>
      </div>
        <button type="button" class="btm-btn btm-btn--ghost sim-schedule__open" data-sched-open="${prefix}"
          ${autoOn ? " disabled aria-disabled=\"true\"" : ""}>
          <i class="fa-solid fa-table" aria-hidden="true"></i> ${T.scheduleEdit}
        </button>
    </div>
    </div>
  </div>`;
}

function renderFnParamsCard(bodyHtml) {
  if (!bodyHtml || !String(bodyHtml).trim()) return "";
  return `<div class="sim-fn-subcard hud-panel hud-frame">
    <div class="sim-fn-subcard__body">${bodyHtml}</div>
  </div>`;
}

function simFnPanel(active, panel, body) {
  return `<div class="sim-tab-panel${active ? "" : " sim-tab-panel--hidden"}" data-panel="${panel}">
    <div class="sim-fn-stack">${body}</div>
  </div>`;
}

function reserveFailLabel(T, reason) {
  const key = String(reason || "");
  if (key === "pcs_headroom") return T.reserveFailPcs;
  if (key === "recovery") return T.reserveFailRecovery;
  if (key === "cbl") return T.reserveFailCbl;
  if (key === "soc" || key === "energy" || key === "low_soc") return T.reserveFailSoc;
  if (key === "anti_export") return T.reserveFailAntiExport;
  if (key === "factory_load_rise") return T.reserveFailFactoryRise;
  return key || T.reserveEventFail;
}

function simTouMetaFromResult(res) {
  const base = res || normalizeSimulateSizeResult(session.lastSimulateSize);
  return simRowField(base, simViewRow(base), "tou_meta");
}

function simReserveMetaFromResult(res) {
  const base = res || normalizeSimulateSizeResult(session.lastSimulateSize);
  const s2 = simActiveStage2(base);
  const final = s2 && s2.final;
  if (final && final.reserve_meta) return final.reserve_meta;
  if (base && base.reserve_meta) return base.reserve_meta;
  const row = simViewRow(base);
  return (row && row.reserve_meta) || null;
}

function renderReportRecSchedules(T, res) {
  /** 報告內直接呈現排程矩陣（唯讀）；不再彈窗／套用並調整。 */
  const touMeta = simTouMetaFromResult(res) || {};
  const tou = (res && res.simulate_tou_type) || activeSimulateTou();
  const step = touStepMinutes(tou);
  const blocks = [];
  const touMatrix = touMeta.recommended_schedule
    || (session.simulate.touScheduleMode === "manual" ? session.simulate.touSchedule : null);
  if (touMatrix) {
    blocks.push(`<div class="sim-report-sched__block">
      <h3 class="btm-subhead">${T.touRecTitle || T.simRecTou}</h3>
      ${renderSimMatrix("touSchedule", touMatrix, T, {
        header: T.touTargetSoc,
        min: 0,
        max: 100,
        step: 1,
        slotMinutes: step,
        touType: tou,
        readonly: true,
        viewOnly: true,
      })}
    </div>`);
  }
  const fns = res?.functions || session.simulate.functions || [];
  const reserveMeta = simReserveMetaFromResult(res) || {};
  const reserveMatrix = reserveMeta.recommended_schedule || null;
  if (fns.includes("reserve") && reserveMatrix) {
    blocks.push(`<div class="sim-report-sched__block">
      <h3 class="btm-subhead">${T.reserveRecTitle || T.simRecReserve}</h3>
      ${renderSimMatrix("reserveSchedule", reserveMatrix, T, {
        header: T.reserveBidMw,
        min: 0,
        step: 0.1,
        slotMinutes: 60,
        readonly: true,
        viewOnly: true,
      })}
    </div>`);
  }
  const power = simPcsPowerMatrixForView(res, step);
  if (power) {
    blocks.push(`<div class="sim-report-sched__block">
      <h3 class="btm-subhead">${T.touPowerTitle || T.scheduleViewPower}</h3>
      ${renderSimMatrix("pcsPowerSchedule", power, T, {
        header: T.touActualPower,
        step: 0.1,
        slotMinutes: step,
        touType: tou,
        readonly: true,
        viewOnly: true,
      })}
    </div>`);
  }
  if (!blocks.length) return "";
  return `<div class="sim-report-sched" id="simReportRec">${blocks.join("")}</div>`;
}

function simMoneyInt(x) {
  const v = Number(x) || 0;
  return v >= 0 ? Math.floor(v + 0.5) : Math.ceil(v - 0.5);
}

function simEnergyTransferHtml(res, T, row, { embedded = false } = {}) {
  const r = row || simViewRow(res);
  const payload = simRowField(res, r, "energy_transfer");
  const rows = (payload && payload.rows) || [];
  if (!rows.length) {
    if (!embedded && simViewDetailWaiting(res, r)) {
      return simBusyCard("simEnergyTransfer", T.simEnergyTransfer, T.simViewBusy);
    }
    return "";
  }
  const baseTou = (payload && payload.baseline_tou) || (res && res.baseline_tou_type) || importPlanTou();
  const simTou = (payload && payload.simulate_tou) || (res && res.simulate_tou_type) || activeSimulateTou();
  const colBefore = `${T.simKwhBefore}<br><span class="btm-meta">${baseTou}</span>`;
  const colAfter = `${T.simKwhAfter}<br><span class="btm-meta">${simTou}</span>`;
  const showItemAmt = rows.some((x) => x.before_amount != null);
  const showRowMoney = rows.some((x) => x.delta_amount != null);
  // 合計：帳單快照流動電費差（與 calc_full_bill 同口徑）
  const billDelta = payload && payload.energy_total_delta != null
    ? Number(payload.energy_total_delta)
    : null;
  const showMoney = billDelta != null && Number.isFinite(billDelta);
  const effKwh = payload && payload.effective_transfer_kwh != null
    ? Number(payload.effective_transfer_kwh)
    : rows.reduce((s, x) => {
      const d = Number(x.delta_kwh);
      return s + (d < 0 ? d : 0);
    }, 0);
  const moneyCls = (n) => (n < 0 ? " sim-delta--save" : (n > 0 ? " sim-delta--up" : ""));
  const body = rows.map((x) => {
    const pct = x.delta_pct == null ? "—" : `${fmt(x.delta_pct, 1)}%`;
    const d = Number(x.delta_kwh);
    const dCls = d < 0 ? " sim-delta--save" : (d > 0 ? " sim-delta--up" : "");
    const side = x.side || "both";
    const rowCls = side === "both" ? "" : " sim-xfer-row--oneside";
    const sideTag = side === "before_only"
      ? `<span class="btm-chip btm-chip--dim">${T.simXferSideBefore}</span> `
      : side === "after_only"
        ? `<span class="btm-chip btm-chip--dim">${T.simXferSideAfter}</span> `
        : "";
    const itemAmt = !showItemAmt ? "" : (() => {
      const ba = x.before_amount == null ? null : Number(x.before_amount);
      return `<td class="num">${ba == null ? "—" : fmt(ba)}</td>`;
    })();
    const amtCell = !showRowMoney ? "" : (() => {
      const da = x.delta_amount == null ? null : Number(x.delta_amount);
      const aCls = da == null ? "" : moneyCls(da);
      return `<td class="num${aCls}">${da == null ? "—" : fmt(da)}</td>`;
    })();
    return `<tr class="${rowCls}">
      <td>${seasonLabel(x.season)}</td>
      <td>${sideTag}${periodLabel(x.period)}</td>
      ${itemAmt}
      <td class="num">${fmt(x.before_kwh, 1)}</td>
      <td class="num">${fmt(x.after_kwh, 1)}</td>
      <td class="num${dCls}">${fmt(x.delta_kwh, 1)}</td>
      <td class="num${dCls}">${pct}</td>
      ${amtCell}
    </tr>`;
  }).join("");
  const footParts = [];
  if (Number.isFinite(effKwh)) {
    const absEff = Math.abs(effKwh);
    footParts.push(
      `<span>${T.simXferEffective} <strong>${fmt(absEff, 1)}</strong> kWh</span>`
    );
  }
  if (showMoney) {
    footParts.push(
      `<span>${T.simXferEnergy} <strong class="${moneyCls(billDelta).trim()}">${fmt(billDelta)}</strong></span>`
    );
  }
  const foot = !footParts.length ? "" : `<div class="sim-xfer-totals">${footParts.join("")}</div>`;
  const inner = `
    <h4 class="btm-subhead">${T.simEnergyTransfer}</h4>
    <div class="btm-table-wrap">
      <table class="btm-table btm-table--dash">
        <thead><tr>
          <th>${t("settings.season")}</th>
          <th>${t("dashboard.item")}</th>
          ${showItemAmt ? `<th class="num">${T.simXferItemAmount}</th>` : ""}
          <th class="num">${colBefore}</th>
          <th class="num">${colAfter}</th>
          <th class="num">${T.simKwhDelta}</th>
          <th class="num">${T.simKwhDeltaPct}</th>
          ${showRowMoney ? `<th class="num">${T.simXferAmount}</th>` : ""}
        </tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    ${foot}`;
  if (embedded) return `<div class="sim-benefit-transfer">${inner}</div>`;
  return `<section class="btm-card hud-panel hud-frame" id="simEnergyTransfer">${inner}</section>`;
}

function scheduleModalConfig(kind, sim, T) {
  if (kind === "tou" || kind === "tou-rec" || kind === "tou-power") {
    const res = normalizeSimulateSizeResult(session.lastSimulateSize);
    const tou = (res && res.simulate_tou_type) || activeSimulateTou();
    const step = touStepMinutes(tou);
    const recOnly = kind === "tou-rec";
    const powerOnly = kind === "tou-power";
    let matrix = sim.touSchedule;
    let title = `${T.touTargetSoc} · ${tou}`;
    let header = T.touTargetSoc;
    let min = 0;
    let max = 100;
    let stepNum = 1;
    if (recOnly) {
      matrix = (simTouMetaFromResult()?.recommended_schedule || sim.touSchedule);
      title = `${T.touRecTitle} · ${tou}`;
    } else if (powerOnly) {
      matrix = simPcsPowerMatrixForView(res, step) || makeSeasonMatrix(() => Array(Math.round((24 * 60) / step)).fill(null));
      title = `${T.touPowerTitle} · ${tou}`;
      header = T.touActualPower;
      min = undefined;
      max = undefined;
      stepNum = 0.1;
    }
    return {
      kind: "tou",
      title,
      modeKey: "touScheduleMode",
      schedKey: powerOnly ? "pcsPowerSchedule" : "touSchedule",
      matrix,
      cfg: {
        header,
        min,
        max,
        step: stepNum,
        slotMinutes: step,
        touType: tou,
        readonly: recOnly || powerOnly || sim.touScheduleMode !== "manual",
        viewOnly: recOnly || powerOnly,
      },
    };
  }
  if (kind === "reserve" || kind === "reserve-rec") {
    const maxMw = simMaxReserveBidMw();
    const recOnly = kind === "reserve-rec";
    const matrix = recOnly
      ? (simReserveMetaFromResult()?.recommended_schedule || sim.reserveSchedule)
      : sim.reserveSchedule;
    return {
      kind: "reserve",
      title: recOnly ? T.reserveRecTitle : T.reserveBidMw,
      modeKey: "reserveScheduleMode",
      schedKey: "reserveSchedule",
      matrix,
      cfg: {
        header: T.reserveBidMw,
        min: 0,
        max: maxMw > 0 ? maxMw : undefined,
        step: 0.1,
        slotMinutes: 60,
        readonly: recOnly || sim.reserveScheduleMode !== "manual",
        viewOnly: recOnly,
        badge: maxMw > 0
          ? `<span class="btm-chip btm-chip--dim">${T.reserveMaxLabel} ${maxMw} MW</span>`
          : `<span class="btm-chip btm-chip--warn">${T.reserveNoContract}</span>`,
      },
    };
  }
  return null;
}

function renderScheduleModal(T, sim) {
  const spec = scheduleModalConfig(simScheduleModal, sim, T);
  if (!spec) return "";
  const mode = sim[spec.modeKey];
  const badge = spec.cfg.badge ? `<span class="sim-schedule__badge">${spec.cfg.badge}</span>` : "";
  const viewKinds = ["reserve-rec", "tou-rec", "tou-power"];
  const modeChip = viewKinds.includes(simScheduleModal)
    ? `<span class="btm-chip btm-chip--dim">${simScheduleModal === "tou-power" ? T.scheduleViewPower : T.scheduleAuto}</span>`
    : `<span class="btm-chip btm-chip--dim">${mode === "manual" ? T.scheduleManual : T.scheduleAuto}</span>`;
  return `<div class="sim-sched-modal" id="simSchedModal" role="dialog" aria-modal="true" aria-labelledby="simSchedModalTitle">
    <button type="button" class="sim-sched-modal__backdrop" data-sched-close tabindex="-1" aria-label="${T.scheduleDone}"></button>
    <div class="sim-sched-modal__panel hud-panel hud-frame">
      <header class="sim-sched-modal__head">
        <div class="sim-sched-modal__titles">
          <h3 id="simSchedModalTitle" class="sim-sched-modal__title">${spec.title}</h3>
        </div>
        <div class="sim-sched-modal__head-actions">
          ${badge}
          ${modeChip}
          <button type="button" class="btm-btn btm-btn--primary" data-sched-close>${T.scheduleDone}</button>
        </div>
      </header>
      <div class="sim-sched-modal__body" id="${spec.kind}HourlyGrid">
        ${renderSimMatrix(spec.schedKey, spec.matrix, T, spec.cfg)}
      </div>
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
    // SOC／效率由表單 % 另轉，這裡不讀
    if (key === "chargeEff" || key === "socMin" || key === "socMax") return;
    if (el.tagName === "SELECT") {
      sim[key] = el.value;
      return;
    }
    const raw = String(el.value).trim();
    if (raw === "") return;
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    sim[key] = n;
  });
  // 表單 % → session 小數（SOC／效率）
  const effEl = document.querySelector('[data-sim="chargeEff"]');
  if (effEl) {
    const pct = Number(effEl.value);
    if (Number.isFinite(pct)) sim.chargeEff = Math.max(0.5, Math.min(1, pct / 100));
  }
  const loEl = document.querySelector('[data-sim="socMin"]');
  const hiEl = document.querySelector('[data-sim="socMax"]');
  if (loEl || hiEl) {
    let lo = loEl && String(loEl.value).trim() !== "" ? Number(loEl.value) / 100 : sim.socMin;
    let hi = hiEl && String(hiEl.value).trim() !== "" ? Number(hiEl.value) / 100 : sim.socMax;
    if (!Number.isFinite(lo)) lo = sim.socMin;
    if (!Number.isFinite(hi)) hi = sim.socMax;
    lo = Math.max(0, Math.min(1, lo));
    hi = Math.max(0, Math.min(1, hi));
    if (lo > hi) [lo, hi] = [hi, lo];
    sim.socMin = lo;
    sim.socMax = hi;
  }
  document.querySelectorAll("[data-sim-check]").forEach((el) => {
    sim[el.dataset.simCheck] = el.checked;
  });
  // demand 功能驅動第2層契約評估
  if ((sim.functions || []).includes("demand")) {
    sim.evaluateContractReduction = true;
  } else if (document.querySelector('[name="bessFn"][value="demand"]')) {
    sim.evaluateContractReduction = false;
  }
  delete sim.autoAdjustOffPeakContract;
  const simTouEl = document.getElementById("simScenarioTou");
  if (simTouEl && TOU_OPTIONS.includes(simTouEl.value) && simTouEl.value !== sim.simulateTou) {
    applySimulateTouChange(simTouEl.value);
  } else if (simTouEl && TOU_OPTIONS.includes(simTouEl.value)) {
    sim.simulateTou = simTouEl.value;
  }
  readScenarioContractInputs();
  snapshotScenarioTouState(activeSimulateTou());
  const touMode = document.querySelector('[name="touScheduleMode"]:checked');
  if (touMode) sim.touScheduleMode = touMode.value;
  const reserveMode = document.querySelector('[name="reserveScheduleMode"]:checked');
  if (reserveMode) sim.reserveScheduleMode = reserveMode.value;
  const sizingModeEl = document.querySelector('[name="sizingMode"]:checked');
  if (sizingModeEl) sim.sizingMode = sizingModeEl.value === "single" ? "single" : "grid";
  const pickedBoxes = [...document.querySelectorAll('[name="sizingStrategies"]')];
  if (pickedBoxes.some((el) => !el.disabled)) {
    sim.sizingStrategies = normalizeSizingStrategies(
      pickedBoxes.filter((el) => el.checked && !el.disabled).map((el) => el.value),
    );
  }
  const energyBoxes = [...document.querySelectorAll('[name="sizingEnergySeeds"]')];
  // 樣本未到時卡片是 disabled，不能把 session 裡已選的清掉
  if (energyBoxes.some((el) => !el.disabled)) {
    sim.sizingEnergySeeds = normalizeEnergySeeds(
      energyBoxes.filter((el) => el.checked && !el.disabled).map((el) => el.value),
    );
  } else if (!Array.isArray(sim.sizingEnergySeeds)) {
    sim.sizingEnergySeeds = [...ENERGY_SEED_IDS];
  }
  const halfPeak = document.querySelector('[name="includeHalfPeak"]:checked');
  if (halfPeak) sim.includeHalfPeak = halfPeak.value === "1";
  if (activeSimulateTou() !== "ThreeStage") sim.includeHalfPeak = false;
  persistSession();
}

function syncContractFunction(sim, source) {
  /** demand 功能＝自動調整契約容量；不與防超約參數綁定。 */
  if (source === "demand") {
    sim.evaluateContractReduction = (sim.functions || []).includes("demand");
    delete sim.autoAdjustOffPeakContract;
    return;
  }
  const on = !!sim.evaluateContractReduction
    || (sim.functions || []).includes("demand");
  sim.evaluateContractReduction = on;
  delete sim.autoAdjustOffPeakContract;
  const rest = (sim.functions || []).filter((f) => f !== "tou" && f !== "demand");
  sim.functions = on ? ["tou", ...rest, "demand"] : ["tou", ...rest];
}

function syncSimulateTabs() {
  const sim = session.simulate;
  const fns = new Set(sim.functions);
  if (!fns.has(sim.detailTab) && sim.detailTab !== "tou" && sim.detailTab !== "plan_change") {
    sim.detailTab = "tou";
  }
  document.querySelectorAll(".sim-tab").forEach((el) => {
    const tab = el.dataset.tab;
    const enabled = tab === "tou" || tab === "plan_change" || fns.has(tab);
    el.classList.toggle("sim-tab--dim", !enabled);
    el.classList.toggle("sim-tab--active", tab === sim.detailTab && enabled);
  });
  document.querySelectorAll(".sim-tab-panel").forEach((el) => {
    const on = el.dataset.panel === sim.detailTab;
    el.classList.toggle("sim-tab-panel--hidden", !on);
    el.setAttribute("aria-hidden", on ? "false" : "true");
  });
  document.querySelectorAll(".sim-seg").forEach((el) => {
    const input = el.querySelector("input");
    if (input) el.classList.toggle("sim-seg--on", input.checked);
  });
}

function renderSimulateTabs(T, sim) {
  // TOU + 方案更改：固定顯示（無勾選）
  const touTab = `<button type="button" class="sim-tab sim-tab--locked${sim.detailTab === "tou" ? " sim-tab--active" : ""}" data-tab="tou" role="tab">
    <i class="fa-solid fa-clock"></i><span>${T.tou}</span>
    <span class="sim-tab-lock"><i class="fa-solid fa-thumbtack"></i></span>
  </button>`;
  const planTab = `<button type="button" class="sim-tab sim-tab--locked${sim.detailTab === "plan_change" ? " sim-tab--active" : ""}" data-tab="plan_change" role="tab">
    <i class="fa-solid fa-right-left"></i><span>${T.simPlanChange}</span>
    <span class="sim-tab-lock"><i class="fa-solid fa-thumbtack"></i></span>
  </button>`;

  const optTabs = BESS_OPTIONAL.map(({ id, icon }) => {
    const labelKey = id === "large_user" ? "largeUser" : id;
    const scenario = buildScenarioContracts() || {};
    const regular = Number(scenario.regular_kw || session.contractValues.regular_kw || 0);
    const largeBlocked = id === "large_user" && regular < LARGE_USER_MIN_KW;
    const checked = !largeBlocked && sim.functions.includes(id);
    if (largeBlocked && sim.functions.includes(id)) {
      sim.functions = sim.functions.filter((f) => f !== "large_user");
    }
    const active = sim.detailTab === id && checked ? " sim-tab--active" : "";
    const dimmed = checked ? "" : " sim-tab--dim";
    const blocked = largeBlocked ? " disabled" : "";
    return `<button type="button" class="sim-tab${active}${dimmed}" data-tab="${id}" role="tab"${blocked}${largeBlocked ? " aria-disabled=\"true\"" : ""}>
      <label class="sim-tab-check" onclick="event.stopPropagation()">
        <input type="checkbox" name="bessFn" value="${id}"${checked ? " checked" : ""}${blocked}>
        <span class="sim-tab-check__box"></span>
      </label>
      <i class="fa-solid ${icon}"></i><span>${T[labelKey]}</span>
    </button>`;
  }).join("");

  return `<div class="sim-tabs" role="tablist">
    <div class="sim-tabs__row sim-tabs__row--primary">${touTab}${planTab}</div>
    <div class="sim-tabs__row sim-tabs__row--optional">${optTabs}</div>
  </div>`;
}

function buildContractsFromSchema(touType, values) {
  const schema = session.schemas && session.schemas[touType];
  if (!schema) return null;
  const src = values && typeof values === "object" ? values : {};
  const contracts = {};
  for (const f of schema.fields) contracts[f] = Number(src[f] || 0);
  return contracts;
}

function buildBaselineContracts() {
  return buildContractsFromSchema(importPlanTou(), session.contractValues);
}

function buildScenarioContracts() {
  const tou = activeSimulateTou();
  const src = {
    ...session.contractValues,
    ...(session.simulate.scenarioContracts || {}),
  };
  return buildContractsFromSchema(tou, src);
}

function buildContractsFromSession() {
  return buildScenarioContracts();
}

function appendSimulateContractFields(fd, contractsOverride) {
  const contracts = contractsOverride || buildScenarioContracts();
  const baseline = buildBaselineContracts();
  if (!contracts || !baseline) return null;
  fd.append("contracts", JSON.stringify(contracts));
  fd.append("baseline_contracts", JSON.stringify(baseline));
  return contracts;
}

function simScenarioContractFieldsHtml(T) {
  const tou = activeSimulateTou();
  const schema = session.schemas && session.schemas[tou];
  if (!schema) return `<p class="btm-meta--err">${t("import.needSchema")}</p>`;
  const src = {
    ...session.contractValues,
    ...(session.simulate.scenarioContracts || {}),
  };
  return schema.fields
    .map((f) => {
      const v = src[f] ?? 0;
      return `<label class="ts-field" data-sim-contract="${f}"><span class="ts-field__label">${t("fields." + f)}</span>
        <input class="ts-input" type="number" id="sim-kw-${f}" min="0" step="1" value="${v}"></label>`;
    })
    .join("");
}

function readScenarioContractInputs() {
  const tou = activeSimulateTou();
  const schema = session.schemas && session.schemas[tou];
  if (!schema) return;
  const bag = { ...(session.simulate.scenarioContracts || {}) };
  for (const f of schema.fields) {
    const el = document.getElementById("sim-kw-" + f);
    if (el) bag[f] = Number(el.value || 0);
  }
  session.simulate.scenarioContracts = bag;
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

/** 是否需要／已要求契約或備轉第二層。 */
function simWantsStage2(res) {
  if (!res) return false;
  if (res.need_full) return true;
  if (res.want_reserve || res.want_contract || res.evaluate_contract_reduction) return true;
  return (res.functions || []).includes("reserve");
}

/** 需要第二層且尚未完成（full 失敗則放行，顯示 stage1＋錯誤）。 */
function simStage2Pending(res) {
  if (!res || !simWantsStage2(res)) return false;
  if (simHasFullContext(res)) return false;
  if (session._simFullError && !simulateFullFetch) return false;
  return true;
}

function simStage2Map(res) {
  return (res && res.stage2ByKey) || {};
}

function simStage2At(res, row) {
  const key = simRowChartKey(row);
  if (!key || !res) return null;
  const hit = simStage2Map(res)[key];
  if (hit && hit.enabled && hit.final) return hit;
  const top = res.stage2;
  if (top && top.enabled && top.final && simRowChartKey(top.final) === key) return top;
  return null;
}

function simSeedStage2Map(res) {
  if (!res || typeof res !== "object") return res;
  const map = { ...(res.stage2ByKey || {}) };
  if (res.stage2 && res.stage2.enabled && res.stage2.final) {
    const k = simRowChartKey(res.stage2.final);
    if (k) map[k] = res.stage2;
  }
  res.stage2ByKey = map;
  return res;
}

function simActiveStage2(res, mode) {
  return simStage2At(res, simViewBaseRow(res, mode));
}

function simHasFullContext(res, row) {
  return !!simStage2At(res, row || simViewBaseRow(res));
}

function simChartCacheKey(row, ctx) {
  const base = simRowChartKey(row);
  if (!base) return null;
  return `${base}__${ctx || simViewContext || "sizing"}`;
}

function simSizingRow(res) {
  return (res && res.stage1 && res.stage1.recommended)
    || (res && res.recommended)
    || ((res && res.grid) || []).find((r) => r.recommended)
    || null;
}

/** 配置檢視量體列（不含 stage2 覆寫）。 */
function simViewBaseRow(res, mode) {
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
    || simViewBaseRow(res, "max_savings");
}

function simMergeStage2Row(base, s2) {
  if (!base) return null;
  if (!s2 || !s2.final) return base;
  return {
    ...base,
    ...s2.final,
    recommended: base.recommended,
    best_effort: base.best_effort,
    max_util: base.max_util,
  };
}

function simViewRow(res, mode) {
  const base = simViewBaseRow(res, mode);
  // Final Bundle：有 Stage2 就合併；不再在 sizing/full 兩套結果間切換
  const s2 = simStage2At(res, base);
  if (s2) return simMergeStage2Row(base, s2);
  return base;
}

/** 目前選點的最終口徑：有 Stage2＝full，否則 sizing。 */
function syncSimViewContext(res, row) {
  simViewContext = simHasFullContext(res, row || simViewBaseRow(res)) ? "full" : "sizing";
  return simViewContext;
}

function simAdoptedSchemeContracts(res, row) {
  const r = row || simViewRow(res);
  if (r && r.stage2_contracts) return r.stage2_contracts;
  const s2 = simStage2At(res, simViewBaseRow(res));
  if (s2 && s2.final && s2.final.stage2_contracts) return s2.final.stage2_contracts;
  return null;
}

function simViewBillRow(res) {
  return simViewRow(res);
}

function simHighlightKey(res) {
  return simRowChartKey((res && (res.recommended || res.best_effort)) || null);
}

/** 只取這個點自己的欄位；頂層資料屬於目前重點才沿用。 */
function simRowField(res, row, field) {
  if (row && row[field]) return row[field];
  const s2 = simStage2At(res, row);
  if (s2 && s2.final && s2.final[field]) return s2.final[field];
  if (s2 && s2[field]) return s2[field];
  if (row && res && res[field] && simRowChartKey(row) === simHighlightKey(res)) return res[field];
  return null;
}

function simUnitSaveValue(row) {
  const batt = Number(row?.batt_kwh) || 0;
  if (!(batt > 0)) return null;
  return Number(row?.savings || 0) / batt;
}

function simViewDetailWaiting(res, row) {
  if (!row || !session.importId || row._simChartsFailed) return false;
  const key = simRowChartKey(row);
  if (!key) return false;
  // 需要 Stage2 但尚未完成：顯示計算中
  if (simWantsStage2(res) && !simHasFullContext(res, row)) return true;
  if (simLookupDispatchCache(row) || simRowField(res, row, "energy_transfer")) return false;
  return true;
}

function simBusyCard(id, title, msg) {
  return `<section class="btm-card hud-panel hud-frame" id="${id}">
    <h2 class="btm-card__title seetel-title">${title}</h2>
    ${busyBlockHtml(msg)}
  </section>`;
}

function simSyncViewChartKey(res) {
  const row = simViewRow(res);
  simDispatchChartKey = simChartCacheKey(row, simViewContext) || simRowChartKey(row);
}

/** 把 /full 結果併入既有 stage1；stage2 依 pcs/batt 快取。 */
function simMergeFullResult(base, full) {
  if (!full || typeof full !== "object") return normalizeSimulateSizeResult(base);
  const src = base && Array.isArray(base.grid) && base.grid.length ? base : full;
  const out = normalizeSimulateSizeResult({
    ...src,
    stage1_key: full.stage1_key || src.stage1_key,
    need_full: false,
    want_contract: full.want_contract ?? src.want_contract,
    want_reserve: full.want_reserve ?? src.want_reserve,
    evaluate_contract_reduction:
      full.evaluate_contract_reduction ?? src.evaluate_contract_reduction,
    functions: full.functions || src.functions,
    timing: full.timing || src.timing,
    stage2ByKey: { ...(src.stage2ByKey || {}), ...(full.stage2ByKey || {}) },
    stage2: src.stage2 || null,
    _simulatePayload: src._simulatePayload || full._simulatePayload || simFrozenPayload,
  });
  if (!out) return null;
  if (full.stage2 && full.stage2.enabled && full.stage2.final) {
    const k = simRowChartKey(full.stage2.final);
    if (k) out.stage2ByKey[k] = full.stage2;
  }
  const recKey = simRowChartKey(out.recommended);
  const evalKey = full.stage2 && full.stage2.final
    ? simRowChartKey(full.stage2.final)
    : null;
  if (evalKey && evalKey === recKey) {
    out.stage2 = full.stage2;
    out.benefit_split = full.benefit_split;
    out.benefit_report = full.benefit_report
      || (full.stage2 && full.stage2.benefit_report);
    out.savings = full.savings;
    out.bill_savings = full.bill_savings;
    out.after = full.after;
    out.final = full.final;
    out.proposal = full.proposal || (full.stage2 && full.stage2.proposal);
    out.reserve_income = full.reserve_income;
    out.reserve_meta = full.reserve_meta;
    out.tou_meta = full.tou_meta;
    out.energy_transfer = full.energy_transfer;
    out.dispatch_charts = full.dispatch_charts || out.dispatch_charts;
  } else if (recKey && out.stage2ByKey[recKey]) {
    out.stage2 = out.stage2ByKey[recKey];
    const recS2 = out.stage2ByKey[recKey];
    if (recS2.benefit_split) out.benefit_split = recS2.benefit_split;
    if (recS2.benefit_report) out.benefit_report = recS2.benefit_report;
    if (recS2.proposal) out.proposal = recS2.proposal;
  }
  return out;
}

function simGridRowClass(row) {
  const parts = [];
  if (row.recommended) parts.push("sim-grid-row--rec");
  if (row.best_effort) parts.push("sim-grid-row--save");
  if (row.max_util) parts.push("sim-grid-row--util");
  return parts.join(" ");
}

function simGridMetricTh(main, sub) {
  return `<th class="num sim-grid-th" title="${main} · ${sub}"><span>${main}</span><small>${sub}</small></th>`;
}

function simPcsTierLabels(stats, T) {
  const out = {};
  if (!stats || !stats.ok) return out;
  const raw = stats.pcs_sample || {};
  const labels = {
    p50: T.simStrategyP50,
    p90: T.simStrategyP90,
    max: T.simStrategyMax,
    two_cycle: T.simTwoCycle,
  };
  for (const [tier, label] of Object.entries(labels)) {
    const v = Number(raw[tier]);
    if (v > 0) out[Math.round(v * 10) / 10] = label;
  }
  return out;
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

function simGridResultsHtml(res, T) {
  const rows = (res.grid || []).slice().sort((a, b) => {
    const pcs = Number(a.pcs_kw) - Number(b.pcs_kw);
    if (pcs) return pcs;
    return Number(a.batt_kwh) - Number(b.batt_kwh);
  });
  if (!rows.length) return `<p class="btm-meta">—</p>`;
  const tiers = simPcsTierLabels(res.profile_stats, T);
  const body = rows.map((row) => {
    const pcsKey = Math.round(Number(row.pcs_kw) * 10) / 10;
    const tier = tiers[pcsKey] ? `<small>${tiers[pcsKey]}</small>` : "";
    return `<tr class="${simGridRowClass(row)}">
      <td class="num">${fmt(row.pcs_kw, 0)}${tier}</td>
      <td class="num">${fmt(row.batt_kwh, 0)}</td>
      <td class="num">${fmt(row.hours, 1)}</td>
      ${simSeasonMetricCells(row)}
      <td class="num">${fmt(row.after_total)}</td>
      <td class="num">${fmt(row.savings)}</td>
      <td class="num">${fmt(row.savings_pct, 1)}%</td>
    </tr>`;
  }).join("");
  return `<div class="btm-table-wrap sim-grid-table-wrap">
    <table class="btm-table btm-table--dash sim-grid-table">
      <thead><tr>
        <th class="num">${T.simMapAxisPcs}</th>
        <th class="num">${T.simMapAxisBatt}</th>
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
  </div>`;
}

function clearSimAuxCaches() {
  simPcsPowerMatrixCache = {};
}

function normalizeSimulateSizeResult(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.grid) || !raw.grid.length) {
    return null;
  }
  const grid = raw.grid.map((r) => ({ ...r }));
  const findFlag = (flag) => grid.find((r) => r[flag]) || null;
  const out = {
    ...raw,
    grid,
    // 以 grid 標記為準，避免 session 反序列化後指標列與 tabs 脫鉤
    recommended: findFlag("recommended") || raw.recommended || null,
    best_effort: findFlag("best_effort") || raw.best_effort || null,
    max_util: findFlag("max_util") || raw.max_util || null,
    stage2ByKey: { ...(raw.stage2ByKey || {}) },
  };
  return simSeedStage2Map(out);
}

function renderSimSavingsChart(res, T) {
  const el = document.getElementById("simSavingsChart");
  if (!el || typeof echarts === "undefined" || !res || !(res.grid || []).length) return;

  try {
  if (simSavingsChart) {
    try { simSavingsChart.dispose(); } catch { /* ignore */ }
    simSavingsChart = null;
  }

  const gridRows = res.grid;
  const xyOf = (row) => [Number(row.savings) || 0, Number(row.batt_kwh) || 0];

  const roleColor = { recommended: "#34d399", max_savings: "#fbbf24", max_util: "#a78bfa" };
  const roleLabel = {
    recommended: [T.simViewRec, "top"],
    max_savings: [T.simViewMaxSave, "right"],
    max_util: [T.simViewMaxUtil, "left"],
  };
  const pointRole = (p) => (
    p.recommended ? "recommended" : p.best_effort ? "max_savings" : p.max_util ? "max_util" : ""
  );
  const data = gridRows.map((p) => {
    const role = pointRole(p);
    const color = roleColor[role] || "#94a3b8";
    const spec = roleLabel[role];
    return {
      value: xyOf(p),
      symbolSize: 12,
      itemStyle: {
        color,
        opacity: role ? 0.95 : 0.78,
      },
      label: spec ? {
        show: true,
        formatter: spec[0],
        position: spec[1],
        distance: 8,
        color: "#f8fafc",
        fontSize: 12,
        fontWeight: 700,
        backgroundColor: "rgba(8, 14, 22, 0.92)",
        borderColor: color,
        borderWidth: simViewMode === role ? 2 : 1,
        borderRadius: 6,
        padding: [4, 8],
      } : { show: false },
      row: p,
    };
  });

  simSavingsChart = echarts.init(el);
  simSavingsChart.setOption({
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    grid: {
      left: 28,
      right: 72,
      top: 36,
      bottom: 28,
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      appendToBody: true,
      confine: false,
      enterable: false,
      extraCssText: [
        "max-width:18rem",
        "z-index:40",
        "padding:0.65rem 0.8rem",
        "border-radius:0.55rem",
        "border:1px solid rgba(94,234,255,0.35)",
        "background:rgba(8,14,22,0.94)",
        "box-shadow:0 10px 28px rgba(0,0,0,0.45)",
        "color:#e8eef6",
        "line-height:1.45",
        "pointer-events:none",
      ].join(";"),
      position(pos, _params, _dom, _rect, size) {
        const [x, y] = pos;
        const viewW = size.viewSize[0];
        const viewH = size.viewSize[1];
        const boxW = size.contentSize[0];
        const boxH = size.contentSize[1];
        let left = x + 16;
        let top = y - boxH - 14;
        if (left + boxW > viewW - 8) left = x - boxW - 16;
        if (left < 8) left = 8;
        if (top < 8) top = y + 18;
        if (top + boxH > viewH - 8) top = Math.max(8, viewH - boxH - 8);
        return [left, top];
      },
      formatter(params) {
        const row = params.data?.row;
        if (!row) {
          if (params.data?.name) return `<b>${params.data.name}</b>`;
          return "";
        }
        const tags = [
          row.recommended ? T.simViewRec : null,
          row.best_effort ? T.simViewMaxSave : null,
          row.max_util ? T.simViewMaxUtil : null,
        ].filter(Boolean);
        const head = tags.length
          ? `${tags.map((t) => `<b style="color:#5eeaff">${t}</b>`).join("<br>")}<br>`
          : "";
        const unit = simUnitSaveValue(row);
        return `${head}${T.simConfigPcs} <b>${fmt(row.pcs_kw, 0)}</b> kW<br>`
          + `${T.simConfigBatt} <b>${fmt(row.batt_kwh, 0)}</b> kWh<br>`
          + `${T.simHours} <b>${fmt(row.hours, 1)}</b><br>`
          + `${T.simMapAxisSave} <b>${fmt(row.savings)}</b>`
          + (unit == null ? "" : `<br>${T.simUnitSave} <b>${fmt(unit, 1)}</b>`);
      },
    },
    xAxis: {
      type: "value",
      scale: true,
      name: T.simMapAxisSave || T.simChartPeriodSave,
      nameLocation: "middle",
      nameGap: 32,
      nameTextStyle: { color: "#94a3b8", fontWeight: 600 },
      axisLine: { lineStyle: { color: "#334155" } },
      splitLine: { lineStyle: { color: "#1e293b" } },
      axisLabel: { color: "#94a3b8", formatter: (v) => fmt(v, 0) },
    },
    yAxis: {
      type: "value",
      scale: true,
      name: T.simMapAxisBatt || T.simConfigBatt,
      nameLocation: "middle",
      nameGap: 44,
      nameTextStyle: { color: "#94a3b8", fontWeight: 600 },
      axisLine: { lineStyle: { color: "#334155" } },
      splitLine: { lineStyle: { color: "#1e293b" } },
      axisLabel: { color: "#94a3b8", formatter: (v) => fmt(v, 0) },
    },
    series: [{
      name: T.simSavingsChart,
      type: "scatter",
      symbol: "circle",
      data,
      z: 2,
    }],
  });

  simSavingsChart.off("click");
  simSavingsChart.on("click", (params) => {
    let mode = params?.data?.mode || null;
    const row = params?.data?.row;
    if (!mode && row) {
      if (row.recommended) mode = "recommended";
      else if (row.best_effort) mode = "max_savings";
      else if (row.max_util) mode = "max_util";
    }
    if (!mode) return;
    setSimViewMode(mode, res, T);
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
    syncSimViewContext(res);
    simPcsPowerMatrixCache = {};
  }
  const rec = res?.recommended || res?.best_effort;
  const base = simRowChartKey(rec);
  const sizingCharts = simHasFullContext(res, rec) ? null : res?.dispatch_charts;
  if (base && sizingCharts) {
    simDispatchChartCache[`${base}__sizing`] = sizingCharts;
    simDispatchChartCache[base] = sizingCharts;
  }
  for (const s2 of Object.values(simStage2Map(res))) {
    const k = simRowChartKey(s2 && s2.final);
    const charts = s2 && s2.final && s2.final.dispatch_charts;
    if (k && charts) simDispatchChartCache[`${k}__full`] = charts;
  }
  if (base && res?.stage2?.final?.dispatch_charts) {
    simDispatchChartCache[`${base}__full`] = res.stage2.final.dispatch_charts;
  }
  for (const row of (res?.grid || [])) {
    const k = simRowChartKey(row);
    if (k && row.dispatch_charts) {
      simDispatchChartCache[`${k}__sizing`] = row.dispatch_charts;
      simDispatchChartCache[k] = row.dispatch_charts;
    }
  }
  for (const row of [res?.recommended, res?.best_effort, res?.max_util]) {
    const k = simRowChartKey(row);
    if (k && row && row.dispatch_charts) {
      simDispatchChartCache[`${k}__sizing`] = row.dispatch_charts;
      simDispatchChartCache[k] = row.dispatch_charts;
    }
  }
  simSyncViewChartKey(res);
}

function simDispatchChartsForKey(res, key) {
  const row = simViewRow(res);
  syncSimViewContext(res, row);
  const k = key
    || simDispatchChartKey
    || simChartCacheKey(row, simViewContext)
    || simRowChartKey(row);
  if (k && simDispatchChartCache[k]) return simDispatchChartCache[k];
  const base = simRowChartKey(row);
  // Final：優先 Stage2 圖
  const s2 = simActiveStage2(res);
  if (s2 && s2.final && s2.final.dispatch_charts) {
    if (!base || base === simRowChartKey(s2.final)) return s2.final.dispatch_charts;
  }
  if (base && simDispatchChartCache[`${base}__full`]) return simDispatchChartCache[`${base}__full`];
  if (base && simDispatchChartCache[base]) return simDispatchChartCache[base];
  if (simWantsStage2(res) && !simHasFullContext(res, row)) return null;
  if (base && base === simHighlightKey(res)) {
    return res?.dispatch_charts || null;
  }
  if (base && simDispatchChartCache[`${base}__sizing`]) return simDispatchChartCache[`${base}__sizing`];
  return null;
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
  for (const id of ["simDispatchGridTop", "simDispatchGridBottom", "simDispatchGridDay", "simDispatchGrid"]) {
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

function simLookupDispatchCache(row, ctx) {
  const base = simRowChartKey(row);
  if (!base) return null;
  const ctxKey = simChartCacheKey(row, ctx || simViewContext);
  return (ctxKey && simDispatchChartCache[ctxKey])
    || simDispatchChartCache[base]
    || simDispatchChartCache[`${base}__sizing`]
    || simDispatchChartCache[`${base}__full`]
    || null;
}

async function fetchSimDispatchChartRow(row, T) {
  if (!row) return null;
  const key = simRowChartKey(row);
  if (!key) return null;
  const cached = simLookupDispatchCache(row);
  if (cached) {
    simDispatchChartCache[key] = cached;
    const ctxKey = simChartCacheKey(row);
    if (ctxKey) simDispatchChartCache[ctxKey] = cached;
    return key;
  }
  if (simDispatchChartPending[key]) return simDispatchChartPending[key];
  if (!session.importId) throw new Error(T.simErr);
  const resultKey = session.simulateResultKey;
  let request;
  request = (async () => {
    try {
      const live = normalizeSimulateSizeResult(session.lastSimulateSize);
      const adopted = (row && row.stage2_contracts)
        || simAdoptedSchemeContracts(live, row);
      const fd = buildSimulateFormData({
        simulateJson: (live && live._simulatePayload) || simFrozenPayload || undefined,
        pcsKw: row.pcs_kw,
        battKwh: row.batt_kwh,
        schemeContracts: adopted || undefined,
      });
      if (!fd) throw new Error(T.simErr);
      const data = await apiJson("/api/simulate/dispatch-charts", { method: "POST", body: fd });
      if (resultKey !== session.simulateResultKey) return key;
      const charts = data && data.charts;
      const ctx = adopted ? "full" : "sizing";
      if (charts) {
        simDispatchChartCache[key] = charts;
        simDispatchChartCache[`${key}__${ctx}`] = charts;
        if (data.key && data.key !== key) {
          simDispatchChartCache[data.key] = charts;
          simDispatchChartCache[`${data.key}__${ctx}`] = charts;
        }
      }
      if (data) {
        if (data.energy_transfer) row.energy_transfer = data.energy_transfer;
        if (data.tou_meta) row.tou_meta = data.tou_meta;
        if (data.reserve_meta) row.reserve_meta = data.reserve_meta;
        const res = normalizeSimulateSizeResult(session.lastSimulateSize);
        if (res && Array.isArray(res.grid)) {
          const hit = res.grid.find((g) => simRowChartKey(g) === key);
          if (hit) {
            if (data.energy_transfer) hit.energy_transfer = data.energy_transfer;
            if (data.tou_meta) hit.tou_meta = data.tou_meta;
            if (data.reserve_meta) hit.reserve_meta = data.reserve_meta;
            session.lastSimulateSize = res;
          }
        }
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
  const ctxKey = simChartCacheKey(row, simViewContext);
  if ((ctxKey && simDispatchChartCache[ctxKey]) || simDispatchChartsForKey(res)) {
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
    mountSimFollowCards(res, T);
  } catch (err) {
    if (loadId !== simDispatchChartLoadId) return;
    console.warn("sim dispatch lazy", err);
    const key = simRowChartKey(row);
    const stored = normalizeSimulateSizeResult(session.lastSimulateSize);
    const hit = stored && (stored.grid || []).find((g) => simRowChartKey(g) === key);
    if (hit) hit._simChartsFailed = true;
    if (row) row._simChartsFailed = true;
    mountSimFollowCards(stored || res, T);
    const meta = simVisibleMeta();
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
  const pending = simUniqueViewRows(res).filter((row) => !simLookupDispatchCache(row));
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
  const line = (label, value) =>
    `<span class="sim-view-tab__line"><span>${label}</span><b>${value}</b></span>`;
  const unit = simUnitSaveValue(row);
  return [
    line(T.simConfigPcs, `${fmt(row.pcs_kw, 0)} kW`),
    line(T.simConfigBatt, `${fmt(row.batt_kwh, 0)} kWh`),
    line(T.simSavings, fmt(row.savings)),
    unit == null ? "" : line(T.simUnitSave, fmt(unit, 1)),
  ].join("");
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
    const key = simRowChartKey(simViewBaseRow(res, m.id));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return `<div class="sim-view-tabs" role="tablist" aria-label="${T.simViewPanel}">
    ${visible.map((m) => {
      const row = simViewBaseRow(res, m.id);
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

/** 熱力圖 date_meta 為各圖統一篩選來源（季節／日別／月份）。 */
function simDispatchMetaSource(dc) {
  return dc?.heatmap?.net_kw || dc?.heatmap?.load_kw || {};
}

function simDispatchMonthOptions(dc, T) {
  const hm = simDispatchMetaSource(dc);
  const meta = hm.date_meta || {};
  const months = [];
  const seen = new Set();
  for (const d of hm.dates || []) {
    const m = (meta[d] && meta[d].month) || String(d).slice(0, 7);
    if (!m || seen.has(m)) continue;
    seen.add(m);
    months.push(m);
  }
  months.sort();
  const opts = [
    `<option value="all"${simDispatchFilter.month === "all" ? " selected" : ""}>${T.simDispatchMonthAll}</option>`,
    ...months.map((m) =>
      `<option value="${m}"${simDispatchFilter.month === m ? " selected" : ""}>${m}</option>`),
  ];
  return opts.join("");
}

function simDispatchDayPasses(meta, d) {
  const { season, day, month } = simDispatchFilter;
  const m = meta[d] || {};
  const sea = m.season || "";
  const kind = m.day_kind || "";
  const mon = m.month || String(d).slice(0, 7);
  if (season !== "all" && sea !== season) return false;
  if (day !== "all" && kind !== day) return false;
  if (month !== "all" && mon !== month) return false;
  return true;
}

function simDispatchFilteredIndices(dc) {
  const hm = simDispatchMetaSource(dc);
  const dates = hm.dates || [];
  const meta = hm.date_meta || {};
  const idxs = [];
  dates.forEach((d, i) => {
    if (simDispatchDayPasses(meta, d)) idxs.push(i);
  });
  return { dates, meta, idxs };
}

function simDispatchClampDayIdx(n) {
  const max = Math.max(0, n - 1);
  let i = Number(simDispatchFilter.dayIdx) || 0;
  if (i < 0) i = 0;
  if (i > max) i = max;
  simDispatchFilter.dayIdx = i;
  return i;
}

function simDispatchSlotLabels() {
  return Array.from({ length: 96 }, (_, i) => {
    const h = String(Math.floor(i / 4)).padStart(2, "0");
    const m = String((i % 4) * 15).padStart(2, "0");
    return `${h}:${m}`;
  });
}

function simFiveNumber(vals) {
  if (!vals.length) return null;
  const s = vals.slice().sort((a, b) => a - b);
  const q = (p) => {
    const pos = (s.length - 1) * p;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    if (lo === hi) return s[lo];
    return s[lo] + (s[hi] - s[lo]) * (pos - lo);
  };
  const q1 = q(0.25);
  const med = q(0.5);
  const q3 = q(0.75);
  const iqr = q3 - q1;
  const loF = q1 - 1.5 * iqr;
  const hiF = q3 + 1.5 * iqr;
  const inside = s.filter((v) => v >= loF && v <= hiF);
  const wlo = inside.length ? inside[0] : s[0];
  const whi = inside.length ? inside[inside.length - 1] : s[s.length - 1];
  const outliers = s.filter((v) => v < wlo || v > whi);
  return {
    min: s[0],
    q1,
    median: med,
    q3,
    max: s[s.length - 1],
    whisker_low: wlo,
    whisker_high: whi,
    outliers,
  };
}

function simDispatchFiltersHtml(dc, T) {
  const { sOpts, dOpts } = simDispatchSeasonDayOpts(T);
  const metrics = [
    ["load_kw", T.simDispatchLoad],
    ["ess_kw", T.simDispatchEss],
    ["net_kw", T.simDispatchNet],
    ["soc_pct", T.simDispatchSoc],
  ];
  const mOpts = metrics.map(([v, lab]) =>
    `<option value="${v}"${simDispatchFilter.heatmap === v ? " selected" : ""}>${lab}</option>`).join("");
  return `<div class="sim-dispatch-toolbar">
      <label class="ts-field"><span class="ts-field__label">${t("settings.season")}</span>
        <select class="ts-select" id="simDispatchSeason">${sOpts}</select></label>
      <label class="ts-field"><span class="ts-field__label">${t("settings.day")}</span>
        <select class="ts-select" id="simDispatchDay">${dOpts}</select></label>
      <label class="ts-field"><span class="ts-field__label">${T.simDispatchMonth}</span>
        <select class="ts-select" id="simDispatchMonth">${simDispatchMonthOptions(dc, T)}</select></label>
      <label class="ts-field"><span class="ts-field__label">${T.simDispatchMetric}</span>
        <select class="ts-select" id="simDispatchMetric">${mOpts}</select></label>
  </div>`;
}

function simHasViewBlocks(res) {
  return !!(simViewRow(res, "max_savings") || res?.dispatch_charts);
}

function simViewPanelHtml(res, T) {
  if (!simHasViewBlocks(res)) return "";
  const tabs = simViewTabsHtml(res, T);
  if (!tabs) return "";
  return `<div class="sim-view-panel" id="simViewPanel">${tabs}</div>`;
}

function simViewRecCardHtml(res, T) {
  if (simViewDetailWaiting(res, simViewRow(res))) {
    return simBusyCard("simViewRecCard", T.simRecSchedules, T.simViewBusy);
  }
  const body = renderReportRecSchedules(T, res);
  if (!body) return "";
  return `<section class="btm-card hud-panel hud-frame" id="simViewRecCard">
    <h2 class="btm-card__title seetel-title">${T.simRecSchedules}</h2>
    ${body}
  </section>`;
}

function simDispatchCardHtml(res, T) {
  if (!simHasViewBlocks(res)) return "";
  const dc = simDispatchChartsForKey(res) || null;
  if (!dc && simViewDetailWaiting(res, simViewRow(res))) {
    return simBusyCard("simDispatchCard", T.simDispatchCharts, T.simViewBusy);
  }
  return `<section class="btm-card hud-panel hud-frame" id="simDispatchCard">
    <h2 class="btm-card__title seetel-title">${T.simDispatchCharts}</h2>
    <div class="sim-dispatch-load-msg" id="simDispatchLoadMsg" hidden></div>
    ${simDispatchFiltersHtml(dc, T)}
    <div id="simDispatchGridTop" class="sim-dispatch-grid sim-dispatch-grid--top">
      <section class="sim-dispatch-panel">
        <h5 class="sim-dispatch-panel__title">${T.simDispatchHourlySoc}</h5>
        <div id="simHourlySocChart" class="sim-dispatch-chart"></div>
      </section>
      <section class="sim-dispatch-panel">
        <h5 class="sim-dispatch-panel__title">${T.simDispatchHourlyPower}</h5>
        <div id="simHourlyPowerChart" class="sim-dispatch-chart"></div>
      </section>
    </div>
    <div id="simDispatchGridBottom" class="sim-dispatch-grid sim-dispatch-grid--bottom">
      <section class="sim-dispatch-panel">
        <h5 class="sim-dispatch-panel__title">${T.simDispatchHeatmap}</h5>
        <div id="simDispatchHeatmap" class="sim-dispatch-chart sim-dispatch-chart--tall"></div>
      </section>
      <section class="sim-dispatch-panel">
        <h5 class="sim-dispatch-panel__title">${T.simDispatchBoxplot}</h5>
        <div id="simDispatchBoxplot" class="sim-dispatch-chart sim-dispatch-chart--tall"></div>
      </section>
    </div>
    <div id="simDispatchGridDay" class="sim-dispatch-grid sim-dispatch-grid--day">
      <section class="sim-dispatch-panel sim-dispatch-panel--wide">
        <h5 class="sim-dispatch-panel__title">${T.simDispatchDayProfile}</h5>
        <div id="simDayProfileChart" class="sim-dispatch-chart sim-dispatch-chart--tall"></div>
        <div class="sim-dispatch-day-scrub" id="simDayScrub">
          <button type="button" class="btm-btn btm-btn--ghost sim-dispatch-day-scrub__btn" id="simDayPrev" aria-label="prev">‹</button>
          <input type="range" class="sim-dispatch-day-scrub__range" id="simDaySlider" min="0" max="0" value="0" step="1">
          <button type="button" class="btm-btn btm-btn--ghost sim-dispatch-day-scrub__btn" id="simDayNext" aria-label="next">›</button>
          <span class="sim-dispatch-day-scrub__label" id="simDayLabel">—</span>
        </div>
      </section>
    </div>
  </section>`;
}

function mountSimFollowCards(res, T) {
  mountSimCard(
    simViewRecCardHtml(res, T),
    "simViewRecCard",
    ["simDispatchCard"],
  );
  refreshSimReportHead(res, T);
}

function mountSimCard(html, id, beforeIds) {
  const host = document.getElementById(id);
  if (!html) {
    if (host) host.remove();
    return;
  }
  const tmp = document.createElement("div");
  tmp.innerHTML = html.trim();
  const next = tmp.firstElementChild;
  if (!next) return;
  if (host) {
    host.replaceWith(next);
    return;
  }
  const anchor = (beforeIds || []).map((x) => document.getElementById(x)).find(Boolean);
  if (anchor) anchor.insertAdjacentElement("beforebegin", next);
}

async function refreshSimViewPanel(res, T) {
  simSyncViewChartKey(res);
  const row = simViewBillRow(res);
  const panel = document.getElementById("simViewPanel");
  if (panel) {
    const tabsHost = panel.querySelector(".sim-view-tabs");
    const tabsHtml = simViewTabsHtml(res, T);
    if (tabsHost && tabsHtml) {
      const tmp = document.createElement("div");
      tmp.innerHTML = tabsHtml;
      tabsHost.replaceWith(tmp.firstElementChild);
    } else if (tabsHost && !tabsHtml) {
      tabsHost.remove();
    } else if (!tabsHost && tabsHtml) {
      const tmp = document.createElement("div");
      tmp.innerHTML = tabsHtml;
      const node = tmp.firstElementChild;
      const title = panel.querySelector(".sim-view-panel__title");
      if (node && title) title.insertAdjacentElement("afterend", node);
      else if (node) panel.prepend(node);
    }
  }
  document.querySelectorAll(".sim-view-tab").forEach((btn) => {
    btn.onclick = () => setSimViewMode(btn.dataset.mode, res, T);
  });

  renderSimSavingsChart(res, T);
  mountSimFollowCards(res, T);

  const controls = [
    ...document.querySelectorAll(".sim-view-tab"),
  ];
  controls.forEach((b) => { b.disabled = true; });
  try {
    await ensureSimDispatchCharts(res, T);
  } finally {
    controls.forEach((b) => { b.disabled = false; });
  }
  // 圖表就緒後重掛排程（含實際功率矩陣）
  mountSimFollowCards(res, T);
}

async function setSimViewMode(mode, res, T) {
  if (!mode || simViewMode === mode) return;
  simViewMode = mode;
  let live = normalizeSimulateSizeResult(session.lastSimulateSize) || res;
  syncSimViewContext(live);
  refreshSimReportHead(live, T);
  const panelP = refreshSimViewPanel(live, T);
  live = await ensureStage2ForView(live, T);
  syncSimViewContext(live);
  await panelP;
  await refreshSimViewPanel(live, T);
  refreshSimReportHead(live, T);
}

/** 若目前檢視點需要第二層且尚未快取，則請求 /full。 */
async function ensureStage2ForView(res, T) {
  if (!res || !simWantsStage2(res) || !res.stage1_key) return res;
  const base = simViewBaseRow(res);
  if (!base || simStage2At(res, base)) return res;
  try {
    return await fetchSimulateFullForRow(res, base, T);
  } catch (err) {
    console.warn("sim stage2 for view", err);
    session._simFullError = String(err.message || err);
    if (parseRoute() === ROUTES.SIMULATE) {
      refreshSimReportHead(normalizeSimulateSizeResult(session.lastSimulateSize) || res, T);
    }
    return normalizeSimulateSizeResult(session.lastSimulateSize) || res;
  }
}

async function fetchSimulateFullForRow(stageRes, row, T, opts) {
  const quiet = !!(opts && opts.quiet);
  if (!session.importId || !stageRes || !stageRes.stage1_key || !row) {
    return stageRes;
  }
  const run = async () => {
    let live = normalizeSimulateSizeResult(session.lastSimulateSize) || stageRes;
    if (simStage2At(live, row)) return live;
    const payload = simFrozenPayload
      || live._simulatePayload
      || stageRes._simulatePayload
      || simulateApiJson();
    const fd = buildSimulateFormData({
      simulateJson: payload,
      stage1Key: live.stage1_key || stageRes.stage1_key,
      pcsKw: row.pcs_kw,
      battKwh: row.batt_kwh,
    });
    if (!fd) return live;

    simulateFullFetch = apiJson("/api/simulate/full", { method: "POST", body: fd });
    if (!quiet && parseRoute() === ROUTES.SIMULATE && T) {
      refreshSimReportHead(live, T);
    }
    try {
      const full = await simulateFullFetch;
      session._simFullError = null;
      const merged = simMergeFullResult(live, full);
      if (payload) merged._simulatePayload = payload;
      session.lastSimulateSize = merged;
      persistSession();
      seedSimDispatchCache(merged);
      return merged;
    } finally {
      simulateFullFetch = null;
    }
  };
  const next = simulateFullChain.then(run, run);
  simulateFullChain = next.then(() => {}, () => {});
  return next;
}

/** 推薦點 /full 後，背景串行預取另外配置的 Stage2。 */
async function prefetchStage2Siblings(res, T, jobId) {
  if (!res || !simWantsStage2(res) || !res.stage1_key) return;
  const token = ++simulateFullPrefetchToken;
  const activeKey = simRowChartKey(simViewBaseRow(res));
  const pending = simUniqueViewRows(res)
    .filter((row) => !simStage2At(res, row))
    .sort((a, b) => {
      const aActive = simRowChartKey(a) === activeKey ? 1 : 0;
      const bActive = simRowChartKey(b) === activeKey ? 1 : 0;
      return aActive - bActive;
    });
  for (const row of pending) {
    if (token !== simulateFullPrefetchToken || jobId !== simulateJob) return;
    let live = normalizeSimulateSizeResult(session.lastSimulateSize) || res;
    if (simStage2At(live, row)) continue;
    try {
      live = await fetchSimulateFullForRow(live, row, T, { quiet: true });
    } catch (err) {
      console.warn("sim stage2 prefetch", err);
      return;
    }
    if (token !== simulateFullPrefetchToken || jobId !== simulateJob) return;
    if (
      parseRoute() === ROUTES.SIMULATE
      && simRowChartKey(simViewBaseRow(live)) === simRowChartKey(row)
    ) {
      const lang = T || I18N[locale].simulate;
      refreshSimReportHead(live, lang);
      refreshSimViewPanel(live, lang);
    }
  }
}

async function retrySimulateFullStep() {
  if (simulateFetch || simulateFullFetch || simulateExportFetch) return;
  const cur = normalizeSimulateSizeResult(session.lastSimulateSize);
  if (!(cur && cur.stage1_key && simWantsStage2(cur))) return;
  const T = I18N[locale].simulate;
  const row = simViewBaseRow(cur) || cur.recommended || cur.best_effort;
  if (!row) return;
  session._simFullError = null;
  try {
    await fetchSimulateFullForRow(cur, row, T);
  } catch (err) {
    session._simFullError = String(err.message || err);
    persistSession();
  }
  if (parseRoute() === ROUTES.SIMULATE) {
    renderPage({ animate: false, preserveScroll: true });
  }
}

function refreshSimReportHead(res, T) {
  const lang = T || I18N[locale].simulate;
  const host = document.getElementById("simReportHead");
  if (host && res) {
    const html = simReportHeadHtml(lang, res);
    if (html) {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      if (tmp.firstElementChild) {
        host.replaceWith(tmp.firstElementChild);
        document.getElementById("btnSimulateFullRetry")?.addEventListener("click", () => {
          retrySimulateFullStep();
        });
      }
    }
  }
  // 配置卡在報告外；切換檢視時一併刷新。
  // Stage2 pending 會暫時拿掉卡片，完成後必須能再插回（不能只 replace 既有節點）。
  if (res) {
    const kpiHtml = simReportSizeKpisBlock(lang, res);
    const kpiHost = document.getElementById("simReportSizeKpis");
    if (!kpiHtml) {
      if (kpiHost) kpiHost.remove();
    } else {
      const tmp = document.createElement("div");
      tmp.innerHTML = kpiHtml;
      const next = tmp.firstElementChild;
      if (!next) {
        /* no-op */
      } else if (kpiHost) {
        kpiHost.replaceWith(next);
      } else {
        const report = document.getElementById("simReportHead");
        const map = document.getElementById("simMapCard");
        if (report) report.insertAdjacentElement("beforebegin", next);
        else if (map) map.insertAdjacentElement("afterend", next);
      }
    }
  }
}

function simDispatchHourlyFromHeatmap(dc, metric, seasonKey) {
  const hm = dc?.heatmap?.[metric] || {};
  const values = hm.values || [];
  const meta = hm.date_meta || {};
  const dates = hm.dates || [];
  const { idxs } = simDispatchFilteredIndices(dc);
  const buckets = Array.from({ length: 24 }, () => []);
  for (const i of idxs) {
    const d = dates[i];
    const m = meta[d] || {};
    if (seasonKey !== "all" && (m.season || "") !== seasonKey) continue;
    const row = values[i] || [];
    for (let slot = 0; slot < row.length; slot++) {
      const v = row[slot];
      if (v == null || !Number.isFinite(Number(v))) continue;
      buckets[Math.floor(slot / 4)].push(Number(v));
    }
  }
  return buckets.map((arr) => {
    if (!arr.length) return null;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  });
}

function simMetricHeatmapOption(dc, metric, unit) {
  const hm = dc?.heatmap?.[metric] || {};
  const { dates, idxs } = simDispatchFilteredIndices(dc);
  const keepDates = idxs.map((i) => dates[i]);
  const keepValues = idxs.map((i) => (hm.values || [])[i] || []);
  const filtered = { dates: keepDates, values: keepValues };
  const base = heatmapOption({ heatmap: filtered });
  if (base.tooltip) {
    base.tooltip.formatter = (p) => {
      if (!p || !p.value) return "";
      const slots = simDispatchSlotLabels();
      const [x, y, v] = p.value;
      return `${keepDates[y] || ""} ${slots[x] || ""}<br/>${fmt(v, 1)} ${unit}`;
    };
  }
  return base;
}

function simMetricBoxplotOption(dc, metric, unit) {
  const hm = dc?.heatmap?.[metric] || {};
  const values = hm.values || [];
  const { idxs } = simDispatchFilteredIndices(dc);
  const buckets = Array.from({ length: 24 }, () => []);
  for (const i of idxs) {
    const row = values[i] || [];
    for (let slot = 0; slot < row.length; slot++) {
      const v = row[slot];
      if (v == null || !Number.isFinite(Number(v))) continue;
      buckets[Math.floor(slot / 4)].push(Number(v));
    }
  }
  const labels = [];
  const boxes = [];
  const outliers = [];
  buckets.forEach((arr, h) => {
    const s = simFiveNumber(arr);
    if (!s) return;
    const hh = String(h).padStart(2, "0") + ":00";
    labels.push(hh);
    boxes.push({
      value: [s.whisker_low, s.q1, s.median, s.q3, s.whisker_high],
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
        if (!p) return "";
        if (p.seriesType === "boxplot" && p.value) {
          const v = p.value;
          return `${p.name}<br/>min ${fmt(v[1], 1)} · Q1 ${fmt(v[2], 1)} · med ${fmt(v[3], 1)} · Q3 ${fmt(v[4], 1)} · max ${fmt(v[5], 1)} ${unit}`;
        }
        if (p.seriesType === "scatter") return `${fmt(p.value[1], 1)} ${unit}`;
        return "";
      },
    },
    grid: { left: 52, right: 16, top: 16, bottom: 40 },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: CHART_AXIS, fontSize: 10, interval: 1 },
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
      {
        type: "scatter",
        data: outliers,
        symbolSize: 6,
        itemStyle: { color: "#f87171" },
      },
    ],
  };
}

function simHourlySocOption(dc, T) {
  const labels = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + ":00");
  const { season } = simDispatchFilter;
  const series = [];
  const addLine = (s, color, name) => {
    series.push({
      name,
      type: "line",
      smooth: true,
      showSymbol: false,
      data: simDispatchHourlyFromHeatmap(dc, "soc_pct", s),
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
  const labels = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + ":00");
  const sea = simDispatchFilter.season === "all" ? "all" : simDispatchFilter.season;
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
    data: simDispatchHourlyFromHeatmap(dc, metric, sea),
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

function simDayProfileOption(dc, T) {
  const { dates, idxs } = simDispatchFilteredIndices(dc);
  const n = idxs.length;
  const di = simDispatchClampDayIdx(n);
  const srcIdx = n ? idxs[di] : -1;
  const day = srcIdx >= 0 ? dates[srcIdx] : "";
  const slots = simDispatchSlotLabels();
  const rowOf = (metric) => {
    const row = srcIdx >= 0 ? ((dc?.heatmap?.[metric]?.values || [])[srcIdx] || []) : [];
    return row.map((v) => (v == null ? null : Number(v)));
  };
  return {
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    textStyle: { color: CHART_AXIS },
    legend: { textStyle: { color: CHART_AXIS }, top: 0 },
    tooltip: { trigger: "axis", confine: true },
    grid: { left: 52, right: 48, top: 36, bottom: 40 },
    xAxis: {
      type: "category",
      data: slots,
      axisLabel: { color: CHART_AXIS, fontSize: 10, interval: 7 },
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
        name: T.simDispatchSoc,
        type: "bar",
        yAxisIndex: 1,
        data: rowOf("soc_pct"),
        barMaxWidth: 6,
        itemStyle: { color: "rgba(192, 132, 252, 0.45)" },
        z: 1,
      },
      {
        name: T.simDispatchLoad,
        type: "line",
        yAxisIndex: 0,
        showSymbol: false,
        data: rowOf("load_kw"),
        lineStyle: { width: 2, color: "#5eeaff" },
        itemStyle: { color: "#5eeaff" },
        z: 3,
      },
      {
        name: T.simDispatchEss,
        type: "line",
        yAxisIndex: 0,
        showSymbol: false,
        data: rowOf("ess_kw"),
        lineStyle: { width: 2, color: "#fbbf24" },
        itemStyle: { color: "#fbbf24" },
        z: 3,
      },
      {
        name: T.simDispatchNet,
        type: "line",
        yAxisIndex: 0,
        showSymbol: false,
        data: rowOf("net_kw"),
        lineStyle: { width: 2, color: "#34d399" },
        itemStyle: { color: "#34d399" },
        z: 3,
      },
    ],
    _dayLabel: day ? `${day} (${di + 1}/${n})` : "—",
    _dayCount: n,
  };
}

function simDispatchMetricUnit(metric) {
  return metric === "soc_pct" ? "%" : "kW";
}

function syncSimDayScrubber(opt) {
  const slider = document.getElementById("simDaySlider");
  const label = document.getElementById("simDayLabel");
  const prev = document.getElementById("simDayPrev");
  const next = document.getElementById("simDayNext");
  const n = opt && opt._dayCount != null ? opt._dayCount : 0;
  const max = Math.max(0, n - 1);
  const idx = simDispatchClampDayIdx(n);
  if (slider) {
    slider.min = "0";
    slider.max = String(max);
    slider.value = String(idx);
    slider.disabled = n <= 1;
  }
  if (label) label.textContent = (opt && opt._dayLabel) || "—";
  if (prev) prev.disabled = idx <= 0 || n <= 0;
  if (next) next.disabled = idx >= max || n <= 0;
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

    const dayOpt = simDayProfileOption(dc, T);
    const panels = [
      ["simHourlySocChart", () => simHourlySocOption(dc, T)],
      ["simHourlyPowerChart", () => simHourlyPowerOption(dc, T)],
      ["simDispatchHeatmap", () => simMetricHeatmapOption(dc, simDispatchFilter.heatmap, simDispatchMetricUnit(simDispatchFilter.heatmap))],
      ["simDispatchBoxplot", () => simMetricBoxplotOption(dc, simDispatchFilter.heatmap, simDispatchMetricUnit(simDispatchFilter.heatmap))],
      ["simDayProfileChart", () => dayOpt],
    ];
    for (const [id, optFn] of panels) {
      const el = document.getElementById(id);
      if (!el) continue;
      const chart = echarts.init(el);
      chart.setOption(optFn());
      simDispatchCharts.push(chart);
    }
    syncSimDayScrubber(dayOpt);

    const monthEl = document.getElementById("simDispatchMonth");
    if (monthEl) {
      const cur = simDispatchFilter.month;
      monthEl.innerHTML = simDispatchMonthOptions(dc, T);
      if ([...monthEl.options].some((o) => o.value === cur)) monthEl.value = cur;
      else {
        simDispatchFilter.month = "all";
        monthEl.value = "all";
      }
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
  const monthEl = document.getElementById("simDispatchMonth");
  const metricEl = document.getElementById("simDispatchMetric");
  const slider = document.getElementById("simDaySlider");
  const prev = document.getElementById("simDayPrev");
  const next = document.getElementById("simDayNext");
  const rerender = () => renderSimDispatchCharts(res, T);
  const resetDay = () => { simDispatchFilter.dayIdx = 0; };
  document.querySelectorAll(".sim-view-tab").forEach((btn) => {
    btn.onclick = () => setSimViewMode(btn.dataset.mode, res, T);
  });
  if (seasonEl) {
    seasonEl.onchange = () => {
      simDispatchFilter.season = seasonEl.value;
      resetDay();
      rerender();
    };
  }
  if (dayEl) {
    dayEl.onchange = () => {
      simDispatchFilter.day = dayEl.value;
      resetDay();
      rerender();
    };
  }
  if (monthEl) {
    monthEl.onchange = () => {
      simDispatchFilter.month = monthEl.value;
      resetDay();
      rerender();
    };
  }
  if (metricEl) {
    metricEl.onchange = () => {
      simDispatchFilter.heatmap = metricEl.value;
      rerender();
    };
  }
  if (slider) {
    slider.oninput = () => {
      simDispatchFilter.dayIdx = Number(slider.value) || 0;
      rerender();
    };
  }
  if (prev) {
    prev.onclick = () => {
      simDispatchFilter.dayIdx = Math.max(0, (Number(simDispatchFilter.dayIdx) || 0) - 1);
      rerender();
    };
  }
  if (next) {
    next.onclick = () => {
      simDispatchFilter.dayIdx = (Number(simDispatchFilter.dayIdx) || 0) + 1;
      rerender();
    };
  }
}

function simulateRunKey() {
  try {
    return [
      session.importId || "",
      session.tou || "",
      session.voltage || "",
      JSON.stringify(session.contractValues || {}),
      simulateApiJson(session.simulate),
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
  simulateSampleJob += 1;
  simulateFullPrefetchToken += 1;
  simulateFetch = null;
  simulateFullFetch = null;
  simulateSampleFetch = null;
  simFrozenPayload = null;
  simDispatchChartKey = null;
  simViewMode = "recommended";
  simViewContext = "sizing";
  simDispatchChartCache = {};
  simDispatchChartPending = {};
  simDispatchCacheResultKey = null;
  simDispatchChartLoadId += 1;
  Object.assign(simDispatchFilter, {
    season: "all",
    day: "all",
    month: "all",
    heatmap: "net_kw",
    dayIdx: 0,
  });
  session.lastSimulateSize = null;
  session.lastSimulateSample = null;
  session.simulateError = null;
  session.simulateResultKey = null;
  session._scrollSimReport = false;
  clearSimAuxCaches();
  persistSession();
}

/** 條件變更後樣本作廢；進配置再抓。半尖峰不在這支裡。 */
let simSampleStamp = "";

function simConditionStamp() {
  const sim = session.simulate || {};
  return JSON.stringify({
    tou: activeSimulateTou(),
    contracts: buildScenarioContracts(),
    bufferPct: sim.bufferPct,
    demandBufferKw: sim.demandBufferKw,
    antiExportKw: sim.antiExportKw,
    chargeEff: sim.chargeEff,
    socMin: sim.socMin,
    socMax: sim.socMax,
    auto: !!sim.evaluateContractReduction || !!(sim.functions || []).includes("demand"),
    strategies: sim.sizingStrategies,
    energy: sim.sizingEnergySeeds,
    mode: sim.sizingMode,
  });
}

function markSimSampleStale() {
  simSampleStamp = "";
}

function simWizardStep() {
  const sim = session.simulate;
  let step = sim && sim.wizardStep;
  if (step === 2) step = "config";
  else if (step === 3) step = "result";
  else if (!["params", "fns", "config", "result"].includes(step)) step = "fns";
  const running = !!(simulateFetch || simulateFullFetch);
  const hasResult = !!normalizeSimulateSizeResult(session.lastSimulateSize);
  if (hasResult) step = "result";
  else if (!session.importId && step !== "fns") step = "fns";
  else if (step === "result" && !running) step = "params";
  if (sim) sim.wizardStep = step;
  return step;
}

function simResultLocksSteps() {
  return !!normalizeSimulateSizeResult(session.lastSimulateSize)
    || !!simulateFetch
    || !!simulateFullFetch;
}

function renderSimStepBar(T, step) {
  const hasImport = !!session.importId;
  const locked = simResultLocksSteps();
  const items = [
    { id: "fns", label: T.simStepFns, on: !locked },
    { id: "config", label: T.simStepConfig, on: hasImport && !locked },
    { id: "params", label: T.simStepParams, on: hasImport && !locked },
    { id: "result", label: T.simStepResult, on: locked },
  ];
  return pageStepBar(items, step, "data-sim-step");
}

function renderSimFnsNav(T) {
  if (!session.importId) return "";
  return `<div class="sim-step-nav">
    <button type="button" class="btm-btn btm-btn--primary" id="btnSimNextFns">${T.simNext}</button>
  </div>`;
}

function renderSimConfigNav(T) {
  return `<div class="sim-step-nav">
    <button type="button" class="btm-btn btm-btn--ghost" id="btnSimBack">${T.simBack}</button>
    <button type="button" class="btm-btn btm-btn--primary" id="btnSimNextConfig">${T.simNext}</button>
  </div>`;
}

function simRunLocked() {
  // 指定容量不走交叉取樣，取樣中仍可開始試算
  const sampling = session.simulate?.sizingMode !== "single" && simulateSampleFetch;
  return !!(simulateFetch || sampling || simulateFullFetch);
}

function renderSimParamsNav(T) {
  const busy = simRunLocked();
  const hasResult = !!normalizeSimulateSizeResult(session.lastSimulateSize);
  const runBtn = hasResult
    ? ""
    : `<button type="button" class="btm-btn btm-btn--primary" id="btnSimulate"${busy ? " disabled" : ""}>${T.run}</button>`;
  const err = session.simulateError
    ? `<p class="btm-meta btm-meta--err" data-sim-meta>${T.simErr}: ${session.simulateError}</p>`
    : `<p class="btm-meta btm-meta--hidden" data-sim-meta hidden></p>`;
  return `<div class="sim-step-nav">
    <button type="button" class="btm-btn btm-btn--ghost" id="btnSimBackParams">${T.simBack}</button>
    ${runBtn}
  </div>${err}`;
}

function simVisibleMeta() {
  return document.querySelector(".sim-step:not(.sim-step--off) [data-sim-meta]")
    || document.querySelector("[data-sim-meta]");
}

function refreshSimConfigStep() {
  const host = document.getElementById("simStepConfig");
  if (!host || parseRoute() !== ROUTES.SIMULATE) return false;
  const T = I18N[locale].simulate;
  host.innerHTML = renderSimStrategySection(T, session.simulate);
  bindSimStrategyControls();
  const run = document.getElementById("btnSimulate");
  if (run) run.disabled = simRunLocked();
  return true;
}

function paintSimSample() {
  if (parseRoute() !== ROUTES.SIMULATE) return;
  const step = session.simulate && session.simulate.wizardStep;
  if (step === "config" && refreshSimConfigStep() && !simulateFetch && !simulateFullFetch) return;
  renderPage({ animate: false, preserveScroll: true });
}

function renderSimRunBar(T) {
  const sizing = !!simulateFetch;
  const fulling = !!simulateFullFetch;
  const sampling = !!simulateSampleFetch;
  const exporting = !!simulateExportFetch;
  const running = sizing || sampling || fulling;
  const busy = running || exporting;
  const res = normalizeSimulateSizeResult(session.lastSimulateSize);
  const hasResult = !!res;
  const viewRow = hasResult ? simViewRow(res) : null;
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
  const exportLabel = exporting ? T.simExporting : T.simExportXlsx;
  const exportBtn = hasResult && viewRow
    ? `<button type="button" class="btm-btn btm-btn--ghost" id="btnSimulateExport"${busy ? " disabled" : ""}>${exportLabel}</button>`
    : "";
  const clearBtn = hasResult || running
    ? `<button type="button" class="btm-btn btm-btn--ghost" id="btnSimulateClear"${busy ? " disabled" : ""}>${T.simClearResult}</button>`
    : "";
  const metaHtml = metaMsg
    ? `<p class="btm-meta${metaErr ? " btm-meta--err" : ""}" data-sim-meta>${metaMsg}</p>`
    : `<p class="btm-meta btm-meta--hidden" data-sim-meta hidden></p>`;

  return `<div class="sim-run-bar">
    <div class="sim-run-bar__actions">
      ${exportBtn}
      ${clearBtn}
    </div>
    ${metaHtml}
  </div>`;
}

function renderSimReportSection(T) {
  const sizing = !!simulateFetch;
  const fulling = !!simulateFullFetch;
  const sampling = !!simulateSampleFetch;
  const res = normalizeSimulateSizeResult(session.lastSimulateSize);
  // 尚無報告時，樣本階段先不佔位；已有報告則保留（勾選／半尖峰預覽取樣不拆報告）
  if (sampling && !sizing && !fulling && !res) return "";
  if (!sizing && !fulling && !res) return "";

  if (sizing && !res) {
    return `<section class="btm-card hud-panel hud-frame sim-report sim-report--busy">
      <h2 class="btm-card__title seetel-title">${T.simReport}</h2>
      ${busyBlockHtml(T.simSizingRunning)}
    </section>`;
  }

  return `${renderSimulateResult(T, res)}`;
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
  };
}

/** 半尖峰開／關兩組已在樣本算齊；切換只換顯示，不重打 API。 */
function profileStatsForHalfPeak(stats, includeHalf) {
  if (!stats || typeof stats !== "object") return null;
  const dual = stats.by_half_peak;
  if (dual && typeof dual === "object") {
    const branch = dual[includeHalf ? "true" : "false"];
    if (branch && typeof branch === "object") {
      return {
        ...stats,
        include_half_peak: !!includeHalf,
        pcs_sample: branch.pcs_sample || stats.pcs_sample,
        peak_ess_util: branch.peak_ess_util || stats.peak_ess_util,
        peak_coverage: branch.peak_coverage || stats.peak_coverage,
        max_sources: branch.max_sources || stats.max_sources,
        energy_shift: branch.energy_shift || stats.energy_shift,
      };
    }
  }
  return stats;
}

function simSampleKw(v) {
  return v != null && v !== "" ? `${fmt(v, 1)} <small>kW</small>` : "—";
}

function simSamplePct(v) {
  return v != null && v !== "" ? `${fmt(v, 1)}%` : "—";
}

/** 單一策略的樣本數字（PCS＋兩項使用率）。 */
function simStrategySampleRows(id, stats) {
  if (!stats || !stats.ok) return null;
  const pcs = stats.pcs_sample || {};
  if (!(Number(pcs[id]) > 0)) return null;
  const util = stats.peak_ess_util || {};
  const cov = stats.peak_coverage || {};
  return {
    pcsKw: pcs[id],
    util: util[id],
    cov: cov[id],
  };
}

function bufferEngaged(sim) {
  const s = sim || {};
  return Number(s.demandBufferKw) > 0 || Number(s.antiExportKw) > 0 || Number(s.bufferPct) > 0;
}

function includeHalfPeakOn(sim) {
  if (activeSimulateTou() !== "ThreeStage") return false;
  return !!sim.includeHalfPeak;
}

function simConfigSpecsPcsHtml(T, pcs) {
  const pcsN = Number(pcs) || 0;
  return `<div class="sim-config-specs sim-config-specs--solo">
    <div class="sim-config-specs__item">
      <span class="sim-config-specs__lab">${T.simConfigPcs}</span>
      <strong class="sim-config-specs__val">${pcsN > 0 ? simSampleKw(pcsN) : "—"}</strong>
    </div>
  </div>`;
}

function simConfigSpecsBattHtml(T, batt) {
  const battN = Number(batt) || 0;
  return `<div class="sim-config-specs sim-config-specs--solo">
    <div class="sim-config-specs__item">
      <span class="sim-config-specs__lab">${T.simConfigBatt}</span>
      <strong class="sim-config-specs__val">${battN > 0 ? `${fmt(battN, 0)} <small>kWh</small>` : "—"}</strong>
    </div>
  </div>`;
}

function simConfigCardHtml({
  nameAttr,
  id,
  title,
  on,
  disabled,
  locked,
  badge,
  specsHtml,
  metricsHtml,
  special,
}) {
  const cls = [
    "sim-strategy-card",
    special ? "sim-strategy-card--special" : "",
    on ? (special ? "sim-strategy-card--special-on" : "sim-strategy-card--on") : "",
    disabled ? "sim-strategy-card--off" : "",
  ].filter(Boolean).join(" ");
  const input = `<span class="sim-tab-check">
      <input type="checkbox" name="${nameAttr}" value="${id}"${on ? " checked" : ""}${disabled || locked ? " disabled" : ""}>
      <span class="sim-tab-check__box"></span>
    </span>`;
  return `<label class="${cls}">
    ${input}
    <span class="sim-strategy-card__body">
      <span class="sim-strategy-card__title"><span class="sim-strategy-card__name">${title}</span>${badge || ""}</span>
      ${specsHtml || ""}
      ${metricsHtml || ""}
    </span>
  </label>`;
}

function renderSimStrategySection(T, sim) {
  const diag = sizingDiagnosis;
  const selected = new Set(normalizeSizingStrategies(sim.sizingStrategies));
  const energySelected = new Set(normalizeEnergySeeds(sim.sizingEnergySeeds));
  const availMap = {};
  for (const a of (diag && diag.available_strategies) || []) {
    availMap[a.id] = a;
  }
  const sampling = !!simulateSampleFetch;
  const sizing = !!simulateFetch;
  const busy = sampling;
  const single = sim.sizingMode === "single";
  const locked = single ? sizing : (busy || sizing);
  const showHalfToggle = !single && activeSimulateTou() === "ThreeStage";
  const halfOn = includeHalfPeakOn(sim);
  const modeSwitch = `<div class="sim-schedule__switch" role="group" aria-label="${T.simSizingMode}">
          <label class="sim-seg${!single ? " sim-seg--on" : ""}">
            <input type="radio" name="sizingMode" value="grid"${!single ? " checked" : ""}${sizing ? " disabled" : ""}> ${T.simSizingModeGrid}
          </label>
          <label class="sim-seg${single ? " sim-seg--on" : ""}">
            <input type="radio" name="sizingMode" value="single"${single ? " checked" : ""}${sizing ? " disabled" : ""}> ${T.simSizingModeSingle}
          </label>
        </div>`;
  const halfSwitch = showHalfToggle
    ? `<div class="sim-schedule__switch" role="group" aria-label="${T.simIncludeHalfPeak}">
          <label class="sim-seg${halfOn ? " sim-seg--on" : ""}">
            <input type="radio" name="includeHalfPeak" value="1"${halfOn ? " checked" : ""}${locked ? " disabled" : ""}> ${T.simIncludeHalfPeak}
          </label>
          <label class="sim-seg${!halfOn ? " sim-seg--on" : ""}">
            <input type="radio" name="includeHalfPeak" value="0"${!halfOn ? " checked" : ""}${locked ? " disabled" : ""}> ${T.simIncludeHalfOff}
          </label>
        </div>`
    : "";
  const split = halfSwitch ? `<span class="btm-split" aria-hidden="true"></span>` : "";
  const strategyHead = `<div class="sim-strategy__head">
      <div class="sim-strategy__switches">${halfSwitch}${split}${modeSwitch}</div>
    </div>`;
  if (single) {
    const pcsShown = Number(sim.manualPcsKw) > 0 ? sim.manualPcsKw : "";
    const battShown = Number(sim.manualBattKwh) > 0 ? sim.manualBattKwh : "";
    const manual = `<div class="btm-row">
        ${simNumField("manualPcsKw", T.simManualPcs, pcsShown, 1, 0)}
        ${simNumField("manualBattKwh", T.simManualBatt, battShown, 1, 0)}
      </div>`;
    return `<section class="btm-card hud-panel hud-frame sim-strategy${sizing ? " sim-strategy--busy" : ""}">
      ${strategyHead}
      ${manual}
    </section>`;
  }
  const sample = sampling ? null : activeSimulateSample();
  const stats = profileStatsForHalfPeak(sample && sample.profile_stats, halfOn);
  const energy = ((stats && stats.energy_shift) || {}).seeds || {};
  const energyMeta = {
    min: T.simEnergyMin,
    p50: T.simEnergyP50,
    p90: T.simEnergyP90,
    max: T.simEnergyMax,
  };
  const meta = {
    p50: { title: T.simStrategyP50 },
    p90: { title: T.simStrategyP90 },
    max: { title: T.simStrategyMax },
    two_cycle: { title: T.simTwoCycle },
  };
  const cards = SIZING_TIER_IDS.map((id) => {
    const info = meta[id];
    const avail = availMap[id];
    const sampleInfo = !sampling ? simStrategySampleRows(id, stats) : null;
    const branchPcs = sampleInfo ? Number(sampleInfo.pcsKw) : 0;
    const disabled = !!(diag && diag.ok && avail && avail.ok === false)
      || (!!stats && stats.ok && !(branchPcs > 0));
    const on = selected.has(id) && !disabled;
    const special = id === "max" || id === "two_cycle";
    const badge = disabled
      ? `<span class="btm-chip btm-chip--warn">${T.simStrategyUnavailable}</span>`
      : (special ? `<span class="btm-chip btm-chip--special">${T.simSpecialRule || "特殊"}</span>` : "");
    const metrics = (!disabled && sampleInfo)
      ? `<div class="sim-strategy-card__metrics">
            <div class="sim-strategy-card__metric">
              <span>${T.simPeakEssUtil}</span>
              <strong>${simSamplePct(sampleInfo.util)}</strong>
            </div>
            <div class="sim-strategy-card__metric">
              <span>${T.simPeakCoverage}</span>
              <strong>${simSamplePct(sampleInfo.cov)}</strong>
            </div>
          </div>`
      : "";
    return simConfigCardHtml({
      nameAttr: "sizingStrategies",
      id,
      title: info.title,
      on,
      disabled,
      locked,
      badge,
      special,
      specsHtml: (!disabled && sampleInfo) ? simConfigSpecsPcsHtml(T, branchPcs) : "",
      metricsHtml: metrics,
    });
  }).join("");

  const shortlist = (!sampling && sample && Array.isArray(sample.combinations))
    ? sample.combinations
    : [];
  const busyMsg = sampling
    ? (T.simStrategyRefreshing || T.simSampleRunning)
    : "";

  const energyCards = ENERGY_SEED_IDS.map((id) => {
    const seed = energy[id] || {};
    const batt = Number(seed.batt_kwh) || 0;
    const viable = batt > 0;
    const disabled = !sampling && !viable;
    const on = energySelected.has(id) && !disabled;
    const badge = disabled
      ? `<span class="btm-chip btm-chip--warn">${T.simStrategyUnavailable}</span>`
      : "";
    return simConfigCardHtml({
      nameAttr: "sizingEnergySeeds",
      id,
      title: energyMeta[id],
      on,
      disabled,
      locked,
      badge,
      special: false,
      specsHtml: !disabled ? simConfigSpecsBattHtml(T, batt) : "",
      metricsHtml: "",
    });
  }).join("");

  const previewRows = shortlist.length
    ? shortlist.map((c, i) => {
      const pcsName = (meta[c.pcs_seed] && meta[c.pcs_seed].title) || c.pcs_seed || T.simSeedSrcPower;
      const battName = energyMeta[c.energy_level] || c.energy_level || T.simSeedSrcEnergy;
      const label = c.seed_source === "cross"
        ? `${pcsName} × ${battName}`
        : (c.seed_source === "energy" ? (energyMeta[c.seed_id] || c.seed_id) : (c.seed_id || ""));
      return `<li class="sim-shortlist__item">
        <span class="sim-shortlist__idx">${i + 1}</span>
        <span class="sim-shortlist__src btm-chip btm-chip--dim">${c.seed_source === "cross" ? (T.simSeedSrcCross || "×") : T.simSeedSrcEnergy}</span>
        <span class="sim-shortlist__name">${label}</span>
        <span class="sim-shortlist__nums">${simSampleKw(c.pcs_kw)} · ${fmt(c.batt_kwh, 0)} kWh</span>
      </li>`;
    }).join("")
    : "";

  const pcsNums = shortlist.map((c) => Number(c.pcs_kw)).filter((n) => n > 0);
  const battNums = shortlist.map((c) => Number(c.batt_kwh)).filter((n) => n > 0);
  const summaryLine = (shortlist.length && pcsNums.length && battNums.length)
    ? (T.simShortlistSummary || "{pts}")
      .replace("{pts}", String(shortlist.length))
      .replace("{pcsMin}", fmt(Math.min(...pcsNums), 0))
      .replace("{pcsMax}", fmt(Math.max(...pcsNums), 0))
      .replace("{battMin}", fmt(Math.min(...battNums), 0))
      .replace("{battMax}", fmt(Math.max(...battNums), 0))
    : "";
  const hasResult = !!normalizeSimulateSizeResult(session.lastSimulateSize);
  const shortlistBlock = shortlist.length
    ? `<details class="sim-shortlist__fold">
        <summary>${summaryLine}</summary>
        <ol class="sim-shortlist__list">${previewRows}</ol>
      </details>`
    : "";

  const collapsedSummary = hasResult && !sampling
    ? `<summary class="sim-strategy__summary">
        <span>${T.simSampleMetaDone.replace("{pts}", String((session.lastSimulateSize && session.lastSimulateSize.grid_points) || shortlist.length || (session.lastSimulateSize && (session.lastSimulateSize.grid || []).length) || 0))}</span>
        <span class="btm-meta">${T.simStrategyChange || T.simGridFoldOpen}</span>
      </summary>`
    : "";

  if (hasResult && !sampling) {
    return `<section class="btm-card hud-panel hud-frame sim-strategy">
      ${strategyHead}
      <details class="sim-strategy--collapsed"${sizing ? " open" : ""}>
      ${collapsedSummary}
      <div class="sim-strategy__body">
        <h3 class="btm-subhead">${T.simPowerSeeds}</h3>
        <div class="sim-strategy__grid">${cards}</div>
        <h3 class="btm-subhead">${T.simEnergySeedsAuto}</h3>
        <div class="sim-strategy__grid">${energyCards}</div>
        ${shortlistBlock}
      </div>
      </details>
    </section>`;
  }

  return `<section class="btm-card hud-panel hud-frame sim-strategy${busy || sizing ? " sim-strategy--busy" : ""}">
    ${strategyHead}
    ${busy && busyMsg ? busyBlockHtml(busyMsg) : ""}
    <h3 class="btm-subhead">${T.simPowerSeeds}</h3>
    <div class="sim-strategy__grid">${cards}</div>
    <h3 class="btm-subhead">${T.simEnergySeedsAuto}</h3>
    <div class="sim-strategy__grid">${energyCards}</div>
    ${shortlistBlock}
  </section>`;
}

/** 試算報告功能卡：僅第2層契約容量／即時備轉。 */
const SIM_FEATURE_CARDS = {
  demand: {
    icon: "fa-file-contract",
    title: "simFeatureDemand",
    metrics: ["regular_kw", "max_kw", "reducible_kw", "half_peak_delta_kw", "benefit"],
  },
  reserve: { icon: "fa-tower-broadcast", title: "simFeatureReserve", metrics: ["reserve_income", "benefit", "mode"] },
};

const SIM_FEATURE_METRICS = {
  mode: ["simMetricMode", "mode"],
  buffer_kw: ["simMetricBuffer", "kw"],
  regular_kw: ["simMetricRegular", "kw"],
  max_kw: ["simMetricPeakMax", "kw"],
  reducible_kw: ["simMetricReducible", "kw"],
  half_peak_delta_kw: ["simMetricHalfPeakDelta", "kw"],
  off_peak_added_kw: ["simMetricOffPeakReplace", "kw"],
  allowance_kw: ["simContractAllowance", "kw"],
  backup_kwh: ["simMetricBackup", "kwh"],
  soc_min_pct: ["simMetricSocMin", "pct"],
  reserve_income: ["simMetricReserveIncome", "money"],
  benefit: ["simMetricBenefit", "money"],
};

const SIM_FEATURE_REASONS = {
  demand_buffer: "simReasonDemandBuffer",
  contract_rule_adopted: "simReasonContractRuleAdopted",
  contract_no_gain: "simReasonContractNoGain",
  soc_floor: "simReasonSocFloor",
  auto_bid: "simReasonAutoBid",
  manual_bid: "simReasonManualBid",
  no_net_gain: "simReasonNoNetGain",
};

function simFeatureMetricValue(T, key, value) {
  const kind = SIM_FEATURE_METRICS[key]?.[1];
  if (kind === "mode") return value === "manual" ? T.scheduleManual : T.scheduleAuto;
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  if (kind === "money") return locale === "en" ? `${fmt(n)} NT$` : `${fmt(n)} 元`;
  if (kind === "kw") return `${fmt(n, 1)} kW`;
  if (kind === "kwh") return `${fmt(n, 1)} kWh`;
  if (kind === "pct") return `${fmt(n, 1)}%`;
  return fmt(n, 1);
}

function simContractFieldLabel(T, key) {
  const map = {
    regular_kw: T.simContractRegular,
    half_peak_kw: T.simContractHalfPeak,
    non_summer_kw: T.simContractNonSummer,
    saturday_half_peak_kw: T.simContractSatHalfPeak,
    off_peak_kw: T.simContractOffPeak,
  };
  return map[key] || key;
}

/** 三段式四欄；兩段式用非夏月取代半尖。一律顯示（含 0）。 */
function simContractDisplayKeys(...bags) {
  const hasHalf = bags.some((b) => b && Object.prototype.hasOwnProperty.call(b, "half_peak_kw"));
  const hasNonSummer = bags.some((b) => b && Number(b.non_summer_kw || 0) !== 0);
  if (hasHalf || !hasNonSummer) {
    return ["regular_kw", "half_peak_kw", "saturday_half_peak_kw", "off_peak_kw"];
  }
  return ["regular_kw", "non_summer_kw", "saturday_half_peak_kw", "off_peak_kw"];
}

function simContractCardsHtml(T, contracts, keys, { accent } = {}) {
  const c = contracts || {};
  const kw = (value) => `${fmt(value, 1)} <span class="sim-contract-card__unit">kW</span>`;
  return `<div class="sim-contract-cards${accent ? " sim-contract-cards--accent" : ""}">
    ${keys.map((k) => `
      <article class="sim-contract-card">
        <span class="sim-contract-card__label">${escapeHtml(simContractFieldLabel(T, k))}</span>
        <strong class="sim-contract-card__value">${kw(c[k] ?? 0)}</strong>
      </article>`).join("")}
  </div>`;
}

function simDemandDecisionHtml(T, summary) {
  const d = summary.decision;
  if (!d) return "";
  const currentC = d.current_contracts || { regular_kw: d.current_regular_kw };
  const selectedC = d.selected_contracts || { regular_kw: d.selected_regular_kw };
  const fieldKeys = simContractDisplayKeys(currentC, selectedC);
  return `
    <div class="sim-contract-decision">
      <div class="sim-contract-decision__stack">
        <div class="sim-contract-decision__block">
          <h5 class="sim-contract-decision__block-title">${escapeHtml(T.simContractCurrent)}</h5>
          ${simContractCardsHtml(T, currentC, fieldKeys)}
        </div>
        <div class="sim-contract-decision__arrow" aria-hidden="true">
          <i class="fa-solid fa-arrow-down"></i>
        </div>
        <div class="sim-contract-decision__block sim-contract-decision__block--final">
          <h5 class="sim-contract-decision__block-title">${escapeHtml(T.simContractFinal)}</h5>
          ${simContractCardsHtml(T, selectedC, fieldKeys, { accent: true })}
        </div>
      </div>
    </div>`;
}

function simFeatureCardsHtml(T, res, onlyIds = null) {
  const base = simViewBaseRow(res);
  const row = simViewRow(res) || base;
  // 不可回退到頂層推薦點的 feature_summaries，否則切換配置會顯示錯的契約／備轉評估
  const summaries = simRowField(res, row, "feature_summaries") || [];
  const allowed = onlyIds ? new Set(onlyIds) : null;
  const statusKeys = {
    adopted: "simStatusAdopted",
    rolled_back: "simStatusRolled",
    unchanged: "simStatusUnchanged",
  };
  const cards = summaries.flatMap((summary) => {
    const cfg = SIM_FEATURE_CARDS[summary?.id];
    if (!cfg || (allowed && !allowed.has(summary.id))) return [];
    const values = Object.fromEntries((summary.metrics || []).map((metric) => [metric.key, metric.value]));
    if (summary.benefit != null) values.benefit = summary.benefit;
    const metrics = summary.id === "demand" && summary.decision ? "" : cfg.metrics.filter((key) => values[key] != null).slice(0, 4).map((key) => {
      const label = T[SIM_FEATURE_METRICS[key]?.[0]] || key;
      return `<div class="sim-strategy-card__metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(simFeatureMetricValue(T, key, values[key]))}</strong></div>`;
    }).join("");
    const status = summary.status || "unchanged";
    const reason = T[SIM_FEATURE_REASONS[summary.reason]];
    return [`
      <article class="sim-fn-subcard sim-feature-card">
        <div class="sim-fn-subcard__head">
          <h4 class="sim-fn-subcard__title"><i class="fa-solid ${escapeHtml(cfg.icon)}" aria-hidden="true"></i>${escapeHtml(T[cfg.title])}</h4>
          <span class="btm-chip sim-feature-card__status sim-feature-card__status--${escapeHtml(status)}">${escapeHtml(T[statusKeys[status]] || status)}</span>
        </div>
        ${summary.id === "demand" ? simDemandDecisionHtml(T, summary) : ""}
        ${metrics ? `<div class="sim-strategy-card__metrics">${metrics}</div>` : ""}
        ${reason && summary.id !== "demand" ? `<p class="sim-feature-card__reason">${escapeHtml(reason)}</p>` : ""}
      </article>
    `];
  });
  if (!cards.length) return "";
  return `<section class="sim-feature-results"><div class="sim-feature-cards">${cards.join("")}</div></section>`;
}

function simDemandPendingCardHtml(T) {
  return `<section class="sim-feature-results">
    <article class="sim-fn-subcard sim-feature-card sim-feature-card--pending">
      <div class="sim-fn-subcard__head">
        <h4 class="sim-fn-subcard__title"><i class="fa-solid fa-file-contract" aria-hidden="true"></i>${escapeHtml(T.simFeatureDemand)}</h4>
        <span class="btm-chip sim-feature-card__status sim-feature-card__status--pending">${escapeHtml(T.simStatusPending)}</span>
      </div>
      <p class="sim-feature-card__reason">${escapeHtml(T.simContractPending)}</p>
    </article>
  </section>`;
}

function simReportHasContract(res) {
  return !!(res && (res.evaluate_contract_reduction || res.want_contract));
}

function simReportHasReserve(res) {
  if (!res) return false;
  if ((res.functions || []).includes("reserve")) return true;
  const s2 = simActiveStage2(res);
  const finalRow = (s2 && s2.final) || (res.stage2 && res.stage2.final) || res.final || null;
  const ri = (finalRow && finalRow.reserve_income) || res.reserve_income || {};
  return Number(ri.total || 0) !== 0;
}

function simBenefitReportOf(res, row) {
  return simRowField(res, row || simViewRow(res) || simViewBaseRow(res), "benefit_report");
}

function simBenefitMoney(T, value) {
  const n = Number(value);
  return Number.isFinite(n)
    ? (locale === "en" ? `${fmt(n)} NT$` : `${fmt(n)} 元`)
    : "—";
}

function simBenefitDeltaHtml(T, part) {
  if (!part) return "";
  const benefit = Number(part.benefit || 0);
  const benefitLabel = benefit >= 0 ? T.simBenefitAmount : T.simBenefitIncrease;
  const benefitClass = benefit >= 0 ? " sim-delta--save" : " sim-delta--up";
  return `<div class="sim-benefit-delta">
    <div><span>${escapeHtml(T.simBenefitBefore)}</span><strong>${escapeHtml(simBenefitMoney(T, part.before))}</strong></div>
    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    <div><span>${escapeHtml(T.simBenefitAfter)}</span><strong>${escapeHtml(simBenefitMoney(T, part.after))}</strong></div>
    <div class="sim-benefit-delta__amount${benefitClass}">
      <span>${escapeHtml(benefitLabel)}</span>
      <strong>${escapeHtml(simBenefitMoney(T, Math.abs(benefit)))}</strong>
    </div>
  </div>`;
}

function simBenefitBasicSourceLabel(T, source) {
  if (source === "both") return T.simBenefitBasicSourceBoth;
  if (source === "contract") return T.simBenefitBasicSourceContract;
  if (source === "plan") return T.simBenefitBasicSourcePlan;
  return "";
}

function simBenefitReportSectionsHtml(T, res, row) {
  const report = simBenefitReportOf(res, row);
  if (!report || !report.sections) return "";
  const { basic, energy, overage, extra } = report.sections;
  const basicSource = simBenefitBasicSourceLabel(T, basic?.source);
  const basicSection = `
    <section class="sim-benefit-section" data-benefit-section="basic">
      <div class="sim-benefit-section__head">
        <h3><i class="fa-solid fa-file-contract" aria-hidden="true"></i>${escapeHtml(T.simBenefitBasic)}</h3>
        ${basicSource ? `<span class="btm-chip btm-chip--dim">${escapeHtml(basicSource)}</span>` : ""}
      </div>
      ${simBenefitDeltaHtml(T, basic)}
      ${simFeatureCardsHtml(T, res, ["demand"])}
    </section>`;

  const overageSection = `
    <section class="sim-benefit-section" data-benefit-section="overage">
      <div class="sim-benefit-section__head">
        <h3><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>${escapeHtml(T.simBenefitOverage)}</h3>
      </div>
      ${simBenefitDeltaHtml(T, overage)}
    </section>`;

  const energySection = `
    <section class="sim-benefit-section" data-benefit-section="energy">
      <div class="sim-benefit-section__head">
        <h3><i class="fa-solid fa-bolt" aria-hidden="true"></i>${escapeHtml(T.simBenefitEnergy)}</h3>
      </div>
      ${simBenefitDeltaHtml(T, energy)}
      ${simEnergyTransferHtml(res, T, row, { embedded: true })}
    </section>`;

  const extraMetrics = !extra?.visible ? "" : `
    <div class="sim-benefit-extra">
      <div><span>${escapeHtml(T.simBenefitReserveCapacity)}</span><strong>${escapeHtml(simBenefitMoney(T, extra.capacity))}</strong></div>
      <div><span>${escapeHtml(T.simBenefitReservePerformance)}</span><strong>${escapeHtml(simBenefitMoney(T, extra.performance))}</strong></div>
      <div><span>${escapeHtml(T.simBenefitReserveActivation)}</span><strong>${escapeHtml(simBenefitMoney(T, extra.activation_energy))}</strong></div>
      <div class="sim-benefit-extra__total"><span>${escapeHtml(T.simBenefitAmount)}</span><strong>${escapeHtml(simBenefitMoney(T, extra.benefit))}</strong></div>
    </div>`;
  const extraSection = !extra?.visible ? "" : `
    <section class="sim-benefit-section" data-benefit-section="extra">
      <div class="sim-benefit-section__head">
        <h3><i class="fa-solid fa-tower-broadcast" aria-hidden="true"></i>${escapeHtml(T.simBenefitExtra)}</h3>
      </div>
      ${extraMetrics}
      ${simFeatureCardsHtml(T, res, ["reserve"])}
    </section>`;

  return `<div class="sim-benefit-sections">${basicSection}${overageSection}${energySection}${extraSection}</div>`;
}

function simReportKpisHtml(T, res, {
  sizeLabel,
  viable,
  row,
  days,
} = {}) {
  const report = simBenefitReportOf(res, row);
  const summary = report?.summary || {};
  // 切換非推薦點重跑 Stage2 時，尚無該點 benefit_report；仍視為 pending
  const pending = !!summary.pending || (!report && simStage2Pending(res));
  const totalBenefit = pending || summary.total_benefit == null
    ? null
    : Number(summary.total_benefit);
  const saveKpiClass = totalBenefit == null
    ? ""
    : (Number(totalBenefit) >= 0 ? " dash-kpi--energy" : " dash-kpi--loss");
  const bill = pending || summary.after_bill_total == null
    ? null
    : Number(summary.after_bill_total);

  return `<div class="sim-report-size-kpis" id="simReportSizeKpis">
    <div class="dash-kpis sim-report__kpis" id="simReportKpis">
    ${row ? `<article class="dash-kpi hud-panel hud-frame${viable ? " dash-kpi--total" : ""}">
      <div class="dash-kpi__label">${sizeLabel || T.simKpiSize}</div>
      <div class="dash-kpi__value sim-size-kpi">${fmt(row.pcs_kw, 0)} <span>kW</span> / ${fmt(row.batt_kwh, 0)} <span>kWh</span></div>
    </article>` : ""}
    ${dashKpiHtml(T.simBillAfterBess || T.simKpiAfter, pending ? null : bill, days)}
    ${dashKpiHtml(T.simKpiTotalBenefit, totalBenefit, days, saveKpiClass)}
    </div>
  </div>`;
}

function simReportSizeKpisBlock(T, res) {
  /** 配置結果卡：放在地圖下方（最終結果），不塞進試算報告標題區。 */
  const baseRow = simViewBaseRow(res) || simSizingRow(res) || res.best_effort || (res.grid || [])[0];
  if (!baseRow) return "";
  const r = simViewRow(res) || baseRow;
  const viable = !!res.viable;
  const days = simReportDays();
  const sizeLabel = (() => {
    if (simViewMode === "max_savings") return T.simViewMaxSave || T.simTagBest;
    if (simViewMode === "max_util") return T.simViewMaxUtil || T.simTagBest;
    return viable ? T.simKpiSize : T.simTagBest;
  })();
  return simReportKpisHtml(T, res, {
    sizeLabel,
    viable,
    row: r,
    days,
  });
}

function simReportHeadHtml(T, res) {
  const baseRow = simViewBaseRow(res) || simSizingRow(res) || res.best_effort || (res.grid || [])[0];
  if (!baseRow) return "";
  syncSimViewContext(res, baseRow);
  const pending = simStage2Pending(res);
  const evaluating = !!simulateFullFetch || pending;
  const evalBanner = evaluating
    ? `<div class="sim-report__eval">${busyBlockHtml(T.simEvaluatingExtras)}</div>`
    : "";
  const fullFail = !!session._simFullError;
  const failBanner = fullFail && !simulateFullFetch
    ? `<p class="sim-report__warn btm-meta btm-meta--err">${T.simFullFailedKeep}
        <button type="button" class="btm-btn btm-btn--ghost" id="btnSimulateFullRetry">${T.simFullRetry}</button>
      </p>`
    : "";

  // 第二層未完成：契約卡保留評估狀態；配置 KPI 在地圖下方另渲染
  if (pending) {
    return `<section class="btm-card hud-panel hud-frame sim-report" id="simReportHead">
      <h2 class="btm-card__title seetel-title">${T.simReport}</h2>
      ${evalBanner}
      ${failBanner}
      ${simReportHasContract(res) ? simDemandPendingCardHtml(T) : ""}
    </section>`;
  }

  const viable = !!res.viable;
  const warn = viable
    ? ""
    : `<p class="sim-report__warn btm-meta btm-meta--err">${T.simNoViable}</p>`;

  return `<section class="btm-card hud-panel hud-frame sim-report" id="simReportHead">
    <h2 class="btm-card__title seetel-title">${T.simReport}</h2>
    ${warn}
    ${failBanner}
    ${simBenefitReportSectionsHtml(T, res, simViewRow(res) || baseRow)}
  </section>`;
}

function renderSimulateResult(T, res) {
  const r = simViewBaseRow(res) || simSizingRow(res) || res.best_effort || (res.grid || [])[0];
  if (!r) return "";
  const skipped = (res.skipped || []).length
    ? `<p class="btm-meta">${T.simSkipped}: ${res.skipped.join(", ")}</p>`
    : "";

  // 僅兩個以上配置才顯示地圖／配置切換；單一推薦不佔版面
  const multi = (res.grid || []).length > 1;
  const pick = multi ? simViewPanelHtml(res, T) : "";
  const mapSection = multi
    ? `<section class="btm-card hud-panel hud-frame" id="simMapCard">
    <h2 class="btm-card__title seetel-title">${T.simSavingsChart}</h2>
    <div class="sim-map-layout">
      <div class="sim-map-layout__chart">
        <div id="simSavingsChart" class="sim-savings-chart" role="img" aria-label="${T.simSavingsChart}"></div>
      </div>
      ${pick}
    </div>
    <details class="sim-grid-fold">
      <summary class="sim-grid-fold__summary" aria-label="${T.simGridFold}">
        <span class="sim-grid-fold__chev" aria-hidden="true"></span>
      </summary>
      <div class="sim-grid-fold__body">
        ${simGridResultsHtml(res, T)}
        ${skipped}
      </div>
    </details>
  </section>`
    : "";

  const sizeKpis = simReportSizeKpisBlock(T, res);

  // 需第二層且未完成：地圖（若有）＋配置卡＋評估狀態
  if (simStage2Pending(res)) {
    return `${mapSection}
  ${sizeKpis}
  ${simReportHeadHtml(T, res)}`;
  }

  const reportHead = simReportHeadHtml(T, res);
  // 地圖 → 配置結果卡 → 效益報告 → 排程 → 視覺化
  return `${mapSection}
  ${sizeKpis}
  ${reportHead}
  ${simViewRecCardHtml(res, T)}
  ${simDispatchCardHtml(res, T)}`;
}

function renderSimulateParams(T, sim) {
  const sug = suggestedBufferKw(sim, session.contractValues);
  const demandKw = sim.demandBufferKw != null ? sim.demandBufferKw : sug;
  const antiKw = sim.antiExportKw != null ? sim.antiExportKw : sug;
  return `<section class="btm-card hud-panel hud-frame">
      <div class="sim-params-block">
        <h3 class="btm-subhead">${T.batterySoc}</h3>
        <div class="btm-row">
          ${simNumField("chargeEff", T.chargeEff, pctDisplay(sim.chargeEff), 0.1, 50, 100)}
          ${simNumField("socMax", T.socMax, pctDisplay(sim.socMax), 1, 0, 100)}
          ${simNumField("socMin", T.socMin, pctDisplay(sim.socMin), 1, 0, 100)}
        </div>
      </div>
      <div class="sim-params-block">
        <h3 class="btm-subhead">${T.gridReserve}</h3>
        <div class="btm-row">
          ${simNumField("bufferPct", T.bufferPct, sim.bufferPct, 0.1, 0, 100)}
          ${simNumField("demandBufferKw", T.demandBufferKw, demandKw, 10, 0)}
          ${simNumField("antiExportKw", T.antiExportKw, antiKw, 10, 0)}
        </div>
      </div>
    </section>`;
}

function renderSimulatePanelPlanChange(T, sim) {
  const simTou = activeSimulateTou();
  const touOpts = TOU_OPTIONS.map(
    (opt) => `<option value="${opt}"${simTou === opt ? " selected" : ""}>${opt}</option>`,
  ).join("");
  return simFnPanel(sim.detailTab === "plan_change", "plan_change", `
    ${renderFnParamsCard(`
    <div class="sim-fn-fields">
      <label class="ts-field"><span class="ts-field__label">${T.simScenarioPlan}</span>
        <select class="ts-select" id="simScenarioTou">${touOpts}</select></label>
    </div>
    <h4 class="btm-subhead">${T.simScenarioContracts}</h4>
    <div class="btm-row" id="simScenarioContracts">${simScenarioContractFieldsHtml(T)}</div>`)}
  `);
}

function renderSimulateFunctions(T, sim) {
  if (!simWorkspaceReady) {
    return `<section class="btm-card hud-panel hud-frame sim-workspace-loading" role="status" aria-live="polite">
      ${busyBlockHtml(T.simWorkspaceLoading || T.simSampleRunning)}
    </section>`;
  }
  return `<section class="btm-card hud-panel hud-frame" id="simDetails">
      ${renderSimulateTabs(T, sim)}
      <div class="sim-tab-panels">
        ${renderSimulatePanelTou(T, sim)}
        ${renderSimulatePanelPlanChange(T, sim)}
        ${renderSimulatePanelDemand(T, sim)}
        ${renderSimulatePanelReserve(T, sim)}
        ${renderSimulatePanelBackup(T, sim)}
        ${renderSimulatePanelLargeUser(T, sim)}
      </div>
    </section>`;
}

function renderSimulate() {
  const busy = routeBusyHtml(ROUTES.SIMULATE);
  if (busy) return busy;
  const T = I18N[locale].simulate;
  const sim = session.simulate;
  const hasImport = !!session.importId;
  if (hasImport) seedSimulateFromImport(false);
  const simTou = activeSimulateTou();
  sim.touSchedule = normalizeScheduleMatrix(sim.touSchedule, () => defaultTouSlots(simTou));
  sim.reserveSchedule = normalizeScheduleMatrix(sim.reserveSchedule, defaultReserveHourly);

  if (!hasImport) {
    return `<div class="btm-page btm-page--sim">
      ${pageHeader("simulate.title")}
      ${emptyImportHtml()}
    </div>`;
  }

  const step = simWizardStep();
  const stepCls = (id) => (step === id ? "" : " sim-step--off");
  return `<div class="btm-page btm-page--sim">
    ${pageHeader("simulate.title")}
    ${renderSimStepBar(T, step)}
    <div class="sim-step${stepCls("fns")}" data-step="fns">
      ${hasImport ? renderSimulateFunctions(T, sim) : emptyImportHtml()}
      ${renderSimFnsNav(T)}
    </div>
    <div class="sim-step${stepCls("config")}" data-step="config">
      <div id="simStepConfig">${hasImport ? renderSimStrategySection(T, sim) : ""}</div>
      ${renderSimConfigNav(T)}
    </div>
    <div class="sim-step${stepCls("params")}" data-step="params">
      ${renderSimulateParams(T, sim)}
      ${renderSimParamsNav(T)}
    </div>
    <div class="sim-step${stepCls("result")}" data-step="result">
      ${renderSimReportSection(T)}
      ${renderSimRunBar(T)}
    </div>
  </div>`;
}

function renderSimulatePanelTou(T, sim) {
  return simFnPanel(sim.detailTab === "tou", "tou", `
    ${renderFnModeCard("tou", "touScheduleMode", sim, T, {
      scheduleTitle: T.touTargetSoc,
    })}
  `);
}

function renderSimulatePanelDemand(T, sim) {
  return simFnPanel(sim.detailTab === "demand", "demand", `
    ${renderFnParamsCard(`
    <p class="sim-fn-note btm-meta">${escapeHtml(T.simContractFnHint)}</p>`)}
  `);
}

function renderSimulatePanelReserve(T, sim) {
  const maxMw = simMaxReserveBidMw();
  const badge = maxMw > 0
    ? `<span class="btm-chip btm-chip--dim">${T.reserveMaxLabel} ${maxMw} MW</span>`
    : `<span class="btm-chip btm-chip--warn">${T.reserveNoContract}</span>`;
  return simFnPanel(sim.detailTab === "reserve", "reserve", `
    ${renderFnModeCard("reserve", "reserveScheduleMode", sim, T, {
      scheduleTitle: T.reserveBidMw,
      badge,
    })}
    ${renderFnParamsCard(`
    <div class="sim-fn-fields">
      ${simNumField("reserveCapacityPrice", T.reserveCapacityPrice, sim.reserveCapacityPrice, 1, 0)}
      ${simNumField("reservePerformancePrice", T.reservePerformancePrice, sim.reservePerformancePrice, 1, 0)}
      ${simNumField("reserveEnergyPrice", T.reserveEnergyPrice, sim.reserveEnergyPrice, 1, 0)}
      ${simNumField("reserveMonthlyDispatchCount", T.reserveMonthlyDispatchCount, sim.reserveMonthlyDispatchCount, 1, 0)}
    </div>`)}
  `);
}

function renderSimulatePanelBackup(T, sim) {
  return simFnPanel(sim.detailTab === "backup", "backup", `
    ${renderFnParamsCard(`
    <div class="sim-fn-fields">
      ${simNumField("backupReserveKwh", T.backupReserveKwh, sim.backupReserveKwh, 1, 0)}
    </div>`)}
  `);
}

function renderSimulatePanelLargeUser(T, sim) {
  const scenario = buildScenarioContracts() || {};
  const regular = Number(scenario.regular_kw || session.contractValues.regular_kw || 0);
  const ratio = Number(sim.largeUserRatio) || 0;
  const applies = regular >= LARGE_USER_MIN_KW;
  const oblKw = regular > 0 ? Math.round(regular * ratio * 10) / 10 : null;
  const preview = oblKw == null
    ? `<p class="btm-meta sim-fn-note">${T.largeUserNoContract}</p>`
    : `<div class="sim-fn-metrics">
        <div class="sim-fn-metric">
          <span>${T.largeUserMinKw}</span>
          <strong class="${applies ? "sim-obl--ok" : "sim-obl--warn"}">${applies ? T.largeUserApplies : T.largeUserExempt}</strong>
          <em>≥ ${LARGE_USER_MIN_KW} kW</em>
        </div>
        <div class="sim-fn-metric">
          <span>${T.largeUserOblKw}</span>
          <strong>${oblKw} <small>kW</small></strong>
        </div>
        <div class="sim-fn-metric">
          <span>${T.largeUserRatio}</span>
          <strong>${fmt(ratio * 100, 0)}%</strong>
        </div>
      </div>`;

  return simFnPanel(sim.detailTab === "large_user", "large_user", `
    ${renderFnParamsCard(`
    <div class="sim-fn-fields">
      ${simNumField("largeUserRatio", T.largeUserRatio, sim.largeUserRatio, 0.01, 0, 1)}
      ${simNumField("largeUserPowerRatio", T.largeUserPowerRatio, sim.largeUserPowerRatio, 0.01, 0, 1)}
    </div>
    ${preview}`)}
  `);
}

/** 輕量刷新策略樣本（半尖峰／勾選變更）；完整試算仍走 startSimulateRun。 */
function fetchSimulateSample({ replace = false } = {}) {
  if (!session.importId) return Promise.resolve(null);
  if (simulateFetch) return Promise.resolve(null);
  if (simulateSampleFetch && !replace) return simulateSampleFetch;

  const fd = buildSimulateFormData();
  if (!fd) return Promise.resolve(null);
  const job = ++simulateSampleJob;
  const importId = session.importId;

  session.lastSimulateSample = null;
  simulateSampleFetch = apiJson("/api/simulate/sample", { method: "POST", body: fd })
    .then((sample) => {
      if (job !== simulateSampleJob || session.importId !== importId) return null;
      simulateSampleFetch = null;
      session.lastSimulateSample = sample;
      if (sample && sample.diagnosis) {
        sizingDiagnosis = sample.diagnosis;
      }
      simSampleStamp = simConditionStamp();
      persistSession();
      paintSimSample();
      return sample;
    })
    .catch((err) => {
      if (job === simulateSampleJob) simulateSampleFetch = null;
      if (isImportExpiredError(err)) redirectImportExpired();
      else paintSimSample();
      return null;
    });

  paintSimSample();
  return simulateSampleFetch;
}

function ensureSimSample() {
  if (!session.importId || session.simulate.sizingMode === "single") return;
  readSimulateForm();
  const stamp = simConditionStamp();
  if (stamp === simSampleStamp && session.lastSimulateSample) return;
  fetchSimulateSample({ replace: true });
}

function showSimStep(id) {
  readSimulateForm();
  const allowed = ["params", "fns", "config", "result"];
  if (!allowed.includes(id)) return;
  if ((id === "config" || id === "params" || id === "result") && !session.importId) return;
  if (simResultLocksSteps() && id !== "result") return;
  if (
    id === "result"
    && !normalizeSimulateSizeResult(session.lastSimulateSize)
    && !simulateFetch
    && !simulateFullFetch
  ) return;
  session.simulate.wizardStep = id;
  persistSession();
  const page = document.querySelector(".btm-page--sim");
  if (!page) {
    renderPage({ animate: false, preserveScroll: true });
    if (id === "config") ensureSimSample();
    return;
  }
  page.querySelectorAll(".sim-step").forEach((el) => {
    el.classList.toggle("sim-step--off", el.dataset.step !== id);
  });
  page.querySelectorAll(".sim-steps__item").forEach((el) => {
    const btn = el.querySelector("[data-sim-step]");
    el.classList.toggle("sim-steps__item--on", !!(btn && btn.dataset.simStep === id));
  });
  if (id === "config") ensureSimSample();
}

function bindSimStrategyControls() {
  document.querySelectorAll('[name="sizingMode"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      persistSession();
      if (session.simulate.sizingMode === "single") {
        simulateSampleJob += 1;
        simulateSampleFetch = null;
        refreshSimConfigStep();
        return;
      }
      markSimSampleStale();
      fetchSimulateSample({ replace: true });
    });
  });

  document.querySelectorAll('[name="includeHalfPeak"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      persistSession();
      refreshSimConfigStep();
    });
  });

  document.querySelectorAll('[name="sizingStrategies"], [name="sizingEnergySeeds"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      persistSession();
      markSimSampleStale();
      fetchSimulateSample({ replace: true });
    });
  });
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
  if (session.importId && !simWorkspaceReady && !simWorkspaceBooting) {
    simWorkspaceBooting = true;
    ensureSettingsLoaded().then(() => {
      const importId = session.importId;
      const finishBoot = () => {
        simWorkspaceBooting = false;
        if (session.importId !== importId) return;
        simWorkspaceReady = true;
        if (parseRoute() !== ROUTES.SIMULATE) return;
        renderPage({ animate: false, preserveScroll: true });
        if (simWizardStep() === "config") ensureSimSample();
      };
      finishBoot();
    });
  }

  const simTouEl = document.getElementById("simScenarioTou");
  if (simTouEl) {
    simTouEl.onchange = () => {
      applySimulateTouChange(simTouEl.value);
      markSimSampleStale();
      renderPage({ animate: false, preserveScroll: true });
    };
  }
  document.querySelectorAll("#simScenarioContracts input").forEach((el) => {
    el.addEventListener("change", () => {
      readScenarioContractInputs();
      markSimSampleStale();
      persistSession();
    });
  });

  bindSimStrategyControls();
  document.getElementById("simStepConfig")?.addEventListener("input", (ev) => {
    if (!ev.target.closest("[data-sim]")) return;
    readSimulateForm();
  });

  document.querySelectorAll('[name="bessFn"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      if (el.value === "demand") {
        const on = el.checked;
        const rest = (session.simulate.functions || []).filter((f) => f !== "tou" && f !== "demand");
        session.simulate.functions = on ? ["tou", ...rest, "demand"] : ["tou", ...rest];
        syncContractFunction(session.simulate, "demand");
        if (on) session.simulate.detailTab = "demand";
        markSimSampleStale();
        persistSession();
        renderPage({ animate: false, preserveScroll: true });
        return;
      }
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
      if (tab !== "tou" && tab !== "plan_change" && !fns.includes(tab)) return;
      session.simulate.detailTab = tab;
      persistSession();
      syncSimulateTabs();
    });
  });
  document.querySelectorAll('[name="touScheduleMode"], [name="reserveScheduleMode"]').forEach((el) => {
    el.addEventListener("change", () => {
      const prevRes = session.simulate.reserveScheduleMode;
      const prevTou = session.simulate.touScheduleMode;
      readSimulateForm();
      if (el.name === "reserveScheduleMode" && el.value === "manual" && prevRes !== "manual") {
        const rec = simReserveMetaFromResult()?.recommended_schedule;
        if (rec) {
          session.simulate.reserveSchedule = normalizeScheduleMatrix(rec, defaultReserveHourly);
        }
      }
      if (el.name === "touScheduleMode" && el.value === "manual" && prevTou !== "manual") {
        session.simulate.touSchedule = seedManualTouFromRecommended();
      }
      renderPage({ animate: false, preserveScroll: true });
    });
  });
  document.querySelectorAll("[data-sched-open]").forEach((el) => {
    el.addEventListener("click", () => {
      const kind = el.dataset.schedOpen;
      if (kind !== "tou" && kind !== "reserve") return;
      readSimulateForm();
      if (kind === "tou") maybeSeedManualTouOnce();
      simScheduleModal = kind;
      syncScheduleModalHost();
    });
  });
  if (!simScheduleEscBound) {
    simScheduleEscBound = true;
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && simScheduleModal) closeScheduleModal();
    });
  }
  syncScheduleModalHost();
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
      const key = el.dataset.sim;
      if (key === "bufferPct") {
        const sug = suggestedBufferKw(session.simulate, session.contractValues);
        session.simulate.demandBufferKw = sug;
        session.simulate.antiExportKw = sug;
        markSimSampleStale();
        persistSession();
        renderPage({ animate: false, preserveScroll: true });
        return;
      }
      if (key === "demandBufferKw" || key === "antiExportKw") {
        const n = Number(session.simulate[key]);
        if (Number.isFinite(n)) session.simulate[key] = ceilToStep(Math.max(0, n));
        markSimSampleStale();
        persistSession();
        renderPage({ animate: false, preserveScroll: true });
        return;
      }
      if (key === "socMin" || key === "socMax" || key === "chargeEff") {
        markSimSampleStale();
      }
    });
    if (el.dataset.sched) {
      el.addEventListener("input", () => {
        readSimulateForm();
      });
    }
  });
  syncSimulateTabs();

  document.getElementById("btnSimNextFns")?.addEventListener("click", () => showSimStep("config"));
  document.getElementById("btnSimBack")?.addEventListener("click", () => showSimStep("fns"));
  document.getElementById("btnSimNextConfig")?.addEventListener("click", () => showSimStep("params"));
  document.getElementById("btnSimBackParams")?.addEventListener("click", () => showSimStep("config"));
  document.querySelectorAll("[data-sim-step]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.disabled) return;
      showSimStep(el.dataset.simStep);
    });
  });

  async function startSimulateRun() {
    if (simulateFetch || simulateFullFetch || simulateExportFetch) return;
    // 有報告時不可直接重跑；須先清除結果
    if (normalizeSimulateSizeResult(session.lastSimulateSize)) return;
    // 取消進行中的預覽取樣
    simulateSampleJob += 1;
    simulateSampleFetch = null;
    readSimulateForm();
    const meta = simVisibleMeta();
    if (!requireLiveImportOrRedirect()) return;
    await ensureSettingsLoaded();
    if (!buildScenarioContracts()) {
      setRunMeta(meta, t("import.needSchema"), true);
      return;
    }
    const singleRun = session.simulate.sizingMode === "single";
    if (singleRun) {
      const pcs = Number(session.simulate.manualPcsKw);
      const batt = Number(session.simulate.manualBattKwh);
      if (!(pcs > 0) || !(batt > 0)) {
        setRunMeta(meta, t("simulate.simNeedManual"), true);
        return;
      }
    } else if (
      !normalizeSizingStrategies(session.simulate.sizingStrategies).length
      || !normalizeEnergySeeds(session.simulate.sizingEnergySeeds).length
    ) {
      setRunMeta(meta, t("simulate.simNeedStrategy"), true);
      return;
    }
    // 凍結本輪 simulate：size→full／view 共用同一份（略過 UI 欄）
    simFrozenPayload = simulateApiJson();
    const fdSize = buildSimulateFormData({ simulateJson: simFrozenPayload });
    if (!fdSize) {
      setRunMeta(meta, t("import.needSchema"), true);
      return;
    }
    const id = ++simulateJob;
    simulateFullPrefetchToken += 1;
    session.simulateError = null;
    session._simFullError = null;
    session._scrollSimReport = false;
    clearSimAuxCaches();
    // 工作區已有完整 sample 則直接 /size（後端有 profile／size 快取）
    const existing = session.lastSimulateSample;
    const hasRichSample = !!(existing && existing.profile_stats && existing.diagnosis);
    if (!singleRun && !hasRichSample) {
      const fdSample = buildSimulateFormData({ simulateJson: simFrozenPayload });
      if (!fdSample) {
        setRunMeta(meta, t("import.needSchema"), true);
        return;
      }
      const sampleJob = ++simulateSampleJob;
      session.lastSimulateSample = null;
      simulateSampleFetch = apiJson("/api/simulate/sample", { method: "POST", body: fdSample });
      renderPage({ animate: false, preserveScroll: false });
      try {
        const sample = await simulateSampleFetch;
        if (id !== simulateJob || sampleJob !== simulateSampleJob) return;
        session.lastSimulateSample = sample;
        if (sample && sample.diagnosis) sizingDiagnosis = sample.diagnosis;
        simulateSampleFetch = null;
        persistSession();
      } catch (err) {
        if (id !== simulateJob) return;
        session.simulateError = String(err.message || err);
        persistSession();
        if (isImportExpiredError(err)) {
          redirectImportExpired();
          return;
        }
        simulateSampleFetch = null;
        if (parseRoute() === ROUTES.SIMULATE) {
          renderPage({ animate: false, preserveScroll: false });
        }
        return;
      }
    } else if (existing && existing.diagnosis) {
      // 指定沒有交叉樣本，existing 是 null
      sizingDiagnosis = existing.diagnosis;
    }

    async function applySizeResult(res) {
      simDispatchChartKey = null;
      simViewMode = "recommended";
      simViewContext = "sizing";
      simDispatchChartCache = {};
      simDispatchChartLoadId += 1;
      session.lastSimulateSize = normalizeSimulateSizeResult(res);
      if (session.lastSimulateSize && simFrozenPayload) {
        session.lastSimulateSize._simulatePayload = simFrozenPayload;
      }
      maybeSeedManualTouOnce();
      session.simulate.wizardStep = "result";
      if (res && res.diagnosis) sizingDiagnosis = res.diagnosis;
      if (res) {
        const prevSample = session.lastSimulateSample;
        const rich = prevSample?.profile_stats?.by_half_peak
          || prevSample?.profile_stats?.pcs_sample
          || prevSample?.profile_stats?.two_cycle_sources
          || prevSample?.profile_stats?.max_sources;
        session.lastSimulateSample = {
          profile_stats: rich
            ? prevSample.profile_stats
            : (res.profile_stats || prevSample?.profile_stats || null),
          grid_points: res.grid_points ?? prevSample?.grid_points,
          sample_source: res.sample_source ?? prevSample?.sample_source,
          diagnosis: res.diagnosis ?? prevSample?.diagnosis,
          strategies: res.strategies ?? prevSample?.strategies,
          energy_keys: prevSample?.energy_keys,
          combinations: prevSample?.combinations || null,
        };
      }
      session.simulateResultKey = simulateRunKey();
      session.simulateError = null;
      session._scrollSimReport = true;
      persistSession();
    }

    async function runFullStep(sizeRes) {
      if (!(sizeRes && sizeRes.need_full && sizeRes.stage1_key)) return;
      const rec = sizeRes.recommended || sizeRes.best_effort;
      if (!rec) return;
      if (parseRoute() === ROUTES.SIMULATE) {
        renderPage({ animate: false, preserveScroll: true });
      }
      try {
        const merged = await fetchSimulateFullForRow(sizeRes, rec, I18N[locale].simulate);
        if (id !== simulateJob) return;
        session._simFullError = null;
        if (simFrozenPayload && merged) merged._simulatePayload = simFrozenPayload;
        await applySizeResult(merged || sizeRes);
        const live = normalizeSimulateSizeResult(session.lastSimulateSize) || merged;
        prefetchStage2Siblings(live, I18N[locale].simulate, id).catch((err) => {
          console.warn("sim stage2 sibling prefetch", err);
        });
      } catch (err) {
        if (id !== simulateJob) return;
        session._simFullError = String(err.message || err);
        if (isImportExpiredError(err)) {
          redirectImportExpired();
          return;
        }
        persistSession();
      }
    }

    try {
      session.simulate.wizardStep = "result";
      simulateFetch = apiJson("/api/simulate/size", { method: "POST", body: fdSize });
      renderPage({ animate: false, preserveScroll: false });

      const res = await simulateFetch;
      if (id !== simulateJob) return;
      simulateFetch = null;
      await applySizeResult(res);
      if (parseRoute() === ROUTES.SIMULATE) {
        renderPage({ animate: false, preserveScroll: !session._scrollSimReport });
      }
      await runFullStep(res);
    } catch (err) {
      if (id !== simulateJob) return;
      session.simulateError = String(err.message || err);
      if (!normalizeSimulateSizeResult(session.lastSimulateSize)) session.simulate.wizardStep = "params";
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

  const fullRetry = document.getElementById("btnSimulateFullRetry");
  if (fullRetry) {
    fullRetry.onclick = () => { retrySimulateFullStep(); };
  }

  const clearBtn = document.getElementById("btnSimulateClear");
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (simulateFetch || simulateFullFetch || simulateSampleFetch || simulateExportFetch) return;
      session.simulate.wizardStep = "params";
      markSimSampleStale();
      clearSimulateResult();
      renderPage({ animate: false, preserveScroll: true });
      if (session.importId && session.simulate.sizingMode !== "single") {
        fetchSimulateSample({ replace: true });
      }
    };
  }

  const exportBtn = document.getElementById("btnSimulateExport");
  if (exportBtn) {
    exportBtn.onclick = async () => {
      if (simulateFetch || simulateFullFetch || simulateSampleFetch || simulateExportFetch) return;
      const res = normalizeSimulateSizeResult(session.lastSimulateSize);
      const row = simViewRow(res);
      if (!row || !requireLiveImportOrRedirect()) return;
      readSimulateForm();
      await ensureSettingsLoaded();
      const meta = simVisibleMeta();
      const s2Exp = simActiveStage2(res);
      const finalRow = (s2Exp && s2Exp.final)
        || (res.stage2 && res.stage2.final)
        || res.final
        || null;
      const adopted = finalRow && finalRow.stage2_contracts;
      // contracts＝情境／量體；scheme＝stage2 採用契約（若有）
      const fd = buildSimulateFormData({
        pcsKw: row.pcs_kw,
        battKwh: row.batt_kwh,
        schemeContracts: adopted || undefined,
      });
      if (!fd) {
        setRunMeta(meta, t("import.needSchema"), true);
        return;
      }
      const T = I18N[locale].simulate;
      simulateExportFetch = true;
      exportBtn.disabled = true;
      exportBtn.textContent = T.simExporting;
      try {
        const r = await fetch("/api/simulate/export", { method: "POST", body: fd });
        if (!r.ok) {
          const data = await r.json().catch(() => ({}));
          const msg = detailMessage(data, r.status + " " + r.statusText);
          if (r.status === 404 && msg === "import not found") {
            markImportGone();
            throw new Error(t("import.expired"));
          }
          throw new Error(msg);
        }
        const blob = await r.blob();
        const name = `btm_sim_${Math.round(Number(row.pcs_kw))}_${Math.round(Number(row.batt_kwh))}kWh_15min.xlsx`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        if (isImportExpiredError(err)) {
          redirectImportExpired();
          return;
        }
        setRunMeta(meta, `${T.simExportErr}: ${err.message || err}`, true);
      } finally {
        simulateExportFetch = null;
        if (parseRoute() === ROUTES.SIMULATE) {
          renderPage({ animate: false, preserveScroll: true });
        }
      }
    };
  }

  const simRes = normalizeSimulateSizeResult(session.lastSimulateSize);
  if (simRes) {
    requestAnimationFrame(() => {
      const T = I18N[locale].simulate;
      renderSimSavingsChart(simRes, T);
      if (simStage2Pending(simRes)) {
        if (session._scrollSimReport) {
          session._scrollSimReport = false;
          (document.getElementById("simMapCard") || document.getElementById("simReportHead"))
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
      seedSimDispatchCache(simRes);
      bindSimDispatchCharts(simRes, T);
      ensureSimDispatchCharts(simRes, T).then(() => {
        prefetchSimViewCharts(simRes, T).catch((err) => {
          console.warn("sim dispatch prefetch", err);
        });
        // 實際功率矩陣就緒後，重掛排程卡（直接呈現）
        mountSimFollowCards(simRes, T);
      });
      if (session._scrollSimReport) {
        session._scrollSimReport = false;
        (document.getElementById("simReportHead") || document.querySelector(".sim-report"))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  else if (route === ROUTES.DASHBOARD) bindPageTabs(() => dashTab, (id) => { dashTab = id; });
  else if (route === ROUTES.SIMULATE) bindSimulate();
}

const importFileHold = document.createElement("div");

function parkImportFile() {
  const upload = document.getElementById("upload");
  if (upload) importFileHold.appendChild(upload);
}

function mountImportFile() {
  const held = importFileHold.querySelector("#upload");
  const upload = document.getElementById("upload");
  if (held && upload && held !== upload) upload.replaceWith(held);
}

function renderPage(options = {}) {
  const main = document.getElementById("main-content");
  const root = document.getElementById("page-root");
  if (!main || !root) return;

  const prevRoute = currentRoute;
  const nextRoute = parseRoute();
  const isRouteChange = prevRoute !== nextRoute;
  if (isRouteChange && nextRoute !== ROUTES.SIMULATE) {
    simScheduleModal = null;
    const host = document.getElementById("simSchedModalHost");
    if (host) host.innerHTML = "";
    document.body.classList.remove("sim-sched-modal-open");
  } else if (isRouteChange && nextRoute === ROUTES.SIMULATE) {
    // 進入試算頁時確保 modal 掛在 body（不被 main overflow 裁切）
    scheduleModalHostEl();
  }
  const animate = options.animate ?? isRouteChange;
  const preserveScroll = options.preserveScroll ?? !isRouteChange;
  const scrollTop = preserveScroll ? main.scrollTop : 0;
  const gen = ++renderGeneration;

  const commit = () => {
    if (gen !== renderGeneration) return;
    parkImportFile();
    currentRoute = nextRoute;
    root.classList.remove("page-fade", "page-fade-out");
    root.style.opacity = "";
    setActiveNav(currentRoute);
    root.innerHTML = buildPageHtml(currentRoute);
    if (nextRoute === ROUTES.IMPORT) mountImportFile();
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
  dropUnusableSelection();
  window.addEventListener("popstate", () => renderPage({ animate: true }));
  const route = parseRoute();
  syncUrl(route, true);
  renderPage();
}

boot();
