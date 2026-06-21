<template>
  <div class="flex min-h-screen flex-col bg-ink-900">
    <AppHeader :title="headerTitle" />

    <main class="flex-1">
      <LoadingSpinner v-if="loading" full-screen color="primary" />
      <div v-else-if="error" class="container mx-auto px-4 py-8">
        <ErrorMessage :message="error" />
      </div>

      <div v-else-if="currentItem">
        <!-- Admin actions -->
        <div v-if="isAdmin" class="container mx-auto flex justify-end gap-2 px-4 pt-4">
          <button @click="handleEdit" class="btn-secondary">Изменить</button>
          <button @click="handleToggleVisibility" class="btn-secondary">
            {{ currentItem.is_hidden ? 'Показать' : 'Скрыть' }}
          </button>
          <button @click="handleDelete" class="btn-danger">Удалить</button>
        </div>

        <ItemDetail :item="currentItem" />
      </div>
    </main>

    <!-- Edit Modal -->
    <div v-if="showEditForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <h2 class="mb-6 text-2xl font-bold">Редактировать объект</h2>
        <ItemForm
          :item="currentItem"
          :categories="categories"
          :submitting="formSubmitting"
          @submit="handleItemSubmit"
          @cancel="showEditForm = false"
        />
      </div>
    </div>

    <AppFooter />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ItemDetail from '@/components/items/ItemDetail.vue'
import ItemForm from '@/components/items/ItemForm.vue'
import { useItems } from '@/composables/useItems'
import { useCategories } from '@/composables/useCategories'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const { currentItem, loading, error, fetchItemBySlug, updateItem, deleteItem, toggleItemVisibility } = useItems()
const { categories, fetchCategories } = useCategories()
const { isAdmin } = useAuth()
const { showSuccess, showError, showConfirmDialog } = useNotification()

const showEditForm = ref(false)
const formSubmitting = ref(false)

const headerTitle = computed(() => currentItem.value?.name || 'Народная')

onMounted(async () => {
  await fetchItemBySlug(route.params.slug)
  await fetchCategories()
})

watch(() => route.params.slug, (slug) => {
  if (slug) fetchItemBySlug(slug)
})

const handleEdit = () => {
  showEditForm.value = true
}

const handleItemSubmit = async (itemData) => {
  formSubmitting.value = true
  const result = await updateItem(currentItem.value.id, itemData)
  if (result.success) {
    showSuccess('Объект успешно обновлён')
    showEditForm.value = false
    await fetchItemBySlug(route.params.slug)
  } else {
    showError(result.error || 'Не удалось обновить объект')
  }
  formSubmitting.value = false
}

const handleToggleVisibility = async () => {
  const newStatus = !currentItem.value.is_hidden
  const result = await toggleItemVisibility(currentItem.value.id, newStatus)
  if (result.success) {
    showSuccess(`Объект ${newStatus ? 'скрыт' : 'показан'}`)
    await fetchItemBySlug(currentItem.value.slug)
  } else {
    showError(result.error || 'Не удалось изменить видимость')
  }
}

const handleDelete = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Удалить объект',
    message: `Вы уверены, что хотите удалить «${currentItem.value.name}»? Это действие необратимо.`,
    confirmText: 'Удалить',
    cancelText: 'Отмена'
  })

  if (confirmed) {
    const result = await deleteItem(currentItem.value.id)
    if (result.success) {
      showSuccess('Объект удалён')
      router.push({ name: 'Home' })
    } else {
      showError(result.error || 'Не удалось удалить объект')
    }
  }
}
</script>
