import type { RouteRecordRaw } from 'vue-router'

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: 'users',
    name: 'Users',
    redirect: '/admin/users/list',
    meta: {
      title: 'Users',
      icon: 'UserOutlined',
      permissions: ['users.view'],
    },
    children: [
      {
        path: 'list',
        name: 'UsersList',
        component: () => import('@/pages/users/List.vue'),
        meta: {
          title: 'User List',
          permissions: ['users.view'],
          keepAlive: true,
        },
      },
      {
        path: ':id',
        name: 'UserDetail',
        component: () => import('@/pages/users/Detail.vue'),
        meta: {
          title: 'User Detail',
          permissions: ['users.view'],
          keepAlive: false,
        },
      },
    ],
  },
]
