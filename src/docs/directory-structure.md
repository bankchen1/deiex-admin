# Directory Structure Setup

This document outlines the new directory structure for the application following the "唯一真源通用 Vue3 范式 v1.0".

## New Directory Structure

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

## Migration Guide

### 1. Creating the new directory structure

The following directories need to be created:
- `src/views/`
- `src/ui/app-shell/`
- `src/ui/pages/`
- `src/ui/sections/`
- `src/ui/widgets/`
- `src/ui/primitives/`

### 2. Moving existing files

Existing `pages` should be moved to `views` and renamed to follow the `*View.vue` pattern.

Existing UI components in various locations should be moved to the appropriate `ui` subdirectories:
- Layout components → `ui/app-shell/`
- Page-level components → `ui/pages/`
- Section-level components → `ui/sections/`
- Reusable components → `ui/widgets/`
- Basic components → `ui/primitives/`

### 3. Updating imports

All imports referencing the old paths need to be updated to the new structure.

### 4. Creating Views

Each existing page component should be split into:
1. A View component in `src/views/` that handles data fetching via composables
2. A Page component in `src/ui/pages/` that handles UI presentation