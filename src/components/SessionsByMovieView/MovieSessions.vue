<script setup lang="ts">
import dayjs from 'dayjs'
import { type ISessionsByMovie } from '@/stores/main'
import SessionsByCinemas from '@/components/SessionsByMovieView/SessionsByCinemas.vue'

defineProps<{ session: ISessionsByMovie['sessions'][number] }>()
</script>

<template>
  <div class="first">
    {{ dayjs(session.date).locale('ru').format('D MMMM') }}
  </div>
  <div></div>

  <SessionsByCinemas
    v-for="(session, index) in session.sessions_by_cinema"
    v-bind:key="index"
    :session="session"
  />
</template>

<style scoped>
.first {
  margin-top: 50px;
}
</style>
