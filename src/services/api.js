import axios from 'axios'
import store from '@/store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt token refresh
        await store.dispatch('auth/refreshToken')
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout
        await store.dispatch('auth/logout')
        return Promise.reject(refreshError)
      }
    }

    // Extract error message
    const message = 
      error.response?.data?.detail || 
      error.response?.data?.message || 
      error.message || 
      'An error occurred'

    return Promise.reject(new Error(message))
  }
)

export default api
