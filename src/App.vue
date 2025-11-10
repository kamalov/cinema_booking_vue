<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import IconFilm from '@/components/icons/IconFilm.vue'
import { useMainStore } from '@/stores/main.ts'
import { Notifications } from '@kyvg/vue3-notification'

const route = useRoute()
const store = useMainStore()
store.load_initial_data()
</script>

<template>
  <div class="sidebar">
    <IconFilm class="logo" />

    <RouterLink
      to="/movies"
      class="menu-item"
      data-testid="movies router link"
      :class="{ active: route.path.startsWith('/movies') }"
    >
      Фильмы
    </RouterLink>
    <RouterLink
      to="/cinemas"
      class="menu-item"
      :class="{ active: route.path.startsWith('/cinemas') }"
    >
      Кинотеатры
    </RouterLink>
    <RouterLink to="/booking" class="menu-item" active-class="active"> Мои билеты </RouterLink>
    <RouterLink to="/login" class="menu-item" active-class="active" data-testid="login router link">
      {{ store.user_authorized ? 'Выход' : 'Вход' }}
    </RouterLink>
  </div>
  <div class="main-content">
    <RouterView v-if="store.data.movies && store.data.cinemas" />
    <notifications position="top center" :duration="3000" />
  </div>
</template>

<style>
#app {
  display: grid;
  grid-template-columns: minmax(min-content, 250px) minmax(min-content, 1fr);
  grid-template-rows: 100vh;
}

a {
  color: var(--button-background-color);
}

.simple-button {
  font-family: inherit;
  font-size: 15px;
  letter-spacing: 0.1em;
  font-weight: 200;
  text-transform: uppercase;
  padding: 10px 20px;
  background-color: var(--active-color);
  color: var(--text-color);
  cursor: pointer;
  white-space: nowrap;
  border: 0;

  &:active {
    transform: scale(95%);
  }
}

.simple-text-input {
  appearance: none;
  outline: none;
  font-family: inherit;
  font-size: 1.2em;
  font-weight: 400;
  letter-spacing: 0.1em;
  padding: 15px;
  min-width: 250px;
  background-color: var(--panel-color);
  color: var(--text-color);
  border: 2px solid var(--dimmed-text-color);

  &::placeholder {
    color: var(--dimmed-text-color);
  }
}
</style>

<style scoped>
.main-content {
  overflow-y: auto;
}

.sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  background-color: var(--sidebar-color);

  .logo {
    width: 60px;
    margin-bottom: 100px;
  }

  .menu-item {
    margin: 5px;
    padding: 15px 35px;
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: var(--caption-font-weight);
    letter-spacing: 2px;
    color: var(--text-color);
    text-decoration: none;

    &.active {
      background-color: white;
      color: var(--background-color);
    }

    &:hover {
      background-color: white;
      color: var(--background-color);
    }
  }
}
</style>
