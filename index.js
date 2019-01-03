let express = require('express')
let bodyParser = require('body-parser') const request = require('request')
let apiai = require('apiai');
let app = express()
app.set('port', (process.env.PORT || 5001)) app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json()) app.get('/', function(req, res) {
  res.send('Hello world')
})
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === "facebookdemoechatbot") {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, no entry')
})
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
