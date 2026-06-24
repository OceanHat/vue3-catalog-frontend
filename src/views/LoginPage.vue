<template>
  <div class="min-h-screen flex items-center justify-center bg-[#292623] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-display font-extrabold text-primary">
          Вход в аккаунт
        </h2>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <ErrorMessage v-if="formError" :message="formError" :dismissible="true" @dismiss="formError = ''" />

        <div class="rounded-md space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-primary/80 mb-1">
              Электронная почта
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="input-field"
              :class="{ 'input-error': errors.email }"
              placeholder="Введите электронную почту"
            />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-primary/80 mb-1">
              Пароль
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              class="input-field"
              :class="{ 'input-error': errors.password }"
              placeholder="Введите пароль"
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
            <span v-else>Войти</span>
          </button>
        </div>

        <!-- Additional Links -->
        <div class="text-center">
          <router-link to="/" class="text-sm text-primary hover:text-accent transition-colors">
            На главную
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
import { isRequired, isValidEmail, minLength } from '@/utils/validators'

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
    errors.email = 'Укажите электронную почту'
    isValid = false
  } else if (typeof isValidEmail === 'function' && !isValidEmail(formData.email)) {
    errors.email = 'Введите корректный адрес электронной почты'
    isValid = false
  }

  if (!isRequired(formData.password)) {
    errors.password = 'Укажите пароль'
    isValid = false
  } else if (!minLength(formData.password, 8)) {
    errors.password = 'Пароль должен содержать не менее 8 символов'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  formError.value = ''

  if (!validateForm()) {
    return
  }

  const result = await login({ email: formData.email, password: formData.password })

  if (result.success) {
    showSuccess('Вход выполнен успешно')
    router.push({ name: 'Home' })
  } else {
    formError.value = result.error || 'Не удалось войти. Проверьте данные.'
    showError(formError.value)
  }
}
</script>
