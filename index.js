const express = require('express');
const Server = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server)

app.use(express.static(__dirname+'/public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
    socket.on('chat message', function (msg) {
      console.log('message: ' + msg);
    });
});
const users = {}
io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
  socket.on('type', (user) => {
  users[user] = user;
    io.emit('typing', Object.keys(users));
  });
  socket.on('no type', (user) => {
    delete users[user];
    io.emit('typing', Object.keys(users));
  });
});

server.listen(3000, function () {
  console.log('listening on PORT 3000');
});