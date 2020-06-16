var express = require('express');
var app = express();
var path = require("path");
var batch = require("./static/assets/js/batch.js");

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
  app.use(express.static(__dirname + '/static'));
});
app.listen(3000, function () {
  console.log('App listening on http://localhost:3000!');
});
