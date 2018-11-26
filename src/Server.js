const http     = require('http');
const express  = require('express');
const socketio = require('socket.io');

const setup  = require('../setup.json');
const Game   = require('./game');
const scores = require('./scores');


/* --- App Setup --- */

const app = express();

app.use(express.static('client/build'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.Server(app);
const io = socketio(server);


/* --- Game Setup --- */

let numbers = {};
let game;
let endTimeout = -1;


/* --- socket.io --- */

function gameTickEvent(time) {
	console.log('time: ', time);
	io.of('/').emit('time', time);
}

function gameUpdateEvent(data) {
	console.log('data update');
	io.of('/').emit('data', data)
}

function emitGameState() {
	io.of('/').emit('data', game.getState());
}

function emitScoresState() {
	io.of('/').emit('data', scores.getState());
}

function updateClients() {
	if (game) {
		emitGameState();
	} else emitScoresState();
}

io.on('connection', socket => {
	console.log('User Connected');

	updateClients();

	socket.on('disconnect', () => {
		console.log('User Disconnected');
	});
});


/* --- Routes --- */

// -- Submit

app.post('/submit', (req, res) => {
	const { number, message } = req.body;

	if (game) {
		const response = game.submit(number, message);

		res.send(response);
	} else {
		const table = parseInt(message);

		if (isFinite(table)) {
			if (table > 0 && table <= setup.numTables) {
				numbers[number] = table;

				updateClients();

				res.send(`You are now signed up for table ${ table }`);
			} else res.send(`Table ${ table } does not exist.`);
		} else res.send('Please enter a valid table number to sign up');
	}
});

// -- Start a round

app.get('/start/:questionID', (req, res) => {
	const questionID = parseInt(req.params.questionID);

	if (isFinite(questionID)) {
		clearInterval(endTimeout);

		game = new Game(questionID, numbers);
		res.send(`New game: Would they rather ${ game.options[0] } or ${ game.options[1] }`);

		game.on('tick', gameTickEvent);
		game.on('update', gameUpdateEvent);

		game.emitUpdate();

	} else res.send('Invalid game ID');
});

// -- End a round

app.get('/end/:choice', (req, res) => {
	const choice = parseInt(req.params.choice);

	if (isFinite(choice)) {
		clearInterval(endTimeout);
		
		const newScores = game.end(choice);

		scores.applyGameScores(newScores);

		endTimeout = setTimeout(() => {
			emitScoresState();
			game.removeAllListeners();
			game = null;
		}, 5000);

		res.send('Game Ended');
	} else res.send('Invalid choice');
});

// -- Get round summary (for testing purposes)

app.get('/summary', (req, res) => {
	res.json(getServerState());
});

module.exports = server;