<script setup lang="ts">
import dayjs from 'dayjs'
import { partition } from 'lodash'
import { onUnmounted, provide, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import Bookings from '@/components/MyBookingsView/Bookings.vue'
import { type IBooking, useMainStore } from '@/stores/main.ts'

const router = useRouter()
const store = useMainStore()

if (!store.user_authorized) {
  router.push('/login')
} else {
  store.get_my_bookings()
}

let unpaid_bookings: IBooking[] = []
let future_bookings: IBooking[] = []
let past_bookings: IBooking[] = []

let interval_id: number | undefined
const timer_counter = ref(0)
provide('timer_counter', timer_counter)

function clear_interval() {
  if (interval_id) {
    clearInterval(interval_id)
    interval_id = undefined
  }
}

watchEffect(() => {
  clear_interval()

  let paid_bookings: IBooking[]
  ;[paid_bookings, unpaid_bookings] = partition(store.data.my_bookings, { isPaid: true })
  ;[future_bookings, past_bookings] = partition(paid_bookings, (booking) =>
    dayjs().isBefore(booking.session_start_time),
  )

  if (unpaid_bookings.length > 0) {
    interval_id = setInterval(() => {
      timer_counter.value++
    }, 1000)
  }
})

onUnmounted(() => {
  clear_interval()
})
</script>

<template>
  <div v-if="store.data.my_bookings?.length" class="bookings">
    <div class="bookings-grid">
      <Bookings v-if="unpaid_bookings.length" :bookings="unpaid_bookings" kind="Неоплаченные" />
      <Bookings v-if="future_bookings.length" :bookings="future_bookings" kind="Будущие" />
      <Bookings v-if="past_bookings.length" :bookings="past_bookings" kind="Прошедшие" />
    </div>
  </div>
  <div v-else class="empty-bookings">Нет бронирований</div>
</template>

<style scoped>
.empty-bookings {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bookings {
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-top: 20px;
  margin-bottom: 40px;

  .bookings-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr auto;
    min-width: 800px;
    max-width: 800px;
  }
}
</style>
