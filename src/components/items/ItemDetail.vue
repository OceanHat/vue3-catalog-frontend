<template>
  <div class="container mx-auto px-3 py-5 md:px-6 md:py-8">

    <!-- ===== Name (inline edit) ===== -->
    <div v-if="isEditing" class="mb-4">
      <label class="mb-1 block text-xs font-medium text-primary/50">Название</label>
      <input
        :value="editData.name"
        @input="emit('update:editData', { ...editData, name: $event.target.value })"
        type="text"
        class="w-full rounded-lg border border-primary/40 bg-ink-800 px-4 py-2 text-xl font-bold text-primary outline-none focus:border-primary"
        placeholder="Название объекта"
      />
    </div>

    <!-- ===== Desktop layout: text panel (left) + image & buttons (right) ===== -->
    <div class="hidden gap-8 lg:grid lg:grid-cols-2">
      <!-- Left: bordered info panel with tabs at the bottom -->
      <div class="flex flex-col rounded-2xl border-2 border-primary/70 bg-ink-800/40">
        <div class="flex-1 overflow-y-auto p-6 text-[17px] leading-relaxed text-primary/90">

          <!-- Description view or edit -->
          <template v-if="activeTab === 'description'">
            <textarea
              v-if="isEditing"
              :value="editData.description"
              @input="emit('update:editData', { ...editData, description: $event.target.value })"
              rows="8"
              class="w-full resize-y rounded-lg border border-primary/40 bg-ink-800 p-3 text-[15px] text-primary outline-none focus:border-primary"
              placeholder="Описание"
            />
            <p v-else class="whitespace-pre-line">
              {{ item.description || 'Описание отсутствует.' }}
            </p>
          </template>

          <!-- Characteristics view or edit -->
          <template v-else>
            <div v-if="isEditing" class="space-y-2">
              <div
                v-for="(value, key) in editData.additional_data"
                :key="key"
                class="flex items-center gap-2 border-b border-ink-600 pb-2"
              >
                <span class="w-1/3 shrink-0 text-sm text-primary/60">{{ key }}</span>
                <input
                  :value="value"
                  @input="updateCharacteristic(key, $event.target.value)"
                  class="flex-1 rounded border border-primary/30 bg-ink-800 px-2 py-1 text-sm text-primary outline-none focus:border-primary"
                />
              </div>
              <p v-if="!hasCharacteristics" class="text-sm text-primary/40">Характеристики отсутствуют.</p>
            </div>
            <div v-else-if="hasCharacteristics" class="space-y-3">
              <div
                v-for="(value, key) in item.additional_data"
                :key="key"
                class="flex justify-between gap-4 border-b border-ink-600 pb-2"
              >
                <span class="text-primary/60">{{ key }}</span>
                <span class="text-right font-medium text-primary">{{ formatValue(value) }}</span>
              </div>
            </div>
            <p v-else class="text-primary/50">Характеристики отсутствуют.</p>
          </template>
        </div>

        <!-- Tabs -->
        <div class="grid grid-cols-2 gap-3 border-t border-ink-600 p-3">
          <button
            class="rounded-lg border px-4 py-3 font-display tracking-wide transition-colors"
            :class="tabClass('characteristics')"
            @click="activeTab = 'characteristics'"
          >
            Характеристика
          </button>
          <button
            class="rounded-lg border px-4 py-3 font-display tracking-wide transition-colors"
            :class="tabClass('description')"
            @click="activeTab = 'description'"
          >
            Описание
          </button>
        </div>
      </div>

      <!-- Right: image + picture_url input in edit mode -->
      <div class="flex flex-col items-center justify-center">
        <div v-if="isEditing" class="mb-4 w-full">
          <label class="mb-1 block text-xs font-medium text-primary/50">Ссылка на фото</label>
          <input
            :value="editData.picture_url"
            @input="emit('update:editData', { ...editData, picture_url: $event.target.value })"
            type="text"
            class="w-full rounded-lg border border-primary/40 bg-ink-800 px-3 py-2 text-sm text-primary outline-none focus:border-primary"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div class="flex w-full flex-1 items-center justify-center">
          <ItemMedia :item="isEditing ? { ...item, picture_url: editData.picture_url } : item" :mode="mediaMode" />
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <button :class="mediaMode === 'photo' ? 'pill-btn !bg-primary/10' : 'pill-btn'" @click="mediaMode = 'photo'">Фото</button>
          <button :class="mediaMode === 'map' ? 'pill-btn !bg-primary/10' : 'pill-btn-muted'" @click="item.map_url && (mediaMode = 'map')">Карта</button>
          <button :class="mediaMode === 'model' ? 'pill-btn !bg-primary/10' : 'pill-btn-muted'" @click="item.model_url && (mediaMode = 'model')">Модель</button>
        </div>
      </div>
    </div>

    <!-- ===== Mobile layout ===== -->
    <div class="space-y-5 lg:hidden">
      <div v-if="isEditing" class="w-full">
        <label class="mb-1 block text-xs font-medium text-primary/50">Ссылка на фото</label>
        <input
          :value="editData.picture_url"
          @input="emit('update:editData', { ...editData, picture_url: $event.target.value })"
          type="text"
          class="w-full rounded-lg border border-primary/40 bg-ink-800 px-3 py-2 text-sm text-primary outline-none focus:border-primary"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div class="flex items-center justify-center">
        <ItemMedia :item="isEditing ? { ...item, picture_url: editData.picture_url } : item" :mode="mediaMode" />
      </div>

      <div class="flex flex-wrap justify-center gap-3">
        <button :class="mediaMode === 'photo' ? 'pill-btn !bg-primary/10' : 'pill-btn'" @click="mediaMode = 'photo'">Фото</button>
        <button :class="mediaMode === 'map' ? 'pill-btn !bg-primary/10' : 'pill-btn-muted'" @click="item.map_url && (mediaMode = 'map')">Карта</button>
        <button :class="mediaMode === 'model' ? 'pill-btn !bg-primary/10' : 'pill-btn-muted'" @click="item.model_url && (mediaMode = 'model')">Модель</button>
      </div>

      <div class="flex flex-col rounded-2xl border-2 border-primary/70 bg-ink-800/40">
        <div class="p-5 text-base leading-relaxed text-primary/90">
          <template v-if="activeTab === 'description'">
            <textarea
              v-if="isEditing"
              :value="editData.description"
              @input="emit('update:editData', { ...editData, description: $event.target.value })"
              rows="6"
              class="w-full resize-y rounded-lg border border-primary/40 bg-ink-800 p-3 text-sm text-primary outline-none focus:border-primary"
              placeholder="Описание"
            />
            <p v-else class="whitespace-pre-line">
              {{ item.description || 'Описание отсутствует.' }}
            </p>
          </template>
          <template v-else>
            <div v-if="isEditing" class="space-y-2">
              <div
                v-for="(value, key) in editData.additional_data"
                :key="key"
                class="flex items-center gap-2 border-b border-ink-600 pb-2"
              >
                <span class="w-1/3 shrink-0 text-xs text-primary/60">{{ key }}</span>
                <input
                  :value="value"
                  @input="updateCharacteristic(key, $event.target.value)"
                  class="flex-1 rounded border border-primary/30 bg-ink-800 px-2 py-1 text-sm text-primary outline-none focus:border-primary"
                />
              </div>
              <p v-if="!hasCharacteristics" class="text-sm text-primary/40">Характеристики отсутствуют.</p>
            </div>
            <div v-else-if="hasCharacteristics" class="space-y-3">
              <div
                v-for="(value, key) in item.additional_data"
                :key="key"
                class="flex justify-between gap-4 border-b border-ink-600 pb-2"
              >
                <span class="text-primary/60">{{ key }}</span>
                <span class="text-right font-medium text-primary">{{ formatValue(value) }}</span>
              </div>
            </div>
            <p v-else class="text-primary/50">Характеристики отсутствуют.</p>
          </template>
        </div>
        <div class="grid grid-cols-2 gap-2 border-t border-ink-600 p-2.5">
          <button class="rounded-lg border px-3 py-2.5 font-display text-sm tracking-wide transition-colors" :class="tabClass('characteristics')" @click="activeTab = 'characteristics'">Характер-ка</button>
          <button class="rounded-lg border px-3 py-2.5 font-display text-sm tracking-wide transition-colors" :class="tabClass('description')" @click="activeTab = 'description'">Описание</button>
        </div>
      </div>

      <div v-if="itemCategory" class="text-center text-sm text-primary/60">
        Категория:
        <RouterLink :to="{ name: 'CategoryDetail', params: { slug: itemCategory.slug } }" class="text-primary hover:text-accent">
          {{ itemCategory.name }}
        </RouterLink>
      </div>
    </div>

    <div v-if="itemCategory" class="mt-6 hidden text-sm text-primary/60 lg:block">
      Категория:
      <RouterLink :to="{ name: 'CategoryDetail', params: { slug: itemCategory.slug } }" class="text-primary hover:text-accent">
        {{ itemCategory.name }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import ItemMedia from '@/components/items/ItemMedia.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: () => ({ name: '', description: '', picture_url: '', additional_data: {} })
  }
})

const emit = defineEmits(['update:editData'])

const store = useStore()

const itemCategory = computed(() => {
  if (!props.item.category_id) return null
  return store.getters['categories/getCategoryById'](props.item.category_id) || null
})

onMounted(() => {
  const cats = store.getters['categories/categories']
  if (!cats || cats.length === 0) {
    store.dispatch('categories/fetchCategories').catch(() => {})
  }
})

const activeTab = ref('description')
const mediaMode = ref('photo')

const hasCharacteristics = computed(() => {
  const data = props.isEditing ? props.editData.additional_data : props.item.additional_data
  return data && Object.keys(data).length > 0
})

const tabClass = (tab) =>
  activeTab.value === tab
    ? 'border-primary bg-primary/10 text-primary'
    : 'border-ink-600 text-primary/40 hover:text-primary/70'

const formatValue = (value) =>
  typeof value === 'object' ? JSON.stringify(value) : value

const updateCharacteristic = (key, value) => {
  emit('update:editData', {
    ...props.editData,
    additional_data: { ...props.editData.additional_data, [key]: value }
  })
}
</script>
