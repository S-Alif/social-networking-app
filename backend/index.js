const app = require('./app')
const port = process.env.PORT || 10010

// start the server
app.listen(port, () => {
  console.log("server running on port = "+port)
})