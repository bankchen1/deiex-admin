# 全局架构重构计划

## 当前架构问题分析

根据对`docs/rules.md`的深入分析，当前项目存在以下与规范不符的问题：

### 1. 架构分层不清晰
- **现状**：使用Facade模式（`src/services/api/facade/`）作为数据访问层
- **问题**：Facade模式是旧架构，不符合"唯一真源通用 Vue3 范式 v1.0"要求
- **规范要求**：应使用`services/api/*.ts`作为唯一IO出口

### 2. 数据流路径错误
- **现状**：Views → Stores → Facade → API Client
- **问题**：Store承担了数据获取职责，违反了规范中"服务器数据：一律交给 Vue Query"的原则
- **规范要求**：Views → Composables → Services → Contracts

### 3. 目录结构不符合规范
- **现状**：使用`pages/`目录而非`views/`目录
- **问题**：不符合规范要求的目录结构
- **规范要求**：使用`views/`作为路由页面入口

### 4. 状态管理职责不清
- **现状**：Stores管理服务器数据和UI状态
- **问题**：Store承担了过多职责
- **规范要求**：Stores只管理UI状态，服务器数据由Vue Query管理

## 重构策略

### 第一阶段：基础设施建设 (1-2周)
1. 建立符合规范的目录结构
   - 创建`src/views/`目录
   - 创建`src/ui/`目录结构（pages, sections, widgets, primitives）
   - 重命名现有的`src/pages/`为`src/views/`

2. 建立Vue Query配置
   - 配置Vue Query客户端
   - 设置默认查询配置（缓存时间、重试策略等）
   - 建立错误处理机制

3. 创建通用composables模板
   - 创建useQuery和useMutation通用模板
   - 建立分页和过滤的通用处理模式
   - 创建错误和加载状态的统一处理

### 第二阶段：模块重构 (3-16周)
按照业务模块优先级逐步重构：

#### 高优先级模块（3-6周）
1. 用户管理模块
2. 钱包资产管理模块
3. 仪表板模块

#### 中优先级模块（7-12周）
1. 订单管理模块
2. 风控管理模块
3. 策略管理模块
4. 市场数据模块

#### 低优先级模块（13-16周）
1. 内容管理模块
2. 报表模块
3. 系统配置模块
4. 其他辅助模块

### 第三阶段：Store精简 (17-18周)
1. 审查所有Stores
   - 确定哪些状态属于UI状态
   - 确定哪些状态应该由composables管理
   - 制定迁移计划

2. 精简Stores
   - 移除所有数据获取逻辑
   - 只保留UI状态管理
   - 更新相关组件引用

### 第四阶段：测试和验证 (19-20周)
1. 功能测试
   - 验证所有模块功能正常
   - 确保无回归问题
   - 验证Mock/Real切换功能

2. 性能测试
   - 验证页面加载性能
   - 验证数据获取性能
   - 优化慢查询和组件

3. 代码质量检查
   - 运行ESLint和Prettier
   - 检查TypeScript类型完整性
   - 确保代码符合规范

## 详细实施步骤

### 1. 基础设施建设和目录结构调整
- [ ] 创建新的目录结构
- [ ] 配置Vue Query
- [ ] 创建通用composables模板
- [ ] 建立迁移指南和规范文档

### 2. 高优先级模块重构
#### 用户管理模块
- [ ] 创建`src/composables/useUsers.ts`
- [ ] 创建`src/views/users/UsersView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/users.ts`

#### 钱包资产管理模块
- [ ] 创建`src/composables/useWallets.ts`
- [ ] 创建`src/views/assets/WalletsView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/wallets.ts`

#### 仪表板模块
- [ ] 创建`src/composables/useDashboard.ts`
- [ ] 创建`src/views/dashboard/DashboardView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/dashboard.ts`

### 3. 中优先级模块重构
#### 订单管理模块
- [ ] 创建`src/composables/useOrders.ts`
- [ ] 创建`src/views/orders/OrdersView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/orders.ts`

#### 风控管理模块
- [ ] 创建`src/composables/useRisk.ts`
- [ ] 创建`src/views/risk/RiskView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/risk.ts`

#### 策略管理模块
- [ ] 创建`src/composables/useStrategies.ts`
- [ ] 创建`src/views/strategies/StrategiesView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/strategies.ts`

### 4. 低优先级模块重构
#### 内容管理模块
- [ ] 创建`src/composables/useContent.ts`
- [ ] 创建`src/views/content/ContentView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/content.ts`

#### 报表模块
- [ ] 创建`src/composables/useReports.ts`
- [ ] 创建`src/views/reports/ReportsView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/reports.ts`

#### 系统配置模块
- [ ] 创建`src/composables/useConfig.ts`
- [ ] 创建`src/views/config/ConfigView.vue`
- [ ] 重构UI组件到`src/ui/`目录
- [ ] 精简`src/stores/config.ts`

### 5. Store精简和优化
- [ ] 审查所有Stores
- [ ] 精简Stores
- [ ] 优化剩余的Store结构

### 6. 测试和验证
- [ ] 功能测试
- [ ] 性能测试
- [ ] 代码质量检查
- [ ] 文档更新

## 风险评估和缓解措施

### 风险一：重构过程中引入新bug
- **缓解措施**：
  - 采用渐进式重构，逐模块替换
  - 建立完善的测试机制
  - 保持功能分支，逐步合并

### 风险二：团队成员对新架构不熟悉
- **缓解措施**：
  - 提供培训文档和示例
  - 建立结对编程机制
  - 创建架构决策记录(ADR)

### 风险三：重构影响开发进度
- **缓解措施**：
  - 制定详细的重构计划
  - 合理安排时间，避免影响业务开发
  - 优先重构高价值模块

## 预期收益

### 代码质量提升
- 更清晰的架构分层
- 更好的代码复用性
- 更容易维护和扩展

### 开发效率提升
- 30分钟可见性：任意页面30分钟内用Mock数据跑通基本UI
- 一键换源：VITE_USE_MOCK=true|false只在services/api内切换Mock/Real
- 更快的新功能开发速度

### 团队协作改善
- 统一的开发规范
- 更清晰的职责分工
- 更好的代码可读性