<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main.ts'

const router = useRouter()
const store = useMainStore()

// if (store.user_authorized) {
//   store.logout()
// }

const username_input_ref = ref<any>(null)
const mode = ref('register')
const username = ref('')
const password = ref('')
const is_password_valid = ref(true)
const password_confirmation = ref('')
const is_login_valid = computed(() => username.value.length >= 8)
const show_password_confirmation_validation = computed(
  () =>
    password.value.length > 0 &&
    password_confirmation.value.length > 0 &&
    is_password_valid.value &&
    password.value !== password_confirmation.value,
)

onMounted(() => {
  nextTick(() => {
    username_input_ref?.value?.focus()
  })
})

function handle_username_input(event: InputEvent) {
  const value = (event.target as HTMLInputElement).value
  username.value = value
}

function handle_password_input(event: InputEvent) {
  const value = (event.target as HTMLInputElement).value
  const has_capital_letter = /[\p{Lu}]/u.test(value)
  const has_number = /\d/.test(value)
  const is_valid = value.length >= 8 && has_capital_letter && has_number
  is_password_valid.value = is_valid
  password.value = value
}

async function handle_submit_login() {
  await store.login_user(username.value, password.value)
  if (store.user_authorized) {
    void router.push('/movies')
  }
}

async function handle_submit_register() {
  if (
    is_login_valid.value &&
    is_password_valid.value &&
    password.value === password_confirmation.value
  ) {
    await store.register_new_user(username.value, password.value)
    if (store.user_authorized) {
      void router.push('/movies')
    }
  }
}

function switch_mode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
}

function logout() {
  store.logout()
}
</script>

<template>
  <div v-if="store.user_authorized" class="logout-view">
    <button class="simple-button" @click="logout">Выйти</button>
  </div>

  <div v-if="!store.user_authorized" class="login-view">
    <form v-if="mode === 'login'" class="login-form" @submit.prevent="handle_submit_login">
      <input
        type="text"
        class="simple-text-input"
        ref="username_input_ref"
        autofocus
        :value="username"
        @input="handle_username_input"
        autocomplete="username"
        placeholder="Логин"
      />
      <div class="validation-text"></div>

      <input
        type="password"
        class="simple-text-input login-text-input"
        :value="password"
        @input="handle_password_input"
        autocomplete="current-password"
        placeholder="Пароль"
      />
      <div class="validation-text"></div>

      <button type="submit" class="simple-button login-button">Войти</button>

      <div class="or-text">или</div>
      <div class="switch-mode" @click="switch_mode">зарегистрироваться</div>
    </form>

    <form v-else class="login-form" @submit.prevent="handle_submit_register">
      <input
        type="text"
        class="simple-text-input"
        ref="username_input_ref"
        autocomplete="username"
        placeholder="Логин"
        :value="username"
        :class="{ is_valid: username.length >= 8 }"
        @input="handle_username_input"
      />
      <div class="validation-text">
        <span v-show="username.length > 0 && username.length < 8"> Минимум 8 символов </span>
      </div>

      <input
        type="password"
        class="simple-text-input login-text-input"
        autocomplete="current-password"
        placeholder="Пароль"
        :class="{ is_valid: password.length > 0 && is_password_valid }"
        :value="password"
        @input="handle_password_input"
      />
      <div class="validation-text">
        <span v-show="password.length > 0 && !is_password_valid">
          Минимум 8 символов<br />
          Минимум 1 заглавная буква и 1 цифра
        </span>
      </div>

      <input
        type="password"
        class="simple-text-input login-text-input"
        :class="{ is_valid: password.length > 0 && password === password_confirmation }"
        v-model="password_confirmation"
        autocomplete="new-password"
        placeholder="Пароль ещё раз"
      />
      <div class="validation-text">
        <span v-show="show_password_confirmation_validation">Должен совпадать с паролем</span>
      </div>

      <button type="submit" class="simple-button login-button">Зарегистрироваться</button>

      <div class="or-text">или</div>
      <div class="switch-mode" @click="switch_mode">войти</div>
    </form>
  </div>
</template>

<style scoped>
.logout-view {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  margin-bottom: 50px;

  .login-form {
    display: flex;
    flex-direction: column;
    place-items: center;
  }

  .simple-text-input {
    &::placeholder {
      text-transform: uppercase;
    }

    &.is_valid {
      border-color: var(--active-color);
    }
  }

  .login-text-input {
    display: block;

    &::placeholder {
      text-transform: uppercase;
    }

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
    font-size: 1.2em;
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
