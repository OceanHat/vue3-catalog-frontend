<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <ErrorMessage v-if="formError" :message="formError" :dismissible="true" @dismiss="formError = ''" />

    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
        Name *
      </label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="input-field"
        :class="{ 'input-error': errors.name }"
        placeholder="Enter category name"
      />
      <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
        Description *
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="4"
        required
        class="input-field"
        :class="{ 'input-error': errors.description }"
        placeholder="Enter category description"
      ></textarea>
      <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
    </div>

    <!-- Image URL -->
    <div>
      <label for="image_url" class="block text-sm font-medium text-gray-700 mb-1">
        Image URL
      </label>
      <input
        id="image_url"
        v-model="formData.image_url"
        type="url"
        class="input-field"
        :class="{ 'input-error': errors.image_url }"
        placeholder="https://example.com/image.jpg"
      />
      <p v-if="errors.image_url" class="error-text">{{ errors.image_url }}</p>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end space-x-3">
      <button 
        type="button" 
        @click="$emit('cancel')" 
        class="btn-secondary"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        :disabled="submitting" 
        class="btn-primary flex items-center"
      >
        <LoadingSpinner v-if="submitting" size="sm" color="white" class="mr-2" />
        <span>{{ isEdit ? 'Update' : 'Create' }} Category</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { isRequired, isValidUrl } from '@/utils/validators'

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
  description: '',
  image_url: ''
})

const errors = reactive({
  name: '',
  description: '',
  image_url: ''
})

const formError = ref('')

onMounted(() => {
  if (props.category) {
    formData.name = props.category.name || ''
    formData.description = props.category.description || ''
    formData.image_url = props.category.image_url || ''
  }
})

const validateForm = () => {
  errors.name = ''
  errors.description = ''
  errors.image_url = ''
  let isValid = true

  if (!isRequired(formData.name)) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (!isRequired(formData.description)) {
    errors.description = 'Description is required'
    isValid = false
  }

  if (formData.image_url && !isValidUrl(formData.image_url)) {
    errors.image_url = 'Please enter a valid URL'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  formError.value = ''
  
  if (!validateForm()) {
    return
  }

  emit('submit', { ...formData })
}
</script>
