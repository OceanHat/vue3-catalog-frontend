import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      title: 'Home - Vue Catalog'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    beforeEnter: guestGuard,
    meta: {
      title: 'Login - Vue Catalog'
    }
  },
  {
    path: '/categories',
    name: 'CategoryList',
    component: () => import('@/views/CategoryListPage.vue'),
    meta: {
      title: 'Categories - Vue Catalog'
    }
  },
  {
    path: '/categories/:slug',
    name: 'CategoryDetail',
    component: () => import('@/views/CategoryDetailPage.vue'),
    meta: {
      title: 'Category - Vue Catalog'
    }
  },
  {
    path: '/items/:slug',
    name: 'ItemDetail',
    component: () => import('@/views/ItemDetailPage.vue'),
    meta: {
      title: 'Item - Vue Catalog'
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    beforeEnter: authGuard,
    meta: {
      title: 'Admin Dashboard - Vue Catalog',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: {
      title: '404 - Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title || 'Vue Catalog'
  next()
})

export default router
