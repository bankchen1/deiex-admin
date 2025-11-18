# 全面架构重构计划

## 总体目标
将项目从当前的混合范式重构为完全符合"唯一真源通用 Vue3 范式 v1.0"的架构，实现清晰的分层架构和规范的数据流。

## 分阶段实施计划

### 阶段一：基础设施建设 (1-2周)
目标：建立支持新架构的基础设施和工具

#### 任务清单：
- [ ] 1.1 建立 Vue Query 配置
  - 配置 Vue Query 客户端
  - 设置默认查询配置（缓存时间、重试策略等）
  - 建立错误处理机制

- [ ] 1.2 创建通用 composables 模板
  - 创建 useQuery 和 useMutation 通用模板
  - 建立分页和过滤的通用处理模式
  - 创建错误和加载状态的统一处理

- [ ] 1.3 建立新的目录结构
  - 创建 src/views 目录
  - 创建 src/ui 目录结构（pages, sections, widgets, primitives）
  - 建立迁移指南和规范文档

- [ ] 1.4 建立重构工具和脚本
  - 创建代码迁移辅助工具
  - 建立代码检查和验证脚本
  - 创建重构进度跟踪机制

### 阶段二：高优先级模块重构 (3-6周)
目标：重构核心业务模块，验证新架构的有效性

#### 2.1 钱包模块 (Wallets) 重构
- [ ] 2.1.1 创建 composables 层 (useWallets.ts)
  - 实现 useWalletsQuery 查询钩子
  - 实现 useChainHealthQuery 查询钩子
  - 实现 useRetryQueueQuery 查询钩子
  - 实现 useSyncBalanceMutation 变更钩子
  - 实现 useRetryTaskMutation 变更钩子
  - 实现 useCancelTaskMutation 变更钩子

- [ ] 2.1.2 创建 Views 层 (WalletsView.vue)
  - 移动数据获取逻辑到 composables
  - 保持 UI 展示逻辑不变
  - 确保所有功能正常工作

- [ ] 2.1.3 重构 UI 层
  - 将现有组件移动到新的 ui 目录结构
  - 确保组件通过 props 接收数据
  - 确保组件通过事件发出操作

- [ ] 2.1.4 精简 Store
  - 移除钱包相关的数据获取逻辑
  - 保留必要的 UI 状态管理
  - 更新相关组件的引用

#### 2.2 用户模块 (Users) 重构
- [ ] 2.2.1 创建 composables 层 (useUsers.ts)
  - 实现 useUsersQuery 查询钩子
  - 实现 useUserDetailQuery 查询钩子
  - 实现 useUserStatsQuery 查询钩子
  - 实现 updateUserVipMutation 变更钩子
  - 实现 updateUserTagsMutation 变更钩子
  - 实现 reset2FAMutation 变更钩子
  - 实现 disableUserMutation 变更钩子
  - 实现 enableUserMutation 变更钩子

- [ ] 2.2.2 创建 Views 层 (UsersView.vue)
  - 移动数据获取逻辑到 composables
  - 保持 UI 展示逻辑不变
  - 确保所有功能正常工作

- [ ] 2.2.3 重构 UI 层
  - 将现有组件移动到新的 ui 目录结构
  - 确保组件通过 props 接收数据
  - 确保组件通过事件发出操作

- [ ] 2.2.4 精简 Store
  - 移除用户相关的数据获取逻辑
  - 保留必要的 UI 状态管理
  - 更新相关组件的引用

#### 2.3 仪表板模块 (Dashboard) 重构
- [ ] 2.3.1 创建 composables 层 (useDashboard.ts)
  - 实现 useDashboardStatsQuery 查询钩子
  - 实现 useDashboardChartsQuery 查询钩子
  - 实现 useDashboardAlertsQuery 查询钩子
  - 实现 useAlertDetailQuery 查询钩子
  - 实现 updateAlertMutation 变更钩子

- [ ] 2.3.2 创建 Views 层 (DashboardView.vue)
  - 移动数据获取逻辑到 composables
  - 保持 UI 展示逻辑不变
  - 确保所有功能正常工作

- [ ] 2.3.3 重构 UI 层
  - 将现有组件移动到新的 ui 目录结构
  - 确保组件通过 props 接收数据
  - 确保组件通过事件发出操作

- [ ] 2.3.4 精简 Store
  - 移除仪表板相关的数据获取逻辑
  - 保留必要的 UI 状态管理
  - 更新相关组件的引用

### 阶段三：中优先级模块重构 (7-12周)
目标：重构中等优先级的业务模块

#### 3.1 资产模块 (Assets) 重构
- [ ] 3.1.1 创建 composables 层 (useAssets.ts)
- [ ] 3.1.2 创建 Views 层
- [ ] 3.1.3 重构 UI 层
- [ ] 3.1.4 精简 Store

#### 3.2 订单模块 (Orders) 重构
- [ ] 3.2.1 创建 composables 层 (useOrders.ts)
- [ ] 3.2.2 创建 Views 层
- [ ] 3.2.3 重构 UI 层
- [ ] 3.2.4 精简 Store

#### 3.3 风控模块 (Risk) 重构
- [ ] 3.3.1 创建 composables 层 (useRisk.ts)
- [ ] 3.3.2 创建 Views 层
- [ ] 3.3.3 重构 UI 层
- [ ] 3.3.4 精简 Store

### 阶段四：低优先级模块重构 (13-16周)
目标：重构剩余的业务模块

#### 4.1 内容模块 (Content) 重构
- [ ] 4.1.1 创建 composables 层 (useContent.ts)
- [ ] 4.1.2 创建 Views 层
- [ ] 4.1.3 重构 UI 层
- [ ] 4.1.4 精简 Store

#### 4.2 设置模块 (Settings) 重构
- [ ] 4.2.1 创建 composables 层 (useSettings.ts)
- [ ] 4.2.2 创建 Views 层
- [ ] 4.2.3 重构 UI 层
- [ ] 4.2.4 精简 Store

#### 4.3 其他辅助模块重构
- [ ] 4.3.1 重构相关模块
- [ ] 4.3.2 创建对应的 composables 和 Views

### 阶段五：Store 精简和优化 (17-18周)
目标：完全移除 Store 中的数据获取逻辑，聚焦于 UI 状态管理

#### 任务清单：
- [ ] 5.1 审查所有 Stores
  - 确定哪些状态属于 UI 状态
  - 确定哪些状态应该由 composables 管理
  - 制定迁移计划

- [ ] 5.2 精简 Stores
  - 移除所有数据获取逻辑
  - 只保留 UI 状态管理
  - 更新相关组件引用

- [ ] 5.3 优化和重构
  - 优化剩余的 Store 结构
  - 确保 Store 只管理必要的 UI 状态
  - 建立 Store 使用规范

### 阶段六：测试和验证 (19-20周)
目标：确保重构后的系统功能完整，性能良好

#### 任务清单：
- [ ] 6.1 功能测试
  - 验证所有模块功能正常
  - 确保无回归问题
  - 验证 Mock/Real 切换功能

- [ ] 6.2 性能测试
  - 验证页面加载性能
  - 验证数据获取性能
  - 优化慢查询和组件

- [ ] 6.3 代码质量检查
  - 运行 ESLint 和 Prettier
  - 检查 TypeScript 类型完整性
  - 确保代码符合规范

- [ ] 6.4 文档更新
  - 更新开发文档
  - 更新架构文档
  - 创建新架构使用指南

## 风险评估和缓解措施

### 风险一：重构过程中引入新 bug
- **缓解措施**：
  - 采用渐进式重构，逐模块替换
  - 建立完善的测试机制
  - 保持功能分支，逐步合并

### 风险二：团队成员对新架构不熟悉
- **缓解措施**：
  - 提供培训文档和示例
  - 建立结对编程机制
  - 创建架构决策记录 (ADR)

### 风险三：重构影响开发进度
- **缓解措施**：
  - 制定详细的重构计划
  - 合理安排时间，避免影响业务开发
  - 优先重构高价值模块

## 预期收益和验收标准

### 预期收益：
1. **代码质量提升**：清晰的架构分层，更好的代码复用性
2. **开发效率提升**：30 分钟可见性，一键换源功能
3. **团队协作改善**：统一的开发规范，清晰的职责分工
4. **可维护性增强**：更容易维护和扩展

### 验收标准：
- [ ] 所有模块都遵循 Views → Composables → Services → Contracts 的数据流
- [ ] Stores 只管理 UI 状态，不处理服务端数据
- [ ] 实现 Vue Query 管理服务端状态
- [ ] 保持 Mock/Real 切换功能
- [ ] 所有功能正常工作，无回归问题
- [ ] 代码质量和可维护性显著提升
- [ ] 建立完整的文档和规范