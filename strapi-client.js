const axios = require('axios').default

class Strapi {
  constructor (baseURL) {
    this.token = undefined
    this.request = axios.create({ baseURL })

    // Request Interceptor
    this.request.interceptors.request.use(
      config => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    // Response Interceptor
    this.request.interceptors.response.use(
      resp => resp.data,
      error => Promise.reject(error.response.data)
    )
  }

  // Get currently authenticated user
  currentUser (token) {
    if (token) this.token = token
    return this.request.get('/users/me')
      .catch(error => error)
  }

  // Login
  login (identifier, password) {
    return this.request.post('/auth/local', { identifier, password })
      .then(data => {
        this.token = data.jwt
        return data
      })
      .catch(error => error)
  }

  // Register
  register (data) {
    return this.request.post('/auth/local/register', data)
      .then(data => {
        this.token = data.jwt
        return data
      })
      .catch(error => error)
  }

  // TODO: Forgot password, Reset password

  // Count
  count (contentType, query) {
    return this.request.get(`/${contentType}/count`, query ? { params: query } : undefined)
      .catch(error => error)
  }

  // Create
  create (contentType, data) {
    return this.request.post(`/${contentType}`, data).catch(error => error)
  }

  // Read
  get (contentType, query) {    
    switch(typeof query) {
      case 'object':
        return this.request.get(`/${contentType}`, { params: query }).catch(error => error)
        break
      case 'number':
        return this.request.get(`/${contentType}/${query}`).catch(error => error)
        break
      case 'undefined':
        return this.request.get(`/${contentType}`).catch(error => error)
        break
    }
  }

  // Update
  update (contentType, id, data) {
    return this.request.put(`/${contentType}/${id}`, data).catch(error => error)
  }

  // Delete
  delete (contentType, id) {
    return this.request.delete(`/${contentType}/${id}`).catch(error => error)
  }
}

module.exports = Strapi
