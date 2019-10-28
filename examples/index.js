const { generateAPIKey, validateKey, keyLimiter } = require('macrolimiter')

/*=== NOTE: This package requires a redis-server to be running. For development: 
if you have a Mac, homebrew should do the trick... brew install redis. To start the server, 
type redis-server in your command line.

If you're on Windows, first go to the releases page of the Redis for Windows repo 
(https://github.com/MicrosoftArchive/redis/releases). Then download the 'Redis-x64-xxx.zip' 
file. You can use any version that you'd like, just make sure that you do not download the 
'source code' zip. After unzipping the file, in the newly created folder, run redis-server.exe. 
A window should then appear that says redis is running on port 6379===*/

/* 
  Using the hashArr as a simulated db for demo purposes. It will contain hashed api keys.
*/
let hashArr = [],
  headersKey

/* 
  generateAPIKey() generates random api key object with the key and a hashed key for secure storage in a db. 
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
  User will send key (here stored as key_) on headers.

  validateKey() will check the key on headers against the passed in array of hashed keys. O(n) complexity rn, so fair.

  For the keyLimiter(), pass in the max number of times you want the user to hit your server before being blocked.

  COMING SOON: Ability to implement calls/time period limits (i.e. 1000 calls/day would be keyLimiter({ CALL_LIMIT: 1000, TIME: '24hr' })). 
  it's in place currently with a cron job, but may switch to clock process for more control over window (sliding vs. fixed) and for hack over Heroku free tier sleeping 
*/
app.get(
  '/',
  validateKey({ HASH_ARR: hashArr }),
  keyLimiter({ CALL_LIMIT: 2 }),
  (_req, res) => {
    res.send('hi')
  }
)

app.listen(8888, () => console.log(`\n=== I'm on port 8888 ===\n`))
