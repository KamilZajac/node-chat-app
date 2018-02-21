const path = require('path');
const http = require('http');
const express = require('express');
const publicPath = path.join(__dirname, '/../public');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('disconnected')
    })

    socket.on('createMessage', (data)=>{
      console.log(data)
      io.emit('newMessage', {
        from: data.from,
        text: data.text,
        createdAt: new Date().getTime()
      })
    });
  });




server.listen(port, () => {
    console.log(`server on ${port}`)
});
