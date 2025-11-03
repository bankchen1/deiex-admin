#!/usr/bin/env node

/**
 * 前端 SDK 生成器
 * 基于后端 API 路由自动生成前端 API 客户端代码
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// API 路由配置
const API_ROUTES = {
  fees: {
    basePath: '/admin/config/fees',
    endpoints: {
      trading: {
        published: { method: 'GET', path: '/trading/published' },
        drafts: { method: 'GET', path: '/trading/drafts' },
        getById: { method: 'GET', path: '/trading/:id' },
        createDraft: { method: 'POST', path: '/trading/drafts' },
        updateDraft: { method: 'PUT', path: '/trading/drafts/:id' },
        deleteDraft: { method: 'DELETE', path: '/trading/drafts/:id' },
      },
      withdrawal: {
        published: { method: 'GET', path: '/withdrawal/published' },
        drafts: { method: 'GET', path: '/withdrawal/drafts' },
        getById: { method: 'GET', path: '/withdrawal/:id' },
        createDraft: { method: 'POST', path: '/withdrawal/drafts' },
        updateDraft: { method: 'PUT', path: '/withdrawal/drafts/:id' },
        deleteDraft: { method: 'DELETE', path: '/withdrawal/drafts/:id' },
      },
      version: {
        publish: { method: 'POST', path: '/publish' },
        getVersions: { method: 'GET', path: '/versions' },
        getVersion: { method: 'GET', path: '/versions/:versionId' },
        rollback: { method: 'POST', path: '/rollback/:versionId' },
        getDiff: { method: 'GET', path: '/diff' },
      },
      importExport: {
        export: { method: 'GET', path: '/export' },
        import: { method: 'POST', path: '/import' },
        validateImport: { method: 'POST', path: '/validate-import' },
      },
      calculator: {
        calculate: { method: 'POST', path: '/calculate' },
        validateConsistency: { method: 'GET', path: '/validate-consistency' },
      },
    },
  },
  margin: {
    basePath: '/admin/config/margin',
    endpoints: {
      templates: {
        published: { method: 'GET', path: '/templates/published' },
        drafts: { method: 'GET', path: '/templates/drafts' },
        getById: { method: 'GET', path: '/templates/:id' },
        createDraft: { method: 'POST', path: '/templates/drafts' },
        updateDraft: { method: 'PUT', path: '/templates/drafts/:id' },
        deleteDraft: { method: 'DELETE', path: '/templates/drafts/:id' },
      },
      bindings: {
        published: { method: 'GET', path: '/bindings/published' },
        drafts: { method: 'GET', path: '/bindings/drafts' },
        updateDraft: { method: 'POST', path: '/bindings/drafts' },
        batchBind: { method: 'POST', path: '/bindings/batch-bind' },
        batchUnbind: { method: 'POST', path: '/bindings/batch-unbind' },
      },
      version: {
        publish: { method: 'POST', path: '/publish' },
        getVersions: { method: 'GET', path: '/versions' },
        getVersion: { method: 'GET', path: '/versions/:versionId' },
        rollback: { method: 'POST', path: '/rollback/:versionId' },
        getDiff: { method: 'GET', path: '/diff' },
      },
      impact: {
        getImpactEstimation: { method: 'GET', path: '/impact-estimation' },
      },
      importExport: {
        export: { method: 'GET', path: '/export' },
        import: { method: 'POST', path: '/import' },
        validateImport: { method: 'POST', path: '/validate-import' },
      },
      calculator: {
        calculate: { method: 'POST', path: '/calculate' },
      },
    },
  },
  calendar: {
    basePath: '/admin/config/calendar',
    endpoints: {
      funding: {
        published: { method: 'GET', path: '/funding/published' },
        drafts: { method: 'GET', path: '/funding/drafts' },
        getById: { method: 'GET', path: '/funding/:id' },
        createDraft: { method: 'POST', path: '/funding/drafts' },
        updateDraft: { method: 'PUT', path: '/funding/drafts/:id' },
        deleteDraft: { method: 'DELETE', path: '/funding/drafts/:id' },
      },
      maintenance: {
        published: { method: 'GET', path: '/maintenance/published' },
        drafts: { method: 'GET', path: '/maintenance/drafts' },
        getById: { method: 'GET', path: '/maintenance/:id' },
        createDraft: { method: 'POST', path: '/maintenance/drafts' },
        updateDraft: { method: 'PUT', path: '/maintenance/drafts/:id' },
        deleteDraft: { method: 'DELETE', path: '/maintenance/drafts/:id' },
      },
      announcements: {
        published: { method: 'GET', path: '/announcements/published' },
        drafts: { method: 'GET', path: '/announcements/drafts' },
        getById: { method: 'GET', path: '/announcements/:id' },
        createDraft: { method: 'POST', path: '/announcements/drafts' },
        updateDraft: { method: 'PUT', path: '/announcements/drafts/:id' },
        deleteDraft: { method: 'DELETE', path: '/announcements/drafts/:id' },
      },
      version: {
        publish: { method: 'POST', path: '/publish' },
        getVersions: { method: 'GET', path: '/versions' },
        getVersion: { method: 'GET', path: '/versions/:versionId' },
        rollback: { method: 'POST', path: '/rollback/:versionId' },
        getDiff: { method: 'GET', path: '/diff' },
      },
      validation: {
        validateConflicts: { method: 'GET', path: '/validate-conflicts' },
      },
      importExport: {
        export: { method: 'GET', path: '/export' },
        import: { method: 'POST', path: '/import' },
      },
    },
  },
  icons: {
    basePath: '/admin/config/icons',
    endpoints: {
      assets: {
        get: { method: 'GET', path: '/assets' },
        getById: { method: 'GET', path: '/assets/:id' },
        create: { method: 'POST', path: '/assets' },
        update: { method: 'PUT', path: '/assets/:id' },
        delete: { method: 'DELETE', path: '/assets/:id' },
        replace: { method: 'POST', path: '/assets/:id/replace' },
        validate: { method: 'POST', path: '/assets/validate' },
        bulkUpload: { method: 'POST', path: '/assets/bulk-upload' },
        bulkDelete: { method: 'POST', path: '/assets/bulk-delete' },
        export: { method: 'GET', path: '/assets/export' },
      },
      mappings: {
        get: { method: 'GET', path: '/mappings' },
        getById: { method: 'GET', path: '/mappings/:id' },
        create: { method: 'POST', path: '/mappings' },
        update: { method: 'PUT', path: '/mappings/:id' },
        delete: { method: 'DELETE', path: '/mappings/:id' },
        export: { method: 'GET', path: '/mappings/export' },
      },
    },
  },
  mappings: {
    basePath: '/admin/config/mappings',
    endpoints: {
      navToApi: {
        get: { method: 'GET', path: '/nav-to-api' },
        getById: { method: 'GET', path: '/nav-to-api/:id' },
        create: { method: 'POST', path: '/nav-to-api' },
        update: { method: 'PUT', path: '/nav-to-api/:id' },
        delete: { method: 'DELETE', path: '/nav-to-api/:id' },
        validate: { method: 'POST', path: '/nav-to-api/validate' },
        bulkSync: { method: 'POST', path: '/nav-to-api/bulk-sync' },
      },
      redirects: {
        get: { method: 'GET', path: '/redirects' },
        getById: { method: 'GET', path: '/redirects/:id' },
        create: { method: 'POST', path: '/redirects' },
        update: { method: 'PUT', path: '/redirects/:id' },
        delete: { method: 'DELETE', path: '/redirects/:id' },
        getGraph: { method: 'GET', path: '/redirects/graph' },
        validate: { method: 'POST', path: '/redirects/validate' },
      },
      pageToApi: {
        get: { method: 'GET', path: '/page-to-api' },
        getByPageKey: { method: 'GET', path: '/page-to-api/:pageKey' },
        update: { method: 'PUT', path: '/page-to-api/:pageKey' },
        delete: { method: 'DELETE', path: '/page-to-api/:pageKey' },
        scan: { method: 'POST', path: '/page-to-api/scan' },
        validate: { method: 'POST', path: '/page-to-api/validate' },
      },
      importExport: {
        export: { method: 'GET', path: '/:type/export' },
        import: { method: 'POST', path: '/:type/import' },
      },
    },
  },
}

/**
 * 生成 API 方法代码
 */
function generateApiMethod(methodName, endpoint, basePath) {
  const { method, path } = endpoint
  const fullPath = basePath + path
  const hasPathParams = path.includes(':')
  const hasQueryParams = method === 'GET'
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method)

  let params = []
  let pathParamName = ''

  // 提取路径参数名
  if (hasPathParams) {
    const pathParamMatch = path.match(/:(\w+)/)
    if (pathParamMatch) {
      pathParamName = pathParamMatch[1]
    }
  }

  // 构建参数列表
  if (hasPathParams) {
    params.push(`${pathParamName}: string`)
  }

  if (hasQueryParams) {
    params.push('params?: any')
  }

  if (hasBody) {
    params.push('payload?: any')
  }

  const paramStr = params.length > 0 ? params.join(', ') : ''

  // 构建请求配置
  let configStr = ''
  if (hasQueryParams) {
    configStr = ', { params }'
  }

  // 构建完整路径（替换路径参数）
  let actualPath = fullPath
  if (hasPathParams) {
    actualPath = fullPath.replace(`:${pathParamName}`, `\${${pathParamName}}`)
  }

  let apiCall = ''
  if (method === 'GET') {
    apiCall = `apiClient.get<ApiResponse<any>>(\`${actualPath}\`${configStr})`
  } else if (method === 'POST') {
    if (hasBody) {
      apiCall = `apiClient.post<ApiResponse<any>>(\`${actualPath}\`, payload${configStr})`
    } else {
      apiCall = `apiClient.post<ApiResponse<any>>(\`${actualPath}\`${configStr})`
    }
  } else if (method === 'PUT') {
    if (hasBody) {
      apiCall = `apiClient.put<ApiResponse<any>>(\`${actualPath}\`, payload${configStr})`
    } else {
      apiCall = `apiClient.put<ApiResponse<any>>(\`${actualPath}\`${configStr})`
    }
  } else if (method === 'DELETE') {
    apiCall = `apiClient.delete<ApiResponse<any>>(\`${actualPath}\`${configStr})`
  }

  return `  ${methodName}(${paramStr}) {
    return ${apiCall}
  }`
}

/**
 * 生成模块 API 代码
 */
function generateModuleApi(moduleName, config) {
  const { basePath, endpoints } = config
  const methods = []

  // 生成各个端点的方法
  Object.entries(endpoints).forEach(([groupName, group]) => {
    Object.entries(group).forEach(([methodName, endpoint]) => {
      const fullMethodName = `${moduleName}${groupName.charAt(0).toUpperCase() + groupName.slice(1)}${methodName.charAt(0).toUpperCase() + methodName.slice(1)}`
      methods.push(generateApiMethod(fullMethodName, endpoint, basePath))
    })
  })

  return `export const ${moduleName}Api = {
${methods.join(',\n')}
}`
}

/**
 * 生成完整的 SDK 文件
 */
function generateSDK() {
  const imports = `import { apiClient } from './AdminApiClient'
import type {
  ApiResponse,
  PaginatedResponse,
  BatchResult,
  ExportParams,
  ImportPayload,
  PublishPayload,
} from '@/types/api'
`

  const modules = Object.entries(API_ROUTES).map(([moduleName, config]) => {
    return generateModuleApi(moduleName, config)
  })

  const content = `${imports}

${modules.join('\n\n')}
`

  return content
}

/**
 * 写入生成的 SDK 文件
 */
function writeSDKFile() {
  const outputPath = path.join(__dirname, '../src/services/api/generated-sdk.ts')
  const content = generateSDK()

  // 确保目录存在
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(outputPath, content, 'utf8')
  console.log(`✅ SDK generated successfully: ${outputPath}`)
}

/**
 * 主函数
 */
function main() {
  try {
    writeSDKFile()
    console.log('🚀 Frontend SDK generation completed!')
  } catch (error) {
    console.error('❌ SDK generation failed:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateSDK, API_ROUTES }
