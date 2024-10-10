import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './index.css';
import { createWebHistory, createRouter } from 'vue-router'
import { VueFire, VueFireAuth } from 'vuefire'
import { getFirebaseApp } from './firebase'

import ProblemsView from './pages/ProblemSelection.vue'
import RecommendationsView from './pages/SleepRecommendation.vue'
import FitbitAuthView from './pages/FitbitAuthentication.vue'
import UserAuthView from './pages/UserAuth.vue'
import OnboardingNameView from './pages/OnboardingName.vue'

const routes = [
  { path: '/', component: ProblemsView },
  { path: '/reco', component: RecommendationsView },
  { path: '/app', component: FitbitAuthView },
  { path: '/auth', component: UserAuthView },
  { path: '/onboarding/name', component: OnboardingNameView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const { firebaseApp } = getFirebaseApp()

createApp(App)
  .use(router)
  .use(VueFire, {
    firebaseApp,
    modules: [
      VueFireAuth()
    ]
  })
  .mount('#app')
