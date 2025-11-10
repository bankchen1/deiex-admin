/**
 * Calendar Mock Handlers
 *
 * Mock handlers that align with the contracts defined in src/contracts/calendar.ts
 * All responses must pass contract validation
 */

import type {
  FundingRuleListResponse,
  MaintenanceWindowListResponse,
  AnnouncementListResponse,
  FundingRuleDetailResponse,
  MaintenanceWindowDetailResponse,
  AnnouncementDetailResponse,
  FundingRuleQueryParams,
  MaintenanceWindowQueryParams,
  AnnouncementQueryParams,
  CreateFundingRulePayload,
  UpdateFundingRulePayload,
  CreateMaintenanceWindowPayload,
  UpdateMaintenanceWindowPayload,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
  PublishPayload,
  ImportPayload,
  ExportParams,
  Version,
  VersionQueryParams,
  CalendarStats,
} from '@/contracts/calendar'

// Load mock data
let mockData = {
  fundingRules: [] as any[],
  maintenanceWindows: [] as any[],
  announcements: [] as any[],
  versions: [] as any[],
}

// Initialize mock data if not done already
if (mockData.fundingRules.length === 0) {
  mockData.fundingRules = [
    {
      id: 'fr_001',
      symbol: 'BTCUSDT',
      period: 8,
      calculationRule: 'premiumIndex',
      enabled: true,
      status: 'published',
      version: 'v1.2.0',
      nextFundingTime: '2024-11-09T00:00:00Z',
      createdAt: '2024-01-15T09:30:00Z',
      updatedAt: '2024-11-01T14:22:45Z',
      createdBy: 'admin_001',
    },
    {
      id: 'fr_002',
      symbol: 'ETHUSDT',
      period: 8,
      calculationRule: 'premiumIndex',
      enabled: true,
      status: 'draft',
      version: 'v2.0.0',
      nextFundingTime: null,
      createdAt: '2024-11-05T11:45:00Z',
      updatedAt: '2024-11-05T11:45:00Z',
      createdBy: 'admin_002',
    },
  ]

  mockData.maintenanceWindows = [
    {
      id: 'mw_001',
      title: 'System Maintenance',
      description: 'Scheduled system maintenance for upgrading infrastructure',
      startTime: '2024-11-10T02:00:00Z',
      endTime: '2024-11-10T06:00:00Z',
      affectedScope: ['trading', 'deposit', 'withdrawal'],
      announcementPush: true,
      status: 'published',
      version: 'v1.0.0',
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-11-01T14:22:45Z',
      createdBy: 'admin_001',
    },
  ]

  mockData.announcements = [
    {
      id: 'an_001',
      title: {
        en: 'New Trading Pair Added',
        zh: '新增交易对',
        ja: '新しい取引ペア追加',
        ko: '새로운 거래 쌍 추가',
      },
      content: {
        en: 'We have added a new trading pair BTC/DOGE to our platform.',
        zh: '我们已在平台上新增交易对 BTC/DOGE。',
        ja: 'プラットフォームに新しい取引ペア BTC/DOGE を追加しました。',
        ko: '플랫폼에 새로운 거래 쌍 BTC/DOGE가 추가되었습니다.',
      },
      type: 'update',
      pinned: true,
      pushChannels: ['email', 'push', 'in_app'],
      publishTime: '2024-10-15T08:00:00Z',
      status: 'published',
      version: 'v1.5.0',
      createdAt: '2024-10-10T09:30:00Z',
      updatedAt: '2024-10-10T09:30:00Z',
      createdBy: 'admin_003',
    },
  ]

  mockData.versions = [
    {
      id: 'v_001',
      version: 'v1.0.0',
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'admin_001',
      notes: 'Initial release',
      tags: ['release', 'stable'],
    },
    {
      id: 'v_002',
      version: 'v1.1.0',
      createdAt: '2024-06-01T00:00:00Z',
      createdBy: 'admin_002',
      notes: 'Added new features',
      tags: ['feature', 'enhancement'],
    },
  ]
}

/**
 * Handler for getting published funding rules
 */
export async function handleGetPublishedFunding(
  params: FundingRuleQueryParams = {}
): Promise<FundingRuleListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Filter published funding rules
  const publishedRules = mockData.fundingRules.filter((rule) => rule.status === 'published')

  // Apply filters and pagination
  let filteredRules = [...publishedRules]

  if (params.symbol) {
    filteredRules = filteredRules.filter((rule) => rule.symbol === params.symbol)
  }

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedRules = filteredRules.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedRules,
    total: filteredRules.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting draft funding rules
 */
export async function handleGetDraftFunding(
  params: FundingRuleQueryParams = {}
): Promise<FundingRuleListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Filter draft funding rules
  const draftRules = mockData.fundingRules.filter((rule) => rule.status === 'draft')

  // Apply filters and pagination
  let filteredRules = [...draftRules]

  if (params.symbol) {
    filteredRules = filteredRules.filter((rule) => rule.symbol === params.symbol)
  }

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedRules = filteredRules.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedRules,
    total: filteredRules.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting funding rule by ID
 */
export async function handleGetFundingById(
  id: string,
  isDraft = false
): Promise<FundingRuleDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const statusFilter = isDraft ? 'draft' : 'published'
  const fundingRule = mockData.fundingRules.find(
    (rule) => rule.id === id && rule.status === statusFilter
  )

  if (!fundingRule) {
    throw new Error(`Funding rule with ID ${id} not found`)
  }

  return {
    rule: fundingRule,
  }
}

/**
 * Handler for creating draft funding rule
 */
export async function handleCreateDraftFunding(
  payload: CreateFundingRulePayload
): Promise<FundingRule> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const newRule = {
    id: `fr_${Date.now()}`,
    ...payload,
    status: 'draft' as const,
    version: 'v1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current_user',
  }

  mockData.fundingRules.push(newRule)
  return newRule
}

/**
 * Handler for updating draft funding rule
 */
export async function handleUpdateDraftFunding(
  id: string,
  payload: UpdateFundingRulePayload
): Promise<FundingRule> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const index = mockData.fundingRules.findIndex((rule) => rule.id === id && rule.status === 'draft')
  if (index === -1) {
    throw new Error(`Draft funding rule with ID ${id} not found`)
  }

  mockData.fundingRules[index] = {
    ...mockData.fundingRules[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  return mockData.fundingRules[index]
}

/**
 * Handler for deleting draft funding rule
 */
export async function handleDeleteDraftFunding(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 200))

  const initialLength = mockData.fundingRules.length
  mockData.fundingRules = mockData.fundingRules.filter(
    (rule) => !(rule.id === id && rule.status === 'draft')
  )
  const finalLength = mockData.fundingRules.length

  return initialLength !== finalLength
}

/**
 * Handler for getting published maintenance windows
 */
export async function handleGetPublishedMaintenance(
  params: MaintenanceWindowQueryParams = {}
): Promise<MaintenanceWindowListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Filter published maintenance windows
  const publishedWindows = mockData.maintenanceWindows.filter(
    (window) => window.status === 'published'
  )

  // Apply filters and pagination
  let filteredWindows = [...publishedWindows]

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedWindows = filteredWindows.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedWindows,
    total: filteredWindows.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting draft maintenance windows
 */
export async function handleGetDraftMaintenance(
  params: MaintenanceWindowQueryParams = {}
): Promise<MaintenanceWindowListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Filter draft maintenance windows
  const draftWindows = mockData.maintenanceWindows.filter((window) => window.status === 'draft')

  // Apply filters and pagination
  let filteredWindows = [...draftWindows]

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedWindows = filteredWindows.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedWindows,
    total: filteredWindows.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting maintenance window by ID
 */
export async function handleGetMaintenanceById(
  id: string,
  isDraft = false
): Promise<MaintenanceWindowDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const statusFilter = isDraft ? 'draft' : 'published'
  const maintenanceWindow = mockData.maintenanceWindows.find(
    (window) => window.id === id && window.status === statusFilter
  )

  if (!maintenanceWindow) {
    throw new Error(`Maintenance window with ID ${id} not found`)
  }

  return {
    window: maintenanceWindow,
  }
}

/**
 * Handler for creating draft maintenance window
 */
export async function handleCreateDraftMaintenance(
  payload: CreateMaintenanceWindowPayload
): Promise<MaintenanceWindow> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const newWindow = {
    id: `mw_${Date.now()}`,
    ...payload,
    status: 'draft' as const,
    version: 'v1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current_user',
  }

  mockData.maintenanceWindows.push(newWindow)
  return newWindow
}

/**
 * Handler for updating draft maintenance window
 */
export async function handleUpdateDraftMaintenance(
  id: string,
  payload: UpdateMaintenanceWindowPayload
): Promise<MaintenanceWindow> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const index = mockData.maintenanceWindows.findIndex(
    (window) => window.id === id && window.status === 'draft'
  )
  if (index === -1) {
    throw new Error(`Draft maintenance window with ID ${id} not found`)
  }

  mockData.maintenanceWindows[index] = {
    ...mockData.maintenanceWindows[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  return mockData.maintenanceWindows[index]
}

/**
 * Handler for deleting draft maintenance window
 */
export async function handleDeleteDraftMaintenance(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 200))

  const initialLength = mockData.maintenanceWindows.length
  mockData.maintenanceWindows = mockData.maintenanceWindows.filter(
    (window) => !(window.id === id && window.status === 'draft')
  )
  const finalLength = mockData.maintenanceWindows.length

  return initialLength !== finalLength
}

/**
 * Handler for getting published announcements
 */
export async function handleGetPublishedAnnouncements(
  params: AnnouncementQueryParams = {}
): Promise<AnnouncementListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Filter published announcements
  const publishedAnnouncements = mockData.announcements.filter(
    (announcement) => announcement.status === 'published'
  )

  // Apply filters and pagination
  let filteredAnnouncements = [...publishedAnnouncements]

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedAnnouncements,
    total: filteredAnnouncements.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting draft announcements
 */
export async function handleGetDraftAnnouncements(
  params: AnnouncementQueryParams = {}
): Promise<AnnouncementListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Filter draft announcements
  const draftAnnouncements = mockData.announcements.filter(
    (announcement) => announcement.status === 'draft'
  )

  // Apply filters and pagination
  let filteredAnnouncements = [...draftAnnouncements]

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedAnnouncements,
    total: filteredAnnouncements.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting announcement by ID
 */
export async function handleGetAnnouncementById(
  id: string,
  isDraft = false
): Promise<AnnouncementDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const statusFilter = isDraft ? 'draft' : 'published'
  const announcement = mockData.announcements.find(
    (ann) => ann.id === id && ann.status === statusFilter
  )

  if (!announcement) {
    throw new Error(`Announcement with ID ${id} not found`)
  }

  return {
    announcement,
  }
}

/**
 * Handler for creating draft announcement
 */
export async function handleCreateDraftAnnouncement(
  payload: CreateAnnouncementPayload
): Promise<Announcement> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const newAnnouncement = {
    id: `an_${Date.now()}`,
    ...payload,
    status: 'draft' as const,
    version: 'v1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current_user',
  }

  mockData.announcements.push(newAnnouncement)
  return newAnnouncement
}

/**
 * Handler for updating draft announcement
 */
export async function handleUpdateDraftAnnouncement(
  id: string,
  payload: UpdateAnnouncementPayload
): Promise<Announcement> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const index = mockData.announcements.findIndex((ann) => ann.id === id && ann.status === 'draft')
  if (index === -1) {
    throw new Error(`Draft announcement with ID ${id} not found`)
  }

  mockData.announcements[index] = {
    ...mockData.announcements[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  return mockData.announcements[index]
}

/**
 * Handler for deleting draft announcement
 */
export async function handleDeleteDraftAnnouncement(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 200))

  const initialLength = mockData.announcements.length
  mockData.announcements = mockData.announcements.filter(
    (ann) => !(ann.id === id && ann.status === 'draft')
  )
  const finalLength = mockData.announcements.length

  return initialLength !== finalLength
}

/**
 * Handler for getting all versions
 */
export async function handleGetVersions(): Promise<Version[]> {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))
  return mockData.versions
}

/**
 * Handler for getting diff between versions
 */
export async function handleGetDiff(): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))
  return {
    changes: [
      {
        id: 'change_001',
        type: 'funding_rule',
        action: 'modified',
        field: 'calculationRule',
        oldValue: 'markPrice',
        newValue: 'premiumIndex',
      },
    ],
    summary: {
      additions: 1,
      modifications: 2,
      deletions: 0,
    },
  }
}

/**
 * Handler for publishing
 */
export async function handlePublish(payload: PublishPayload): Promise<Version> {
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const newVersion = {
    id: `v_${Date.now()}`,
    version: `v${mockData.versions.length + 1}.0.0`,
    createdAt: new Date().toISOString(),
    createdBy: 'current_user',
    notes: payload.notes || 'Published via UI',
    tags: ['published'],
  }

  mockData.versions.push(newVersion)
  return newVersion
}

/**
 * Handler for rollback
 */
export async function handleRollback(versionId: string, notes: string): Promise<Version> {
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500))

  // For mock, just return the requested version
  const version = mockData.versions.find((v) => v.id === versionId)
  if (!version) {
    throw new Error(`Version with ID ${versionId} not found`)
  }

  return version
}

/**
 * Handler for validating time conflicts
 */
export async function handleValidateTimeConflicts(payload: any): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))
  // For mock, return no conflicts
  return true
}

/**
 * Handler for export
 */
export async function handleExportData(params: ExportParams): Promise<Blob> {
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500))
  const csvContent =
    'id,title,content,en,zh,ja,ko,createdAt\n' +
    'an_001,New Trading Pair Added,We have added new pairs,...'
  return new Blob([csvContent], { type: 'text/csv' })
}

/**
 * Handler for import
 */
export async function handleImportData(payload: ImportPayload): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500))
  return {
    success: true,
    imported: 5,
    skipped: 0,
    errors: [],
  }
}

/**
 * Handler for getting version history
 */
export async function handleGetVersionHistory(
  params: VersionQueryParams = {}
): Promise<{ data: Version[]; total: number; page: number; pageSize: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedVersions = mockData.versions.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedVersions,
    total: mockData.versions.length,
    page,
    pageSize,
  }
}
