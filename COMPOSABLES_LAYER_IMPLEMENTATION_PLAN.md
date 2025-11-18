# Composables层实现计划

## 1. 当前Composables实现情况分析

### 现有实现状态
代码库已经为Vue Query集成奠定了良好的基础：
- **Vue Query依赖**：已经安装(`@tanstack/vue-query@^5.62.8`)
- **插件配置**：Vue Query在`/src/plugins/vue-query.ts`中已正确配置
- **现有Composables**：几个composables已经使用Vue Query：
  - `useUsers.ts`：完全实现查询和变更
  - `useWallets.ts`：完全实现查询和变更
  - `useServerData.ts`：通用composables用于常见模式
  - `generic.ts`和`template.ts`：用于创建新composables的模板文件

### 当前识别的问题
1. **不一致的导出模式**：只有部分composables在`index.ts`中导出
2. **缺少文档**：缺少composable模式的集中文档
3. **模板文件**：存在模板文件但未积极使用
4. **命名不一致**：一些composables使用通用名称而其他使用领域特定名称

## 2. Vue Query集成计划

### 配置增强
`/src/plugins/vue-query.ts`中的现有Vue Query配置结构良好但可以受益于：
1. **增强默认选项**：添加全局错误处理配置
2. **开发模式日志**：在开发中启用详细日志
3. **查询键工厂模式**：实现集中式查询键工厂

### 查询客户端设置
```typescript
// 增强的Vue Query配置
import { VueQueryPlugin, QueryClient, QueryClientConfig } from '@tanstack/vue-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      // 全局错误处理
      onError: (error) => {
        console.error('全局查询错误处理:', error)
        // 可以与通知系统集成
      }
    },
    mutations: {
      retry: 3,
      onError: (error) => {
        console.error('全局变更错误处理:', error)
        // 可以与通知系统集成
      }
    }
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: console.error
  }
})

const vueQueryPluginOptions: QueryClientConfig = {
  queryClient
}

export { queryClient, vueQueryPluginOptions }
export default VueQueryPlugin
```

## 3. 统一Composables结构设计

### 标准目录结构
```
src/composables/
├── index.ts                        # 重新导出所有composables
├── core/                           # 核心composables和工具
│   ├── useQueryClient.ts          # 查询客户端访问
│   ├── useErrorHandler.ts         # 错误处理工具
│   └── queryKeys.ts               # 集中查询键工厂
├── generics/                       # 通用composables用于常见模式
│   ├── useListData.ts            # 带分页的列表数据
│   ├── useDetailData.ts          # 详情数据获取
│   ├── useCreateData.ts          # 创建操作
│   ├── useUpdateData.ts          # 更新操作
│   └── useDeleteData.ts          # 删除操作
├── domain/                         # 领域特定composables
│   ├── users/
│   │   └── useUsers.ts           # 用户相关composables
│   ├── wallets/
│   │   └── useWallets.ts         # 钱包相关composables
│   └── ...                       # 其他领域
└── templates/                     # 用于新composables的模板文件
    ├── template.ts               # 基本composable模板
    └── advanced-template.ts      # 高级模板包含所有功能
```

### 查询键工厂模式
```typescript
// src/composables/core/queryKeys.ts
export const queryKeys = {
  // 用户领域
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: any) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    stats: () => [...queryKeys.users.all, 'stats'] as const,
  },
  
  // 钱包领域
  wallets: {
    all: ['wallets'] as const,
    lists: () => [...queryKeys.wallets.all, 'list'] as const,
    list: (params: any) => [...queryKeys.wallets.lists(), params] as const,
    details: () => [...queryKeys.wallets.all, 'detail'] as const,
    chainHealth: () => [...queryKeys.wallets.all, 'chainHealth'] as const,
    retryQueue: () => [...queryKeys.wallets.all, 'retryQueue'] as const,
  },
  
  // 根据需要添加更多领域
} as const
```

### 标准Composable接口
每个composable应遵循此模式：
```typescript
// 标准查询composable
export function useEntityListQuery(
  params?: Ref<QueryParams> | QueryParams,
  options?: UseQueryOptions<QueryResult, Error, QueryResult, QueryKey>
) {
  // 使用Vue Query的实现
}

// 标准变更composable
export function useCreateEntityMutation(
  options?: UseMutationOptions<MutationResult, Error, CreatePayload>
) {
  // 使用Vue Query的实现
}
```

## 4. 现有Composables迁移计划

### 第一阶段：基础设施设置（第1周）
1. **增强Vue Query配置**
   - 添加全局错误处理
   - 配置开发日志
   - 实现查询键工厂模式

2. **重组目录布局**
   - 创建`core/`、`generics/`、`domain/`和`templates/`目录
   - 将现有composables移动到适当位置

3. **更新索引导出**
   - 为所有composables创建适当导出
   - 确保向后兼容性

### 第二阶段：通用Composables开发（第2周）
1. **开发通用Composables**
   - 增强`useListData`、`useDetailData`、`useCreateData`等
   - 添加适当的TypeScript类型
   - 包含全面文档

2. **创建模板**
   - 开发基本和高级模板
   - 添加使用示例
   - 包含最佳实践文档

### 第三阶段：领域特定迁移（第3-4周）
1. **迁移现有Composables**
   - 将`useUsers`和`useWallets`组织到领域文件夹中
   - 确保所有composables使用新的查询键工厂
   - 添加缺失的composables以确保完整性

2. **创建缺失的Composables**
   - 识别覆盖范围的差距
   - 为其他领域创建composables
   - 确保与既定模式的一致性

### 第四阶段：测试和文档（第5周）
1. **单元测试**
   - 为通用composables添加测试
   - 测试领域特定composables
   - 验证错误处理场景

2. **文档**
   - 创建使用指南
   - 记录最佳实践
   - 添加迁移指南

## 5. 实施步骤

### 步骤1：创建查询键工厂
```typescript
// src/composables/core/queryKeys.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: any) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    stats: () => [...queryKeys.users.all, 'stats'] as const,
  },
  wallets: {
    all: ['wallets'] as const,
    lists: () => [...queryKeys.wallets.all, 'list'] as const,
    list: (params: any) => [...queryKeys.wallets.lists(), params] as const,
    details: () => [...queryKeys.wallets.all, 'detail'] as const,
    chainHealth: () => [...queryKeys.wallets.all, 'chainHealth'] as const,
    retryQueue: () => [...queryKeys.wallets.all, 'retryQueue'] as const,
  }
} as const
```

### 步骤2：重组目录并移动文件
1. 创建新目录结构
2. 将现有composables移动到适当位置
3. 相应更新导入路径

### 步骤3：更新Composables以使用查询键工厂
```typescript
// 之前
const QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...QUERY_KEYS.lists(), params] as const,
}

// 之后
import { queryKeys } from '@/composables/core/queryKeys'

// 使用queryKeys.users.all, queryKeys.users.list(params), 等
```

### 步骤4：增强通用Composables
```typescript
// src/composables/generics/useListData.ts
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { ref, unref } from 'vue'
import type { Ref } from 'vue'

export interface UseListDataOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  refetchOnReconnect?: boolean
  retry?: number
}

export function useListData<T>(
  queryKey: string | readonly unknown[],
  fetchFunction: (params?: any) => Promise<T>,
  params?: Ref<any> | any,
  options: UseListDataOptions = {}
) {
  const paramsRef = ref(params)
  
  const defaultOptions: UseListDataOptions = {
    enabled: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3
  }
  
  const mergedOptions = { ...defaultOptions, ...options }
  
  return useQuery({
    queryKey: [...(Array.isArray(queryKey) ? queryKey : [queryKey]), unref(paramsRef)],
    queryFn: async () => {
      const result = await fetchFunction(unref(paramsRef))
      return result
    },
    ...mergedOptions
  })
}
```

### 步骤5：更新索引导出
```typescript
// src/composables/index.ts
// 核心导出
export { queryClient } from './core/queryClient'
export { queryKeys } from './core/queryKeys'

// 通用composables
export { useListData } from './generics/useListData'
export { useDetailData } from './generics/useDetailData'
export { useCreateData } from './generics/useCreateData'
export { useUpdateData } from './generics/useUpdateData'
export { useDeleteData } from './generics/useDeleteData'

// 领域特定composables
export { 
  useUsersQuery, 
  useUserDetailQuery, 
  useUserStatsQuery,
  useUpdateUserVipMutation,
  useUpdateUserTagsMutation,
  useResetUser2FAMutation,
  useDisableUserMutation,
  useEnableUserMutation,
  useExportUsersMutation
} from './domain/users/useUsers'

export { 
  useWalletsQuery,
  useChainHealthQuery,
  useRetryQueueQuery,
  useSyncBalanceMutation,
  useRetryTaskMutation,
  useCancelTaskMutation
} from './domain/wallets/useWallets'

// 工具composables
export { useNotification } from './useNotification'
export { useLocale } from './useLocale'
```

## 6. 验收标准

### 技术要求
1. **Vue Query集成**
   - 所有服务器状态管理使用Vue Query
   - 实现适当的缓存和失效策略
   - 一致应用错误处理

2. **一致结构**
   - 所有composables遵循相同命名约定
   - 按关注点组织目录结构
   - 集中管理查询键

3. **性能优化**
   - 适当的staleTime和cacheTime设置
   - 高效查询失效
   - 最小化不必要的重新渲染

### 质量标准
1. **类型安全**
   - 所有composables具有适当TypeScript类型
   - 适当使用泛型类型
   - 无隐式any类型

2. **文档**
   - 每个composable具有JSDoc注释
   - 提供使用示例
   - 提供迁移指南

3. **测试覆盖**
   - 通用composables具有单元测试
   - 领域composables测试关键路径
   - 覆盖错误场景

### 交付物
1. **重组的Composables目录**
   - 按领域和关注点组织
   - 所有文件正确命名和定位

2. **增强的Vue Query配置**
   - 全局错误处理
   - 集中查询键管理
   - 优化默认设置

3. **完整的通用Composables集**
   - 列表、详情、创建、更新、删除模式
   - 适当类型和文档
   - 准备在领域间重用

4. **现有Composables迁移**
   - 更新以使用新模式
   - 维持向后兼容性
   - 与新结构一致

5. **全面文档**
   - 每个模式的使用指南
   - 最佳实践文档
   - 现有代码迁移说明

此实施计划确保向基于Vue Query的composable架构的平稳过渡，同时保持一致性，提高可维护性，并为未来开发建立坚实基础。