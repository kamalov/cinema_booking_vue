<script setup lang="ts">
import Booking from '@/components/MyBookingsView/Booking.vue'
import { type IBooking } from '@/stores/main.ts'

const props = defineProps<{
  kind: string
  bookings: IBooking[]
}>()
</script>

<template>
  <div class="booking-kind">{{ props.kind }}</div>
  <div class="bookings-subgrid">
    <Booking v-for="booking in props.bookings" :key="booking.id" :booking="booking" />
  </div>
</template>

<style scoped>
.booking-kind {
  grid-column: 1 / -1;
  font-size: 1.4em;
  letter-spacing: 1px;
  margin: 40px 20px 10px;
}

.bookings-subgrid {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  margin-bottom: 20px;
  padding: 20px;
  gap: 40px;
  background-color: var(--panel-color);
}
</style>
