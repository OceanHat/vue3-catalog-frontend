import store from '@/store'

export const authGuard = (to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const isAdmin = store.getters['auth/isAdmin']
  
  if (!isAuthenticated) {
    next({ 
      name: 'Login', 
      query: { redirect: to.fullPath } 
    })
    return
  }
  
  // Check admin requirement
  if (to.meta.requiresAdmin && !isAdmin) {
    // Redirect non-admin users
    next({ name: 'Home' })
    return
  }
  
  next()
}

export const guestGuard = (to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
}
