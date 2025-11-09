import api from './api'

export default {
  async getCategories(params = {}) {
    const response = await api.get('/categories', { params })
    return response
  },

  async getCategoryBySlug(slug) {
    const response = await api.get(`/categories/${slug}`)
    return response
  },

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData)
    return response
  },

  async updateCategory(slug, categoryData) {
    const response = await api.put(`/categories/${slug}`, categoryData)
    return response
  },

  async deleteCategory(slug) {
    const response = await api.delete(`/categories/${slug}`)
    return response
  }
}
