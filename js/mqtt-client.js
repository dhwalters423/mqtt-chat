var client;
var SUBSCRIBE_TOPIC;
var SUBSCRIBE_USER_TOPIC;
var PUBLISH_USER_TOPIC;
var PUBLISH_LEAVE_TOPIC;
// Create a client instance
function doConnect() {
  SUBSCRIBE_TOPIC = "/mqtt-chat/" + CHANNEL + "/messages/#";
  SUBSCRIBE_USER_TOPIC = "/mqtt-chat/" + CHANNEL + "/users/#";
  PUBLISH_USER_TOPIC = "/mqtt-chat/" + CHANNEL + "/users/" + USERNAME;
  PUBLISH_TOPIC = "/mqtt-chat/" + CHANNEL + "/messages/" + USERNAME;

  var clientID = "user" + USERNAME + new Date().getTime().toString(36);

  var msg = 'Attempting to connect to chat room broker...';
  sendMetaMessage("warning", msg);

  client = new Paho.MQTT.Client(BROKER_URL, Number(PORT), clientID);

  // Set up last will and testament
  var disconnectMessage = new Paho.MQTT.Message(new ArrayBuffer);
  disconnectMessage.destinationName = PUBLISH_USER_TOPIC;
  disconnectMessage.retained = true;

  // set callback handlers
  client.connect({
    onSuccess:onConnect,
    onFailure:failedToConnect,
    willMessage:disconnectMessage
  });
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
}

function doDisconnect() {
  var msg = 'Disconnecting from ' + BROKER_URL + '...';
  sendMetaMessage("warning", msg);

  var disconnectMessage = new Paho.MQTT.Message(new ArrayBuffer);
  disconnectMessage.destinationName = PUBLISH_USER_TOPIC;
  disconnectMessage.retained = true;
  client.send(disconnectMessage);

  client.disconnect();

  $("#mqtt-users").empty();
}

// called when the client connects
function onConnect() {
  CONNECTED = true;
  setupConnectButton();

  var msg = 'Successfully connected to ' + BROKER_URL + ' on channel #' + CHANNEL;
  sendMetaMessage("success", msg);

  client.subscribe(SUBSCRIBE_TOPIC);
  client.subscribe(SUBSCRIBE_USER_TOPIC);

  var joinMessage = new Paho.MQTT.Message(USERNAME);
  joinMessage.destinationName = PUBLISH_USER_TOPIC;
  joinMessage.retained = true;
  client.send(joinMessage);
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
  $("#mqtt-users").empty();
  setupConnectButton();
}

// called when a message arrives
function onMessageArrived(message) {
  var topicResArr = message.destinationName.split("/");
  var topic = topicResArr[3];
  if (topic == "messages") {
    handleChatMessage(message);
  } else if (topic == "users") {
    handleUserMessage(message);
  }
}
