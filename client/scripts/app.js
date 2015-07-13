var data4console;

$(document).ready(function(){

  var getMessages = function(){
    
    $('.message-container').empty();

    $.get('https://api.parse.com/1/classes/chatterbox', function(data){
      


      data4console = data;

      last10Messages = data.results.slice(0,10);
      
      _.each(last10Messages, function(messageObj){
        var $divMessage = $('<div class="message"></div>');;
        $divMessage.text(messageObj.text);
        $divMessage.appendTo($('.message-container'));
      });



    });
  }

  $('.refresh').on('click', function(){
    getMessages();
  });


});