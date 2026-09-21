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
      previewHint: "此處切換僅預覽／編輯該方案預設電價，不改已匯入資料的方案",
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
      simExportXlsx: "匯出 XLSX",
      simExporting: "匯出中…",
      simExportErr: "匯出失敗",
      simRunningKeep: "配置組合試算中…",
      simResultStale: "參數或契約已變更，報告可能與目前設定不符，請重新試算。",
      simResultSummary: "上次試算",
      simLastRunRerun: "重新試算中，以下為先前結果",
      simLastRunCleared: "已清除以下試算報告",
      simLastRunDismiss: "關閉",
      simParams: "試算參數",
      loading: "匯入資料中…",
      simErr: "試算失敗",
      simSavings: "預估節省（元）",
      simSkipped: "略過功能",
      simBatt: "Battery（kWh）",
      simHours: "時數（h）",
      simReport: "試算報告",
      simKpiBefore: "原始電費",
      simKpiAfter: "更改後電費",
      simPlanChange: "方案更改",
      simScenarioPlan: "模擬電價方案",
      simScenarioPlanHint: "",
      simScenarioContracts: "模擬契約容量",
      simPlanSwitchedNote: "已切換方案（原始＝匯入；更改後＝新方案）",
      simEnergyTransferHint: "",
      simEnergyTransferScenarioOnly: "",
      simKwhBefore: "原始（無儲能）",
      simKwhAfter: "更改後（含儲能）",
      simReportBaselineTou: "原始方案",
      simReportSimulateTou: "更改方案",
      simXferSideBefore: "僅原始",
      simXferSideAfter: "僅更改後",
      simKpiSave: "節省",
      simKpiSavePct: "節省率",
      simKpiBillSave: "電費節省",
      simKpiReserveIncome: "備轉收入",
      simKpiTotalBenefit: "合計效益",
      simStage2Note: "",
      stage2WarningLower: "含契約／備轉後效益明顯低於僅儲能調度，請檢視假設",
      stage2WarningOverage: "含契約調整後超約惡化，降容建議可能過積極",
      contractReductionSuggested: "建議經常契約 {kw} kW（可降 {cut} kW）",
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
      simSampleMeta: "預計試算 {pts} 組（已去重）",
      simSampleMetaDone: "已試算 {pts} 組",
      simShortlistSummary: "{pcs} 個 PCS × {batt} 個電池 → 去重後 {pts} 組",
      simShortlistRange: "PCS {pcsMin}–{pcsMax} kW · 電池 {battMin}–{battMax} kWh",
      simStrategyChange: "變更策略",
      simStrategy: "配置策略",
      simPowerSeeds: "功率面向",
      simEnergySeedsAuto: "電量面向",
      simShortlistPreview: "候選組合",
      simShortlistEmpty: "尚無有效候選（功率選 PCS、電量選電池後會交叉組合）",
      simFnStatusTitle: "",
      simStatusOn: "已計算",
      simStatusOff: "未啟用",
      simStatusSkip: "不適用",
      simStatusPending: "評估中",
      simStatusRolled: "已回退",
      simStatusAdopted: "採用",
      simReasonRec: "",
      simReasonMaxSave: "期間節省最高",
      simReasonMaxUtil: "每 kWh 節省最高",
      simWhyTitle: "為何選這個",
      simWhyExtrasNote: "",
      simMapAxisPcs: "PCS（kW）",
      simMapAxisBatt: "電池（kWh）",
      simMapAxisSave: "期間節省（元）",
      simMapLegendSize: "點越大＝PCS 越大",
      simMapLegendColor: "越亮＝利用率越高",
      simMapLegendMarks: "綠＝推薦 · 金＝金額 · 紫＝利用率",
      simMapClickHint: "",
      simMapBest: "最佳推薦",
      simChartBubbleHint: "",
      simCapexNote: "",
      simOtherPlans: "其他方案",
      simBattBenefit: "每 1 kWh 電池的期間節省",
      simChartPcsUtil: "PCS 利用率（%）",
      simChartPeriodSave: "期間節省（元）",
      simChartMarkBatt: "每 kWh 效益",
      simBillSizingOnly: "含儲能",
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
      simIncludeHalfPeakHint: "",
      simIncludeHalfOn: "開啟",
      simIncludeHalfOff: "關閉",
      simRecSchedules: "自動推薦排程",
      simRecTou: "時間電價目標 SOC",
      simRecReserve: "即時備轉投標",
      simEnergyTransfer: "用電轉移",
      simKwhDelta: "差異 kWh",
      simKwhDeltaPct: "差異％",
      simGridFold: "配置組合試算",
      simGridFoldOpen: "展開",
      simGridFoldClose: "收合",
      simTwoCycle: "兩充兩放",
      simBillCompare: "電費對照",
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
      simStage1Kept: "",
      simFinalDevice: "設備",
      simContractCandidates: "契約候選比較",
      simBenefitSizing: "量體節省",
      simBenefitContract: "契約調整",
      simBenefitReserve: "備轉收入",
      simBenefitTotal: "合計效益",
      simBillCompareTitle: "電費對照",
      simCompareReport: "方案比對報告",
      simCompareBaseline: "原始",
      simCompareScheme: "新方案",
      simCompareDelta: "差異",
      simCompareLoading: "載入電費明細…",
      simCompareErr: "比對載入失敗",
      simCompareMonths: "月明細",
      simCompareNet: "新方案淨成本",
      simCompareHint: "",
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
      simCandStatus: "狀態",
      simCandAdopted: "採用",
      simCandFeasible: "可行",
      simCandRejected: "不可行",
      simCandId: "方案",
      simCandRegular: "經常 kW",
      simCandHalfPeak: "半尖峰 ΔkW",
      simCandOffPeakMove: "離峰替代 kW",
      simCandFreeBoost: "免費加額 kW",
      simCandBill: "試算電費",
      simCandReason: "說明",
      simCandCurrent: "現行",
      simCandDayAvg: "尖峰日均",
      simCandP95: "P95",
      simCandMax: "最大需量",
      simRejectExceedPeak: "尖峰超約",
      simRejectExceedHalfPeak: "半尖峰超約",
      simRejectExceedOffPeak: "離峰超約",
      simRejectExceedSat: "週六半尖超約",
      simRejectOther: "不可行",
      simReserveSummaryTitle: "即時備轉摘要",
      simReserveBidRec: "投標推薦",
      simReserveRolledBack: "已回退（無淨增益）",
      simReserveViewDetail: "看月結算與事件",
      simLargeUserDisabled: "經常契約未達 5MW，不可啟用",
      reserveNoNetGain: "備轉無淨增益，已回退為 0 投標",
      simNoViable: "配置組合內無正向節省；以下為虧損最少參考，非建議裝置。",
      simSavingsChart: "組合地圖（節省 × 電池）",
      simChartUnitSavings: "每 1 kWh 電池的期間節省",
      simPcsDailyAvg: "PCS日均使用率",
      simDailyCycle: "SOC日循環",
      simGridLegendRec: "推薦配置",
      simGridLegendSave: "金額最大",
      simGridLegendUtil: "使用率最大",
      simDispatchCharts: "調度曲線",
      simDispatchFilter: "圖表篩選",
      simDispatchFilterHint: "季節／日別／月份套用全部圖表；序列僅熱力與箱型",
      simDispatchMonth: "月份",
      simDispatchMonthAll: "全部",
      simDispatchDayProfile: "單日曲線",
      simDispatchDayProfileHint: "拉動下方滑桿切換日期",
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
      chargeEff: "充放電效率（%）",
      demandBufferKw: "裕度預留（kW）",
      demandBufferHint: "＞0 啟用；硬上限＝契約 − 裕度",
      autoAdjustContract: "自動調整契約容量",
      autoAdjustContractHint: "削峰後評估降經常契約",
      offPeakBoostApplied: "離峰調整 +{kw} kW",
      offPeakBoostSkipped: "離峰調整未套用",
      antiExportKw: "負載預留（kW）",
      antiExportHint: "不逆送",
      gridReserve: "用電預留",
      scheduleMode: "排程設定",
      scheduleAuto: "自動",
      scheduleManual: "手動",
      scheduleModeHintAuto: "依邏輯產生推薦排程並據此試算",
      scheduleModeHintManual: "依你填寫的排程矩陣試算",
      scheduleEdit: "編輯排程",
      scheduleDone: "完成",
      scheduleViewRec: "檢視推薦",
      scheduleUseAsManual: "套用為手動",
      scheduleRecPending: "試算後顯示推薦排程",
      touRecTitle: "推薦目標 SOC 排程",
      touHalfpeakOn: "夏半尖峰預放 · 保留 SOC {pct}%",
      touHalfpeakOff: "夏半尖峰預放未啟用（尖峰／晚間可吸收量已足夠）",
      reserveRecTitle: "推薦投標排程",
      reserveP5Note: "自動投標取歷史可履約量第 5 百分位（約 95% 事件可達標），接受約 5% 尾端失敗風險，並非保證每一次調度都能通過。",
      reserveViewRec: "檢視推薦矩陣",
      reserveUseAsManual: "改為手動並套用",
      touTargetSoc: "目標 SOC（%）",
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
    common: { voltage: "電壓", tou: "電價方案", needImport: "請先匯入資料", goImport: "去匯入" },
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
      previewHint: "Switching here only previews/edits that plan’s defaults; import plan is unchanged",
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
      simExportXlsx: "Export XLSX",
      simExporting: "Exporting…",
      simExportErr: "Export failed",
      simRunningKeep: "Running…",
      simResultStale: "Settings changed — report may be outdated. Run again to refresh.",
      simResultSummary: "Last run",
      simLastRunRerun: "Re-running — previous result below",
      simLastRunCleared: "Cleared report shown below",
      simLastRunDismiss: "Dismiss",
      simParams: "Sizing params",
      loading: "Importing…",
      simErr: "Simulation failed",
      simSavings: "Est. savings",
      simSkipped: "Skipped",
      simBatt: "Battery (kWh)",
      simHours: "Hours (h)",
      simReport: "Sizing report",
      simKpiBefore: "Original bill",
      simKpiAfter: "Changed bill",
      simPlanChange: "Plan change",
      simScenarioPlan: "Simulate TOU plan",
      simScenarioPlanHint: "",
      simScenarioContracts: "Simulate contract kW",
      simPlanSwitchedNote: "Plan changed (baseline = import; after = new plan)",
      simEnergyTransferHint: "",
      simEnergyTransferScenarioOnly: "",
      simKwhBefore: "Original (no BESS)",
      simKwhAfter: "Changed (with BESS)",
      simReportBaselineTou: "Baseline plan",
      simReportSimulateTou: "Changed plan",
      simXferSideBefore: "Baseline only",
      simXferSideAfter: "Changed only",
      simKpiSave: "Savings",
      simKpiSavePct: "Savings %",
      simKpiBillSave: "Bill savings",
      simKpiReserveIncome: "Reserve income",
      simKpiTotalBenefit: "Total benefit",
      simStage2Note: "",
      stage2WarningLower: "Benefit after contract/reserve is much lower than BESS-only — check assumptions",
      stage2WarningOverage: "Overage worsened after contract cut — reduction may be too aggressive",
      contractReductionSuggested: "Suggested regular {kw} kW (cut {cut} kW)",
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
      simSampleMeta: "{pts} combinations planned (deduped)",
      simSampleMetaDone: "{pts} combinations simulated",
      simShortlistSummary: "{pcs} PCS × {batt} batteries → {pts} unique combos",
      simShortlistRange: "PCS {pcsMin}–{pcsMax} kW · battery {battMin}–{battMax} kWh",
      simStrategyChange: "Change strategy",
      simStrategy: "Sizing strategy",
      simPowerSeeds: "Power-facing",
      simEnergySeedsAuto: "Energy-facing",
      simShortlistPreview: "Candidates",
      simShortlistEmpty: "No candidates yet — pick PCS (power) and battery (energy) to cross-combine",
      simFnStatusTitle: "",
      simStatusOn: "On",
      simStatusOff: "Off",
      simStatusSkip: "N/A",
      simStatusPending: "Pending",
      simStatusRolled: "Rolled back",
      simStatusAdopted: "Adopted",
      simReasonRec: "",
      simReasonMaxSave: "Highest period savings",
      simReasonMaxUtil: "Highest savings per kWh",
      simWhyTitle: "Why this pick",
      simWhyExtrasNote: "",
      simMapAxisPcs: "PCS (kW)",
      simMapAxisBatt: "Battery (kWh)",
      simMapAxisSave: "Period savings",
      simMapLegendSize: "Larger = more PCS kW",
      simMapLegendColor: "Brighter = higher PCS util",
      simMapLegendMarks: "Green = recommended · Gold = max $ · Purple = util",
      simMapClickHint: "",
      simMapBest: "Best pick",
      simCapexNote: "",
      simOtherPlans: "Other options",
      simBattBenefit: "Period savings per 1 kWh battery",
      simChartPcsUtil: "PCS utilization (%)",
      simChartPeriodSave: "Period savings",
      simChartMarkBatt: "Per-kWh benefit",
      simBillSizingOnly: "With BESS",
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
      simIncludeHalfPeakHint: "",
      simIncludeHalfOn: "On",
      simIncludeHalfOff: "Off",
      simRecSchedules: "Auto recommended schedules",
      simRecTou: "TOU target SOC",
      simRecReserve: "Reserve bids",
      simEnergyTransfer: "Energy shift",
      simKwhDelta: "Δ kWh",
      simKwhDeltaPct: "Δ %",
      simGridFold: "Combination trials",
      simGridFoldOpen: "Expand",
      simGridFoldClose: "Collapse",
      simTwoCycle: "Two-cycle",
      simBillCompare: "Bill comparison",
      simViewPanel: "Configuration view",
      simViewRec: "Recommended",
      simViewMaxSave: "Max savings",
      simViewMaxUtil: "Max utilization",
      simEnergyP50: "P50 typical",
      simEnergyP90: "P90 robust",
      simEnergyMin: "Min lightest peak day",
      simEnergyMax: "Max day",
      simExtraBenefit: "Extra benefit",
      simStage1Kept: "",
      simFinalDevice: "Device",
      simContractCandidates: "Contract candidates",
      simBenefitSizing: "Sizing savings",
      simBenefitContract: "Contract adjustment",
      simBenefitReserve: "Reserve income",
      simBenefitTotal: "Total benefit",
      simBillCompareTitle: "Bill comparison",
      simCompareReport: "Scheme compare",
      simCompareBaseline: "Baseline",
      simCompareScheme: "Scheme",
      simCompareDelta: "Delta",
      simCompareLoading: "Loading bill detail…",
      simCompareErr: "Compare failed to load",
      simCompareMonths: "Monthly detail",
      simCompareNet: "Scheme net cost",
      simCompareHint: "",
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
      simCandStatus: "Status",
      simCandAdopted: "Adopted",
      simCandFeasible: "Feasible",
      simCandRejected: "Rejected",
      simCandId: "Option",
      simCandRegular: "Regular kW",
      simCandHalfPeak: "Half-peak ΔkW",
      simCandOffPeakMove: "Off-peak replace kW",
      simCandFreeBoost: "Free boost kW",
      simCandBill: "Bill",
      simCandReason: "Note",
      simCandCurrent: "Current",
      simCandDayAvg: "Peak-day avg",
      simCandP95: "P95",
      simCandMax: "Max demand",
      simRejectExceedPeak: "Peak exceed",
      simRejectExceedHalfPeak: "Half-peak exceed",
      simRejectExceedOffPeak: "Off-peak exceed",
      simRejectExceedSat: "Sat half-peak exceed",
      simRejectOther: "Infeasible",
      simReserveSummaryTitle: "Reserve summary",
      simReserveBidRec: "Bid recommendation",
      simReserveRolledBack: "Rolled back (no net gain)",
      simReserveViewDetail: "Monthly & events",
      simLargeUserDisabled: "Regular contract below 5 MW — not eligible",
      reserveNoNetGain: "Reserve has no net gain; rolled back to 0 bid",
      simGridLegendRec: "Recommended",
      simGridLegendSave: "Max savings",
      simGridLegendUtil: "Max utilization",
      simTagBest: "Max savings",
      simNoViable: "No positive savings in combinations; least-loss reference only — not a sizing recommendation.",
      simSavingsChart: "Combination map (savings × battery)",
      simChartUnitSavings: "Period savings per 1 kWh battery",
      simChartBubbleHint: "",
      simPcsDailyAvg: "PCS daily avg util",
      simDailyCycle: "SOC daily cycle",
      simDispatchCharts: "Dispatch curves",
      simDispatchFilter: "Chart filters",
      simDispatchFilterHint: "Season / day / month apply to all charts; series is for heatmap & box only",
      simDispatchMonth: "Month",
      simDispatchMonthAll: "All",
      simDispatchDayProfile: "Single-day curve",
      simDispatchDayProfileHint: "Drag the slider to change date",
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
      chargeEff: "Charge/discharge efficiency (%)",
      demandBufferKw: "Headroom (kW)",
      demandBufferHint: ">0 enables; hard cap = contract − buffer",
      autoAdjustContract: "Auto-adjust contract capacity",
      autoAdjustContractHint: "After peak-shave, evaluate cutting regular contract",
      offPeakBoostApplied: "Off-peak +{kw} kW",
      offPeakBoostSkipped: "Off-peak boost not applied",
      antiExportKw: "Load reserve (kW)",
      antiExportHint: "No reverse export",
      gridReserve: "Site reserve",
      scheduleMode: "Schedule",
      scheduleAuto: "Auto",
      scheduleManual: "Manual",
      scheduleModeHintAuto: "Build a recommended schedule from logic and run with it",
      scheduleModeHintManual: "Run with the matrix you entered",
      scheduleEdit: "Edit schedule",
      scheduleDone: "Done",
      scheduleViewRec: "View recommendation",
      scheduleUseAsManual: "Apply as manual",
      scheduleRecPending: "Recommendation appears after you run sizing",
      touRecTitle: "Recommended target SOC schedule",
      touHalfpeakOn: "Summer half-peak pre-discharge · keep SOC {pct}%",
      touHalfpeakOff: "Summer half-peak pre-discharge off (peak/evening can absorb usable energy)",
      reserveRecTitle: "Recommended bid schedule",
      reserveP5Note: "Auto bids use the 5th percentile of historical deliverable capacity (~95% of events pass). About 5% tail risk remains — not a guarantee for every dispatch.",
      reserveViewRec: "View recommended matrix",
      reserveUseAsManual: "Switch to manual & apply",
      touTargetSoc: "Target SOC (%)",
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

/** 與 backend/app/data/simulate_defaults.json 對齊；開機即可用，不依賴 API 回來後再灌。 */
const BUILTIN_SIMULATE_DEFAULTS = Object.freeze({
  simulateTou: "ThreeStage",
  sizingStrategies: ["p50", "p90", "max", "two_cycle"],
  sizingEnergySeeds: ["min", "p50", "p90", "max"],
  autoAdjustOffPeakContract: false,
  evaluateContractReduction: false,
  demandBufferKw: 10,
  antiExportKw: 10,
  backupReserveKwh: 0,
  touScheduleMode: "auto",
  reserveScheduleMode: "auto",
  reserveCapacityPrice: 200,
  reservePerformancePrice: 100,
  reserveEnergyPrice: 5000,
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

function activeEnergyPrices(season) {
  const v = session.voltage;
  const tou = activeSimulateTou();
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
    // 契約容量 tab（demand）與自動調整契約連動：同開同關
    const on = !!(sim.autoAdjustOffPeakContract || sim.evaluateContractReduction)
      || (sim.functions || []).includes("demand");
    sim.autoAdjustOffPeakContract = on;
    sim.evaluateContractReduction = on;
    const rest = (sim.functions || []).filter((f) => f !== "tou" && f !== "demand");
    sim.functions = on ? ["tou", ...rest, "demand"] : ["tou", ...rest];
  }

  sim.backupReserveKwh = Math.max(0, _finiteOr(base.backupReserveKwh, sim.backupReserveKwh));
  sim.demandBufferKw = Math.max(0, _finiteOr(base.demandBufferKw, sim.demandBufferKw));
  sim.antiExportKw = Math.max(0, _finiteOr(base.antiExportKw, sim.antiExportKw));
  sim.reserveCapacityPrice = Math.max(0, _finiteOr(base.reserveCapacityPrice, sim.reserveCapacityPrice));
  sim.reservePerformancePrice = Math.max(0, _finiteOr(base.reservePerformancePrice, sim.reservePerformancePrice));
  sim.reserveEnergyPrice = Math.max(0, _finiteOr(base.reserveEnergyPrice, sim.reserveEnergyPrice));
  sim.reserveMonthlyDispatchCount = Math.max(
    0,
    Math.floor(_finiteOr(base.reserveMonthlyDispatchCount, sim.reserveMonthlyDispatchCount)),
  );
  sim.largeUserRatio = Math.max(0, Math.min(1, _finiteOr(base.largeUserRatio, sim.largeUserRatio)));
  sim.largeUserPowerRatio = Math.max(0, Math.min(1, _finiteOr(base.largeUserPowerRatio, sim.largeUserPowerRatio)));

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
  return sim;
}

const session = {
  file: null,
  fileLabel: "",
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
  simulate: normalizeSimulate({}),
  _settingsLoaded: false,
};

function persistSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      fileLabel: session.fileLabel,
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
  clearSimCompareBill();
  session.billError = null;
  session.chartsError = null;
  sizingDiagnosis = null;
  simWorkspaceReady = false;
  simWorkspaceBooting = false;
  simulateJob += 1;
  simulateFetch = null;
  simulateSampleFetch = null;
  simPinnedRun = null;
  simDismissedSnapshot = null;
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

const chartFilter = { season: "all", day: "all", month: "all" };
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
let simulateSampleFetch = null;
let simulateExportFetch = null;
let simulateJob = 0;
/** 方案比對完整帳單（記憶體；不寫 sessionStorage） */
let simCompareBill = null;
let simCompareKey = null;
let simCompareFetch = null;
let simCompareLoadId = 0;
/** @type {"delta" | "baseline" | "scheme"} */
let simCompareView = "delta";
let sizingDiagnosis = null;
let simulateSampleJob = 0;
/** 匯入後診斷＋樣本就緒才顯示功能／策略區 */
let simWorkspaceReady = false;
let simWorkspaceBooting = false;
/** 重新試算進行中：凍結的上一筆摘要（不寫入 sessionStorage） */
let simPinnedRun = null;
/** 清除結果後短暫顯示的摘要卡 */
let simDismissedSnapshot = null;
/** @type {null | "tou" | "tou-rec" | "reserve" | "reserve-rec"} 排程矩陣彈窗 */
let simScheduleModal = null;
let simScheduleEscBound = false;

function closeScheduleModal({ reread = true } = {}) {
  if (!simScheduleModal) return;
  if (reread) readSimulateForm();
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
  const mon = chartFilter.month;
  const monthOpts = chartMonthOptions(session.lastCharts, mon);
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
          <label class="ts-field"><span class="ts-field__label">${t("charts.month")}</span>
            <select class="ts-select" id="chartMonth">${monthOpts}</select></label>
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
        ${planSelectsHtml("settings")}
        <div class="ts-field ts-field--btn">
          <span class="ts-field__label">&nbsp;</span>
          <button type="button" class="btm-btn btm-btn--ghost" id="btnLoad">${t("settings.load")}</button>
            </div>
          </div>
      <p class="btm-meta">${t("settings.previewHint")}</p>
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
  if (!reloadRates && session._settingsLoaded) return true;
  try {
    const data = await apiJson("/api/settings/defaults");
    if (reloadRates || !session.rates) session.rates = data.rates;
    if (reloadRates || !session.schedule) session.schedule = data.schedule;
    if (reloadRates || session.holidays == null) session.holidays = data.holidays;
    if (data.simulate && typeof data.simulate === "object") {
      simulateDefaults = { ...BUILTIN_SIMULATE_DEFAULTS, ...data.simulate };
      // 補齊缺欄；已有值（含使用者改成 0）保留
      session.simulate = normalizeSimulate(session.simulate);
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
  const meta = document.getElementById("timelineMeta");
  if (!box || !meta) return;
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
  const scenario = buildScenarioContracts() || {};
  const kw = Number(scenario.regular_kw || session.contractValues.regular_kw || 0);
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
  sim.touSchedule = seedTouScheduleFromPeriods(key);
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
  sim.touSchedule = seedTouScheduleFromPeriods(sim.simulateTou);
  sim.reserveSchedule = makeSeasonMatrix(defaultReserveHourly);
  sim.includeHalfPeak = false;
  sim.sizingStrategies = [...SIZING_TIER_IDS];
  sim.sizingEnergySeeds = [...ENERGY_SEED_IDS];
  sim.seededImportKey = key;
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
          ${autoOn ? " disabled aria-disabled=\"true\"" : ""} title="${autoOn ? T.scheduleModeHintAuto : T.scheduleEdit}">
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
  const row = simViewRow(base);
  return (row && row.tou_meta) || (base && base.tou_meta) || null;
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
  // 配置檢視只放 TOU；備轉入口在額外收益區
  const touMeta = simTouMetaFromResult(res) || {};
  const touRec = touMeta.recommended_schedule;
  const touAuto = session.simulate.touScheduleMode === "auto" && touRec;
  if (!touAuto) return "";

  const ref = touMeta.halfpeak_ref;
  let touSummary = "";
  if (ref) {
    touSummary = ref.enabled
      ? `<p class="btm-meta">${T.touHalfpeakOn.replace("{pct}", fmt(ref.reserve_soc_pct, 1))}</p>`
      : `<p class="btm-meta">${T.touHalfpeakOff}</p>`;
  }
  return `<div class="sim-report-rec" id="simReportRec">
    <div class="sim-report-rec__item">
      <div class="sim-report-rec__lead">
        <strong>${T.simRecTou}</strong>
        ${touSummary}
      </div>
      <div class="sim-fn-subcard__actions">
        <button type="button" class="btm-btn btm-btn--ghost" data-sched-open-rec="tou">${T.scheduleViewRec}</button>
        <button type="button" class="btm-btn btm-btn--ghost" data-apply-rec-manual="tou">${T.scheduleUseAsManual}</button>
      </div>
    </div>
  </div>`;
}

function simEnergyTransferHtml(res, T, row) {
  const r = row || simViewRow(res);
  const payload = (r && r.energy_transfer) || (res && res.energy_transfer) || null;
  const rows = (payload && payload.rows) || [];
  const baseTou = (payload && payload.baseline_tou) || (res && res.baseline_tou_type) || importPlanTou();
  const simTou = (payload && payload.simulate_tou) || (res && res.simulate_tou_type) || activeSimulateTou();
  const colBefore = `${T.simKwhBefore}<br><span class="btm-meta">${baseTou}</span>`;
  const colAfter = `${T.simKwhAfter}<br><span class="btm-meta">${simTou}</span>`;
  if (!rows.length) {
    return `<section class="sim-view-section" id="simEnergyTransfer">
      <h4 class="sim-view-section__title">${T.simEnergyTransfer}</h4>
      <p class="btm-meta">—</p>
    </section>`;
  }
  const body = rows.map((x) => {
    const pct = x.delta_pct == null ? "—" : `${fmt(x.delta_pct, 1)}%`;
    const dCls = Number(x.delta_kwh) < 0 ? " sim-delta--save" : "";
    const side = x.side || "both";
    const rowCls = side === "both" ? "" : " sim-xfer-row--oneside";
    const sideTag = side === "before_only"
      ? `<span class="btm-chip btm-chip--dim">${T.simXferSideBefore}</span> `
      : side === "after_only"
        ? `<span class="btm-chip btm-chip--dim">${T.simXferSideAfter}</span> `
        : "";
    return `<tr class="${rowCls}">
      <td>${seasonLabel(x.season)}</td>
      <td>${sideTag}${periodLabel(x.period)}</td>
      <td class="num">${fmt(x.before_kwh, 1)}</td>
      <td class="num">${fmt(x.after_kwh, 1)}</td>
      <td class="num${dCls}">${fmt(x.delta_kwh, 1)}</td>
      <td class="num${dCls}">${pct}</td>
    </tr>`;
  }).join("");
  return `<section class="sim-view-section" id="simEnergyTransfer">
    <h4 class="sim-view-section__title">${T.simEnergyTransfer}</h4>
    <div class="btm-table-wrap">
      <table class="btm-table btm-table--dash">
        <thead><tr>
          <th>${t("settings.season")}</th>
          <th>${t("dashboard.item")}</th>
          <th class="num">${colBefore}</th>
          <th class="num">${colAfter}</th>
          <th class="num">${T.simKwhDelta}</th>
          <th class="num">${T.simKwhDeltaPct}</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  </section>`;
}

function renderReserveReportBlock(T, res) {
  /** 備轉月結／事件折疊（併入額外收益區，不另開大卡）。 */
  const s2 = simActiveStage2(res);
  const final = s2 && s2.final;
  const view = final || simViewRow(res) || res;
  const ri = view.reserve_income || res.reserve_income || {};
  const credit = Number(ri.total || 0);
  const hasFn = (res.functions || []).includes("reserve");
  if (!hasFn && credit === 0) return "";

  const monthlyRows = Object.entries(ri.monthly || {}).sort(([a], [b]) => a.localeCompare(b));
  const events = Array.isArray(ri.events) ? ri.events : [];

  const monthTable = monthlyRows.length ? `
    <details class="sim-reserve-fold">
      <summary class="sim-reserve-fold__summary">
        <span>${T.reserveMonthlyTitle}</span>
        <span class="btm-chip btm-chip--dim">${monthlyRows.length}</span>
      </summary>
      <div class="sim-reserve-fold__body">
        <div class="sim-reserve-table-wrap btm-table-wrap">
          <table class="sim-reserve-table btm-table btm-table--dash">
            <thead><tr>
              <th>${T.reserveMonth}</th>
              <th>${T.reserveBidMwh}</th>
              <th>${T.reserveIncomeCap}</th>
              <th>${T.reserveIncomePerf}</th>
              <th>${T.reserveIncomeEnergy}</th>
              <th>${T.reserveIncomeTotal}</th>
            </tr></thead>
            <tbody>${monthlyRows.map(([m, b]) => `<tr>
              <td>${m}</td>
              <td>${fmt(b.bid_mwh, 1)}</td>
              <td>${fmt(b.capacity)}</td>
              <td>${fmt(b.performance)}</td>
              <td>${fmt(b.activation_energy)}</td>
              <td>${fmt(b.total)}</td>
            </tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
    </details>` : "";

  const eventTable = events.length ? `
    <details class="sim-reserve-fold">
      <summary class="sim-reserve-fold__summary">
        <span>${T.reserveEvents}</span>
        <span class="btm-chip btm-chip--dim">${events.length}</span>
      </summary>
      <div class="sim-reserve-fold__body">
        <div class="sim-reserve-table-wrap btm-table-wrap">
          <table class="sim-reserve-table btm-table btm-table--dash">
            <thead><tr>
              <th>${T.reserveEventDate}</th>
              <th>${T.reserveEventBid}</th>
              <th>${T.reserveQuality}</th>
              <th>${T.reserveDeliveredMwh}</th>
              <th>${T.reserveEventResult}</th>
            </tr></thead>
            <tbody>${events.map((e) => {
              const ok = !!e.strict_ok;
              const result = ok
                ? `<span class="sim-reserve-ok">${T.reserveEventOk}</span>`
                : `<span class="sim-reserve-fail">${reserveFailLabel(T, e.fail_reason)}</span>`;
              return `<tr>
                <td>${e.date || e.month || "—"}</td>
                <td>${fmt(e.bid_mw, 1)}</td>
                <td>${fmt(e.official_quality, 2)}</td>
                <td>${fmt((Number(e.delivered_kwh) || 0) / 1000, 3)}</td>
                <td>${result}</td>
              </tr>`;
            }).join("")}</tbody>
          </table>
        </div>
      </div>
    </details>` : "";

  if (!monthTable && !eventTable) return "";
  return `<div class="sim-reserve-folds" id="simReservePanel">${monthTable}${eventTable}</div>`;
}

function scheduleModalConfig(kind, sim, T) {
  if (kind === "tou" || kind === "tou-rec") {
    const res = normalizeSimulateSizeResult(session.lastSimulateSize);
    const tou = (res && res.simulate_tou_type) || activeSimulateTou();
    const recOnly = kind === "tou-rec";
    const matrix = recOnly
      ? (simTouMetaFromResult()?.recommended_schedule || sim.touSchedule)
      : sim.touSchedule;
    return {
      kind: "tou",
      title: recOnly ? `${T.touRecTitle} · ${tou}` : `${T.touTargetSoc} · ${tou}`,
      modeKey: "touScheduleMode",
      schedKey: "touSchedule",
      matrix,
      cfg: {
        header: T.touTargetSoc,
        min: 0,
        max: 100,
        step: 1,
        slotMinutes: touStepMinutes(tou),
        touType: tou,
        readonly: recOnly || sim.touScheduleMode !== "manual",
        viewOnly: recOnly,
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
  const modeChip = (simScheduleModal === "reserve-rec" || simScheduleModal === "tou-rec")
    ? `<span class="btm-chip btm-chip--dim">${T.scheduleAuto}</span>`
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
  // 單一 UI 開關：離峰加額與契約降容評估同步（與 demand tab 連動由事件處理）
  if (document.querySelector('[data-sim-check="autoAdjustOffPeakContract"]')) {
    sim.evaluateContractReduction = !!sim.autoAdjustOffPeakContract;
  }
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
  const picked = [...document.querySelectorAll('[name="sizingStrategies"]:checked')].map((el) => el.value);
  sim.sizingStrategies = normalizeSizingStrategies(picked);
  const energyPicked = [...document.querySelectorAll('[name="sizingEnergySeeds"]:checked')].map((el) => el.value);
  // 電量面向 checkbox 已渲染時才覆寫；否則保留 session
  if (document.querySelector('[name="sizingEnergySeeds"]')) {
    sim.sizingEnergySeeds = normalizeEnergySeeds(energyPicked);
  } else if (!Array.isArray(sim.sizingEnergySeeds)) {
    sim.sizingEnergySeeds = [...ENERGY_SEED_IDS];
  }
  const halfPeak = document.querySelector('[name="includeHalfPeak"]:checked');
  if (halfPeak) sim.includeHalfPeak = halfPeak.value === "1";
  if (activeSimulateTou() !== "ThreeStage") sim.includeHalfPeak = false;
  persistSession();
}

function syncDemandAutoContract(sim, source) {
  /** 外層契約容量（demand）與內層自動調整同開同關。 */
  if (source === "demand") {
    const on = (sim.functions || []).includes("demand");
    sim.autoAdjustOffPeakContract = on;
    sim.evaluateContractReduction = on;
    return;
  }
  if (source === "auto") {
    const on = !!(sim.autoAdjustOffPeakContract || sim.evaluateContractReduction);
    sim.autoAdjustOffPeakContract = on;
    sim.evaluateContractReduction = on;
    const rest = (sim.functions || []).filter((f) => f !== "tou" && f !== "demand");
    sim.functions = on ? ["tou", ...rest, "demand"] : ["tou", ...rest];
    return;
  }
  const on = !!(sim.autoAdjustOffPeakContract || sim.evaluateContractReduction)
    || (sim.functions || []).includes("demand");
  sim.autoAdjustOffPeakContract = on;
  sim.evaluateContractReduction = on;
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
    const title = largeBlocked ? ` title="${T.simLargeUserDisabled}"` : "";
    return `<button type="button" class="sim-tab${active}${dimmed}" data-tab="${id}" role="tab"${title}${largeBlocked ? " aria-disabled=\"true\"" : ""}>
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
  if (simViewContext === "full") {
    const s2 = simStage2At(res, base);
    if (s2) return simMergeStage2Row(base, s2);
  }
  return base;
}

function simViewBillRow(res) {
  return simViewRow(res);
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
    out.savings = full.savings;
    out.bill_savings = full.bill_savings;
    out.after = full.after;
    out.final = full.final;
    out.proposal = full.proposal;
    out.reserve_income = full.reserve_income;
    out.reserve_meta = full.reserve_meta;
    out.tou_meta = full.tou_meta;
    out.energy_transfer = full.energy_transfer;
    out.dispatch_charts = full.dispatch_charts || out.dispatch_charts;
  } else if (recKey && out.stage2ByKey[recKey]) {
    out.stage2 = out.stage2ByKey[recKey];
    const recS2 = out.stage2ByKey[recKey];
    if (recS2.benefit_split) out.benefit_split = recS2.benefit_split;
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
  const r = row || simViewBillRow(res);
  if (!r) return `<p class="btm-meta">—</p>`;
  const before = res.before || {};
  const ri = (r.reserve_income && r.reserve_income.total != null)
    ? r.reserve_income
    : (res.reserve_income || {});
  const credit = Number(ri.total || 0);
  const showReserve = simViewContext === "full" && simHasFullContext(res)
    && ((res.functions || []).includes("reserve") || credit !== 0);
  const after = {
    basic_total: r.after_basic_total,
    overage_total: r.after_overage_total,
    energy_total: r.after_energy_total,
    total: r.after_total,
  };
  const afterNet = Number(after.total || 0) - credit;
  const beforeTotal = Number(before.total || 0);
  const delta = {
    basic_total: Number(after.basic_total || 0) - Number(before.basic_total || 0),
    overage_total: Number(after.overage_total || 0) - Number(before.overage_total || 0),
    energy_total: Number(after.energy_total || 0) - Number(before.energy_total || 0),
    total: Number(after.total || 0) - beforeTotal,
    net: afterNet - beforeTotal,
  };
  const afterLabel = showReserve
    ? T.reserveNetAfter
    : (simViewContext === "sizing" ? (T.simBillSizingOnly || T.simKpiAfter) : T.simKpiAfter);
  const rows = [
    [t("dashboard.basic"), before.basic_total, after.basic_total, delta.basic_total],
    [t("dashboard.overage"), before.overage_total, after.overage_total, delta.overage_total],
    [t("dashboard.energy"), before.energy_total, after.energy_total, delta.energy_total],
    [t("dashboard.total"), before.total, after.total, delta.total],
  ];
  if (showReserve) {
    rows.push([T.reserveCredit, 0, -credit, -credit]);
    rows.push([T.reserveNetAfter, before.total, afterNet, delta.net]);
  }
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
        <th class="num">${afterLabel}</th>
        <th class="num">Δ</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
}

function clearSimCompareBill() {
  simCompareLoadId += 1;
  simCompareBill = null;
  simCompareKey = null;
  simCompareFetch = null;
}

function simCompareCacheKey(res, row) {
  if (!res || !row) return null;
  const s2 = simViewContext === "full" ? simStage2At(res, row) : null;
  const adopted = (s2 && s2.final && s2.final.stage2_contracts) || null;
  return [
    session.simulateResultKey || "",
    simViewContext,
    Number(row.pcs_kw),
    Number(row.batt_kwh),
    adopted ? JSON.stringify(adopted) : "scenario",
  ].join("|");
}

function monthBillSubtotal(m) {
  if (!m) return 0;
  if (m.bill_total != null) return Number(m.bill_total) || 0;
  const basic = m.basic_total != null ? m.basic_total : m.total;
  const over = (m.overage && m.overage.total) || 0;
  const energy = (m.energy && m.energy.total) || 0;
  return Number(basic || 0) + Number(over || 0) + Number(energy || 0);
}

function simCompareDeltaCell(d) {
  return `<td class="num${Number(d) < 0 ? " sim-delta--save" : ""}">${fmt(d)}</td>`;
}

function simCompareDeltaTotalsHtml(base, scheme, T, credit) {
  const rows = [
    [t("dashboard.basic"), base.basic_total, scheme.basic_total],
    [t("dashboard.overage"), base.overage_total, scheme.overage_total],
    [t("dashboard.energy"), base.energy_total, scheme.energy_total],
    [t("dashboard.total"), base.total, scheme.total],
  ];
  if (Number(credit || 0) !== 0) {
    const net = Number(scheme.total || 0) - Number(credit);
    rows.push([T.reserveCredit, 0, -Number(credit)]);
    rows.push([T.simCompareNet || T.simBillNet, base.total, net]);
  }
  const body = rows.map(([label, b, a]) => {
    const d = Number(a || 0) - Number(b || 0);
    return `<tr>
      <td>${label}</td>
      <td class="num">${fmt(b)}</td>
      <td class="num">${fmt(a)}</td>
      ${simCompareDeltaCell(d)}
    </tr>`;
  }).join("");
  return `<div class="btm-table-wrap">
    <table class="btm-table btm-table--dash">
      <thead><tr>
        <th>${t("dashboard.item")}</th>
        <th class="num">${T.simCompareBaseline}</th>
        <th class="num">${T.simCompareScheme}</th>
        <th class="num">Δ</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
}

function simCompareDeltaMonthsHtml(base, scheme, T) {
  const map = new Map();
  for (const m of base.months || []) {
    map.set(String(m.month), { base: m, scheme: null });
  }
  for (const m of scheme.months || []) {
    const key = String(m.month);
    const cur = map.get(key) || { base: null, scheme: null };
    cur.scheme = m;
    map.set(key, cur);
  }
  const keys = [...map.keys()].sort();
  if (!keys.length) return `<p class="btm-meta">—</p>`;
  const body = keys.map((month) => {
    const { base: bm, scheme: sm } = map.get(month);
    const bb = monthBillSubtotal(bm);
    const ss = monthBillSubtotal(sm);
    return `<tr>
      <td>${month}</td>
      <td class="num">${fmt(bb)}</td>
      <td class="num">${fmt(ss)}</td>
      ${simCompareDeltaCell(ss - bb)}
    </tr>`;
  }).join("");
  return `<div class="btm-table-wrap btm-table-wrap--tall">
    <table class="btm-table btm-table--dash">
      <thead><tr>
        <th>${t("dashboard.monthCol")}</th>
        <th class="num">${T.simCompareBaseline}</th>
        <th class="num">${T.simCompareScheme}</th>
        <th class="num">Δ</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
}

function simCompareSingleBillHtml(bill, T) {
  if (!bill) return `<p class="btm-meta">—</p>`;
  return `<div class="sim-compare-single">
    ${billSummaryHtml(bill)}
    <h3 class="btm-section-title">${T.simCompareMonths || t("dashboard.months")}</h3>
    ${billMonthsHtml(bill)}
  </div>`;
}

function simCompareViewTabsHtml(T) {
  const opts = [
    ["delta", T.simCompareDelta],
    ["baseline", T.simCompareBaseline],
    ["scheme", T.simCompareScheme],
  ];
  return `<div class="btm-seg sim-compare-tabs" role="tablist" aria-label="${T.simCompareReport}">
    ${opts.map(([id, label]) => {
      const on = simCompareView === id;
      return `<button type="button" class="btm-seg__btn${on ? " btm-seg__btn--active" : ""}"
        data-sim-compare-view="${id}" role="tab" aria-selected="${on ? "true" : "false"}">${label}</button>`;
    }).join("")}
  </div>`;
}

function simBillCompareReportHtml(T, payload, { loading = false, err = null } = {}) {
  const shell = (inner) => `<section class="btm-card hud-panel hud-frame sim-report sim-compare-report" id="simBillCompareReport">${inner}</section>`;
  if (loading) {
    return shell(`<h2 class="btm-card__title seetel-title">${T.simCompareReport}</h2>${busyBlockHtml(T.simCompareLoading)}`);
  }
  if (err) {
    return shell(`<h2 class="btm-card__title seetel-title">${T.simCompareReport}</h2>
      <p class="btm-meta btm-meta--err">${T.simCompareErr}: ${err}</p>`);
  }
  if (!payload || !payload.baseline || !payload.scheme) {
    return shell(`<h2 class="btm-card__title seetel-title">${T.simCompareReport}</h2><p class="btm-meta">—</p>`);
  }
  const base = payload.baseline;
  const scheme = payload.scheme;
  const credit = Number((payload.reserve_income && payload.reserve_income.total) || 0);
  let body = "";
  if (simCompareView === "baseline") {
    body = simCompareSingleBillHtml(base, T);
  } else if (simCompareView === "scheme") {
    body = simCompareSingleBillHtml(scheme, T);
  } else {
    body = `${simCompareDeltaTotalsHtml(base, scheme, T, credit)}
      <h3 class="btm-section-title">${T.simCompareMonths || t("dashboard.months")}</h3>
      ${simCompareDeltaMonthsHtml(base, scheme, T)}`;
  }
  return shell(`
    <div class="sim-compare-report__head">
      <h2 class="btm-card__title seetel-title">${T.simCompareReport}</h2>
      ${simCompareViewTabsHtml(T)}
    </div>
    <div class="sim-compare-report__body">${body}</div>
  `);
}

function syncSimReportKpisFromCompare(payload, res) {
  const host = document.getElementById("simReportKpis");
  if (!host || !res) return;
  const T = I18N[locale].simulate;
  const r = simSizingRow(res) || simViewBillRow(res) || (res.grid || [])[0];
  if (!r) return;
  const days = (payload && payload.baseline && billSpanDays(payload.baseline)) || simReportDays();
  const beforeTotal = payload && payload.baseline && payload.baseline.total != null
    ? Number(payload.baseline.total)
    : Number((res.before && res.before.total) || 0);
  const afterBill = Number(
    r.after_total != null ? r.after_total : (res.after && res.after.total),
  ) || 0;
  const split = res.benefit_split || (res.stage2 && res.stage2.benefit_split) || null;
  const billSave = r.bill_savings != null ? r.bill_savings : (beforeTotal - afterBill);
  const sizingSave = split && split.sizing_savings != null ? split.sizing_savings : billSave;
  const viable = !!res.viable;
  const sizeLabel = viable ? T.simKpiSize : T.simTagBest;
  const savePct = r.savings_pct != null
    ? r.savings_pct
    : (beforeTotal > 0 ? (100 * sizingSave / beforeTotal) : 0);
  host.outerHTML = simReportKpisHtml(T, res, {
    beforeTotal,
    afterBill,
    sizingSave,
    savePct,
    sizeLabel,
    viable,
    row: r,
    days,
  });
}

function bindSimCompareReport(res, T) {
  document.querySelectorAll("[data-sim-compare-view]").forEach((btn) => {
    btn.onclick = () => {
      const next = btn.dataset.simCompareView;
      if (!next || next === simCompareView) return;
      simCompareView = next;
      const el = document.getElementById("simBillCompareReport");
      if (el && simCompareBill) {
        el.outerHTML = simBillCompareReportHtml(T, simCompareBill);
        bindSimCompareReport(res, T);
      }
    };
  });
}

async function ensureSimCompareBill(res, T) {
  const row = simViewBillRow(res) || simViewRow(res);
  const host = document.getElementById("simBillCompareReport");
  if (!host || !row || !session.importId) return;
  const key = simCompareCacheKey(res, row);
  if (!key) return;
  if (simCompareBill && simCompareKey === key) {
    host.outerHTML = simBillCompareReportHtml(T, simCompareBill);
    bindSimCompareReport(res, T);
    syncSimReportKpisFromCompare(simCompareBill, res);
    return;
  }
  if (simCompareFetch && simCompareKey === key) {
    host.outerHTML = simBillCompareReportHtml(T, null, { loading: true });
    return;
  }
  const loadId = ++simCompareLoadId;
  simCompareKey = key;
  host.outerHTML = simBillCompareReportHtml(T, null, { loading: true });
  readSimulateForm();
  await ensureSettingsLoaded();
  const fd = new FormData();
  fd.append("import_id", session.importId);
  if (!appendSimulateContractFields(fd)) {
    const el = document.getElementById("simBillCompareReport");
    if (el) el.outerHTML = simBillCompareReportHtml(T, null, { err: t("import.needSchema") });
    return;
  }
  const s2Active = simActiveStage2(res);
  const finalRow = (s2Active && s2Active.final)
    || (res.stage2 && res.stage2.final)
    || res.final
    || null;
  const adopted = (simViewContext === "full" && finalRow && finalRow.stage2_contracts)
    ? finalRow.stage2_contracts
    : null;
  if (adopted) fd.append("scheme_contracts", JSON.stringify(adopted));
  fd.append("simulate", JSON.stringify({ ...session.simulate }));
  fd.append("pcs_kw", String(row.pcs_kw));
  fd.append("batt_kwh", String(row.batt_kwh));
  appendOverrides(fd);
  simCompareFetch = apiJson("/api/simulate/compare-bill", { method: "POST", body: fd })
    .then((data) => {
      if (loadId !== simCompareLoadId) return null;
      simCompareBill = data;
      simCompareKey = key;
      return data;
    })
    .catch((err) => {
      if (loadId !== simCompareLoadId) return null;
      simCompareBill = null;
      throw err;
    })
    .finally(() => {
      if (loadId === simCompareLoadId) simCompareFetch = null;
    });
  try {
    const data = await simCompareFetch;
    if (loadId !== simCompareLoadId) return;
    const el = document.getElementById("simBillCompareReport");
    if (el) {
      el.outerHTML = simBillCompareReportHtml(T, data);
      bindSimCompareReport(res, T);
    }
    syncSimReportKpisFromCompare(data, res);
  } catch (err) {
    if (loadId !== simCompareLoadId) return;
    const el = document.getElementById("simBillCompareReport");
    if (el) el.outerHTML = simBillCompareReportHtml(T, null, { err: String(err.message || err) });
  }
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

function simUnitSavings(row) {
  const batt = Number(row?.batt_kwh) || 0;
  if (batt <= 0) return 0;
  return Number(row.savings || 0) / batt;
}

function simPcsUtilPct(row) {
  const parts = row?.engineering_score_parts;
  if (parts && parts.pcs_util_avg != null && Number.isFinite(Number(parts.pcs_util_avg))) {
    return Number(parts.pcs_util_avg);
  }
  const vals = [row?.pcs_daily_avg_pct_summer, row?.pcs_daily_avg_pct_non_summer]
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v));
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function simMapLegendHtml(T) {
  return `<div class="sim-map-legend" aria-hidden="true">
    <span class="sim-map-legend__item"><i class="sim-map-legend__swatch sim-map-legend__swatch--best"></i>${T.simMapBest || T.simViewRec}</span>
    <span class="sim-map-legend__item"><i class="sim-map-legend__swatch sim-map-legend__swatch--size"></i>${T.simMapLegendSize}</span>
    <span class="sim-map-legend__item"><i class="sim-map-legend__swatch sim-map-legend__swatch--color"></i>${T.simMapLegendColor}</span>
    <span class="sim-map-legend__item">${T.simMapLegendMarks}</span>
  </div>`;
}

function simViewWhyHtml(res, T) {
  const mode = simViewMode;
  const row = simViewRow(res, mode) || simSizingRow(res);
  if (!row) return "";
  let reason = "";
  let title = T.simViewRec;
  if (mode === "max_savings") {
    reason = T.simReasonMaxSave;
    title = T.simViewMaxSave;
  } else if (mode === "max_util") {
    reason = T.simReasonMaxUtil;
    title = T.simViewMaxUtil;
  }
  const parts = row.engineering_score_parts || {};
  const detail = mode === "recommended" && parts.cycle_util_avg != null
    ? `<span class="sim-view-why__parts">${T.simSavings} ${fmt(parts.savings)} · ${T.simDailyCycle} ${fmt(parts.cycle_util_avg, 1)}%</span>`
    : `<span class="sim-view-why__parts">${T.simConfigPcs} ${fmt(row.pcs_kw, 0)} kW · ${T.simConfigBatt} ${fmt(row.batt_kwh, 0)} kWh · ${T.simSavings} ${fmt(row.savings)}</span>`;
  return `<div class="sim-view-why" id="simViewWhy">
    <div class="sim-view-why__lead">
      <span class="btm-chip btm-chip--on">${T.simWhyTitle}</span>
      <strong>${title}</strong>
      ${reason ? `<span class="btm-meta">${reason}</span>` : ""}
    </div>
    ${detail}
  </div>`;
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
  const pcsVals = gridRows.map((r) => Math.max(0, Number(r.pcs_kw) || 0));
  const pcsMin = Math.min(...pcsVals);
  const pcsMax = Math.max(...pcsVals);
  const bubbleSize = (pcs) => {
    if (!(pcsMax > pcsMin)) return 18;
    return 12 + 30 * ((Math.max(0, pcs) - pcsMin) / (pcsMax - pcsMin));
  };
  const utilColor = (pct) => {
    const t = Math.max(0, Math.min(1, Number(pct) / 100));
    const r = Math.round(36 + 50 * t);
    const g = Math.round(100 + 110 * t);
    const b = Math.round(170 + 60 * t);
    return `rgb(${r} ${g} ${b})`;
  };
  const xyOf = (row) => [Number(row.savings) || 0, Number(row.batt_kwh) || 0];

  const data = gridRows.map((p) => {
    const util = simPcsUtilPct(p);
    const isRec = !!p.recommended;
    return {
      value: xyOf(p),
      symbolSize: bubbleSize(Number(p.pcs_kw) || 0) * (isRec ? 1.18 : 1),
      itemStyle: {
        color: isRec ? "#34d399" : utilColor(util),
        opacity: isRec ? 0.96 : 0.78,
        borderColor: isRec ? "#ecfdf5" : "transparent",
        borderWidth: isRec ? 2 : 0,
        shadowBlur: isRec ? 14 : 0,
        shadowColor: isRec ? "rgba(52,211,153,0.45)" : "transparent",
      },
      row: p,
    };
  });

  const markPoint = { data: [], label: { fontSize: 11, fontWeight: 700 } };
  const rec = gridRows.find((r) => r.recommended);
  const be = gridRows.find((r) => r.best_effort);
  const mu = gridRows.find((r) => r.max_util);
  const recKey = simRowChartKey(rec);
  if (rec) {
    markPoint.data.push({
      name: T.simMapBest || T.simViewRec,
      coord: xyOf(rec),
      symbol: "pin",
      symbolSize: 60,
      itemStyle: { color: "#34d399", shadowBlur: 16, shadowColor: "rgba(52,211,153,0.55)" },
      label: { color: "#052e1a", formatter: T.simMapBest || T.simViewRec },
      mode: "recommended",
    });
  }
  if (be && simRowChartKey(be) !== recKey) {
    markPoint.data.push({
      name: T.simViewMaxSave,
      coord: xyOf(be),
      symbol: "pin",
      symbolSize: 44,
      itemStyle: { color: "#fbbf24" },
      label: { color: "#1c1400", formatter: T.simViewMaxSave },
      mode: "max_savings",
    });
  }
  if (mu && simRowChartKey(mu) !== recKey && simRowChartKey(mu) !== simRowChartKey(be)) {
    markPoint.data.push({
      name: T.simViewMaxUtil,
      coord: xyOf(mu),
      symbol: "pin",
      symbolSize: 44,
      itemStyle: { color: "#a78bfa" },
      label: { color: "#1a1028", formatter: T.simViewMaxUtil },
      mode: "max_util",
    });
  }

  simSavingsChart = echarts.init(el);
  simSavingsChart.setOption({
    ...ECHART_NO_ANIM,
    backgroundColor: "transparent",
    grid: {
      left: "4%",
      right: "4%",
      top: "12%",
      bottom: "10%",
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
          row.recommended ? (T.simMapBest || T.simViewRec) : null,
          row.best_effort ? T.simViewMaxSave : null,
          row.max_util ? T.simViewMaxUtil : null,
        ].filter(Boolean).join(" · ");
        return `${tags ? `<b style="color:#5eeaff">${tags}</b><br>` : ""}`
          + `${T.simMapAxisSave}: <b>${fmt(row.savings)}</b><br>`
          + `${T.simMapAxisBatt || T.simConfigBatt}: <b>${fmt(row.batt_kwh, 0)}</b> kWh<br>`
          + `${T.simConfigPcs}: ${fmt(row.pcs_kw, 0)} kW · ${T.simHours} ${fmt(row.hours, 1)}<br>`
          + `${T.simChartPcsUtil}: ${fmt(simPcsUtilPct(row), 1)}%<br>`
          + `${T.simBattBenefit || T.simChartUnitSavings}: ${fmt(simUnitSavings(row), 1)}`;
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
      markPoint,
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
    const panel = document.getElementById("simViewPanel");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
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
    simViewContext = "sizing";
  }
  const rec = res?.recommended || res?.best_effort;
  const base = simRowChartKey(rec);
  const sizingCharts = res?.sizing_dispatch_charts || (
    simHasFullContext(res, rec) ? null : res?.dispatch_charts
  );
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
  const k = key
    || simDispatchChartKey
    || simChartCacheKey(row, simViewContext)
    || simRowChartKey(row);
  if (k && simDispatchChartCache[k]) return simDispatchChartCache[k];
  // 後備：同 pcs/batt 無 context 後綴
  const base = simRowChartKey(row);
  if (base && simDispatchChartCache[base]) return simDispatchChartCache[base];
  if (simViewContext === "full") {
    const s2 = simActiveStage2(res);
    if (s2 && s2.final && s2.final.dispatch_charts) return s2.final.dispatch_charts;
  }
  if (simViewContext === "sizing" && res?.sizing_dispatch_charts) {
    return res.sizing_dispatch_charts;
  }
  return res?.dispatch_charts || null;
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

async function fetchSimDispatchChartRow(row, T) {
  if (!row) return null;
  const key = simRowChartKey(row);
  if (!key) return null;
  if (simDispatchChartCache[key]) return key;
  if (simDispatchChartPending[key]) return simDispatchChartPending[key];
  if (!session.importId) throw new Error(T.simErr);
  const resultKey = session.simulateResultKey;
  let request;
  request = (async () => {
    try {
      const fd = new FormData();
      fd.append("import_id", session.importId);
      if (!appendSimulateContractFields(fd)) throw new Error(T.simErr);
      fd.append("simulate", JSON.stringify(session.simulate));
      fd.append("pcs_kw", String(row.pcs_kw));
      fd.append("batt_kwh", String(row.batt_kwh));
      appendOverrides(fd);
      const data = await apiJson("/api/simulate/dispatch-charts", { method: "POST", body: fd });
      if (resultKey !== session.simulateResultKey) return key;
      const charts = data && data.charts;
      if (charts) {
        simDispatchChartCache[key] = charts;
        if (data.key && data.key !== key) simDispatchChartCache[data.key] = charts;
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
  return `${fmt(row.pcs_kw, 0)} kW · ${fmt(row.batt_kwh, 0)} kWh
    <br>${T.simSavings} ${fmt(row.savings)} · ${T.simChartPcsUtil} ${fmt(simPcsUtilPct(row), 1)}%`;
}

function simViewTabsHtml(res, T) {
  if (simViewContext === "full" && simHasFullContext(res)) {
    return "";
  }
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

function simViewContextHtml(res, T) {
  if (!simHasFullContext(res)) return "";
  const opts = [
    { id: "sizing", label: T.simDispatchSizing },
    { id: "full", label: T.simDispatchFull },
  ];
  return `<div class="btm-seg sim-view-context" role="tablist" aria-label="${T.simViewPanel}">
    ${opts.map((o) => {
      const on = simViewContext === o.id;
      return `<button type="button" class="btm-seg__btn${on ? " btm-seg__btn--active" : ""}"
        data-view-ctx="${o.id}" role="tab" aria-selected="${on ? "true" : "false"}">${o.label}</button>`;
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
  return `<div class="sim-dispatch-toolbar sim-dispatch-filter-group">
    <div class="sim-dispatch-toolbar__lead">
      <span class="sim-dispatch-toolbar__title">${T.simDispatchFilter}</span>
      <span class="sim-dispatch-toolbar__hint">${T.simDispatchFilterHint}</span>
    </div>
    <div class="sim-dispatch-toolbar__controls">
      <label class="ts-field"><span class="ts-field__label">${t("settings.season")}</span>
        <select class="ts-select" id="simDispatchSeason">${sOpts}</select></label>
      <label class="ts-field"><span class="ts-field__label">${t("settings.day")}</span>
        <select class="ts-select" id="simDispatchDay">${dOpts}</select></label>
      <label class="ts-field"><span class="ts-field__label">${T.simDispatchMonth}</span>
        <select class="ts-select" id="simDispatchMonth">${simDispatchMonthOptions(dc, T)}</select></label>
      <label class="ts-field"><span class="ts-field__label">${T.simDispatchMetric}</span>
        <select class="ts-select" id="simDispatchMetric">${mOpts}</select></label>
    </div>
  </div>`;
}

function simViewPanelHtml(res, T) {
  if (!simViewRow(res, "max_savings") && !res?.dispatch_charts && !res?.sizing_dispatch_charts) return "";
  const row = simViewBillRow(res);
  const dc = simDispatchChartsForKey(res) || (
    simViewContext === "full" ? res.dispatch_charts : (res.sizing_dispatch_charts || res.dispatch_charts)
  ) || null;
  return `<section class="sim-view-panel btm-card hud-panel hud-frame" id="simViewPanel">
    <h3 class="btm-subhead sim-view-panel__title">${T.simViewPanel}</h3>
    ${simViewTabsHtml(res, T)}
    <div id="simViewWhySlot">${simViewWhyHtml(res, T)}</div>
    ${simViewContextHtml(res, T)}
    <div id="simViewRecSlot">${renderReportRecSchedules(T, res)}</div>
    ${simEnergyTransferHtml(res, T, row)}
    <div class="sim-view-section">
      <h4 class="sim-view-section__title">${T.simDispatchCharts}</h4>
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
          <div id="simDispatchBoxplot" class="sim-dispatch-chart"></div>
        </section>
      </div>
      <div id="simDispatchGridDay" class="sim-dispatch-grid sim-dispatch-grid--day">
        <section class="sim-dispatch-panel sim-dispatch-panel--wide">
          <h5 class="sim-dispatch-panel__title">${T.simDispatchDayProfile}
            <span class="sim-dispatch-panel__hint">${T.simDispatchDayProfileHint}</span></h5>
          <div id="simDayProfileChart" class="sim-dispatch-chart sim-dispatch-chart--tall"></div>
          <div class="sim-dispatch-day-scrub" id="simDayScrub">
            <button type="button" class="btm-btn btm-btn--ghost sim-dispatch-day-scrub__btn" id="simDayPrev" aria-label="prev">‹</button>
            <input type="range" class="sim-dispatch-day-scrub__range" id="simDaySlider" min="0" max="0" value="0" step="1">
            <button type="button" class="btm-btn btm-btn--ghost sim-dispatch-day-scrub__btn" id="simDayNext" aria-label="next">›</button>
            <span class="sim-dispatch-day-scrub__label" id="simDayLabel">—</span>
          </div>
        </section>
      </div>
    </div>
  </section>`;
}

function bindSimViewRecActions(root, res) {
  (root || document).querySelectorAll("[data-sched-open-rec]").forEach((el) => {
    el.addEventListener("click", () => {
      const kind = el.dataset.schedOpenRec || "reserve";
      simScheduleModal = kind === "tou" ? "tou-rec" : "reserve-rec";
      syncScheduleModalHost();
    });
  });
  (root || document).querySelectorAll("[data-apply-rec-manual]").forEach((el) => {
    el.addEventListener("click", () => {
      const kind = el.dataset.applyRecManual;
      if (kind === "reserve") {
        const rec = simReserveMetaFromResult(res)?.recommended_schedule;
        if (!rec) return;
        session.simulate.reserveScheduleMode = "manual";
        session.simulate.reserveSchedule = normalizeScheduleMatrix(rec, defaultReserveHourly);
        session.simulate.detailTab = "reserve";
      } else if (kind === "tou") {
        const rec = simTouMetaFromResult(res)?.recommended_schedule;
        if (!rec) return;
        session.simulate.touScheduleMode = "manual";
        session.simulate.touSchedule = normalizeScheduleMatrix(rec, () => defaultTouSlots(activeSimulateTou()));
        session.simulate.detailTab = "tou";
      } else return;
      persistSession();
      renderPage({ animate: false, preserveScroll: true });
    });
  });
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
      const title = panel.querySelector(".sim-view-panel__title");
      if (title) {
        const tmp = document.createElement("div");
        tmp.innerHTML = tabsHtml;
        title.insertAdjacentElement("afterend", tmp.firstElementChild);
      }
    }

    const whySlot = document.getElementById("simViewWhySlot");
    if (whySlot) whySlot.innerHTML = simViewWhyHtml(res, T);

    const ctxHtml = simViewContextHtml(res, T);
    const ctxHost = panel.querySelector(".sim-view-context");
    if (ctxHost && ctxHtml) {
      const tmp = document.createElement("div");
      tmp.innerHTML = ctxHtml;
      if (tmp.firstElementChild) ctxHost.replaceWith(tmp.firstElementChild);
    } else if (ctxHost && !ctxHtml) {
      ctxHost.remove();
    } else if (!ctxHost && ctxHtml) {
      const anchor = document.getElementById("simViewWhySlot")
        || panel.querySelector(".sim-view-tabs")
        || panel.querySelector(".sim-view-panel__title");
      if (anchor) {
        const tmp = document.createElement("div");
        tmp.innerHTML = ctxHtml;
        if (tmp.firstElementChild) anchor.insertAdjacentElement("afterend", tmp.firstElementChild);
      }
    }
  }
  document.querySelectorAll(".sim-view-tab").forEach((btn) => {
    btn.onclick = () => setSimViewMode(btn.dataset.mode, res, T);
  });
  document.querySelectorAll("[data-view-ctx]").forEach((btn) => {
    btn.onclick = () => setSimViewContext(btn.dataset.viewCtx, res, T);
  });

  const billEl = document.getElementById("simBillCompare");
  if (billEl) billEl.innerHTML = simBillCompareHtml(res, T, row);
  const etHost = document.getElementById("simEnergyTransfer");
  if (etHost) {
    const tmp = document.createElement("div");
    tmp.innerHTML = simEnergyTransferHtml(res, T, row);
    if (tmp.firstElementChild) etHost.replaceWith(tmp.firstElementChild);
  }
  const recSlot = document.getElementById("simViewRecSlot");
  if (recSlot) {
    // TOU 推薦排程屬量體；備轉入口在額外收益（僅推薦）
    recSlot.innerHTML = renderReportRecSchedules(T, res);
    bindSimViewRecActions(recSlot, res);
  }

  const controls = [
    ...document.querySelectorAll(".sim-view-tab"),
    ...document.querySelectorAll("[data-view-ctx]"),
  ];
  controls.forEach((b) => { b.disabled = true; });
  try {
    await ensureSimDispatchCharts(res, T);
  } finally {
    controls.forEach((b) => { b.disabled = false; });
  }
}

async function setSimViewMode(mode, res, T) {
  if (!mode || simViewMode === mode) return;
  const keepFull = simViewContext === "full";
  simViewMode = mode;
  // 該點尚無 stage2 時不能停在 full
  if (simViewContext === "full" && !simHasFullContext(res, simViewBaseRow(res, mode))) {
    simViewContext = "sizing";
  }
  clearSimCompareBill();
  let live = normalizeSimulateSizeResult(session.lastSimulateSize) || res;
  live = await ensureStage2ForView(live, T);
  if (keepFull && simHasFullContext(live)) simViewContext = "full";
  await refreshSimViewPanel(live, T);
  refreshSimReportHead(live, T);
  await ensureSimCompareBill(live, T);
}

async function setSimViewContext(ctx, res, T) {
  if (ctx !== "sizing" && ctx !== "full") return;
  if (simViewContext === ctx) return;
  if (ctx === "full" && !simHasFullContext(res, simViewBaseRow(res))) return;
  simViewContext = ctx;
  clearSimCompareBill();
  const live = normalizeSimulateSizeResult(session.lastSimulateSize) || res;
  await refreshSimViewPanel(live, T);
  refreshSimReportHead(live, T);
  await ensureSimCompareBill(live, T);
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

async function fetchSimulateFullForRow(stageRes, row, T) {
  if (!session.importId || !stageRes || !stageRes.stage1_key || !row) {
    return stageRes;
  }
  const fd = new FormData();
  fd.append("import_id", session.importId);
  if (!appendSimulateContractFields(fd)) return stageRes;
  fd.append("simulate", JSON.stringify(session.simulate));
  fd.append("stage1_key", String(stageRes.stage1_key));
  fd.append("pcs_kw", String(row.pcs_kw));
  fd.append("batt_kwh", String(row.batt_kwh));
  appendOverrides(fd);

  simulateFullFetch = apiJson("/api/simulate/full", { method: "POST", body: fd });
  if (parseRoute() === ROUTES.SIMULATE && T) {
    refreshSimReportHead(stageRes, T);
  }
  try {
    const full = await simulateFullFetch;
    session._simFullError = null;
    const merged = simMergeFullResult(stageRes, full);
    session.lastSimulateSize = merged;
    persistSession();
    seedSimDispatchCache(merged);
    return merged;
  } finally {
    simulateFullFetch = null;
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
  const host = document.getElementById("simReportHead");
  if (!host || !res) return;
  const html = simReportHeadHtml(T || I18N[locale].simulate, res);
  if (!html) return;
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  if (tmp.firstElementChild) {
    host.replaceWith(tmp.firstElementChild);
    const head = document.getElementById("simReportHead");
    if (head) bindSimViewRecActions(head, res);
    document.getElementById("btnSimulateFullRetry")?.addEventListener("click", () => {
      retrySimulateFullStep();
    });
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
  const rng = dc?.ranges?.[metric] || {};
  const { dates, idxs } = simDispatchFilteredIndices(dc);
  const keepDates = idxs.map((i) => dates[i]);
  const keepValues = idxs.map((i) => (hm.values || [])[i] || []);
  const filtered = { dates: keepDates, values: keepValues };
  const base = heatmapOption({ heatmap: filtered, kW: rng });
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
  document.querySelectorAll("[data-view-ctx]").forEach((btn) => {
    btn.onclick = () => setSimViewContext(btn.dataset.viewCtx, res, T);
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
  simulateSampleJob += 1;
  simulateFetch = null;
  simulateFullFetch = null;
  simulateSampleFetch = null;
  simPinnedRun = null;
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
  clearSimCompareBill();
  persistSession();
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
  const runLabel = hasResult ? T.simRerun : T.run;
  const exportLabel = exporting ? T.simExporting : T.simExportXlsx;
  const exportBtn = hasResult && viewRow
    ? `<button type="button" class="btm-btn btm-btn--ghost" id="btnSimulateExport"${busy ? " disabled" : ""}>${exportLabel}</button>`
    : "";
  const clearBtn = hasResult || running
    ? `<button type="button" class="btm-btn btm-btn--ghost" id="btnSimulateClear"${busy ? " disabled" : ""}>${T.simClearResult}</button>`
    : "";
  const metaHtml = metaMsg
    ? `<p class="btm-meta${metaErr ? " btm-meta--err" : ""}" id="simMeta">${metaMsg}</p>`
    : `<p class="btm-meta btm-meta--hidden" id="simMeta" hidden></p>`;

  return `<div class="sim-run-bar">
    <div class="sim-run-bar__actions">
      ${exportBtn}
      <button type="button" class="btm-btn btm-btn--primary" id="btnSimulate"${busy ? " disabled" : ""}>${runLabel}</button>
      ${clearBtn}
    </div>
    ${metaHtml}
  </div>`;
}

function renderSimResultsBlock(T) {
  return `<div class="sim-results">
    ${renderSimStrategySection(T, session.simulate)}
    ${renderSimLastRunCard(T)}
    ${renderSimReportSection(T)}
    ${renderSimRunBar(T)}
  </div>`;
}

function renderSimReportSection(T) {
  const sizing = !!simulateFetch;
  const fulling = !!simulateFullFetch;
  const sampling = !!simulateSampleFetch;
  const res = normalizeSimulateSizeResult(session.lastSimulateSize);
  // 尚無報告時，樣本階段先不佔位；已有報告則保留（勾選／半尖峰預覽取樣不拆報告）
  if (sampling && !sizing && !fulling && !res) return "";
  if (sizing && simPinnedRun) {
    const msg = res ? T.simRunningKeep : T.simSizingRunning;
    return `<section class="btm-card hud-panel hud-frame sim-report sim-report--busy">
      <h2 class="btm-card__title seetel-title">${T.simReport}</h2>
      ${busyBlockHtml(msg)}
    </section>`;
  }
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
    contract_adjustment: res.contract_adjustment,
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

function includeHalfPeakOn(sim) {
  if (activeSimulateTou() !== "ThreeStage") return false;
  return !!sim.includeHalfPeak;
}

function simBuildShortlist(stats, strategies, energyKeys) {
  /** 對齊後端：功率 PCS × 電量電池 自由組合並去重。 */
  if (!stats || !stats.ok) return [];
  const pcsMap = stats.pcs_sample || {};
  const energy = ((stats.energy_shift || {}).seeds) || {};
  const ekeys = normalizeEnergySeeds(energyKeys);
  const out = [];
  const seen = new Set();
  const add = (pcs, batt, source, seed, extra) => {
    const pcsR = Math.round(Number(pcs) * 1000) / 1000;
    const battR = Math.round(Number(batt) * 1000) / 1000;
    if (!(pcsR > 0 && battR > 0)) return;
    const key = `${pcsR}|${battR}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      pcs_kw: pcsR,
      batt_kwh: battR,
      seed_source: source,
      seed_id: seed,
      ...(extra || {}),
    });
  };
  const pcsOpts = [];
  const pcsSeen = new Set();
  for (const tid of strategies || []) {
    const pcs = Math.round((Number(pcsMap[tid]) || 0) * 1000) / 1000;
    if (!(pcs > 0) || pcsSeen.has(pcs)) continue;
    pcsSeen.add(pcs);
    pcsOpts.push({ pcs, tid });
  }
  const battOpts = [];
  const battSeen = new Set();
  for (const level of ekeys) {
    const seed = energy[level] || {};
    const batt = Math.round((Number(seed.batt_kwh) || 0) * 1000) / 1000;
    if (!(batt > 0) || battSeen.has(batt)) continue;
    battSeen.add(batt);
    battOpts.push({ batt, level });
  }
  if (pcsOpts.length && battOpts.length) {
    for (const p of pcsOpts) {
      for (const b of battOpts) {
        add(p.pcs, b.batt, "cross", `${p.tid}x${b.level}`, {
          pcs_seed: p.tid,
          energy_level: b.level,
        });
      }
    }
  } else if (!pcsOpts.length && battOpts.length) {
    for (const level of ekeys) {
      const seed = energy[level] || {};
      add(seed.pcs_kw, seed.batt_kwh, "energy", level, { energy_level: level });
    }
  }
  return out;
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
  const locked = busy || sizing;
  const sample = sampling ? null : activeSimulateSample();
  const showHalfToggle = activeSimulateTou() === "ThreeStage";
  const halfOn = includeHalfPeakOn(sim);
  const stats = profileStatsForHalfPeak(sample && sample.profile_stats, halfOn);
  const energy = ((stats && stats.energy_shift) || {}).seeds || {};
  const energyMeta = {
    min: T.simEnergyMin,
    p50: T.simEnergyP50,
    p90: T.simEnergyP90,
    max: T.simEnergyMax,
  };
  const halfToggle = showHalfToggle
    ? `<div class="sim-halfpeak-row">
        <div class="sim-halfpeak-row__lead">
          <span class="sim-halfpeak-row__title">${T.simIncludeHalfPeak}</span>
        </div>
        <div class="sim-schedule__switch" role="group" aria-label="${T.simIncludeHalfPeak}">
          <label class="sim-seg${halfOn ? " sim-seg--on" : ""}">
            <input type="radio" name="includeHalfPeak" value="1"${halfOn ? " checked" : ""}${locked ? " disabled" : ""}> ${T.simIncludeHalfOn}
          </label>
          <label class="sim-seg${!halfOn ? " sim-seg--on" : ""}">
            <input type="radio" name="includeHalfPeak" value="0"${!halfOn ? " checked" : ""}${locked ? " disabled" : ""}> ${T.simIncludeHalfOff}
          </label>
        </div>
      </div>`
    : "";
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

  const picked = normalizeSizingStrategies(sim.sizingStrategies);
  const ekeys = normalizeEnergySeeds(sim.sizingEnergySeeds);
  const shortlist = (!sampling && stats) ? simBuildShortlist(stats, picked, ekeys) : [];
  let metaLine = "";
  if (sample && !sampling) {
    metaLine = T.simSampleMeta.replace("{pts}", shortlist.length);
  }
  const chip = sample && !sampling ? simContractAdjustChip(T, sample.contract_adjustment) : "";
  const busyMsg = sampling
    ? (T.simStrategyRefreshing || T.simSampleRunning)
    : "";
  const footer = (metaLine || chip)
    ? `<div class="sim-sample__footer">
        ${metaLine ? `<span class="btm-chip btm-chip--dim">${metaLine}</span>` : ""}
        ${chip}
      </div>`
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

  const pcsDistinct = new Set(shortlist.map((c) => Number(c.pcs_kw))).size;
  const battDistinct = new Set(shortlist.map((c) => Number(c.batt_kwh))).size;
  const pcsNums = shortlist.map((c) => Number(c.pcs_kw)).filter((n) => n > 0);
  const battNums = shortlist.map((c) => Number(c.batt_kwh)).filter((n) => n > 0);
  const summaryLine = shortlist.length
    ? (T.simShortlistSummary || "{pcs} × {batt} → {pts}")
      .replace("{pcs}", String(pcsDistinct))
      .replace("{batt}", String(battDistinct))
      .replace("{pts}", String(shortlist.length))
    : (T.simShortlistEmpty || "");
  const rangeLine = (pcsNums.length && battNums.length)
    ? (T.simShortlistRange || "")
      .replace("{pcsMin}", fmt(Math.min(...pcsNums), 0))
      .replace("{pcsMax}", fmt(Math.max(...pcsNums), 0))
      .replace("{battMin}", fmt(Math.min(...battNums), 0))
      .replace("{battMax}", fmt(Math.max(...battNums), 0))
    : "";
  const hasResult = !!normalizeSimulateSizeResult(session.lastSimulateSize);
  const shortlistBlock = shortlist.length
    ? `<div class="sim-shortlist">
        <p class="sim-shortlist__summary">${summaryLine}${rangeLine ? ` · <span class="btm-meta">${rangeLine}</span>` : ""}</p>
        <details class="sim-shortlist__fold">
          <summary class="btm-meta">${T.simShortlistPreview}</summary>
          <ol class="sim-shortlist__list">${previewRows}</ol>
        </details>
      </div>`
    : (!sampling ? `<p class="btm-meta sim-shortlist__empty">${T.simShortlistEmpty}</p>` : "");

  const collapsedSummary = hasResult && !sampling
    ? `<summary class="sim-strategy__summary">
        <span>${T.simSampleMetaDone.replace("{pts}", String((session.lastSimulateSize && session.lastSimulateSize.grid_points) || shortlist.length || (session.lastSimulateSize && (session.lastSimulateSize.grid || []).length) || 0))}</span>
        <span class="btm-meta">${T.simStrategyChange || T.simGridFoldOpen}</span>
      </summary>`
    : "";

  if (hasResult && !sampling) {
    return `<details class="btm-card hud-panel hud-frame sim-strategy sim-strategy--collapsed"${sizing ? " open" : ""}>
      ${collapsedSummary}
      <div class="sim-strategy__body">
        ${halfToggle}
        <h3 class="btm-subhead">${T.simPowerSeeds}</h3>
        <div class="sim-strategy__grid">${cards}</div>
        <h3 class="btm-subhead">${T.simEnergySeedsAuto}</h3>
        <div class="sim-strategy__grid">${energyCards}</div>
        ${shortlistBlock}
        ${footer}
      </div>
    </details>`;
  }

  return `<section class="btm-card hud-panel hud-frame sim-strategy${busy || sizing ? " sim-strategy--busy" : ""}">
    <h2 class="btm-card__title seetel-title">${T.simStrategy}</h2>
    ${halfToggle}
    ${busy && busyMsg ? busyBlockHtml(busyMsg) : ""}
    <h3 class="btm-subhead">${T.simPowerSeeds}</h3>
    <div class="sim-strategy__grid">${cards}</div>
    <h3 class="btm-subhead">${T.simEnergySeedsAuto}</h3>
    <div class="sim-strategy__grid">${energyCards}</div>
    ${shortlistBlock}
    ${footer}
  </section>`;
}

function simContractAdjustChip(T, adj) {
  if (!adj || typeof adj !== "object" || adj.reason === "disabled") return "";
  if (adj.applied) {
    return `<span class="btm-chip btm-chip--on">${T.offPeakBoostApplied.replace("{kw}", fmt(adj.added_kw, 1))}</span>`;
  }
  return `<span class="btm-chip btm-chip--dim">${T.offPeakBoostSkipped}</span>`;
}

function simContractReductionChip(T, row) {
  const cr = row && row.contract_reduction;
  if (!cr || !(Number(cr.reducible_kw) > 0)) return "";
  return `<span class="btm-chip btm-chip--on">${T.contractReductionSuggested
    .replace("{kw}", fmt(cr.suggested_regular_kw, 1))
    .replace("{cut}", fmt(cr.reducible_kw, 1))}</span>`;
}

function simCandIdLabel(T, id) {
  if (id === "current") return T.simCandCurrent;
  if (id === "peak_day_avg") return T.simCandDayAvg;
  if (id === "p95") return T.simCandP95;
  if (id === "max") return T.simCandMax;
  return id || "—";
}

function simCandRejectLabel(T, reason) {
  if (!reason) return "";
  if (reason === "exceed_peak") return T.simRejectExceedPeak;
  if (reason === "exceed_half_peak") return T.simRejectExceedHalfPeak;
  if (reason === "exceed_off_peak") return T.simRejectExceedOffPeak;
  if (reason === "exceed_saturday_half_peak") return T.simRejectExceedSat;
  return reason;
}

function simKwDeltaHtml(delta) {
  const n = Number(delta) || 0;
  if (Math.abs(n) < 0.05) return `<span class="btm-meta">0</span>`;
  const sign = n > 0 ? "+" : "";
  const cls = n > 0 ? "sim-delta--up" : "sim-delta--down";
  return `<span class="${cls}">${sign}${fmt(n, 1)}</span>`;
}

function simMoneyDeltaHtml(delta) {
  const n = Number(delta);
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 0.5) return "0";
  const sign = n > 0 ? "+" : "";
  const cls = n > 0 ? "sim-delta--up" : "sim-delta--down";
  return `<span class="${cls}">${sign}${fmt(n, 0)}</span>`;
}

function simFnStatusChipsHtml(T, res) {
  const fns = new Set(res.functions || []);
  const skipped = new Set(res.skipped || []);
  const s2 = simActiveStage2(res);
  const hasStage2 = !!(s2 && s2.enabled);
  const finalRow = (s2 && s2.final) || res.final || null;
  const reserveMeta = (finalRow && finalRow.reserve_meta) || res.reserve_meta || {};
  const rolled = !!(reserveMeta.rolled_back || reserveMeta.reason === "no_net_gain");
  const items = [
    { label: simFnLabel("tou"), status: null },
  ];
  if (Number(session.simulate?.demandBufferKw) > 0) {
    items.push({ label: simFnLabel("demand"), status: null });
  }
  if (fns.has("backup")) {
    items.push({ label: simFnLabel("backup"), status: null });
  }
  if (res.evaluate_contract_reduction || res.want_contract) {
    items.push({
      label: T.autoAdjustContract,
      status: hasStage2 && finalRow && finalRow.selected_contract
        ? T.simStatusAdopted
        : (hasStage2 ? null : T.simStatusPending),
    });
  }
  if (fns.has("reserve")) {
    items.push({
      label: simFnLabel("reserve"),
      status: rolled
        ? T.simStatusRolled
        : (hasStage2 ? null : T.simStatusPending),
    });
  }
  if ((session.simulate?.functions || []).includes("large_user")) {
    const st = res.large_user_status === "pending"
      ? T.simStatusPending
      : (res.large_user_status === "ineligible" || skipped.has("large_user")
        ? T.simStatusSkip
        : null);
    items.push({ label: simFnLabel("large_user"), status: st });
  }
  return `<div class="sim-fn-status">
    ${items.map((it) => `<span class="btm-chip btm-chip--on">${it.label}${it.status ? ` · ${it.status}` : ""}</span>`).join("")}
  </div>`;
}

function simStage2ContractRecHtml(T, res, finalRow) {
  const beforeC = (res.stage1 && res.stage1.contracts)
    || (finalRow && finalRow.selected_contract && finalRow.selected_contract.id === "current"
      ? (finalRow.selected_contract.contracts || {})
      : null)
    || {};
  const formC = beforeC.regular_kw != null ? beforeC : (session.simulate && buildScenarioContracts()) || {};
  const adopted = (finalRow && finalRow.stage2_contracts)
    || (finalRow && finalRow.selected_contract && finalRow.selected_contract.contracts)
    || {};
  if (adopted.regular_kw == null && formC.regular_kw == null) return "";
  const ceilings = (finalRow && finalRow.constraints && finalRow.constraints.ceilings) || {};
  const rows = [
    {
      label: T.simContractRegular,
      a: Number(formC.regular_kw) || 0,
      b: Number(adopted.regular_kw != null ? adopted.regular_kw : formC.regular_kw) || 0,
      ceil: ceilings.peak,
    },
    {
      label: T.simContractHalfPeak,
      a: Number(formC.half_peak_kw) || 0,
      b: Number(adopted.half_peak_kw != null ? adopted.half_peak_kw : formC.half_peak_kw) || 0,
      ceil: ceilings.half_peak,
    },
    {
      label: T.simContractNonSummer || "非夏月契約",
      a: Number(formC.non_summer_kw) || 0,
      b: Number(adopted.non_summer_kw != null ? adopted.non_summer_kw : formC.non_summer_kw) || 0,
      ceil: null,
    },
    {
      label: T.simContractSatHalfPeak,
      a: Number(formC.saturday_half_peak_kw) || 0,
      b: Number(
        adopted.saturday_half_peak_kw != null
          ? adopted.saturday_half_peak_kw
          : formC.saturday_half_peak_kw,
      ) || 0,
      ceil: ceilings.saturday_half_peak,
    },
    {
      label: T.simContractOffPeak,
      a: Number(formC.off_peak_kw) || 0,
      b: Number(adopted.off_peak_kw != null ? adopted.off_peak_kw : formC.off_peak_kw) || 0,
      ceil: ceilings.off_peak,
    },
  ].filter((r) => r.a > 0 || r.b > 0 || r.label === T.simContractRegular);
  return `<div class="sim-stage2-table-wrap btm-table-wrap">
    <h4 class="btm-subhead">${T.simContractRecTitle}</h4>
    <table class="sim-stage2-table btm-table btm-table--dash">
      <thead><tr>
        <th>${T.simContractField}</th>
        <th class="num">${T.simContractForm}</th>
        <th class="num">${T.simContractAdopted}</th>
        <th class="num">${T.simContractDelta}</th>
        <th class="num">${T.simContractCeiling || "累計上限"}</th>
      </tr></thead>
      <tbody>${rows.map((r) => `<tr>
        <td>${r.label}</td>
        <td class="num">${fmt(r.a, 1)}</td>
        <td class="num">${fmt(r.b, 1)}</td>
        <td class="num">${simKwDeltaHtml(r.b - r.a)}</td>
        <td class="num">${r.ceil != null ? fmt(r.ceil, 1) : "—"}</td>
      </tr>`).join("")}</tbody>
    </table>
  </div>`;
}

function simStage2CandidatesHtml(T, finalRow) {
  const candRows = (finalRow && finalRow.contract_candidates) || [];
  if (!candRows.length) return "";
  const adoptedId = finalRow.selected_contract && finalRow.selected_contract.id;
  return `<div class="sim-stage2-table-wrap btm-table-wrap">
    <h4 class="btm-subhead">${T.simContractCandidates}</h4>
    <table class="sim-stage2-table sim-stage2-table--cands btm-table btm-table--dash">
      <thead><tr>
        <th>${T.simCandStatus}</th>
        <th>${T.simCandId}</th>
        <th class="num">${T.simCandRegular}</th>
        <th class="num">${T.simCandHalfPeak}</th>
        <th class="num">${T.simCandOffPeakMove}</th>
        <th class="num">${T.simCandFreeBoost}</th>
        <th class="num">${T.simCandBill}</th>
        <th>${T.simCandReason}</th>
      </tr></thead>
      <tbody>${candRows.map((c) => {
        const adopted = c.id === adoptedId && c.feasible !== false;
        const rejected = c.feasible === false;
        const status = adopted
          ? `<span class="btm-chip btm-chip--on">${T.simCandAdopted}</span>`
          : rejected
            ? `<span class="btm-chip btm-chip--warn">${T.simCandRejected}</span>`
            : `<span class="btm-chip btm-chip--dim">${T.simCandFeasible}</span>`;
        const trCls = adopted ? " class=\"sim-stage2-row--adopted\"" : (rejected ? " class=\"sim-stage2-row--reject\"" : "");
        return `<tr${trCls}>
          <td>${status}</td>
          <td>${simCandIdLabel(T, c.id)}</td>
          <td class="num">${fmt(c.regular_kw, 1)}</td>
          <td class="num">${simKwDeltaHtml(c.half_peak_delta_kw || 0)}</td>
          <td class="num">${fmt(c.off_peak_replaced_kw || 0, 1)}</td>
          <td class="num">${fmt(c.free_off_peak_added_kw || 0, 1)}</td>
          <td class="num">${c.bill_total != null ? fmt(c.bill_total, 0) : "—"}</td>
          <td class="btm-meta">${simCandRejectLabel(T, c.reject_reason) || "—"}</td>
        </tr>`;
      }).join("")}</tbody>
    </table>
  </div>`;
}

function simStage2ReserveSummaryHtml(T, res, finalRow) {
  const hasFn = (res.functions || []).includes("reserve");
  const ri = (finalRow && finalRow.reserve_income) || res.reserve_income || {};
  const credit = Number(ri.total || 0);
  if (!hasFn && credit === 0) return "";
  const meta = (finalRow && finalRow.reserve_meta) || res.reserve_meta || {};
  const rolled = !!(meta.rolled_back || meta.reason === "no_net_gain");
  const days = simReportDays();
  const rec = meta.recommended_schedule;
  const canViewRec = !!rec;
  return `<div class="sim-stage2-reserve">
    <h4 class="btm-subhead">${T.simReserveSummaryTitle}</h4>
    <div class="dash-kpis sim-stage2-reserve__kpis">
      ${dashKpiHtml(T.reserveIncomeTotal, credit, days, " dash-kpi--energy")}
      ${dashKpiHtml(T.reserveIncomeCap, ri.capacity || 0, days)}
      ${dashKpiHtml(T.reserveIncomePerf, ri.performance || 0, days)}
    </div>
    ${rolled ? `<p class="btm-meta btm-meta--err">${T.simReserveRolledBack}</p>` : ""}
    <div class="sim-fn-subcard__actions">
      ${canViewRec ? `<button type="button" class="btm-btn btm-btn--ghost" data-sched-open-rec="reserve">${T.simReserveBidRec}</button>` : ""}
      ${canViewRec ? `<button type="button" class="btm-btn btm-btn--ghost" data-apply-rec-manual="reserve">${T.reserveUseAsManual}</button>` : ""}
      <a class="btm-btn btm-btn--ghost" href="#simReservePanel">${T.simReserveViewDetail}</a>
    </div>
  </div>`;
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

function simReportExtrasBodyHtml(T, res) {
  /** 契約／備轉明細（僅已開啟功能；無獨立卡片）。 */
  const s2 = simActiveStage2(res);
  const finalRow = (s2 && s2.final) || null;
  if (!(s2 && s2.enabled) || !finalRow) return "";
  const hasContract = simReportHasContract(res);
  const hasReserve = simReportHasReserve(res);
  if (!hasContract && !hasReserve) return "";

  const candFold = (() => {
    if (!hasContract) return "";
    const html = simStage2CandidatesHtml(T, finalRow);
    if (!html) return "";
    return `<details class="sim-stage2-cand-fold"><summary class="btm-meta">${T.simContractCandidates}</summary>${html}</details>`;
  })();

  return `<div class="sim-report-extras" id="simStage2">
    ${hasContract ? simStage2ContractRecHtml(T, res, finalRow) : ""}
    ${candFold}
    ${hasReserve ? simStage2ReserveSummaryHtml(T, res, finalRow) : ""}
    ${hasReserve ? renderReserveReportBlock(T, res) : ""}
  </div>`;
}

function simReportKpisHtml(T, res, {
  beforeTotal,
  afterBill,
  sizingSave,
  savePct,
  sizeLabel,
  viable,
  row,
  days,
} = {}) {
  const s2 = simActiveStage2(res);
  const split = (s2 && s2.benefit_split)
    || (res && (res.benefit_split || (res.stage2 && res.stage2.benefit_split)))
    || null;
  const hasContract = simReportHasContract(res);
  const hasReserve = simReportHasReserve(res);
  const hasStage2 = !!(s2 && s2.enabled && s2.final);
  const evaluating = !!simulateFullFetch;
  const sizing = sizingSave != null
    ? Number(sizingSave)
    : Number(split && split.sizing_savings != null ? split.sizing_savings : 0);
  const contractGain = hasContract
    ? Number(hasStage2 && split ? (split.contract_gain || 0) : 0)
    : null;
  const reserveGain = hasReserve
    ? Number(hasStage2 && split ? (split.reserve_gain || 0) : 0)
    : null;
  const totalBenefit = (hasContract || hasReserve) && hasStage2 && split && split.total != null
    ? Number(split.total)
    : sizing + (contractGain || 0) + (reserveGain || 0);
  const saveKpiClass = Number(totalBenefit) >= 0 ? " dash-kpi--energy" : " dash-kpi--loss";
  const sizingCls = Number(sizing) >= 0 ? " dash-kpi--energy" : " dash-kpi--loss";
  const pending = (hasContract || hasReserve) && !hasStage2 && evaluating;

  return `<div class="dash-kpis sim-report__kpis" id="simReportKpis">
    ${dashKpiHtml(T.simKpiBefore, beforeTotal, days)}
    ${dashKpiHtml(T.simBillSizingOnly || T.simKpiAfter, afterBill, days)}
    ${dashKpiHtml(T.simBenefitSizing || T.simKpiBillSave, sizing, days, sizingCls)}
    ${hasContract ? dashKpiHtml(
      T.simBenefitContract,
      hasStage2 ? contractGain : null,
      days,
      " dash-kpi--energy",
    ) : ""}
    ${hasReserve ? dashKpiHtml(
      T.simBenefitReserve,
      hasStage2 ? reserveGain : null,
      days,
      " dash-kpi--energy",
    ) : ""}
    ${dashKpiHtml(T.simKpiTotalBenefit, pending ? null : totalBenefit, days, saveKpiClass)}
    ${row ? `<article class="dash-kpi hud-panel hud-frame${viable ? " dash-kpi--total" : ""}">
      <div class="dash-kpi__label">${sizeLabel}</div>
      <div class="dash-kpi__value sim-size-kpi">${fmt(row.pcs_kw, 0)} <span>kW</span> / ${fmt(row.batt_kwh, 0)} <span>kWh</span></div>
      <div class="dash-kpi__annual"><span>${T.simHours}</span> <strong>${fmt(row.hours, 1)}</strong>
      · <span>${T.simKpiSavePct}</span> <strong>${fmt(savePct, 1)}%</strong></div>
    </article>` : ""}
  </div>`;
}

function simStage2SectionHtml(T, res) {
  // 保留函式名相容；已併入試算報告
  return simReportExtrasBodyHtml(T, res);
}

function simReportHeadHtml(T, res) {
  const baseRow = simViewBaseRow(res) || simSizingRow(res) || res.best_effort || (res.grid || [])[0];
  if (!baseRow) return "";
  const s2 = simActiveStage2(res);
  const r = (simViewContext === "full" && s2 && s2.final)
    ? simMergeStage2Row(baseRow, s2)
    : baseRow;
  const viable = !!res.viable;
  const days = simReportDays();
  const sizeLabel = (() => {
    if (simViewMode === "max_savings") return T.simViewMaxSave || T.simTagBest;
    if (simViewMode === "max_util") return T.simViewMaxUtil || T.simTagBest;
    return viable ? T.simKpiSize : T.simTagBest;
  })();
  const finalRow = (s2 && s2.enabled && s2.final) || null;
  const hasStage2 = !!finalRow;

  const beforeTotal = Number((res.before && res.before.total)
    || (r.before && r.before.total)) || 0;
  // 量體電費：一律用 stage1 列；full 情境 KPI 仍先顯示量體 after，效益拆分看 stage2
  const sizingAfter = Number(
    baseRow.after_total != null ? baseRow.after_total : (res.after && res.after.total),
  ) || 0;
  const billSave = baseRow.bill_savings != null
    ? baseRow.bill_savings
    : (beforeTotal - sizingAfter);
  const split = (s2 && s2.benefit_split)
    || res.benefit_split
    || (res.stage2 && res.stage2.benefit_split)
    || null;
  const sizingSave = split && split.sizing_savings != null
    ? split.sizing_savings
    : (baseRow.savings != null && !(simReportHasContract(res) || simReportHasReserve(res))
      ? baseRow.savings
      : billSave);
  const savePct = r.savings_pct != null ? r.savings_pct : (
    beforeTotal > 0 ? (100 * sizingSave / beforeTotal) : res.savings_pct
  );
  const metaLine = T.simSampleMetaDone
    .replace("{pts}", res.grid_points != null ? res.grid_points : (res.grid || []).length);

  let stage2Warn = "";
  const warnKey = (hasStage2 && finalRow.stage2_warning) || r.stage2_warning || res.stage2_warning;
  if (warnKey === "stage2_benefit_much_lower") {
    stage2Warn = `<p class="sim-report__warn btm-meta btm-meta--err">${T.stage2WarningLower}</p>`;
  } else if (warnKey === "stage2_overage_worse") {
    stage2Warn = `<p class="sim-report__warn btm-meta btm-meta--err">${T.stage2WarningOverage}</p>`;
  } else if (warnKey === "reserve_no_net_gain") {
    stage2Warn = `<p class="sim-report__warn btm-meta btm-meta--err">${T.reserveNoNetGain}</p>`;
  }

  const evaluating = !!simulateFullFetch;
  const evalBanner = evaluating
    ? `<div class="sim-report__eval">${busyBlockHtml(T.simEvaluatingExtras)}</div>`
    : "";
  const fullFail = !!session._simFullError;
  const failBanner = fullFail && !evaluating
    ? `<p class="sim-report__warn btm-meta btm-meta--err">${T.simFullFailedKeep}
        <button type="button" class="btm-btn btm-btn--ghost" id="btnSimulateFullRetry">${T.simFullRetry}</button>
      </p>`
    : "";

  const extrasBody = evaluating ? "" : simReportExtrasBodyHtml(T, res);
  const warn = viable
    ? ""
    : `<p class="sim-report__warn btm-meta btm-meta--err">${T.simNoViable}</p>`;

  const baseTou = res.baseline_tou_type || importPlanTou();
  const simTou = res.simulate_tou_type || activeSimulateTou();
  const planChips = baseTou === simTou
    ? `<span class="btm-chip btm-chip--on">${T.simReportSimulateTou}: ${simTou}</span>`
    : `<span class="btm-chip btm-chip--dim">${T.simReportBaselineTou}: ${baseTou}</span>
      <span class="btm-chip btm-chip--on">${T.simReportSimulateTou}: ${simTou}</span>`;
  const periodDays = days > 0
    ? `<span class="btm-chip btm-chip--dim">${T.simPeriodNote || ""}: ${days}d</span>`
    : "";

  return `<section class="btm-card hud-panel hud-frame sim-report" id="simReportHead">
    <h2 class="btm-card__title seetel-title">${T.simReport}</h2>
    ${warn}
    ${evalBanner}
    ${failBanner}
    ${stage2Warn}
    ${simFnStatusChipsHtml(T, res)}
    <div class="sim-report__meta">
      ${planChips}
      ${periodDays}
      <span class="btm-chip btm-chip--dim">${metaLine}</span>
    </div>
    ${simReportKpisHtml(T, res, {
      beforeTotal,
      afterBill: sizingAfter,
      sizingSave,
      savePct,
      sizeLabel,
      viable,
      row: r,
      days,
    })}
    ${extrasBody}
  </section>`;
}

function renderSimulateResult(T, res) {
  const r = simViewBaseRow(res) || simSizingRow(res) || res.best_effort || (res.grid || [])[0];
  if (!r) return "";
  const skipped = (res.skipped || []).length
    ? `<p class="btm-meta">${T.simSkipped}: ${res.skipped.join(", ")}</p>`
    : "";

  const mapSection = `<section class="btm-card hud-panel hud-frame sim-report sim-report--detail">
    <h3 class="btm-subhead">${T.simSavingsChart}</h3>
    ${simMapLegendHtml(T)}
    <div id="simSavingsChart" class="sim-savings-chart" role="img" aria-label="${T.simSavingsChart}"></div>
  </section>`;

  const gridSection = `<details class="btm-card hud-panel hud-frame sim-report sim-grid-fold">
    <summary class="sim-grid-fold__summary">
      <span>${T.simGridFold}</span>
      <span class="btm-meta">${T.simGridFoldOpen} / ${T.simGridFoldClose}</span>
    </summary>
    <div class="sim-grid-fold__body">
      ${simGridResultsHtml(res, T)}
      ${skipped}
    </div>
  </details>`;

  const reportHead = simReportHeadHtml(T, res);
  const compareKey = simCompareCacheKey(res, simViewBillRow(res) || r);
  const compareSection = simBillCompareReportHtml(
    T,
    (simCompareBill && simCompareKey === compareKey) ? simCompareBill : null,
    { loading: !!(simCompareFetch && simCompareKey === compareKey) },
  );

  return `${mapSection}
  ${gridSection}
  ${simViewPanelHtml(res, T)}
  ${reportHead}
  ${compareSection}`;
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

function renderSimulatePanelPlanChange(T, sim) {
  const simTou = activeSimulateTou();
  const importTou = importPlanTou();
  const switched = simTou !== importTou;
  const touOpts = TOU_OPTIONS.map(
    (opt) => `<option value="${opt}"${simTou === opt ? " selected" : ""}>${opt}</option>`,
  ).join("");
  return simFnPanel(sim.detailTab === "plan_change", "plan_change", `
    ${renderFnParamsCard(`
    <div class="sim-fn-fields">
      <label class="ts-field"><span class="ts-field__label">${T.simScenarioPlan}</span>
        <select class="ts-select" id="simScenarioTou">${touOpts}</select></label>
    </div>
    ${switched ? `<p class="btm-meta btm-meta--warn">${T.simPlanSwitchedNote}</p>` : ""}
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
      <h2 class="btm-card__title seetel-title">${T.functions}</h2>
      ${renderSimulateTabs(T, sim)}
      <div class="sim-tab-panels">
        ${renderSimulatePanelTou(T, sim)}
        ${renderSimulatePanelPlanChange(T, sim)}
        ${renderSimulatePanelDemand(T, sim)}
        ${renderSimulatePanelReserve(T, sim)}
        ${renderSimulatePanelBackup(T, sim)}
        ${renderSimulatePanelLargeUser(T, sim)}
      </div>
    </section>
    ${renderSimResultsBlock(T)}`;
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
  return simFnPanel(sim.detailTab === "tou", "tou", `
    ${renderFnModeCard("tou", "touScheduleMode", sim, T, {
      scheduleTitle: T.touTargetSoc,
    })}
  `);
}

function renderSimulatePanelDemand(T, sim) {
  return simFnPanel(sim.detailTab === "demand", "demand", `
    ${renderFnParamsCard(`
    <label class="sim-fn-option">
      <span class="sim-tab-check">
        <input type="checkbox" data-sim-check="autoAdjustOffPeakContract"${
          sim.autoAdjustOffPeakContract || sim.evaluateContractReduction ? " checked" : ""
        }>
        <span class="sim-tab-check__box"></span>
      </span>
      <span class="sim-fn-option__body">
        <span class="sim-fn-option__title">${T.autoAdjustContract}</span>
        <span class="btm-meta">${T.autoAdjustContractHint}</span>
      </span>
    </label>`)}
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
      ${simNumField("backupReserveKwh", T.backupReserveKwh, sim.backupReserveKwh, 1, 0, undefined, T.backupReserveHint)}
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

  const fd = new FormData();
  fd.append("import_id", session.importId);
  if (!appendSimulateContractFields(fd)) return Promise.resolve(null);
  fd.append("simulate", JSON.stringify(session.simulate || {}));
  appendOverrides(fd);
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
      persistSession();
      if (parseRoute() === ROUTES.SIMULATE) {
        renderPage({ animate: false, preserveScroll: true });
      }
      return sample;
    })
    .catch((err) => {
      if (job === simulateSampleJob) simulateSampleFetch = null;
      if (isImportExpiredError(err)) redirectImportExpired();
      else if (parseRoute() === ROUTES.SIMULATE) {
        renderPage({ animate: false, preserveScroll: true });
      }
      return null;
    });

  if (parseRoute() === ROUTES.SIMULATE) {
    renderPage({ animate: false, preserveScroll: true });
  }
  return simulateSampleFetch;
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
      // 只打 sample（內含 diagnosis）
      fetchSimulateSample({ replace: true })
        .then((sample) => {
          if (session.importId !== importId) return;
          if (sample && sample.diagnosis) sizingDiagnosis = sample.diagnosis;
        })
        .finally(() => {
          simWorkspaceBooting = false;
          if (session.importId !== importId) return;
          simWorkspaceReady = true;
          if (parseRoute() === ROUTES.SIMULATE) {
            renderPage({ animate: false, preserveScroll: true });
          }
        });
    });
  }

  const simTouEl = document.getElementById("simScenarioTou");
  if (simTouEl) {
    simTouEl.onchange = () => {
      applySimulateTouChange(simTouEl.value);
      renderPage({ animate: false, preserveScroll: true });
      fetchSimulateSample({ replace: true });
    };
  }
  document.querySelectorAll("#simScenarioContracts input").forEach((el) => {
    el.addEventListener("change", () => {
      readScenarioContractInputs();
      persistSession();
    });
  });

  document.querySelectorAll('[name="includeHalfPeak"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      persistSession();
      // 樣本已含開／關兩組；切換只重繪，不重打 sample
      renderPage({ animate: false, preserveScroll: true });
    });
  });

  document.querySelectorAll('[name="sizingStrategies"], [name="sizingEnergySeeds"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      persistSession();
      renderPage({ animate: false, preserveScroll: true });
    });
  });

  document.querySelectorAll('[name="bessFn"]').forEach((el) => {
    el.addEventListener("change", () => {
      readSimulateForm();
      if (el.value === "demand") {
        // readSimulateForm 若畫面仍有內層勾選會再把 demand 加回；改以外層為準
        const on = el.checked;
        const rest = (session.simulate.functions || []).filter((f) => f !== "tou" && f !== "demand");
        session.simulate.functions = on ? ["tou", ...rest, "demand"] : ["tou", ...rest];
        syncDemandAutoContract(session.simulate, "demand");
        if (on) session.simulate.detailTab = "demand";
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
        const rec = simTouMetaFromResult()?.recommended_schedule;
        if (rec) {
          session.simulate.touSchedule = normalizeScheduleMatrix(rec, () => defaultTouSlots(activeSimulateTou()));
        }
      }
      renderPage({ animate: false, preserveScroll: true });
    });
  });
  document.querySelectorAll("[data-sched-open]").forEach((el) => {
    el.addEventListener("click", () => {
      const kind = el.dataset.schedOpen;
      if (kind !== "tou" && kind !== "reserve") return;
      readSimulateForm();
      simScheduleModal = kind;
      syncScheduleModalHost();
    });
  });
  document.querySelectorAll("[data-sched-open-rec]").forEach((el) => {
    el.addEventListener("click", () => {
      const kind = el.dataset.schedOpenRec || "reserve";
      simScheduleModal = kind === "tou" ? "tou-rec" : "reserve-rec";
      syncScheduleModalHost();
    });
  });
  document.querySelectorAll("[data-apply-rec-manual]").forEach((el) => {
    el.addEventListener("click", () => {
      const kind = el.dataset.applyRecManual;
      if (kind === "reserve") {
        const rec = simReserveMetaFromResult()?.recommended_schedule;
        if (!rec) return;
        session.simulate.reserveScheduleMode = "manual";
        session.simulate.reserveSchedule = normalizeScheduleMatrix(rec, defaultReserveHourly);
        session.simulate.detailTab = "reserve";
      } else if (kind === "tou") {
        const rec = simTouMetaFromResult()?.recommended_schedule;
        if (!rec) return;
        session.simulate.touScheduleMode = "manual";
        session.simulate.touSchedule = normalizeScheduleMatrix(rec, () => defaultTouSlots(activeSimulateTou()));
        session.simulate.detailTab = "tou";
      } else return;
      persistSession();
      renderPage({ animate: false, preserveScroll: true });
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
      if (el.dataset.simCheck === "autoAdjustOffPeakContract") {
        syncDemandAutoContract(session.simulate, "auto");
        if (session.simulate.autoAdjustOffPeakContract) {
          session.simulate.detailTab = "demand";
        }
        persistSession();
        renderPage({ animate: false, preserveScroll: true });
      }
    });
    if (el.dataset.sched) {
      el.addEventListener("input", () => {
        readSimulateForm();
      });
    }
  });
  syncSimulateTabs();

  async function startSimulateRun() {
    if (simulateFetch || simulateFullFetch || simulateExportFetch) return;
    // 取消進行中的預覽取樣
    simulateSampleJob += 1;
    simulateSampleFetch = null;
    readSimulateForm();
    const meta = document.getElementById("simMeta");
    if (!requireLiveImportOrRedirect()) return;
    await ensureSettingsLoaded();
    if (!buildScenarioContracts()) {
      setRunMeta(meta, t("import.needSchema"), true);
      return;
    }
    if (
      !normalizeSizingStrategies(session.simulate.sizingStrategies).length
      || !normalizeEnergySeeds(session.simulate.sizingEnergySeeds).length
    ) {
      setRunMeta(meta, t("simulate.simNeedStrategy"), true);
      return;
    }
    const fdSize = new FormData();
    fdSize.append("import_id", session.importId);
    if (!appendSimulateContractFields(fdSize)) {
      setRunMeta(meta, t("import.needSchema"), true);
      return;
    }
    fdSize.append("simulate", JSON.stringify(session.simulate));
    appendOverrides(fdSize);
    const id = ++simulateJob;
    const prev = normalizeSimulateSizeResult(session.lastSimulateSize);
    if (prev) {
      simPinnedRun = simSnapshotFromResult(prev);
      simDismissedSnapshot = null;
    }
    session.simulateError = null;
    session._simFullError = null;
    session._scrollSimReport = false;
    clearSimCompareBill();
    // 工作區已有完整 sample 則直接 /size（後端有 profile／size 快取）
    const existing = session.lastSimulateSample;
    const hasRichSample = !!(existing && existing.profile_stats && existing.diagnosis);
    if (!hasRichSample) {
      const fdSample = new FormData();
      fdSample.append("import_id", session.importId);
      if (!appendSimulateContractFields(fdSample)) {
        setRunMeta(meta, t("import.needSchema"), true);
        return;
      }
      fdSample.append("simulate", JSON.stringify(session.simulate));
      appendOverrides(fdSample);
      const sampleJob = ++simulateSampleJob;
      session.lastSimulateSample = null;
      simulateSampleFetch = apiJson("/api/simulate/sample", { method: "POST", body: fdSample });
      renderPage({ animate: false, preserveScroll: !!prev });
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
          renderPage({ animate: false, preserveScroll: !!prev });
        }
        return;
      }
    } else if (existing.diagnosis) {
      sizingDiagnosis = existing.diagnosis;
    }

    async function applySizeResult(res) {
      simDispatchChartKey = null;
      simViewMode = "recommended";
      simViewContext = "sizing";
      simDispatchChartCache = {};
      simDispatchChartLoadId += 1;
      session.lastSimulateSize = normalizeSimulateSizeResult(res);
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
          contract_adjustment: res.contract_adjustment ?? prevSample?.contract_adjustment,
          sample_source: res.sample_source ?? prevSample?.sample_source,
          diagnosis: res.diagnosis ?? prevSample?.diagnosis,
        };
      }
      session.simulateResultKey = simulateRunKey();
      session.simulateError = null;
      simPinnedRun = null;
      simDismissedSnapshot = null;
      session._scrollSimReport = true;
      persistSession();
    }

    async function runFullStep(sizeRes) {
      if (!(sizeRes && sizeRes.need_full && sizeRes.stage1_key)) return;
      const rec = sizeRes.recommended || sizeRes.best_effort;
      const fdFull = new FormData();
      fdFull.append("import_id", session.importId);
      if (!appendSimulateContractFields(fdFull)) return;
      fdFull.append("simulate", JSON.stringify(session.simulate));
      fdFull.append("stage1_key", String(sizeRes.stage1_key));
      if (rec) {
        fdFull.append("pcs_kw", String(rec.pcs_kw));
        fdFull.append("batt_kwh", String(rec.batt_kwh));
      }
      appendOverrides(fdFull);
      simulateFullFetch = apiJson("/api/simulate/full", { method: "POST", body: fdFull });
      if (parseRoute() === ROUTES.SIMULATE) {
        renderPage({ animate: false, preserveScroll: true });
      }
      try {
        const full = await simulateFullFetch;
        if (id !== simulateJob) return;
        session._simFullError = null;
        const merged = simMergeFullResult(sizeRes, full);
        await applySizeResult(merged || full);
      } catch (err) {
        if (id !== simulateJob) return;
        session._simFullError = String(err.message || err);
        if (isImportExpiredError(err)) {
          redirectImportExpired();
          return;
        }
        persistSession();
      } finally {
        if (id === simulateJob) simulateFullFetch = null;
      }
    }

    try {
      simulateFetch = apiJson("/api/simulate/size", { method: "POST", body: fdSize });
      renderPage({ animate: false, preserveScroll: !!prev });

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
      const prev = normalizeSimulateSizeResult(session.lastSimulateSize);
      if (prev) simDismissedSnapshot = simSnapshotFromResult(prev);
      simPinnedRun = null;
      clearSimulateResult();
      renderPage({ animate: false, preserveScroll: true });
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
      const meta = document.getElementById("simMeta");
      const fd = new FormData();
      fd.append("import_id", session.importId);
      const s2Exp = simActiveStage2(res);
      const finalRow = (s2Exp && s2Exp.final)
        || (res.stage2 && res.stage2.final)
        || res.final
        || null;
      const adopted = finalRow && finalRow.stage2_contracts;
      // contracts＝情境／量體；scheme＝stage2 採用契約（若有）
      if (!appendSimulateContractFields(fd)) {
        setRunMeta(meta, t("import.needSchema"), true);
        return;
      }
      if (adopted) {
        fd.append("scheme_contracts", JSON.stringify(adopted));
      }
      const exportSim = { ...session.simulate };
      fd.append("simulate", JSON.stringify(exportSim));
      fd.append("pcs_kw", String(row.pcs_kw));
      fd.append("batt_kwh", String(row.batt_kwh));
      appendOverrides(fd);
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

  document.getElementById("btnSimDismissSnapshot")?.addEventListener("click", () => {
    simDismissedSnapshot = null;
    renderPage({ animate: false, preserveScroll: true });
  });

  const simRes = normalizeSimulateSizeResult(session.lastSimulateSize);
  if (simRes) {
    requestAnimationFrame(() => {
      const T = I18N[locale].simulate;
      renderSimSavingsChart(simRes, T);
      seedSimDispatchCache(simRes);
      bindSimDispatchCharts(simRes, T);
      ensureSimDispatchCharts(simRes, T).then(() => {
        prefetchSimViewCharts(simRes, T).catch((err) => {
          console.warn("sim dispatch prefetch", err);
        });
      });
      ensureSimCompareBill(simRes, T).catch((err) => {
        console.warn("sim compare bill", err);
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
  else if (route === ROUTES.SIMULATE) bindSimulate();
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
