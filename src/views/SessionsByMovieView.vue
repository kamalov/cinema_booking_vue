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
    <div class="movie-title">{{ movie.title }}</div>
    <div class="movie-description">
      <img
        class="movie-description-image"
        :src="movie.posterImage"
        :alt="movie.description"
        :title="movie.description"
      />
      <div class="movie-description-text">
        <div>{{ movie.description }}</div>
        <br />
        <div>Год: {{ movie.year }}</div>
        <div>
          Продолжительность: {{ Math.trunc(movie.lengthMinutes / 60) }}ч
          {{ movie.lengthMinutes % 60 }}м
        </div>
        <div>Рейтинг: {{ movie.rating }}</div>
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
  gap: 20px;
  justify-items: center;
  max-width: 800px;

  .movie-title {
    font-size: 2em;
  }

  .movie-description {
    display: flex;
    gap: 20px;

    .movie-description-text {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }

  .seances-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 10px;
    align-items: center;

    /*
    .seances-grid-row {
      display: contents;

      .seances-divider {
        grid-column: 1 / -1;
        justify-self: stretch;
        height: 1px;
        background-color: black;
      }

      .first {
        margin-top: 50px;
      }

      .seance-times {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
    }
    */
  }
}
</style>
