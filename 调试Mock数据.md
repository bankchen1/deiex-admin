# Mock数据调试指南

## 数据流程

1. **API调用** → `dashboardApi.getStats()`
2. **Mock拦截** → `mockService.getMockResponse()`
3. **Mock返回** → `{ data: { success: true, data: {...}, message: '...' } }`
4. **响应拦截器** → 返回 `response.data` = `{ success: true, data: {...}, message: '...' }`
5. **Store处理** → `stats.value = response.data` = `{...}` (实际数据)

## 检查步骤

### 1. 打开浏览器控制台

查看是否有以下日志：
```
🎭 MOCK MODE ACTIVE
[Mock Service] POST /auth/login
[Mock Service] GET /admin/dashboard/stats
[Mock Service] GET /admin/dashboard/charts
[Mock Service] GET /admin/dashboard/alerts
```

### 2. 检查Network标签

虽然请求被拦截，但应该能看到请求被发起。

### 3. 在控制台手动测试

```javascript
// 测试dashboard API
const { useDashboardStore } = await import('/src/stores/dashboard.ts')
const store = useDashboardStore()
await store.fetchStats()
console.log('Stats:', store.stats)
```

### 4. 检查响应数据

在`src/stores/dashboard.ts`的`fetchStats`方法中添加日志：

```typescript
async function fetchStats(params?: DashboardQueryParams) {
  statsLoading.value = true
  error.value = null
  try {
    const response = await dashboardApi.getStats(params)
    console.log('API Response:', response)  // 添加这行
    console.log('Response.data:', response.data)  // 添加这行
    stats.value = response.data
    return response
  } catch (e: any) {
    console.error('Fetch stats error:', e)  // 添加这行
    error.value = e.message || 'Failed to fetch dashboard stats'
    throw e
  } finally {
    statsLoading.value = false
  }
}
```

## 常见问题

### 问题1：看到"Mock response"但没有数据

**原因**：Mock服务返回了默认响应而不是特定端点的数据

**解决**：检查URL匹配逻辑

```typescript
// 在 src/services/mock/index.ts 的 getMockResponse 中添加日志
console.log(`[Mock Service] ${method.toUpperCase()} ${url}`)
console.log('Mock response:', mockResponse)
```

### 问题2：数据结构不匹配

**检查**：
1. Mock返回的数据结构
2. Store期望的数据结构
3. API接口定义

**示例**：Dashboard Stats

Mock返回：
```typescript
{
  success: true,
  data: {
    registrations: { total: 1234, change: 12.5 },
    activeUsers: { total: 8932, change: 8.3 },
    // ...
  },
  message: 'Dashboard stats retrieved'
}
```

Store期望（从`response.data`）：
```typescript
{
  registrations: { total: number, change: number },
  activeUsers: { total: number, change: number },
  // ...
}
```

### 问题3：页面显示"No Data"

**可能原因**：
1. 数据加载中（loading状态）
2. 数据为null或undefined
3. 数据结构不匹配导致无法渲染

**检查**：
```javascript
// 在浏览器控制台
const { useDashboardStore } = await import('/src/stores/dashboard.ts')
const store = useDashboardStore()
console.log('Stats:', store.stats)
console.log('Loading:', store.statsLoading)
console.log('Error:', store.error)
```

## 修复建议

### 如果数据确实返回了但页面不显示

1. **检查组件props**：确保数据正确传递
2. **检查v-if条件**：可能被条件隐藏
3. **检查数据格式**：组件期望的格式可能不同

### 如果Mock服务没有被调用

1. **检查环境变量**：`VITE_USE_MOCK=true`
2. **重启开发服务器**：`npm run dev`
3. **清除缓存**：硬刷新浏览器

### 如果返回默认响应

检查URL匹配顺序，确保更具体的路径在前面：

```typescript
// 正确顺序
if (url.includes('/dashboard/stats')) { ... }
if (url.includes('/dashboard/charts')) { ... }
if (url.includes('/dashboard')) { ... }  // 通用的放最后

// 错误顺序
if (url.includes('/dashboard')) { ... }  // 会匹配所有dashboard请求
if (url.includes('/dashboard/stats')) { ... }  // 永远不会执行
```

## 快速测试脚本

在浏览器控制台运行：

```javascript
// 测试Mock服务
const testMock = async () => {
  const { apiClient } = await import('/src/services/api/AdminApiClient.ts')
  
  try {
    const response = await apiClient.get('/admin/dashboard/stats')
    console.log('✅ Stats Response:', response)
  } catch (error) {
    console.error('❌ Stats Error:', error)
  }
  
  try {
    const response = await apiClient.get('/admin/users')
    console.log('✅ Users Response:', response)
  } catch (error) {
    console.error('❌ Users Error:', error)
  }
}

testMock()
```

## 预期结果

正确配置后，应该看到：

1. **控制台日志**：
   ```
   🎭 MOCK MODE ACTIVE
   [Mock Service] GET /admin/dashboard/stats
   [Mock Service] GET /admin/dashboard/charts
   [Mock Service] GET /admin/dashboard/alerts
   ```

2. **Dashboard显示**：
   - 6个统计卡片有数据
   - 待办事项列表有项目
   - 图表显示数据

3. **无错误**：
   - 控制台无红色错误
   - 页面正常渲染
   - 数据正确显示
