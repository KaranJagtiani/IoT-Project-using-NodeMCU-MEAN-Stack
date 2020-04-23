const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
var mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');

const mongoOpts = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};

const db = mongoose.connect('mongodb://localhost:27017/iot', mongoOpts, (err, res) => {
	if (err) {
		console.log(err);
	}
	else {
		console.log('Connected to: ', db, ' ', res);
	}
});

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const users = require('./routes/route');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users', users);

app.get('*', (req, res) => {
	res.sendFile(__dirname + '\\public\\index.html');
});

// Add your broker service link here.
var client = mqtt.connect('mqtt://key:secret@broker_service', {
	clientId: 'Server'
});

const myClientList = {};

// Socket Connection
io.on("connection", (socket) => {
	myClientList[socket.id] = socket;

	socket.on('new-message', (message) => {
		console.log("Socket: "+message);
		client.publish('appliance', message)
		myClientList[socket.id].emit('new-message', message);
	});

	socket.on('disconnect', (socket) => {
		console.log("\nDisconnected");
		delete myClientList[socket.id];
	})
});

// MQTT Connection
client.on('connect', () => {
	client.subscribe('/connected', msg => {
	});
});

client.on('message', function (topic, message) {
	console.log(topic, message.toString());
	io.emit('new-message', message.toString());
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log('Server Started on port: ' + port);
});