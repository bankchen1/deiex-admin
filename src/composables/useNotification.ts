// Notification Composable
import { message, notification } from 'ant-design-vue'

export interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}

export interface MessageOptions {
  content: string
  duration?: number
}

export function useNotification() {
  /**
   * Show success message
   */
  function success(content: string, duration = 3) {
    message.success(content, duration)
  }

  /**
   * Show error message
   */
  function error(content: string, duration = 5) {
    message.error(content, duration)
  }

  /**
   * Show warning message
   */
  function warning(content: string, duration = 4) {
    message.warning(content, duration)
  }

  /**
   * Show info message
   */
  function info(content: string, duration = 3) {
    message.info(content, duration)
  }

  /**
   * Show loading message
   */
  function loading(content: string, duration = 0) {
    return message.loading(content, duration)
  }

  /**
   * Show success notification
   */
  function notifySuccess(options: NotificationOptions) {
    notification.success({
      message: options.title || 'Success',
      description: options.description,
      duration: options.duration || 4.5,
      placement: options.placement || 'topRight',
    })
  }

  /**
   * Show error notification
   */
  function notifyError(options: NotificationOptions) {
    notification.error({
      message: options.title || 'Error',
      description: options.description,
      duration: options.duration || 6,
      placement: options.placement || 'topRight',
    })
  }

  /**
   * Show warning notification
   */
  function notifyWarning(options: NotificationOptions) {
    notification.warning({
      message: options.title || 'Warning',
      description: options.description,
      duration: options.duration || 5,
      placement: options.placement || 'topRight',
    })
  }

  /**
   * Show info notification
   */
  function notifyInfo(options: NotificationOptions) {
    notification.info({
      message: options.title || 'Information',
      description: options.description,
      duration: options.duration || 4.5,
      placement: options.placement || 'topRight',
    })
  }

  /**
   * Destroy all messages
   */
  function destroyAll() {
    message.destroy()
    notification.destroy()
  }

  return {
    // Toast messages
    success,
    error,
    warning,
    info,
    loading,
    // Notifications
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    // Utility
    destroyAll,
  }
}
