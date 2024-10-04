import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './index.css';
import { createWebHistory, createRouter } from 'vue-router'
import ProblemsView from './pages/ProblemSelection.vue'

const routes = [
  { path: '/', component: ProblemsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(router)
  .mount('#app')
