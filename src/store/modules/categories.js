import categoryService from '@/services/categoryService'

export default {
  namespaced: true,

  state: () => ({
    categories: [],
    currentCategory: null,
    loading: false,
    error: null
  }),

  getters: {
    categories: (state) => state.categories,
    currentCategory: (state) => state.currentCategory,
    loading: (state) => state.loading,
    error: (state) => state.error,
    getCategoryBySlug: (state) => (slug) => state.categories.find((c) => c.slug === slug),
    getCategoryById: (state) => (id) => state.categories.find((c) => c.id === id)
  },

  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    },
    SET_CURRENT_CATEGORY(state, category) {
      state.currentCategory = category
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    ADD_CATEGORY(state, category) {
      state.categories.push(category)
    },
    UPDATE_CATEGORY(state, updated) {
      const index = state.categories.findIndex((c) => c.id === updated.id)
      if (index !== -1) state.categories.splice(index, 1, updated)
      if (state.currentCategory?.id === updated.id) state.currentCategory = updated
    },
    DELETE_CATEGORY(state, id) {
      state.categories = state.categories.filter((c) => c.id !== id)
      if (state.currentCategory?.id === id) state.currentCategory = null
    }
  },

  actions: {
    async fetchCategories({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await categoryService.getCategories()
        commit('SET_CATEGORIES', response.categories || [])
        return response
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchCategoryBySlug({ commit }, slug) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const category = await categoryService.getCategoryBySlug(slug)
        commit('SET_CURRENT_CATEGORY', category)
        return category
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createCategory({ commit }, categoryData) {
      const category = await categoryService.createCategory(categoryData)
      commit('ADD_CATEGORY', category)
      return category
    },

    async updateCategory({ commit }, { id, categoryData }) {
      const category = await categoryService.updateCategory(id, categoryData)
      commit('UPDATE_CATEGORY', category)
      return category
    },

    async deleteCategory({ commit }, id) {
      await categoryService.deleteCategory(id)
      commit('DELETE_CATEGORY', id)
    }
  }
}
