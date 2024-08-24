const app = require('./app')
const initSocket = require('./socket')
const port = process.env.PORT || 10010

// start the server
const server = app.listen(port, () => {
  console.log("server running on port = "+port)
})

initSocket(server)