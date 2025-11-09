<script setup lang="ts">
import { useMainStore } from '@/stores/main.ts'
import { ref, onMounted, nextTick } from 'vue'

const store = useMainStore()

const username_input_ref = ref<any>(null)
const is_password_valid = ref(true)

onMounted(() => {
  nextTick(() => {
    username_input_ref?.value?.focus()
  })
})

const username = ref('')
const password = ref('')

function handle_username_input(event: InputEvent) {
  const value = (event.target as HTMLInputElement).value
  username.value = value
}

function handle_password_input(event: InputEvent) {
  const value = (event.target as HTMLInputElement).value
  const has_capital_letter = /[\p{Lu}]/u.test(value);
  const has_number = /\d/.test(value);
  const is_valid = value.length >= 8 && has_capital_letter && has_number
  is_password_valid.value = value.length === 0 || is_valid
  password.value = value
}

function handle_submit() {
  store.login_user(username.value, password.value)
}
</script>

<template>
  <div v-if="!store.user_authorized" class="login-view">
    <form class="login-form" @submit.prevent="handle_submit">
      <input
        type="text"
        class="simple-text-input"
        ref="username_input_ref"
        autofocus
        :value="username"
        @input="handle_username_input"
        autocomplete="username"
        placeholder="ЛОГИН"
      />
      <div class="validation-text"></div>
        <input
          type="password"
          class="simple-text-input login-text-input"
          :class="{is_valid: password.length > 0 && is_password_valid}"
          :value="password"
          @input="handle_password_input"
          autocomplete="current-password"
          placeholder="ПАРОЛЬ"
        />
        <div class="validation-text">
          <span v-show="!is_password_valid">
            Минимум 8 символов<br>
            Минимум 1 заглавная буква и 1 цифра
          </span>
        </div>

      <button type="submit" class="simple-button login-button">Войти</button>

      <div class="or-text">или</div>
      <div class="switch-mode">зарегистрироваться</div>
    </form>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-top: 80px;
  margin-bottom: 50px;

  .login-form {
    display: flex;
    flex-direction: column;
    place-items: center;
  }

  .login-text-input {
    display: block;

    &.is_valid {
      border-color: var(--active-color);
    }
  }

  .validation-text {
    align-self: start;
    white-space: pre;
    max-width: 1px;
    color: var(--dimmed-text-color);
    min-height: 50px;
    margin-top: 5px;
  }

  .login-button {
    margin-top: 20px;
    font-size: 1.4em;
    min-width: 120px;
  }

  .or-text {
    margin-top: 20px;
    margin-bottom: 20px;
    color: var(--dimmed-text-color);
  }

  .switch-mode {
    text-transform: uppercase;
    color: var(--active-color);
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
