<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="text-2xl font-bold text-primary">
          Vue Catalog
        </router-link>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="nav-link">
            Home
          </router-link>
          <router-link to="/categories" class="nav-link">
            Categories
          </router-link>
          
          <!-- Admin Link -->
          <router-link 
            v-if="isAdmin" 
            to="/admin" 
            class="nav-link"
          >
            Admin
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <span class="text-gray-700">{{ user?.username }}</span>
            <button 
              @click="handleLogout" 
              class="btn-secondary"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-primary">
              Login
            </router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const isAdmin = computed(() => store.getters['auth/isAdmin'])
const user = computed(() => store.getters['auth/currentUser'])

const handleLogout = async () => {
  await store.dispatch('auth/logout')
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-primary transition-colors;
}

.router-link-active {
  @apply text-primary font-semibold;
}
</style>
