# 全局模块架构审计报告

## 概述
本报告对项目中所有模块进行架构审计，识别不符合"唯一真源通用 Vue3 范式 v1.0"规范的模块，并制定统一的重构策略。

## 模块清单及架构状态

### 1. 用户管理模块 (Users)
- **页面文件**：
  - `src/pages/users/List.vue`
  - `src/pages/users/Detail.vue`
- **Store文件**：`src/stores/users.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - 使用Store进行数据获取和状态管理
  - 缺少composables层
  - 页面直接调用Store方法
- **重构需求**：高优先级

### 2. 钱包资产管理模块 (Assets)
- **页面文件**：
  - `src/pages/assets/Wallets.vue`
  - `src/pages/assets/Overview.vue`
  - `src/pages/assets/Deposits.vue`
  - `src/pages/assets/Withdrawals.vue`
- **Store文件**：
  - `src/stores/wallets.ts` (已部分重构)
  - `src/stores/assets.ts`
  - `src/stores/deposits.ts`
  - `src/stores/withdrawals.ts`
  - `src/stores/assetsOverview.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - 多个Store文件管理相关数据
  - Store承担数据获取职责
  - 缺少composables层
- **重构需求**：高优先级

### 3. 仪表板模块 (Dashboard)
- **页面文件**：`src/pages/dashboard/index.vue`
- **Store文件**：`src/stores/dashboard.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：高优先级

### 4. 订单管理模块 (Orders)
- **页面文件**：
  - `src/pages/orders/SpotOrders.vue`
  - `src/pages/orders/FuturesOrders.vue`
  - `src/pages/orders/Positions.vue`
  - `src/pages/orders/Liquidations.vue`
  - `src/pages/orders/CopyTrading.vue`
- **Store文件**：`src/stores/orders.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：中优先级

### 5. 风控管理模块 (Risk)
- **页面文件**：
  - `src/pages/risk/Rules.vue`
  - `src/pages/risk/Limits.vue`
  - `src/pages/risk/Blacklist.vue`
  - `src/pages/risk/index.vue`
- **Store文件**：`src/stores/risk.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：中优先级

### 6. 策略管理模块 (Strategies)
- **页面文件**：
  - `src/pages/strategies/monitoring/index.vue`
  - `src/pages/strategies/performance/index.vue`
  - `src/pages/strategies/instances/index.vue`
  - `src/pages/strategies/templates/index.vue`
  - `src/pages/strategies/backtest/index.vue`
- **Store文件**：`src/stores/strategies.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：中优先级

### 7. 市场数据模块 (Market)
- **页面文件**：
  - `src/pages/market/symbols/index.vue`
  - `src/pages/market/data/index.vue`
  - `src/pages/market/charts/index.vue`
  - `src/pages/market/analysis/index.vue`
  - `src/pages/market/news/index.vue`
  - `src/pages/market/indices/index.vue`
- **Store文件**：无独立Store文件
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - 缺少composables层
  - 数据获取方式不统一
- **重构需求**：中优先级

### 8. 系统配置模块 (Config)
- **页面文件**：
  - `src/pages/config/instruments/index.vue`
  - `src/pages/config/margin/index.vue`
  - `src/pages/config/fees/index.vue`
  - `src/pages/config/calendar/index.vue`
  - `src/pages/config/security/index.vue`
  - `src/pages/config/icons/index.vue`
  - `src/pages/config/mappings/index.vue`
- **Store文件**：
  - `src/stores/instruments.ts`
  - `src/stores/fees.ts`
  - `src/stores/calendar.ts`
  - `src/stores/icons.ts`
  - `src/stores/mappings.ts`
  - `src/stores/margin.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - 多个Store文件管理相关数据
  - Store承担数据获取职责
  - 缺少composables层
- **重构需求**：中优先级

### 9. 内容管理模块 (Content)
- **页面文件**：
  - `src/pages/content/index.vue`
  - `src/pages/content/blog/index.vue`
  - `src/pages/content/blog/Dashboard.vue`
  - `src/pages/content/blog/categories.vue`
  - `src/pages/content/blog/comments.vue`
  - `src/pages/content/announcements/index.vue`
  - `src/pages/content/notifications/index.vue`
  - `src/pages/content/notifications/Dashboard.vue`
  - `src/pages/content/notifications/templates.vue`
  - `src/pages/content/email-marketing/index.vue`
  - `src/pages/content/email-marketing/Dashboard.vue`
  - `src/pages/content/email-marketing/campaigns.vue`
  - `src/pages/content/email-marketing/templates.vue`
  - `src/pages/content/email-marketing/segments.vue`
- **Store文件**：`src/stores/content.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：低优先级

### 10. 报表模块 (Reports)
- **页面文件**：
  - `src/pages/reports/Trade.vue`
  - `src/pages/reports/Finance.vue`
  - `src/pages/reports/Retention.vue`
- **Store文件**：`src/stores/reports.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：低优先级

### 11. 分析模块 (Analytics)
- **页面文件**：
  - `src/pages/analytics/trading/index.vue`
  - `src/pages/analytics/revenue/index.vue`
  - `src/pages/analytics/users/index.vue`
  - `src/pages/analytics/user-behavior/index.vue`
- **Store文件**：`src/stores/analytics.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：低优先级

### 12. 合规模块 (Compliance)
- **页面文件**：`src/pages/compliance/audit/index.vue`
- **Store文件**：无独立Store文件
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - 缺少composables层
  - 数据获取方式不统一
- **重构需求**：低优先级

### 13. 监控模块 (Monitoring)
- **页面文件**：`src/pages/monitoring/transactions/index.vue`
- **Store文件**：无独立Store文件
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - 缺少composables层
  - 数据获取方式不统一
- **重构需求**：低优先级

### 14. 运营模块 (Ops)
- **页面文件**：
  - `src/pages/ops/Tasks.vue`
  - `src/pages/ops/Logs.vue`
- **Store文件**：
  - `src/stores/tasks.ts`
  - `src/stores/logs.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：低优先级

### 15. 系统设置模块 (Settings)
- **页面文件**：
  - `src/pages/settings/index.vue`
  - `src/pages/settings/General.vue`
  - `src/pages/settings/I18n.vue`
  - `src/pages/settings/Theme.vue`
  - `src/pages/settings/CacheAndSwitches.vue`
- **Store文件**：
  - `src/stores/settings.ts`
  - `src/stores/app.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据和UI状态
  - 缺少composables层
- **重构需求**：低优先级

### 16. KYC模块 (KYC)
- **页面文件**：
  - `src/pages/kyc/index.vue`
  - `src/pages/kyc/Detail.vue`
- **Store文件**：`src/stores/kyc.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：中优先级

### 17. 认证模块 (Auth)
- **页面文件**：`src/pages/auth/Login.vue`
- **Store文件**：`src/stores/auth.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：中优先级

### 18. 安全模块 (Security)
- **页面文件**：`src/pages/config/security/index.vue`
- **Store文件**：`src/stores/security.ts`
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - Store管理服务器数据
  - 缺少composables层
- **重构需求**：中优先级

### 19. 示例模块 (Examples)
- **页面文件**：
  - `src/pages/examples/ServerTableDemo.vue`
  - `src/pages/examples/UserFormsDemo.vue`
  - `src/pages/examples/SpecializedInputsDemo.vue`
  - `src/pages/examples/SchemaFormDemo.vue`
  - `src/pages/examples/RBACGuardDemo.vue`
  - `src/pages/examples/VersionControlDemo.vue`
- **Store文件**：无独立Store文件
- **架构状态**：❌ 不符合规范
- **问题分析**：
  - 缺少composables层
  - 数据获取方式不统一
- **重构需求**：低优先级

### 20. 错误页面模块
- **页面文件**：`src/pages/error/NotFound.vue`
- **Store文件**：无
- **架构状态**：✅ 符合规范
- **问题分析**：
  - 简单页面，无需数据获取
- **重构需求**：无需重构

## 旧架构模式识别

### 1. Facade模式
- **位置**：`src/services/api/facade/`
- **问题**：这是旧架构的核心，所有数据访问都通过Facade层
- **解决方案**：逐步替换为直接调用`services/api/*.ts`文件

### 2. Store数据获取模式
- **问题**：所有Store文件都包含数据获取逻辑
- **解决方案**：将数据获取逻辑移至composables层，Store只管理UI状态

### 3. Pages目录模式
- **问题**：使用`pages/`目录而非`views/`目录
- **解决方案**：重命名为`views/`目录，并创建对应的UI组件

### 4. 直接API调用模式
- **问题**：部分页面直接调用API而非通过Store或composables
- **解决方案**：统一通过composables层访问数据

## 统一重构策略

### 1. 目录结构调整
- 将`src/pages/`重命名为`src/views/`
- 创建`src/ui/`目录结构：
  - `src/ui/pages/` - 页面UI组件
  - `src/ui/sections/` - 页面区块组件
  - `src/ui/widgets/` - 可复用组件
  - `src/ui/primitives/` - 基础组件

### 2. 数据流统一
- 所有Views只通过composables获取数据
- composables只调用services/api/*.ts
- services/api/*.ts作为唯一IO出口

### 3. Store职责分离
- Store只管理UI状态（loading, error, theme, etc.）
- 服务器数据由Vue Query管理

### 4. 重构优先级
1. **高优先级**：用户、钱包、仪表板模块
2. **中优先级**：订单、风控、策略、KYC、认证、安全模块
3. **低优先级**：内容、报表、分析、合规、监控、运营、设置、示例模块

### 5. 渐进式迁移
- 保持新旧架构并存，逐步迁移
- 确保功能不受影响
- 建立完善的测试机制

## 风险控制

### 1. 兼容性风险
- **控制措施**：保持API接口不变，只重构内部实现

### 2. 功能回归风险
- **控制措施**：建立完善的测试用例，确保重构前后功能一致

### 3. 团队适应风险
- **控制措施**：提供详细的迁移文档和培训

### 4. 进度延误风险
- **控制措施**：制定详细的里程碑计划，定期评估进度