<template>
  <div class="container mx-auto px-3 py-5 md:px-6 md:py-8">
    <!-- ===== Desktop layout: text panel (left) + image & buttons (right) ===== -->
    <div class="hidden gap-8 lg:grid lg:grid-cols-2">
      <!-- Left: bordered info panel with tabs at the bottom -->
      <div class="flex flex-col rounded-2xl border-2 border-primary/70 bg-ink-800/40">
        <div class="flex-1 overflow-y-auto p-6 text-[17px] leading-relaxed text-primary/90">
          <p v-if="activeTab === 'description'" class="whitespace-pre-line">
            {{ item.description || 'Описание отсутствует.' }}
          </p>
          <component :is="'div'" v-else>
            <div v-if="hasCharacteristics" class="space-y-3">
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
          </component>
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

      <!-- Right: image + Фото / Карта / Модель -->
      <div class="flex flex-col items-center justify-center">
        <div class="flex w-full flex-1 items-center justify-center">
          <ItemMedia :item="item" :mode="mediaMode" />
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <button :class="mediaMode === 'photo' ? 'pill-btn !bg-primary/10' : 'pill-btn'" @click="mediaMode = 'photo'">Фото</button>
          <button :class="mediaMode === 'map' ? 'pill-btn !bg-primary/10' : 'pill-btn-muted'" @click="item.map_url && (mediaMode = 'map')">Карта</button>
          <button :class="mediaMode === 'model' ? 'pill-btn !bg-primary/10' : 'pill-btn-muted'" @click="item.model_url && (mediaMode = 'model')">Модель</button>
        </div>
      </div>
    </div>

    <!-- ===== Mobile layout: image, buttons, then info panel with tabs ===== -->
    <div class="space-y-5 lg:hidden">
      <div class="flex items-center justify-center">
        <ItemMedia :item="item" :mode="mediaMode" />
      </div>

      <div class="flex flex-wrap justify-center gap-3">
        <button :class="mediaMode === 'photo' ? 'pill-btn !bg-primary/10' : 'pill-btn'" @click="mediaMode = 'photo'">Фото</button>
        <button :class="mediaMode === 'map' ? 'pill-btn !bg-primary/10' : 'pill-btn-muted'" @click="item.map_url && (mediaMode = 'map')">Карта</button>
        <button :class="mediaMode === 'model' ? 'pill-btn !bg-primary/10' : 'pill-btn-muted'" @click="item.model_url && (mediaMode = 'model')">Модель</button>
      </div>

      <div class="flex flex-col rounded-2xl border-2 border-primary/70 bg-ink-800/40">
        <div class="p-5 text-base leading-relaxed text-primary/90">
          <p v-if="activeTab === 'description'" class="whitespace-pre-line">
            {{ item.description || 'Описание отсутствует.' }}
          </p>
          <div v-else>
            <div v-if="hasCharacteristics" class="space-y-3">
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
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 border-t border-ink-600 p-2.5">
          <button class="rounded-lg border px-3 py-2.5 font-display text-sm tracking-wide transition-colors" :class="tabClass('characteristics')" @click="activeTab = 'characteristics'">
            Характер-ка
          </button>
          <button class="rounded-lg border px-3 py-2.5 font-display text-sm tracking-wide transition-colors" :class="tabClass('description')" @click="activeTab = 'description'">
            Описание
          </button>
        </div>
      </div>

      <!-- Category link -->
      <div v-if="itemCategory" class="text-center text-sm text-primary/60">
        Категория:
        <RouterLink :to="{ name: 'CategoryDetail', params: { slug: itemCategory.slug } }" class="text-primary hover:text-accent">
          {{ itemCategory.name }}
        </RouterLink>
      </div>
    </div>

    <!-- Category link (desktop) -->
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
  }
})

const store = useStore()

// Backend ItemResponse has no nested category object — only category_id.
// Resolve the category from the categories store so we can show its name/slug.
const itemCategory = computed(() => {
  if (!props.item.category_id) return null
  return store.getters['categories/getCategoryById'](props.item.category_id) || null
})

// Ensure the categories list is available for the lookup above.
onMounted(() => {
  const cats = store.getters['categories/categories']
  if (!cats || cats.length === 0) {
    store.dispatch('categories/fetchCategories').catch(() => {})
  }
})

const activeTab = ref('description')
const mediaMode = ref('photo')

const hasCharacteristics = computed(() =>
  props.item.additional_data && Object.keys(props.item.additional_data).length > 0
)

const tabClass = (tab) =>
  activeTab.value === tab
    ? 'border-primary bg-primary/10 text-primary'
    : 'border-ink-600 text-primary/40 hover:text-primary/70'

const formatValue = (value) =>
  typeof value === 'object' ? JSON.stringify(value) : value
</script>
