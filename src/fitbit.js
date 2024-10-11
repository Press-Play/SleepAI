import FetchWrapper from './api.js'
import { setCookie, getCookie } from './cookies.js'

const FITBIT_BASE_URI = 'https://api.fitbit.com/'
const FITBIT_USER_URI = FITBIT_BASE_URI + '1.2/user/'
const FITBIT_OAUTH_URI = FITBIT_BASE_URI + 'oauth2/'

export class FitbitAuth {
  constructor() {
    this.api = new FitbitAuthAPI(FITBIT_OAUTH_URI, FetchWrapper.CONTENT_TYPE_FORM_ENCODED)
  }

  static getAccessToken() {
    return getCookie('fitbit_access_token')
  }

  static getRefreshToken() {
    return getCookie('fitbit_refresh_token')
  }

  static getUserId() {
    return getCookie('fitbit_user_id')
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

  async refreshToken(refreshToken) {
    const response = await this.api.post('token', {
      'client_id': process.env.VUE_APP_FITBIT_CLIENT_ID,
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken,
    })
    this.saveAuthentication(response)
    return response
  }

  async revokeTokens() {

  }

  async introspectToken(token) {
    const oldURI = this.api.setBaseURI(FITBIT_BASE_URI + '1.1/oauth2/')
    const response = await this.api.post('introspect', {
      'token': token
    })
    this.api.setBaseURI(oldURI)
    return response
  }

  async isConnected() {
    const accessToken = FitbitAuth.getAccessToken()
    const response = await this.introspectToken(accessToken)
    return response.active
  }

  saveAuthentication(data) {
    setCookie('fitbit_user_id', data.user_id)
    setCookie('fitbit_access_token', data.access_token)
    setCookie('fitbit_refresh_token', data.refresh_token)
  }
}

export class FitbitAuthAPI extends FetchWrapper {
  constructor() {
    super(FITBIT_OAUTH_URI, FetchWrapper.CONTENT_TYPE_FORM_ENCODED)
  }

  getAccessToken() {
    return FitbitAuth.getAccessToken()
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
      console.log('Attempting to refresh token.')
      const refreshToken = this.getRefreshToken()
      if (refreshToken === null) {
        throw new Error("No refresh token");
      }
      return refreshToken(refreshToken)
    }
  }
}