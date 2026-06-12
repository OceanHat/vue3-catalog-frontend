<template>
  <!-- Wireframe pyramid icon (matches catalog brand mark) -->
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
    <!-- outer silhouette -->
    <path d="M32 6 L60 52 L4 52 Z" />
    <!-- back edge to apex -->
    <path d="M32 6 L32 40" />
    <!-- base front edges from center -->
    <path d="M32 40 L4 52" />
    <path d="M32 40 L60 52" />
    <!-- inner ridge lines -->
    <path d="M32 6 L18 52" opacity="0.7" />
    <path d="M32 6 L46 52" opacity="0.7" />
  </svg>
</template>

<script setup>
// Purely presentational SVG brand mark.
</script>
