const { generateAPIKey, validateKey } = require('.')

// console.log(generateAPIKey())

let hashArr = [],
  keyArr

for (let i = 0; i < 1; i++) {
  const key_ = generateAPIKey()
  hashArr.push(key_.hash)
  keyArr = key_.key
}

console.log(keyArr)
console.log(hashArr)

const express = require('express')

const app = express()

app.get('/', validateKey(hashArr), (req, res) => {
  res.send('hi')
})

app.listen(8888, () => console.log("I'm on"))
