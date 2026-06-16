<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    
    <main class="flex-1 container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'items'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'items'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Items
          </button>
          <button
            @click="activeTab = 'categories'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'categories'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Categories
          </button>
        </nav>
      </div>

      <!-- Items Tab -->
      <div v-if="activeTab === 'items'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Manage Items</h2>
          <button @click="showItemForm = true; editingItem = null" class="btn-primary">
            + New Item
          </button>
        </div>

        <!-- Item Form Modal -->
        <div v-if="showItemForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6">
              {{ editingItem ? 'Edit Item' : 'Create New Item' }}
            </h2>
            <ItemForm 
              :item="editingItem"
              :categories="categories"
              :submitting="formSubmitting"
              @submit="handleItemSubmit"
              @cancel="showItemForm = false; editingItem = null"
            />
          </div>
        </div>

        <!-- Items List -->
        <ItemList 
          :items="items" 
          :loading="itemsLoading" 
          :error="itemsError"
          :show-admin-actions="true"
          :pagination="listPagination"
          @edit="handleEditItem"
          @delete="handleDeleteItem"
          @toggle-visibility="handleToggleItemVisibility"
          @page-change="handlePageChange"
        />
      </div>

      <!-- Categories Tab -->
      <div v-if="activeTab === 'categories'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Manage Categories</h2>
          <button @click="showCategoryForm = true; editingCategory = null" class="btn-primary">
            + New Category
          </button>
        </div>

        <!-- Category Form Modal -->
        <div v-if="showCategoryForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6">
              {{ editingCategory ? 'Edit Category' : 'Create New Category' }}
            </h2>
            <CategoryForm 
              :category="editingCategory"
              :submitting="formSubmitting"
              @submit="handleCategorySubmit"
              @cancel="showCategoryForm = false; editingCategory = null"
            />
          </div>
        </div>

        <!-- Categories List -->
        <CategoryList 
          :categories="categories" 
          :loading="categoriesLoading" 
          :error="categoriesError" 
        />
      </div>
    </main>

    <AppFooter />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ItemList from '@/components/items/ItemList.vue'
import ItemForm from '@/components/items/ItemForm.vue'
import CategoryList from '@/components/categories/CategoryList.vue'
import CategoryForm from '@/components/categories/CategoryForm.vue'
import { useItems } from '@/composables/useItems'
import { useCategories } from '@/composables/useCategories'
import { useNotification } from '@/composables/useNotification'

const activeTab = ref('items')
const showItemForm = ref(false)
const showCategoryForm = ref(false)
const editingItem = ref(null)
const editingCategory = ref(null)
const formSubmitting = ref(false)

const { 
  items, 
  loading: itemsLoading, 
  error: itemsError, 
  pagination,
  fetchItems, 
  createItem, 
  updateItem, 
  deleteItem,
  toggleItemVisibility 
} = useItems()

const { 
  categories, 
  loading: categoriesLoading, 
  error: categoriesError, 
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = useCategories()

const { showSuccess, showError, showConfirmDialog } = useNotification()

// Adapt the backend's skip/limit/total pagination to the page-based shape ItemList expects.
const listPagination = computed(() => {
  const { skip = 0, limit = 100, total = 0 } = pagination.value || {}
  const safeLimit = limit || 100
  return {
    page: Math.floor(skip / safeLimit) + 1,
    totalPages: Math.max(1, Math.ceil(total / safeLimit))
  }
})

onMounted(async () => {
  await Promise.all([
    fetchItems(),
    fetchCategories()
  ])
})

// Item handlers
const handleItemSubmit = async (itemData) => {
  formSubmitting.value = true
  
  let result
  if (editingItem.value) {
    result = await updateItem(editingItem.value.id, itemData)
  } else {
    result = await createItem(itemData)
  }
  
  if (result.success) {
    showSuccess(`Item ${editingItem.value ? 'updated' : 'created'} successfully!`)
    showItemForm.value = false
    editingItem.value = null
    await fetchItems()
  } else {
    showError(result.error || `Failed to ${editingItem.value ? 'update' : 'create'} item`)
  }
  
  formSubmitting.value = false
}

const handleEditItem = (item) => {
  editingItem.value = item
  showItemForm.value = true
}

const handleDeleteItem = async (item) => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Item',
    message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    const result = await deleteItem(item.id)
    
    if (result.success) {
      showSuccess('Item deleted successfully')
      await fetchItems()
    } else {
      showError(result.error || 'Failed to delete item')
    }
  }
}

const handleToggleItemVisibility = async (item) => {
  const newStatus = !item.is_hidden
  const result = await toggleItemVisibility(item.id, newStatus)
  
  if (result.success) {
    showSuccess(`Item ${newStatus ? 'hidden' : 'shown'} successfully`)
    await fetchItems()
  } else {
    showError(result.error || 'Failed to update item visibility')
  }
}

const handlePageChange = async (page) => {
  const limit = pagination.value?.limit || 100
  await fetchItems({ skip: (page - 1) * limit, limit })
}

// Category handlers
const handleCategorySubmit = async (categoryData) => {
  formSubmitting.value = true
  
  let result
  if (editingCategory.value) {
    result = await updateCategory(editingCategory.value.id, categoryData)
  } else {
    result = await createCategory(categoryData)
  }
  
  if (result.success) {
    showSuccess(`Category ${editingCategory.value ? 'updated' : 'created'} successfully!`)
    showCategoryForm.value = false
    editingCategory.value = null
    await fetchCategories()
  } else {
    showError(result.error || `Failed to ${editingCategory.value ? 'update' : 'create'} category`)
  }
  
  formSubmitting.value = false
}
</script>
