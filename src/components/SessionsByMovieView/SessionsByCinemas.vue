<script setup lang="ts">
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { type ISessionsByMovie } from '@/stores/main'
import { useMainStore } from '@/stores/main.ts'

const router = useRouter()

const props = defineProps<{
  session: ISessionsByMovie['sessions'][number]['sessions_by_cinema'][number]
}>()
const store = useMainStore()
const cinema = store.data.cinemas!.get(props.session.cinema_id)!
const handleSessionClick = (session_id: number) => {
  router.push(`/sessions/${session_id}`)
}
</script>

<template>
  <div>{{ cinema.name }}</div>
  <div class="seance-times">
    <button
      v-for="(session, index) in session.sessions"
      :key="index"
      class="simple-button session-button"
      data-testid="view session"
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
</style>
