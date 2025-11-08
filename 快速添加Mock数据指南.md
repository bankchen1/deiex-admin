# 快速添加Mock数据指南

## ✅ 已修复的模块

1. **Users** - ✅ 列表和详情都有数据
2. **KYC** - ✅ 列表有数据
3. **Dashboard** - ✅ 统计和图表有数据
4. **Deposits/Withdrawals** - ✅ 列表有数据

## 🔧 需要添加数据的模块

根据你的反馈，以下模块还需要mock数据：

1. **Orders** - 订单列表
2. **Configuration** - 配置页面
3. **Risk** - 风险管理
4. **Operations** - 运营管理
5. **Reports** - 报表
6. **Settings** - 设置

## 📝 数据结构规则

### 规则1：识别Store使用的字段

检查对应的store文件，看它使用哪个字段：

**使用 `response.data.data`**：
```typescript
list.value = response.data.data  // ✅ 使用 data
```

**使用 `response.data.items`**：
```typescript
list.value = response.data.items  // ✅ 使用 items
```

### 规则2：Mock返回对应的结构

**如果Store使用 `data`**：
```typescript
return {
  data: {
    success: true,
    data: {
      data: [...],      // ✅ 列表数据
      total: 100,
      page: 1,
      pageSize: 10
    }
  }
}
```

**如果Store使用 `items`**：
```typescript
return {
  data: {
    success: true,
    data: {
      items: [...],     // ✅ 列表数据
      total: 100
    }
  }
}
```

## 🚀 快速修复方法

### 方法1：使用通用处理器（已添加）

我已经在mock服务中添加了通用处理器，会自动返回空数据：

- `/config/*` - 返回空的 `data` 数组
- `/ops/*` - 返回空的 `items` 数组
- `/reports/*` - 返回空的 `data` 数组
- `/settings/*` - 返回空对象

这样至少页面不会报错，只是显示"No data"。

### 方法2：添加具体的mock数据

如果需要显示实际数据，按以下步骤操作：

#### 步骤1：确定数据结构

查看对应的store文件，例如 `src/stores/risk.ts`：

```typescript
// 如果看到这个：
publishedRules.value = response.data.items
// 说明需要返回 items

// 如果看到这个：
publishedRules.value = response.data.data
// 说明需要返回 data
```

#### 步骤2：创建或更新mock模块

例如，为Risk添加数据，编辑 `src/services/mock/modules/risk.ts`：

```typescript
handle(url: string, method: string, data?: unknown): MockResponse | null {
  // Risk rules list
  if (url.includes('/risk/rules') && method === 'get') {
    const mockRules = Array.from({ length: 20 }, (_, i) => ({
      id: `rule-${i + 1}`,
      name: `Risk Rule ${i + 1}`,
      type: ['deposit', 'withdrawal', 'trade'][i % 3],
      enabled: i % 2 === 0,
      priority: i + 1,
      createdAt: new Date().toISOString(),
    }))

    return {
      data: {
        success: true,
        data: {
          items: mockRules,  // ✅ 使用 items（根据store）
          total: mockRules.length,
        },
        message: 'Risk rules retrieved',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }

  return null
}
```

#### 步骤3：在主mock服务中注册

确保在 `src/services/mock/index.ts` 中路由到你的模块：

```typescript
if (url.includes('/risk')) {
  mockResponse = mockRiskService.handle(url, method, config.data)
}
```

## 📊 常见模块的数据结构

### Orders（订单）

**Store使用**：`response.data.data`

**Mock返回**：
```typescript
{
  data: {
    success: true,
    data: {
      data: [
        {
          id: 'order-1',
          userId: 'user-1',
          symbol: 'BTCUSDT',
          side: 'buy',
          type: 'limit',
          price: 50000,
          quantity: 1,
          status: 'filled',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ],
      total: 100,
      page: 1,
      pageSize: 10
    }
  }
}
```

### Operations/Logs（运营日志）

**Store使用**：`response.data.items`

**Mock返回**：
```typescript
{
  data: {
    success: true,
    data: {
      items: [
        {
          id: 'log-1',
          level: 'info',
          message: 'System started',
          timestamp: '2024-01-01T00:00:00Z'
        }
      ],
      total: 50
    }
  }
}
```

### Configuration（配置）

**Store使用**：`response.data.data`

**Mock返回**：
```typescript
{
  data: {
    success: true,
    data: {
      data: [
        {
          id: 'config-1',
          key: 'max_withdrawal',
          value: '10000',
          type: 'number',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ],
      total: 20
    }
  }
}
```

## 🔍 调试技巧

### 技巧1：使用调试面板

点击右下角的 **🐛 Debug** 按钮，测试API调用，查看返回的数据结构。

### 技巧2：查看控制台日志

Mock服务会打印日志：
```
[Mock Service] GET /admin/risk/rules
[Mock Service] Response: { success: true, data: {...} }
```

检查Response的结构是否正确。

### 技巧3：在浏览器控制台测试

```javascript
// 测试特定API
const { apiClient } = await import('/src/services/api/AdminApiClient.ts')
const response = await apiClient.get('/admin/risk/rules')
console.log('Response:', response)
console.log('Data structure:', response.data)
```

### 技巧4：检查Store期望

```javascript
// 查看Store如何处理数据
const { useRiskStore } = await import('/src/stores/risk.ts')
const store = useRiskStore()
await store.fetchPublishedRules()
console.log('Rules:', store.publishedRules)
```

## 📦 批量添加Mock数据模板

如果需要快速为多个模块添加数据，使用这个模板：

```typescript
// src/services/mock/modules/[module-name].ts
import type { MockResponse } from '../index'

class Mock[ModuleName]Service {
  private mockData = Array.from({ length: 30 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
    status: ['active', 'inactive'][i % 2],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    // List endpoint
    if (url.includes('/[endpoint]') && method === 'get' && !url.match(/\/[endpoint]\/[^/]+$/)) {
      const urlObj = new URL(url, 'http://localhost')
      const page = parseInt(urlObj.searchParams.get('page') || '1')
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        data: {
          success: true,
          data: {
            data: this.mockData.slice(start, end),  // 或 items，根据store
            total: this.mockData.length,
            page,
            pageSize,
          },
          message: 'Data retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Detail endpoint
    if (url.match(/\/[endpoint]\/[^/]+$/) && method === 'get') {
      const id = url.split('/').pop()
      const item = this.mockData.find((d) => d.id === id) || this.mockData[0]
      
      return {
        data: {
          success: true,
          data: item,
          message: 'Detail retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Create/Update/Delete
    if (url.includes('/[endpoint]') && ['post', 'put', 'patch', 'delete'].includes(method)) {
      return {
        data: {
          success: true,
          data: data || {},
          message: 'Operation successful',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    return null
  }
}

export const mock[ModuleName]Service = new Mock[ModuleName]Service()
```

## 🎯 优先级建议

根据使用频率，建议按以下顺序添加mock数据：

1. **Orders** - 高优先级（交易核心功能）
2. **Risk** - 高优先级（风险管理）
3. **Operations/Logs** - 中优先级（运营监控）
4. **Configuration** - 中优先级（系统配置）
5. **Reports** - 低优先级（报表查看）
6. **Settings** - 低优先级（设置管理）

## 💡 提示

- 现在至少所有页面都不会报错（返回空数据）
- 可以逐步添加具体的mock数据
- 使用调试面板快速验证
- 参考已有的users和kyc模块作为示例

需要我帮你添加特定模块的mock数据吗？告诉我哪个模块最重要，我可以优先处理！
