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
          <template v-if="!isEditing">
            <button @click="startEdit" class="btn-secondary">Изменить</button>
            <button @click="handleToggleVisibility" class="btn-secondary">
              {{ currentItem.is_hidden ? 'Показать' : 'Скрыть' }}
            </button>
            <button @click="handleDelete" class="btn-danger">Удалить</button>
          </template>
          <template v-else>
            <button @click="saveEdit" :disabled="formSubmitting" class="btn-primary">
              <LoadingSpinner v-if="formSubmitting" size="sm" color="white" class="mr-1 inline" />
              Сохранить
            </button>
            <button @click="cancelEdit" class="btn-secondary">Отмена</button>
          </template>
        </div>

        <ItemDetail
          :item="currentItem"
          :is-editing="isEditing"
          :edit-data="editData"
          @update:edit-data="editData = $event"
        />
      </div>
    </main>

    <AppFooter />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ItemDetail from '@/components/items/ItemDetail.vue'
import { useItems } from '@/composables/useItems'
import { useCategories } from '@/composables/useItems'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const { currentItem, loading, error, fetchItemBySlug, updateItem, deleteItem, toggleItemVisibility } = useItems()
const { isAdmin } = useAuth()
const { showSuccess, showError, showConfirmDialog } = useNotification()

const isEditing = ref(false)
const formSubmitting = ref(false)
const editData = reactive({
  name: '',
  description: '',
  picture_url: '',
  additional_data: {}
})

const headerTitle = computed(() =>
  isEditing.value ? (editData.name || 'Редактирование') : (currentItem.value?.name || 'Народная')
)

onMounted(() => fetchItemBySlug(route.params.slug))

watch(() => route.params.slug, (slug) => {
  if (slug) fetchItemBySlug(slug)
})

const startEdit = () => {
  editData.name = currentItem.value.name || ''
  editData.description = currentItem.value.description || ''
  editData.picture_url = currentItem.value.picture_url || ''
  editData.additional_data = currentItem.value.additional_data
    ? JSON.parse(JSON.stringify(currentItem.value.additional_data))
    : {}
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveEdit = async () => {
  formSubmitting.value = true
  const result = await updateItem(currentItem.value.id, {
    name: editData.name,
    description: editData.description,
    picture_url: editData.picture_url,
    category_id: currentItem.value.category_id,
    additional_data: editData.additional_data
  })
  if (result.success) {
    showSuccess('Объект успешно обновлён')
    isEditing.value = false
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
