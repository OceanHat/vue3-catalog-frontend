<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-ink-900/80 backdrop-blur-sm"
        @click="close"
      />
    </Transition>

    <!-- Navigation panel: top overlay bar that drops down on any page -->
    <Transition name="nav-slide">
      <nav
        v-if="isOpen"
        class="fixed inset-x-0 top-0 z-50 bg-ink-800 border-b border-ink-600 shadow-glow"
        role="dialog"
        aria-modal="true"
        aria-label="Навигация"
      >
        <div class="mx-auto flex w-full items-center px-4 py-3 md:px-6 md:py-4">
          <!-- Pyramid logo -->
          <RouterLink to="/" class="shrink-0" @click="close" aria-label="Главная">
            <PyramidLogo class="h-9 w-9 md:h-10 md:w-10 text-primary" />
          </RouterLink>

          <!-- Desktop: horizontal links -->
          <ul class="ml-6 hidden flex-1 items-center justify-center gap-6 lg:gap-10 md:flex">
            <li v-for="link in navLinks" :key="link.key">
              <RouterLink
                :to="link.to"
                class="font-display text-lg tracking-wide text-primary/90 transition-colors hover:text-accent"
                active-class="text-accent"
                @click="close"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>

          <!-- spacer so X stays right on desktop -->
          <div class="flex-1 md:hidden" />

          <!-- Close button -->
          <button
            type="button"
            class="shrink-0 p-1 text-primary transition-colors hover:text-accent"
            aria-label="Закрыть меню"
            @click="close"
          >
            <svg class="h-8 w-8 md:h-9 md:w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <!-- Mobile: vertical centered links -->
        <ul class="flex flex-col items-center gap-5 pb-10 pt-2 md:hidden">
          <li v-for="link in navLinks" :key="'m-' + link.key">
            <RouterLink
              :to="link.to"
              class="font-display text-3xl tracking-wide text-primary/90 transition-colors hover:text-accent"
              active-class="text-accent"
              @click="close"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { RouterLink } from 'vue-router'
import PyramidLogo from '@/components/common/PyramidLogo.vue'
import { useCategories } from '@/composables/useCategories'

const store = useStore()
const { categories, fetchCategories } = useCategories()

const isOpen = computed(() => store.getters['ui/sidebarOpen'])

const close = () => store.commit('ui/SET_SIDEBAR', false)

// Fallback labels matching the design mockup, used until the server responds.
const FALLBACK = [
  { key: 'minerals', label: 'Минералы', slug: 'minerals' },
  { key: 'nature', label: 'Природа', slug: 'nature' },
  { key: 'history', label: 'История', slug: 'history' },
  { key: 'economy', label: 'Экономика', slug: 'economy' },
  { key: 'souvenirs', label: 'Сувениры', slug: 'souvenirs' },
  { key: 'tours', label: 'Туры', slug: 'tours' }
]

// Build nav links from server categories when available, otherwise fallback.
const navLinks = computed(() => {
  const list = categories.value && categories.value.length
    ? categories.value.map((c) => ({
        key: c.slug || c.id,
        label: c.name,
        to: { name: 'CategoryDetail', params: { slug: c.slug } }
      }))
    : FALLBACK.map((c) => ({
        key: c.key,
        label: c.label,
        to: { name: 'CategoryDetail', params: { slug: c.slug } }
      }))
  return list
})

// Fetch categories from the server once the menu is first opened.
let fetched = false
watch(isOpen, (open) => {
  if (open && !fetched) {
    fetched = true
    fetchCategories().catch(() => { /* fallback labels remain */ })
  }
})

// Lock body scroll while open, and close on Escape.
const onKey = (e) => {
  if (e.key === 'Escape') close()
}
watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>
