# 快速参考 - Mock数据字段

## 🚀 快速开始

### 1. 重启服务器
```bash
npm run dev
```

### 2. 清除缓存
`Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)

### 3. 快速测试
```javascript
// 在浏览器控制台运行
const test = async () => {
  const { apiClient } = await import('/src/services/api/AdminApiClient.ts')
  const res = await apiClient.get('/admin/users?page=1&pageSize=10')
  console.log('Users:', res.data.data.length, '条')
}
test()
```

## 📊 Mock数据总览

| 模块 | 数据量 | 端点示例 |
|------|--------|---------|
| Users | 50 | `/admin/users` |
| Spot Orders | 100 | `/admin/orders/spot` |
| Futures Orders | 80 | `/admin/orders/futures` |
| Positions | 30 | `/admin/orders/positions` |
| Deposits | 50 | `/admin/assets/deposits` |
| Withdrawals | 50 | `/admin/assets/withdrawals` |
| Instruments | 50 | `/admin/config/instruments` |
| KYC | 50 | `/admin/kyc` |
| Risk Rules | 40 | `/admin/risk/rules` |
| Risk Limits | 25 | `/admin/risk/limits` |
| Blacklist | 30 | `/admin/risk/blacklist` |

## 🔑 关键字段类型

### 金融数值 → 字符串
```typescript
price: "50000.00"
quantity: "1.5000"
amount: "75000.00"
```

### 日期时间 → ISO 8601
```typescript
createdAt: "2024-11-06T10:30:00.000Z"
```

### 枚举 → 联合类型
```typescript
status: 'pending' | 'approved' | 'rejected'
```

## 📋 常用API端点

### Users
```
GET /admin/users                    # 列表
GET /admin/users/:id                # 详情
GET /admin/users/stats              # 统计
```

### Orders
```
GET /admin/orders/spot              # 现货订单
GET /admin/orders/futures           # 期货订单
GET /admin/orders/positions         # 持仓
GET /admin/orders/liquidations      # 清算
```

### Assets
```
GET /admin/assets/deposits          # 存款
GET /admin/assets/withdrawals       # 提款
```

### Config
```
GET /admin/config/instruments       # 交易对
GET /admin/config/margin            # 保证金
GET /admin/config/fees              # 费用
```

### KYC
```
GET /admin/kyc                      # 列表
GET /admin/kyc/:id                  # 详情
GET /admin/kyc/stats                # 统计
```

### Risk
```
GET /admin/risk/rules               # 规则
GET /admin/risk/limits              # 限制
GET /admin/risk/blacklist           # 黑名单
```

## 🧪 测试检查清单

- [ ] 重启服务器
- [ ] 清除浏览器缓存
- [ ] 运行快速测试脚本
- [ ] 访问Users列表页
- [ ] 访问Orders页面
- [ ] 访问Assets页面
- [ ] 访问Config页面
- [ ] 访问KYC页面
- [ ] 访问Risk页面
- [ ] 检查控制台无错误
- [ ] 检查数据正确显示

## 🐛 问题排查

### 页面无数据
```javascript
// 检查Store
const { useUsersStore } = await import('/src/stores/users.ts')
const store = useUsersStore()
console.log(store.list, store.total, store.loading)
```

### API错误
```javascript
// 检查API响应
const { apiClient } = await import('/src/services/api/AdminApiClient.ts')
const res = await apiClient.get('/admin/users/user-1')
console.log(res)
```

### 字段缺失
查看 `数据字段完全匹配修复完成.md` 中的字段定义

## 📚 相关文档

1. **数据字段完全匹配修复完成.md** - 详细字段说明
2. **完整测试验证指南.md** - 完整测试步骤
3. **最终修复总结-数据字段完全匹配.md** - 修复总结

## ✅ 成功标准

- ✅ 测试脚本100%通过
- ✅ 所有页面显示数据
- ✅ 控制台无错误
- ✅ 字段类型正确

---

**快速帮助**: 如有问题，先运行快速测试脚本，然后查看控制台日志！
