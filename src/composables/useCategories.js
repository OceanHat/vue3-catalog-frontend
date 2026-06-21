import { computed } from 'vue'
import { useStore } from 'vuex'

export function useCategories() {
  const store = useStore()

  const categories = computed(() => store.getters['categories/categories'])
  const currentCategory = computed(() => store.getters['categories/currentCategory'])
  const loading = computed(() => store.getters['categories/loading'])
  const error = computed(() => store.getters['categories/error'])

  const fetchCategories = async (params = {}) => {
    try {
      await store.dispatch('categories/fetchCategories', params)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const fetchCategoryBySlug = async (slug) => {
    try {
      await store.dispatch('categories/fetchCategoryBySlug', slug)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const createCategory = async (categoryData) => {
    try {
      const category = await store.dispatch('categories/createCategory', categoryData)
      return { success: true, category }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      const category = await store.dispatch('categories/updateCategory', { id, categoryData })
      return { success: true, category }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteCategory = async (id) => {
    try {
      await store.dispatch('categories/deleteCategory', id)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    categories,
    currentCategory,
    loading,
    error,
    fetchCategories,
    fetchCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
