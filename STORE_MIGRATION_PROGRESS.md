# Store迁移到Facade进度

## 🎯 目标

将所有Pinia stores从旧API服务迁移到Facade统一出入口。

## ✅ 已完成

### 1. users.ts ✅
- [x] 导入Facade函数
- [x] 更新fetchList
- [x] 更新fetchById
- [x] 更新fetchStats
- [x] 更新updateVip
- [x] 更新updateTags
- [x] 更新reset2FA
- [x] 更新disableUser
- [x] 更新enableUser
- [x] 更新exportData

## ⏳ 待迁移

### 2. orders.ts - P0
- [ ] fetchSpotOrders → listSpotOrders
- [ ] fetchFuturesOrders → listFuturesOrders
- [ ] fetchPositions → listPositions
- [ ] fetchLiquidations → listLiquidations
- [ ] exportSpotOrders → exportSpotOrders
- [ ] exportFuturesOrders → exportFuturesOrders

### 3. deposits.ts - P0
- [ ] fetchDeposits → listDeposits
- [ ] fetchDepositById → getDepositById

### 4. withdrawals.ts - P0
- [ ] fetchWithdrawals → listWithdrawals
- [ ] fetchWithdrawalById → getWithdrawalById
- [ ] approveWithdrawal → approveWithdrawal
- [ ] rejectWithdrawal → rejectWithdrawal

### 5. kyc.ts - P0
- [ ] fetchApplications → listKycApplications
- [ ] fetchApplicationById → getKycApplicationById
- [ ] fetchStats → getKycStats
- [ ] reviewApplication → reviewKycApplication

### 6. risk.ts - P0
- [ ] fetchRules → listRiskRules
- [ ] fetchRuleById → getRiskRuleById
- [ ] createRule → createRiskRule
- [ ] updateRule → updateRiskRule
- [ ] deleteRule → deleteRiskRule

### 7. instruments.ts - P1
- [ ] fetchInstruments → listInstruments
- [ ] fetchDrafts → getInstrumentDrafts
- [ ] updateInstrument → updateInstrument

### 8. dashboard.ts - P1
- [ ] fetchStats → getDashboardStats
- [ ] fetchCharts → getDashboardCharts

### 9. analytics.ts - P1
- [ ] 各种analytics端点

### 10. reports.ts - P1
- [ ] 各种reports端点

## 📋 迁移模式

### Before（旧API服务）
```typescript
import { usersApi } from '@/services/api/users'

async function fetchList(params: UserQueryParams = {}) {
  const response = await usersApi.getList(params)
  list.value = response.data.data
  total.value = response.data.total
  return response
}
```

### After（Facade）
```typescript
import { listUsers, type UserQueryParams } from '@/services/api/facade'

async function fetchList(params: UserQueryParams = {}) {
  const { data, error: err } = await listUsers(params)
  
  if (err) {
    error.value = err.message
    throw new Error(err.message)
  }
  
  if (!data) {
    list.value = []
    total.value = 0
    return
  }
  
  list.value = data.data
  total.value = data.total
  return data
}
```

## 🔧 注意事项

1. **错误处理** - Facade返回`{ data, error }`，需要检查error
2. **空数据处理** - data可能为null，需要处理
3. **类型导入** - 从Facade导入类型，不从旧API服务导入
4. **函数名冲突** - 如果store函数名与Facade函数名相同，需要重命名

## 📊 进度统计

- **总stores数**: 23个
- **已迁移**: 1个 (users.ts)
- **待迁移**: 22个
- **完成度**: 4.3%

---

**更新时间**: 2024-11-08
**下一步**: 迁移orders, deposits, withdrawals, kyc, risk stores
