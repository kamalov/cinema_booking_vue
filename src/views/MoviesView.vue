<script setup lang="ts">
import MovieCard from '@/components/MovieCard.vue'
import { useMainStore } from '@/stores/main.ts'

const store = useMainStore()
</script>

<template>
  <div class="movies">
    <MovieCard
      v-for="[key, movie] in store.data.movies!"
      :key="key"
      :movie_or_movie_id="movie"
      :show_details_button="true"
    />
  </div>
</template>

<style scoped>
.movies {
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-top: 50px;
  margin-bottom: 50px;
  gap: 50px;
}
</style>
