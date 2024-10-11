// This is intended to be an abstract class. Extend this class and implement
// the getAccessToken() to get the API bearer token and async onError() to run
// when an API call returns an error.
export default class FetchWrapper {
  static CONTENT_TYPE_JSON = 'application/json'
  static CONTENT_TYPE_FORM_ENCODED = 'application/x-www-form-urlencoded'

  constructor(baseURI, contentType = FetchWrapper.CONTENT_TYPE_JSON) {
    if (this.constructor === FetchWrapper) {
      throw new Error('Class is of abstract type and can not be instantiated.')
    }

    if (this.getAccessToken === undefined || this.onError === undefined) {
      throw new Error('Class requires getAccessToken and onError to be implemented.')
    }

    this.baseURI = baseURI
    this.contentType = contentType
    this.accessToken = this.getAccessToken()
  }

  prepareBody(data) {
    switch(this.contentType) {
      case FetchWrapper.CONTENT_TYPE_JSON:
        return JSON.stringify(data)
      case FetchWrapper.CONTENT_TYPE_FORM_ENCODED:
        return new URLSearchParams(data)
      default:
        throw new Error('Unsupported content type.')
    }
  }

  wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  setBaseURI(baseURI) {
    const oldURI = this.baseURI
    this.baseURI = baseURI
    return oldURI
  }

  async get(path, tries = 1, delay = 500) {
    const response = await this.call(`${this.baseURI}${path}`, {
      method: 'GET',
      headers: {
        ...(this.accessToken && {'Authorization': 'Bearer ' + this.accessToken}),
      },
    }, tries, delay)
    return response
  }

  async put(path, data, tries = 1, delay = 500) {
    const response = await this.call(`${this.baseURI}${path}`, {
      method: 'PUT',
      body: this.prepareBody(data),
      headers: {
        ...(this.accessToken && {'Authorization': 'Bearer ' + this.accessToken}),
        ...(this.contentType && {'Content-Type': this.contentType}),
      },
    }, tries, delay)
    return response
  }

  async post(path, data, tries = 1, delay = 500) {
    const response = await this.call(`${this.baseURI}${path}`, {
      method: 'POST',
      body: this.prepareBody(data),
      headers: {
        ...(this.accessToken && {'Authorization': 'Bearer ' + this.accessToken}),
        ...(this.contentType && {'Content-Type': this.contentType}),
      },
    }, tries, delay)
    return response
  }

  async delete(path, tries = 1, delay = 500) {
    const response = await this.call(`${this.baseURI}${path}`, {
      method: 'DELETE',
      headers: {
        ...(this.accessToken && {'Authorization': 'Bearer ' + this.accessToken}),
      },
    }, tries, delay)
    return response
  }

  async call(url, options = {}, tries = 1, delay = 500) {
    const response = await fetch(url, options)
      .then(response => {
        if (!response.ok) {
          let err = new Error("HTTP status code: " + response.status)
          err.response = response
          err.status = response.status
          throw err
        }
        return response.json()
      })
      .catch(err => {
        this.onError(err).then(errorResponse => {
          return errorResponse
        })

        // Retry the call.
        const triesLeft = tries - 1
        if (!triesLeft) {
          throw err
        }
        return this.wait(delay).then(() => this.call(url, options, delay, triesLeft))
      })
    return response
  }
}