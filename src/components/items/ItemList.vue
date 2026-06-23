<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    
    <div v-else-if="items.length > 0">
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <ItemCard 
          v-for="item in items" 
          :key="item.id" 
          :item="item"
          :show-admin-actions="showAdminActions"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @toggle-visibility="$emit('toggle-visibility', $event)"
        />
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex space-x-2">
          <button
            @click="$emit('page-change', pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4 py-2 border border-primary/30 text-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
          >
            Назад
          </button>
          
          <span class="px-4 py-2 border border-primary/30 rounded-md bg-primary/[0.06] text-primary">
            Страница {{ pagination.page }} из {{ pagination.totalPages }}
          </span>
          
          <button
            @click="$emit('page-change', pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-4 py-2 border border-primary/30 text-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
          >
            Вперёд
          </button>
        </nav>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-primary/50 text-lg">Предметы не найдены</p>
    </div>
  </div>
</template>

<script setup>
import ItemCard from './ItemCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

defineProps({
  items: {
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
  },
  showAdminActions: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      totalPages: 1
    })
  }
})

defineEmits(['edit', 'delete', 'toggle-visibility', 'page-change'])
</script>
