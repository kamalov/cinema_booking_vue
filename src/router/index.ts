import { createRouter, createWebHistory } from 'vue-router'
import MoviesView from '@/views/MoviesView.vue'
import CinemasView from '@/views/CinemasView.vue'
import BookingView from '@/views/BookingView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/movies'
    },    {
      path: '/movies',
      name: 'movies',
      component: MoviesView,
    },
    {
      path: '/cinemas',
      name: 'cinemas',
      component: CinemasView,
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
