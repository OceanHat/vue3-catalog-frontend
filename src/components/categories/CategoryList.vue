<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    
    <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard 
        v-for="category in categories" 
        :key="category.id" 
        :category="category" 
      />
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">No categories found</p>
    </div>
  </div>
</template>

<script setup>
import CategoryCard from './CategoryCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

defineProps({
  categories: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})
</script>
