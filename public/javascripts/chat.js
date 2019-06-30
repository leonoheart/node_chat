var Chat = function(socket) {
  this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(room) {
  this.socket.emit('join', {
    newRoom: room
  });
};

Chat.prototype.atSomebody = function(room, guest, text) {
  var guestMessage = {
    room: room,
    guest: room,
    text: text
  };
  this.socket.emit('guestMessage', guestMessage);
}

Chat.prototype.processCommand = function(command) {
  var words = command.split(' ');
  var command = words[0]
                .substring(1, words[0].length)
                .toLowerCase();
  var messageFlg = 0;

  switch(command) {
    case 'join':
      words.shift();
      var room = words.join(' ');
      this.changeRoom(room);
      messageFlg = 1;
      break;
    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name);
      messageFlg = 1;
      break;
    case 'at':
      messageFlg = 2;
      break;
    default:
      message = 'Unrecognized command.';
      messageFlg = 3;
      break;
  };

  return message;
};
