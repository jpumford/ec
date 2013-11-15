var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

var mysql = require('mysql');

var fs = require('fs');

var config = require('./config');

var mode = process.argv[2] != undefined ? process.argv[2] : 'dev';
if (mode != 'dev' && mode != 'prod') {
	throw new Exception("Must select prod or dev server");
}

if (mode == 'prod') {
	app.use(express.static(__dirname + '/dist'));
	app.use('/pictures', express.static(__dirname + '/pictures'));
	app.use(express.static(__dirname + '/res'));
	var port = config.prod.port;
} else {

	app.use(express.static(__dirname + '/.tmp'));
	app.use(express.static(__dirname + '/app'));
	app.use("/pictures", express.static(__dirname + '/pictures'));
	app.use(express.static(__dirname + '/res'));
	var port = config.dev.port;
}

app.use(express.bodyParser());

function getMySQLConnection() {
	var connection = mysql.createConnection(config.mysql);
	connection.connect(function(error) {
		if (error) {
			throw new Error("Could not connect to mysql server!");
		}
	});
	return connection;
}

app.get('/images', function(req, res) {
	try {
		var connection = getMySQLConnection();
		connection.query("SELECT * from EC.Pictures", function(err, rows, fields) {
			if (err) {
				res.json({status: 'error', data: {}});
				console.log(err);
			} else {
				res.json({status: 'ok', data: {pictures: rows}});
			}
		});
		connection.end();
	} catch (e) {
		res.json({status: 'error', data: {}});
		console.log(e);
	}
});

app.post('/upload', function(req, res) {
	console.log(req.files);
	if (req.body.name == undefined) {
		res.json({status: 'error', data: {message: "Please include a name"}});
		return;
	}
	if (req.files.file == undefined) {
		res.json({status: 'error', data: {message: "No file specified"}});
		return;
	}
	// insert into the db
	try {
		var connection = getMySQLConnection();
		var extension = req.files.file.originalFilename.split(".").pop();
		connection.query("INSERT INTO EC.Pictures SET ?", {description: req.body.name, filetype: extension}, function(err, result) {
			res.json({status: 'ok', data: {id: result.insertId, description: req.body.name, filetype: extension}});
			connection.end();
			fs.readFile(req.files.file.path, function(err, data) {
				if (err) {
					res.json({status: 'error', data: {}});
					console.log(err);
					return;
				} else {
					var newPath = __dirname + '/pictures/' + result.insertId + "." + extension;
					fs.writeFile(newPath, data, function(err) {
						if (err) {
							console.log(err);
							res.json({status: 'error', data: {}});
						}
					});
				}
			});
		});
	} catch (e) {
		res.json({status: 'error', data: {error: e}});
		connection.end();
		return;
	}
});

var userNames = (function () {
	var users = [];
	var userHashTranslation = [];

	var claim = function (name, id) {
		if (!name || users[name]) {
			return false;
		} else {
			users[name] = id;
			userHashTranslation[id] = name;
			return true;
		}
	};

	// find the lowest unused "guest" name and claim it
	var getGuestName = function (id) {
		var name, nextUserId = 1;

		do {
			name = 'Guest ' + nextUserId;
			nextUserId += 1;
		} while (!claim(name, id));

		return name;
	};

	// serialize claimed names as an array
	var get = function () {
		return users;
	};

	var getNameFromId = function(id) {
		return userHashTranslation[id];
	};

	var free = function (name) {
		if (users[name]) {
			delete userHashTranslation[users[name]];
			delete users[name];
		}
	};

	return {
		claim: claim,
		free: free,
		get: get,
		getGuestName: getGuestName,
		getNameFromId: getNameFromId
	};
}());

function getClientsInRoom(room) {
	var namesInRoom = [];
	var clientIdsInRoom = io.sockets.clients(room);
	for (var index in clientIdsInRoom) {
		namesInRoom.push(userNames.getNameFromId(clientIdsInRoom[index].id));
	}
	return namesInRoom;
}

io.sockets.on('connection', function(socket) {
	var name = userNames.getGuestName(socket.id);
	var room = "all";
	socket.join(room);

	socket.emit('init', {
		name: name,
		users: getClientsInRoom(room),
		room: room
	});

	socket.broadcast.to('all').emit('user:join', {
	name: name
	});

	socket.on('send:message', function (data) {
		socket.broadcast.to(room).emit('send:message', {
			user: name,
			text: data.message
		});
	});

	// validate a user's name change, and broadcast it on success
	socket.on('change:name', function (data, fn) {
		if (userNames.claim(data.name, socket.id)) {
			var oldName = name;
			userNames.free(oldName);

			name = data.name;

			socket.broadcast.to(room).emit('change:name', {
				oldName: oldName,
				newName: name
			});

			fn(true);
		} else {
			fn(false);
		}
	});

	socket.on('change:room', function(data) {
		socket.broadcast.to(room).emit('user:left', {
			name: name
		});
		socket.leave(room);
		socket.join(data.room);
		room = data.room;
		socket.emit('users', {
			users: getClientsInRoom(room)
		});
		socket.broadcast.to(room).emit('user:join', {
			name: name
		});
	});

	// clean up when a user leaves, and broadcast it to other users
	socket.on('disconnect', function () {
		socket.broadcast.emit('user:left', {
			  name: name
		});
		userNames.free(name);
	});
});

server.listen(port);

console.log("Listening on port " + port);
