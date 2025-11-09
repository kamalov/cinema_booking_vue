<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useRouter } from 'vue-router'
import { type IBooking, useMainStore } from '@/stores/main.ts'
import { inject, ref, watch } from 'vue'

const props = defineProps<{
  booking: IBooking
}>()

dayjs.extend(duration)

const router = useRouter()
const store = useMainStore()

const session = store.data.sessions!.get(props.booking.movieSessionId)!
const movie = store.data.movies!.get(session.movieId!)!
const cinema = store.data.cinemas!.get(session.cinemaId!)!

const timer_counter = inject('timer_counter')

let allowed_diff_ms: number
let diff_since_booking_ms: number
let remaining_ms: number
let remaining_diff_str = ref('')
let can_pay = !props.booking.isPaid

if (can_pay) {
  watch(
    [timer_counter],
    () => {
      allowed_diff_ms = store.data.settings!.bookingPaymentTimeSeconds * 1000
      diff_since_booking_ms = dayjs().diff(props.booking.bookedAt)
      remaining_ms = allowed_diff_ms - diff_since_booking_ms
      if (remaining_ms < 0) {
        store.get_my_bookings()
      }
      remaining_diff_str.value = dayjs.duration(remaining_ms).locale('ru').format('HH:mm:ss')
    },
    { immediate: true },
  )
}

function handleBookingClick() {
  router.push(`/sessions/${session.id}`)
}

function pay_for_booking(booking_id: string) {
  store.pay_for_booking(booking_id)
}
</script>

<template>
  <div class="booking-subgrid" @click="handleBookingClick">
    <div class="details">
      <div>{{ movie.title }}</div>
      <div>{{ cinema.name }}</div>
      <div>{{ dayjs(session.startTime).locale('ru').format('D MMMM, HH:mm') }}</div>
    </div>

    <div>
      <div v-for="(seat, index) in props.booking.seats" :key="index">
        Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
      </div>
    </div>

    <div class="book-button">
      <button v-if="can_pay" class="simple-button" @click.stop="pay_for_booking(props.booking.id)">
        Оплатить
      </button>
    </div>

    <div class="timer">
      <div v-if="can_pay">{{ remaining_diff_str }}</div>
    </div>
  </div>
</template>

<style scoped>
.booking-subgrid {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
  cursor: pointer;

  .details {
    font-size: 1.2em;
    letter-spacing: 1px;
    justify-self: start;
  }

  .book-button {
    place-self: center;
  }

  .timer {
    place-self: center;
    min-width: 70px;
  }
}
</style>
