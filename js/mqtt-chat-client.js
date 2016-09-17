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
$( document ).ready(function() {

  BROKER_URL = $.urlParam("broker");
  if (BROKER_URL != null) {
    $("#mqtt-broker").val(BROKER_URL);
  }

  USERNAME = $.urlParam("username");
  if (USERNAME != null) {
    //do something with it
  } else {
    USERNAME = "Guest"
  }

  CHANNEL = "mqtt-chat-channel"; //Can be changed later for multiple channel support.

  doConnect();
  // connect the client
  //client.connect({onSuccess:onConnect});
});
