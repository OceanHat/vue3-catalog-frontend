// Plugin to persist auth state to localStorage
export default (store) => {
  // Initialize auth from localStorage on store creation
  store.dispatch('auth/initializeAuth')
  
  // Subscribe to mutations
  store.subscribe((mutation, state) => {
    // Persist auth state
    if (mutation.type.startsWith('auth/')) {
      if (state.auth.token) {
        localStorage.setItem('token', state.auth.token)
      } else {
        localStorage.removeItem('token')
      }
      
      if (state.auth.user) {
        localStorage.setItem('user', JSON.stringify(state.auth.user))
      } else {
        localStorage.removeItem('user')
      }
    }
  })
}
