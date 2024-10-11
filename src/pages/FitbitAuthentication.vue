<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="flex flex-col flex-wrap content-center">
      <div class="px-12">
        <h2>Connect your sleep data</h2>
        <p>This helps you get the best personalised recommendations 😇</p>
      </div>
      <button @click="authFitbitRequest()" :disabled="loading || fitbit" class="inline-flex items-center place-content-center">
        <span v-if="fitbit">Connected to</span>
        <span v-else>Connect</span>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 180 45" class="h-4 ml-2 p-px">
          <path d="m 66.842626,15.959 -8.448146,0 0,-4.122 c 0.03841,-4.7775 1.310795,-6.5516 2.712818,-7.4615 1.440434,-0.9459 3.629894,-1.0299 5.735328,-1.0083 0.890668,0 1.608485,-0.7202 1.608485,-1.6085 0,-0.881 -0.717817,-1.5989 -1.608485,-1.5989 -2.086229,0.014 -4.923884,-0.074 -7.456647,1.5005 -2.571175,1.6133 -4.230075,4.8735 -4.194064,10.1767 l 0,4.122 -3.300994,0 c -0.888268,0 -1.608485,0.7226 -1.608485,1.6037 0,0.8859 0.720217,1.6085 1.608485,1.6085 l 3.300994,0 0,24.0384 c 0,0.8763 0.720217,1.5989 1.603684,1.5989 0.888267,0 1.606084,-0.7226 1.606084,-1.5989 -0.0024,-15.3718 -0.0072,-16.4329 -0.0072,-24.0384 l 8.448146,0 c 0.885867,0 1.613286,-0.7226 1.613286,-1.6085 0,-0.8811 -0.727419,-1.6037 -1.613286,-1.6037" style="fill:#142529;stroke:none"/>
          <path d="m 104.62425,41.6095 0,-0.01 c -2.70081,0.024 -4.883071,-0.1368 -6.119444,-1.0635 -1.224369,-0.8787 -2.314297,-2.7825 -2.328702,-7.6343 l 0,-13.6889 8.448146,0 c 0.88587,0 1.60368,-0.7179 1.60368,-1.6037 0,-0.8907 -0.71781,-1.6037 -1.60368,-1.6037 l -8.448146,0 0,-14.2411 c 0,-0.8859 -0.717816,-1.6037 -1.608484,-1.6037 -0.883467,0 -1.596481,0.7178 -1.596481,1.6037 l 0,14.2411 -3.300995,0 c -0.885867,0 -1.608485,0.713 -1.608485,1.6037 0,0.8858 0.722618,1.6037 1.608485,1.6037 l 3.300995,0 0,13.6889 c -0.01921,5.2288 1.219567,8.4721 3.665904,10.2415 2.434334,1.6973 5.286397,1.6493 7.987207,1.6637 0.88587,0 1.60368,-0.7082 1.60368,-1.5989 0,-0.8859 -0.71781,-1.5989 -1.60368,-1.5989" style="fill:#142529;stroke:none"/>
          <path d="m 178.38696,41.6141 0,0 c -3.46184,0.024 -5.57928,-0.3601 -6.60919,-1.3036 -1.05632,-0.8715 -1.85096,-2.8881 -1.83896,-7.3294 l 0,-13.7634 8.44815,0 c 0.89067,0 1.60368,-0.7178 1.60368,-1.6036 0,-0.8907 -0.71301,-1.6037 -1.60368,-1.6037 l -8.44815,0 0,-14.2459 c 0,-0.8907 -0.71541,-1.5941 -1.60368,-1.5941 -0.88827,0 -1.60608,0.7034 -1.60608,1.5941 l 0,14.2459 -3.2986,0 c -0.89067,0 -1.60848,0.713 -1.60848,1.6037 0,0.8858 0.71781,1.6036 1.60848,1.6036 l 3.2986,0 0,13.7634 c 0.01,4.6886 0.73942,7.7855 2.95529,9.7493 2.24948,1.899 5.14715,2.0671 8.70262,2.0815 0.88107,0 1.60368,-0.7083 1.60368,-1.5941 0,-0.8859 -0.72261,-1.5989 -1.60368,-1.5989" style="fill:#142529;stroke:none"/>
          <path d="m 76.563635,43.2084 0,-25.6445 c 0,-0.8835 0.725018,-1.6061 1.603683,-1.6061 0.888268,0 1.608485,0.7226 1.608485,1.6061 l 0,25.6445 c 0,0.8763 -0.720217,1.5989 -1.608485,1.5989 -0.878665,0 -1.603683,-0.7226 -1.603683,-1.5989" style="fill:#142529;stroke:none"/>
          <path d="m 151.01535,43.2084 0,-25.6445 c 0,-0.8835 0.70821,-1.6061 1.58928,-1.6061 0.88587,0 1.60848,0.7226 1.60848,1.6061 l 0,25.6445 c 0,0.8763 -0.72261,1.5989 -1.60848,1.5989 -0.88107,0 -1.58928,-0.7226 -1.58928,-1.5989" style="fill:#142529;stroke:none"/>
          <path d="m 128.78801,41.6705 c -6.24668,-0.014 -11.2978,-5.0559 -11.30981,-11.3026 0.012,-6.2443 5.06313,-11.2954 11.30981,-11.3002 6.24668,0 11.293,5.0559 11.30741,11.3002 -0.0144,6.2467 -5.06073,11.2882 -11.30741,11.3026 m 0,-25.815 c -4.57098,0 -8.64981,2.1199 -11.30981,5.4257 l 0,-19.5155 c 0,-0.8883 -0.71541,-1.6013 -1.59888,-1.6013 -0.89307,0 -1.60368,0.713 -1.60368,1.6013 l 0,29.5697 c 0,0.1128 0.0408,0.2161 0.0648,0.3241 0.64579,7.4038 6.86126,13.2184 14.44755,13.2184 8.01361,0 14.50997,-6.494 14.50997,-14.51 0,-8.0136 -6.49636,-14.5076 -14.50997,-14.5124" style="fill:#142529;stroke:none"/>
          <path d="m 20.475416,22.88215 c 0,1.430611 -1.159753,2.59035 -2.59038,2.59035 -1.430629,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.430611 1.159752,-2.59035 2.590381,-2.59035 1.430627,0 2.59038,1.159739 2.59038,2.59035 z" style="fill:#142529;stroke:none;"/>
          <path d="m 28.123341,22.88215 c 0,1.430611 -1.159752,2.59035 -2.59038,2.59035 -1.430628,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.430611 1.159753,-2.59035 2.590381,-2.59035 1.430628,0 2.59038,1.159739 2.59038,2.59035 z" style="fill:#142529;stroke:none;"/>
          <path d="m 35.771266,22.88215 c 0,1.430611 -1.159753,2.59035 -2.590381,2.59035 -1.430628,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.430611 1.159753,-2.59035 2.590381,-2.59035 1.430628,0 2.590381,1.159739 2.590381,2.59035 z" style="fill:#142529;stroke:none"/>
          <path d="m 12.82749,22.88215 c 0,1.430611 -1.159752,2.59035 -2.59038,2.59035 -1.4306289,0 -2.5903815,-1.159739 -2.5903815,-2.59035 0,-1.430611 1.1597526,-2.59035 2.5903815,-2.59035 1.430628,0 2.59038,1.159739 2.59038,2.59035 z" style="fill:#142529;stroke:none"/>
          <path d="m 20.475416,38.18345 c 0,1.430611 -1.159753,2.59035 -2.590381,2.59035 -1.430628,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.430611 1.159753,-2.59035 2.590381,-2.59035 1.430628,0 2.590381,1.159739 2.590381,2.59035 z" style="fill:#2ebec0;stroke:none"/>
          <path d="m 20.475416,7.59055 c 0,1.430611 -1.159753,2.59035 -2.590381,2.59035 -1.430628,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.4306108 1.159753,-2.59035 2.590381,-2.59035 1.430628,0 2.590381,1.1597392 2.590381,2.59035 z" style="fill:#2ebec0;stroke:none"/>
          <path d="m 20.475416,30.840418 c 0,1.430611 -1.159753,2.59035 -2.590381,2.59035 -1.430628,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.430611 1.159753,-2.59035 2.590381,-2.59035 1.430628,0 2.590381,1.159739 2.590381,2.59035 z" style="fill:#2ebec0;stroke:none"/>
          <path d="m 28.123341,30.840418 c 0,1.430611 -1.159753,2.59035 -2.59038,2.59035 -1.430629,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.430611 1.159752,-2.59035 2.590381,-2.59035 1.430627,0 2.59038,1.159739 2.59038,2.59035 z" style="fill:#142529;stroke:none"/>
          <path d="m 12.82749,30.840418 c 0,1.430611 -1.159752,2.59035 -2.59038,2.59035 -1.4306289,0 -2.5903815,-1.159739 -2.5903815,-2.59035 0,-1.430611 1.1597526,-2.59035 2.5903815,-2.59035 1.430628,0 2.59038,1.159739 2.59038,2.59035 z" style="fill:#2ebec0;stroke:none"/>
          <path d="m 20.475416,14.819257 c 0,1.430611 -1.159753,2.59035 -2.590381,2.59035 -1.430628,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.430611 1.159753,-2.59035 2.590381,-2.59035 1.430628,0 2.590381,1.159739 2.590381,2.59035 z" style="fill:#2ebec0;stroke:none"/>
          <path d="m 28.123341,14.819257 c 0,1.430611 -1.159753,2.59035 -2.59038,2.59035 -1.430629,0 -2.590381,-1.159739 -2.590381,-2.59035 0,-1.430611 1.159752,-2.59035 2.590381,-2.59035 1.430627,0 2.59038,1.159739 2.59038,2.59035 z" style="fill:#142529;stroke:none"/>
          <path d="m 12.82749,14.819257 c 0,1.430611 -1.159752,2.59035 -2.59038,2.59035 -1.4306289,0 -2.5903815,-1.159739 -2.5903815,-2.59035 0,-1.430611 1.1597526,-2.59035 2.5903815,-2.59035 1.430628,0 2.59038,1.159739 2.59038,2.59035 z" style="fill:#2ebec0;stroke:none"/>
          <path d="m 5.188928,22.88215 c 0,1.430611 -1.1597526,2.59035 -2.5903804,2.59035 -1.4306284,0 -2.59038099,-1.159739 -2.59038099,-2.59035 0,-1.430611 1.15975259,-2.59035 2.59038099,-2.59035 1.4306278,0 2.5903804,1.159739 2.5903804,2.59035 z" style="fill:#142529;stroke:none"/>
          <path d="m 81.375886,7.2424 c 0,1.7706961 -1.43545,3.206128 -3.206167,3.206128 -1.770717,0 -3.206166,-1.4354319 -3.206166,-3.206128 0,-1.7706956 1.435449,-3.206128 3.206166,-3.206128 1.770717,0 3.206167,1.4354325 3.206167,3.206128 z" style="fill:#2ebec0;stroke:none"/>
          <path d="m 155.8204,7.2424 c 0,1.7706961 -1.43545,3.206128 -3.20617,3.206128 -1.77072,0 -3.20617,-1.4354319 -3.20617,-3.206128 0,-1.7706956 1.43545,-3.206128 3.20617,-3.206128 1.77072,0 3.20617,1.4354325 3.20617,3.206128 z" style="fill:#2ebec0;stroke:none"/>
        </svg>
        <svg v-if="fitbit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="h-4 ml-2"><path fill-rule="evenodd" stroke="currentColor" stroke-width="1" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"></path></svg>
      </button>
      <button @click="goToNext()" :disabled="loading" :class="{ 'button-secondary': !fitbit }" class="inline-flex items-center place-content-center">
        <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else-if="!fitbit">Skip</span>
        <span v-else>Next →</span>
      </button>
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
import { FitbitAuth, FitbitUserAPI } from '../fitbit.js'

// TODO: Extract out Fitbit auth into component.
export default {
  name: 'FitbitAuthentication',
  data() {
    return {
      codeVerifier: undefined,
      authCode: undefined,
      sleepData: [],
      loading: false,
      fitbit: false,
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
      this.loading = true

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
        const redirectURL = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id='+process.env.VUE_APP_FITBIT_CLIENT_ID+'&scope=sleep&code_challenge='+codeChallenge+'&code_challenge_method=S256&state='+startState
        window.location.replace(redirectURL);
      });
    },
    async authFitbitResponse() {
      const apiAuth = new FitbitAuth()
      this.loading = true
      this.fitbit = await apiAuth.isConnected()

      // Step 3: Handle the Redirect
      this.authCode = this.$route.query.code
      const returnState = this.$route.query.state

      console.log('authCode:', this.authCode)
      console.log('returnState:', returnState)
      if (this.authCode === undefined && returnState === undefined) {
        this.loading = false
        return
      }

      // Step 4: Get Tokens.
      // Request will contain clientID, authCode, and codeVerifier.
      // var startState = ''
      const codeVerifier = localStorage.getItem('codeVerifier')
      apiAuth.requestAccessToken(this.authCode, codeVerifier).then(data => {
        console.log('data:', data)
        // Clear the params once we're done here.
        this.$router.replace(this.$router.currentRoute.path)
        this.loading = false
        return apiAuth.isConnected()
      })
      .then(connected => {
        this.fitbit = connected
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
      const api = new FitbitUserAPI()
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
    },
    goToNext() {
      this.loading = true
      // this.$router.push('/nextPage')
      // this.loading = false
    },
  },
}
</script>