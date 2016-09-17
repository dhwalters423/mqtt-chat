var PORT = 9001;
var client;
// Create a client instance
function doConnect() {
  $("#mqtt-chat").append('<span class="text-warning"><span class="glyphicon glyphicon-warning-sign"></span>'
  + '&nbsp&nbspAttempting to connect to chat room broker...'
  + '</span><br>');
  client = new Paho.MQTT.Client(BROKER_URL, Number(PORT), "clientID");

  // set callback handlers
  client.connect({onSuccess:onConnect});
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
}


// called when the client connects
function onConnect() {
  $("#mqtt-chat").append('<span class="text-success"> <span class="glyphicon glyphicon-ok"></span>'
  + '&nbsp&nbspSuccessfully connected to '
  + BROKER_URL + ' on channel #' + CHANNEL + ' '
  + '</span><br>');

  client.subscribe("/mqtt-chat/" + CHANNEL);

  //display some more enter chat messages.
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  handleChatMessage(message);
}
