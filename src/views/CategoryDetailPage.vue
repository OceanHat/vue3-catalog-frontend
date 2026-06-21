<template>
  <div class="flex min-h-screen flex-col bg-ink-900">
    <AppHeader :title="headerTitle" />

    <main class="flex-1">
      <LoadingSpinner v-if="categoryLoading" full-screen color="primary" />
      <div v-else-if="categoryError" class="container mx-auto px-4 py-8">
        <ErrorMessage :message="categoryError" />
      </div>

      <div v-else-if="currentCategory" class="container mx-auto px-3 py-6 md:px-6 md:py-8">

        <!-- Admin controls row -->
        <div v-if="isAdmin" class="mb-4 flex items-start justify-between gap-4">
          <div v-if="isEditing" class="flex flex-1 flex-col gap-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-primary/50">Название</label>
              <input v-model="editData.name" type="text" class="w-full rounded-lg border border-primary/40 bg-ink-800 px-4 py-2 text-xl font-bold text-primary outline-none focus:border-primary" placeholder="Название категории" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-primary/50">Описание</label>
              <textarea v-model="editData.description" rows="3" class="w-full resize-y rounded-lg border border-primary/40 bg-ink-800 px-3 py-2 text-sm text-primary outline-none focus:border-primary" placeholder="Описание категории" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-primary/50">Фотография категории</label>
              <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-ink-800 px-4 py-3 text-sm text-primary/60 transition hover:border-primary/70 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span>{{ selectedFileName || 'Выбрать файм...' }}</span>
                <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
              </label>
              <div v-if="previewUrl" class="mt-2">
                <img :src="previewUrl" class="max-h-32 rounded-lg object-contain" alt="preview" />
              </div>
            </div>
          </div>

          <p v-else class="max-w-3xl text-primary/70">{{ currentCategory.description }}</p>

          <div class="flex shrink-0 flex-col gap-2">
            <template v-if="!isEditing">
              <button @click="startEdit" class="btn-secondary">Изменить</button>
              <button @click="handleDelete" class="btn-danger">Удалить</button>
            </template>
            <template v-else>
              <button @click="saveEdit" :disabled="formSubmitting" class="btn-primary">
                <LoadingSpinner v-if="formSubmitting" size="sm" color="white" class="mr-1 inline" />
                Сохранить
              </button>
              <button @click="cancelEdit" :disabled="formSubmitting" class="btn-secondary">Отмена</button>
            </template>
          </div>
        </div>

        <div v-else-if="currentCategory.description" class="mb-6">
          <p class="max-w-3xl text-primary/70">{{ currentCategory.description }}</p>
        </div>

        <LoadingSpinner v-if="itemsLoading" color="primary" />
        <ErrorMessage v-else-if="itemsError" :message="itemsError" />
        <div v-else-if="items.length > 0" class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          <ItemCard v-for="item in items" :key="item.id" :item="item" :show-admin-actions="isAdmin" />
        </div>
        <div v-else class="py-16 text-center">
          <p class="font-display text-lg text-primary/50">В этой категории пока нет объектов</p>
        </div>
      </div>
    </main>

    <AppFooter />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue'
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
import categoryService from '@/services/categoryService'

const route = useRoute()
const router = useRouter()
const { currentCategory, loading: categoryLoading, error: categoryError, fetchCategoryBySlug, updateCategory, deleteCategory } = useCategories()
const { items, loading: itemsLoading, error: itemsError, fetchItemsByCategory } = useItems()
const { isAdmin } = useAuth()
const { showSuccess, showError, showConfirmDialog } = useNotification()

const isEditing = ref(false)
const formSubmitting = ref(false)
const selectedImageFile = ref(null)
const previewUrl = ref(null)
const selectedFileName = ref('')
const editData = reactive({ name: '', description: '' })

const headerTitle = computed(() =>
  isEditing.value ? (editData.name || 'Редактирование') : (currentCategory.value?.name || 'Народная')
)

const load = async (slug) => {
  await fetchCategoryBySlug(slug)
  if (currentCategory.value?.id) await fetchItemsByCategory(currentCategory.value.id)
}

onMounted(() => load(route.params.slug))

// Refetch when slug in URL changes (after redirect)
watch(() => route.params.slug, (slug) => { if (slug) load(slug) })

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
  selectedFileName.value = file.name
  selectedImageFile.value = file
}

const startEdit = () => {
  editData.name = currentCategory.value.name || ''
  editData.description = currentCategory.value.description || ''
  selectedImageFile.value = null
  previewUrl.value = null
  selectedFileName.value = ''
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
  selectedImageFile.value = null
}

const saveEdit = async () => {
  formSubmitting.value = true
  try {
    // 1. Upload image if selected
    if (selectedImageFile.value) {
      const uploadResult = await categoryService.uploadCategoryImage(currentCategory.value.id, selectedImageFile.value)
      if (!uploadResult?.success) {
        showError('Не удалось загрузить изображение')
        formSubmitting.value = false
        return
      }
    }

    // 2. Update text fields — backend may auto-generate a new slug from the name
    const result = await updateCategory(currentCategory.value.id, {
      name: editData.name,
      description: editData.description
    })

    if (result.success) {
      showSuccess('Категория успешно обновлена')
      isEditing.value = false
      selectedImageFile.value = null
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null

      const newSlug = result.category?.slug
      if (newSlug && newSlug !== route.params.slug) {
        // Slug changed — navigate to new URL (watch will reload data)
        router.replace({ name: 'CategoryDetail', params: { slug: newSlug } })
      } else {
        await load(route.params.slug)
      }
    } else {
      showError(result.error || 'Не удалось обновить категорию')
    }
  } catch (e) {
    showError(e?.message || 'Ошибка при сохранении')
  } finally {
    formSubmitting.value = false
  }
}

const handleDelete = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Удалить категорию',
    message: `Вы уверены, что хотите удалить «${currentCategory.value.name}»? Это действие необратимо.`,
    confirmText: 'Удалить',
    cancelText: 'Отмена'
  })
  if (confirmed) {
    const result = await deleteCategory(currentCategory.value.id)
    if (result.success) {
      showSuccess('Категория удалена')
      router.push({ name: 'CategoryList' })
    } else {
      showError(result.error || 'Не удалось удалить категорию')
    }
  }
}
</script>
