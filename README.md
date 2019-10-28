<h1 align="center">macrolimiter</h1>
<p>
  <a href="https://www.npmjs.com/package/macrolimiter" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/macrolimiter.svg">
  </a>
  <a href="https://github.com/alexisjcarr/macrolimiter" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/THEAlexisCarr" target="_blank">
    <img alt="Twitter: THEAlexisCarr" src="https://img.shields.io/twitter/follow/THEAlexisCarr.svg?style=social" />
  </a>
</p>

> An npm package that facilitates both the generation and validation of API keys, as well as the limiting of calls for specific API keys on key-protected routes.

## Contributors

|                                                 [Alexis J. Carr](https://github.com/alexisjcarr)                                                  |                                          [Michael Hart](https://github.com/worksofhart)                                           |                                             [Chao Ji](https://github.com/cjgodfather)                                             |
| :-----------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
| [<img src="https://raw.githubusercontent.com/alexisjcarr/Web-UI-1/master/assets/img/alexis.png" width = "200" />](https://github.com/alexisjcarr) |     [<img src="https://avatars2.githubusercontent.com/u/48599443?s=460&v=4" width = "200" />](https://github.com/worksofhart)     |     [<img src="https://avatars3.githubusercontent.com/u/39098919?s=460&v=4" width = "200" />](https://github.com/cjgodfather)     |
|                             [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/alexisjcarr)                              |                     [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/worksofhart)                      |                     [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/cjgodfather)                      |
|           [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/alexis-j-carr)           | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/michael-hart-dev/) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/chao-ji-113b594a/) |

### 🏠 [Homepage](https://github.com/alexisjcarr/macrolimiter)

### ✨ [Demo](https://github.com/alexisjcarr/macrolimiter/blob/master/examples/index.js)

## Install

```sh
npm install
```

## Usage

### NOTE:

This package requires a redis-server to be running.

For development: if you have a Mac, homebrew should do the trick... `brew install redis`. To start the server, type `redis-server` in your command line.

If you're on Windows, first go to the releases page of the Redis for Windows repo (https://github.com/MicrosoftArchive/redis/releases). Then download the 'Redis-x64-xxx.zip' file. You can use any version that you'd like, just make sure that you do not download the 'source code' zip. After unzipping the file, in the newly created folder, run `redis-server.exe`. A window should then appear that says `redis is running on port 6379`.

#### Example

```javascript
const { generateAPIKey, validateKey, keyLimiter } = require('macrolimiter')

/*
  Using the hashArr as a simulated db for demo purposes. It will contain hashed api keys.
*/
let hashArr = [],
  headersKey // key that will be added to headers

/*
  generateAPIKey() generates random api key object with the key and a hashed key 
  for secure storage in a db.
  
  example:
  {
    key: 'ZC51K5Z-BY8MWFE-P88N4TJ-PQ4Q434',
    hash: '$2a$10$V4pGVXNHGc0p.iRbcZDYn.Fy3ajZuwSrb.ZMFYa6c8EyYpXL7AN2O'
  }
*/

const key_ = generateAPIKey()

hashArr.push(key_.hash) // adding one hashed key to hashArr, but can add several
headersKey = key_.key

/* server */
const express = require('express')

const app = express()

/*
  User will send key (here stored as key_) on headers.

  validateKey() will check the key on headers against the passed in array of hashed 
  keys. O(n) complexity rn, so fair.

  For the keyLimiter(), pass in the max number of times you want the user to hit 
  your server before being blocked.

  COMING SOON: Ability to implement calls/time period limits (i.e. 1000 calls/day 
  would be keyLimiter({ CALL_LIMIT: 1000, TIME: '24hr' })).
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
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/alexisjcarr/macrolimiter/issues).

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## License

[MIT](LICENSE)

## Show your support

Give a ⭐️ if this project helped you!
