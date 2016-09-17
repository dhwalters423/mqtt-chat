var PORT = 9001;
var client;
// Create a client instance
function doConnect() {
  console.log("Attempting to connect to broker.");
  client = new Paho.MQTT.Client(BROKER_URL, Number(PORT), "clientID");

  // set callback handlers
  client.connect({onSuccess:onConnect});
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
}


// called when the client connects
function onConnect() {
  console.log("connected")
  //display some connection messages.

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
  $("#mqtt-chat").append(message.payloadString + '<br>')
}
