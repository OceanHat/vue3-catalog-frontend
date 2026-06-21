<template>
  <div class="flex min-h-screen flex-col bg-ink-900">
    <AppHeader :title="headerTitle" />

    <main class="flex-1">
      <LoadingSpinner v-if="categoryLoading" full-screen color="primary" />
      <div v-else-if="categoryError" class="container mx-auto px-4 py-8">
        <ErrorMessage :message="categoryError" />
      </div>

      <div v-else-if="currentCategory" class="container mx-auto px-3 py-6 md:px-6 md:py-8">
        <!-- Optional description + admin controls -->
        <div v-if="currentCategory.description || isAdmin" class="mb-6 flex items-start justify-between gap-4">
          <p class="max-w-3xl text-primary/70">{{ currentCategory.description }}</p>
          <div v-if="isAdmin" class="flex shrink-0 gap-2">
            <button @click="handleEdit" class="btn-secondary">Изменить</button>
            <button @click="handleDelete" class="btn-danger">Удалить</button>
          </div>
        </div>

        <!-- Items grid: 4 columns on desktop, like the "Народная" mockup -->
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

    <!-- Edit Modal -->
    <div v-if="showEditForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <h2 class="mb-6 text-2xl font-bold">Редактировать категорию</h2>
        <CategoryForm
          :category="currentCategory"
          :submitting="formSubmitting"
          @submit="handleCategorySubmit"
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
import ItemCard from '@/components/items/ItemCard.vue'
import CategoryForm from '@/components/categories/CategoryForm.vue'
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

const showEditForm = ref(false)
const formSubmitting = ref(false)

const headerTitle = computed(() => currentCategory.value?.name || 'Народная')

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

const handleEdit = () => {
  showEditForm.value = true
}

const handleCategorySubmit = async (categoryData) => {
  formSubmitting.value = true
  const result = await updateCategory(currentCategory.value.id, categoryData)
  if (result.success) {
    showSuccess('Категория успешно обновлена')
    showEditForm.value = false
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
