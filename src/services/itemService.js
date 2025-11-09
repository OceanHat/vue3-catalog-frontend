import api from './api'

export default {
  async getItems(params = {}) {
    const response = await api.get('/items', { params })
    return response
  },

  async getItemBySlug(slug) {
    const response = await api.get(`/items/${slug}`)
    return response
  },

  async createItem(itemData) {
    const response = await api.post('/items', itemData)
    return response
  },

  async updateItem(slug, itemData) {
    const response = await api.put(`/items/${slug}`, itemData)
    return response
  },

  async deleteItem(slug) {
    const response = await api.delete(`/items/${slug}`)
    return response
  },

  async toggleItemVisibility(slug, isHidden) {
    const response = await api.patch(`/items/${slug}/visibility`, { is_hidden: isHidden })
    return response
  },

  async getItemsByCategory(categorySlug, params = {}) {
    const response = await api.get(`/categories/${categorySlug}/items`, { params })
    return response
  }
}
