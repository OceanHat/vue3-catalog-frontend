<template>
  <div class="container mx-auto px-3 py-5 md:px-6 md:py-8">
    <!-- Moving (marquee) title -->
    <div class="mb-5 overflow-hidden md:mb-7">
      <div class="title-marquee">
        <span class="font-display text-2xl tracking-wide text-primary md:text-4xl">{{ item.name }}</span>
        <span class="px-10 font-display text-2xl tracking-wide text-primary/40 md:text-4xl">•</span>
        <span class="font-display text-2xl tracking-wide text-primary md:text-4xl">{{ item.name }}</span>
        <span class="px-10 font-display text-2xl tracking-wide text-primary/40 md:text-4xl">•</span>
      </div>
    </div>

    <!-- ===== Desktop layout: text panel (left) + image & buttons (right) ===== -->
    <div class="hidden gap-8 lg:grid lg:grid-cols-2">
      <!-- Left: bordered info panel with tabs at the bottom -->
      <div class="flex flex-col rounded-2xl border-2 border-primary/70 bg-primary/[0.05]">
        <div class="flex-1 overflow-y-auto p-6 text-[17px] leading-relaxed text-primary/90">
          <p v-if="activeTab === 'description'" class="whitespace-pre-line">
            {{ item.description || 'Описание отсутствует.' }}
          </p>
          <div v-else>
            <div v-if="hasCharacteristics" class="space-y-3">
              <div
                v-for="(value, key) in item.additional_data"
                :key="key"
                class="flex justify-between gap-4 border-b border-primary/15 pb-2"
              >
                <span class="text-primary/60">{{ key }}</span>
                <span class="text-right font-medium text-primary">{{ formatValue(value) }}</span>
              </div>
            </div>
            <p v-else class="text-primary/50">Характеристики отсутствуют.</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="grid grid-cols-2 gap-3 border-t border-primary/15 p-3">
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

      <!-- Right: image + media buttons (only those with data) -->
      <div class="flex flex-col items-center justify-center">
        <div class="flex w-full flex-1 items-center justify-center">
          <ItemMedia :item="item" :mode="mediaMode" />
        </div>
        <div v-if="mediaButtons.length > 1 || item.link" class="mt-6 flex flex-wrap justify-center gap-3">
          <button
            v-for="btn in mediaButtons"
            :key="btn.mode"
            :class="mediaMode === btn.mode ? 'pill-btn !bg-primary/15' : 'pill-btn'"
            @click="mediaMode = btn.mode"
          >
            {{ btn.label }}
          </button>
          <a v-if="item.link" :href="item.link" target="_blank" rel="noopener" class="pill-btn">Ссылка</a>
        </div>
      </div>
    </div>

    <!-- ===== Mobile layout: image, buttons, then info panel with tabs ===== -->
    <div class="space-y-5 lg:hidden">
      <div class="flex items-center justify-center">
        <ItemMedia :item="item" :mode="mediaMode" />
      </div>

      <div v-if="mediaButtons.length > 1 || item.link" class="flex flex-wrap justify-center gap-3">
        <button
          v-for="btn in mediaButtons"
          :key="btn.mode"
          :class="mediaMode === btn.mode ? 'pill-btn !bg-primary/15' : 'pill-btn'"
          @click="mediaMode = btn.mode"
        >
          {{ btn.label }}
        </button>
        <a v-if="item.link" :href="item.link" target="_blank" rel="noopener" class="pill-btn">Ссылка</a>
      </div>

      <div class="flex flex-col rounded-2xl border-2 border-primary/70 bg-primary/[0.05]">
        <div class="p-5 text-base leading-relaxed text-primary/90">
          <p v-if="activeTab === 'description'" class="whitespace-pre-line">
            {{ item.description || 'Описание отсутствует.' }}
          </p>
          <div v-else>
            <div v-if="hasCharacteristics" class="space-y-3">
              <div
                v-for="(value, key) in item.additional_data"
                :key="key"
                class="flex justify-between gap-4 border-b border-primary/15 pb-2"
              >
                <span class="text-primary/60">{{ key }}</span>
                <span class="text-right font-medium text-primary">{{ formatValue(value) }}</span>
              </div>
            </div>
            <p v-else class="text-primary/50">Характеристики отсутствуют.</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 border-t border-primary/15 p-2.5">
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

// Only show media buttons that actually have data behind them.
// The backend currently provides an image (picture_url) per item; map/model
// are optional extras that degrade away when absent.
const mediaButtons = computed(() => {
  const buttons = []
  if (props.item.image_url || props.item.picture_url) buttons.push({ mode: 'photo', label: 'Фото' })
  if (props.item.map_url) buttons.push({ mode: 'map', label: 'Карта' })
  if (props.item.model_url) buttons.push({ mode: 'model', label: 'Модель' })
  return buttons
})

const hasCharacteristics = computed(() =>
  props.item.additional_data && Object.keys(props.item.additional_data).length > 0
)

const tabClass = (tab) =>
  activeTab.value === tab
    ? 'border-primary bg-primary/10 text-primary'
    : 'border-primary/20 text-primary/40 hover:text-primary/70'

const formatValue = (value) =>
  typeof value === 'object' ? JSON.stringify(value) : value
</script>
