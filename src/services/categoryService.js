import api from './api'

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000'

/**
 * Build an absolute URL for a category image served by ugra-back at
 * GET /api/categories/{id}/image
 */
export function buildCategoryImageUrl(category) {
  if (!category || !category.id || !category.image_url) return null
  return `${API_ORIGIN}/api/categories/${category.id}/image`
}

/**
 * Normalize a raw CategoryResponse into the shape the UI expects.
 */
export function normalizeCategory(cat) {
  if (!cat) return cat
  return {
    ...cat,
    display_image_url: buildCategoryImageUrl(cat)
  }
}

/**
 * Category service mapped to ugra-back’s /api/categories endpoints.
 */
export default {
  async getCategories() {
    const res = await api.get('/categories/')
    return {
      ...res,
      categories: (res.categories || []).map(normalizeCategory)
    }
  },

  async getCategoryById(id) {
    return normalizeCategory(await api.get(`/categories/${id}`))
  },

  async getCategoryBySlug(slug) {
    return normalizeCategory(await api.get(`/categories/slug/${slug}`))
  },

  async createCategory(categoryData) {
    return normalizeCategory(await api.post('/categories/', categoryData))
  },

  async updateCategory(id, categoryData) {
    return normalizeCategory(await api.put(`/categories/${id}`, categoryData))
  },

  async deleteCategory(id) {
    return api.delete(`/categories/${id}`)
  },

  async uploadCategoryImage(id, file) {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/categories/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
