import { createRouter, createWebHistory } from 'vue-router'
import MoviesView from '@/views/MoviesView.vue'
import CinemasView from '@/views/CinemasView.vue'
import BookingView from '@/views/BookingView.vue'
import LoginView from '@/views/LoginView.vue'
import SessionsByMovieView from '@/views/SessionsByMovieView.vue'

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
      path: '/movies/:movieId',
      props: true,
      component: SessionsByMovieView
    },
    {
      path: '/cinemas',
      component: CinemasView,
    },
    {
      path: '/booking',
      component: BookingView,
    },
    {
      path: '/login',
      component: LoginView,
    },
  ],
})

export default router
