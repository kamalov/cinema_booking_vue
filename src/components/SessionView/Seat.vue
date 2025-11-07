<script setup lang="ts">
// import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main.ts'
import { computed } from 'vue'
// import { type IMovie } from '@/stores/main.ts'
//
const props = defineProps<{
  row_number: number
  seat_number: number
}>()
//
// const router = useRouter();
const store = useMainStore()

const make_key = () => {
  return JSON.stringify({
    rowNumber: props.row_number,
    seatNumber: props.seat_number,
  })
}

const is_selected = computed(() => {
  return store.data.session_info!.selected_seats.has(make_key())
})

const is_booked = computed(() => {
  return store.data.session_info!.booked_seats.has(make_key())
})

const handleSeatClick = () => {
  const key = make_key()
  const seats = store.data.session_info!.selected_seats
  if (seats.has(key)) {
    seats.delete(key)
  } else {
    seats.add(key)
  }
}
</script>

<template>
  <div :class="{ seat: true, selected: is_selected, booked: is_booked }" @click="handleSeatClick"
  :title="`Ряд ${row_number}, место ${seat_number}`"/>
</template>

<style scoped>
.seat {
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid var(--dimmed-text-color);

  &.selected {
    background-color: var(--active-color);
    border: none;
  }

  &.booked {
    pointer-events: none;
    cursor: not-allowed;
    background-color: var(--dimmed-text-color);
    border: none;
  }
}
</style>
