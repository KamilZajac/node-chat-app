const path = require('path');
const http = require('http');
const express = require('express');
const publicPath = path.join(__dirname, '/../public');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const{generateMessage} = require('./utils/message');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    // console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('disconnected')
    });

    socket.emit('newMessage', generateMessage('Admin', 'welcome to chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user joined'));

    socket.on('createMessage', (data, callback)=>{
      console.log(data)
      io.emit('newMessage', generateMessage(data.from, data.text))
      callback('This is from server');
    });
  });




server.listen(port, () => {
    console.log(`server on ${port}`)
});
