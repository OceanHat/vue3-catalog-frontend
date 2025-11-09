<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
    
    <div class="space-y-4">
      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          id="search"
          v-model="localFilters.search"
          type="text"
          placeholder="Search items..."
          class="input-field"
          @input="debouncedUpdate"
        />
      </div>

      <!-- Sort By -->
      <div>
        <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sortBy"
          v-model="localFilters.sortBy"
          class="input-field"
          @change="handleUpdate"
        >
          <option value="created_at">Date Created</option>
          <option value="updated_at">Date Updated</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      <!-- Sort Order -->
      <div>
        <label for="sortOrder" class="block text-sm font-medium text-gray-700 mb-1">
          Order
        </label>
        <select
          id="sortOrder"
          v-model="localFilters.sortOrder"
          class="input-field"
          @change="handleUpdate"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <!-- Reset Button -->
      <button @click="handleReset" class="w-full btn-secondary">
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const localFilters = reactive({ ...props.filters })

let debounceTimeout = null

const debouncedUpdate = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    handleUpdate()
  }, 500)
}

const handleUpdate = () => {
  emit('update', { ...localFilters })
}

const handleReset = () => {
  localFilters.search = ''
  localFilters.sortBy = 'created_at'
  localFilters.sortOrder = 'desc'
  handleUpdate()
}

watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })
</script>
