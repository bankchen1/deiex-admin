import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  // Blog Article Functions
  listBlogArticles,
  getBlogArticleById,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
  publishBlogArticle,
  archiveBlogArticle,
  // Blog Category Functions
  listBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  // Comment Functions
  listComments,
  getCommentById,
  updateCommentStatus,
  deleteComment,
  // Notification Functions
  listNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  publishNotification,
  // Email Functions
  listEmailCampaigns,
  getEmailCampaignById,
  createEmailCampaign,
  updateEmailCampaign,
  deleteEmailCampaign,
  sendEmailCampaign,
  listEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  listEmailSegments,
  getEmailSegmentById,
  createEmailSegment,
  updateEmailSegment,
  deleteEmailSegment,
  // Type Imports
  type ArticleQueryParams,
  type CategoryQueryParams,
  type CommentQueryParams,
  type NotificationQueryParams,
  type EmailCampaignQueryParams,
  type EmailTemplateQueryParams,
  type EmailSegmentQueryParams,
} from '@/services/api/facade'
import type {
  Article,
  Category,
  Comment,
  Notification,
  EmailCampaign,
  EmailTemplate,
  EmailSegment,
} from '@/contracts/content'

export const useContentStore = defineStore('content', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Blog Articles
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const articlesTotal = ref(0)
  const articlesCurrentPage = ref(1)
  const articlesPageSize = ref(20)

  // Blog Categories
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const categoriesTotal = ref(0)
  const categoriesCurrentPage = ref(1)
  const categoriesPageSize = ref(20)

  // Comments
  const comments = ref<Comment[]>([])
  const currentComment = ref<Comment | null>(null)
  const commentsTotal = ref(0)
  const commentsCurrentPage = ref(1)
  const commentsPageSize = ref(20)

  // Notifications
  const notifications = ref<Notification[]>([])
  const currentNotification = ref<Notification | null>(null)
  const notificationsTotal = ref(0)
  const notificationsCurrentPage = ref(1)
  const notificationsPageSize = ref(20)

  // Email Campaigns
  const emailCampaigns = ref<EmailCampaign[]>([])
  const currentEmailCampaign = ref<EmailCampaign | null>(null)
  const emailCampaignsTotal = ref(0)
  const emailCampaignsCurrentPage = ref(1)
  const emailCampaignsPageSize = ref(20)

  // Email Templates
  const emailTemplates = ref<EmailTemplate[]>([])
  const currentEmailTemplate = ref<EmailTemplate | null>(null)
  const emailTemplatesTotal = ref(0)
  const emailTemplatesCurrentPage = ref(1)
  const emailTemplatesPageSize = ref(20)

  // Email Segments
  const emailSegments = ref<EmailSegment[]>([])
  const currentEmailSegment = ref<EmailSegment | null>(null)
  const emailSegmentsTotal = ref(0)
  const emailSegmentsCurrentPage = ref(1)
  const emailSegmentsPageSize = ref(20)

  // Getters
  const hasArticles = computed(() => articles.value.length > 0)
  const hasCategories = computed(() => categories.value.length > 0)
  const hasComments = computed(() => comments.value.length > 0)
  const hasNotifications = computed(() => notifications.value.length > 0)
  const hasEmailCampaigns = computed(() => emailCampaigns.value.length > 0)
  const hasEmailTemplates = computed(() => emailTemplates.value.length > 0)
  const hasEmailSegments = computed(() => emailSegments.value.length > 0)

  // Blog Article Actions
  async function fetchArticles(params: ArticleQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listBlogArticles({
        page: articlesCurrentPage.value,
        pageSize: articlesPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        articles.value = []
        articlesTotal.value = 0
        return
      }

      articles.value = data.data
      articlesTotal.value = data.total
      articlesCurrentPage.value = data.page
      articlesPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch articles'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchArticleById(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getBlogArticleById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Article not found')
      }

      currentArticle.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch article'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createArticle(
    payload: Omit<Article, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await createBlogArticle(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create article')
      }

      articles.value.unshift(data)
      articlesTotal.value += 1
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create article'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateArticle(
    id: string,
    payload: Partial<Omit<Article, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateBlogArticle(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update article')
      }

      const index = articles.value.findIndex((article) => article.id === id)
      if (index !== -1) {
        articles.value[index] = data
      }

      if (currentArticle.value?.id === id) {
        currentArticle.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update article'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteArticle(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteBlogArticle(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete article')
      }

      articles.value = articles.value.filter((article) => article.id !== id)
      articlesTotal.value -= 1

      if (currentArticle.value?.id === id) {
        currentArticle.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete article'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function publishArticle(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await publishBlogArticle(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to publish article')
      }

      // Update the article in the list
      const index = articles.value.findIndex((article) => article.id === id)
      if (index !== -1) {
        articles.value[index] = data
      }

      if (currentArticle.value?.id === id) {
        currentArticle.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to publish article'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function archiveArticle(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await archiveBlogArticle(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to archive article')
      }

      // Update the article in the list
      const index = articles.value.findIndex((article) => article.id === id)
      if (index !== -1) {
        articles.value[index] = data
      }

      if (currentArticle.value?.id === id) {
        currentArticle.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to archive article'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Blog Category Actions
  async function fetchCategories(params: CategoryQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listBlogCategories({
        page: categoriesCurrentPage.value,
        pageSize: categoriesPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        categories.value = []
        categoriesTotal.value = 0
        return
      }

      categories.value = data.data
      categoriesTotal.value = data.total
      categoriesCurrentPage.value = data.page
      categoriesPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch categories'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryById(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getBlogCategoryById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Category not found')
      }

      currentCategory.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch category'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createCategory(payload: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await createBlogCategory(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create category')
      }

      categories.value.unshift(data)
      categoriesTotal.value += 1
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create category'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(
    id: string,
    payload: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateBlogCategory(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update category')
      }

      const index = categories.value.findIndex((category) => category.id === id)
      if (index !== -1) {
        categories.value[index] = data
      }

      if (currentCategory.value?.id === id) {
        currentCategory.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update category'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteBlogCategory(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete category')
      }

      categories.value = categories.value.filter((category) => category.id !== id)
      categoriesTotal.value -= 1

      if (currentCategory.value?.id === id) {
        currentCategory.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete category'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Comments Actions
  async function fetchComments(params: CommentQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listComments({
        page: commentsCurrentPage.value,
        pageSize: commentsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        comments.value = []
        commentsTotal.value = 0
        return
      }

      comments.value = data.data
      commentsTotal.value = data.total
      commentsCurrentPage.value = data.page
      commentsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch comments'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCommentById(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getCommentById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Comment not found')
      }

      currentComment.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch comment'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCommentStatusAction(id: string, status: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateCommentStatus(id, status)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update comment status')
      }

      const index = comments.value.findIndex((comment) => comment.id === id)
      if (index !== -1) {
        comments.value[index] = data
      }

      if (currentComment.value?.id === id) {
        currentComment.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update comment status'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCommentAction(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteComment(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete comment')
      }

      comments.value = comments.value.filter((comment) => comment.id !== id)
      commentsTotal.value -= 1

      if (currentComment.value?.id === id) {
        currentComment.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete comment'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Notifications Actions
  async function fetchNotifications(params: NotificationQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listNotifications({
        page: notificationsCurrentPage.value,
        pageSize: notificationsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        notifications.value = []
        notificationsTotal.value = 0
        return
      }

      notifications.value = data.data
      notificationsTotal.value = data.total
      notificationsCurrentPage.value = data.page
      notificationsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch notifications'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchNotificationById(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getNotificationById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Notification not found')
      }

      currentNotification.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch notification'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createNotification(payload: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await createNotification(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create notification')
      }

      notifications.value.unshift(data)
      notificationsTotal.value += 1
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create notification'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateNotification(
    id: string,
    payload: Partial<Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateNotification(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update notification')
      }

      const index = notifications.value.findIndex((notification) => notification.id === id)
      if (index !== -1) {
        notifications.value[index] = data
      }

      if (currentNotification.value?.id === id) {
        currentNotification.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update notification'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteNotification(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteNotification(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete notification')
      }

      notifications.value = notifications.value.filter((notification) => notification.id !== id)
      notificationsTotal.value -= 1

      if (currentNotification.value?.id === id) {
        currentNotification.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete notification'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function publishNotification(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await publishNotification(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to publish notification')
      }

      // Update the notification in the list
      const index = notifications.value.findIndex((notification) => notification.id === id)
      if (index !== -1) {
        notifications.value[index] = data
      }

      if (currentNotification.value?.id === id) {
        currentNotification.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to publish notification'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Email Campaign Actions
  async function fetchEmailCampaigns(params: EmailCampaignQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listEmailCampaigns({
        page: emailCampaignsCurrentPage.value,
        pageSize: emailCampaignsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        emailCampaigns.value = []
        emailCampaignsTotal.value = 0
        return
      }

      emailCampaigns.value = data.data
      emailCampaignsTotal.value = data.total
      emailCampaignsCurrentPage.value = data.page
      emailCampaignsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch email campaigns'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchEmailCampaignById(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getEmailCampaignById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Email campaign not found')
      }

      currentEmailCampaign.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch email campaign'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createEmailCampaign(
    payload: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await createEmailCampaign(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create email campaign')
      }

      emailCampaigns.value.unshift(data)
      emailCampaignsTotal.value += 1
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create email campaign'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateEmailCampaign(
    id: string,
    payload: Partial<Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateEmailCampaign(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update email campaign')
      }

      const index = emailCampaigns.value.findIndex((campaign) => campaign.id === id)
      if (index !== -1) {
        emailCampaigns.value[index] = data
      }

      if (currentEmailCampaign.value?.id === id) {
        currentEmailCampaign.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update email campaign'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteEmailCampaign(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteEmailCampaign(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete email campaign')
      }

      emailCampaigns.value = emailCampaigns.value.filter((campaign) => campaign.id !== id)
      emailCampaignsTotal.value -= 1

      if (currentEmailCampaign.value?.id === id) {
        currentEmailCampaign.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete email campaign'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function sendEmailCampaign(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await sendEmailCampaign(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to send email campaign')
      }

      // Update the campaign in the list
      const index = emailCampaigns.value.findIndex((campaign) => campaign.id === id)
      if (index !== -1) {
        emailCampaigns.value[index] = data
      }

      if (currentEmailCampaign.value?.id === id) {
        currentEmailCampaign.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to send email campaign'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Email Template Actions
  async function fetchEmailTemplates(params: EmailTemplateQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listEmailTemplates({
        page: emailTemplatesCurrentPage.value,
        pageSize: emailTemplatesPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        emailTemplates.value = []
        emailTemplatesTotal.value = 0
        return
      }

      emailTemplates.value = data.data
      emailTemplatesTotal.value = data.total
      emailTemplatesCurrentPage.value = data.page
      emailTemplatesPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch email templates'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchEmailTemplateById(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getEmailTemplateById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Email template not found')
      }

      currentEmailTemplate.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch email template'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createEmailTemplate(
    payload: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await createEmailTemplate(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create email template')
      }

      emailTemplates.value.unshift(data)
      emailTemplatesTotal.value += 1
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create email template'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateEmailTemplate(
    id: string,
    payload: Partial<Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateEmailTemplate(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update email template')
      }

      const index = emailTemplates.value.findIndex((template) => template.id === id)
      if (index !== -1) {
        emailTemplates.value[index] = data
      }

      if (currentEmailTemplate.value?.id === id) {
        currentEmailTemplate.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update email template'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteEmailTemplate(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteEmailTemplate(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete email template')
      }

      emailTemplates.value = emailTemplates.value.filter((template) => template.id !== id)
      emailTemplatesTotal.value -= 1

      if (currentEmailTemplate.value?.id === id) {
        currentEmailTemplate.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete email template'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Email Segment Actions
  async function fetchEmailSegments(params: EmailSegmentQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listEmailSegments({
        page: emailSegmentsCurrentPage.value,
        pageSize: emailSegmentsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        emailSegments.value = []
        emailSegmentsTotal.value = 0
        return
      }

      emailSegments.value = data.data
      emailSegmentsTotal.value = data.total
      emailSegmentsCurrentPage.value = data.page
      emailSegmentsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch email segments'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchEmailSegmentById(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getEmailSegmentById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Email segment not found')
      }

      currentEmailSegment.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch email segment'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createEmailSegment(payload: Omit<EmailSegment, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await createEmailSegment(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create email segment')
      }

      emailSegments.value.unshift(data)
      emailSegmentsTotal.value += 1
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create email segment'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateEmailSegment(
    id: string,
    payload: Partial<Omit<EmailSegment, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateEmailSegment(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update email segment')
      }

      const index = emailSegments.value.findIndex((segment) => segment.id === id)
      if (index !== -1) {
        emailSegments.value[index] = data
      }

      if (currentEmailSegment.value?.id === id) {
        currentEmailSegment.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update email segment'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteEmailSegment(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteEmailSegment(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete email segment')
      }

      emailSegments.value = emailSegments.value.filter((segment) => segment.id !== id)
      emailSegmentsTotal.value -= 1

      if (currentEmailSegment.value?.id === id) {
        currentEmailSegment.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete email segment'
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    // Reset all state
    articles.value = []
    currentArticle.value = null
    articlesTotal.value = 0
    articlesCurrentPage.value = 1
    articlesPageSize.value = 20

    categories.value = []
    currentCategory.value = null
    categoriesTotal.value = 0
    categoriesCurrentPage.value = 1
    categoriesPageSize.value = 20

    comments.value = []
    currentComment.value = null
    commentsTotal.value = 0
    commentsCurrentPage.value = 1
    commentsPageSize.value = 20

    notifications.value = []
    currentNotification.value = null
    notificationsTotal.value = 0
    notificationsCurrentPage.value = 1
    notificationsPageSize.value = 20

    emailCampaigns.value = []
    currentEmailCampaign.value = null
    emailCampaignsTotal.value = 0
    emailCampaignsCurrentPage.value = 1
    emailCampaignsPageSize.value = 20

    emailTemplates.value = []
    currentEmailTemplate.value = null
    emailTemplatesTotal.value = 0
    emailTemplatesCurrentPage.value = 1
    emailTemplatesPageSize.value = 20

    emailSegments.value = []
    currentEmailSegment.value = null
    emailSegmentsTotal.value = 0
    emailSegmentsCurrentPage.value = 1
    emailSegmentsPageSize.value = 20
  }

  return {
    // State
    loading,
    error,
    // Articles
    articles,
    currentArticle,
    articlesTotal,
    articlesCurrentPage,
    articlesPageSize,
    // Categories
    categories,
    currentCategory,
    categoriesTotal,
    categoriesCurrentPage,
    categoriesPageSize,
    // Comments
    comments,
    currentComment,
    commentsTotal,
    commentsCurrentPage,
    commentsPageSize,
    // Notifications
    notifications,
    currentNotification,
    notificationsTotal,
    notificationsCurrentPage,
    notificationsPageSize,
    // Email Campaigns
    emailCampaigns,
    currentEmailCampaign,
    emailCampaignsTotal,
    emailCampaignsCurrentPage,
    emailCampaignsPageSize,
    // Email Templates
    emailTemplates,
    currentEmailTemplate,
    emailTemplatesTotal,
    emailTemplatesCurrentPage,
    emailTemplatesPageSize,
    // Email Segments
    emailSegments,
    currentEmailSegment,
    emailSegmentsTotal,
    emailSegmentsCurrentPage,
    emailSegmentsPageSize,
    // Getters
    hasArticles,
    hasCategories,
    hasComments,
    hasNotifications,
    hasEmailCampaigns,
    hasEmailTemplates,
    hasEmailSegments,
    // Actions
    // Articles
    fetchArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    archiveArticle,
    // Categories
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    // Comments
    fetchComments,
    fetchCommentById,
    updateCommentStatus: updateCommentStatusAction,
    deleteComment: deleteCommentAction,
    // Notifications
    fetchNotifications,
    fetchNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
    publishNotification,
    // Email Campaigns
    fetchEmailCampaigns,
    fetchEmailCampaignById,
    createEmailCampaign,
    updateEmailCampaign,
    deleteEmailCampaign,
    sendEmailCampaign,
    // Email Templates
    fetchEmailTemplates,
    fetchEmailTemplateById,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    // Email Segments
    fetchEmailSegments,
    fetchEmailSegmentById,
    createEmailSegment,
    updateEmailSegment,
    deleteEmailSegment,
    // Reset
    reset,
  }
})
