<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <ErrorMessage v-if="formError" :message="formError" :dismissible="true" @dismiss="formError = ''" />

    <!-- Название -->
    <div>
      <label for="name" class="block text-sm font-medium text-primary/80 mb-1">
        Название *
      </label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="input-field"
        :class="{ 'input-error': errors.name }"
        placeholder="Введите название категории"
      />
      <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
    </div>

    <!-- Slug (необязательно) -->
    <div>
      <label for="slug" class="block text-sm font-medium text-primary/80 mb-1">
        Slug (необязательно)
      </label>
      <input
        id="slug"
        v-model="formData.slug"
        type="text"
        class="input-field"
        placeholder="например: minerals"
      />
      <p class="text-xs text-primary/50 mt-1">Оставьте пустым для автогенерации.</p>
    </div>

    <!-- Описание -->
    <div>
      <label for="description" class="block text-sm font-medium text-primary/80 mb-1">
        Описание
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="4"
        class="input-field"
        placeholder="Введите описание категории"
      ></textarea>
    </div>

    <!-- Скрыть категорию -->
    <div class="flex items-center gap-2">
      <input
        id="cat_is_hidden"
        v-model="formData.is_hidden"
        type="checkbox"
        class="h-4 w-4 rounded border-primary/40 bg-transparent text-primary focus:ring-primary"
      />
      <label for="cat_is_hidden" class="text-sm font-medium text-primary/80">
        Скрыть категорию (не показывать посетителям)
      </label>
    </div>

    <!-- Кнопки -->
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn-secondary"
      >
        Отмена
      </button>
      <button
        type="submit"
        :disabled="submitting"
        class="btn-primary flex items-center"
      >
        <LoadingSpinner v-if="submitting" size="sm" color="white" class="mr-2" />
        <span>{{ isEdit ? 'Сохранить' : 'Создать' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { isRequired } from '@/utils/validators'

const props = defineProps({
  category: {
    type: Object,
    default: null
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = ref(!!props.category)

const formData = reactive({
  name: '',
  slug: '',
  description: '',
  is_hidden: false
})

const errors = reactive({
  name: ''
})

const formError = ref('')

onMounted(() => {
  if (props.category) {
    formData.name = props.category.name || ''
    formData.slug = props.category.slug || ''
    formData.description = props.category.description || ''
    formData.is_hidden = !!props.category.is_hidden
  }
})

const validateForm = () => {
  errors.name = ''
  let isValid = true

  if (!isRequired(formData.name)) {
    errors.name = 'Название обязательно'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  formError.value = ''

  if (!validateForm()) {
    return
  }

  const payload = {
    name: formData.name,
    description: formData.description || '',
    is_hidden: formData.is_hidden
  }
  if (formData.slug) payload.slug = formData.slug

  emit('submit', payload)
}
</script>
