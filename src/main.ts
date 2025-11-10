import App from './App.vue'
import './assets/main.css'
import router from './router'
import 'dayjs/locale/ru'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)

app.use(createPinia())
app.use(Notifications)
app.use(router)

app.mount('#app')
