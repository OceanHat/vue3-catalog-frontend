import { useStore } from 'vuex'
import { NOTIFICATION_TYPES } from '@/utils/constants'

export function useNotification() {
  const store = useStore()

  const showNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 3000) => {
    store.dispatch('ui/showNotification', {
      message,
      type,
      duration
    })
  }

  const showSuccess = (message, duration) => {
    showNotification(message, NOTIFICATION_TYPES.SUCCESS, duration)
  }

  const showError = (message, duration) => {
    showNotification(message, NOTIFICATION_TYPES.ERROR, duration)
  }

  const showWarning = (message, duration) => {
    showNotification(message, NOTIFICATION_TYPES.WARNING, duration)
  }

  const showInfo = (message, duration) => {
    showNotification(message, NOTIFICATION_TYPES.INFO, duration)
  }

  const showConfirmDialog = async (config) => {
    return await store.dispatch('ui/showConfirmDialog', config)
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmDialog
  }
}
