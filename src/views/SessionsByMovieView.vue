<script setup lang="ts">
import { useRoute } from 'vue-router'
import { type IMovie, useMainStore } from '@/stores/main.ts'
import MovieSessions from '@/components/SessionsByMovieView/MovieSessions.vue'
import { onMounted, watch, watchEffect } from 'vue'

// defineProps<{ movieId: string }>()
const route = useRoute()
const store = useMainStore()
const movie_id = Number(route.params.movieId);

const movie = store.data.movies!.get(movie_id)!;
store.get_sessions_by_movie(movie_id)
</script>

<template>
  <div v-if="!store.data.sessions_by_movie">
    loading...
  </div>
  <div v-else class="movie-sessions">
    <div class="movie">
      <img :src="movie.posterImage" :alt="movie.description" :title="movie.description" />
      <div class="details">
        <div class="title">{{ movie.title }}</div>
        <div>Год: {{ movie.year }}</div>
        <div>
          Длительность: {{ Math.trunc(movie.lengthMinutes / 60) }}ч {{ movie.lengthMinutes % 60 }}м
        </div>
        <div>Рейтинг IMDB: {{ movie.rating }}</div>
        <div class="description">{{ movie.description }}</div>
      </div>
    </div>

    <div class="seances-grid">
      <MovieSessions
        v-for="(session, index) in store.data.sessions_by_movie.sessions"
        v-bind:key="index"
        :session="session"
      />
    </div>
  </div>
</template>

<style scoped>
.movie-sessions {
  display: flex;
  flex-direction: column;
  place-items: center;

  .movie {
    margin-top: 50px;
    margin-bottom: 50px;
    padding: 20px;
    min-width: 600px;
    max-width: 800px;
    display: grid;
    grid-template-columns: auto 1fr;
    background-color: var(--panel-color);

    .details {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin: 0 10px 10px 20px;
      color: var(--dimmed-text-color);

      .title {
        font-size: 1.6em;
        color: var(--text-color);
        letter-spacing: 1px;
      }

      .description {
        color: var(--dimmed-text-color);
        margin-top: 20px;
      }

      .show-details {
        align-self: end;
        margin-top: auto;
      }
    }
  }

  .seances-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    min-width: 600px;
    max-width: 800px;
  }
}
</style>
