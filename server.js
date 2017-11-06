var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

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
    io.emit('button press', req.body);
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
