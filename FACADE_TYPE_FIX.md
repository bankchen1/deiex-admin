# Facade类型修复指南

## 问题说明

当前Facade文件中存在TypeScript类型错误，主要原因是`apiClient.get()`返回类型为`unknown`。

## 解决方案

已创建类型安全的API客户端包装器：`src/services/api/_client.ts`

### 使用方法

**Before（有类型错误）**：
```typescript
const response = await apiClient.get('/admin/users', { params })
// response类型为unknown，导致后续访问response.data报错
```

**After（类型安全）**：
```typescript
import { safeGet } from '../_client'

const response = await safeGet<{ data: User[]; total: number; page: number; pageSize: number }>(
  '/admin/users',
  { params }
)
// response类型明确，可以安全访问response.data
```

## 批量修复步骤

### 1. 更新导入语句

在每个Facade文件顶部添加：
```typescript
import { safeGet, safePost, safePut, safePatch, safeDelete } from '../_client'
```

### 2. 替换API调用

| 原方法 | 新方法 |
|--------|--------|
| `apiClient.get()` | `safeGet()` |
| `apiClient.post()` | `safePost()` |
| `apiClient.put()` | `safePut()` |
| `apiClient.patch()` | `safePatch()` |
| `apiClient.delete()` | `safeDelete()` |

### 3. 添加类型参数

为每个API调用添加明确的返回类型：

```typescript
// 列表API
const response = await safeGet<{
  data: User[]
  total: number
  page: number
  pageSize: number
}>('/admin/users', { params })

// 详情API
const response = await safeGet<User>(`/admin/users/${id}`)

// 统计API
const response = await safeGet<UserStats>('/admin/users/stats', { params })

// 操作API
const response = await safePost<User>(`/admin/users/${id}/vip`, payload)
```

## 需要修复的文件

1. ✅ `src/services/api/_client.ts` - 已创建
2. ⏳ `src/services/api/facade/users.ts` - 需要更新
3. ⏳ `src/services/api/facade/orders.ts` - 需要更新
4. ⏳ `src/services/api/facade/assets.ts` - 需要更新
5. ⏳ `src/services/api/facade/kyc.ts` - 需要更新
6. ⏳ `src/services/api/facade/config.ts` - 需要更新
7. ⏳ `src/services/api/facade/risk.ts` - 需要更新

## 示例：完整修复

### users.ts 修复示例

```typescript
import { safeGet, safePost } from '../_client'

export const listUsers = async (
  params: UserQueryParams = {}
): Promise<FacadeResponse<{ data: User[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: User[]
        total: number
        page: number
        pageSize: number
      }>('/admin/users', { params })
      
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getUserById = async (
  id: string
): Promise<FacadeResponse<UserDetailResponse>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<UserDetailResponse>(`/admin/users/${id}`)
      return createSuccessResponse(response.data)
    } else {
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateUserVip = async (
  id: string,
  payload: { vipLevel: number; reason: string; notes?: string }
): Promise<FacadeResponse<User>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<User>(`/admin/users/${id}/vip`, payload)
      return createSuccessResponse(response.data)
    } else {
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
```

## SDK调用的类型问题

对于SDK调用，需要正确处理SDK的响应类型。SDK返回的是Axios Promise，需要await后访问data：

```typescript
// SDK调用示例
const response = await sdk.assets.adminDepositsGet(
  params.page,
  params.pageSize,
  params.currency,
  params.chain,
  params.status,
  params.userId
)

// SDK响应结构：{ data: { success, data, error, meta } }
const deposits = response.data.data || []
```

## 快速修复脚本

可以使用以下正则表达式批量替换：

### 查找
```regex
await apiClient\.get\(
```

### 替换为
```regex
await safeGet(
```

然后手动添加类型参数。

## 验证

修复后运行：
```bash
npm run lint
```

确保没有TypeScript错误。

## 注意事项

1. **类型参数必须准确** - 确保类型参数与实际API响应匹配
2. **Mock和Real模式都要考虑** - 两种模式的响应结构可能不同
3. **错误处理** - 确保所有API调用都在try-catch中
4. **导入语句** - 不要忘记导入`safeGet`等函数

## 下一步

1. 批量修复所有Facade文件
2. 运行类型检查确保无错误
3. 测试Mock模式和Real模式
4. 更新文档

---

**创建时间**: 2024-11-06
**状态**: 待执行
**优先级**: P0（阻塞其他开发）
