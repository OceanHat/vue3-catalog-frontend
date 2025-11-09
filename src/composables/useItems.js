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

  const createItem = async (itemData) => {
    try {
      await store.dispatch('items/createItem', itemData)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateItem = async (slug, itemData) => {
    try {
      await store.dispatch('items/updateItem', { slug, itemData })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteItem = async (slug) => {
    try {
      await store.dispatch('items/deleteItem', slug)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const toggleItemVisibility = async (slug, isHidden) => {
    try {
      await store.dispatch('items/toggleItemVisibility', { slug, isHidden })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const setFilters = (newFilters) => {
    store.dispatch('items/setFilters', newFilters)
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
    createItem,
    updateItem,
    deleteItem,
    toggleItemVisibility,
    setFilters
  }
}
