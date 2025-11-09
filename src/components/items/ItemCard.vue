<template>
  <div class="card relative">
    <!-- Hidden Badge -->
    <div v-if="item.is_hidden" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
      Hidden
    </div>

    <router-link 
      :to="{ name: 'ItemDetail', params: { slug: item.slug } }" 
      class="block group"
    >
      <div class="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded-md overflow-hidden">
        <img 
          v-if="item.image_url" 
          :src="item.image_url" 
          :alt="item.name"
          class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="flex items-center justify-center h-48 bg-gradient-to-br from-gray-300 to-gray-400">
          <span class="text-4xl font-bold text-white">{{ item.name.charAt(0) }}</span>
        </div>
      </div>
      
      <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
        {{ item.name }}
      </h3>
      
      <p class="text-gray-600 text-sm mb-4">
        {{ truncateText(item.description, 100) }}
      </p>
      
      <div class="flex items-center justify-between">
        <span v-if="item.price" class="text-lg font-bold text-primary">
          {{ formatCurrency(item.price) }}
        </span>
        <span class="text-sm text-gray-500">
          {{ formatDate(item.created_at) }}
        </span>
      </div>
    </router-link>

    <!-- Admin Actions -->
    <div v-if="showAdminActions" class="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
      <button @click="$emit('edit', item)" class="btn-secondary text-sm">
        Edit
      </button>
      <button 
        @click="$emit('toggle-visibility', item)" 
        class="btn-secondary text-sm"
      >
        {{ item.is_hidden ? 'Show' : 'Hide' }}
      </button>
      <button @click="$emit('delete', item)" class="btn-danger text-sm">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { truncateText, formatDate, formatCurrency } from '@/utils/formatters'

defineProps({
  item: {
    type: Object,
    required: true
  },
  showAdminActions: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete', 'toggle-visibility'])
</script>
