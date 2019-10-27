require('dotenv').config()

const { promisify } = require('util')

const key = require('uuid-apikey')
const bcrypt = require('bcryptjs')

/*=== imports and exports ===*/
const { generateAPIKey } = require('./modules/generateAPIKey')
const { validateKey } = require('./modules/validateKey')
const { keyLimiter } = require('./modules/keyLimiter')

module.exports = {
  generateAPIKey,
  validateKey,
  keyLimiter
}
