<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    
    <main class="flex-1 container mx-auto px-4 py-8">
      <LoadingSpinner v-if="categoryLoading" full-screen />
      <ErrorMessage v-else-if="categoryError" :message="categoryError" />
      
      <div v-else-if="currentCategory">
        <!-- Category Header -->
        <div class="mb-8">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 mb-2">
                {{ currentCategory.name }}
              </h1>
              <p class="text-gray-600">
                {{ currentCategory.description }}
              </p>
            </div>
            
            <div v-if="isAdmin" class="flex space-x-2">
              <button @click="handleEdit" class="btn-secondary">
                Edit
              </button>
              <button @click="handleDelete" class="btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Items in Category -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Items in this Category</h2>
          
          <LoadingSpinner v-if="itemsLoading" />
          <ErrorMessage v-else-if="itemsError" :message="itemsError" />
          
          <div v-else-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ItemCard 
              v-for="item in items" 
              :key="item.id" 
              :item="item"
              :show-admin-actions="isAdmin"
            />
          </div>
          
          <div v-else class="text-center py-12">
            <p class="text-gray-500 text-lg">No items in this category yet</p>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ItemCard from '@/components/items/ItemCard.vue'
import { useCategories } from '@/composables/useCategories'
import { useItems } from '@/composables/useItems'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const { currentCategory, loading: categoryLoading, error: categoryError, fetchCategoryBySlug, deleteCategory } = useCategories()
const { items, loading: itemsLoading, error: itemsError, setFilters } = useItems()
const { isAdmin } = useAuth()
const { showSuccess, showError, showConfirmDialog } = useNotification()

onMounted(async () => {
  const slug = route.params.slug
  await fetchCategoryBySlug(slug)
  
  // Fetch items in this category
  setFilters({ category: slug })
})

const handleEdit = () => {
  // Navigate to edit page or show modal
  showError('Edit functionality to be implemented')
}

const handleDelete = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Category',
    message: `Are you sure you want to delete "${currentCategory.value.name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    const result = await deleteCategory(currentCategory.value.slug)
    
    if (result.success) {
      showSuccess('Category deleted successfully')
      router.push({ name: 'CategoryList' })
    } else {
      showError(result.error || 'Failed to delete category')
    }
  }
}
</script>
