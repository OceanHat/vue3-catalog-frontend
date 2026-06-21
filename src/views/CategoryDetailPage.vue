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
          <!-- Inline edit fields -->
          <div v-if="isEditing" class="flex flex-1 flex-col gap-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-primary/50">Название</label>
              <input
                v-model="editData.name"
                type="text"
                class="w-full rounded-lg border border-primary/40 bg-ink-800 px-4 py-2 text-xl font-bold text-primary outline-none focus:border-primary"
                placeholder="Название категории"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-primary/50">Описание</label>
              <textarea
                v-model="editData.description"
                rows="3"
                class="w-full resize-y rounded-lg border border-primary/40 bg-ink-800 px-3 py-2 text-sm text-primary outline-none focus:border-primary"
                placeholder="Описание категории"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-primary/50">Ссылка на изображение</label>
              <input
                v-model="editData.image_url"
                type="text"
                class="w-full rounded-lg border border-primary/40 bg-ink-800 px-3 py-2 text-sm text-primary outline-none focus:border-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <!-- View mode: show description text -->
          <p v-else class="max-w-3xl text-primary/70">{{ currentCategory.description }}</p>

          <!-- Buttons -->
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
              <button @click="cancelEdit" class="btn-secondary">Отмена</button>
            </template>
          </div>
        </div>

        <!-- Description for non-admin view -->
        <div v-else-if="currentCategory.description" class="mb-6">
          <p class="max-w-3xl text-primary/70">{{ currentCategory.description }}</p>
        </div>

        <!-- Items grid -->
        <LoadingSpinner v-if="itemsLoading" color="primary" />
        <ErrorMessage v-else-if="itemsError" :message="itemsError" />

        <div
          v-else-if="items.length > 0"
          class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4"
        >
          <ItemCard
            v-for="item in items"
            :key="item.id"
            :item="item"
            :show-admin-actions="isAdmin"
          />
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
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
const { currentCategory, loading: categoryLoading, error: categoryError, fetchCategoryBySlug, updateCategory, deleteCategory } = useCategories()
const { items, loading: itemsLoading, error: itemsError, fetchItemsByCategory } = useItems()
const { isAdmin } = useAuth()
const { showSuccess, showError, showConfirmDialog } = useNotification()

const isEditing = ref(false)
const formSubmitting = ref(false)
const editData = reactive({ name: '', description: '', image_url: '' })

const headerTitle = computed(() =>
  isEditing.value ? (editData.name || 'Редактирование') : (currentCategory.value?.name || 'Народная')
)

const load = async (slug) => {
  await fetchCategoryBySlug(slug)
  if (currentCategory.value?.id) {
    await fetchItemsByCategory(currentCategory.value.id)
  }
}

onMounted(() => load(route.params.slug))

watch(() => route.params.slug, (slug) => {
  if (slug) load(slug)
})

const startEdit = () => {
  editData.name = currentCategory.value.name || ''
  editData.description = currentCategory.value.description || ''
  editData.image_url = currentCategory.value.image_url || ''
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveEdit = async () => {
  formSubmitting.value = true
  const result = await updateCategory(currentCategory.value.id, {
    name: editData.name,
    description: editData.description,
    image_url: editData.image_url
  })
  if (result.success) {
    showSuccess('Категория успешно обновлена')
    isEditing.value = false
    await load(route.params.slug)
  } else {
    showError(result.error || 'Не удалось обновить категорию')
  }
  formSubmitting.value = false
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
