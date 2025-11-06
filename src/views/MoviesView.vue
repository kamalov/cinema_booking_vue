<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main.ts'

const router = useRouter()
const store = useMainStore()

function handleMovieClick(movie_id: number) {
  router.push(`/movies/${movie_id}`)
}
</script>

<template>
  <div v-if="!store.data.movies">loading...</div>
  <div v-else class="movies">
    <div v-for="[key, movie] in store.data.movies!" :key="key" class="movie">
      <img :src="movie.posterImage" :alt="movie.description" :title="movie.description" />
      <div class="details">
        <div class="title">{{ movie.title }}</div>
        <div>
          Длительность: {{ Math.trunc(movie.lengthMinutes / 60) }}ч {{ movie.lengthMinutes % 60 }}м
        </div>
        <div>Рейтинг IMDB: {{ movie.rating }}</div>
        <div class="description">{{ movie.description }}</div>
        <div class="show-details">
          <button class="main-button" @click="handleMovieClick(movie.id)">Посмотреть сеансы</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movies {
  display: flex;
  flex-direction: column;
  place-items: center;

  .movie {
    margin-top: 50px;
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
}
</style>
