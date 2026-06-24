<template>
  <div class="flex min-h-screen flex-col bg-[#292623]">
    <AppHeader :title="headerTitle" />

    <main class="flex-1">
      <LoadingSpinner v-if="categoryLoading" full-screen color="primary" />
      <div v-else-if="categoryError" class="container mx-auto px-4 py-8">
        <ErrorMessage :message="categoryError" />
      </div>

      <div v-else-if="currentCategory" class="container mx-auto px-3 py-6 md:px-6 md:py-8">
        <!-- Optional description + admin controls -->
        <div v-if="currentCategory.description || isAdmin" class="mb-6 flex items-start justify-between gap-4">
          <p class="max-w-3xl text-primary/70">{{ currentCategory.description }}</p>
          <div v-if="isAdmin" class="flex shrink-0 gap-2">
            <RouterLink :to="{ name: 'AdminDashboard' }" class="btn-secondary">Управление</RouterLink>
          </div>
        </div>

        <!-- Items grid: 4 columns on desktop, like the "Народная" mockup -->
        <LoadingSpinner v-if="itemsLoading" color="primary" />
        <ErrorMessage v-else-if="itemsError" :message="itemsError" />

        <div
          v-else-if="items.length > 0"
          class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4"
        >
          <ItemCard
            v-for="item in items"
            :key="item.id"
            :item="item"
          />
        </div>

        <div v-else class="py-16 text-center">
          <p class="font-display text-lg text-primary/50">В этой категории пока нет объектов</p>
        </div>
      </div>
    </main>

    <AppFooter />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ItemCard from '@/components/items/ItemCard.vue'
import { useCategories } from '@/composables/useCategories'
import { useItems } from '@/composables/useItems'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { currentCategory, loading: categoryLoading, error: categoryError, fetchCategoryBySlug } = useCategories()
const { items, loading: itemsLoading, error: itemsError, fetchItemsByCategory } = useItems()
const { isAdmin } = useAuth()

const headerTitle = computed(() => currentCategory.value?.name || 'Народная')

const load = async (slug) => {
  await fetchCategoryBySlug(slug)
  if (currentCategory.value?.id) {
    await fetchItemsByCategory(currentCategory.value.id)
  }
}

onMounted(() => load(route.params.slug))

// Re-load when navigating between categories via the nav menu.
watch(() => route.params.slug, (slug) => {
  if (slug) load(slug)
})
</script>
