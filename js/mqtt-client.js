var PORT = 9001;
var client;
// Create a client instance
function doConnect() {
  var clientID = "user" + USERNAME + new Date().getTime().toString(36);
  $("#mqtt-chat").append('<span class="text-warning"><span class="glyphicon glyphicon-warning-sign"></span>'
    + '&nbsp&nbspAttempting to connect to chat room broker...'
    + '</span><br>');
  client = new Paho.MQTT.Client(BROKER_URL, Number(PORT), clientID);

  // set callback handlers
  client.connect({onSuccess:onConnect});
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
}


// called when the client connects
function onConnect() {
  $("#connect-button").unbind();
  $("#connect-button").removeClass("btn-info");
  $("#connect-button").addClass("btn-success disabled");
  $("#connect-button").html(
    '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Connected'
  );

  SUBSCRIBE_TOPIC = "/mqtt-chat/" + CHANNEL + "/#";
  PUBLISH_ANNOUNCE_TOPIC = "/mqtt-chat/" + CHANNEL + "/new-user"
  PUBLISH_TOPIC = "/mqtt-chat/" + CHANNEL + "/" + USERNAME;
  CONNECTED = true;

  $("#mqtt-chat").append('<span class="text-success"> <span class="glyphicon glyphicon-ok"></span>'
    + '&nbsp&nbspSuccessfully connected to '
    + BROKER_URL + ' on channel #' + CHANNEL + ' '
    + '</span><br>');
  client.subscribe(SUBSCRIBE_TOPIC);

  var message = new Paho.MQTT.Message(USERNAME);
  message.destinationName = PUBLISH_ANNOUNCE_TOPIC;
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  CONNECTED = false;
  $("#mqtt-chat").append('<span class="text-danger"> <span class="glyphicon glyphicon-remove-sign"></span>'
    + '&nbsp&nbspConnection to '
    + BROKER_URL + ' has been lost! <br>'
    + responseObject.errorMessage
    + '</span><br>');
    setupConnectButton();
    $("#connect-button").removeClass();
    $("#connect-button").addClass("btn btn-info");
    $("#connect-button").html('Connect');
}

// called when a message arrives
function onMessageArrived(message) {
  handleChatMessage(message);
}
