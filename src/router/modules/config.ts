import type { RouteRecordRaw } from 'vue-router'

export const configRoutes: RouteRecordRaw[] = [
  {
    path: 'config',
    name: 'Config',
    redirect: '/admin/config/instruments',
    meta: {
      title: 'Configuration',
      icon: 'SettingOutlined',
      permissions: ['config.view'],
    },
    children: [
      {
        path: 'instruments',
        name: 'ConfigInstruments',
        component: () => import('@/pages/config/instruments/index.vue'),
        meta: {
          title: 'Instruments',
          permissions: ['config.instruments.view'],
          keepAlive: true,
        },
      },
      {
        path: 'margin',
        name: 'ConfigMargin',
        component: () => import('@/pages/config/margin/index.vue'),
        meta: {
          title: 'Margin',
          permissions: ['config.margin.view'],
          keepAlive: true,
        },
      },
      {
        path: 'fees',
        name: 'ConfigFees',
        component: () => import('@/pages/config/fees/index.vue'),
        meta: {
          title: 'Fees',
          permissions: ['config.fees.view'],
          keepAlive: true,
        },
      },
      {
        path: 'calendar',
        name: 'ConfigCalendar',
        component: () => import('@/pages/config/calendar/index.vue'),
        meta: {
          title: 'Calendar',
          permissions: ['config.calendar.view'],
          keepAlive: true,
        },
      },
      {
        path: 'icons',
        name: 'ConfigIcons',
        component: () => import('@/pages/config/icons/index.vue'),
        meta: {
          title: 'Icons',
          permissions: ['config.icons.view'],
          keepAlive: true,
        },
      },
      {
        path: 'mappings',
        name: 'ConfigMappings',
        component: () => import('@/pages/config/mappings/index.vue'),
        meta: {
          title: 'Mappings',
          permissions: ['config.mappings.view'],
          keepAlive: true,
        },
      },
      {
        path: 'security',
        name: 'ConfigSecurity',
        component: () => import('@/pages/config/security/index.vue'),
        meta: {
          title: 'Security',
          permissions: ['config.security.view'],
          keepAlive: true,
        },
      },
    ],
  },
]
