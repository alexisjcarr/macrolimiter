const key = require('uuid-apikey')
const bcrypt = require('bcryptjs')

/*=== generateAPIKey ===*/
exports.generateAPIKey = function() {
  const key_ = key.create().apiKey
  const hash_ = bcrypt.hashSync(key_, 10)
  return {
    key: key_,
    hash: hash_
  }
}
