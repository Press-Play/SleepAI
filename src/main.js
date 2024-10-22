import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './index.css';
import { createWebHistory, createRouter } from 'vue-router'
import { VueFire, VueFireAuth, getCurrentUser } from 'vuefire'
import { getFirebaseApp } from './firebase'

import HomePageView from './pages/HomePage.vue'
import UserAuthView from './pages/UserAuth.vue'
import OnboardingNameView from './pages/OnboardingName.vue'
import OnboardingImportView from './pages/OnboardingImport.vue'
import OnboardingQuestionsView from './pages/OnboardingQuestions.vue'
import OnboardingGoalsView from './pages/OnboardingGoals.vue'
import PillarDurationView from './pages/PillarDuration.vue'
import ForbiddenView from './pages/ForbiddenPage.vue'

const routes = [
  { path: '/', component: HomePageView, meta: { isAnonymous: true } },
  { path: '/auth', component: UserAuthView },
  { path: '/onboarding/name', component: OnboardingNameView, name: 'Start Onboarding' },
  { path: '/onboarding/import', component: OnboardingImportView, meta: { isAnonymous: true } },
  { path: '/onboarding/questions', component: OnboardingQuestionsView, meta: { isAnonymous: true } },
  { path: '/onboarding/goals', component: OnboardingGoalsView, meta: { isAnonymous: true } },
  { path: '/duration', component: PillarDurationView, name: 'Duration', meta: { isAnonymous: true } },
  { path: '/forbidden', component: ForbiddenView, name: 'Forbidden' },
  // TODO: { path: '/:pathMatch(.*)*', component: PathNotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const user = await getCurrentUser()
  if (to.meta.isAnonymous && !user) {
    if (to.path === '/') {
      return { name: 'Start Onboarding'}
    } else {
      return { name: 'Forbidden' }
    }
  }
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
