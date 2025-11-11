/**
 * Content Facade - 内容管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost, safePut, safeDelete } from '../_client'
import type {
  Article,
  Category,
  Comment,
  Notification,
  EmailCampaign,
  EmailTemplate,
  EmailSegment,
  ArticleQueryParams,
  CategoryQueryParams,
  CommentQueryParams,
  NotificationQueryParams,
  EmailCampaignQueryParams,
  EmailTemplateQueryParams,
  EmailSegmentQueryParams,
} from '@/contracts/content'

// Blog Article Functions
export const listBlogArticles = async (
  params: ArticleQueryParams = {}
): Promise<FacadeResponse<{ data: Article[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Article[]
        total: number
        page: number
        pageSize: number
      }>('/admin/content/articles', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getBlogArticleById = async (id: string): Promise<FacadeResponse<Article>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Article>(`/admin/content/articles/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const createBlogArticle = async (
  payload: Omit<Article, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>
): Promise<FacadeResponse<Article>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Article>('/admin/content/articles', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateBlogArticle = async (
  id: string,
  payload: Partial<Omit<Article, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>
): Promise<FacadeResponse<Article>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<Article>(`/admin/content/articles/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteBlogArticle = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/content/articles/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const publishBlogArticle = async (id: string): Promise<FacadeResponse<Article>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Article>(`/admin/content/articles/${id}/publish`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const archiveBlogArticle = async (id: string): Promise<FacadeResponse<Article>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Article>(`/admin/content/articles/${id}/archive`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Blog Category Functions
export const listBlogCategories = async (
  params: CategoryQueryParams = {}
): Promise<FacadeResponse<{ data: Category[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Category[]
        total: number
        page: number
        pageSize: number
      }>('/admin/content/categories', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getBlogCategoryById = async (id: string): Promise<FacadeResponse<Category>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Category>(`/admin/content/categories/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const createBlogCategory = async (
  payload: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FacadeResponse<Category>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Category>('/admin/content/categories', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateBlogCategory = async (
  id: string,
  payload: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<FacadeResponse<Category>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<Category>(`/admin/content/categories/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteBlogCategory = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/content/categories/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Comment Functions
export const listComments = async (
  params: CommentQueryParams = {}
): Promise<FacadeResponse<{ data: Comment[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Comment[]
        total: number
        page: number
        pageSize: number
      }>('/admin/content/comments', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getCommentById = async (id: string): Promise<FacadeResponse<Comment>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Comment>(`/admin/content/comments/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateCommentStatus = async (
  id: string,
  status: string
): Promise<FacadeResponse<Comment>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Comment>(`/admin/content/comments/${id}/status`, { status })
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteComment = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/content/comments/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Notification Functions
export const listNotifications = async (
  params: NotificationQueryParams = {}
): Promise<
  FacadeResponse<{ data: Notification[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Notification[]
        total: number
        page: number
        pageSize: number
      }>('/admin/content/notifications', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getNotificationById = async (id: string): Promise<FacadeResponse<Notification>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Notification>(`/admin/content/notifications/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const createNotification = async (
  payload: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FacadeResponse<Notification>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Notification>('/admin/content/notifications', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateNotification = async (
  id: string,
  payload: Partial<Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<FacadeResponse<Notification>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<Notification>(`/admin/content/notifications/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteNotification = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/content/notifications/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const publishNotification = async (id: string): Promise<FacadeResponse<Notification>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Notification>(`/admin/content/notifications/${id}/publish`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Email Campaign Functions
export const listEmailCampaigns = async (
  params: EmailCampaignQueryParams = {}
): Promise<
  FacadeResponse<{ data: EmailCampaign[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: EmailCampaign[]
        total: number
        page: number
        pageSize: number
      }>('/admin/content/email/campaigns', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getEmailCampaignById = async (id: string): Promise<FacadeResponse<EmailCampaign>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<EmailCampaign>(`/admin/content/email/campaigns/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const createEmailCampaign = async (
  payload: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FacadeResponse<EmailCampaign>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<EmailCampaign>('/admin/content/email/campaigns', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateEmailCampaign = async (
  id: string,
  payload: Partial<Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<FacadeResponse<EmailCampaign>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<EmailCampaign>(`/admin/content/email/campaigns/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteEmailCampaign = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/content/email/campaigns/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const sendEmailCampaign = async (id: string): Promise<FacadeResponse<EmailCampaign>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<EmailCampaign>(`/admin/content/email/campaigns/${id}/send`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Email Template Functions
export const listEmailTemplates = async (
  params: EmailTemplateQueryParams = {}
): Promise<
  FacadeResponse<{ data: EmailTemplate[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: EmailTemplate[]
        total: number
        page: number
        pageSize: number
      }>('/admin/content/email/templates', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getEmailTemplateById = async (id: string): Promise<FacadeResponse<EmailTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<EmailTemplate>(`/admin/content/email/templates/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const createEmailTemplate = async (
  payload: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FacadeResponse<EmailTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<EmailTemplate>('/admin/content/email/templates', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateEmailTemplate = async (
  id: string,
  payload: Partial<Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<FacadeResponse<EmailTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<EmailTemplate>(`/admin/content/email/templates/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteEmailTemplate = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/content/email/templates/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Email Segment Functions
export const listEmailSegments = async (
  params: EmailSegmentQueryParams = {}
): Promise<
  FacadeResponse<{ data: EmailSegment[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: EmailSegment[]
        total: number
        page: number
        pageSize: number
      }>('/admin/content/email/segments', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getEmailSegmentById = async (id: string): Promise<FacadeResponse<EmailSegment>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<EmailSegment>(`/admin/content/email/segments/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const createEmailSegment = async (
  payload: Omit<EmailSegment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FacadeResponse<EmailSegment>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<EmailSegment>('/admin/content/email/segments', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateEmailSegment = async (
  id: string,
  payload: Partial<Omit<EmailSegment, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<FacadeResponse<EmailSegment>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<EmailSegment>(`/admin/content/email/segments/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real mode
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteEmailSegment = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/content/email/segments/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
