import authService from '@/services/authService'
import router from '@/router'

export default {
  namespaced: true,
  
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  
  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => state.isAuthenticated,
    isAdmin: (state) => state.user?.role === 'admin',
    loading: (state) => state.loading,
    error: (state) => state.error
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    
    SET_TOKEN(state, token) {
      state.token = token
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    SET_ERROR(state, error) {
      state.error = error
    },
    
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await authService.login(credentials)
        commit('SET_TOKEN', response.token)
        commit('SET_USER', response.user)
        
        router.push({ name: 'Home' })
        return response
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await authService.register(userData)
        commit('SET_TOKEN', response.token)
        commit('SET_USER', response.user)
        
        router.push({ name: 'Home' })
        return response
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async logout({ commit }) {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        commit('CLEAR_AUTH')
        router.push({ name: 'Login' })
      }
    },
    
    async refreshToken({ commit, state }) {
      try {
        const response = await authService.refreshToken()
        commit('SET_TOKEN', response.token)
        return response
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    
    async fetchCurrentUser({ commit }) {
      commit('SET_LOADING', true)
      
      try {
        const user = await authService.getCurrentUser()
        commit('SET_USER', user)
        return user
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    initializeAuth({ commit }) {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        commit('SET_TOKEN', token)
        commit('SET_USER', JSON.parse(user))
      }
    }
  }
}
