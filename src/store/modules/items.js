import itemService from '@/services/itemService'

export default {
  namespaced: true,
  
  state: () => ({
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      perPage: 12,
      total: 0,
      totalPages: 0
    },
    filters: {
      category: null,
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  }),
  
  getters: {
    items: (state) => state.items,
    currentItem: (state) => state.currentItem,
    loading: (state) => state.loading,
    error: (state) => state.error,
    pagination: (state) => state.pagination,
    filters: (state) => state.filters,
    visibleItems: (state) => state.items.filter(item => !item.is_hidden)
  },
  
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    
    SET_CURRENT_ITEM(state, item) {
      state.currentItem = item
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    SET_ERROR(state, error) {
      state.error = error
    },
    
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination }
    },
    
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    
    ADD_ITEM(state, item) {
      state.items.unshift(item)
    },
    
    UPDATE_ITEM(state, updatedItem) {
      const index = state.items.findIndex(item => item.slug === updatedItem.slug)
      if (index !== -1) {
        state.items.splice(index, 1, updatedItem)
      }
      if (state.currentItem?.slug === updatedItem.slug) {
        state.currentItem = updatedItem
      }
    },
    
    DELETE_ITEM(state, slug) {
      state.items = state.items.filter(item => item.slug !== slug)
      if (state.currentItem?.slug === slug) {
        state.currentItem = null
      }
    }
  },
  
  actions: {
    async fetchItems({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const queryParams = {
          page: params.page || state.pagination.page,
          per_page: params.perPage || state.pagination.perPage,
          category: state.filters.category,
          search: state.filters.search,
          sort_by: state.filters.sortBy,
          sort_order: state.filters.sortOrder,
          ...params
        }
        
        const response = await itemService.getItems(queryParams)
        
        commit('SET_ITEMS', response.items || response.data || [])
        commit('SET_PAGINATION', {
          page: response.page || 1,
          perPage: response.per_page || 12,
          total: response.total || 0,
          totalPages: response.total_pages || 0
        })
        
        return response
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchItemBySlug({ commit }, slug) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const item = await itemService.getItemBySlug(slug)
        commit('SET_CURRENT_ITEM', item)
        return item
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createItem({ commit }, itemData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const item = await itemService.createItem(itemData)
        commit('ADD_ITEM', item)
        return item
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async updateItem({ commit }, { slug, itemData }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const item = await itemService.updateItem(slug, itemData)
        commit('UPDATE_ITEM', item)
        return item
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async deleteItem({ commit }, slug) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await itemService.deleteItem(slug)
        commit('DELETE_ITEM', slug)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async toggleItemVisibility({ commit }, { slug, isHidden }) {
      try {
        const item = await itemService.toggleItemVisibility(slug, isHidden)
        commit('UPDATE_ITEM', item)
        return item
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },
    
    setFilters({ commit, dispatch }, filters) {
      commit('SET_FILTERS', filters)
      dispatch('fetchItems', { page: 1 })
    }
  }
}
