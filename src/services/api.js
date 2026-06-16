import axios from 'axios'
import store from '@/store'

// ugra-back mounts all routers under the /api prefix.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach the JWT access token to every request.
api.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token || localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Unwrap successful responses and normalise ugra-back's error envelope.
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // On 401, try to refresh the access token once, then retry the request.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await store.dispatch('auth/refreshToken')
        const token = store.state.auth.token || localStorage.getItem('access_token')
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        await store.dispatch('auth/logout')
        return Promise.reject(refreshError)
      }
    }

    // ugra-back returns errors as { error: { message, status_code, details? } }.
    const data = error.response?.data
    const message =
      data?.error?.message ||
      data?.detail ||
      data?.message ||
      error.message ||
      'Произошла ошибка при обращении к серверу'

    return Promise.reject(new Error(message))
  }
)

export default api
