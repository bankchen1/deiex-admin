# Services层实现计划

## 1. 当前Services实现情况分析

### 现有实现状态
代码库已经为API集成奠定了良好的基础，但存在一些不一致性和改进空间：

- **API客户端**：在`src/services/api/AdminApiClient.ts`中有基础的Axios客户端实现
- **类型定义**：在`src/services/api/_types.ts`中有Facade响应结构定义
- **Facade层**：在`src/services/api/facade/`目录中有各模块的Facade实现
- **Mock服务**：在`src/services/mock/`目录中有基础的Mock实现

### 当前识别的问题
1. **不一致的错误处理**：各模块错误处理方式不统一
2. **Mock/Real模式切换**：部分模块Real模式未实现
3. **缺少统一的API客户端**：各模块直接使用Axios而非统一客户端
4. **配置分散**：环境变量和配置分散在多个文件中

## 2. 统一API客户端实现计划

### 增强的UnifiedApiClient
创建一个新的统一API客户端，提供以下功能：

1. **集中配置管理**：统一管理API基础URL、超时设置等
2. **改进的认证处理**：自动处理认证令牌刷新和重试
3. **标准化错误处理**：统一的错误处理和用户友好消息映射
4. **Mock模式集成**：内置Mock模式支持，便于切换
5. **请求/响应拦截**：添加请求ID、时间戳等追踪信息

```typescript
// src/services/api/UnifiedApiClient.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios'
import { mockService } from '@/services/mock'
import { ERROR_CODE_MAP } from '@/utils/constants'

class UnifiedApiClient {
  private axiosInstance: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()

    // 启用Mock模式（如果配置）
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      mockService.enable()
      mockService.setupInterceptor(this.axiosInstance)
    }
  }

  private setupInterceptors() {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 添加认证令牌
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 添加请求ID用于追踪
        config.headers['X-Request-ID'] = this.generateRequestId()

        // 添加时间戳
        config.headers['X-Request-Time'] = Date.now().toString()

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // 直接返回数据
        return response.data
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // 处理401 - 令牌过期
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // 令牌刷新时排队请求
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then(() => {
                return this.axiosInstance(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            await this.refreshToken()
            this.processQueue(null)
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError)
            this.handleAuthFailure()
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        // 处理其他错误
        const errorMessage = this.handleError(error)
        // 可以集成通知服务
        console.error('API Error:', errorMessage)

        return Promise.reject(error)
      }
    )
  }

  // HTTP方法
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config)
  }

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post(url, data, config)
  }

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put(url, data, config)
  }

  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.patch(url, data, config)
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config)
  }
}
```

## 3. Facade层完整实现计划

### 标准化Facade模式
创建一个基础Facade类，提供标准化的实现模式：

1. **统一响应结构**：所有Facade方法返回统一的响应结构
2. **Mock/Real模式切换**：内置Mock/Real模式切换机制
3. **错误处理**：统一的错误处理和日志记录
4. **类型安全**：完整的TypeScript类型支持

```typescript
// src/services/api/facade/base.ts
import type { FacadeResponse } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'

export abstract class BaseFacade {
  protected async handleRequest<T>(
    requestFn: () => Promise<T>,
    mockFn: () => Promise<T>
  ): Promise<FacadeResponse<T>> {
    try {
      const result = isMockMode() ? await mockFn() : await requestFn()
      return createSuccessResponse(result)
    } catch (error) {
      return createErrorResponse(error)
    }
  }
}
```

### 完善各模块Facade实现
为每个模块实现完整的Facade，包括：

1. **Real模式实现**：实现所有API端点的真实调用
2. **Mock模式增强**：提供更真实的Mock数据
3. **类型安全**：使用contracts层定义的类型
4. **错误处理**：完善的错误处理和重试机制

## 4. Mock数据管理计划

### 增强的Mock服务
创建更强大的Mock服务，提供以下功能：

1. **集中数据存储**：统一管理所有Mock数据
2. **数据持久化**：支持数据在会话间的持久化
3. **动态数据生成**：支持动态生成Mock数据
4. **路由匹配**：灵活的路由匹配机制

```typescript
// src/services/mock/data-store.ts
class MockDataStore {
  private data: Map<string, any> = new Map()

  set(key: string, value: any) {
    this.data.set(key, value)
  }

  get(key: string) {
    return this.data.get(key)
  }

  delete(key: string) {
    this.data.delete(key)
  }

  clear() {
    this.data.clear()
  }
}

export const mockDataStore = new MockDataStore()
```

### Mock数据生成器
为各模块创建Mock数据生成器，提供一致的测试数据：

1. **用户数据生成器**：生成用户、资产、统计等数据
2. **资产数据生成器**：生成存款、取款、钱包地址等数据
3. **风险管理数据生成器**：生成风险规则、限制、黑名单等数据

## 5. 与现有系统集成计划

### 配置管理
创建统一的配置管理模块：

1. **环境变量管理**：集中管理所有环境变量
2. **配置验证**：验证配置的有效性
3. **默认值设置**：为配置项设置合理的默认值

```typescript
// src/services/api/config.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
}
```

### 渐进式迁移
采用渐进式迁移策略，确保现有功能不受影响：

1. **并行实现**：新旧实现并行，逐步切换
2. **向后兼容**：保持现有API接口不变
3. **逐步替换**：按模块逐步替换现有实现

## 6. 实施步骤

### 第一阶段：基础设施建设（第1周）
1. **创建统一API客户端**
   - 实现UnifiedApiClient
   - 配置请求/响应拦截器
   - 集成Mock服务

2. **完善配置管理**
   - 创建配置管理模块
   - 集中管理环境变量
   - 添加配置验证

3. **增强Mock服务**
   - 实现Mock数据存储
   - 创建Mock路由匹配
   - 添加数据持久化支持

### 第二阶段：Facade层重构（第2-3周）
1. **创建基础Facade类**
   - 实现标准化Facade模式
   - 添加Mock/Real模式切换
   - 完善错误处理机制

2. **重构现有模块Facade**
   - 按模块重构Facade实现
   - 实现Real模式调用
   - 增强Mock数据生成

3. **类型安全集成**
   - 集成contracts层类型定义
   - 添加完整的TypeScript支持
   - 实现类型验证

### 第三阶段：测试和优化（第4周）
1. **单元测试**
   - 为API客户端添加测试
   - 测试Facade层实现
   - 验证Mock服务功能

2. **集成测试**
   - 测试与现有系统的集成
   - 验证Mock/Real模式切换
   - 性能测试和优化

3. **文档完善**
   - 创建使用文档
   - 添加迁移指南
   - 更新API文档

## 7. 验收标准

### 技术要求
1. **统一API客户端**
   - [ ] 实现集中配置管理
   - [ ] 支持认证令牌自动刷新
   - [ ] 提供标准化错误处理
   - [ ] 内置Mock模式支持

2. **标准化Facade层**
   - [ ] 所有模块实现统一Facade模式
   - [ ] 完整的Real模式实现
   - [ ] 增强的Mock数据支持
   - [ ] 完整的TypeScript类型支持

3. **Mock数据管理**
   - [ ] 实现集中数据存储
   - [ ] 支持数据持久化
   - [ ] 提供动态数据生成
   - [ ] 灵活的路由匹配机制

### 质量标准
1. **性能要求**
   - [ ] API调用响应时间<200ms（本地Mock）
   - [ ] 支持并发请求处理
   - [ ] 合理的缓存策略

2. **可靠性要求**
   - [ ] 99%的API调用成功率
   - [ ] 完善的错误处理和重试机制
   - [ ] 支持网络异常恢复

3. **可维护性要求**
   - [ ] 代码结构清晰，易于扩展
   - [ ] 完整的文档和注释
   - [ ] 充分的测试覆盖

### 交付物
1. **统一API客户端**
   - `src/services/api/UnifiedApiClient.ts`
   - `src/services/api/config.ts`
   - 相关类型定义文件

2. **标准化Facade层**
   - `src/services/api/facade/base.ts`
   - 各模块重构后的Facade实现
   - 完整的类型定义集成

3. **增强Mock服务**
   - `src/services/mock/data-store.ts`
   - `src/services/mock/router.ts`
   - 各模块Mock数据生成器

4. **文档和测试**
   - 使用文档和迁移指南
   - 完整的单元测试和集成测试
   - API文档更新

此实施计划将建立一个功能完整、性能优良、易于维护的Services层，作为应用的唯一IO出口，处理所有HTTP请求和Mock切换。