const bcrypt = require('bcryptjs')
const defaults = require('defaults')

/*=== validateKey ===*/
exports.validateKey = function(KEY_OPTS) {
  /**
   * @param {array} HASH_ARR
   * @param {string} ERR_MSG
   */

  KEY_OPTS = defaults(KEY_OPTS, {
    HASH_ARR: null,
    ERR_MSG: 'Valid key not provided. Access denied.'
  })

  return async (req, res, next) => {
    const { key } = req.headers

    let validKey = null

    const keyCandidates = KEY_OPTS.HASH_ARR

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
        error: KEY_OPTS.ERR_MSG
      })
    }
  }
}
