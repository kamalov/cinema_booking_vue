<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMainStore } from '@/stores/main.ts'
const store = useMainStore()
store.get_movies()
</script>

<template>
  <div class="sidebar">
    <img class="logo" src="@/assets/film_white.svg" width="60" height="60" alt="film" />

    <RouterLink to="/movies" class="menu-item" active-class="active">
      Фильмы
    </RouterLink>
    <RouterLink to="/cinemas" class="menu-item" active-class="active">
      Кинотеатры
    </RouterLink>
    <RouterLink to="/booking" class="menu-item" active-class="active">
      Мои билеты
    </RouterLink>
    <RouterLink to="/login" class="menu-item" active-class="active">
      Вход
    </RouterLink>
  </div>
  <div class="main-content">
    <RouterView />
  </div>
</template>

<style>
.main-button {
  font-family: inherit;
  font-size: 15px;
  letter-spacing: 0.5px;
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
