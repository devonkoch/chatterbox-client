// var data4console;

$(document).ready(function(){
  var baseUrl = 'https://api.parse.com/1/classes/chatterbox';
  
  var message = {
    username: 'Cow',
    text: 'Moo',
    roomname: 'Barn'
  };


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
        var $userName = $('<span></span>');
        var $messageText = $('<span></span>');
        $userName.text(messageObj.username + ': ');
        $messageText.text(messageObj.text);
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
    setText($('.post-text').val());
    postMessage();
    refreshMessages();
  });

  

  //postMessage(message);
});