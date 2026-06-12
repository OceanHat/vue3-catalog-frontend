<template>
  <header class="sticky top-0 z-30 bg-ink-800/95 backdrop-blur border-b border-ink-600">
    <div class="relative flex items-center px-3 py-3 md:px-5 md:py-4">
      <!-- Back arrow (left) -->
      <button
        v-if="showBack"
        type="button"
        class="z-10 shrink-0 p-1 text-primary transition-colors hover:text-accent"
        aria-label="Назад"
        @click="goBack"
      >
        <svg class="h-7 w-7 md:h-8 md:w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <RouterLink
        v-else
        to="/"
        class="z-10 shrink-0 p-1 text-primary transition-colors hover:text-accent"
        aria-label="Главная"
      >
        <PyramidLogo class="h-8 w-8 md:h-9 md:w-9" />
      </RouterLink>

      <!-- Centered title -->
      <h1
        class="pointer-events-none absolute inset-x-0 mx-auto px-14 text-center font-display text-xl tracking-wide text-primary truncate md:text-3xl"
      >
        {{ title }}
      </h1>

      <!-- Hamburger (right) -->
      <button
        type="button"
        class="z-10 ml-auto shrink-0 p-1 text-primary transition-colors hover:text-accent"
        aria-label="Открыть меню"
        @click="openMenu"
      >
        <svg class="h-7 w-7 md:h-8 md:w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter, RouterLink } from 'vue-router'
import PyramidLogo from '@/components/common/PyramidLogo.vue'

defineProps({
  title: {
    type: String,
    default: 'Народная'
  },
  showBack: {
    type: Boolean,
    default: true
  }
})

const store = useStore()
const router = useRouter()

const openMenu = () => store.commit('ui/SET_SIDEBAR', true)

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
