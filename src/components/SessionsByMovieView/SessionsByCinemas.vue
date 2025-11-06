<script setup lang="ts">
import {type ISessionsByMovie} from '@/stores/main'
import { useMainStore } from '@/stores/main.ts'

const props = defineProps<{ session: ISessionsByMovie["sessions"][number]["sessions_by_cinema"][number] }>()
const store = useMainStore()
const cinema = store.data.cinemas!.get(props.session.cinema_id)!;
</script>

<template>
  <div>{{ cinema.name }}</div>
  <div class="seance-times">
    <button v-for="(session, index) in session.sessions" :key="index" class="main-button">12:12</button>
  </div>
</template>

<style scoped>
  .seance-times {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
</style>
