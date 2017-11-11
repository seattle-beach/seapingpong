var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var PingPong = require('./public/game');
var pp = new PingPong();

app.use(express.static('public'));
app.use(bodyParser.json());
app.get('/', function(req, res){
    res.render('/index.html');
});
app.get('/ping', function(req, res){
    res.send('pong');
});

app.post('/score', function (req, res) {
    console.log(req.body);
    var json = req.body;
    pp.handleButtonPress(json.btn_id, json.duration);
    io.emit('button press', pp);
    res.json(req.body);
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

var port = process.env.PORT || 3000;
http.listen(port, function(){
    console.log('listening on *:' + port);
});
