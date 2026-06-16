import itemService from '@/services/itemService'

export default {
  namespaced: true,

  state: () => ({
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    pagination: {
      skip: 0,
      limit: 100,
      total: 0
    },
    filters: {
      categoryId: null
    }
  }),

  getters: {
    items: (state) => state.items,
    currentItem: (state) => state.currentItem,
    loading: (state) => state.loading,
    error: (state) => state.error,
    pagination: (state) => state.pagination,
    filters: (state) => state.filters,
    visibleItems: (state) => state.items.filter((i) => !i.is_hidden)
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
    UPDATE_ITEM(state, updated) {
      const index = state.items.findIndex((i) => i.id === updated.id)
      if (index !== -1) state.items.splice(index, 1, updated)
      if (state.currentItem?.id === updated.id) state.currentItem = updated
    },
    DELETE_ITEM(state, id) {
      state.items = state.items.filter((i) => i.id !== id)
      if (state.currentItem?.id === id) state.currentItem = null
    }
  },

  actions: {
    async fetchItems({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await itemService.getItems({
          skip: params.skip ?? state.pagination.skip,
          limit: params.limit ?? state.pagination.limit,
          categoryId: params.categoryId !== undefined ? params.categoryId : state.filters.categoryId
        })
        commit('SET_ITEMS', response.items || [])
        commit('SET_PAGINATION', {
          skip: response.skip ?? 0,
          limit: response.limit ?? state.pagination.limit,
          total: response.total ?? 0
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
      const item = await itemService.createItem(itemData)
      return item
    },

    async updateItem({ commit }, { id, itemData }) {
      const item = await itemService.updateItem(id, itemData)
      commit('UPDATE_ITEM', item)
      return item
    },

    async deleteItem({ commit }, id) {
      await itemService.deleteItem(id)
      commit('DELETE_ITEM', id)
    },

    async toggleItemVisibility({ commit }, { id, isHidden }) {
      const item = await itemService.setItemHidden(id, isHidden)
      commit('UPDATE_ITEM', item)
      return item
    },

    // Set the active category filter and reload items for that category.
    async setCategoryFilter({ commit, dispatch }, categoryId) {
      commit('SET_FILTERS', { categoryId })
      commit('SET_PAGINATION', { skip: 0 })
      return dispatch('fetchItems', { skip: 0, categoryId })
    }
  }
}
