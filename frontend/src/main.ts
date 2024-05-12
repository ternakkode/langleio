import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { connectToWeb3Modal } from './service/web3modal'

connectToWeb3Modal()

const app = createApp(App)

app.use(router)
app.mount('#app')
