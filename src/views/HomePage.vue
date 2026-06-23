<template>
  <div class="min-h-screen flex flex-col bg-[#292623]">
    <AppHeader title="Народная" :show-back="false" />
    
    <main class="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Hero Section -->
      <section class="text-center py-8 sm:py-12">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
          Народная
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-primary/70 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Каталог минералов, природы, истории и культуры
        </p>
        <router-link to="/categories" class="btn-primary">
          Смотреть категории
        </router-link>
      </section>

      <!-- Featured Categories -->
      <section class="py-8 sm:py-12">
        <h2 class="text-2xl sm:text-3xl font-display font-bold text-primary mb-6 sm:mb-8">Категории</h2>
        
        <LoadingSpinner v-if="loading" />
        <ErrorMessage v-else-if="error" :message="error" />
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <CategoryCard 
            v-for="category in categories" 
            :key="category.id" 
            :category="category" 
          />
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import CategoryCard from '@/components/categories/CategoryCard.vue'
import { useCategories } from '@/composables/useCategories'

const { categories, loading, error, fetchCategories } = useCategories()

onMounted(async () => {
  await fetchCategories({ limit: 100 })
})
</script>
