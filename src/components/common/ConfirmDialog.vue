<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show" 
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleCancel"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black/70 transition-opacity"></div>

          <!-- Dialog -->
          <div class="relative bg-[#322e2a] border border-primary/20 rounded-lg shadow-xl max-w-md w-full p-6 z-10">
            <h3 class="text-lg font-display font-semibold text-primary mb-4">
              {{ title }}
            </h3>
            
            <p class="text-primary/70 mb-6">
              {{ message }}
            </p>

            <div class="flex justify-end space-x-3">
              <button 
                @click="handleCancel" 
                class="btn-secondary"
              >
                {{ cancelText }}
              </button>
              <button 
                @click="handleConfirm" 
                class="btn-danger"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const confirmDialog = computed(() => store.getters['ui/confirmDialog'])
const show = computed(() => confirmDialog.value.show)
const title = computed(() => confirmDialog.value.title)
const message = computed(() => confirmDialog.value.message)
const confirmText = computed(() => confirmDialog.value.confirmText)
const cancelText = computed(() => confirmDialog.value.cancelText)

const handleConfirm = () => {
  if (confirmDialog.value.onConfirm) {
    confirmDialog.value.onConfirm()
  }
  store.dispatch('ui/hideConfirmDialog')
}

const handleCancel = () => {
  store.dispatch('ui/hideConfirmDialog')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
