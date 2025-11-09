<template>
  <div 
    v-if="message" 
    class="rounded-lg p-4 mb-4"
    :class="typeClass"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg 
          class="h-5 w-5" 
          :class="iconColorClass"
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fill-rule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
            clip-rule="evenodd" 
          />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium" :class="textColorClass">
          {{ message }}
        </p>
      </div>
      <button 
        v-if="dismissible" 
        @click="$emit('dismiss')" 
        class="ml-auto flex-shrink-0"
      >
        <span class="sr-only">Dismiss</span>
        <svg class="h-5 w-5" :class="iconColorClass" viewBox="0 0 20 20" fill="currentColor">
          <path 
            fill-rule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clip-rule="evenodd" 
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])

const typeClass = computed(() => {
  const classes = {
    error: 'bg-red-50 border border-red-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200',
    success: 'bg-green-50 border border-green-200'
  }
  return classes[props.type]
})

const textColorClass = computed(() => {
  const classes = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
    success: 'text-green-800'
  }
  return classes[props.type]
})

const iconColorClass = computed(() => {
  const classes = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    success: 'text-green-400'
  }
  return classes[props.type]
})
</script>
