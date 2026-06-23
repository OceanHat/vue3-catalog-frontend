<template>
  <header class="sticky top-0 z-30 bg-secondary/80 backdrop-blur border-b">
    <div class="relative flex items-center px-3 py-3 md:px-5 md:py-4">
      <!-- Back arrow (left) -->
      <button
        v-if="showBack"
        type="button"
        class="z-10 shrink-0 p-1 text-primary transition-colors hover:text-accent"
        aria-label="Назад"
        @click="goBack">
        <svg
          class="h-7 w-7 md:h-8 md:w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <RouterLink
        v-else
        to="/"
        class="z-10 shrink-0 p-1 text-primary transition-colors hover:text-accent"
        aria-label="Главная">
        <svg class="w-9 h-9"
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

      <!-- Centered title -->
      <h1
        class="pointer-events-none absolute inset-x-0 mx-auto px-14 text-center font-display text-xl tracking-wide text-primary truncate md:text-3xl">
        {{ title }}
      </h1>

      <!-- Hamburger (right) -->
      <button
        type="button"
        class="z-10 ml-auto shrink-0 p-1 text-primary transition-colors hover:text-accent"
        aria-label="Открыть меню"
        @click="openMenu">
        <svg
          class="h-7 w-7 md:h-8 md:w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter, RouterLink } from "vue-router";
import PyramidLogo from "@/components/common/PyramidLogo.vue";

defineProps({
  title: {
    type: String,
    default: "Горная Югра",
  },
  showBack: {
    type: Boolean,
    default: true,
  },
});

const store = useStore();
const router = useRouter();

const openMenu = () => store.commit("ui/SET_SIDEBAR", true);

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>
