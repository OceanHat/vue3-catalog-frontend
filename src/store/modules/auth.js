import authService from '@/services/authService'
import router from '@/router'

export default {
  namespaced: true,

  state: () => ({
    user: null,
    token: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null
  }),

  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => state.isAuthenticated,
    // ugra-back roles: admin / editor / viewer. Admin & editor get management UI.
    isAdmin: (state) => state.user?.role === 'admin',
    isEditor: (state) => state.user?.role === 'admin' || state.user?.role === 'editor',
    loading: (state) => state.loading,
    error: (state) => state.error
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user || !!state.token
    },
    SET_TOKENS(state, { accessToken, refreshToken }) {
      state.token = accessToken
      state.isAuthenticated = !!accessToken
      if (accessToken) {
        localStorage.setItem('access_token', accessToken)
      } else {
        localStorage.removeItem('access_token')
      }
      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        } else {
          localStorage.removeItem('refresh_token')
        }
      }
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
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },

  actions: {
    async login({ commit, dispatch }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const tokens = await authService.login(credentials)
        commit('SET_TOKENS', {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token
        })
        await dispatch('fetchCurrentUser')
        return tokens
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async refreshToken({ commit, state }) {
      const refresh = state.refreshToken || localStorage.getItem('refresh_token')
      if (!refresh) {
        commit('CLEAR_AUTH')
        throw new Error('Нет refresh-токена')
      }
      try {
        const tokens = await authService.refreshToken(refresh)
        commit('SET_TOKENS', {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token
        })
        return tokens
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },

    async fetchCurrentUser({ commit }) {
      try {
        const user = await authService.getCurrentUser()
        commit('SET_USER', user)
        return user
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    logout({ commit }) {
      commit('CLEAR_AUTH')
      if (router.currentRoute.value.meta?.requiresAuth) {
        router.push({ name: 'Login' })
      }
    },

    // Restore session on app start: if a token exists, load the current user.
    async initializeAuth({ commit, dispatch, state }) {
      if (state.token) {
        try {
          await dispatch('fetchCurrentUser')
        } catch {
          commit('CLEAR_AUTH')
        }
      }
    }
  }
}
