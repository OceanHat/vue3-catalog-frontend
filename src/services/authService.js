import api from './api'

/**
 * Auth service mapped to ugra-back's /api/auth endpoints.
 * - POST /auth/login    { email, password } -> { access_token, refresh_token, token_type }
 * - POST /auth/refresh  { refresh_token }    -> { access_token, refresh_token, token_type }
 * - GET  /auth/me                            -> { id, email, full_name, role, is_active }
 */
export default {
  async login(credentials) {
    return api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    })
  },

  async refreshToken(refreshToken) {
    return api.post('/auth/refresh', { refresh_token: refreshToken })
  },

  async getCurrentUser() {
    return api.get('/auth/me')
  }
}
