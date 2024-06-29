const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/test', function (req, res) {
    res.send('Health Care Portal Working');
});

app.get('/', function (req, res) {
    index = fs.readFileSync(path.join(__dirname, 'build', 'index.html'));
    res.writeHead(200);
    res.write(index);
    res.end();
});

app.listen(8080, function() {
  console.log('Server running on port %s', 8080);
});