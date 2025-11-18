# Contracts层实现计划

## 1. 当前Contracts实现情况分析

### 现有实现状态
代码库已经为API契约定义了良好的基础结构：

- **TypeScript类型**：在`src/contracts/`目录中有各模块的类型定义
- **模块化组织**：按功能模块组织类型定义（users.ts, assets.ts, risk.ts等）
- **基础结构**：定义了实体、查询参数、操作载荷等基本结构

### 当前识别的问题
1. **缺少运行时验证**：没有Zod模式进行运行时数据验证
2. **缺少API文档**：没有OpenAPI规范定义API接口
3. **不一致的模式**：各模块类型定义模式不完全一致
4. **缺少验证集成**：没有与UI表单或API调用集成的验证机制

## 2. TypeScript类型定义标准化计划

### 统一类型定义模式
为所有模块建立一致的类型定义模式：

1. **实体类型**：定义数据实体的基本结构
2. **查询参数类型**：定义API查询参数结构
3. **操作载荷类型**：定义创建/更新操作的数据结构
4. **响应类型**：定义API响应的数据结构
5. **常量类型**：定义枚举和常量类型

```typescript
// 标准化类型定义模式示例
// src/contracts/users.ts

// 实体类型
export interface User {
  id: string
  email: string
  username: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  updatedAt: string
}

// 查询参数类型
export interface UserQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  status?: User['status']
}

// 操作载荷类型
export interface CreateUserPayload {
  email: string
  username: string
  role: string
  password: string
}

export interface UpdateUserPayload {
  email?: string
  username?: string
  role?: string
  status?: User['status']
}

// 响应类型
export interface UserListResponse {
  data: User[]
  total: number
  page: number
  pageSize: number
}

// 常量类型
export const USER_ROLES = ['admin', 'user', 'moderator'] as const
export type UserRole = typeof USER_ROLES[number]
```

### 类型安全增强
1. **严格的类型检查**：启用TypeScript严格模式
2. **泛型类型**：使用泛型提高类型复用性
3. **联合类型**：合理使用联合类型定义枚举值
4. **可选属性**：正确使用可选属性和必需属性

## 3. Zod验证集成方案

### Zod模式定义
为所有类型定义创建对应的Zod验证模式：

1. **实体验证模式**：验证数据实体的结构和值
2. **查询参数验证模式**：验证查询参数的有效性
3. **操作载荷验证模式**：验证创建/更新载荷
4. **响应验证模式**：验证API响应格式

```typescript
// src/contracts/validation/users.zod.ts
import { z } from 'zod'

// 实体验证模式
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  role: z.enum(['admin', 'user', 'moderator']),
  status: z.enum(['active', 'inactive', 'suspended']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// 查询参数验证模式
export const UserQueryParamsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
})

// 操作载荷验证模式
export const CreateUserPayloadSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  role: z.enum(['admin', 'user', 'moderator']),
  password: z.string().min(8),
})

export const UpdateUserPayloadSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(50).optional(),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
})
```

### 验证集成
1. **API层集成**：在Facade层集成Zod验证
2. **UI层集成**：在表单组件中集成Zod验证
3. **Mock数据验证**：验证Mock数据符合定义的模式
4. **错误处理**：提供友好的验证错误消息

## 4. OpenAPI配置计划

### OpenAPI规范定义
为所有API端点创建OpenAPI 3.0规范：

1. **路径定义**：定义所有API路径和HTTP方法
2. **参数定义**：定义路径参数、查询参数、请求体
3. **响应定义**：定义成功和错误响应结构
4. **组件定义**：定义可复用的模式、参数、响应

```yaml
# src/contracts/openapi/users.openapi.yaml
openapi: 3.0.0
info:
  title: Users API
  version: 1.0.0
  description: 用户管理API

paths:
  /admin/users:
    get:
      summary: 获取用户列表
      description: 获取用户列表，支持分页、排序和搜索
      parameters:
        - name: page
          in: query
          description: 页码
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: pageSize
          in: query
          description: 每页条数
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: search
          in: query
          description: 搜索关键词
          schema:
            type: string
      responses:
        '200':
          description: 成功获取用户列表
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        username:
          type: string
        role:
          type: string
          enum: [admin, user, moderator]
        status:
          type: string
          enum: [active, inactive, suspended]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
      required:
        - id
        - email
        - username
        - role
        - status
        - createdAt
        - updatedAt

    UserListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        total:
          type: integer
        page:
          type: integer
        pageSize:
          type: integer
      required:
        - data
        - total
        - page
        - pageSize

  responses:
    Unauthorized:
      description: 未授权
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Forbidden:
      description: 禁止访问
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  schemas:
    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
      required:
        - code
        - message
```

### 文档生成
1. **自动化文档**：使用OpenAPI规范自动生成API文档
2. **交互式文档**：提供可交互的API测试界面
3. **版本管理**：管理不同版本的API规范
4. **集成开发工具**：与开发工具集成，提供智能提示

## 5. 实施步骤

### 第一阶段：TypeScript标准化（第1周）
1. **统一类型定义模式**
   - 为所有现有模块建立标准化类型定义
   - 确保类型定义的一致性和完整性
   - 添加适当的注释和文档

2. **类型安全增强**
   - 启用TypeScript严格模式
   - 修复类型检查错误
   - 添加缺失的类型定义

3. **模块化重构**
   - 按功能模块组织类型定义
   - 确保模块间依赖关系清晰
   - 提供清晰的导出接口

### 第二阶段：Zod验证集成（第2-3周）
1. **Zod模式创建**
   - 为所有类型定义创建对应的Zod模式
   - 确保模式验证的完整性和准确性
   - 添加适当的验证消息

2. **验证集成**
   - 在Facade层集成Zod验证
   - 在UI表单中集成Zod验证
   - 验证Mock数据符合定义的模式

3. **错误处理**
   - 提供友好的验证错误消息
   - 集成错误处理机制
   - 添加验证日志记录

### 第三阶段：OpenAPI规范实现（第4周）
1. **OpenAPI规范定义**
   - 为所有API端点创建OpenAPI 3.0规范
   - 确保规范的完整性和准确性
   - 添加适当的描述和示例

2. **文档生成**
   - 实现自动化文档生成
   - 提供交互式API测试界面
   - 集成版本管理机制

3. **工具集成**
   - 与开发工具集成
   - 提供智能提示和自动补全
   - 集成代码生成工具

### 第四阶段：测试和优化（第5周）
1. **单元测试**
   - 为类型定义添加测试
   - 测试Zod验证模式
   - 验证OpenAPI规范

2. **集成测试**
   - 测试与现有系统的集成
   - 验证端到端的数据流
   - 性能测试和优化

3. **文档完善**
   - 创建使用文档
   - 添加最佳实践指南
   - 更新API文档

## 6. 验收标准

### 技术要求
1. **TypeScript类型定义**
   - [ ] 所有模块都有标准化类型定义
   - [ ] 启用TypeScript严格模式
   - [ ] 类型定义完整且准确

2. **Zod验证集成**
   - [ ] 所有类型都有对应的Zod模式
   - [ ] 在API层和UI层集成验证
   - [ ] 提供友好的验证错误消息

3. **OpenAPI规范**
   - [ ] 所有API端点都有OpenAPI规范
   - [ ] 提供自动化文档生成
   - [ ] 支持交互式API测试

### 质量标准
1. **一致性要求**
   - [ ] 所有模块遵循相同的类型定义模式
   - [ ] Zod模式与TypeScript类型保持一致
   - [ ] OpenAPI规范与实际API实现一致

2. **可维护性要求**
   - [ ] 代码结构清晰，易于扩展
   - [ ] 提供完整的文档和注释
   - [ ] 支持模块化开发和维护

3. **可靠性要求**
   - [ ] 99%的类型定义准确率
   - [ ] 99%的验证模式覆盖率
   - [ ] 100%的API端点有规范定义

### 交付物
1. **标准化类型定义**
   - `src/contracts/*/index.ts` 各模块类型定义
   - 统一的类型定义模式文档

2. **Zod验证模式**
   - `src/contracts/validation/*.zod.ts` 各模块验证模式
   - 验证集成实现

3. **OpenAPI规范**
   - `src/contracts/openapi/*.openapi.yaml` API规范
   - 自动化文档生成工具

4. **文档和测试**
   - 使用文档和最佳实践指南
   - 完整的单元测试和集成测试
   - API文档更新

此实施计划将建立一个功能完整、类型安全、验证完善的Contracts层，作为应用的API契约定义，确保前后端数据一致性和可靠性。