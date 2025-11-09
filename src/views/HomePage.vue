<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    
    <main class="flex-1 container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <section class="text-center py-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Vue Catalog
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Explore our comprehensive catalog of items and categories
        </p>
        <router-link to="/categories" class="btn-primary">
          Browse Categories
        </router-link>
      </section>

      <!-- Featured Categories -->
      <section class="py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Featured Categories</h2>
        
        <LoadingSpinner v-if="loading" />
        <ErrorMessage v-else-if="error" :message="error" />
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  await fetchCategories({ limit: 6 })
})
</script>
