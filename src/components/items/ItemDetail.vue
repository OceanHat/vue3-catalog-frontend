<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <!-- Image -->
      <div>
        <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
          <img 
            v-if="item.image_url" 
            :src="item.image_url" 
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex items-center justify-center h-96 bg-gradient-to-br from-gray-300 to-gray-400">
            <span class="text-6xl font-bold text-white">{{ item.name.charAt(0) }}</span>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div>
        <div class="flex items-start justify-between mb-4">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ item.name }}
          </h1>
          <span v-if="item.is_hidden" class="bg-red-500 text-white text-xs px-2 py-1 rounded">
            Hidden
          </span>
        </div>

        <p v-if="item.price" class="text-2xl font-bold text-primary mb-6">
          {{ formatCurrency(item.price) }}
        </p>

        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p class="text-gray-600">
            {{ item.description }}
          </p>
        </div>

        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Category</h2>
          <router-link 
            v-if="item.category" 
            :to="{ name: 'CategoryDetail', params: { slug: item.category.slug } }"
            class="text-primary hover:underline"
          >
            {{ item.category.name }}
          </router-link>
        </div>

        <div class="text-sm text-gray-500">
          <p>Created: {{ formatDate(item.created_at, 'long') }}</p>
          <p v-if="item.updated_at">Updated: {{ formatDate(item.updated_at, 'long') }}</p>
        </div>
      </div>
    </div>

    <!-- Additional Data Table -->
    <div v-if="hasAdditionalData" class="border-t border-gray-200 p-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Field
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(value, key) in item.additional_data" :key="key">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ key }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatValue(value) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatCurrency } from '@/utils/formatters'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const hasAdditionalData = computed(() => {
  return props.item.additional_data && 
         Object.keys(props.item.additional_data).length > 0
})

const formatValue = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return value
}
</script>
