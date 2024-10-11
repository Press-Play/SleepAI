import FetchWrapper from './api.js'
import { setCookie, getCookie } from './cookies.js'

const FITBIT_BASE_URI = 'https://api.fitbit.com/'
const FITBIT_USER_URI = FITBIT_BASE_URI + '1.2/user/'
const FITBIT_OAUTH_URI = FITBIT_BASE_URI + 'oauth2/'

export class FitbitAuthAPI {
  constructor() {
    this.api = new FetchWrapper(FITBIT_OAUTH_URI, FetchWrapper.CONTENT_TYPE_FORM_ENCODED)
    // this.codeVerifier = ''
    // this.authCode = ''
  }

  async getToken(authCode, codeVerifier) {
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

  async revokeToken() {

  }

  saveAuthentication(data) {
    setCookie('fitbit_user_id', data.user_id)
    setCookie('fitbit_access_token', data.access_token)
    setCookie('fitbit_refresh_token', data.refresh_token)
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
  }

  getAccessToken() {
    // TODO: Make this use cookies instead.
    // return localStorage.getItem('accessToken')
    return getCookie('fitbit_access_token')
  }

  getRefreshToken() {
    // TODO: Make this use cookies instead.
    // return localStorage.getItem('refreshToken')
    return getCookie('fitbit_refresh_token')
  }

  getUserId() {
    // TODO: Make this use cookies instead.
    // return localStorage.getItem('userId')
    return getCookie('fitbit_user_id')
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