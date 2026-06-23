import api from './api'

/**
 * Category service mapped to ugra-back's /api/categories endpoints.
 * - GET    /categories/              -> { categories: [...], total }
 * - GET    /categories/{id}          -> CategoryResponse
 * - GET    /categories/slug/{slug}   -> CategoryResponse
 * - POST   /categories/              (admin/editor)
 * - PUT    /categories/{id}          (admin/editor)
 * - DELETE /categories/{id}          (admin)
 *
 * CategoryResponse: { id, name, slug, description, is_hidden, created_by_id, created_at, updated_at }
 */
export default {
  async getCategories() {
    return api.get('/categories/')
  },

  async getCategoryById(id) {
    return api.get(`/categories/${id}`)
  },

  async getCategoryBySlug(slug) {
    return api.get(`/categories/slug/${slug}`)
  },

  async createCategory(categoryData) {
    return api.post('/categories/', categoryData)
  },

  async updateCategory(id, categoryData) {
    return api.put(`/categories/${id}`, categoryData)
  },

  async deleteCategory(id) {
    return api.delete(`/categories/${id}`)
  }
}
