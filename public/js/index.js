var socket = io();

function scrollToBottom () {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}


socket.on('connect', function() {
   console.log('Connected to server')
});

socket.on('disconnect', function() {
    console.log('Disconnected from server')
})

socket.on('newMessage', function(data){
  var formattedTime = moment(data.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: data.text,
    from: data.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
})

socket.on('newLocationMessage', function(data){
  var formattedTime = moment(data.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: data.from,
    createdAt: formattedTime,
    url: data.url
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val(),
  }, function(message){
    messageTextBox.val('');
    console.log(message)
  })
})

var locationBtn = jQuery('#send-location');

locationBtn.on('click', function(){
  if(!navigator.geolocation){
    return aler('Geolocation not supported by Your browser')
  }

  locationBtn.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationBtn.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function() {
    locationBtn.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
