var BROKER_URL;
var PORT;
var USERNAME;
var CHANNEL;
var CONNECTED = false;

var users = [];

// Function to extract URL parameters.
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
     return null;
  }
  else{
     return results[1] || 0;
  }
}

// Handles sending a message to the broker.
function sendChatMessage() {
  if (CONNECTED) {
    if ($("#chat-input").val().length > 0) {
      var message = new Paho.MQTT.Message($("#chat-input").val());
      message.destinationName = PUBLISH_TOPIC;
      client.send(message);
      $("#chat-input").val('');
    }
  } else {
    sendMetaMessage("danger", "Cannot send message, not connected.");
  }
}

// Set up reply button.
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

// Set up connect button.
function setupConnectButton() {

  if (!CONNECTED) {
    $("#connect-button").unbind();
    $("#connect-button").removeClass("btn-warning");
    $("#connect-button").addClass("btn-info");
    $("#connect-button").html('Connect');

    $("#mqtt-broker").removeAttr("disabled");
    $("#mqtt-port").removeAttr("disabled");
    $("#username-input").removeAttr("disabled");

    $("#connect-button").click(function() {
      USERNAME = $("#username-input").val();
      if (USERNAME == null || USERNAME == '') {
        USERNAME = 'Anonymous';
        $("#username-input").val('Anonymous');
      }

      var validated = true;
      BROKER_URL = $("#mqtt-broker").val();
      if (BROKER_URL == null || BROKER_URL == '') {
        sendMetaMessage("danger", "No broker specified.");
        validated = false;
      }
      PORT = $("#mqtt-port").val();
      if (PORT == null || isNaN(PORT) || PORT == '') {
        sendMetaMessage("danger", "No port specified, or port is invalid.");
        validated = false;
      }

      if (validated) {
        doConnect();
      }
    });
  } else {
    $("#connect-button").unbind();
    $("#connect-button").removeClass("btn-info");
    $("#connect-button").addClass("btn-warning");
    $("#connect-button").html('Disconnect');

    $("#mqtt-broker").attr("disabled", "disabled");
    $("#mqtt-port").attr("disabled", "disabled");
    $("#username-input").attr("disabled", "disabled");

    $("#connect-button").click(doDisconnect);
  }
}
// see if the user has scrolled to the bottom of the chat pane,
// if not, it will not auto scroll.
function scrolledDown() {
  var element = $("#mqtt-chat");
  return (element[0].scrollHeight - element.scrollTop()) % element.outerHeight() < 20;
}

// Ensures no HTML or JS script injection can occur by escaping all html characters.
// Probably should be expanded.
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

function updateUserListUI (){
  $("#mqtt-users").empty();
  users.sort();
  users.forEach(function(user){
    $("#mqtt-users").append('<span class="text-info" id="' + sanitize(user) + '">'
      + '<strong>@' + sanitize(user) + '</strong>'
      + '</span><br>');
    });
}
// Adds a user to the user list
function addUser(user) {
  users.push(user);
  updateUserListUI();
}
function removeFromUserList(user) {
  var index = users.indexOf(user);
  if (index !== -1) {
      users.splice(index, 1);
  }
}
function removeUser(user) {
  removeFromUserList(user);
  updateUserListUI();
}

// Handles an incoming MQTT chat message.
function handleChatMessage(message) {
  var topicResArr = message.destinationName.split("/");
  var topic = topicResArr[4];
  var msg = message.payloadString;
  var user;

  user = topicResArr[4];
  $("#mqtt-chat").append(
    '<strong><span class="text-info">@' + sanitize(user) + '</strong></span>'
    + '&nbsp' + sanitize(msg)
    + '<br>'
  );

  if (scrolledDown("#mqtt-chat")) {
     $("#mqtt-chat").animate({ scrollTop: $('#mqtt-chat')[0].scrollHeight}, 1000);
  }
}

function handleUserMessage(message) {
  var topicResArr = message.destinationName.split("/");
  var user = topicResArr[4];
  var announceMsg;
  if (message.payloadBytes.length == 0) {
    announceMsg = 'User <strong>@' + sanitize(user) + '</strong> has left the channel.';
    removeUser(user);
  } else {
    announceMsg = 'User <strong>@' + sanitize(user) + '</strong> has joined the channel.';
    addUser(user)
  }
  sendMetaMessage("info", announceMsg);
}

// Builds and appends a meta chat message (error, info, or warning messages)
function sendMetaMessage (context, msg) {
  var glyphicon;
  switch (context) {
    case "danger" : glyphicon = "glyphicon-remove-sign"; break;
    case "warning" : glyphicon = "glyphicon-warning-sign"; break;
    case "success" : glyphicon = "glyphicon-ok"; break;
    case "info" : glyphicon = "none"; break;
  }

  if (glyphicon != "none") {
    $("#mqtt-chat").append('<span class="text-' + context +'">'
      + '<span class="glyphicon ' + glyphicon + '"></span>'
      + '&nbsp&nbsp' + msg
      + '</span><br>');
  } else {
    $("#mqtt-chat").append('<span class="text-' + context + '">'
      + '&nbsp&nbsp' + msg + '</span><br>');
  }
  if (scrolledDown("#mqtt-chat")) {
     $("#mqtt-chat").animate({ scrollTop: $('#mqtt-chat')[0].scrollHeight}, 1000);
  }
}



$(document).ready(function() {

  setupConnectButton();
  BROKER_URL = $.urlParam("broker");
  if (BROKER_URL != null) {
    $("#mqtt-broker").val(BROKER_URL);
  }
  PORT = $.urlParam("port");
  if (PORT != null) {
    $("#mqtt-port").val(PORT);
  }
  USERNAME = $.urlParam("username");
  if (USERNAME != null) {
    $("#username-input").val(USERNAME);
  } else {
    USERNAME = "Anonymous"
  }
  CHANNEL = "mqtt-chat-channel"; //Can be changed later for multiple channel support.
  if (CHANNEL != null) {
    $("#channel-input").val(CHANNEL);
  }
});
