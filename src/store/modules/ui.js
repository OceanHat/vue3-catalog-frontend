export default {
  namespaced: true,
  
  state: () => ({
    notifications: [],
    sidebarOpen: false,
    confirmDialog: {
      show: false,
      title: '',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm: null
    }
  }),
  
  getters: {
    notifications: (state) => state.notifications,
    sidebarOpen: (state) => state.sidebarOpen,
    confirmDialog: (state) => state.confirmDialog
  },
  
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      const id = Date.now()
      state.notifications.push({
        id,
        type: notification.type || 'info',
        message: notification.message,
        duration: notification.duration || 3000
      })
    },
    
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    },
    
    TOGGLE_SIDEBAR(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    SET_SIDEBAR(state, isOpen) {
      state.sidebarOpen = isOpen
    },
    
    SHOW_CONFIRM_DIALOG(state, config) {
      state.confirmDialog = {
        show: true,
        title: config.title || 'Confirm Action',
        message: config.message,
        confirmText: config.confirmText || 'Confirm',
        cancelText: config.cancelText || 'Cancel',
        onConfirm: config.onConfirm
      }
    },
    
    HIDE_CONFIRM_DIALOG(state) {
      state.confirmDialog.show = false
    }
  },
  
  actions: {
    showNotification({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification)
      
      // Auto-remove after duration
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', notification.id)
      }, notification.duration || 3000)
    },
    
    removeNotification({ commit }, id) {
      commit('REMOVE_NOTIFICATION', id)
    },
    
    showConfirmDialog({ commit }, config) {
      return new Promise((resolve) => {
        commit('SHOW_CONFIRM_DIALOG', {
          ...config,
          onConfirm: () => {
            resolve(true)
            commit('HIDE_CONFIRM_DIALOG')
          }
        })
      })
    },
    
    hideConfirmDialog({ commit }) {
      commit('HIDE_CONFIRM_DIALOG')
    }
  }
}
