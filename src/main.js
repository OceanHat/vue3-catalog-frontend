import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/main.css'

const app = createApp(App)

app.use(store)

// Restore the user session (load /auth/me when a token exists) BEFORE the
// router/guards run, so admin routes are not wrongly redirected on reload.
async function bootstrap() {
  try {
    await store.dispatch('auth/initializeAuth')
  } catch {
    // Ignore — guards will handle unauthenticated state.
  }
  app.use(router)
  await router.isReady()
  app.mount('#app')
}

bootstrap()
