const { generateAPIKey, validateKey, keyLimiter } = require('macrolimiter')

/* 
  Using the hashArr as a simulated db for demo purposes. It contains hashed api keys.
*/
let hashArr = [],
  headersKey

/* 
  Generates random api key object with the key and a hashed key for secure storage in a db. 
  { 
    key: 'ZC51K5Z-BY8MWFE-P88N4TJ-PQ4Q434', 
    hash: '$2a$10$V4pGVXNHGc0p.iRbcZDYn.Fy3ajZuwSrb.ZMFYa6c8EyYpXL7AN2O' 
  }
  */
const key_ = generateAPIKey()

hashArr.push(key_.hash)
headersKey = key_.key

console.log(`\n${headersKey}\n`)
console.log(`\n${hashArr}\n`)

/* server */
const express = require('express')

const app = express()

/* 
User will send key on headers.
  validateKey() will check the key on headers against the passed in array of hashed keys. O(n) complexity rn, so fair, but not the best.

  For the keyLimiter(), pass in the max number of times you want the user to hit your server before being blocked.

  COMING SOON: Ability to implement calls/time period limits (i.e. 1000 calls/day would be keyLimiter({ CALL_LIMIT: 1000, TIME: '24hr' })). 
  it's in place currently with a cron job, but may switch to clock process for more control over window (sliding vs. fixed) and for hack over Heroku free tier sleeping 
*/
app.get('/', validateKey(hashArr), keyLimiter(2), (_req, res) => {
  res.send('hi')
})

app.listen(8888, () => console.log(`\n=== I'm on port 8888 ===\n`))
