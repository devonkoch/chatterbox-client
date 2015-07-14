// var data4console;

$(document).ready(function(){
  var baseUrl = 'https://api.parse.com/1/classes/chatterbox';
  
  var message = {
    username: 'Cow',
    text: 'Moo',
    roomname: 'Barn'
  };

  var friendListObj = {};

  //Keep track of the rooms the user has created
  var userRooms = [];

  var setUsername = function(name){
    message.username = name;
    console.log(message.username);
  }

  var setText = function(messageText){
    message.text = messageText;
  }

  var setRoom = function(roomName){
    message.roomname = roomName;
  }

  var refreshMessages = function(){
    
    $('.message-container').empty();

    var selectedRoom = $('.rooms option:selected').text();

    $.get(baseUrl, function(data){
      if(selectedRoom){
        data.results = _.filter(data.results, function(room){
          return room.roomname === selectedRoom;
        });
      }

      var last10Messages = data.results.slice(0,10);
      
      _.each(last10Messages, function(messageObj){
        var $divMessage = $('<div class="message"></div>');
        if(friendListObj[messageObj.username]) {
          var $userName = $('<a class="strong"></a>');
        } else {
          var $userName = $('<a></a>');
        }
        var $messageText = $('<span></span>');
        $userName.text(messageObj.username);
        $messageText.text(': ' + messageObj.text);
        $userName.appendTo($divMessage);
        $messageText.appendTo($divMessage);
        $divMessage.appendTo($('.message-container'));
      });
    });
  }

  var postMessage = function(){ 
    $.post( baseUrl, JSON.stringify(message) );
  };

  var initRoomSelector = function(){
    
    var roomsDup = [];
    _.each(userRooms, function(room){
      roomsDup.push(room);
    })

    var setSelector = function(roomsList){
      _.each(roomsList, function(room){
        var $option = $('<option></option>');
        $option.text(room);
        $option.appendTo('.rooms');
      });
    };

    $.get(baseUrl, function(data){
      
      _.each(data.results, function(messageObj){
        roomsDup.push(messageObj.roomname);
      });

      var rooms = _.uniq(roomsDup);

      setSelector(rooms);
    });
  };

  initRoomSelector();

  //
  // Click handlers
  //

  $('.refresh').on('click', function(){
    refreshMessages();
  });

  $('.submit-username').on('click', function(){
    setUsername($('.set-username').val());
    $('.submit-username').remove();
    $('.set-username').remove();

    $('.username-flag').text("Posting as: " + message.username);
  });

  $('.submit-post').on('click', function(){
    setRoom($('.rooms option:selected').text());
    setText($('.post-text').val());
    postMessage();
    refreshMessages();
  });

  $('.submit-new-room').on('click', function(){
    var submittedRoom = $('.set-new-room').val()
    setUsername(submittedRoom);
    userRooms.push(submittedRoom);
    initRoomSelector();
  });

  $('.message-container').on('click', 'a', function(){
    
    if(!($(this).text() in friendListObj)) {
      var $friendName = $('<li>' + $(this).text() + '</li>');;
      var $friendList = $('#friend-list');

      $friendName.appendTo($friendList);
      friendListObj[$(this).text()] = true;
      console.log(friendListObj);
    }

  });

});














