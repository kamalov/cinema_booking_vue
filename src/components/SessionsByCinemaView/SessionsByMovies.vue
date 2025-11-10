<script setup lang="ts">
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { type ISessionsByCinema } from '@/stores/main'
import { useMainStore } from '@/stores/main.ts'

const router = useRouter()

const props = defineProps<{
  session: ISessionsByCinema['sessions'][number]['sessions_by_movie'][number]
}>()
const store = useMainStore()
const movie = store.data.movies!.get(props.session.movie_id)!
const handleSessionClick = (session_id: number) => {
  router.push(`/sessions/${session_id}`)
}
</script>

<template>
  <div class="movie">
    <img class="movie-image" :src="movie.posterImage" :alt="movie.description" :title="movie.description" />
    {{ movie.title }}
  </div>
  <div class="seance-times">
    <button
      v-for="(session, index) in session.sessions"
      :key="index"
      class="simple-button session-button"
      @click="handleSessionClick(session.id)"
    >
      {{ dayjs(session.startTime).format('H:mm') }}
    </button>
  </div>
</template>

<style scoped>
.session-button {
  border-radius: 5px;
  padding: 5px 10px;
  min-width: 60px;
}

.seance-times {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: end;
}

.movie {
  display: flex;
  align-items: center;
  .movie-image {
    max-height: 50px;
    margin-right: 10px;
  }
}
</style>
