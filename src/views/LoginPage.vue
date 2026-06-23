<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold">
          Sign in to your account
        </h2>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <ErrorMessage v-if="formError" :message="formError" :dismissible="true" @dismiss="formError = ''" />

        <div class="rounded-md shadow-sm space-y-4">
          <!-- Username/Email -->
          <div>
            <label for="email" class="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="text"
              required
              class="input-field"
              :class="{ 'input-error': errors.email }"
              placeholder="Enter your username or email"
            />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              class="input-field"
              :class="{ 'input-error': errors.password }"
              placeholder="Enter your password"
            />
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary flex justify-center items-center"
          >
            <LoadingSpinner v-if="loading" size="sm" color="white" />
            <span v-else>Sign in</span>
          </button>
        </div>

        <!-- Additional Links -->
        <div class="text-center">
          <router-link to="/" class="text-sm text-primary hover:opacity-50">
            Back to Home
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'
import { isRequired, minLength } from '@/utils/validators'

const router = useRouter()
const { login, loading } = useAuth()
const { showSuccess, showError } = useNotification()

const formData = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const formError = ref('')

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  let isValid = true

  if (!isRequired(formData.email)) {
    errors.email = 'Email is required'
    isValid = false
  }

  if (!isRequired(formData.password)) {
    errors.password = 'Password is required'
    isValid = false
  } else if (!minLength(formData.password, 6)) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  formError.value = ''
  
  if (!validateForm()) {
    return
  }

  const result = await login(formData)
  
  if (result.success) {
    showSuccess('Login successful!')
    router.push({ name: 'Home' })
  } else {
    formError.value = result.error || 'Login failed. Please check your credentials.'
    showError(formError.value)
  }
}
</script>
