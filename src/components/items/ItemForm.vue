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
        placeholder="Введите название предмета"
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
        :class="{ 'input-error': errors.slug }"
        placeholder="например: amethyst-crystal"
      />
      <p class="text-xs text-primary/50 mt-1">Только строчные латинские буквы, цифры и дефис. Оставьте пустым для автогенерации.</p>
      <p v-if="errors.slug" class="error-text">{{ errors.slug }}</p>
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
        placeholder="Введите описание предмета"
      ></textarea>
    </div>

    <!-- Категория -->
    <div>
      <label for="category" class="block text-sm font-medium text-primary/80 mb-1">
        Категория *
      </label>
      <select
        id="category"
        v-model="formData.category_id"
        required
        class="input-field"
        :class="{ 'input-error': errors.category_id }"
      >
        <option value="">Выберите категорию</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <p v-if="errors.category_id" class="error-text">{{ errors.category_id }}</p>
    </div>

    <!-- Изображение (загрузка файла) -->
    <div>
      <label for="image" class="block text-sm font-medium text-primary/80 mb-1">
        Изображение
      </label>
      <input
        id="image"
        ref="fileInput"
        type="file"
        accept="image/*"
        class="input-field file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/20 file:text-primary file:cursor-pointer"
        @change="handleFileChange"
      />
      <p class="text-xs text-primary/50 mt-1">
        {{ isEdit ? 'Загрузите новый файл, чтобы заменить текущее изображение.' : 'Изображение будет загружено после создания предмета.' }}
      </p>
      <div v-if="previewUrl" class="mt-3">
        <img :src="previewUrl" alt="Предпросмотр" class="h-32 w-auto rounded border border-primary/20 object-cover" />
      </div>
    </div>

    <!-- Ссылка (необязательно) -->
    <div>
      <label for="link" class="block text-sm font-medium text-primary/80 mb-1">
        Ссылка (необязательно)
      </label>
      <input
        id="link"
        v-model="formData.link"
        type="url"
        class="input-field"
        :class="{ 'input-error': errors.link }"
        placeholder="https://example.com"
      />
      <p v-if="errors.link" class="error-text">{{ errors.link }}</p>
    </div>

    <!-- Дополнительные данные (JSON) -->
    <div>
      <label for="additional_data" class="block text-sm font-medium text-primary/80 mb-1">
        Дополнительные данные (JSON)
      </label>
      <textarea
        id="additional_data"
        v-model="additionalDataString"
        rows="4"
        class="input-field font-mono text-sm"
        placeholder='{"map_url": "...", "model_url": "..."}'
      ></textarea>
      <p class="text-xs text-primary/50 mt-1">Введите корректный JSON. Поддерживаются ключи map_url, model_url и другие.</p>
    </div>

    <!-- Скрыть предмет -->
    <div class="flex items-center gap-2">
      <input
        id="is_hidden"
        v-model="formData.is_hidden"
        type="checkbox"
        class="h-4 w-4 rounded border-primary/40 bg-transparent text-primary focus:ring-primary"
      />
      <label for="is_hidden" class="text-sm font-medium text-primary/80">
        Скрыть предмет (не показывать посетителям)
      </label>
    </div>

    <!-- Кнопки -->
    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">
        Отмена
      </button>
      <button type="submit" :disabled="submitting" class="btn-primary flex items-center">
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
  item: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    required: true
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = ref(!!props.item)

const formData = reactive({
  name: '',
  slug: '',
  description: '',
  category_id: '',
  link: '',
  is_hidden: false,
  additional_data: {}
})

const additionalDataString = ref('{}')
const fileInput = ref(null)
const imageFile = ref(null)
const previewUrl = ref('')

const errors = reactive({
  name: '',
  slug: '',
  category_id: '',
  link: ''
})

const formError = ref('')

const SLUG_RE = /^[a-z0-9-]+$/

onMounted(() => {
  if (props.item) {
    formData.name = props.item.name || ''
    formData.slug = props.item.slug || ''
    formData.description = props.item.description || ''
    formData.category_id = props.item.category_id || ''
    formData.link = props.item.link || ''
    formData.is_hidden = !!props.item.is_hidden
    formData.additional_data = props.item.additional_data || {}
    additionalDataString.value = JSON.stringify(formData.additional_data || {}, null, 2)
    // Show current image as preview when editing
    if (props.item.image_url) {
      previewUrl.value = props.item.image_url
    }
  }
})

const handleFileChange = (e) => {
  const file = e.target.files && e.target.files[0]
  imageFile.value = file || null
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
}

const validateForm = () => {
  errors.name = ''
  errors.slug = ''
  errors.category_id = ''
  errors.link = ''
  let isValid = true

  if (!isRequired(formData.name)) {
    errors.name = 'Название обязательно'
    isValid = false
  }

  if (!formData.category_id) {
    errors.category_id = 'Выберите категорию'
    isValid = false
  }

  if (formData.slug && !SLUG_RE.test(formData.slug)) {
    errors.slug = 'Slug может содержать только строчные латинские буквы, цифры и дефис'
    isValid = false
  }

  // Validate JSON
  try {
    formData.additional_data = additionalDataString.value.trim()
      ? JSON.parse(additionalDataString.value)
      : {}
  } catch (e) {
    formError.value = 'Дополнительные данные должны быть корректным JSON'
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
    category_id: formData.category_id,
    is_hidden: formData.is_hidden,
    additional_data: formData.additional_data || {}
  }
  if (formData.slug) payload.slug = formData.slug
  if (formData.link) payload.link = formData.link

  emit('submit', { data: payload, imageFile: imageFile.value })
}
</script>
