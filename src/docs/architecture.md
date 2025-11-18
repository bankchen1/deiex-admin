# Vue 3 通用范式目录结构

此目录结构遵循"唯一真源通用 Vue3 范式 v1.0"规范。

```
src/
├── router/                 # vue-router 路由入口
│   └── index.ts
├── views/                  # 路由页面入口（View 容器）
│   ├── public/             # 客户端/官网区
│   │   └── HomeView.vue
│   ├── dashboard/          # 登录后 / Admin 区
│   │   └── DashboardView.vue
│   └── ...
├── ui/                     # 纯 UI 层（不直接取数）
│   ├── app-shell/          # 布局、导航、权限门禁（Layout / Shell）
│   ├── pages/              # 页面 UI 组合（PageView，无路由逻辑）
│   ├── sections/           # 页面大区块（列表/详情/工具栏）
│   ├── widgets/            # 复用组件（表格/表单/筛选/图表/卡片）
│   └── primitives/         # 基础组件（Button/Input/Card…）
├── composables/            # 数据 hooks（useXxx，Vue3 组合式 API）
│   ├── useAuth.ts
│   ├── useUsers.ts
│   ├── useMarkets.ts
│   └── ...
├── services/               # 业务 API 客户端（单一 IO 出口）
│   └── api/
│       ├── client.ts       # 基础 HTTP 客户端（fetch/axios）
│       ├── auth.ts         # login/logout/getSession…
│       ├── users.ts        # listUsers/createUser…
│       ├── markets.ts
│       └── ...
├── contracts/              # API 契约（TS 类型 + Zod + OpenAPI 配置）
│   ├── auth.ts
│   ├── users.ts
│   ├── markets.ts
│   └── ...
├── mock/                   # Mock & 示例数据
│   ├── examples/           # 结构化演示数据
│   └── handlers/           # mock handlers（可选，MSW / 自定义）
├── stores/                 # 全局 UI 状态（Pinia：auth/ui/theme）
│   ├── auth.ts
│   └── ui.ts
├── plugins/                # 全局插件（Pinia、Vue Query、i18n 等）
│   └── vue-query.ts
├── lib/                    # 工具库（utils/constants/logger/formatters）
└── types/                  # 共享纯业务类型（可选）
```

## 目录说明

### views/
路由页面入口，包含所有路由组件。每个组件只负责：
- 调用对应 useXxx composable 取数
- 组合 ui/pages/* + AppShell 等布局
- 处理路由跳转、toast、权限判断

### ui/
纯 UI 层，不直接取数，只接收 props：
- `app-shell/` - 布局、导航、权限门禁
- `pages/` - 页面 UI 组合
- `sections/` - 页面大区块
- `widgets/` - 复用组件
- `primitives/` - 基础组件

### composables/
数据 hooks，使用 Vue Query 管理服务端数据：
- useXxxQuery(params) / useXxxMutation()
- 内部只调用 services/api/*.ts 暴露的方法
- 负责缓存 key、过期策略、分页/筛选等

### services/api/
业务 API 客户端，作为唯一 IO 出口：
- 统一处理 baseURL、headers/token、错误封装等
- 支持 Mock/Real 切换
- 每个模块一个文件

### contracts/
API 契约，定义 TS 类型和 Zod schema：
- TS 类型供 composables/services/mock 共享
- Zod 用于运行时验证后端返回