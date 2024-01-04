const express = require('express')
const next = require('next')
const request = require('request')

const port = 3000
const dev = process.env.NODE_ENV !== 'production'

// creating the app either in production or dev mode
const app = next({ dev })
const handle = app.getRequestHandler()

// running the app, async operation
app.prepare().then(() => {
  const server = express()

  // redirecting all requests to Next.js
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) {
      throw err
    }
    console.log(`Runing on port ${port}, dev: ${dev}`)

    console.log('------自定义server.js------')

    const url = 'http://localhost:3000/api/task'
    request(url, {
      method: 'POST',
      data: {}
    })
  })
})

// const next = require('next')
// const request = require('request')

// const dev = process.env.NODE_ENV !== 'production'

// // creating the app either in production or dev mode
// const app = next({ dev })

// // running the app, async operation
// app.prepare().then(() => {
//   console.log('------自定义server.js------')

//   const url = 'http://localhost:3000/api/task'
//   request(
//     url,
//     {
//       url: '/api/task',
//       method: 'POST',
//       data: {}
//     },
//     (err, res, body) => {
//       console.log('------自定义server.js------')
//       console.log('err', err)
//       console.log('res', res)
//       console.log('body', body)
//     }
//   )
// })
