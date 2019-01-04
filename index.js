const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const apiai = require('apiai');
const app = express()
const access = process.env.FB_ACCESS_TOKEN

app.set('port', (process.env.PORT || 5001))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.get('/', function(req, res) {
  res.send('Hello world')
})
app.post('/webhook', function(req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    var senderID = event.sender.id;
    if (event.message && event.message.text) {
      var messageText = event.message.text;
      console.log("senderID" + senderID + "messageText" + messageText);
      // var apiaiClientAccessToken = "YOUR_DIALOG_FLOW_CLENT_ACCESS_TOKEN";
      var apiaiClientAccessToken = "b93b7f46074e441fbb585c993c2ec1f7";
      var app = apiai(apiaiClientAccessToken);
      var responseJSON = {};
      var request = app.textRequest(messageText, {
        sessionId: "sessionId"
      });
      request.on('response', function(response) {
        messageText = response.result.fulfillment.speech;
        sendTextMessage(senderID, messageText);
      });
      request.on('error', function(error) {
        sendTextMessage(senderID, messageText);
      });
      request.end();
    }
  }
  res.sendStatus(200);
});

function sendTextMessage(senderID, messageText) {
  var messageData = {
    recipient: {
      id: senderID
    },
    message: {
      text: messageText
    }
  };
  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: access
    },
    method: 'POST',
    json: messageData
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
