const request = require('request')

setTimeout(() => {
  const url = 'http://localhost:3000/api/task'
  request(url, {
    method: 'POST',
    data: {}
  })
}, 10000)
