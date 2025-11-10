<script setup lang="ts">
import dayjs from 'dayjs'
import SessionsByMovies from '@/components/SessionsByCinemaView/SessionsByMovies.vue'
import { type ISessionsByCinema } from '@/stores/main'

defineProps<{ session: ISessionsByCinema['sessions'][number] }>()
</script>

<template>
  <div class="title">
    {{ dayjs(session.date).locale('ru').format('D MMMM') }}
  </div>

  <div class="sessions">
    <SessionsByMovies
      v-for="(session, index) in session.sessions_by_movie"
      v-bind:key="index"
      :session="session"
    />
  </div>
</template>

<style scoped>
.title {
  grid-column: span 2;
  margin-left: 20px;
  margin-bottom: 10px;
  font-size: 1.2em;
  letter-spacing: 1px;
}

.sessions {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  margin-bottom: 50px;
  padding: 20px;
  gap: 10px;
  align-items: center;
  background-color: var(--panel-color);
}
</style>
