import type { RouteRecordRaw } from 'vue-router'

export const examplesRoutes: RouteRecordRaw[] = [
  {
    path: 'examples',
    name: 'Examples',
    redirect: '/admin/examples/rbac-guard',
    meta: {
      title: 'Examples',
      icon: 'ExperimentOutlined',
    },
    children: [
      {
        path: 'rbac-guard',
        name: 'RBACGuardDemo',
        component: () => import('@/pages/examples/RBACGuardDemo.vue'),
        meta: {
          title: 'RBAC Guard Demo',
          keepAlive: true,
        },
      },
      {
        path: 'schema-form',
        name: 'SchemaFormDemo',
        component: () => import('@/pages/examples/SchemaFormDemo.vue'),
        meta: {
          title: 'Schema Form Demo',
          keepAlive: true,
        },
      },
      {
        path: 'server-table',
        name: 'ServerTableDemo',
        component: () => import('@/pages/examples/ServerTableDemo.vue'),
        meta: {
          title: 'Server Table Demo',
          keepAlive: true,
        },
      },
      {
        path: 'version-control',
        name: 'VersionControlDemo',
        component: () => import('@/pages/examples/VersionControlDemo.vue'),
        meta: {
          title: 'Version Control Demo',
          keepAlive: true,
        },
      },
      {
        path: 'specialized-inputs',
        name: 'SpecializedInputsDemo',
        component: () => import('@/pages/examples/SpecializedInputsDemo.vue'),
        meta: {
          title: 'Specialized Inputs Demo',
          keepAlive: true,
        },
      },
    ],
  },
]
