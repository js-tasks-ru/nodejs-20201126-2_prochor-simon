const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const { token } = socket.handshake.query;
    const session = await Session.findOne({token}).populate('user');

    if (!session) {
      next(new Error("anonymous sessions are not allowed"));
    } else {
      socket.user = session.user;
      next();
    }
  });

  io.on('connection', function(socket) {
    const { user } = socket;

    socket.on('message', async (msg) => {
      await Message.create({
        user: user.displayName,
        chat: user,
        text: msg,
        date: new Date(),
      });
    });
  });

  io.on('error', function(socket) {
  });

  return io;
}

module.exports = socket;
