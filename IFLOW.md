# DEIEX Admin Vue - iFlow Context

## 项目概述

DEIEX Admin Vue 是一个使用 Vue 3、TypeScript 和 Vite 构建的综合加密货币交易所管理系统。该项目采用模块化架构，提供了丰富的功能模块，包括仪表板、KYC、用户管理、资产管理、订单管理、配置管理、风险管理、运维管理、报表、系统设置、内容管理和交易策略等。

主要技术栈：
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript 5.x (严格模式)
- **构建工具**: Vite 7.x (基于Rolldown)
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **UI库**: Ant Design Vue 4.x
- **HTTP客户端**: Axios 1.x
- **图表**: Apache ECharts 6.x
- **日期处理**: Day.js
- **富文本编辑器**: Quill 2.x
- **国际化**: Vue I18n 9.x
- **性能监控**: Web Vitals 5.x
- **测试框架**: Vitest 4.x

## 项目结构

```
src/
├── App.vue               # 主应用组件
├── main.ts               # 应用入口文件
├── assets/               # 静态资源
├── components/           # 全局组件
├── composables/          # Vue组合式函数
├── forms/                # 表单组件
├── i18n/                 # 国际化配置
├── layouts/              # 布局组件
├── modals/               # 模态框和抽屉组件
├── pages/                # 页面组件
│   ├── auth/             # 认证页面
│   ├── content/          # 内容管理页面
│   ├── strategies/       # 交易策略页面
│   └── ...               # 其他功能模块页面
├── router/               # 路由配置
├── sections/             # 业务逻辑部分
├── services/             # API服务
├── shared/               # 共享组件
├── stores/               # Pinia状态存储
├── tables/               # 表格组件
├── types/                # TypeScript类型定义
├── utils/                # 工具函数
└── widgets/              # 可复用的小部件
```

## 核心功能模块

### 1. 认证与权限管理
- 基于JWT的认证系统
- RBAC权限控制
- 路由守卫
- Token刷新机制

### 2. 国际化支持
- 多语言支持 (English, 中文, 日文, 韩文)
- Ant Design Vue和Day.js的本地化

### 3. 布局系统
- 响应式布局设计
- 可折叠侧边栏
- 顶部导航栏
- 面包屑导航
- 页面标签页 (可选)
- 移动端适配

### 4. API客户端
- 基于Axios的封装
- 请求/响应拦截器
- 自动Token刷新
- 错误处理和通知

### 5. 内容管理系统
- **博客管理**：文章、分类、评论管理
- **通知系统**：模板、发送记录管理
- **公告系统**：事件、维护公告管理
- **邮件营销**：模板、活动、用户分段、效果统计

### 6. 交易策略系统
- **策略模板**：策略创建、编辑、克隆
- **策略实例**：策略部署、运行监控
- **回测系统**：历史数据回测
- **性能分析**：收益、风险指标分析
- **实时监控**：运行状态、风险监控

## 开发与构建

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

### 构建项目

```bash
# 开发环境构建
npm run build

# 预发布环境构建
npm run build:staging

# 生产环境构建
npm run build:production
```

### 代码检查与格式化

```bash
# 运行ESLint
npm run lint

# 使用Prettier格式化代码
npm run format
```

### 测试

```bash
# 运行测试
npm run test

# 运行测试并查看UI界面
npm run test:ui

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## 环境变量配置

项目使用以下环境变量文件：
- `.env.development` - 开发环境
- `.env.staging` - 预发布环境
- `.env.production` - 生产环境

关键环境变量：
- `VITE_APP_ENV` - 环境名称
- `VITE_API_BASE_URL` - API基础URL
- `VITE_WS_BASE_URL` - WebSocket基础URL
- `VITE_APP_TITLE` - 应用标题

## 开发规范

1. 使用TypeScript严格模式
2. 遵循Vue 3 Composition API和`<script setup>`语法
3. 使用Pinia进行状态管理
4. 遵循分层架构模式
5. 编写有意义的提交信息
6. 提交前运行代码检查 (由Husky强制执行)
7. 组件命名遵循 PascalCase
8. 文件命名遵循 kebab-case
9. 使用ESLint和Prettier保持代码风格一致

## 性能优化

1. **代码分割**：基于路由和功能模块的代码分割
2. **资源压缩**：CSS和JavaScript自动压缩
3. **图片优化**：使用适当的图片格式和尺寸
4. **懒加载**：组件和路由懒加载
5. **缓存策略**：合理的HTTP缓存策略

## 部署

1. 构建生产版本
2. 配置Web服务器 (Nginx/Apache)
3. 设置环境变量
4. 配置HTTPS (推荐)
5. 监控和日志配置