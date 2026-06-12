<template>
  <footer class="mt-auto border-t border-ink-600 bg-ink-800 text-primary/70">
    <div class="container mx-auto flex flex-col items-center gap-2 px-4 py-6 text-center">
      <div class="flex items-center gap-3">
        <router-link to="/categories" class="font-display text-sm tracking-wide hover:text-accent">Категории</router-link>
        <span class="text-primary/30">·</span>
        <router-link to="/" class="font-display text-sm tracking-wide hover:text-accent">Главная</router-link>
      </div>
      <p class="text-xs text-primary/40">&copy; {{ currentYear }} Народная · Каталог</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
