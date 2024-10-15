<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="flex flex-col flex-wrap content-center">
      <div class="px-12">
        <h2>Hi there, what's your name?</h2>
        <p>Let's get to know each other 😄</p>
      </div>
      <div class="relative mt-6 mb-2 rounded-md shadow-sm max-w-md">
        <input type="text" name="name" v-model="name" @blur="validateName" v-on:input="validateName" class="w-full" placeholder="Name"/>
      </div>
      <button @click="goToNext()" :disabled="error || name === '' || loading" class="inline-flex items-center place-content-center">
        <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else>Next →</span>
      </button>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getAuth, signInAnonymously, updateProfile } from "firebase/auth";
import { getCurrentUser } from 'vuefire'
import User from '@/models/user'

export default {
  name: 'OnboardingName',
  data() {
    return {
      // TODO: Move to component and pull name from logged in user (if exists).
      error: false,
      loading: false,
      user: undefined,
      name: undefined,
    }
  },
  beforeMount() {
    getCurrentUser().then(user => {
      this.user = user
      this.name = user.displayName
      //------------
      const userModel = new User(user.uid)
      console.log('userModel:', userModel)
      console.log('userModel.name:', userModel.name)
      console.log('userModel.id:', userModel.id)
      //------------
    })
  },
  methods: {
    validateName() {
      // TODO: Field validation for name.
    },
    async updateName(user, name) {
      // Update name to user auth object.
      const result = await updateProfile(user, {
        displayName: name
      })
      return result
    },
    async goToNext() {
      this.loading = true
      const auth = getAuth()
      const db = getFirestore()

      // See if a current user is logged in, otherwise create anon user.
      let user = await getCurrentUser()

      if (!user) {
        console.log('No user is logged in, creating one')
        signInAnonymously(auth)
          .then((result) => {
            user = result.user
            console.log('result:', result)
            // Save user to Firestore users collection.
            return setDoc(doc(db, 'users', user.uid), {})
          })
          .then(() => {
            return this.updateName(user, this.name)
          })
          .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log('errorCode:', errorCode)
            console.log('errorMessage:', errorMessage)
          });
      } else {
        console.log('user:', user)
        console.log('user.uid:', user.uid)
        await this.updateName(user, this.name)
      }
      console.log('name:', this.name)

      // Go to next onboarding page.
      this.$router.push('/onboarding/import')
      this.loading = false
    }
  },
}
</script>