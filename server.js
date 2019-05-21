var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var Mongostore = require('connect-mongo')(session);
var http = require('http').Server(app);
var io = require('socket.io')(http);

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testFor', { useMongoClient: true });
var db = mongoose.connection;

app.use(cors())


//use sessions for tracking logins
app.use(session({
    secret:'work hard',
    resave:true,
    saveUninitialized: false,
    store: new Mongostore({
        mongooseConnection: db
    })
}));

//parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false
}));

// //serve files from template
// app.use(express.static(_dirname + '/templateLogReg'));

//include routes
var routes = require('./routes/router');
app.use('/', routes);

//catch 404 and forward to error handle
app.use(function (req, res, next) {
    var err = new Error('File not found');
});

//error handler
//define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

io.on('connection', () =>{
    console.log('a user is connected');
});

app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});

