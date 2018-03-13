var socket = io();

socket.on('connect', function() {
   console.log('Connected to server')
});

socket.on('disconnect', function() {
    console.log('Disconnected from server')
})

socket.on('newMessage', function(data){
  var li = jQuery('<li></li>');
  li.text(`${data.from}: ${data.text}`)

  jQuery('#messages').append(li);
})

socket.on('newLocationMessage', function(data){
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank" >My current location</a>');

  li.text(`${data.from}: `);
  a.attr('href', data.url);
  li.append(a);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val(),
  }, function(message){
    console.log(message)
  })
})

var locationBtn = jQuery('#send-location');

locationBtn.on('click', function(){
  if(!navigator.geolocation){
    return aler('Geolocation not supported by Your browser')
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function() {
    alert('Unable to fetch location.');
  });
});
