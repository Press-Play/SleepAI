import FetchWrapper from './api.js'
import { setCookie, getCookie, eraseCookie } from './cookies.js'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
// import { getCurrentUser } from 'vuefire'
import { getAuth } from "firebase/auth";

const FITBIT_BASE_URI = 'https://api.fitbit.com/'
const FITBIT_USER_URI = FITBIT_BASE_URI + '1.2/user/'
const FITBIT_OAUTH_URI = FITBIT_BASE_URI + 'oauth2/'

export class FitbitAuth {
  constructor() {
    this.api = new FitbitAuthAPI(FITBIT_OAUTH_URI, FetchWrapper.CONTENT_TYPE_FORM_ENCODED)
  }

  static setAccessToken(accessToken) {
    return setCookie('fitbit_access_token', accessToken)
  }

  static setRefreshToken(refreshToken) {
    return setCookie('fitbit_refresh_token', refreshToken)
  }

  static setUserId(userId) {
    const auth = getAuth()
    const user = auth.currentUser;
    const db = getFirestore()
    const usersRef = doc(db, 'users', user.uid)
    setDoc(usersRef, {fitbitUserId: userId}, {merge: true})
    return setCookie('fitbit_user_id', userId)
  }

  static getAccessToken() {
    return getCookie('fitbit_access_token')
  }

  static getRefreshToken() {
    return getCookie('fitbit_refresh_token')
  }

  static getUserId() {
    return getCookie('fitbit_user_id')
    // TODO: Get userId from Firestore users collection.
  }

  static clearTokens() {
    eraseCookie('fitbit_access_token')
    eraseCookie('fitbit_refresh_token')
  }

  saveAuthentication(data) {
    FitbitAuth.setAccessToken(data.access_token)
    FitbitAuth.setRefreshToken(data.refresh_token)
    FitbitAuth.setUserId(data.user_id)
  }

  async requestAccessToken(authCode, codeVerifier) {
    const response = await this.api.post('token', {
      'client_id': process.env.VUE_APP_FITBIT_CLIENT_ID,
      'grant_type': 'authorization_code',
      'code': authCode,
      'code_verifier': codeVerifier,
    })
    this.saveAuthentication(response)
    return response
  }

  async refreshAccessToken() {
    const token = FitbitAuth.getRefreshToken()
    if (!token) {
      return new Error('No refresh token.')
    }
    const response = await this.api.post('token', {
      'client_id': process.env.VUE_APP_FITBIT_CLIENT_ID,
      'grant_type': 'refresh_token',
      'refresh_token': token,
    })
    this.saveAuthentication(response)
    return response
  }

  async revokeTokens() {
    FitbitAuth.clearTokens()
    const response = await this.api.post('revoke', {
      'client_id': process.env.VUE_APP_FITBIT_CLIENT_ID,
      'token': FitbitAuth.getAccessToken(),
    })
    await this.api.post('revoke', {
      'client_id': process.env.VUE_APP_FITBIT_CLIENT_ID,
      'token': FitbitAuth.getRefreshToken(),
    })
    this.saveAuthentication(response)
    return response
  }

  async introspectToken(token) {
    const accessToken = FitbitAuth.getAccessToken()
    if (!accessToken) {
      return false
    }
    const oldURI = this.api.setBaseURI(FITBIT_BASE_URI + '1.1/oauth2/')
    const oldToken = this.api.setAccessToken(accessToken)
    const response = await this.api.post('introspect', {
      'token': token
    }).catch(() => {
      this.api.setBaseURI(oldURI)
      this.api.setAccessToken(oldToken)
      return this.refreshAccessToken()
    })
    this.api.setBaseURI(oldURI)
    this.api.setAccessToken(oldToken)
    
    return response
  }

  async isConnected() {
    const accessToken = FitbitAuth.getAccessToken()
    const response = await this.introspectToken(accessToken)
    return response ? response.active : false
  }
}

export class FitbitAuthAPI extends FetchWrapper {
  constructor() {
    super(FITBIT_OAUTH_URI, FetchWrapper.CONTENT_TYPE_FORM_ENCODED)
  }

  getAccessToken() {
    return null
  }

  async onError() {
    return null
  }
}

export class FitbitUserAPI extends FetchWrapper {
  constructor() {
    super(FITBIT_USER_URI)

    const userId = this.getUserId()
    if (!userId) {
      throw new Error("No user ID")
    }
    this.baseURI = this.baseURI + userId + '/';
    this.accessToken = this.getAccessToken()
    this.auth = new FitbitAuth()
  }

  getAccessToken() {
    return FitbitAuth.getAccessToken()
  }

  getRefreshToken() {
    return FitbitAuth.getRefreshToken()
  }

  getUserId() {
    return FitbitAuth.getUserId()
  }

  async onError(error) {
    // If response is 401 Unauthorized, then refresh token.
    if (error.status === '401') {
      return this.auth.refreshAccessToken()
    }
  }
}