# Facade快速上手指南

## 🎯 什么是Facade？

Facade是数据访问的统一出入口，所有页面和组件都应该通过Facade获取数据，而不是直接调用API或SDK。

## ✨ 核心优势

1. **一键换源** - Mock/Real模式通过环境变量切换
2. **类型安全** - 完整的TypeScript类型支持
3. **统一格式** - 所有响应都是`FacadeResponse<T>`
4. **易于测试** - Mock模式下可独立开发UI
5. **解耦设计** - UI层不依赖具体数据源

## 🚀 快速开始

### 1. 导入Facade函数

```typescript
// ❌ 错误：不要直接导入API客户端
import { apiClient } from '@/services/api/AdminApiClient'

// ✅ 正确：使用Facade
import { listUsers, getUserById } from '@/services/api/facade'
```

### 2. 调用Facade函数

```typescript
// 获取用户列表
const { data, error, meta } = await listUsers({
  page: 1,
  pageSize: 20,
  status: 'active'
})

// 处理响应
if (error) {
  // 错误处理
  message.error(error.message)
  return
}

if (!data) {
  // 空数据处理
  return
}

// 使用数据
users.value = data.data
total.value = data.total
```

### 3. 完整页面示例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listSpotOrders, type OrderQueryParams } from '@/services/api/facade'
import type { Order } from '@/types/models'

// 状态
const loading = ref(false)
const error = ref<string | null>(null)
const orders = ref<Order[]>([])
const total = ref(0)

// 查询参数
const params = ref<OrderQueryParams>({
  page: 1,
  pageSize: 20,
  status: 'pending'
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  const { data, error: err, meta } = await listSpotOrders(params.value)
  
  loading.value = false
  
  if (err) {
    error.value = err.message
    return
  }
  
  if (!data) {
    orders.value = []
    total.value = 0
    return
  }
  
  orders.value = data.data
  total.value = data.total
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})

// 分页变化
const handlePageChange = (page: number) => {
  params.value.page = page
  fetchData()
}
</script>

<template>
  <div class="orders-page">
    <!-- Loading态 -->
    <a-spin v-if="loading" :spinning="true">
      <a-skeleton active />
    </a-spin>
    
    <!-- Error态 -->
    <a-alert
      v-else-if="error"
      type="error"
      :message="error"
      show-icon
    />
    
    <!-- Empty态 -->
    <a-empty
      v-else-if="orders.length === 0"
      description="No orders found"
    />
    
    <!-- Success态 -->
    <div v-else>
      <a-table
        :data-source="orders"
        :pagination="{
          current: params.page,
          pageSize: params.pageSize,
          total: total,
          onChange: handlePageChange
        }"
      >
        <!-- 表格列定义 -->
      </a-table>
    </div>
  </div>
</template>
```

## 📋 可用的Facade函数

### Users模块

```typescript
import {
  listUsers,           // 用户列表
  getUserById,         // 用户详情
  getUserStats,        // 用户统计
  updateUserVip,       // 更新VIP等级
  updateUserTags,      // 更新风险标签
  resetUser2FA,        // 重置2FA
  disableUser,         // 禁用用户
  enableUser,          // 启用用户
  exportUsers,         // 导出用户
} from '@/services/api/facade'
```

### Orders模块

```typescript
import {
  listSpotOrders,      // 现货订单列表
  listFuturesOrders,   // 期货订单列表
  listPositions,       // 持仓列表
  listLiquidations,    // 清算记录列表
  getSpotOrderById,    // 现货订单详情
  getFuturesOrderById, // 期货订单详情
  getPositionById,     // 持仓详情
  exportSpotOrders,    // 导出现货订单
  exportFuturesOrders, // 导出期货订单
} from '@/services/api/facade'
```

### Assets模块

```typescript
import {
  listDeposits,        // 存款列表
  listWithdrawals,     // 提款列表
  getDepositById,      // 存款详情
  getWithdrawalById,   // 提款详情
  approveWithdrawal,   // 批准提款
  rejectWithdrawal,    // 拒绝提款
} from '@/services/api/facade'
```

### Config模块

```typescript
import {
  listInstruments,     // 交易对列表
  getInstrumentDrafts, // 交易对草稿
  updateInstrument,    // 更新交易对
  batchHideInstruments,// 批量隐藏
  batchShowInstruments,// 批量显示
} from '@/services/api/facade'
```

### Risk模块

```typescript
import {
  listRiskRules,       // 风险规则列表
  getRiskRuleById,     // 风险规则详情
  createRiskRule,      // 创建风险规则
  updateRiskRule,      // 更新风险规则
  deleteRiskRule,      // 删除风险规则
} from '@/services/api/facade'
```

## 🔧 环境配置

### Mock模式（开发）

```bash
# .env.development
VITE_USE_MOCK=true
```

```bash
npm run dev
```

### Real模式（联调）

```bash
# .env.development.local
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.example.com
```

```bash
npm run dev
```

## 📊 响应格式

所有Facade函数返回统一的`FacadeResponse<T>`格式：

```typescript
interface FacadeResponse<T> {
  data: T | null              // 数据（成功时有值）
  error: FacadeError | null   // 错误（失败时有值）
  meta?: FacadeMeta           // 元数据（分页、统计等）
}

interface FacadeError {
  code: string | number       // 错误码
  message: string             // 错误消息
  details?: any               // 错误详情
}

interface FacadeMeta {
  pagination?: {
    page: number              // 当前页
    pageSize: number          // 每页大小
    total: number             // 总数
  }
  stats?: Record<string, any> // 统计信息
}
```

## 🎨 三态处理模式

推荐使用以下模式处理Loading/Error/Success三态：

```vue
<template>
  <div>
    <!-- 1. Loading态 -->
    <a-spin v-if="loading" />
    
    <!-- 2. Error态 -->
    <a-alert v-else-if="error" type="error" :message="error" />
    
    <!-- 3. Empty态 -->
    <a-empty v-else-if="list.length === 0" />
    
    <!-- 4. Success态 -->
    <DataTable v-else :data-source="list" />
  </div>
</template>
```

## ⚠️ 注意事项

### 1. 不要直接调用API

```typescript
// ❌ 错误
import { apiClient } from '@/services/api/AdminApiClient'
const response = await apiClient.get('/admin/users')

// ✅ 正确
import { listUsers } from '@/services/api/facade'
const { data, error } = await listUsers()
```

### 2. 不要直接调用SDK

```typescript
// ❌ 错误
import { sdk } from '@/services/api/_sdk'
const response = await sdk.users.listUsers()

// ✅ 正确
import { listUsers } from '@/services/api/facade'
const { data, error } = await listUsers()
```

### 3. 始终处理错误

```typescript
// ❌ 错误：没有处理错误
const { data } = await listUsers()
users.value = data.data  // data可能为null

// ✅ 正确：处理错误和空数据
const { data, error } = await listUsers()
if (error) {
  message.error(error.message)
  return
}
if (!data) {
  return
}
users.value = data.data
```

### 4. 使用TypeScript类型

```typescript
// ❌ 错误：没有类型
const params = { page: 1, pageSize: 20 }

// ✅ 正确：使用类型
import type { OrderQueryParams } from '@/services/api/facade'
const params: OrderQueryParams = { page: 1, pageSize: 20 }
```

## 🧪 测试

### 在浏览器控制台测试

```javascript
// 1. 导入Facade函数
const { listSpotOrders } = await import('/src/services/api/facade/index.ts')

// 2. 调用函数
const result = await listSpotOrders({ page: 1, pageSize: 10 })

// 3. 查看结果
console.log('Result:', result)
console.log('Data:', result.data)
console.log('Error:', result.error)
console.log('Meta:', result.meta)
```

### 切换Mock/Real模式

```javascript
// 查看当前模式
console.log('Mock Mode:', import.meta.env.VITE_USE_MOCK)

// 切换模式需要重启开发服务器
// 1. 修改 .env.development.local
// 2. 重启 npm run dev
```

## 📚 更多资源

- `FACADE_IMPLEMENTATION.md` - 完整实现说明
- `FACADE_VALIDATION.md` - 验证报告
- `P0_TASK_SUMMARY.md` - 任务总结
- `src/services/api/facade/` - 源代码

## 🆘 常见问题

### Q: 为什么要使用Facade？
A: Facade提供了统一的数据访问接口，使得UI层不依赖具体的数据源实现，便于测试和维护。

### Q: Mock模式和Real模式有什么区别？
A: Mock模式使用本地Mock数据，Real模式调用真实的后端API。通过环境变量一键切换。

### Q: 如何添加新的Facade函数？
A: 在对应的Facade文件中添加函数，实现Mock和Real两个分支，返回`FacadeResponse<T>`格式。

### Q: Real模式下某些函数报错怎么办？
A: 检查SDK是否有对应的端点。如果SDK缺少端点，暂时使用Mock模式或等待后端支持。

### Q: 如何调试Facade函数？
A: 在浏览器控制台直接导入和调用Facade函数，查看返回值和错误信息。

---

**更新时间**: 2024-11-08  
**版本**: 1.0  
**状态**: ✅ 可用

🚀 开始使用Facade，享受类型安全和统一的数据访问体验！
