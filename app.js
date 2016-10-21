'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const locSchema = require('./models/location');

mongoose.connect('mongodb://<user>:<pass>@ds023593.mlab.com:23593/lyoujs');

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/view', (req, res) => {
	res.sendFile(__dirname + '/socket.html');
})

app.post('/location', (req, res) => {
	/* POST DATA STUFF */
	let data = req.body.data;
	data.useragent = req.headers['user-agent'];
	data.ip = req.ip.replace("::ffff:", "");
	console.log(data);
	
	/* SOCKET IO STUFF */
	io.emit('chat message', `${data.timestamp}: Latitude: ${data.lat} Longitude: ${data.long} Accuracy: ${data.accuracy} User-Agent: ${data.useragent} IP: ${data.ip}`);
	
	
	/* MONGOOSE STUFF */ 
	let newLoc = new locSchema();
	newLoc.timestamp = data.timestamp,
	newLoc.lat = data.lat,
	newLoc.long = data.long,
	newLoc.accuracy = data.accuracy,
	newLoc.useragent = data.useragent,
	newLoc.ip = data.ip;
	
	newLoc.save(function (err) {
		if (err)
			console.log(err);
		io.emit('chat message', 'DB OK');
	});
	
	/* RESPONSE STUFF */
	res.sendFile(__dirname + '/index.html');
})


http.listen(8080, function () {
	console.log('listening on *:8080');
});