import { createRouter, createWebHistory } from 'vue-router'
import MoviesView from '@/views/MoviesView.vue'
import CinemasView from '@/views/CinemasView.vue'
import MyBookingsView from '@/views/MyBookingsView.vue'
import LoginView from '@/views/LoginView.vue'
import SessionsByMovieView from '@/views/SessionsByMovieView.vue'
import SessionView from '@/views/SessionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/movies'
    },
    {
      path: '/movies',
      component: MoviesView,
    },
    {
      path: '/movies/:movie_id',
      component: SessionsByMovieView
    },
    {
      path: '/sessions/:session_id',
      component: SessionView
    },
    {
      path: '/cinemas',
      component: CinemasView,
    },
    {
      path: '/booking',
      component: MyBookingsView,
    },
    {
      path: '/login',
      component: LoginView,
    },
  ],
})

export default router
