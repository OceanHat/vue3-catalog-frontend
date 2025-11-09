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
        placeholder="Enter item name"
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
        placeholder="Enter item description"
      ></textarea>
      <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
    </div>

    <!-- Price -->
    <div>
      <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
        Price
      </label>
      <input
        id="price"
        v-model.number="formData.price"
        type="number"
        step="0.01"
        min="0"
        class="input-field"
        placeholder="0.00"
      />
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
        placeholder="https://example.com/image.jpg"
      />
    </div>

    <!-- Category -->
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
        Category *
      </label>
      <select
        id="category"
        v-model="formData.category_id"
        required
        class="input-field"
      >
        <option value="">Select a category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Additional Data (JSON) -->
    <div>
      <label for="additional_data" class="block text-sm font-medium text-gray-700 mb-1">
        Additional Data (JSON)
      </label>
      <textarea
        id="additional_data"
        v-model="additionalDataString"
        rows="4"
        class="input-field font-mono text-sm"
        placeholder='{"key": "value"}'
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">Enter valid JSON data</p>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">
        Cancel
      </button>
      <button type="submit" :disabled="submitting" class="btn-primary flex items-center">
        <LoadingSpinner v-if="submitting" size="sm" color="white" class="mr-2" />
        <span>{{ isEdit ? 'Update' : 'Create' }} Item</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
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
  description: '',
  price: null,
  image_url: '',
  category_id: '',
  additional_data: {}
})

const additionalDataString = ref('{}')

const errors = reactive({
  name: '',
  description: ''
})

const formError = ref('')

onMounted(() => {
  if (props.item) {
    formData.name = props.item.name || ''
    formData.description = props.item.description || ''
    formData.price = props.item.price
    formData.image_url = props.item.image_url || ''
    formData.category_id = props.item.category_id || ''
    formData.additional_data = props.item.additional_data || {}
    additionalDataString.value = JSON.stringify(formData.additional_data, null, 2)
  }
})

const validateForm = () => {
  errors.name = ''
  errors.description = ''
  let isValid = true

  if (!isRequired(formData.name)) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (!isRequired(formData.description)) {
    errors.description = 'Description is required'
    isValid = false
  }

  // Validate JSON
  try {
    formData.additional_data = JSON.parse(additionalDataString.value)
  } catch (e) {
    formError.value = 'Additional data must be valid JSON'
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
