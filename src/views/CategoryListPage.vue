<template>
  <div class="min-h-screen flex flex-col bg-ink-900">
    <AppHeader title="Категории" />
    
    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-display font-bold text-primary">Категории</h1>
        
        <button 
          v-if="isAdmin" 
          @click="showCreateForm = true"
          class="btn-primary"
        >
          + Новая категория
        </button>
      </div>

      <!-- Create Category Modal -->
      <div v-if="showCreateForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div class="bg-ink-800 border border-ink-600 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-display font-bold mb-6 text-primary">Новая категория</h2>
          <CategoryForm 
            :submitting="formSubmitting"
            @submit="handleCreateCategory"
            @cancel="showCreateForm = false"
          />
        </div>
      </div>

      <CategoryList 
        :categories="categories" 
        :loading="loading" 
        :error="error" 
      />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import CategoryList from '@/components/categories/CategoryList.vue'
import CategoryForm from '@/components/categories/CategoryForm.vue'
import { useCategories } from '@/composables/useCategories'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const { categories, loading, error, fetchCategories, createCategory } = useCategories()
const { isAdmin } = useAuth()
const { showSuccess, showError } = useNotification()

const showCreateForm = ref(false)
const formSubmitting = ref(false)

onMounted(async () => {
  await fetchCategories()
})

const handleCreateCategory = async (categoryData) => {
  formSubmitting.value = true
  
  const result = await createCategory(categoryData)
  
  if (result.success) {
    showSuccess('Категория успешно создана')
    showCreateForm.value = false
    await fetchCategories()
  } else {
    showError(result.error || 'Не удалось создать категорию')
  }
  
  formSubmitting.value = false
}
</script>
