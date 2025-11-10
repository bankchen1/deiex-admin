/**
 * Assets Mock Handlers
 *
 * Mock handlers that align with the contracts defined in src/contracts/assets.ts
 * All responses must pass contract validation
 */

import type {
  DepositListResponse,
  WithdrawalListResponse,
  WalletAddressListResponse,
  DepositDetailResponse,
  WithdrawalDetailResponse,
  DepositQueryParams,
  WithdrawalQueryParams,
  WalletAddressQueryParams,
  UpdateDepositNotesPayload,
  ApproveWithdrawalPayload,
  RejectWithdrawalPayload,
  CreateWalletAddressPayload,
} from '@/contracts/assets'

// Load mock data
let mockData = {
  deposits: [] as any[],
  withdrawals: [] as any[],
  walletAddresses: [] as any[],
}

// Initialize mock data if not done already
if (mockData.deposits.length === 0) {
  mockData.deposits = [
    {
      id: 'dep_001',
      userId: 'user_001',
      userNickname: 'Alice Johnson',
      currency: 'BTC',
      chain: 'Bitcoin',
      txHash: '0x97ddae01a98b1974b78f56d2c9b0e3d917c8a3b1c2d4e5f6a7b8c9d0e1f2a3b4',
      amount: '0.50000000',
      status: 'completed',
      confirmations: 6,
      requiredConfirmations: 6,
      riskFlags: [],
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      createdAt: '2024-11-01T10:30:00Z',
      completedAt: '2024-11-01T11:15:00Z',
      notes: 'Large deposit from cold wallet',
    },
    {
      id: 'dep_002',
      userId: 'user_002',
      userNickname: 'Bob Smith',
      currency: 'ETH',
      chain: 'Ethereum',
      txHash: '0x86ccfd02b8a92974b78f56d2c9b0e3d917c8a3b1c2d4e5f6a7b8c9d0e1f2a3c5',
      amount: '5.25000000',
      status: 'confirming',
      confirmations: 3,
      requiredConfirmations: 12,
      riskFlags: [],
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      createdAt: '2024-11-07T14:20:00Z',
      notes: 'Regular deposit',
    },
    {
      id: 'dep_003',
      userId: 'user_003',
      userNickname: 'Carol Davis',
      currency: 'USDT',
      chain: 'Tron',
      txHash: '0x75bbec03c9b03985c89f67ad3a1b4c8e28d9f3a1b2c3d4e5f6a7b8c9d0e1f2a4',
      amount: '2500.00',
      status: 'pending',
      confirmations: 0,
      requiredConfirmations: 1,
      riskFlags: ['high_risk'],
      riskScore: 85,
      address: 'TQrY8jt1H2n74dBvpvDh6T3X2gDGftF6zb',
      createdAt: '2024-11-08T09:15:00Z',
      notes: 'Flagged for review',
    },
    {
      id: 'dep_004',
      userId: 'user_004',
      userNickname: 'David Wilson',
      currency: 'SOL',
      chain: 'Solana',
      txHash: '0x64a9bc04d8b23985c89f67ad3a1b4c8e28d9f3a1b2c3d4e5f6a7b8c9d0e1f2a5',
      amount: '100.00000000',
      status: 'pending',
      confirmations: 0,
      requiredConfirmations: 1,
      riskFlags: [],
      address: '9WzDXwBbmkg8ZTbNMdikMzWz95MdD1uP2FfBWy6uqo7Z',
      createdAt: '2024-11-08T08:30:00Z',
      notes: 'Regular deposit',
    },
    {
      id: 'dep_005',
      userId: 'user_005',
      userNickname: 'Emma Thompson',
      currency: 'USDC',
      chain: 'Ethereum',
      txHash: '0x5398dc05e7a34985c89f67ad3a1b4c8e28d9f3a1b2c3d4e5f6a7b8c9d0e1f2a6',
      amount: '500.00',
      status: 'completed',
      confirmations: 34,
      requiredConfirmations: 20,
      riskFlags: [],
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      createdAt: '2024-11-07T16:45:00Z',
      completedAt: '2024-11-07T17:20:00Z',
      notes: 'USD stablecoin deposit',
    },
  ]

  mockData.withdrawals = [
    {
      id: 'wd_001',
      userId: 'user_004',
      userNickname: 'David Wilson',
      currency: 'BTC',
      chain: 'Bitcoin',
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      amount: '0.25000000',
      fee: '0.00050000',
      status: 'completed',
      riskScore: 20,
      matchedRules: [],
      approvals: [
        {
          role: 'admin',
          adminId: 'admin_001',
          adminName: 'John Admin',
          action: 'approve',
          timestamp: '2024-10-30T12:30:00Z',
        },
      ],
      txHash: '0xa8eebf04d9a12974b78f56d2c9b0e3d917c8a3b1c2d4e5f6a7b8c9d0e1f2a5b6',
      createdAt: '2024-10-30T10:15:00Z',
      completedAt: '2024-10-30T14:45:00Z',
      notes: 'VIP customer withdrawal',
    },
    {
      id: 'wd_002',
      userId: 'user_001',
      userNickname: 'Alice Johnson',
      currency: 'ETH',
      chain: 'Ethereum',
      address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      amount: '2.50000000',
      fee: '0.01000000',
      status: 'processing',
      riskScore: 45,
      matchedRules: [],
      approvals: [
        {
          role: 'supervisor',
          adminId: 'admin_002',
          adminName: 'Sarah Supervisor',
          action: 'approve',
          timestamp: '2024-11-01T16:20:00Z',
        },
      ],
      createdAt: '2024-11-01T15:30:00Z',
      notes: 'Standard withdrawal',
    },
    {
      id: 'wd_003',
      userId: 'user_005',
      userNickname: 'Emma Thompson',
      currency: 'USDT',
      chain: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      amount: '1000.00',
      fee: '1.00',
      status: 'reviewing',
      riskScore: 80,
      matchedRules: ['large_amount', 'new_user'],
      approvals: [],
      createdAt: '2024-11-08T08:45:00Z',
      notes: 'Under review due to high risk score',
    },
    {
      id: 'wd_004',
      userId: 'user_002',
      userNickname: 'Bob Smith',
      currency: 'SOL',
      chain: 'Solana',
      address: '9WzDXwBbmkg8ZTbNMdikMzWz95MdD1uP2FfBWy6uqo7Z',
      amount: '50.00000000',
      fee: '0.10000000',
      status: 'pending',
      riskScore: 30,
      matchedRules: [],
      approvals: [],
      createdAt: '2024-11-08T09:00:00Z',
      notes: 'Standard withdrawal',
    },
  ]

  mockData.walletAddresses = [
    {
      id: 'wa_001',
      chain: 'Bitcoin',
      type: 'hot',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      label: 'Main Hot Wallet',
      balance: '10.25000000',
      balanceUsd: 615000.0,
      status: 'active',
      createdAt: '2023-01-01T00:00:00Z',
      lastSyncAt: '2024-11-08T09:00:00Z',
    },
    {
      id: 'wa_002',
      chain: 'Ethereum',
      type: 'cold',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      label: 'Cold Storage',
      balance: '500.00000000',
      balanceUsd: 1500000.0,
      status: 'active',
      createdAt: '2023-01-02T00:00:00Z',
      lastSyncAt: '2024-11-07T23:00:00Z',
    },
    {
      id: 'wa_003',
      chain: 'Tron',
      type: 'hot',
      address: 'TQrY8jt1H2n74dBvpvDh6T3X2gDGftF6zb',
      label: 'TRC20 Hot Wallet',
      balance: '50000.00',
      balanceUsd: 50000.0,
      status: 'maintenance',
      createdAt: '2023-06-01T00:00:00Z',
      lastSyncAt: '2024-11-05T10:00:00Z',
    },
    {
      id: 'wa_004',
      chain: 'Solana',
      type: 'hot',
      address: '9WzDXwBbmkg8ZTbNMdikMzWz95MdD1uP2FfBWy6uqo7Z',
      label: 'Solana Hot Wallet',
      balance: '1000.00000000',
      balanceUsd: 150000.0,
      status: 'active',
      createdAt: '2024-01-15T00:00:00Z',
      lastSyncAt: '2024-11-08T08:00:00Z',
    },
  ]
}

/**
 * Handler for listing deposits with pagination and filtering
 */
export async function handleListDeposits(params: DepositQueryParams): Promise<DepositListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Apply filters if provided
  let filteredDeposits = [...mockData.deposits]

  if (params.status) {
    filteredDeposits = filteredDeposits.filter((deposit) => deposit.status === params.status)
  }

  if (params.currency) {
    filteredDeposits = filteredDeposits.filter((deposit) => deposit.currency === params.currency)
  }

  if (params.chain) {
    filteredDeposits = filteredDeposits.filter((deposit) => deposit.chain === params.chain)
  }

  if (params.userId) {
    filteredDeposits = filteredDeposits.filter((deposit) => deposit.userId === params.userId)
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredDeposits = filteredDeposits.filter(
      (deposit) =>
        deposit.id.toLowerCase().includes(searchTerm) ||
        (deposit.userNickname && deposit.userNickname.toLowerCase().includes(searchTerm)) ||
        (deposit.txHash && deposit.txHash.toLowerCase().includes(searchTerm)) ||
        (deposit.address && deposit.address.toLowerCase().includes(searchTerm))
    )
  }

  // Apply sorting if provided
  if (params.sortField) {
    filteredDeposits.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
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
  const paginatedDeposits = filteredDeposits.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedDeposits,
    total: filteredDeposits.length,
    page,
    pageSize,
  }
}

/**
 * Handler for listing withdrawals with pagination and filtering
 */
export async function handleListWithdrawals(
  params: WithdrawalQueryParams
): Promise<WithdrawalListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Apply filters if provided
  let filteredWithdrawals = [...mockData.withdrawals]

  if (params.status) {
    filteredWithdrawals = filteredWithdrawals.filter(
      (withdrawal) => withdrawal.status === params.status
    )
  }

  if (params.currency) {
    filteredWithdrawals = filteredWithdrawals.filter(
      (withdrawal) => withdrawal.currency === params.currency
    )
  }

  if (params.chain) {
    filteredWithdrawals = filteredWithdrawals.filter(
      (withdrawal) => withdrawal.chain === params.chain
    )
  }

  if (params.userId) {
    filteredWithdrawals = filteredWithdrawals.filter(
      (withdrawal) => withdrawal.userId === params.userId
    )
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredWithdrawals = filteredWithdrawals.filter(
      (withdrawal) =>
        withdrawal.id.toLowerCase().includes(searchTerm) ||
        (withdrawal.userNickname && withdrawal.userNickname.toLowerCase().includes(searchTerm)) ||
        (withdrawal.address && withdrawal.address.toLowerCase().includes(searchTerm))
    )
  }

  // Apply sorting if provided
  if (params.sortField) {
    filteredWithdrawals.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
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
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedWithdrawals,
    total: filteredWithdrawals.length,
    page,
    pageSize,
  }
}

/**
 * Handler for listing wallet addresses with pagination and filtering
 */
export async function handleListWalletAddresses(
  params: WalletAddressQueryParams
): Promise<WalletAddressListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Apply filters if provided
  let filteredAddresses = [...mockData.walletAddresses]

  if (params.type) {
    filteredAddresses = filteredAddresses.filter((addr) => addr.type === params.type)
  }

  if (params.chain) {
    filteredAddresses = filteredAddresses.filter((addr) => addr.chain === params.chain)
  }

  if (params.status) {
    filteredAddresses = filteredAddresses.filter((addr) => addr.status === params.status)
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredAddresses = filteredAddresses.filter(
      (addr) =>
        addr.id.toLowerCase().includes(searchTerm) ||
        (addr.label && addr.label.toLowerCase().includes(searchTerm)) ||
        (addr.address && addr.address.toLowerCase().includes(searchTerm))
    )
  }

  // Apply sorting if provided
  if (params.sortField) {
    filteredAddresses.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
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
  const paginatedAddresses = filteredAddresses.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedAddresses,
    total: filteredAddresses.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting a deposit by ID
 */
export async function handleGetDepositById(id: string): Promise<DepositDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const deposit = mockData.deposits.find((d) => d.id === id)
  if (!deposit) {
    throw new Error(`Deposit with ID ${id} not found`)
  }

  return {
    deposit,
    transactionHistory: [
      {
        id: 'th_001',
        status: 'received',
        timestamp: new Date(new Date(deposit.createdAt).getTime() + 5 * 60000).toISOString(), // 5 mins after creation
        confirmations: 1,
      },
      {
        id: 'th_002',
        status: deposit.status === 'completed' ? 'confirmed' : deposit.status,
        timestamp: deposit.completedAt || new Date().toISOString(),
        confirmations: deposit.confirmations,
      },
    ],
    auditTrail: [
      {
        id: 'at_001',
        action: 'DEPOSIT_RECEIVED',
        timestamp: deposit.createdAt,
        by: 'system',
        details: 'Deposit received on chain',
      },
      {
        id: 'at_002',
        action: deposit.status === 'completed' ? 'DEPOSIT_COMPLETED' : 'DEPOSIT_STATUS_UPDATED',
        timestamp: deposit.completedAt || deposit.createdAt,
        by: deposit.status === 'completed' ? 'system' : 'risk_engine',
        details:
          deposit.status === 'completed'
            ? 'Deposit completed and credited'
            : `Deposit status updated to ${deposit.status}`,
      },
    ],
  }
}

/**
 * Handler for getting a withdrawal by ID
 */
export async function handleGetWithdrawalById(id: string): Promise<WithdrawalDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const withdrawal = mockData.withdrawals.find((w) => w.id === id)
  if (!withdrawal) {
    throw new Error(`Withdrawal with ID ${id} not found`)
  }

  return {
    withdrawal,
    transactionHistory: [
      {
        id: 'th_001',
        status: 'requested',
        timestamp: withdrawal.createdAt,
      },
      {
        id: 'th_002',
        status: withdrawal.status === 'reviewing' ? 'reviewing' : withdrawal.status,
        timestamp:
          withdrawal.approvals.length > 0
            ? withdrawal.approvals[0].timestamp
            : withdrawal.createdAt,
      },
      {
        id: 'th_003',
        status: withdrawal.status === 'completed' ? 'completed' : withdrawal.status,
        timestamp: withdrawal.completedAt || new Date().toISOString(),
      },
    ],
    auditTrail: [
      {
        id: 'at_001',
        action: 'WITHDRAWAL_REQUESTED',
        timestamp: withdrawal.createdAt,
        by: withdrawal.userId,
        details: 'Withdrawal request submitted',
      },
      ...withdrawal.approvals.map((approval) => ({
        id: `at_${approval.adminId}`,
        action: approval.action === 'approve' ? 'WITHDRAWAL_APPROVED' : 'WITHDRAWAL_REJECTED',
        timestamp: approval.timestamp,
        by: approval.adminName,
        details: `${approval.action === 'approve' ? 'Approved' : 'Rejected'} by ${approval.role}`,
      })),
      {
        id: 'at_002',
        action:
          withdrawal.status === 'completed' ? 'WITHDRAWAL_PROCESSED' : 'WITHDRAWAL_STATUS_UPDATED',
        timestamp: withdrawal.completedAt || new Date().toISOString(),
        by: withdrawal.status === 'completed' ? 'system' : 'risk_engine',
        details:
          withdrawal.status === 'completed'
            ? 'Withdrawal processed and sent'
            : `Withdrawal status updated to ${withdrawal.status}`,
      },
    ],
  }
}

/**
 * Handler for updating deposit notes
 */
export async function handleUpdateDepositNotes(
  id: string,
  payload: UpdateDepositNotesPayload
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const depositIndex = mockData.deposits.findIndex((d) => d.id === id)
  if (depositIndex === -1) {
    throw new Error(`Deposit with ID ${id} not found`)
  }

  // Update the deposit's notes
  mockData.deposits[depositIndex] = {
    ...mockData.deposits[depositIndex],
    notes: payload.notes,
  }

  // Return updated deposit
  return mockData.deposits[depositIndex]
}

/**
 * Handler for approving a withdrawal
 */
export async function handleApproveWithdrawal(
  id: string,
  payload: ApproveWithdrawalPayload
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const withdrawalIndex = mockData.withdrawals.findIndex((w) => w.id === id)
  if (withdrawalIndex === -1) {
    throw new Error(`Withdrawal with ID ${id} not found`)
  }

  // Add approval to the withdrawal
  const newApproval = {
    role: 'admin',
    adminId: 'admin_current', // This would be determined from auth context
    adminName: 'Current Admin',
    action: 'approve' as const,
    timestamp: new Date().toISOString(),
    ...(payload.notes && { notes: payload.notes }),
  }

  mockData.withdrawals[withdrawalIndex] = {
    ...mockData.withdrawals[withdrawalIndex],
    approvals: [...mockData.withdrawals[withdrawalIndex].approvals, newApproval],
    status:
      mockData.withdrawals[withdrawalIndex].status === 'pending'
        ? 'approved'
        : mockData.withdrawals[withdrawalIndex].status,
  }

  // Return updated withdrawal
  return mockData.withdrawals[withdrawalIndex]
}

/**
 * Handler for rejecting a withdrawal
 */
export async function handleRejectWithdrawal(
  id: string,
  payload: RejectWithdrawalPayload
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const withdrawalIndex = mockData.withdrawals.findIndex((w) => w.id === id)
  if (withdrawalIndex === -1) {
    throw new Error(`Withdrawal with ID ${id} not found`)
  }

  // Add rejection approval to the withdrawal
  const newApproval = {
    role: 'admin',
    adminId: 'admin_current', // This would be determined from auth context
    adminName: 'Current Admin',
    action: 'reject' as const,
    reason: payload.reason,
    timestamp: new Date().toISOString(),
    ...(payload.notes && { notes: payload.notes }),
  }

  mockData.withdrawals[withdrawalIndex] = {
    ...mockData.withdrawals[withdrawalIndex],
    approvals: [...mockData.withdrawals[withdrawalIndex].approvals, newApproval],
    status: 'rejected',
    rejectedReason: payload.reason,
    notes: payload.notes || mockData.withdrawals[withdrawalIndex].notes,
  }

  // Return updated withdrawal
  return mockData.withdrawals[withdrawalIndex]
}

/**
 * Handler for creating a wallet address
 */
export async function handleCreateWalletAddress(payload: CreateWalletAddressPayload): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500))

  const newWalletAddress = {
    id: `wa_${Date.now()}`,
    chain: payload.chain,
    type: payload.type,
    address: payload.address,
    label: payload.label,
    balance: '0.00000000',
    balanceUsd: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
  }

  mockData.walletAddresses.push(newWalletAddress)

  // Return created wallet address
  return newWalletAddress
}
