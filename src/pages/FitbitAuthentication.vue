<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="flex flex-col flex-wrap content-center">
      <button @click="authFitbitRequest()">Auth Fitbit</button>
      <button @click="getSleepData('2024-09-30', '2024-10-06')">Get sleep data</button>
      <ul class="mt-5 px-4">
        <li v-for ="s in sleepData" :key="s">
          {{ s.dateOfSleep }}: Time in bed {{ minutesToHours(s.timeInBed) }}. Asleep for {{ minutesToHours(s.minutesAsleep) }}. Efficiency {{ calculateSleepEfficiency(s.minutesAsleep, s.timeInBed) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import FetchWrapper from '../api.js'

  export default {
  name: 'FitbitAuthentication',
  data() {
    return {
      CLIENT_ID: '23PTNG',
      codeVerifier: undefined,
      authCode: undefined,
      sleepData: [],
    }
  },
  beforeMount() {
    this.authFitbitResponse()
  },
  methods: {   
    getCodeVerifier(size = 64) {
      const randomArray = crypto.getRandomValues(new Uint8Array(size));
      return Array.from(randomArray, (dec) => dec.toString(36)
        .padStart(2, '0')).join('');
    },
    getCodeChallenge(codeVerifier) {
      const codeVerifierArray = new TextEncoder().encode(codeVerifier);
      return crypto.subtle.digest('SHA-256', codeVerifierArray)
        .then((hash) => {
          const hashArray = new Uint8Array(hash);
          const hashBinaryString = String.fromCharCode(...hashArray);
          const b64Encoded = btoa(hashBinaryString);
          const b64UrlEncoded = b64Encoded.replaceAll('+','-')
              .replaceAll('/','_');
          // remove padding
          return b64UrlEncoded.replaceAll('=','');
        });
    },
    authFitbitRequest() {
      // Step 1: Generate PKCE Code Verifier, PKCE Code Challenge, and State.
      this.codeVerifier = this.getCodeVerifier()
      localStorage.setItem('codeVerifier', this.codeVerifier)
      var codeChallenge = ''
      this.getCodeChallenge(this.codeVerifier).then(cc => {
        codeChallenge = cc
        const startState = this.getCodeVerifier(12)
        console.log('codeVerifier:', this.codeVerifier)
        console.log('codeChallenge:', codeChallenge)
        console.log('startState:', startState)

        // Step 2: Display Authorization Page.
        // scope=activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight
        const redirectURL = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id='+this.CLIENT_ID+'&scope=sleep&code_challenge='+codeChallenge+'&code_challenge_method=S256&state='+startState
        window.location.replace(redirectURL);
      });
    },
    authFitbitResponse() {
      // Step 3: Handle the Redirect
      this.authCode = this.$route.query.code
      const returnState = this.$route.query.state

      console.log('authCode:', this.authCode)
      console.log('returnState:', returnState)
      if (this.authCode === undefined && returnState === undefined)
        return

      // Step 4: Get Tokens.
      // Request will contain clientID, authCode, and codeVerifier.
      // var startState = ''
      const codeVerifier = localStorage.getItem('codeVerifier')
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'client_id': this.CLIENT_ID,
          'grant_type': 'authorization_code',
          'code': this.authCode,
          'code_verifier': codeVerifier,
        }),
      }
      console.log('options:', options)
      fetch('https://api.fitbit.com/oauth2/token', options)
        .then(response => {
          if (!response.ok) {
            let err = new Error("HTTP status code: " + response.status)
            err.response = response
            err.status = response.status
            throw err
          }
          console.log('response:', response)
          return response.json()
        }).then(data => {
          console.log('data:', data)
          // TODO: This should actually be stored as a cookie.
          localStorage.setItem('userId', data.user_id)
          localStorage.setItem('accessToken', data.access_token)
          localStorage.setItem('refreshToken', data.refresh_token)
        })
        .catch(err => {
          throw err;
        })

      // if (startState !== returnState) {
      //   console.log('ERROR: States do not match')
      // }

      // Step 5: Check Scopes.
    },
    getSleepData(dateFrom, dateTo) {
      const api = new FetchWrapper()
      api.get('sleep/date/' + dateFrom + '/' + dateTo +'.json')
        .then(data => {
          console.log(data)
          this.sleepData = data.sleep
        })
    },
    calculateSleepEfficiency(opportunity, duration) {
      return Math.round(opportunity / duration * 100).toString() + '%'
    },
    minutesToHours(minutes) {
      return Math.floor(minutes / 60).toString() + 'hrs ' + Math.round(minutes / 60 % 1 * 60).toString() + 'mins'
    }
  },
}
</script>