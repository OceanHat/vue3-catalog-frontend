<template>
  <div class="min-h-screen flex flex-col bg-[#292623]">
    <AppHeader title="Панель администратора" />

    <main class="flex-1 container mx-auto px-4 py-8">
      <h1 class="text-3xl font-display font-bold text-primary mb-8">Панель администратора</h1>

      <!-- Tabs -->
      <div class="mb-6 border-b border-primary/20">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'items'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'items'
                ? 'border-primary text-primary'
                : 'border-transparent text-primary/50 hover:text-primary/80 hover:border-primary/30'
            ]"
          >
            Предметы
          </button>
          <button
            @click="activeTab = 'categories'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'categories'
                ? 'border-primary text-primary'
                : 'border-transparent text-primary/50 hover:text-primary/80 hover:border-primary/30'
            ]"
          >
            Категории
          </button>
        </nav>
      </div>

      <!-- Items Tab -->
      <div v-if="activeTab === 'items'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-display font-bold text-primary">Управление предметами</h2>
          <button @click="openItemForm()" class="btn-primary">
            + Новый предмет
          </button>
        </div>

        <!-- Item Form Modal -->
        <div v-if="showItemForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-[#322e2a] border border-primary/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-display font-bold text-primary mb-6">
              {{ editingItem ? 'Изменить предмет' : 'Создать предмет' }}
            </h2>
            <ItemForm
              :item="editingItem"
              :categories="categories"
              :submitting="formSubmitting"
              @submit="handleItemSubmit"
              @cancel="closeItemForm"
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
          <h2 class="text-2xl font-display font-bold text-primary">Управление категориями</h2>
          <button @click="openCategoryForm()" class="btn-primary">
            + Новая категория
          </button>
        </div>

        <!-- Category Form Modal -->
        <div v-if="showCategoryForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-[#322e2a] border border-primary/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-display font-bold text-primary mb-6">
              {{ editingCategory ? 'Изменить категорию' : 'Создать категорию' }}
            </h2>
            <CategoryForm
              :category="editingCategory"
              :submitting="formSubmitting"
              @submit="handleCategorySubmit"
              @cancel="closeCategoryForm"
            />
          </div>
        </div>

        <!-- Categories List -->
        <CategoryList
          :categories="categories"
          :loading="categoriesLoading"
          :error="categoriesError"
          :show-admin-actions="true"
          @edit="handleEditCategory"
          @delete="handleDeleteCategory"
          @toggle-visibility="handleToggleCategoryVisibility"
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
import itemService from '@/services/itemService'

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

// --- Item form open/close ---
const openItemForm = () => {
  editingItem.value = null
  showItemForm.value = true
}
const closeItemForm = () => {
  showItemForm.value = false
  editingItem.value = null
}

// Item handlers. ItemForm emits { data, imageFile }.
const handleItemSubmit = async ({ data, imageFile }) => {
  formSubmitting.value = true

  try {
    if (editingItem.value) {
      const result = await updateItem(editingItem.value.id, data)
      if (!result.success) {
        showError(result.error || 'Не удалось обновить предмет')
        return
      }
      // Upload replacement image if a new file was chosen.
      if (imageFile) {
        try {
          await itemService.uploadItemImage(editingItem.value.id, imageFile)
        } catch (e) {
          showError('Предмет обновлён, но не удалось загрузить изображение')
        }
      }
      showSuccess('Предмет успешно обновлён')
    } else {
      // ItemCreate requires picture_url; send a placeholder, then upload the real image.
      const result = await createItem({ ...data, picture_url: 'placeholder' })
      if (!result.success) {
        showError(result.error || 'Не удалось создать предмет')
        return
      }
      const newId = result.item && result.item.id
      if (imageFile && newId) {
        try {
          await itemService.uploadItemImage(newId, imageFile)
        } catch (e) {
          showError('Предмет создан, но не удалось загрузить изображение')
        }
      }
      showSuccess('Предмет успешно создан')
    }

    closeItemForm()
    await fetchItems()
  } finally {
    formSubmitting.value = false
  }
}

const handleEditItem = (item) => {
  editingItem.value = item
  showItemForm.value = true
}

const handleDeleteItem = async (item) => {
  const confirmed = await showConfirmDialog({
    title: 'Удалить предмет',
    message: `Вы уверены, что хотите удалить «${item.name}»? Это действие нельзя отменить.`,
    confirmText: 'Удалить',
    cancelText: 'Отмена'
  })

  if (confirmed) {
    const result = await deleteItem(item.id)
    if (result.success) {
      showSuccess('Предмет успешно удалён')
      await fetchItems()
    } else {
      showError(result.error || 'Не удалось удалить предмет')
    }
  }
}

const handleToggleItemVisibility = async (item) => {
  const newStatus = !item.is_hidden
  const result = await toggleItemVisibility(item.id, newStatus)

  if (result.success) {
    showSuccess(newStatus ? 'Предмет скрыт' : 'Предмет показан')
    await fetchItems()
  } else {
    showError(result.error || 'Не удалось изменить видимость предмета')
  }
}

const handlePageChange = async (page) => {
  const limit = pagination.value?.limit || 100
  await fetchItems({ skip: (page - 1) * limit, limit })
}

// --- Category form open/close ---
const openCategoryForm = () => {
  editingCategory.value = null
  showCategoryForm.value = true
}
const closeCategoryForm = () => {
  showCategoryForm.value = false
  editingCategory.value = null
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
    showSuccess(editingCategory.value ? 'Категория успешно обновлена' : 'Категория успешно создана')
    closeCategoryForm()
    await fetchCategories()
  } else {
    showError(result.error || 'Не удалось сохранить категорию')
  }

  formSubmitting.value = false
}

const handleEditCategory = (category) => {
  editingCategory.value = category
  showCategoryForm.value = true
}

const handleToggleCategoryVisibility = async (category) => {
  const newStatus = !category.is_hidden
  const result = await updateCategory(category.id, { is_hidden: newStatus })

  if (result.success) {
    showSuccess(newStatus ? 'Категория скрыта' : 'Категория показана')
    await fetchCategories()
  } else {
    showError(result.error || 'Не удалось изменить видимость категории')
  }
}

const handleDeleteCategory = async (category) => {
  const confirmed = await showConfirmDialog({
    title: 'Удалить категорию',
    message: `Вы уверены, что хотите удалить «${category.name}»? Это действие нельзя отменить.`,
    confirmText: 'Удалить',
    cancelText: 'Отмена'
  })

  if (confirmed) {
    const result = await deleteCategory(category.id)
    if (result.success) {
      showSuccess('Категория успешно удалена')
      await fetchCategories()
    } else {
      showError(result.error || 'Не удалось удалить категорию')
    }
  }
}
</script>
