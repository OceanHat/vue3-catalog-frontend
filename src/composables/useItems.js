import { computed } from 'vue'
import { useStore } from 'vuex'

export function useItems() {
  const store = useStore()

  const items = computed(() => store.getters['items/items'])
  const currentItem = computed(() => store.getters['items/currentItem'])
  const loading = computed(() => store.getters['items/loading'])
  const error = computed(() => store.getters['items/error'])
  const pagination = computed(() => store.getters['items/pagination'])
  const filters = computed(() => store.getters['items/filters'])

  const fetchItems = async (params = {}) => {
    try {
      await store.dispatch('items/fetchItems', params)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const fetchItemBySlug = async (slug) => {
    try {
      await store.dispatch('items/fetchItemBySlug', slug)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Load every item belonging to a category (by numeric category_id).
  const fetchItemsByCategory = async (categoryId) => {
    try {
      await store.dispatch('items/setCategoryFilter', categoryId)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const createItem = async (itemData) => {
    try {
      const item = await store.dispatch('items/createItem', itemData)
      return { success: true, item }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateItem = async (id, itemData) => {
    try {
      const item = await store.dispatch('items/updateItem', { id, itemData })
      return { success: true, item }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteItem = async (id) => {
    try {
      await store.dispatch('items/deleteItem', id)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const toggleItemVisibility = async (id, isHidden) => {
    try {
      await store.dispatch('items/toggleItemVisibility', { id, isHidden })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    items,
    currentItem,
    loading,
    error,
    pagination,
    filters,
    fetchItems,
    fetchItemBySlug,
    fetchItemsByCategory,
    createItem,
    updateItem,
    deleteItem,
    toggleItemVisibility
  }
}
