import { createClient } from 'redis'
const { promisify } = require('util')
const DEFAULT_URL = 'redis://127.0.0.1:6379'
const PREFIX = '__prefix:'
const DEFAULT_EXPIRES = '7d'
class RedisClient {
  constructor(url, options = {}) {
    this.url = url || DEFAULT_URL
    this.store = createClient({
      url: this.url,
      prefix: PREFIX,
    })

    this.client = {
      get: (key) => {
        const start = new Date()
        const getAsync = promisify(this.store.get).bind(this.store)
        return getAsync(key).finally(
          console.log({ action: 'READ', key, start }),
        )
      },
      set: (key, val) => {
        const start = new Date()
        const setAsync = promisify(this.store.set).bind(this.store)
        return setAsync(key, val).finally(
          console.log({ action: 'WRITE', key, start }),
        )
      },
      setex: (key, expires, val) => {
        const start = new Date()
        const setexAsync = promisify(this.store.setex).bind(this.store)
        return setexAsync(key, expires, val).finally(
          console.log({ action: 'WRITE', key, start, expires }),
        )
      },
    }
  }
}
