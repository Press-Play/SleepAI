<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <h1>Log in with your Google Account</h1>
    <div>
      <button v-if="!user" @click="googleSignIn()">Sign In</button>
      <button v-else @click="googleSignOut()">Log Out</button>
    </div>
  </div>
  <p v-if="user">Logged in as {{ user.displayName }}</p>
</template>

<script setup>
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'
import { useCurrentUser } from 'vuefire'
const user = useCurrentUser()
</script>

<script>
export default {
  name: 'UserAuth',
  data() {
    return {
    }
  },
  beforeMount() {
  },
  methods: {
    googleSignIn() {
      const auth = getAuth()
      signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
          let token = result.credential.accessToken;
          let user = result.user;
          console.log(token) // Token
          console.log(user) // User that was authenticated
        })
        .catch((reason) => {
          console.error('Failed signInWithPopup', reason)
        })
    },
    googleSignOut() {
      const auth = getAuth()
      signOut(auth)
    },
  },
}
</script>