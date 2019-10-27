// const { generateAPIKey, validateKey, keyLimiter } = require('.')

// console.log(generateAPIKey())

const { generateAPIKey, validateKey, keyLimiter } = require('macrolimiter')

let hashArr = [],
  keyArr

for (let i = 0; i < 1; i++) {
  const key_ = generateAPIKey()
  hashArr.push(key_.hash)
  keyArr = key_.key
}

console.log(`\n${keyArr}\n`)
console.log(`\n${hashArr}\n`)

const express = require('express')

const app = express()

app.get('/', validateKey(hashArr), keyLimiter(2), (_req, res) => {
  res.send('hi')
})

app.listen(8888, () => console.log(`\n=== I'm on port 8888 ===\n`))

// console.log(generateAPIKey())
