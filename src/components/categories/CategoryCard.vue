<template>
  <router-link 
    :to="{ name: 'CategoryDetail', params: { slug: category.slug } }"
    class="catalog-tile group cursor-pointer p-0"
  >
    <div class="aspect-[4/3] bg-ink-700 overflow-hidden">
      <img 
        v-if="category.image_url" 
        :src="category.image_url" 
        :alt="category.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="flex items-center justify-center h-full bg-gradient-to-br from-ink-700 to-ink-800">
        <span class="text-4xl font-display text-primary/40">{{ category.name.charAt(0) }}</span>
      </div>
    </div>
    
    <div class="border-t-2 border-primary/70 p-4">
      <h3 class="text-xl font-display text-primary mb-1 group-hover:text-accent transition-colors">
        {{ category.name }}
      </h3>
      <p class="text-primary/60 text-sm">
        {{ truncateText(category.description, 120) }}
      </p>
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
