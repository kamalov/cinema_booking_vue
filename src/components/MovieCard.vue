<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main.ts'
import { type IMovie } from '@/stores/main.ts'

const props = defineProps<{
  movie_or_movie_id: IMovie | number,
  show_details_button?: boolean
}>()

const router = useRouter();
const store = useMainStore()

let movie: IMovie;
if (typeof(props.movie_or_movie_id) === "number") {
  movie = store.data.movies!.get(props.movie_or_movie_id)!
} else {
  movie = props.movie_or_movie_id;
}
const handleMovieClick = () => router.push(`/movies/${movie.id}`)
</script>

<template>
  <div v-if="movie" class="movie">
    <img :src="movie.posterImage" :alt="movie.description" :title="movie.description" />
    <div class="details">
      <div class="title">{{ movie.title }}</div>
      <div>Год: {{ movie.year }}</div>
      <div>Рейтинг IMDB: {{ movie.rating }}</div>
      <div>
        Длительность: {{ Math.trunc(movie.lengthMinutes / 60) }}ч {{ movie.lengthMinutes % 60 }}м
      </div>
      <div class="details-text">{{ movie.description }}</div>
      <button
        v-if="props.show_details_button"
        class="normal-button details-button"
        @click="handleMovieClick"
      >
        Посмотреть сеансы
      </button>
    </div>
  </div>
</template>

<style scoped>
.movie {
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

    .details-text {
      color: var(--dimmed-text-color);
      margin-top: 20px;
    }

    .details-button {
      align-self: end;
      margin-top: auto;
    }
  }
}
</style>
