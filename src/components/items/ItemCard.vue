<template>
  <div class="relative">
    <!-- Hidden badge -->
    <div v-if="item.is_hidden" class="absolute right-2 top-2 z-10 rounded bg-red-600 px-2 py-0.5 text-xs text-white">
      Скрыто
    </div>

    <RouterLink
      :to="{ name: 'ItemDetail', params: { slug: item.slug } }"
      class="catalog-tile group"
    >
      <!-- Image area -->
      <div class="aspect-[4/3] w-full overflow-hidden bg-ink-700">
        <img
          v-if="imageSrc && !imageFailed"
          :src="imageSrc"
          :alt="item.name"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          @error="imageFailed = true"
        />
        <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-800">
          <span class="font-display text-4xl text-primary/40">{{ (item.name || '?').charAt(0) }}</span>
        </div>
      </div>

      <!-- Caption: separated by a hairline, like the mockup -->
      <div class="border-t-2 border-primary/70 px-3 py-2 text-center">
        <span class="font-display text-base tracking-wide text-primary line-clamp-1">
          {{ item.name || 'Описание' }}
        </span>
      </div>
    </RouterLink>

    <!-- Admin actions -->
    <div v-if="showAdminActions" class="mt-3 flex gap-2">
      <button @click="$emit('edit', item)" class="btn-secondary text-xs">Изменить</button>
      <button @click="$emit('toggle-visibility', item)" class="btn-secondary text-xs">
        {{ item.is_hidden ? 'Показать' : 'Скрыть' }}
      </button>
      <button @click="$emit('delete', item)" class="btn-danger text-xs">Удалить</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  showAdminActions: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete', 'toggle-visibility'])

// Grid tiles use the lightweight thumbnail; fall back to the full image.
const imageSrc = computed(() => props.item.thumbnail_url || props.item.image_url || null)
const imageFailed = ref(false)

// Reset the error flag if the item (and therefore its image) changes.
watch(() => props.item?.id, () => { imageFailed.value = false })
</script>
