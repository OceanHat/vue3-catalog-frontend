<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    
    <main class="flex-1 container mx-auto px-4 py-8">
      <LoadingSpinner v-if="loading" full-screen />
      <ErrorMessage v-else-if="error" :message="error" />
      
      <div v-else-if="currentItem">
        <!-- Admin Actions -->
        <div v-if="isAdmin" class="mb-6 flex justify-end space-x-2">
          <button @click="handleEdit" class="btn-secondary">
            Edit Item
          </button>
          <button 
            @click="handleToggleVisibility" 
            class="btn-secondary"
          >
            {{ currentItem.is_hidden ? 'Show' : 'Hide' }} Item
          </button>
          <button @click="handleDelete" class="btn-danger">
            Delete Item
          </button>
        </div>

        <ItemDetail :item="currentItem" />
      </div>
    </main>

    <AppFooter />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ItemDetail from '@/components/items/ItemDetail.vue'
import { useItems } from '@/composables/useItems'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const { currentItem, loading, error, fetchItemBySlug, deleteItem, toggleItemVisibility } = useItems()
const { isAdmin } = useAuth()
const { showSuccess, showError, showConfirmDialog } = useNotification()

onMounted(async () => {
  const slug = route.params.slug
  await fetchItemBySlug(slug)
})

const handleEdit = () => {
  showError('Edit functionality to be implemented in admin dashboard')
}

const handleToggleVisibility = async () => {
  const newStatus = !currentItem.value.is_hidden
  const result = await toggleItemVisibility(currentItem.value.slug, newStatus)
  
  if (result.success) {
    showSuccess(`Item ${newStatus ? 'hidden' : 'shown'} successfully`)
    await fetchItemBySlug(currentItem.value.slug)
  } else {
    showError(result.error || 'Failed to update item visibility')
  }
}

const handleDelete = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Item',
    message: `Are you sure you want to delete "${currentItem.value.name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    const result = await deleteItem(currentItem.value.slug)
    
    if (result.success) {
      showSuccess('Item deleted successfully')
      router.push({ name: 'Home' })
    } else {
      showError(result.error || 'Failed to delete item')
    }
  }
}
</script>
