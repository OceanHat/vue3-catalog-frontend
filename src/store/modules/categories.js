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
    getCategoryBySlug: (state) => (slug) => {
      return state.categories.find(cat => cat.slug === slug)
    }
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
    
    UPDATE_CATEGORY(state, updatedCategory) {
      const index = state.categories.findIndex(cat => cat.slug === updatedCategory.slug)
      if (index !== -1) {
        state.categories.splice(index, 1, updatedCategory)
      }
      if (state.currentCategory?.slug === updatedCategory.slug) {
        state.currentCategory = updatedCategory
      }
    },
    
    DELETE_CATEGORY(state, slug) {
      state.categories = state.categories.filter(cat => cat.slug !== slug)
      if (state.currentCategory?.slug === slug) {
        state.currentCategory = null
      }
    }
  },
  
  actions: {
    async fetchCategories({ commit }, params = {}) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await categoryService.getCategories(params)
        commit('SET_CATEGORIES', response.categories || response.data || [])
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
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const category = await categoryService.createCategory(categoryData)
        commit('ADD_CATEGORY', category)
        return category
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async updateCategory({ commit }, { slug, categoryData }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const category = await categoryService.updateCategory(slug, categoryData)
        commit('UPDATE_CATEGORY', category)
        return category
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async deleteCategory({ commit }, slug) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await categoryService.deleteCategory(slug)
        commit('DELETE_CATEGORY', slug)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}
