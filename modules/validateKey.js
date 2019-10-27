const bcrypt = require('bcryptjs')

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
