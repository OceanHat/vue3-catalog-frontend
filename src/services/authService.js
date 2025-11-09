import api from './api'

export default {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData)
    return response
  }
}
