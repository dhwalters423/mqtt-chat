var client;

// Create a client instance
function doConnect() {
  var clientID = "user" + USERNAME + new Date().getTime().toString(36);

  var msg = 'Attempting to connect to chat room broker...';
  sendMetaMessage("warning", msg);

  client = new Paho.MQTT.Client(BROKER_URL, Number(PORT), clientID);

  // set callback handlers
  client.connect({
    onSuccess:onConnect,
    onFailure:failedToConnect
  });
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
}


function doDisconnect() {
  var msg = 'Disconnecting from ' + BROKER_URL + '...';
  sendMetaMessage("warning", msg);
  client.disconnect();
}

// called when the client connects
function onConnect() {
  CONNECTED = true;
  setupConnectButton();

  SUBSCRIBE_TOPIC = "/mqtt-chat/" + CHANNEL + "/#";
  PUBLISH_ANNOUNCE_TOPIC = "/mqtt-chat/" + CHANNEL + "/new-user"
  PUBLISH_TOPIC = "/mqtt-chat/" + CHANNEL + "/" + USERNAME;
  CONNECTED = true;

  var msg = 'Successfully connected to ' + BROKER_URL + ' on channel #' + CHANNEL;
  sendMetaMessage("success", msg);

  client.subscribe(SUBSCRIBE_TOPIC);

  var message = new Paho.MQTT.Message(USERNAME);
  message.destinationName = PUBLISH_ANNOUNCE_TOPIC;
  client.send(message);

}

function failedToConnect(error) {
  var msg = 'Failed to connect to ' + BROKER_URL + ':<br>'
    + error.errorMessage;
  sendMetaMessage("danger", msg);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  CONNECTED = false;
  var msg = 'Connection to ' + BROKER_URL + ' has been lost! <br>'
  + responseObject.errorMessage;
  sendMetaMessage ("danger", msg);

  setupConnectButton();
}

// called when a message arrives
function onMessageArrived(message) {
  handleChatMessage(message);
}
