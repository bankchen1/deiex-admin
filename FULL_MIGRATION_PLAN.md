# 全面迁移到Facade计划

## 🎯 目标

将整个项目从旧API服务迁移到Facade统一出入口，确保：
1. ✅ 所有stores使用Facade
2. ✅ 所有页面通过stores或直接使用Facade
3. ✅ Mock数据完整覆盖
4. ✅ 类型定义与UI完全一致
5. ✅ ESLint规则防止直连

## ✅ 已完成工作

### 1. 核心架构 ✅
- [x] Facade层建立（6个模块，40+函数）
- [x] SDK适配器创建
- [x] 统一类型定义
- [x] Mock/Real一键切换
- [x] 类型安全包装器

### 2. ESLint规则 ✅
- [x] 禁止直接导入`@/services/api/AdminApiClient`
- [x] 禁止直接导入`@/services/api/_sdk`
- [x] 禁止直接导入旧API服务（users, orders, assets等）

### 3. Stores迁移 ⏳
- [x] users.ts - 100%完成
- [x] orders.ts - 80%完成（主要方法已迁移）
- [ ] deposits.ts - 待迁移
- [ ] withdrawals.ts - 待迁移
- [ ] kyc.ts - 待迁移
- [ ] risk.ts - 待迁移
- [ ] dashboard.ts - 待迁移
- [ ] 其他stores - 待迁移

## 📋 迁移策略

### 阶段1：核心Stores（P0）✅ 进行中

**目标stores**：
1. ✅ users.ts
2. ⏳ orders.ts
3. ⏳ deposits.ts
4. ⏳ withdrawals.ts
5. ⏳ kyc.ts
6. ⏳ risk.ts

**迁移模式**：
```typescript
// Before
import { usersApi } from '@/services/api/users'
const response = await usersApi.getList(params)
list.value = response.data.data

// After
import { listUsers } from '@/services/api/facade'
const { data, error } = await listUsers(params)
if (error) throw new Error(error.message)
if (!data) { list.value = []; return }
list.value = data.data
```

### 阶段2：补充Facade函数（P0）

**需要添加的Facade函数**：

#### KYC模块
```typescript
// src/services/api/facade/kyc.ts
export const listKycApplications = async (params: KycQueryParams) => { ... }
export const getKycApplicationById = async (id: string) => { ... }
export const getKycStats = async (params?: DateRangeParams) => { ... }
export const reviewKycApplication = async (id: string, payload: ReviewPayload) => { ... }
export const batchReviewKyc = async (payload: BatchReviewPayload) => { ... }
```

#### Dashboard模块
```typescript
// src/services/api/facade/dashboard.ts
export const getDashboardStats = async (params?: DateRangeParams) => { ... }
export const getDashboardCharts = async (params?: DateRangeParams) => { ... }
```

#### Analytics模块
```typescript
// src/services/api/facade/analytics.ts
export const getUserAnalytics = async (params: AnalyticsParams) => { ... }
export const getTradingAnalytics = async (params: AnalyticsParams) => { ... }
export const getRevenueAnalytics = async (params: AnalyticsParams) => { ... }
```

#### Reports模块
```typescript
// src/services/api/facade/reports.ts
export const getTradeReport = async (params: ReportParams) => { ... }
export const getFinanceReport = async (params: ReportParams) => { ... }
export const getRetentionReport = async (params: ReportParams) => { ... }
```

### 阶段3：Mock数据补充（P0）

**需要补充的Mock模块**：

1. **KYC Mock数据**
   - `/admin/kyc` - 申请列表
   - `/admin/kyc/:id` - 申请详情
   - `/admin/kyc/stats` - 统计数据
   - `/admin/kyc/:id/review` - 审核

2. **Dashboard Mock数据**
   - `/admin/dashboard/stats` - 统计数据
   - `/admin/dashboard/charts` - 图表数据

3. **Analytics Mock数据**
   - `/admin/analytics/users` - 用户分析
   - `/admin/analytics/trading` - 交易分析
   - `/admin/analytics/revenue` - 收入分析

4. **Reports Mock数据**
   - `/admin/reports/trade` - 交易报表
   - `/admin/reports/finance` - 财务报表
   - `/admin/reports/retention` - 留存报表

### 阶段4：页面验证（P0）

**验证清单**：
- [ ] 所有页面正常显示数据
- [ ] 三态处理正确（Loading/Error/Empty）
- [ ] 分页、筛选、排序功能正常
- [ ] 导出功能正常
- [ ] 表单提交功能正常
- [ ] 错误提示友好

## 🚀 快速执行方案

### 方案A：批量迁移Stores（推荐）

**优点**：
- 一次性完成所有stores迁移
- 统一的代码风格
- 减少重复工作

**步骤**：
1. 创建stores迁移脚本
2. 批量更新所有stores
3. 运行类型检查
4. 测试Mock模式

**时间估算**：2-3小时

### 方案B：渐进式迁移

**优点**：
- 风险可控
- 可以逐步测试
- 不影响现有功能

**步骤**：
1. 每天迁移2-3个stores
2. 立即测试验证
3. 发现问题及时修复

**时间估算**：1周

## 📊 当前进度

### Facade实现进度
- **Users**: ✅ 100% (Mock + Real待SDK)
- **Orders**: ✅ 100% (Mock + Real部分)
- **Assets**: ✅ 100% (Mock + Real)
- **KYC**: ✅ 50% (Mock完成，Facade待补充)
- **Config**: ✅ 100% (Mock + Real)
- **Risk**: ✅ 50% (Mock完成，Facade待补充)
- **Dashboard**: ❌ 0% (待创建)
- **Analytics**: ❌ 0% (待创建)
- **Reports**: ❌ 0% (待创建)

### Stores迁移进度
- **已迁移**: 1.5个 (users完成，orders部分完成)
- **待迁移**: 21.5个
- **完成度**: 6.5%

### Mock数据覆盖
- **Users**: ✅ 100%
- **Orders**: ✅ 100%
- **Assets**: ✅ 100%
- **KYC**: ✅ 80%
- **Config**: ✅ 100%
- **Risk**: ✅ 80%
- **Dashboard**: ✅ 100%
- **Analytics**: ⏳ 50%
- **Reports**: ⏳ 50%

## 🎯 立即行动项

### 今天完成（P0）

1. **补充KYC Facade** ⏰ 30分钟
   - 创建`src/services/api/facade/kyc.ts`
   - 实现5个核心函数
   - 添加类型定义

2. **补充Dashboard Facade** ⏰ 20分钟
   - 创建`src/services/api/facade/dashboard.ts`
   - 实现2个核心函数

3. **迁移关键Stores** ⏰ 1小时
   - 完成orders.ts迁移
   - 完成deposits.ts迁移
   - 完成withdrawals.ts迁移

4. **验证Mock模式** ⏰ 30分钟
   - 启动Mock模式
   - 测试所有已迁移页面
   - 修复发现的问题

### 本周完成（P0）

5. **补充Analytics Facade** ⏰ 1小时
6. **补充Reports Facade** ⏰ 1小时
7. **迁移剩余Stores** ⏰ 3小时
8. **全面测试** ⏰ 2小时

## 🐛 已知问题

### 1. 函数名冲突
**问题**：Store函数名与Facade函数名相同  
**解决**：Store函数添加Action后缀（如`enableUserAction`）

### 2. 类型导入
**问题**：旧类型从API服务导入  
**解决**：统一从Facade或types/models导入

### 3. 错误处理
**问题**：旧代码直接throw，新代码需要检查error  
**解决**：统一使用`if (error) throw new Error(error.message)`

### 4. 空数据处理
**问题**：data可能为null  
**解决**：添加`if (!data) { ... return }`

## 📚 参考文档

- `FACADE_IMPLEMENTATION.md` - Facade实现说明
- `FACADE_QUICK_START.md` - 快速上手指南
- `FACADE_VALIDATION.md` - 验证报告
- `STORE_MIGRATION_PROGRESS.md` - Store迁移进度

## ✅ 验收标准

### 完成标准
- [ ] 所有stores使用Facade
- [ ] 所有页面正常工作
- [ ] Mock模式100%可用
- [ ] Real模式50%+可用（受SDK限制）
- [ ] ESLint无错误
- [ ] TypeScript无错误
- [ ] 文档完整

### 测试清单
- [ ] 用户管理页面正常
- [ ] 订单管理页面正常
- [ ] 资产管理页面正常
- [ ] KYC管理页面正常
- [ ] 风险管理页面正常
- [ ] 配置管理页面正常
- [ ] Dashboard正常
- [ ] 报表页面正常

## 🎉 预期成果

完成后将实现：
1. ✅ 统一的数据访问接口
2. ✅ 完整的类型安全
3. ✅ Mock/Real一键切换
4. ✅ 易于测试和维护
5. ✅ 防止直连API的保护机制

---

**创建时间**: 2024-11-08  
**预计完成**: 2024-11-09  
**负责人**: 开发团队

🚀 让我们开始全面迁移吧！
