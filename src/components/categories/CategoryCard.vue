<template>
  <router-link 
    :to="{ name: 'CategoryDetail', params: { slug: category.slug } }"
    class="card group cursor-pointer"
  >
    <div class="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded-md overflow-hidden">
      <img 
        v-if="category.image_url" 
        :src="category.image_url" 
        :alt="category.name"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="flex items-center justify-center h-48 bg-gradient-to-br from-primary to-blue-400">
        <span class="text-4xl font-bold text-white">{{ category.name.charAt(0) }}</span>
      </div>
    </div>
    
    <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
      {{ category.name }}
    </h3>
    
    <p class="text-gray-600 text-sm mb-4">
      {{ truncateText(category.description, 120) }}
    </p>
    
    <div class="flex items-center justify-between text-sm text-gray-500">
      <span>{{ category.item_count || 0 }} items</span>
      <span class="text-primary font-medium">View →</span>
    </div>
  </router-link>
</template>

<script setup>
import { truncateText } from '@/utils/formatters'

defineProps({
  category: {
    type: Object,
    required: true
  }
})
</script>
