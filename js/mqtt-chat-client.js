var BROKER_URL;
var USERNAME;
var CHANNEL;
var CONNECTED = false;
var SUBSCRIBE_TOPIC;
var PUBLISH_TOPIC;
var PUBLISH_ANNOUNCE_TOPIC;

$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
     return null;
  }
  else{
     return results[1] || 0;
  }
}

function sendChatMessage() {
  if (CONNECTED) {
    if ($("#chat-input").val().length > 0) {
      var message = new Paho.MQTT.Message($("#chat-input").val());
      message.destinationName = PUBLISH_TOPIC;
      client.send(message);
      $("#chat-input").val('');
    }
  } else {
    $("#mqtt-chat").append('<span class="text-danger"> <span class="glyphicon glyphicon-remove-sign"></span>'
    + '&nbsp&nbspCannot send message, not connected.'
    + '</span><br>');
  }
}

$("#reply-button").click(sendChatMessage);
window.onkeydown = function (event) {
  var code = event.keyCode ? event.keyCode : event.which;
  if (code === 13) { // 13 == enter key
    if ($('#chat-input').is(':focus')) {
      event.preventDefault();
      sendChatMessage();
    }
  }
};
function setupConnectButton() {
  $("#connect-button").click(function() {
    USERNAME = $("#username-input").val();
    if (USERNAME == null || USERNAME == '') {
      USERNAME = 'Anonymous';
      $("#username-input").val('Anonymous');
    }
    BROKER_URL = $("#mqtt-broker").val();
    if (BROKER_URL == null || BROKER_URL == '') {
      $("#mqtt-chat").append('<span class="text-danger"> <span class="glyphicon glyphicon-remove-sign"></span>'
        + '&nbsp&nbspCannot connect, no broker URL provided.'
        + '</span><br>');
    } else {
      doConnect();
    }
  });
}
setupConnectButton();

function scrolledDown() {
  var element = $("#mqtt-chat");
  return (element[0].scrollHeight - element.scrollTop()) % element.outerHeight() < 20;
}
function sanitize(string) {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };
  return String(string).replace(/[&<>"'\/]/g, function (c) {
    return entityMap[c];
  });
}
function handleChatMessage(message) {
  var topicResArr = message.destinationName.split("/");
  var topic = topicResArr[3];
  var msg = message.payloadString;
  var user;
  if (topic == "new-user") {
    user = msg;
    $("#mqtt-chat").append(
      '<span class="text-info">User <strong>@' + sanitize(user) + '</strong> has joined the channel!</span>'
      + '<br>'
    );
  } else {
    user = topicResArr[3];
    $("#mqtt-chat").append(
      '<strong><span class="text-info">@' + sanitize(user) + '</strong></span>'
      + '&nbsp' + sanitize(msg)
      + '<br>'
    );
  }
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
  if (USERNAME != null) {
    $("#username-input").val(USERNAME);
  }
  if (USERNAME == null) {
    USERNAME = "Anonymous"
  }
  CHANNEL = "mqtt-chat-channel"; //Can be changed later for multiple channel support.
});
