<script setup lang="ts">
import { useMainStore } from '@/stores/main.ts'

const store = useMainStore()
store.get_bookings()
</script>

<template>
  <div class="about">
    <pre>
      authorized: {{store.user_authorized}}
    </pre>
    <pre>
      {{store.data.bookings}}
    </pre>
  </div>
</template>

<style scoped>
</style>
