const app = require('./app')
const port = process.env.PORT || 10010

// start the server
const server = app.listen(port, () => {
  console.log("server running on port = "+port)
})

require('./socket')(server)

module.exports = server