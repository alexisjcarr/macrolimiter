const redis = require('redis')

/*=== creates and initializes redis instance that is heroku friendly ===*/
const redis_url = process.env.REDIS_URL || 6379
const client = redis.createClient(redis_url)

client.on('error', err => console.error(err))

module.exports = client
