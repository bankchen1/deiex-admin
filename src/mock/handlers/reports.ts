/**
 * Reports Mock Handlers
 * 
 * Mock handlers that align with the contracts defined in src/contracts/reports.ts
 * All responses must pass contract validation
 */

import type { 
  TradeReportListResponse, 
  FinanceReportListResponse,
  RetentionReportListResponse,
  TradeDailyData,
  SymbolVolumeData,
  FinanceDailyData,
  FeeIncomeData,
  RetentionData,
  FunnelData,
  TradeReportQueryParams,
  FinanceReportQueryParams,
  RetentionReportQueryParams,
  ExportReportParams
} from '@/contracts/reports'

// Load mock data
let mockData = {
  tradeReports: [] as any[],
  financeReports: [] as any[],
  retentionReports: [] as any[],
  tradeDailyData: [] as any[],
  symbolVolumeData: [] as any[],
  financeDailyData: [] as any[],
  feeIncomeData: [] as any[],
  retentionData: [] as any[],
  funnelData: [] as any[],
}

// Initialize mock data if not done already
if (mockData.tradeReports.length === 0) {
  // Load data from the example file
  mockData.tradeReports = [
    {
      id: "trade_report_001",
      symbol: "BTCUSDT",
      date: "2024-11-08",
      volume: "250.50000000",
      turnover: "15030000.00",
      trades: 1250,
      takerBuyVolume: "130.25000000",
      takerBuyTurnover: "7815000.00"
    },
    {
      id: "trade_report_002",
      symbol: "ETHUSDT", 
      date: "2024-11-08",
      volume: "1200.75000000",
      turnover: "4803000.00",
      trades: 2100,
      takerBuyVolume: "680.45000000",
      takerBuyTurnover: "2721800.00"
    },
    {
      id: "trade_report_003",
      symbol: "SOLUSDT",
      date: "2024-11-08",
      volume: "5000.25000000",
      turnover: "1500000.00",
      trades: 3200,
      takerBuyVolume: "2800.15000000",
      takerBuyTurnover: "840000.00"
    }
  ];
  
  mockData.financeReports = [
    {
      id: "finance_report_001",
      date: "2024-11-08",
      depositAmount: "1200000.00",
      depositCount: 45,
      withdrawalAmount: "1050000.00",
      withdrawalCount: 32,
      feeIncome: "12500.00",
      userCount: 52000,
      activeUserCount: 1500
    },
    {
      id: "finance_report_002",
      date: "2024-11-07",
      depositAmount: "1350000.00",
      depositCount: 52,
      withdrawalAmount: "1100000.00",
      withdrawalCount: 38,
      feeIncome: "14200.00",
      userCount: 51800,
      activeUserCount: 1620
    }
  ];
  
  mockData.retentionReports = [
    {
      id: "retention_report_001",
      date: "2024-11-08",
      newUserCount: 12,
      day1: 0.85,
      day7: 0.65,
      day30: 0.35,
      day90: 0.15,
      mtd: 0.45,
      qtd: 0.38,
      ytd: 0.28
    },
    {
      id: "retention_report_002",
      date: "2024-11-07",
      newUserCount: 15,
      day1: 0.82,
      day7: 0.62,
      day30: 0.32,
      day90: 0.12,
      mtd: 0.43,
      qtd: 0.36,
      ytd: 0.26
    }
  ];
  
  mockData.tradeDailyData = [
    {
      date: "2024-11-01",
      volume: "1250.25000000",
      turnover: "75012500.00",
      trades: 5210
    },
    {
      date: "2024-11-02",
      volume: "1400.80000000",
      turnover: "84048000.00",
      trades: 6520
    },
    {
      date: "2024-11-03",
      volume: "1320.45000000",
      turnover: "79227000.00",
      trades: 5980
    },
    {
      date: "2024-11-04",
      volume: "1580.75000000",
      turnover: "94845000.00",
      trades: 7230
    },
    {
      date: "2024-11-05",
      volume: "1420.35000000",
      turnover: "85221000.00",
      trades: 6450
    },
    {
      date: "2024-11-06",
      volume: "1350.90000000",
      turnover: "81054000.00",
      trades: 6120
    },
    {
      date: "2024-11-07",
      volume: "1280.65000000",
      turnover: "76839000.00",
      trades: 5820
    },
    {
      date: "2024-11-08",
      volume: "1300.50000000",
      turnover: "78030000.00",
      trades: 5950
    }
  ];
  
  mockData.symbolVolumeData = [
    {
      symbol: "BTCUSDT",
      volume: "250.50000000",
      turnover: "15030000.00",
      percentage: 32.5
    },
    {
      symbol: "ETHUSDT",
      volume: "1200.75000000",
      turnover: "4803000.00",
      percentage: 15.2
    },
    {
      symbol: "SOLUSDT",
      volume: "9500.25000000",
      turnover: "1900000.00",
      percentage: 12.8
    },
    {
      symbol: "BNBUSDT",
      volume: "6800.80000000",
      turnover: "1360000.00",
      percentage: 8.7
    },
    {
      symbol: "ADAUSDT",
      volume: "150000.50000000",
      turnover: "300000.00",
      percentage: 6.5
    }
  ];
  
  mockData.financeDailyData = [
    {
      date: "2024-11-01",
      depositAmount: "1250000.00",
      withdrawalAmount: "1100000.00",
      feeIncome: "12500.00",
      netFlow: "150000.00"
    },
    {
      date: "2024-11-02",
      depositAmount: "1300000.00",
      withdrawalAmount: "1150000.00",
      feeIncome: "13200.00",
      netFlow: "150000.00"
    },
    {
      date: "2024-11-03",
      depositAmount: "1100000.00",
      withdrawalAmount: "1200000.00",
      feeIncome: "11800.00",
      netFlow: "-100000.00"
    },
    {
      date: "2024-11-04",
      depositAmount: "1400000.00",
      withdrawalAmount: "1050000.00",
      feeIncome: "14500.00",
      netFlow: "350000.00"
    },
    {
      date: "2024-11-05",
      depositAmount: "1280000.00",
      withdrawalAmount: "1180000.00",
      feeIncome: "12900.00",
      netFlow: "100000.00"
    },
    {
      date: "2024-11-06",
      depositAmount: "1150000.00",
      withdrawalAmount: "1250000.00",
      feeIncome: "11200.00",
      netFlow: "-100000.00"
    },
    {
      date: "2024-11-07",
      depositAmount: "1350000.00",
      withdrawalAmount: "1100000.00",
      feeIncome: "14200.00",
      netFlow: "250000.00"
    },
    {
      date: "2024-11-08",
      depositAmount: "1200000.00",
      withdrawalAmount: "1050000.00",
      feeIncome: "12500.00",
      netFlow: "150000.00"
    }
  ];
  
  mockData.feeIncomeData = [
    {
      date: "2024-11-08",
      feeType: "trading",
      income: "8500.00",
      currency: "USDT"
    },
    {
      date: "2024-11-08",
      feeType: "withdrawal",
      income: "4000.00",
      currency: "USDT"
    }
  ];
  
  mockData.retentionData = [
    {
      date: "2024-11-08",
      day1: 0.85,
      day7: 0.65,
      day30: 0.35,
      day90: 0.15
    },
    {
      date: "2024-11-07",
      day1: 0.82,
      day7: 0.62,
      day30: 0.32,
      day90: 0.12
    }
  ];
  
  mockData.funnelData = [
    {
      stage: "Registered",
      count: 120,
      conversion: 100
    },
    {
      stage: "Verified",
      count: 85,
      conversion: 70.8
    },
    {
      stage: "Deposited",
      count: 42,
      conversion: 35.0
    },
    {
      stage: "Traded",
      count: 32,
      conversion: 26.7
    }
  ];
}

/**
 * Handler for listing trade reports
 */
export async function handleListTradeReports(params: TradeReportQueryParams = {}): Promise<TradeReportListResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
  
  // Apply filters if provided
  let filteredReports = [...mockData.tradeReports]
  
  if (params.symbol) {
    filteredReports = filteredReports.filter(report => report.symbol === params.symbol)
  }
  
  if (params.startDate) {
    filteredReports = filteredReports.filter(report => report.date >= params.startDate)
  }
  
  if (params.endDate) {
    filteredReports = filteredReports.filter(report => report.date <= params.endDate)
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredReports = filteredReports.filter(report => 
      report.id.toLowerCase().includes(searchTerm) || 
      report.symbol.toLowerCase().includes(searchTerm)
    )
  }
  
  // Apply sorting if provided
  if (params.sortField) {
    filteredReports.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA)
      }
      
      if (params.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0
      }
    })
  }
  
  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize)
  
  return {
    data: paginatedReports,
    total: filteredReports.length,
    page,
    pageSize
  }
}

/**
 * Handler for listing finance reports
 */
export async function handleListFinanceReports(params: FinanceReportQueryParams = {}): Promise<FinanceReportListResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
  
  // Apply filters if provided
  let filteredReports = [...mockData.financeReports]
  
  if (params.currency) {
    filteredReports = filteredReports.filter(report => 
      report.depositAmount.includes(params.currency!) || 
      report.withdrawalAmount.includes(params.currency!)
    )
  }
  
  if (params.startDate) {
    filteredReports = filteredReports.filter(report => report.date >= params.startDate)
  }
  
  if (params.endDate) {
    filteredReports = filteredReports.filter(report => report.date <= params.endDate)
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredReports = filteredReports.filter(report => 
      report.id.toLowerCase().includes(searchTerm) ||
      report.date.toLowerCase().includes(searchTerm)
    )
  }
  
  // Apply sorting if provided
  if (params.sortField) {
    filteredReports.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA)
      }
      
      if (params.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0
      }
    })
  }
  
  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize)
  
  return {
    data: paginatedReports,
    total: filteredReports.length,
    page,
    pageSize
  }
}

/**
 * Handler for listing retention reports
 */
export async function handleListRetentionReports(params: RetentionReportQueryParams = {}): Promise<RetentionReportListResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
  
  // Apply filters if provided
  let filteredReports = [...mockData.retentionReports]
  
  if (params.startDate) {
    filteredReports = filteredReports.filter(report => report.date >= params.startDate)
  }
  
  if (params.endDate) {
    filteredReports = filteredReports.filter(report => report.date <= params.endDate)
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredReports = filteredReports.filter(report => 
      report.id.toLowerCase().includes(searchTerm) ||
      report.date.toLowerCase().includes(searchTerm)
    )
  }
  
  // Apply sorting if provided
  if (params.sortField) {
    filteredReports.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA)
      }
      
      if (params.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0
      }
    })
  }
  
  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize)
  
  return {
    data: paginatedReports,
    total: filteredReports.length,
    page,
    pageSize
  }
}

/**
 * Handler for getting trade daily data
 */
export async function handleGetTradeDailyData(params: { startDate?: string; endDate?: string; symbol?: string }): Promise<TradeDailyData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100))
  
  let filteredData = [...mockData.tradeDailyData]
  
  if (params.startDate) {
    filteredData = filteredData.filter(item => item.date >= params.startDate)
  }
  
  if (params.endDate) {
    filteredData = filteredData.filter(item => item.date <= params.endDate)
  }
  
  if (params.symbol) {
    // In a real implementation, this would filter by symbol
    // For mock, we'll return all data but pretend to filter
  }
  
  return filteredData
}

/**
 * Handler for getting symbol volume data
 */
export async function handleGetSymbolVolumeData(params: { startDate?: string; endDate?: string; currency?: string }): Promise<SymbolVolumeData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100))
  
  let filteredData = [...mockData.symbolVolumeData]
  
  if (params.currency) {
    filteredData = filteredData.filter(item => item.symbol.includes(params.currency!))
  }
  
  return filteredData
}

/**
 * Handler for getting finance daily data
 */
export async function handleGetFinanceDailyData(params: { startDate?: string; endDate?: string; currency?: string }): Promise<FinanceDailyData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100))
  
  let filteredData = [...mockData.financeDailyData]
  
  if (params.startDate) {
    filteredData = filteredData.filter(item => item.date >= params.startDate)
  }
  
  if (params.endDate) {
    filteredData = filteredData.filter(item => item.date <= params.endDate)
  }
  
  return filteredData
}

/**
 * Handler for getting fee income data
 */
export async function handleGetFeeIncomeData(params: { startDate?: string; endDate?: string; feeType?: string; currency?: string }): Promise<FeeIncomeData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100))
  
  let filteredData = [...mockData.feeIncomeData]
  
  if (params.feeType) {
    filteredData = filteredData.filter(item => item.feeType === params.feeType)
  }
  
  if (params.currency) {
    filteredData = filteredData.filter(item => item.currency === params.currency)
  }
  
  if (params.startDate) {
    filteredData = filteredData.filter(item => item.date >= params.startDate)
  }
  
  if (params.endDate) {
    filteredData = filteredData.filter(item => item.date <= params.endDate)
  }
  
  return filteredData
}

/**
 * Handler for getting retention data
 */
export async function handleGetRetentionData(params: { startDate?: string; endDate?: string; period?: string }): Promise<RetentionData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100))
  
  let filteredData = [...mockData.retentionData]
  
  if (params.startDate) {
    filteredData = filteredData.filter(item => item.date >= params.startDate)
  }
  
  if (params.endDate) {
    filteredData = filteredData.filter(item => item.date <= params.endDate)
  }
  
  return filteredData
}

/**
 * Handler for getting funnel data
 */
export async function handleGetFunnelData(params: { startDate?: string; endDate?: string; step?: string }): Promise<FunnelData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100))
  
  // The funnel data represents the same set of stages but could be filtered by date params
  let filteredData = [...mockData.funnelData]
  
  return filteredData
}

/**
 * Handler for exporting trade report
 */
export async function handleExportTradeReport(params: ExportReportParams): Promise<Blob> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300))
  
  // Create mock CSV data
  const csvContent = "id,symbol,date,volume,turnover,trades,takerBuyVolume,takerBuyTurnover\n" +
    mockData.tradeReports.map(item => 
      `"${item.id}","${item.symbol}","${item.date}","${item.volume}","${item.turnover}",${item.trades},"${item.takerBuyVolume}","${item.takerBuyTurnover}"`
    ).join('\n');
  
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
}

/**
 * Handler for exporting finance report
 */
export async function handleExportFinanceReport(params: ExportReportParams): Promise<Blob> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300))
  
  // Create mock CSV data
  const csvContent = "id,date,depositAmount,depositCount,withdrawalAmount,withdrawalCount,feeIncome,userCount,activeUserCount\n" +
    mockData.financeReports.map(item => 
      `"${item.id}","${item.date}","${item.depositAmount}",${item.depositCount},"${item.withdrawalAmount}",${item.withdrawalCount},"${item.feeIncome}",${item.userCount},${item.activeUserCount}`
    ).join('\n');
  
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
}

/**
 * Handler for exporting retention report
 */
export async function handleExportRetentionReport(params: ExportReportParams): Promise<Blob> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300))
  
  // Create mock CSV data
  const csvContent = "id,date,newUserCount,day1,day7,day30,day90,mtd,qtd,ytd\n" +
    mockData.retentionReports.map(item => 
      `"${item.id}","${item.date}",${item.newUserCount},${item.day1},${item.day7},${item.day30},${item.day90},${item.mtd},${item.qtd},${item.ytd}`
    ).join('\n');
  
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
}