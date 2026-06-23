<template>
  <div class="w-full">
    <!-- Photo -->
    <div v-if="mode === 'photo'" class="flex items-center justify-center">
      <img
        v-if="item.image_url && !imageFailed"
        :src="item.image_url"
        :alt="item.name"
        class="max-h-[60vh] w-auto max-w-full rounded-xl object-contain drop-shadow-xl"
        @error="imageFailed = true"
      />
      <div v-else class="flex h-72 w-full items-center justify-center rounded-xl bg-primary/[0.04]">
        <span class="font-display text-6xl text-primary/40">{{ (item.name || '?').charAt(0) }}</span>
      </div>
    </div>

    <!-- Map -->
    <div v-else-if="mode === 'map'" class="w-full">
      <iframe
        v-if="item.map_url"
        :src="item.map_url"
        class="h-[55vh] w-full rounded-xl border border-primary/20"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <div v-else class="flex h-72 items-center justify-center rounded-xl border border-primary/20 text-primary/40">
        Карта недоступна
      </div>
    </div>

    <!-- 3D model -->
    <div v-else class="w-full">
      <iframe
        v-if="item.model_url"
        :src="item.model_url"
        class="h-[55vh] w-full rounded-xl border border-primary/20"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        loading="lazy"
      ></iframe>
      <div v-else class="flex h-72 items-center justify-center rounded-xl border border-primary/20 text-primary/40">
        Модель недоступна
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'photo' // 'photo' | 'map' | 'model'
  }
})

// Fall back to the initial-letter placeholder if the image fails to load.
const imageFailed = ref(false)
watch(() => props.item?.id, () => { imageFailed.value = false })
</script>
