// Global Notification Service
import { message, notification } from 'ant-design-vue'

export interface NotificationConfig {
  showApiErrors?: boolean
  showApiSuccess?: boolean
  defaultDuration?: number
}

class NotificationService {
  private config: NotificationConfig = {
    showApiErrors: true,
    showApiSuccess: false,
    defaultDuration: 3,
  }

  /**
   * Configure notification service
   */
  configure(config: Partial<NotificationConfig>) {
    this.config = { ...this.config, ...config }
  }

  /**
   * Show success message
   */
  success(content: string, duration?: number) {
    message.success(content, duration ?? this.config.defaultDuration)
  }

  /**
   * Show error message
   */
  error(content: string, duration?: number) {
    message.error(content, duration ?? this.config.defaultDuration! + 2)
  }

  /**
   * Show warning message
   */
  warning(content: string, duration?: number) {
    message.warning(content, duration ?? this.config.defaultDuration! + 1)
  }

  /**
   * Show info message
   */
  info(content: string, duration?: number) {
    message.info(content, duration ?? this.config.defaultDuration)
  }

  /**
   * Show loading message
   */
  loading(content: string, duration = 0) {
    return message.loading(content, duration)
  }

  /**
   * Show success notification with title and description
   */
  notifySuccess(title: string, description?: string, duration?: number) {
    notification.success({
      message: title,
      description,
      duration: duration ?? this.config.defaultDuration! + 1.5,
      placement: 'topRight',
    })
  }

  /**
   * Show error notification with title and description
   */
  notifyError(title: string, description?: string, duration?: number) {
    notification.error({
      message: title,
      description,
      duration: duration ?? this.config.defaultDuration! + 3,
      placement: 'topRight',
    })
  }

  /**
   * Show warning notification with title and description
   */
  notifyWarning(title: string, description?: string, duration?: number) {
    notification.warning({
      message: title,
      description,
      duration: duration ?? this.config.defaultDuration! + 2,
      placement: 'topRight',
    })
  }

  /**
   * Show info notification with title and description
   */
  notifyInfo(title: string, description?: string, duration?: number) {
    notification.info({
      message: title,
      description,
      duration: duration ?? this.config.defaultDuration! + 1.5,
      placement: 'topRight',
    })
  }

  /**
   * Show API error notification (used by API client)
   */
  apiError(message: string, details?: string) {
    if (!this.config.showApiErrors) return

    if (details) {
      this.notifyError('Request Failed', `${message}\n${details}`)
    } else {
      this.error(message)
    }
  }

  /**
   * Show API success notification (used by API client)
   */
  apiSuccess(message: string) {
    if (!this.config.showApiSuccess) return
    this.success(message)
  }

  /**
   * Destroy all messages and notifications
   */
  destroyAll() {
    message.destroy()
    notification.destroy()
  }

  /**
   * Destroy all messages
   */
  destroyMessages() {
    message.destroy()
  }

  /**
   * Destroy all notifications
   */
  destroyNotifications() {
    notification.destroy()
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
export default notificationService
