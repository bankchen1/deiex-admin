# Mock层实现计划

## 1. 当前Mock实现情况分析

### 现有实现状态
当前的Mock实现已经具备了良好的基础结构，主要包括：

- **Mock Service**: 位于`src/services/mock/index.ts`，作为核心Mock服务，负责拦截API调用并返回模拟数据
- **Mock数据生成器**: 位于`src/services/mock/modules/`目录下，为不同模块提供模拟数据生成
- **基础Mock处理**: 实现了基本的路由匹配和数据返回

### 当前识别的问题
1. **Mock数据生成器较少**：目前只有部分模块的模拟数据生成器
2. **处理逻辑分散**：处理逻辑分散在不同的模块文件中，缺乏统一管理
3. **数据管理简单**：缺少复杂的数据存储和管理机制
4. **与Services层集成待优化**：Mock与真实API的切换可以进一步优化

## 2. 示例数据管理计划

### 扩展Mock Data Generators
为了更好地管理示例数据，建议实施以下计划：

#### 2.1 为所有业务模块创建模拟数据生成器
- 用户管理模块
- 资产管理模块
- 风险管理模块
- 订单管理模块
- 市场数据模块
- 内容管理模块
- 策略管理模块
- 其他业务模块

#### 2.2 实现标准化的数据结构
- 确保生成的数据结构与实际API返回的数据结构完全一致
- 提供可配置的数据生成参数，支持生成不同场景下的数据
- 实现数据关联性，确保相关数据之间的一致性

#### 2.3 创建数据模板和示例
- 为每个实体创建基础数据模板
- 提供典型的业务场景数据示例
- 支持边界条件和异常数据生成

### 增强Mock Data Store
#### 2.4 扩展数据存储功能
- 支持更复杂的数据操作（增删改查）
- 实现数据关联和引用管理
- 提供数据查询和过滤功能

#### 2.5 实现数据持久化机制
- 支持在开发会话间保持数据状态
- 提供数据导入/导出功能
- 实现数据版本控制

#### 2.6 创建Mock Data Manager
- 创建统一的Mock数据管理器，负责协调各个模块的数据生成和管理
- 实现数据初始化和重置功能
- 提供数据统计和监控功能

## 3. 处理程序实现方案

### 统一处理程序接口
设计标准化的处理程序接口，确保所有模块的处理程序具有一致的结构：

```typescript
interface MockRouteHandler {
  pattern: RegExp
  method: string
  handler: (
    url: string,
    method: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => MockResponse | null
}
```

### 模块化处理程序实现
为每个业务模块创建独立的处理程序类，实现该模块的所有API端点模拟：

```typescript
// 示例：用户模块处理程序
class UserMockHandler {
  handleListUsers(url: string, method: string, data?: unknown, config?: AxiosRequestConfig): MockResponse
  handleGetUser(url: string, method: string, data?: unknown, config?: AxiosRequestConfig): MockResponse
  handleGetUserStats(url: string, method: string, data?: unknown, config?: AxiosRequestConfig): MockResponse
  // 其他用户相关端点...
}
```

### 处理程序注册机制
在Mock Service中实现自动化的处理程序注册机制，简化新处理程序的添加过程：

```typescript
private setupRoutes() {
  // 自动扫描并注册所有模块的处理程序
  this.router.addRoute(/^\/admin\/users$/, 'get', this.userHandler.handleListUsers.bind(this.userHandler))
  this.router.addRoute(/^\/admin\/users\/([^\/]+)$/, 'get', this.userHandler.handleGetUser.bind(this.userHandler))
  // 其他路由注册...
}
```

### 动态路由匹配
实现更灵活的路由匹配机制：

1. **参数提取**：从URL中提取路径参数
2. **查询参数解析**：解析URL查询参数
3. **请求体处理**：处理POST/PUT请求的请求体数据
4. **响应格式化**：根据请求头格式化响应数据

## 4. 与Services层集成计划

### 统一API客户端
使用现有的API客户端作为所有HTTP请求的统一入口点，确保Mock模式和真实模式的一致性。

### Facade模式优化
优化现有的Facade层实现，确保Mock/Real模式的无缝切换：

```typescript
// BaseFacade提供标准化的模式切换机制
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

### 配置管理
使用统一的配置管理机制，管理Mock模式的启用和相关配置。

### 请求拦截和响应处理
1. **请求拦截**：在请求发送前检查是否启用Mock模式
2. **路由匹配**：根据请求URL和方法匹配对应的Mock处理程序
3. **数据生成**：调用相应的数据生成器生成模拟数据
4. **响应构建**：构建符合API规范的响应数据

## 5. 实施步骤

### 第一阶段：基础设施建设（第1周）
1. **扩展Mock Data Generators**
   - 为所有主要业务模块创建模拟数据生成器
   - 实现标准化的数据结构和生成逻辑
   - 创建数据生成器测试用例

2. **创建Mock Data Manager**
   - 实现统一的Mock数据管理器
   - 添加数据初始化和重置功能
   - 实现数据统计和监控功能

3. **增强Mock Data Store**
   - 扩展数据存储功能，支持复杂数据操作
   - 实现数据查询和过滤功能
   - 添加数据版本控制支持

### 第二阶段：处理程序重构（第2周）
1. **统一处理程序接口**
   - 设计标准化的处理程序接口
   - 实现基础处理程序类
   - 添加路由匹配和参数解析功能

2. **模块化处理程序实现**
   - 为每个业务模块创建独立的处理程序类
   - 实现该模块的所有API端点模拟
   - 添加数据验证和错误处理

3. **处理程序注册机制**
   - 实现自动化的处理程序注册机制
   - 添加处理程序优先级和冲突解决
   - 实现处理程序动态加载和卸载

### 第三阶段：集成和优化（第3周）
1. **与Services层集成**
   - 优化Facade层实现，确保无缝切换
   - 集成统一API客户端
   - 添加配置管理支持

2. **性能优化**
   - 优化数据生成性能
   - 实现数据缓存机制
   - 添加请求批处理支持

3. **功能增强**
   - 实现数据持久化机制
   - 添加数据导入/导出功能
   - 实现模拟网络延迟和错误

### 第四阶段：测试和文档（第4周）
1. **单元测试**
   - 为Mock数据生成器添加测试
   - 测试处理程序实现
   - 验证数据存储和管理功能

2. **集成测试**
   - 测试与Services层的集成
   - 验证Mock/Real模式切换
   - 测试性能和稳定性

3. **文档完善**
   - 创建使用文档和最佳实践
   - 添加API端点映射表
   - 提供数据生成和管理指南

## 6. 验收标准

### 功能完整性
- [ ] 所有主要业务模块都有对应的模拟数据生成器
- [ ] Mock数据结构与真实API返回的数据结构一致
- [ ] 支持所有常见的HTTP方法（GET, POST, PUT, PATCH, DELETE）
- [ ] 支持分页、排序、过滤等常见API功能
- [ ] 支持数据关联和引用管理
- [ ] 提供数据导入/导出功能

### 性能要求
- [ ] 模拟数据生成时间不超过100ms（1000条记录）
- [ ] 数据存储和检索时间不超过50ms
- [ ] 支持并发请求处理
- [ ] 支持数据缓存和批处理
- [ ] 模拟网络延迟和错误功能正常

### 集成要求
- [ ] 与现有Services层无缝集成
- [ ] 支持Mock模式和真实模式的动态切换
- [ ] 保持与现有UI组件的兼容性
- [ ] 支持配置管理
- [ ] 提供监控和日志功能

### 可维护性
- [ ] 代码结构清晰，易于扩展和维护
- [ ] 提供完整的文档和使用示例
- [ ] 具备完善的错误处理和日志记录机制
- [ ] 支持模块化开发和测试
- [ ] 提供数据版本控制和回滚功能

### 质量标准
- [ ] 99%的API端点有对应的Mock实现
- [ ] 95%的数据生成器有单元测试覆盖
- [ ] 90%的处理程序有集成测试覆盖
- [ ] 100%的文档完整性和准确性
- [ ] 无严重的性能瓶颈和内存泄漏

通过以上计划的实施，将建立一个功能完整、性能优良、易于维护的Mock层，为前端开发和测试提供强有力的支持。