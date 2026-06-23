<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />

    <!-- Admin list with actions -->
    <div v-else-if="showAdminActions && categories.length > 0" class="space-y-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="flex items-center justify-between gap-4 rounded-lg border border-primary/15 bg-primary/[0.04] p-4"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-display text-primary truncate">{{ category.name }}</h3>
            <span
              v-if="category.is_hidden"
              class="text-xs px-2 py-0.5 rounded bg-primary/15 text-primary/70"
            >
              Скрыто
            </span>
          </div>
          <p class="text-primary/50 text-sm truncate">{{ category.description }}</p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="$emit('edit', category)"
            class="px-3 py-1.5 text-sm rounded border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
          >
            Изменить
          </button>
          <button
            @click="$emit('toggle-visibility', category)"
            class="px-3 py-1.5 text-sm rounded border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
          >
            {{ category.is_hidden ? 'Показать' : 'Скрыть' }}
          </button>
          <button
            @click="$emit('delete', category)"
            class="px-3 py-1.5 text-sm rounded border border-red-400/40 text-red-300 hover:bg-red-500/10 transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Public grid -->
    <div
      v-else-if="categories.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
    >
      <CategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
      />
    </div>

    <div v-else class="text-center py-12">
      <p class="text-primary/50 font-display text-lg">Категории не найдены</p>
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
  },
  showAdminActions: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete', 'toggle-visibility'])
</script>
