const { generateAPIKey, validateKey, keyLimiter } = require('macrolimiter')

console.log(generateAPIKey())

let hashArr = [],
  keyArr

const key_ = generateAPIKey()
/* 
generates random api key object with the key and a hashed key for secure storage 
{ 
  key: 'ZC51K5Z-BY8MWFE-P88N4TJ-PQ4Q434', 
  hash: '$2a$10$V4pGVXNHGc0p.iRbcZDYn.Fy3ajZuwSrb.ZMFYa6c8EyYpXL7AN2O' }
*/
hashArr.push(key_.hash)
keyArr = key_.key

console.log(`\n${keyArr}\n`)
console.log(`\n${hashArr}\n`)

/* server */
const express = require('express')

const app = express()

/* user will send key on headers.
  the validate key middleware will check the key on headers against the passed in array of hashed keys. O(n)
  pass in the max number of times you want the user to hit your server before being blocked.
  coming soon: ability to implement calls/time period (i.e. 1000 calls/day) limits. it's in place with a cron job,
*/
app.get('/', validateKey(hashArr), keyLimiter(2), (_req, res) => {
  res.send('hi')
})

app.listen(8888, () => console.log(`\n=== I'm on port 8888 ===\n`))

// console.log(generateAPIKey())
