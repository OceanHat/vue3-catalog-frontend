import api from './api'

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000'

/**
 * Build an absolute URL for an item's image, served by ugra-back at
 * GET /api/items/{id}/image?size=full|thumbnail
 */
export function buildItemImageUrl(item, size = 'full') {
  if (!item || !item.id || !item.picture_url) return null
  return `${API_ORIGIN}/api/items/${item.id}/image?size=${size}`
}

/**
 * Normalize a raw ItemResponse from the backend into the shape the UI expects.
 * The backend exposes `picture_url` (storage key) and serves bytes via an
 * endpoint; the frontend components read `image_url` / `thumbnail_url`.
 */
export function normalizeItem(item) {
  if (!item) return item
  return {
    ...item,
    image_url: buildItemImageUrl(item, 'full'),
    thumbnail_url: buildItemImageUrl(item, 'thumbnail'),
    // additional_data already comes back as an object from the API
    additional_data: item.additional_data || null
  }
}

/**
 * Item service mapped to ugra-back's /api/items endpoints.
 * - GET    /items/?skip=&limit=&category_id=  -> { items, total, skip, limit }
 * - GET    /items/{id}                        -> ItemResponse
 * - GET    /items/slug/{slug}                 -> ItemResponse
 * - POST   /items/                            (admin/editor)
 * - PUT    /items/{id}                        (admin/editor)
 * - DELETE /items/{id}                        (admin)
 * - POST   /items/{id}/image                  (multipart upload)
 */
export default {
  async getItems({ skip = 0, limit = 100, categoryId = null } = {}) {
    const params = { skip, limit }
    if (categoryId != null) params.category_id = categoryId
    const response = await api.get('/items/', { params })
    return {
      ...response,
      items: (response.items || []).map(normalizeItem)
    }
  },

  async getItemById(id) {
    return normalizeItem(await api.get(`/items/${id}`))
  },

  async getItemBySlug(slug) {
    return normalizeItem(await api.get(`/items/slug/${slug}`))
  },

  async createItem(itemData) {
    return normalizeItem(await api.post('/items/', itemData))
  },

  async updateItem(id, itemData) {
    return normalizeItem(await api.put(`/items/${id}`, itemData))
  },

  async deleteItem(id) {
    return api.delete(`/items/${id}`)
  },

  // Toggle visibility is just a partial update on the item.
  async setItemHidden(id, isHidden) {
    return normalizeItem(await api.put(`/items/${id}`, { is_hidden: isHidden }))
  },

  async uploadItemImage(id, file) {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/items/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
