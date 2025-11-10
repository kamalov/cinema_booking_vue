<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main.ts'

const router = useRouter()
const store = useMainStore()

function goto_cinema(cinema_id: number) {
  router.push(`/cinemas/${cinema_id}`)
}
</script>

<template>
  <div class="cinemas">
    <div class="cinemas-grid">
      <div v-for="[key, cinema] in store.data.cinemas!" :key="key" class="cinemas-grid-row">
        <div>{{ cinema.name }}</div>
        <div>{{ cinema.address }}</div>
        <div>
          <button class="simple-button" @click="goto_cinema(cinema.id)">Сеансы</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cinemas {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 50px;

  .cinemas-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr auto;
    min-width: 600px;
    max-width: 900px;

    .cinemas-grid-row {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
      align-items: center;
      padding: 20px;
      margin: 20px;
      gap: 30px;
      font-size: 1.2em;
      background-color: var(--panel-color);
    }
  }
}
</style>
