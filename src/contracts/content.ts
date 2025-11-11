/**
 * Content Management Contracts
 *
 * Field contracts for blog articles, categories, comments, notifications, emails, etc.
 */

// Article Entity Contracts
export interface Article {
  id: string
  title: {
    en: string
    zh?: string
  }
  slug: string
  content: {
    en: string
    zh?: string
  }
  excerpt: {
    en?: string
    zh?: string
  }
  coverImage?: string
  authorId: string
  authorName: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  categoryId: string
  categoryName: string
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  version: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// Category Entity Contracts
export interface Category {
  id: string
  name: {
    en: string
    zh?: string
  }
  slug: string
  description?: {
    en?: string
    zh?: string
  }
  parentId?: string
  sortOrder: number
  status: 'active' | 'inactive' | 'archived'
  postCount: number
  createdAt: string
  updatedAt: string
}

// Comment Entity Contracts
export interface Comment {
  id: string
  articleId: string
  articleTitle: string
  userId: string
  userNickname: string
  content: string
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  parentId?: string
  replies?: Comment[]
  likes: number
  ip?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
}

// Notification Entity Contracts
export interface Notification {
  id: string
  title: {
    en: string
    zh?: string
  }
  content: {
    en: string
    zh?: string
  }
  type: 'info' | 'warning' | 'error' | 'success' | 'announcement'
  priority: 'low' | 'medium' | 'high' | 'critical'
  channels: ('email' | 'push' | 'in_app' | 'sms')[]
  recipients: string[] // user IDs
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  scheduledAt?: string
  sentAt?: string
  deliveredCount: number
  readCount: number
  clickedCount: number
  errorCount: number
  createdAt: string
  updatedAt: string
}

// Notification Template Contracts
export interface NotificationTemplate {
  id: string
  name: string
  subject: {
    en: string
    zh?: string
  }
  content: {
    en: string
    zh?: string
  }
  type: 'email' | 'push' | 'in_app' | 'sms'
  category: string
  variables: string[]
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
}

// Email Campaign Contracts
export interface EmailCampaign {
  id: string
  name: string
  subject: {
    en: string
    zh?: string
  }
  content: {
    en: string
    zh?: string
  }
  segments: string[] // segment IDs
  sender: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
  scheduledAt?: string
  sentAt?: string
  totalRecipients: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  bouncedCount: number
  unsubscribedCount: number
  createdAt: string
  updatedAt: string
}

// Email Template Contracts
export interface EmailTemplate {
  id: string
  name: string
  subject: {
    en: string
    zh?: string
  }
  content: {
    en: string
    zh?: string
  }
  category: string
  variables: string[]
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
}

// Email Segment Contracts
export interface EmailSegment {
  id: string
  name: string
  description?: string
  criteria: Array<{
    field: string
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
    value: any
  }>
  userCount: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Query Parameter Contracts
export interface ArticleQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'draft' | 'published' | 'archived'
  categoryId?: string
  featured?: boolean
  authorId?: string
  search?: string
  startDate?: string
  endDate?: string
}

export interface CategoryQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'archived'
  search?: string
  parentId?: string
}

export interface CommentQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'pending' | 'approved' | 'rejected' | 'spam'
  articleId?: string
  userId?: string
  search?: string
}

export interface NotificationQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  type?: 'info' | 'warning' | 'error' | 'success' | 'announcement'
  priority?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  userId?: string
  search?: string
}

export interface EmailCampaignQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
  search?: string
}

export interface EmailTemplateQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  category?: string
  status?: 'active' | 'inactive' | 'draft'
  search?: string
}

export interface EmailSegmentQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'inactive'
  search?: string
}
