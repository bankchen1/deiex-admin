# 架构合规性检查清单

此清单用于确保项目符合"唯一真源通用 Vue3 范式 v1.0"规范。

## 目录结构检查

### ✅ 必须存在的目录
- [x] `src/router/` - 路由入口
- [x] `src/views/` - 路由页面入口
- [x] `src/ui/` - 纯 UI 层
- [x] `src/composables/` - 数据 hooks
- [x] `src/services/` - 业务 API 客户端
- [x] `src/contracts/` - API 契约
- [x] `src/mock/` - Mock 数据
- [x] `src/stores/` - 全局 UI 状态
- [x] `src/plugins/` - 全局插件
- [x] `src/lib/` - 工具库
- [x] `src/types/` - 共享业务类型

### ✅ ui/ 子目录结构
- [x] `src/ui/app-shell/` - 布局、导航、权限门禁
- [x] `src/ui/pages/` - 页面 UI 组合
- [x] `src/ui/sections/` - 页面大区块
- [x] `src/ui/widgets/` - 复用组件
- [x] `src/ui/primitives/` - 基础组件

## 数据流检查

### ✅ Views 层 (src/views/*)
- [ ] Views 组件只负责调用 composables 取数
- [ ] Views 组件组合 ui/pages/* 组件
- [ ] Views 组件不直接访问 services/api
- [ ] Views 组件不直接访问 stores 获取服务端数据

### ✅ UI 层 (src/ui/*)
- [ ] UI 组件只接收 props 传递数据
- [ ] UI 组件通过事件 emit 发出操作
- [ ] UI 组件不做任何 IO 操作
- [ ] UI 组件不依赖 services/api

### ✅ Composables 层 (src/composables/*)
- [ ] 使用 Vue Query 管理服务端数据
- [ ] 只调用 services/api/*.ts 暴露的方法
- [ ] 负责缓存 key、过期策略、分页/筛选等
- [ ] 不管理服务端数据状态（由 Vue Query 管理）

### ✅ Services 层 (src/services/api/*)
- [ ] 作为唯一 IO 出口
- [ ] 支持 Mock/Real 切换
- [ ] 统一处理错误封装
- [ ] 不包含业务逻辑

### ✅ Stores 层 (src/stores/*)
- [ ] 只管理 UI 状态（登录态、主题、弹窗开关等）
- [ ] 不处理服务端数据获取
- [ ] 不包含业务逻辑

## 功能要求检查

### ✅ 北极星原则
- [ ] 30 分钟可见性：任意页面 30 分钟内用 Mock 数据跑通基本 UI
- [ ] 单一数据通道：路由页面只通过 composables 取数
- [ ] 一键换源：VITE_USE_MOCK=true|false 只在 services/api 内切换 Mock/Real

### ✅ 技术栈要求
- [ ] 使用 Vue 3 Composition API
- [ ] 使用 TypeScript 严格模式
- [ ] 使用 Vue Query 管理服务端数据
- [ ] 使用 Pinia 管理 UI 状态

### ✅ 代码质量要求
- [ ] 所有组件和函数都有类型定义
- [ ] 遵循 ESLint 和 Prettier 规范
- [ ] 有适当的错误处理
- [ ] 有必要的注释和文档

## 迁移状态跟踪

### 高优先级模块
- [ ] 用户管理模块 (users)
- [ ] 钱包资产管理模块 (assets)
- [ ] 仪表板模块 (dashboard)

### 中优先级模块
- [ ] 订单管理模块 (orders)
- [ ] 风控管理模块 (risk)
- [ ] 策略管理模块 (strategies)
- [ ] KYC模块 (kyc)
- [ ] 认证模块 (auth)
- [ ] 安全模块 (security)
- [ ] 系统配置模块 (config)

### 低优先级模块
- [ ] 内容管理模块 (content)
- [ ] 报表模块 (reports)
- [ ] 分析模块 (analytics)
- [ ] 合规模块 (compliance)
- [ ] 监控模块 (monitoring)
- [ ] 运营模块 (ops)
- [ ] 系统设置模块 (settings)
- [ ] 示例模块 (examples)
- [ ] 市场数据模块 (market)

## 验收标准

### ✅ 架构合规性
- [ ] 所有模块都遵循 Views → Composables → Services → Contracts 的数据流
- [ ] Stores 只管理 UI 状态，不处理服务端数据
- [ ] 实现 Vue Query 管理服务端状态
- [ ] 保持 Mock/Real 切换功能

### ✅ 功能完整性
- [ ] 所有功能正常工作，无回归问题
- [ ] 用户体验不受影响
- [ ] 性能指标达到预期

### ✅ 代码质量
- [ ] 代码质量和可维护性显著提升
- [ ] 建立完整的文档和规范
- [ ] 通过所有代码质量检查

### ✅ 团队协作
- [ ] 建立统一的开发规范
- [ ] 提升团队开发效率
- [ ] 降低新成员上手难度