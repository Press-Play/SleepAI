import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './index.css';
import { createWebHistory, createRouter } from 'vue-router'
import ProblemsView from './pages/ProblemSelection.vue'
import RecommendationsView from './pages/SleepRecommendation.vue'

const routes = [
  { path: '/', component: ProblemsView },
  { path: '/reco', component: RecommendationsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(router)
  .mount('#app')
