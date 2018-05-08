const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const names = [];
let connections = {};
let usersConnections = 0;

io.on('connection', connection);

function connection(socket) {
  console.log('an user has connected to the socket', socket.id);

  names.forEach((name) => {
    socket.emit('new user name input', name);
  });

  socket.on('saveUser', (name) => {
    names.push(name);

    notifySocketsOf('new user name input', connections, name);
  });

  socket.on('disconnect', () => {
    console.log('an user has disconnected');

    usersConnections -= 1;

    notifySocketsOf('users connections changed', connections, usersConnections);
  });

  connections[socket.id] = socket;
  usersConnections += 1;

  notifySocketsOf('users connections changed', connections, usersConnections);
}

server.listen(3000);

function notifySocketsOf(event, connections, message) {
  Object
    .keys(connections)
    .forEach((socketId) => {
      connections[socketId].emit(event, message);
    });
}