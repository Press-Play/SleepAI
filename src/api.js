function getToken() {
  // TODO: Make this use cookies instead.
  return localStorage.getItem('accessToken')
}

function getUserId() {
  // TODO: Make this use cookies instead.
  return localStorage.getItem('userId')
}

export default class FetchWrapper {
  constructor(baseURI = 'https://api.fitbit.com/1.2/user/') {
    const userId = getUserId();
    if (userId === null) {
      throw new Error("No user ID");
    }
    this.baseURI = baseURI + userId + '/';
    this.token = getToken();
    if (this.token === null) {
      throw new Error("No access token");
    }
  }

  wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  async get(path, tries = 1, delay = 500) {
    const response = await this.call(`${this.baseURI}${path}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.token,
      },
    }, tries, delay)
    return response;
  }

  async put(path, data, tries = 1, delay = 500) {
    const response = await this.call(`${this.baseURI}${path}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json',
      },
    }, tries, delay);
    return response;
  }

  async post(path, data, tries = 1, delay = 500) {
    const response = await this.call(`${this.baseURI}${path}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json',
      },
    }, tries, delay);
    return response;
  }

  async delete(path, tries = 1, delay = 500) {
    const response = await this.call(`${this.baseURI}${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + this.token,
      },
    }, tries, delay);
    return response;
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
        return response.json();
      })
      .catch(err => {
        const triesLeft = tries - 1;
        if (!triesLeft) {
          throw err;
        }
        return this.wait(delay).then(() => this.call(url, options, delay, triesLeft));
      });
    return response;
  }
}