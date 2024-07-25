const { Server } = require('socket.io')
const { verifyToken } = require('./src/utils/helpers')

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  // Authenticate user
  const authenticateUser = (socket, next) => {
    try {
      let token = socket.handshake?.auth?.token;
      if (!token) return next(new Error('Unauthorized'))

      let decoded = verifyToken(token)
      if (decoded && decoded.id) {
        socket.user = decoded.id;
        next();
      } else {
        next(new Error('Unauthorized'))
      }
    } catch (error) {
      next(new Error('Token not found'))
    }
  };

  // Use the authentication function
  io.use(authenticateUser);

  // After successful connection
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);
    console.log('Connected user id:', socket.user);
  });
};