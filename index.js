var express = require('express'),
    app = express(),
    path = require('path');

app.use(express.static(path.join(__dirname, '/')));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(3000, function () {
  console.log('running on 3000');
});