<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main.ts'
import MovieSessions from '@/components/SessionsByMovieView/MovieSessions.vue'
import MovieCard from '@/components/MovieCard.vue'

const route = useRoute()
const store = useMainStore()
const movie_id = Number(route.params.movie_id)
const movie = store.data.movies!.get(movie_id)!
store.get_sessions_by_movie(movie_id)
</script>

<template>
  <div v-if="!store.data.sessions_by_movie">loading...</div>
  <div v-else class="movie-sessions">
    <MovieCard :movie_or_movie_id="movie" class="movie" />
    <div class="sessions-grid">
      <MovieSessions
        v-for="(session, index) in store.data.sessions_by_movie.sessions"
        :key="index"
        :session="session"
      />
    </div>
  </div>
</template>

<style scoped>
.movie {
  margin-top: 50px;
  margin-bottom: 50px;
}

.movie-sessions {
  display: flex;
  flex-direction: column;
  place-items: center;

  .sessions-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    min-width: 600px;
    max-width: 800px;
  }
}
</style>
