<template>
  <div class="min-h-screen flex items-center justify-center bg-[#292623] px-4">
    <div class="text-center">
      <h1 class="text-8xl sm:text-9xl font-display font-bold text-primary">404</h1>
      <h2 class="text-2xl sm:text-3xl font-display font-semibold text-primary mt-4 mb-2">
        Страница не найдена
      </h2>
      <p class="text-primary/60 mb-8">
        Страница, которую вы ищете, не существует или была перемещена.
      </p>
      <router-link to="/" class="btn-primary">
        Вернуться на главную
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Логика для страницы 404 не требуется
</script>
