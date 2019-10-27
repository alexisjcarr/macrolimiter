require('dotenv').config()

const { promisify } = require('util')

const key = require('uuid-apikey')
const bcrypt = require('bcryptjs')
const redis = require('redis')

/*=== creates and initializes redis instance that is heroku friendly ===*/
const redis_url = process.env.REDIS_URL || 6379
const client = redis.createClient(redis_url)

client.on('error', err => console.error(err))

/*=== generateAPIKey ===*/
exports.generateAPIKey = function() {
  const key_ = key.create().apiKey
  const hash_ = bcrypt.hashSync(key_, 10)
  return {
    key: key_,
    hash: hash_
  }
}

/*=== validateKey ===*/
exports.validateKey = function(HASH_ARR, ERR_MESSAGE = 'lol') {
  /**
   * @param {array} HASH_ARR
   * @param {string} ERR_MESSAGE
   */
  return async (req, res, next) => {
    const { key } = req.headers

    let validKey = null

    const keyCandidates = HASH_ARR

    /*=== checks validity of key ===*/
    if (key) {
      try {
        for (candidate of keyCandidates) {
          const okayKey = await bcrypt.compare(key, candidate)

          if (okayKey) {
            validKey = key
            break
          }
        }
      } catch (err) {
        console.error('here')
      }
    }

    /*=== sends key on req object to apiLimiter module ===*/
    if (validKey) {
      req.key = validKey
      next()
    } else {
      res.status(403).json({
        error: ERR_MESSAGE
      })
    }
  }
}

/*=== validateKey ===*/
exports.keyLimiter = function(
  CALL_LIMIT,
  ERR_MESSAGE = `Key: ${key} has exceeded the call limit of ${CALL_LIMIT} calls`
) {
  /**
   * @param {number} CALL_LIMIT
   * @param {string} ERR_MESSAGE
   */
  client.get = promisify(client.get)

  return async (req, res, next) => {
    const { key } = req

    const calls = await client.get(key)

    if (calls) {
      if (calls < CALL_LIMIT) {
        const newCalls = Number(calls) + 1
        client.set(key, newCalls)
        next()
      } else {
        res.status(403).json({
          message: ERR_MESSAGE
        })
      }
    } else {
      client.set(key, 1)
      next()
    }
  }
}
