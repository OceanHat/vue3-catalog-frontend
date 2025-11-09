import { createStore } from 'vuex'
import auth from './modules/auth'
import items from './modules/items'
import categories from './modules/categories'
import ui from './modules/ui'
import persistence from './plugins/persistence'

export default createStore({
  modules: {
    auth,
    items,
    categories,
    ui
  },
  plugins: [persistence]
})
