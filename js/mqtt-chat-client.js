var BROKER_URL;
var USERNAME;
var CHANNEL;
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
     return null;
  }
  else{
     return results[1] || 0;
  }
}
function scrolledDown() {
  var element = $("#mqtt-chat");
  return (element[0].scrollHeight - element.scrollTop()) % element.outerHeight() < 20;
}
function handleChatMessage(message) {
  $("#mqtt-chat").append(message.payloadString + '<br>');
  if (scrolledDown("#mqtt-chat")) {
     $("#mqtt-chat").animate({ scrollTop: $('#mqtt-chat')[0].scrollHeight}, 1000);
  }
}

$(document).ready(function() {
  BROKER_URL = $.urlParam("broker");
  if (BROKER_URL != null) {
    $("#mqtt-broker").val(BROKER_URL);
  }
  USERNAME = $.urlParam("username");
  if (USERNAME == null) {
    USERNAME = "Anonymous"
  }
  CHANNEL = "mqtt-chat-channel"; //Can be changed later for multiple channel support.
  $("#mqtt-chat").scroll(function(){
    currentlyScrolling = true;
  });
  doConnect();
});
