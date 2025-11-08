<script setup lang="ts">
import dayjs from 'dayjs'
import { watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type ICinema, useMainStore } from '@/stores/main.ts'
import MovieCard from '@/components/MovieCard.vue'
import Seat from '@/components/SessionView/Seat.vue'

const router = useRouter();
const route = useRoute()
const store = useMainStore()

const session_id = Number(route.params.session_id)

store.get_session_info(session_id)

let row_count = 0
let seat_count = 0
let seat_size = 0
let cinema: ICinema;

watchEffect(() => {
  row_count = store.data.session_info?.seats.rows ?? 0
  seat_count = store.data.session_info?.seats.seatsPerRow ?? 0
  seat_size = Math.min(Math.floor(600 / seat_count), 40)

  let cinemaId = store.data.session_info?.cinemaId;
  if (cinemaId !== undefined) {
    cinema = store.data.cinemas!.get(cinemaId)!
  }
})

const handleBook = async () => {
  await store.book_selected_seats();
  router.push(`/booking`)
}
</script>

<template>
  <div v-if="store.data.session_info" class="session">
    <MovieCard :movie_or_movie_id="store.data.session_info.movieId" />

    <div
      class="seats-grid"
      :style="{
        gridTemplateColumns: `auto repeat(${seat_count}, ${seat_size}px)`,
        gridTemplateRows: `auto auto repeat(${row_count}, ${seat_size}px) auto`,
      }"
    >
      <div class="cinema-info">
        <div>{{cinema.address}}</div>
        <div>{{ dayjs(store.data.session_info?.startTime).locale('ru').format('HH:mm, D MMMM') }}</div>
      </div>

      <div class="seats-row">
        <div></div>
        <div v-for="seat_number in seat_count" :key="seat_number" class="seat-number">
          {{ seat_number }}
        </div>
      </div>
      <div v-for="row_number in row_count" :key="row_number" class="seats-row">
        <div class="row-number">Ряд {{ row_number }}</div>
        <Seat
          v-for="seat_number in seat_count"
          :key="seat_number"
          :row_number="row_number"
          :seat_number="seat_number"
        />
      </div>

      <button class="normal-button book-button" :class="{ visible: store.data.session_info?.selected_seats.size}" @click="handleBook">Забронировать</button>
    </div>
  </div>
</template>

<style scoped>
.session {
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-top: 50px;

  .seats-grid {
    display: grid;
    gap: 4px;
    align-items: stretch;
    justify-items: stretch;
    margin-bottom: 30px;

    .seats-row {
      display: contents;
    }

    .seat-number {
      place-self: center;
      margin-bottom: 5px;
      font-size: 0.8em;
    }

    .row-number {
      align-self: center;
      justify-self: left;
      margin-right: 10px;
      white-space: nowrap;
      font-size: 0.8em;
    }

    .cinema-info {
      grid-column: 2 / -1;
      place-self: center;
      display: flex;
      flex-direction: column;
      place-items: center;
      font-size: 1.2em;
      line-height: 1.5em;
      margin-top: 70px;
      margin-bottom: 30px;
    }

    .book-button {
      grid-column: 2 / -1;
      place-self: center;
      margin-top: 30px;
      visibility: hidden;

      &.visible {
        visibility: visible;
      }
    }
  }
}
</style>
