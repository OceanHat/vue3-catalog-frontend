<template>
  <div id="app" class="min-h-screen bg-ink-900 text-primary">
    <RouterView />
    <NavMenu />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavMenu from '@/components/common/NavMenu.vue'
</script>

<style>
/* Additional global styles can be added here */
</style>
