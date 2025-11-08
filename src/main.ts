import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import i18n from './i18n'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { logMockModeStatus } from './middleware/mock'

// Log mock mode status
logMockModeStatus()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Antd)

app.mount('#app')
