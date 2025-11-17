✅ 唯一真源通用 Vue3 范式 v1.0
（客户端站 + Admin 都用这套）

⸻

0. 北极星（North Star）
	•	30 分钟可见性：任意页面 30 分钟内，用 Mock 数据跑通基本 UI（含 loading / empty / error）。
	•	单一数据通道：路由页面只通过 composables 取数；composables 内只调用 services/api。
	•	一键换源：VITE_USE_MOCK=true|false 只在 services/api 内切换 Mock/Real，UI/composables 零改动。

⸻

1. 目录结构（通用客户端 + Admin）

src/
├── router/                 # vue-router 路由入口
│   └── index.ts
├── views/                  # 路由页面入口（Page 容器）
│   ├── public/             # 客户端/官网区
│   │   └── HomeView.vue
│   ├── dashboard/          # 登录后 / Admin 区
│   │   └── UsersView.vue
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

Nuxt 项目也可以沿用这套分层：pages/ 映射为 views/，components/ 下再按 ui/* 结构拆分即可。

⸻

2. 数据流 & 分层（超精简版）

路由视图层（router/ + views/）
	•	views/*View.vue（路由组件）只负责：
	•	调用对应 useXxx composable 取数
	•	组合 ui/pages/* + AppShell 等布局
	•	处理路由跳转、toast、权限判断（通过路由守卫或 useAuth）
	•	不直接 axios.fetch()，不直接访问后端。

典型模式：

<!-- views/dashboard/UsersView.vue -->
<script setup lang="ts">
import { useUsersQuery } from '@/composables/useUsers'
import UsersPage from '@/ui/pages/UsersPage.vue'

const { data, isLoading, isError, refetch } = useUsersQuery()
</script>

<template>
  <UsersPage
    :users="data?.items || []"
    :loading="isLoading"
    :error="isError"
    @refresh="refetch"
  />
</template>

UI 层（ui/*）
	•	只接收 props：data, isLoading, onSubmit, onDelete…
	•	通过 <script setup> + defineProps/defineEmits 实现：
	•	不做任何 IO，不依赖 services/api。
	•	不关心 Mock / Real。

composables 层（composables/）
	•	每个业务模块使用 Vue Query / 自封装请求层：
	•	useXxxQuery(params) / useXxxMutation()
	•	内部只调用 services/api/*.ts 暴露的方法
	•	负责：缓存 key、过期策略、分页/筛选、乐观更新等。

// composables/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { listUsers, createUser } from '@/services/api/users'

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => listUsers(),
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

services 层（services/api）
	•	角色：唯一 IO 出口（HTTP / SDK / Mock 切源）
	•	统一处理：
	•	baseURL
	•	headers / token
	•	错误封装
	•	trace-id 等

// services/api/users.ts
import { apiClient } from './client'
import { mockListUsers } from '@/mock/handlers/users'
import type { ListUsersParams, UserListResponse } from '@/contracts/users'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export async function listUsers(
  params?: ListUsersParams,
): Promise<UserListResponse> {
  if (useMock) return mockListUsers(params)
  const { data } = await apiClient.get('/users', { params })
  return data
}

contracts 层（contracts/）
	•	定义 DTO + Zod + OpenAPI 用的 schema：
	•	TS 类型 → composables / services / mock 共享
	•	Zod → 运行时验证后端返回
	•	OpenAPI → 给 BFF / Java 生成 SDK

// contracts/users.ts
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string(),
})

export type User = z.infer<typeof UserSchema>

mock 层（mock/）
	•	examples/：人工维护的高质量示例数据，用于：
	•	Storybook / UI 开发
	•	E2E / 集成测试
	•	产品文档截图
	•	handlers/：可选，使用 MSW 或自写拦截器模拟真实返回，基于 contracts。

⸻

3. 状态管理（UI vs 数据）
	•	服务器数据：一律交给 Vue Query（或统一的 data composable），放在 composables/。
	•	UI 状态（登录态、主题、弹窗开关、筛选条件等）：
	•	跨页面 / 多处使用：放 Pinia（stores/）。
	•	局部：ref()/reactive()/useToggle() + 组件内部状态即可。

原则：
	•	能从 URL / props / 服务器数据 推导出来的，不进全局 store。
	•	Admin & 客户端站 同一套：
	•	useAuth() + authStore 负责登录状态 / 用户信息。

⸻

4. 环境变量与脚本

.env.development

VITE_USE_MOCK=true
VITE_API_BASE_URL=https://api.dev.example.com
VITE_TRACE_HEADER=x-trace-id
VITE_APP_ENV=dev

package.json（示例）

{
  "scripts": {
    "dev": "vite",
    "dev:real": "cross-env VITE_USE_MOCK=false vite",
    "build": "vite build",
    "preview": "vite preview",
    "mock:check": "ts-node scripts/validate-mocks.ts"
  }
}

	•	客户端 & Admin 可以在一个 mono-repo 中：
	•	/apps/web-vue、/apps/admin-vue 共用 /packages/contracts、/packages/services、/packages/ui。

⸻

5. Definition of Done（最小门槛版）

任意 Vue 路由页面要算“合格”，至少满足：
	1.	UI 三态
	•	loading / empty / error 三态必有（可以是简化版）。
	2.	数据路径干净
	•	views/*View.vue → 只用 useXxx composable 取数；
	•	composables/* → 只用 services/api；
	•	ui/* → 不做 HTTP 调用。
	3.	一键换源
	•	VITE_USE_MOCK=true 能走完核心页面；
	•	VITE_USE_MOCK=false 切到真实 API 不需要改 UI/composables。
	4.	类型 & 校验
	•	关键接口在 contracts/ 有类型定义；
	•	Mock / 真实返回至少在 services 或 composables 中过一次 Zod 校验（可逐步铺开）。

⸻

6. 一句话总结（给自己和工程师看的）

Vue3 通用范式：
路由页面只找 composables；composables 只找 services；services 决定走 Mock 还是 Real；
所有数据模型都写在 contracts 里，客户端站和 Admin 共用一套语言。
🏗️ 架构完整性：路由视图层 → UI 层 → composables 层 → services 层 → contracts 层 → mock 层
