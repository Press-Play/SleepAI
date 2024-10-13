import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './index.css';
import { createWebHistory, createRouter } from 'vue-router'
import { VueFire, VueFireAuth, getCurrentUser } from 'vuefire'
import { getFirebaseApp } from './firebase'

import ProblemsView from './pages/ProblemSelection.vue'
import RecommendationsView from './pages/SleepRecommendation.vue'
import UserAuthView from './pages/UserAuth.vue'
import OnboardingNameView from './pages/OnboardingName.vue'
import FitbitAuthView from './pages/FitbitAuthentication.vue'
import ForbiddenView from './pages/ForbiddenPage.vue'

const routes = [
  { path: '/onboarding/questions', component: ProblemsView },
  { path: '/', component: RecommendationsView },
  { path: '/auth', component: UserAuthView},
  { path: '/onboarding/name', component: OnboardingNameView },
  { path: '/onboarding/import', component: FitbitAuthView, meta: { isAnonymous: true } },
  { path: '/forbidden', component: ForbiddenView, name: 'Forbidden' },
  // TODO: { path: '/:pathMatch(.*)*', component: PathNotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  const user = await getCurrentUser()
  console.log('user:', user)
  if (to.meta.isAnonymous && !user) {
    return { name: 'Forbidden' }
  }
  console.log('to:', to)
  console.log('from:', from)
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
