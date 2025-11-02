import type { RouteRecordRaw } from 'vue-router'

export const contentRoutes: RouteRecordRaw[] = [
  {
    path: 'content',
    name: 'Content',
    redirect: '/admin/content/blog',
    meta: {
      title: 'Content Management',
      icon: 'ReadOutlined',
      permissions: ['content.view'],
    },
    children: [
      {
        path: 'blog',
        name: 'Blog',
        redirect: '/admin/content/blog/dashboard',
        meta: {
          title: 'Blog',
          permissions: ['content.blog.view'],
        },
        children: [
          {
            path: 'dashboard',
            name: 'BlogDashboard',
            component: () => import('@/pages/content/blog/Dashboard.vue'),
            meta: {
              title: 'Dashboard',
              permissions: ['content.blog.view'],
            },
          },
          {
            path: 'articles',
            name: 'BlogArticles',
            component: () => import('@/pages/content/blog/index.vue'),
            meta: {
              title: 'Articles',
              permissions: ['content.blog.articles.view'],
            },
          },
          {
            path: 'categories',
            name: 'BlogCategories',
            component: () => import('@/pages/content/blog/categories.vue'),
            meta: {
              title: 'Categories',
              permissions: ['content.blog.categories.view'],
            },
          },
          {
            path: 'comments',
            name: 'BlogComments',
            component: () => import('@/pages/content/blog/comments.vue'),
            meta: {
              title: 'Comments',
              permissions: ['content.blog.comments.view'],
            },
          },
        ],
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/pages/content/notifications/index.vue'),
        meta: {
          title: 'Notifications',
          permissions: ['content.notifications.view'],
        },
      },
      {
        path: 'announcements',
        name: 'Announcements',
        component: () => import('@/pages/content/announcements/index.vue'),
        meta: {
          title: 'Announcements',
          permissions: ['content.announcements.view'],
        },
      },
      {
        path: 'email-marketing',
        name: 'EmailMarketing',
        component: () => import('@/pages/content/email-marketing/index.vue'),
        meta: {
          title: 'Email Marketing',
          permissions: ['content.email.view'],
        },
      },
    ],
  },
]
