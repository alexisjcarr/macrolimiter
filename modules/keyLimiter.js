const client = require('../redis')
const defaults = require('defaults')
const { promisify } = require('util')

client.get = promisify(client.get)

/*=== keyLimiter ===*/
exports.keyLimiter = function(CALL_LIMIT_OPTS) {
  /**
   * @param {number} CALL_LIMIT
   * @param {string} TIME
   */

  CALL_LIMIT_OPTS = defaults(CALL_LIMIT_OPTS, {
    CALL_LIMIT: 100,
    TIME: '24h'
  })

  return async (req, res, next) => {
    const { key } = req

    const calls = await client.get(key)

    if (calls) {
      if (calls <= CALL_LIMIT_OPTS.CALL_LIMIT) {
        const newCalls = Number(calls) + 1
        client.set(key, newCalls)
        next()
      } else {
        res.status(403).json({
          message: `Key: ${key} has exceeded the call limit of ${CALL_LIMIT_OPTS.CALL_LIMIT} calls`
        })
      }
    } else {
      client.set(key, 2) // starts at 2 to get rid of weird offset by 2 bug
      next()
    }
  }
}

console.log(this.keyLimiter())
