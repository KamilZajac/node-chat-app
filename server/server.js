const path = require('path');
const http = require('http');
const express = require('express');
const publicPath = path.join(__dirname, '/../public');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const{generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    socket.on('join', (params, callback) => {
      if(!isRealString(params.name) || !isRealString(params.room)) {
        return callback('Name and room name are required')
      }

      socket.join(params.room);

      users.removeUser(socket.id);

      users.addUser(socket.id, params.name, params.room);

      io.to(params.room).emit('updateUserList', users.getUserList(params.room));

      socket.emit('newMessage', generateMessage('Admin', 'welcome to chat app'));

      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

      callback()
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user) {
          io.to(user.room).emit('updateUserList', users.getUserList(user.room));
          io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });



    socket.on('createMessage', (data, callback)=>{
      io.emit('newMessage', generateMessage(data.from, data.text))
      callback('This is from server');
    });


  socket.on('createLocationMessage', (coords)=>{
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  });
  });


server.listen(port, () => {
    console.log(`server on ${port}`)
});
