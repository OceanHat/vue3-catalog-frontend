<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-secondary/80 backdrop-blur-sm"
        @click="close" />
    </Transition>

    <!-- Navigation panel: top overlay bar that drops down on any page -->
    <Transition name="nav-slide">
      <nav
        v-if="isOpen"
        class="fixed inset-x-0 top-0 z-50 bg-secondary border-b border-ink-600 shadow-glow"
        role="dialog"
        aria-modal="true"
        aria-label="Навигация">
        <div class="mx-auto flex w-full items-center px-4 py-3 md:px-6 md:py-4">
          <!-- Pyramid logo -->
          <RouterLink
            to="/"
            class="shrink-0"
            @click="close"
            aria-label="Главная">
            <svg
              class="w-9 h-9"
              width="75"
              height="77"
              viewBox="0 0 75 77"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M38.7799 74L38.2106 75.9173L38.7444 76.0758L39.2832 75.9356L38.7799 74ZM73 65.1011L73.5034 67.0367C74.0912 66.8839 74.5777 66.4722 74.8257 65.9177C75.0737 65.3633 75.0563 64.7261 74.7784 64.1861L73 65.1011ZM40.5313 2L42.3097 1.08493C41.9813 0.446658 41.336 0.0333376 40.6189 0.001917C39.9017 -0.0295036 39.2228 0.325795 38.8398 0.932899L40.5313 2ZM2 63.0787L0.308464 62.0116C-0.0256035 62.5411 -0.0923979 63.1965 0.12798 63.7826C0.348358 64.3687 0.830474 64.8177 1.43069 64.9959L2 63.0787ZM38.7799 74L39.2832 75.9356L73.5034 67.0367L73 65.1011L72.4966 63.1655L38.2765 72.0644L38.7799 74ZM73 65.1011L74.7784 64.1861L42.3097 1.08493L40.5313 2L38.7529 2.91507L71.2216 66.0162L73 65.1011ZM40.5313 2L38.573 2.40621L49.6204 55.6646L51.5787 55.2584L53.5371 54.8522L42.4896 1.59379L40.5313 2ZM51.5787 55.2584L50.7437 57.0758L72.165 66.9185L73 65.1011L73.835 63.2838L52.4138 53.4411L51.5787 55.2584ZM23.556 54.7191L25.4597 55.3321L42.4351 2.613L40.5313 2L38.6276 1.387L21.6522 54.1061L23.556 54.7191ZM40.5313 2L38.8398 0.932899L0.308464 62.0116L2 63.0787L3.69154 64.1458L42.2228 3.0671L40.5313 2ZM2 63.0787L1.43069 64.9959L38.2106 75.9173L38.7799 74L39.3492 72.0827L2.56931 61.1614L2 63.0787ZM23.556 54.7191L22.8328 52.8544L1.27686 61.214L2 63.0787L2.72314 64.9433L24.2791 56.5838L23.556 54.7191ZM23.556 54.7191L23.5175 56.7187L39.2031 57.0206L39.2416 55.021L39.28 53.0214L23.5945 52.7195L23.556 54.7191ZM39.2416 55.021L41.241 55.0696L42.5307 2.04864L40.5313 2L38.5319 1.95136L37.2421 54.9724L39.2416 55.021ZM38.7799 74L40.7793 74.0486L41.241 55.0696L39.2416 55.021L37.2421 54.9724L36.7805 73.9514L38.7799 74ZM51.5787 55.2584L51.6172 53.2588L39.28 53.0214L39.2416 55.021L39.2031 57.0206L51.5403 57.2581L51.5787 55.2584Z"
                fill="#FFE5FF" />
            </svg>
          </RouterLink>

          <!-- Desktop: horizontal links -->
          <ul
            class="ml-6 hidden flex-1 items-center justify-center gap-6 lg:gap-10 md:flex">
            <li v-for="link in navLinks" :key="link.key">
              <RouterLink
                :to="link.to"
                class="font-display text-lg tracking-wide text-primary/90 transition-colors hover:text-accent"
                active-class="text-accent"
                @click="close">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>

          <!-- spacer so X stays right on desktop -->
          <div class="flex-1 md:hidden" />

          <!-- Close button -->
          <button
            type="button"
            class="shrink-0 p-1 text-primary transition-colors hover:text-accent"
            aria-label="Закрыть меню"
            @click="close">
            <svg
              class="h-8 w-8 md:h-9 md:w-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <!-- Mobile: vertical centered links -->
        <ul class="flex flex-col items-center gap-5 pb-10 pt-2 md:hidden">
          <li v-for="link in navLinks" :key="'m-' + link.key">
            <RouterLink
              :to="link.to"
              class="font-display text-3xl tracking-wide text-primary/90 transition-colors hover:text-accent"
              active-class="text-accent"
              @click="close">
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { RouterLink } from "vue-router";
import PyramidLogo from "@/components/common/PyramidLogo.vue";
import { useCategories } from "@/composables/useCategories";

const store = useStore();
const { categories, fetchCategories } = useCategories();

const isOpen = computed(() => store.getters["ui/sidebarOpen"]);

const close = () => store.commit("ui/SET_SIDEBAR", false);

// Fallback labels matching the design mockup, used until the server responds.
const FALLBACK = [
  { key: "minerals", label: "Минералы", slug: "minerals" },
  { key: "nature", label: "Природа", slug: "nature" },
  { key: "history", label: "История", slug: "history" },
  { key: "economy", label: "Экономика", slug: "economy" },
  { key: "souvenirs", label: "Сувениры", slug: "souvenirs" },
  { key: "tours", label: "Туры", slug: "tours" },
];

// Build nav links from server categories when available, otherwise fallback.
const navLinks = computed(() => {
  const list =
    categories.value && categories.value.length
      ? categories.value.map((c) => ({
          key: c.slug || c.id,
          label: c.name,
          to: { name: "CategoryDetail", params: { slug: c.slug } },
        }))
      : FALLBACK.map((c) => ({
          key: c.key,
          label: c.label,
          to: { name: "CategoryDetail", params: { slug: c.slug } },
        }));
  return list;
});

// Fetch categories from the server once the menu is first opened.
let fetched = false;
watch(isOpen, (open) => {
  if (open && !fetched) {
    fetched = true;
    fetchCategories().catch(() => {
      /* fallback labels remain */
    });
  }
});

// Lock body scroll while open, and close on Escape.
const onKey = (e) => {
  if (e.key === "Escape") close();
};
watch(isOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});
</script>
