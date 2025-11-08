# 下一步执行指南

## 🎯 当前状态

✅ **P0任务 - Facade统一出入口**：85%完成
- ✅ 架构设计完成
- ✅ 核心文件创建
- ✅ 6个模块Facade实现
- ✅ 类型错误已修复
- ✅ Real模式部分完成（Orders/Assets/Config）
- ⏳ 页面迁移待完成

## 🚀 立即执行（优先级P0）

### ✅ 1. 修复TypeScript类型错误 - 已完成

**状态**：✅ 完成
- 所有Facade文件类型检查通过
- 无TypeScript编译错误
- 使用类型安全的包装器

### ✅ 2. 实现Real模式 - 部分完成

**状态**：✅ Orders/Assets/Config已实现
- ✅ Orders: `listSpotOrders()`, `listPositions()`
- ✅ Assets: `listDeposits()`, `listWithdrawals()`
- ✅ Config: `listInstruments()`
- ⏳ Users/KYC/Risk等待SDK支持

**Real模式实现示例**：
```typescript
// Orders Facade - Real模式
const response = await sdk.trading.apiV1TradingOrdersGet({
  symbol: params.symbol,
  status: params.status,
  side: params.side,
  limit: params.pageSize || 20,
  offset: ((params.page || 1) - 1) * (params.pageSize || 20),
})
```

### 3. 迁移示例页面 ⏰ 30分钟 - 下一步

**目标**：将Users List页面迁移到使用Facade

**文件**：`src/pages/users/List.vue`

**修改步骤**：

1. **更新导入**：
```typescript
// Before
import { usersApi } from '@/services/api/users'

// After
import { listUsers, getUserStats } from '@/services/api/facade'
```

2. **更新数据获取**：
```typescript
// Before
async function fetchData() {
  const response = await usersApi.getList(params)
  list.value = response.data.data
  total.value = response.data.total
}

// After
async function fetchData() {
  const { data, error, meta } = await listUsers(params)
  
  if (error) {
    message.error(error.message)
    return
  }
  
  if (!data) {
    list.value = []
    total.value = 0
    return
  }
  
  list.value = data.data
  total.value = data.total
}
```

3. **添加三态处理**：
```vue
<template>
  <div>
    <!-- Loading态 -->
    <a-spin v-if="loading" />
    
    <!-- Error态 -->
    <a-alert v-else-if="error" type="error" :message="error" />
    
    <!-- Empty态 -->
    <a-empty v-else-if="list.length === 0" />
    
    <!-- Success态 -->
    <UserTable v-else :data-source="list" :total="total" />
  </div>
</template>
```

**验证**：
- ✅ 页面正常显示数据
- ✅ 三态切换正常
- ✅ 控制台无错误

## 📋 短期任务（本周）

### 4. 补充Real模式实现 ⏰ 2小时

**目标**：完成Users和Orders模块的Real模式

**步骤**：

1. **检查SDK端点**：
```bash
# 查看生成的SDK文档
cat src/generated/docs/UsersApi.md
```

2. **实现Real分支**：
```typescript
export const listUsers = async (params: UserQueryParams = {}) => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safeGet<...>('/admin/users', { params })
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      const response = await sdk.users.listUsers({
        page: params.page,
        pageSize: params.pageSize,
        // ... 其他参数
      })
      
      // 转换SDK响应为统一格式
      return createSuccessResponse({
        data: response.data.data || [],
        total: response.data.meta?.total || 0,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      })
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
```

3. **测试Real模式**：
```bash
VITE_USE_MOCK=false npm run dev
```

### 5. 禁止UI直连数据 ⏰ 1小时

**目标**：移除所有页面中的直接API调用

**步骤**：

1. **扫描直接调用**：
```bash
# 查找所有直接导入apiClient的文件
grep -r "from '@/services/api/AdminApiClient'" src/pages/
grep -r "from '@/services/api/users'" src/pages/
grep -r "from '@/services/api/orders'" src/pages/
```

2. **批量替换**：
- 将`usersApi.getList()`替换为`listUsers()`
- 将`ordersApi.getSpotOrders()`替换为`listSpotOrders()`
- 更新导入语句

3. **添加ESLint规则**：
```javascript
// .eslintrc.js
rules: {
  'no-restricted-imports': ['error', {
    patterns: [
      {
        group: ['@/services/api/AdminApiClient'],
        message: 'Please use Facade instead of direct API client'
      },
      {
        group: ['@/services/api/users', '@/services/api/orders'],
        message: 'Please use Facade instead of direct API modules'
      }
    ]
  }]
}
```

### 6. Mock全量补齐 ⏰ 2小时

**目标**：确保所有路由模块都有完整的Mock数据

**步骤**：

1. **检查路由模块**：
```bash
ls src/router/modules/
```

2. **对照Mock模块**：
```bash
ls src/services/mock/modules/
```

3. **补充缺失模块**：
- Reports模块
- Settings模块
- Ops模块
- Dashboard模块

4. **验证数据一致性**：
```bash
# 运行mock检查（待实现）
pnpm mock:check
```

## 🎯 中期任务（下周）

### 7. 实现Mock一致性校验 ⏰ 3小时

**目标**：创建自动化脚本验证Mock数据与类型定义一致

**步骤**：

1. **创建contracts目录**：
```bash
mkdir -p src/contracts
```

2. **编写Zod Schema**：
```typescript
// src/contracts/users.ts
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  kycStatus: z.enum(['none', 'pending', 'approved', 'rejected']),
  vipLevel: z.number().int().min(0).max(10),
  // ... 其他字段
})

export const UserListResponseSchema = z.object({
  data: z.array(UserSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
```

3. **实现校验脚本**：
```typescript
// scripts/check-mock.ts
import { UserListResponseSchema } from '@/contracts/users'
import { listUsers } from '@/services/api/facade'

async function checkMockData() {
  const { data } = await listUsers({ page: 1, pageSize: 10 })
  
  try {
    UserListResponseSchema.parse(data)
    console.log('✅ Users mock data is valid')
  } catch (error) {
    console.error('❌ Users mock data is invalid:', error)
    process.exit(1)
  }
}

checkMockData()
```

4. **添加npm脚本**：
```json
{
  "scripts": {
    "mock:check": "tsx scripts/check-mock.ts"
  }
}
```

### 8. 页面三态与UI架构 ⏰ 4小时

**目标**：为所有页面实现统一的三态处理

**步骤**：

1. **创建通用组件**：
```vue
<!-- src/shared/DataView.vue -->
<template>
  <div class="data-view">
    <a-spin v-if="loading" :spinning="true">
      <slot name="skeleton">
        <a-skeleton active />
      </slot>
    </a-spin>
    
    <a-alert
      v-else-if="error"
      type="error"
      :message="error"
      show-icon
    />
    
    <a-empty
      v-else-if="isEmpty"
      :description="emptyText"
    />
    
    <slot v-else />
  </div>
</template>
```

2. **在页面中使用**：
```vue
<DataView
  :loading="loading"
  :error="error"
  :is-empty="users.length === 0"
  empty-text="No users found"
>
  <UserTable :data-source="users" />
</DataView>
```

## 📊 进度追踪

### 今天已完成
- [x] 修复TypeScript类型错误
- [x] 实现Real模式（Orders/Assets/Config）
- [x] 创建验证文档

### 今天待完成
- [ ] 迁移1个示例页面（Orders或Assets）
- [ ] 测试Mock和Real模式切换

### 本周目标
- [ ] 补充Real模式实现
- [ ] 禁止UI直连数据
- [ ] Mock全量补齐

### 下周目标
- [ ] Mock一致性校验
- [ ] 页面三态与UI架构

## ✅ 完成标准

### P0任务完成标准
- [ ] 所有TypeScript类型错误已修复
- [ ] Mock模式下所有Facade函数可正常调用
- [ ] Real模式下至少2个模块可正常调用
- [ ] 至少3个页面已迁移到使用Facade
- [ ] 添加了ESLint规则禁止直连
- [ ] 文档完整

### 验证命令
```bash
# 1. 类型检查
npm run lint

# 2. Mock模式测试
VITE_USE_MOCK=true npm run dev

# 3. Real模式测试
VITE_USE_MOCK=false npm run dev

# 4. Mock数据校验
pnpm mock:check
```

## 🆘 遇到问题？

### 类型错误
- 参考：`FACADE_TYPE_FIX.md`
- 使用：`safeGet/safePost`替代`apiClient`

### Mock数据不匹配
- 参考：`数据字段完全匹配修复完成.md`
- 检查：Mock数据结构与类型定义

### SDK调用失败
- 检查：SDK文档 `src/generated/docs/`
- 验证：API端点是否存在

### 页面无数据
- 检查：控制台错误
- 验证：Facade函数返回值
- 测试：直接调用Facade函数

## 📞 支持文档

- `FACADE_IMPLEMENTATION.md` - Facade实现说明
- `FACADE_TYPE_FIX.md` - 类型修复指南
- `P0_TASK_SUMMARY.md` - 任务总结
- `数据字段完全匹配修复完成.md` - Mock数据修复

---

**更新时间**: 2024-11-06
**当前阶段**: P0 - Facade统一出入口
**下一阶段**: P0 - Mock全量补齐

🚀 开始执行吧！先完成类型修复，然后测试Mock模式！
