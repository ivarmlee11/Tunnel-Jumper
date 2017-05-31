var express = require('express'),
    app = express(),
    path = require('path');

app.use(express.static(path.join(__dirname, '/')));

app.get('/', function (req, res) {
  res.render('index.html');
});

console.log('Server running.');

app.listen(3000 || process.env.PORT);