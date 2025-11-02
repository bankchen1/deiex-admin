import type { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: 'settings',
    name: 'Settings',
    component: () => import('@/pages/settings/index.vue'),
    meta: {
      title: 'Settings',
      icon: 'SettingOutlined',
      permissions: ['settings.view'],
      keepAlive: true,
    },
  },
]
