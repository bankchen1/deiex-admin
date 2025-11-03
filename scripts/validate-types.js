#!/usr/bin/env node

/**
 * 前后端类型一致性验证脚本
 */

// 前端类型定义
const frontendTypes = {
  TradingFeeTemplate: {
    id: 'string',
    vipLevel: 'number',
    makerRate: 'number',
    takerRate: 'number',
    inheritFromPrevious: 'boolean',
    description: 'string?',
    status: "'draft' | 'published'",
    version: 'string',
    createdAt: 'string',
    updatedAt: 'string',
  },
  WithdrawalFeeTemplate: {
    id: 'string',
    currency: 'string',
    chain: 'string',
    fixedFee: 'string',
    percentageFee: 'number',
    minFee: 'string',
    dailyLimit: 'string',
    description: 'string?',
    status: "'draft' | 'published'",
    version: 'string',
    createdAt: 'string',
    updatedAt: 'string',
  },
  MarginTemplate: {
    id: 'string',
    name: 'string',
    description: 'string?',
    tiers: 'MarginTier[]',
    status: "'draft' | 'published'",
    version: 'string',
    createdAt: 'string',
    updatedAt: 'string',
  },
  MarginBinding: {
    symbol: 'string',
    templateId: 'string',
    templateName: 'string',
    status: "'draft' | 'published'",
    version: 'string',
    updatedAt: 'string',
  },
  MarginTier: {
    notionalFrom: 'string',
    notionalTo: 'string',
    initialMarginRate: 'number',
    maintenanceMarginRate: 'number',
    maxLeverage: 'number',
  },
}

// 后端类型定义（从 Go 结构体映射）
const backendTypes = {
  TradingFeeTemplate: {
    id: 'string',
    vipLevel: 'number',
    makerRate: 'number',
    takerRate: 'number',
    inheritFromPrevious: 'boolean',
    description: 'string?',
    status: "'draft' | 'published'",
    version: 'string',
    createdAt: 'string',
    updatedAt: 'string',
  },
  WithdrawalFeeTemplate: {
    id: 'string',
    currency: 'string',
    chain: 'string',
    fixedFee: 'string',
    percentageFee: 'number',
    minFee: 'string',
    dailyLimit: 'string',
    description: 'string?',
    status: "'draft' | 'published'",
    version: 'string',
    createdAt: 'string',
    updatedAt: 'string',
  },
  MarginTemplate: {
    id: 'string',
    name: 'string',
    description: 'string?',
    tiers: 'MarginTier[]',
    status: "'draft' | 'published'",
    version: 'string',
    createdAt: 'string',
    updatedAt: 'string',
  },
  MarginBinding: {
    symbol: 'string',
    templateId: 'string',
    templateName: 'string',
    status: "'draft' | 'published'",
    version: 'string',
    updatedAt: 'string',
  },
  MarginTier: {
    notionalFrom: 'string',
    notionalTo: 'string',
    initialMarginRate: 'number',
    maintenanceMarginRate: 'number',
    maxLeverage: 'number',
  },
}

/**
 * 比较类型定义
 */
function compareTypes(frontend, backend, typeName) {
  const errors = []
  const warnings = []

  // 检查前端是否有后端没有的字段
  for (const [field, frontendType] of Object.entries(frontend)) {
    if (!backend[field]) {
      warnings.push(`${typeName}: Frontend has field '${field}' which is missing in backend`)
      continue
    }

    const backendType = backend[field]
    if (frontendType !== backendType) {
      errors.push(
        `${typeName}: Field '${field}' type mismatch - Frontend: '${frontendType}', Backend: '${backendType}'`
      )
    }
  }

  // 检查后端是否有前端没有的字段
  for (const field of Object.keys(backend)) {
    if (!frontend[field]) {
      warnings.push(`${typeName}: Backend has field '${field}' which is missing in frontend`)
    }
  }

  return { errors, warnings }
}

/**
 * 验证所有类型
 */
function validateTypes() {
  console.log('🔍 验证前后端类型一致性...\n')

  let totalErrors = 0
  let totalWarnings = 0

  for (const [typeName, frontendType] of Object.entries(frontendTypes)) {
    const backendType = backendTypes[typeName]

    if (!backendType) {
      console.log(`❌ ${typeName}: Backend type definition missing`)
      totalErrors++
      continue
    }

    const { errors, warnings } = compareTypes(frontendType, backendType, typeName)

    if (errors.length > 0) {
      console.log(`❌ ${typeName} errors:`)
      errors.forEach((error) => console.log(`   - ${error}`))
      totalErrors += errors.length
    }

    if (warnings.length > 0) {
      console.log(`⚠️  ${typeName} warnings:`)
      warnings.forEach((warning) => console.log(`   - ${warning}`))
      totalWarnings += warnings.length
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log(`✅ ${typeName}: 类型一致`)
    }

    console.log('')
  }

  // 输出总结
  console.log('📊 验证总结:')
  console.log(`   错误: ${totalErrors}`)
  console.log(`   警告: ${totalWarnings}`)

  if (totalErrors > 0) {
    console.log('\n❌ 类型验证失败，请修复错误后重试')
    process.exit(1)
  } else if (totalWarnings > 0) {
    console.log('\n⚠️  类型验证通过，但存在警告')
  } else {
    console.log('\n✅ 所有类型验证通过！')
  }
}

/**
 * 主函数
 */
function main() {
  try {
    validateTypes()
  } catch (error) {
    console.error('❌ 类型验证失败:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { validateTypes }
