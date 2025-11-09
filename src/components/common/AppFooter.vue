<template>
  <footer class="bg-secondary text-white mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About Section -->
        <div>
          <h3 class="text-xl font-bold mb-4">Vue Catalog</h3>
          <p class="text-gray-300">
            A modern catalog application built with Vue 3, Vuex, and Tailwind CSS.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-xl font-bold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-300 hover:text-white transition-colors">
                Home
              </router-link>
            </li>
            <li>
              <router-link to="/categories" class="text-gray-300 hover:text-white transition-colors">
                Categories
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-xl font-bold mb-4">Contact</h3>
          <p class="text-gray-300">
            Email: info@vuecatalog.com<br>
            Phone: (555) 123-4567
          </p>
        </div>
      </div>

      <div class="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ currentYear }} Vue Catalog. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
