<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main.ts'
import MovieSessions from '@/components/SessionsByMovieView/MovieSessions.vue'
import MovieCard from '@/components/MovieCard.vue'
import CinemaSessions from '@/components/SessionsByCinemaView/CinemaSessions.vue'

const route = useRoute()
const store = useMainStore()
const cinema_id = Number(route.params.cinema_id)
const cinema = store.data.cinemas!.get(cinema_id)!
store.get_sessions_by_cinema(cinema_id)
</script>

<template>
  <div v-if="!store.data.sessions_by_cinema">loading...</div>
  <div v-else class="cinema-sessions">
    <div class="cinema">
      <div class="cinema-name">Кинотеатр {{cinema.name}}</div>
      <div class="cinema-address">{{cinema.address}}</div>
    </div>
    <div class="sessions-grid">
      <CinemaSessions
        v-for="(session, index) in store.data.sessions_by_cinema.sessions"
        :key="index"
        :session="session"
      />
    </div>
    <pre>
      {{store.data.sessions_by_cinema}}
    </pre>
  </div>
</template>

<style scoped>
.cinema-sessions {
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-top: 50px;
  margin-bottom: 50px;

  .cinema {
    margin-top: 20px;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    place-items: center;

    .cinema-name {
      font-size: 1.5em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
  }

  .sessions-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    min-width: 600px;
    max-width: 800px;
  }
}
</style>
