import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export function useAuth() {
  const store = useStore()
  const router = useRouter()

  const user = computed(() => store.getters['auth/currentUser'])
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const isAdmin = computed(() => store.getters['auth/isAdmin'])
  const loading = computed(() => store.getters['auth/loading'])
  const error = computed(() => store.getters['auth/error'])

  const login = async (credentials) => {
    try {
      await store.dispatch('auth/login', credentials)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    await store.dispatch('auth/logout')
    router.push({ name: 'Home' })
  }

  const isEditor = computed(() => store.getters['auth/isEditor'])

  return {
    user,
    isAuthenticated,
    isAdmin,
    isEditor,
    loading,
    error,
    login,
    logout
  }
}
