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
1. `