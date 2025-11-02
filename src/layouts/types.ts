// Layout Component Types

export interface MenuItem {
  key: string
  path: string
  title: string
  icon?: string
  permissions?: string[]
  children?: MenuItem[]
  hidden?: boolean
}

export interface BreadcrumbItem {
  title: string
  path?: string
}
