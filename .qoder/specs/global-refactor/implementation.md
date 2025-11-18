# 全局架构重构实施计划

## 总体目标
将项目从当前的混合架构重构为完全符合"唯一真源通用 Vue3 范式 v1.0"的架构，确保所有模块都遵循统一的架构模式。

## 实施原则
1. **渐进式重构**：保持系统功能不受影响，逐步替换旧架构
2. **唯一性保证**：确保只存在一种架构模式，消除混合架构
3. **向后兼容**：在重构过程中保持API接口不变
4. **质量优先**：确保重构后的代码质量优于重构前

## 第一阶段：基础设施建设 (1-2周)

### 1.1 目录结构调整
- [ ] 创建新的目录结构
  - [ ] 创建`src/views/`目录
  - [ ] 创建`src/ui/`目录结构：
    - [ ] `src/ui/app-shell/`
    - [ ] `src/ui/pages/`
    - [ ] `src/ui/sections/`
    - [ ] `src/ui/widgets/`
    - [ ] `src/ui/primitives/`
  - [ ] 创建`src/composables/`目录
  - [ ] 创建`src/services/api/`目录（如果不存在）

### 1.2 Vue Query配置
- [ ] 配置Vue Query客户端
  - [ ] 设置默认查询配置（缓存时间、重试策略等）
  - [ ] 建立错误处理机制
  - [ ] 配置开发环境和生产环境的不同设置

### 1.3 通用工具和模板
- [ ] 创建通用composables模板
  - [ ] 创建useQuery通用模板
  - [ ] 创建useMutation通用模板
  - [ ] 建立分页和过滤的通用处理模式
  - [ ] 创建错误和加载状态的统一处理
- [ ] 创建迁移工具和脚本
  - [ ] 创建目录迁移脚本
  - [ ] 创建代码重构辅助工具
  - [ ] 创建架构合规性检查工具

### 1.4 文档和规范
- [ ] 建立迁移指南和规范文档
  - [ ] 创建架构迁移手册
  - [ ] 制定代码规范检查清单
  - [ ] 建立重构进度跟踪机制

## 第二阶段：高优先级模块重构 (3-8周)

### 2.1 用户管理模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useUsers.ts`
  - [ ] 实现用户列表查询hook
  - [ ] 实现用户详情查询hook
  - [ ] 实现用户操作mutation hooks
- [ ] 创建Views层
  - [ ] 创建`src/views/users/UsersView.vue`
  - [ ] 创建`src/views/users/UserDetailView.vue`
- [ ] 重构UI层
  - [ ] 将现有组件移动到新的ui目录结构
  - [ ] 确保组件通过props接收数据
  - [ ] 确保组件通过事件发出操作
- [ ] 精简Store
  - [ ] 移除用户相关的数据获取逻辑
  - [ ] 保留必要的UI状态管理
  - [ ] 更新相关组件的引用

### 2.2 钱包资产管理模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useWallets.ts`
  - [ ] 实现钱包地址查询hook
  - [ ] 实现链健康状态查询hook
  - [ ] 实现重试队列查询hook
  - [ ] 实现钱包操作mutation hooks
- [ ] 创建Views层
  - [ ] 创建`src/views/assets/WalletsView.vue`
  - [ ] 创建`src/views/assets/OverviewView.vue`
  - [ ] 创建`src/views/assets/DepositsView.vue`
  - [ ] 创建`src/views/assets/WithdrawalsView.vue`
- [ ] 重构UI层
  - [ ] 将现有组件移动到新的ui目录结构
  - [ ] 确保组件通过props接收数据
  - [ ] 确保组件通过事件发出操作
- [ ] 精简Store
  - [ ] 移除钱包相关的数据获取逻辑
  - [ ] 保留必要的UI状态管理
  - [ ] 更新相关组件的引用

### 2.3 仪表板模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useDashboard.ts`
  - [ ] 实现仪表板统计查询hook
  - [ ] 实现图表数据查询hook
  - [ ] 实现告警列表查询hook
- [ ] 创建Views层
  - [ ] 创建`src/views/dashboard/DashboardView.vue`
- [ ] 重构UI层
  - [ ] 将现有组件移动到新的ui目录结构
  - [ ] 确保组件通过props接收数据
  - [ ] 确保组件通过事件发出操作
- [ ] 精简Store
  - [ ] 移除仪表板相关的数据获取逻辑
  - [ ] 保留必要的UI状态管理
  - [ ] 更新相关组件的引用

## 第三阶段：中优先级模块重构 (9-16周)

### 3.1 订单管理模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useOrders.ts`
- [ ] 创建Views层
  - [ ] 创建`src/views/orders/SpotOrdersView.vue`
  - [ ] 创建`src/views/orders/FuturesOrdersView.vue`
  - [ ] 创建`src/views/orders/PositionsView.vue`
  - [ ] 创建`src/views/orders/LiquidationsView.vue`
  - [ ] 创建`src/views/orders/CopyTradingView.vue`
- [ ] 重构UI层
- [ ] 精简Store

### 3.2 风控管理模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useRisk.ts`
- [ ] 创建Views层
  - [ ] 创建`src/views/risk/RulesView.vue`
  - [ ] 创建`src/views/risk/LimitsView.vue`
  - [ ] 创建`src/views/risk/BlacklistView.vue`
- [ ] 重构UI层
- [ ] 精简Store

### 3.3 策略管理模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useStrategies.ts`
- [ ] 创建Views层
  - [ ] 创建`src/views/strategies/MonitoringView.vue`
  - [ ] 创建`src/views/strategies/PerformanceView.vue`
  - [ ] 创建`src/views/strategies/InstancesView.vue`
  - [ ] 创建`src/views/strategies/TemplatesView.vue`
  - [ ] 创建`src/views/strategies/BacktestView.vue`
- [ ] 重构UI层
- [ ] 精简Store

### 3.4 KYC模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useKyc.ts`
- [ ] 创建Views层
  - [ ] 创建`src/views/kyc/IndexView.vue`
  - [ ] 创建`src/views/kyc/DetailView.vue`
- [ ] 重构UI层
- [ ] 精简Store

### 3.5 认证模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useAuth.ts`
- [ ] 创建Views层
  - [ ] 创建`src/views/auth/LoginView.vue`
- [ ] 重构UI层
- [ ] 精简Store

### 3.6 安全模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useSecurity.ts`
- [ ] 创建Views层
  - [ ] 创建`src/views/config/security/SecurityView.vue`
- [ ] 重构UI层
- [ ] 精简Store

### 3.7 系统配置模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useConfig.ts`
- [ ] 创建Views层
  - [ ] 创建`src/views/config/instruments/InstrumentsView.vue`
  - [ ] 创建`src/views/config/margin/MarginView.vue`
  - [ ] 创建`src/views/config/fees/FeesView.vue`
  - [ ] 创建`src/views/config/calendar/CalendarView.vue`
  - [ ] 创建`src/views/config/icons/IconsView.vue`
  - [ ] 创建`src/views/config/mappings/MappingsView.vue`
- [ ] 重构UI层
- [ ] 精简Store

## 第四阶段：低优先级模块重构 (17-24周)

### 4.1 内容管理模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useContent.ts`
- [ ] 创建Views层
- [ ] 重构UI层
- [ ] 精简Store

### 4.2 报表模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useReports.ts`
- [ ] 创建Views层
- [ ] 重构UI层
- [ ] 精简Store

### 4.3 分析模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useAnalytics.ts`
- [ ] 创建Views层
- [ ] 重构UI层
- [ ] 精简Store

### 4.4 合规模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useCompliance.ts`
- [ ] 创建Views层
- [ ] 重构UI层

### 4.5 监控模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useMonitoring.ts`
- [ ] 创建Views层
- [ ] 重构UI层

### 4.6 运营模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useOps.ts`
- [ ] 创建Views层
- [ ] 重构UI层
- [ ] 精简Store

### 4.7 系统设置模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useSettings.ts`
- [ ] 创建Views层
- [ ] 重构UI层
- [ ] 精简Store

### 4.8 示例模块重构
- [ ] 创建composables层
  - [ ] 创建`src/composables/useExamples.ts`
- [ ] 创建Views层
- [ ] 重构UI层

## 第五阶段：Store精简和优化 (25-26周)

### 5.1 Store审查
- [ ] 审查所有Stores
  - [ ] 确定哪些状态属于UI状态
  - [ ] 确定哪些状态应该由composables管理
  - [ ] 制定迁移计划

### 5.2 Store精简
- [ ] 精简Stores
  - [ ] 移除所有数据获取逻辑
  - [ ] 只保留UI状态管理
  - [ ] 更新相关组件引用

### 5.3 Store优化
- [ ] 优化剩余的Store结构
  - [ ] 合并功能相似的Store
  - [ ] 优化状态管理逻辑
  - [ ] 确保Store只管理必要的UI状态

## 第六阶段：测试和验证 (27-28周)

### 6.1 功能测试
- [ ] 验证所有模块功能正常
  - [ ] 确保无回归问题
  - [ ] 验证Mock/Real切换功能
  - [ ] 验证所有用户场景

### 6.2 性能测试
- [ ] 验证页面加载性能
  - [ ] 验证数据获取性能
  - [ ] 优化慢查询和组件
  - [ ] 验证缓存机制有效性

### 6.3 代码质量检查
- [ ] 运行ESLint和Prettier
  - [ ] 检查TypeScript类型完整性
  - [ ] 确保代码符合规范
  - [ ] 检查架构合规性

### 6.4 文档更新
- [ ] 更新开发文档
  - [ ] 更新架构文档
  - [ ] 创建新架构使用指南
  - [ ] 更新API文档

## 风险控制措施

### 1. 功能回归风险
- **控制措施**：
  - 建立完善的测试用例
  - 保持功能分支，逐步合并
  - 定期进行回归测试

### 2. 团队适应风险
- **控制措施**：
  - 提供培训文档和示例
  - 建立结对编程机制
  - 创建架构决策记录(ADR)

### 3. 进度延误风险
- **控制措施**：
  - 制定详细的里程碑计划
  - 定期评估进度
  - 优先重构高价值模块

### 4. 兼容性风险
- **控制措施**：
  - 保持API接口不变
  - 建立向后兼容机制
  - 逐步替换旧架构

## 验收标准

### 1. 架构合规性
- [ ] 所有模块都遵循Views → Composables → Services → Contracts的数据流
- [ ] Stores只管理UI状态，不处理服务端数据
- [ ] 实现Vue Query管理服务端状态
- [ ] 保持Mock/Real切换功能

### 2. 功能完整性
- [ ] 所有功能正常工作，无回归问题
- [ ] 用户体验不受影响
- [ ] 性能指标达到预期

### 3. 代码质量
- [ ] 代码质量和可维护性显著提升
- [ ] 建立完整的文档和规范
- [ ] 通过所有代码质量检查

### 4. 团队协作
- [ ] 建立统一的开发规范
- [ ] 提升团队开发效率
- [ ] 降低新成员上手难度