import type { RouteRecordRaw } from 'vue-router'

export const opsRoutes: RouteRecordRaw[] = [
  {
    path: 'ops',
    name: 'Ops',
    redirect: '/admin/ops/logs',
    meta: {
      title: 'Operations',
      icon: 'ToolOutlined',
      permissions: ['ops.view'],
    },
    children: [
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/pages/ops/Logs.vue'),
        meta: {
          title: 'Logs',
          permissions: ['ops.logs.view'],
          keepAlive: true,
        },
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: () => import('@/pages/ops/Tasks.vue'),
        meta: {
          title: 'Tasks',
          permissions: ['ops.tasks.view'],
          keepAlive: true,
        },
      },
    ],
  },
]
