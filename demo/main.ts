import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import DragToDrop from '../src/index'

const app = createApp(App)
app.use(DragToDrop)
app.mount('#app')
