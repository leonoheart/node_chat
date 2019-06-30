function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

function divSystemContentElement() {
  return $('<div></div>').html('<i>Unrecognized command.</i>');
}

function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var messageFlg = chatApp.processCommand(message);

  switch(messageFlg){
    case 3:
      $('#messages').append(divSystemContentElement());
      break;
    case 1:
      break;
    case 2:
      var words = message.split('');
      words.shift();
      var guest = words[0];
      words.shift();
      var text = words.join(' ');
      chatApp.atSomebody($('#room').text(), guest, text);
      $('#messages').append(divEscapedContentElement(guestMessage));
      $('#messages').scrollTop($('#messages').prop('scrollHeight'));
      break;
    case 0:
      chatApp.sendMessage($('#room').text(), message);
      $('#messages').append(divEscapedContentElement(message));
      $('#messages').scrollTop($('#messages').prop('scrollHeight'));
      break;
  }

  $('#send-message').val('');
}

var socket = io.connect();

$(document).ready(function() {
  var chatApp = new Chat(socket);

  socket.on('nameResult', function(result) {
    var message;

    if (result.success) {
      message = 'You are now known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', function(result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  socket.on('message', function (message) {
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  socket.on('rooms', function(rooms) {
    $('#room-list').empty();

    for(var room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }

    $('#room-list div').click(function() {
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });

  setInterval(function() {
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();

  $('#send-form').submit(function() {
    processUserInput(chatApp, socket);
    return false;
  });
});
