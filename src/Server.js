const http     = require('http');
const express  = require('express');
const socketio = require('socket.io');
const twilio   = require('twilio');
const jsonfile = require('jsonfile');
const path     = require('path');

const throttle = require('lodash/throttle');

const setup  = require('../setup.json');
const Game   = require('./game');
const tables = require('./tables');

const questions = require('../data/questions');


/* --- App Setup --- */

const MessagingResponse = twilio.twiml.MessagingResponse;
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

jsonfile.readFile(path.resolve(__dirname, '../numbers-backup.json'), (err, obj) => {
	if (!err) {
		numbers = obj;
	}
});

setInterval(() => {
	console.log('numbers backup');
	jsonfile.writeFile(path.resolve(__dirname, '../numbers-backup.json'), numbers);
}, 1000 * 30);

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
	io.of('/').emit('data', tables.getState());
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


/* --- Server Functions --- */

function submitMessage(number, message) {
	if (game) {
		const response = game.submit(number, message);

		return response;
	} else {
		const table = parseInt(message);

		if (isFinite(table)) {
			if (table > 0 && table <= setup.numTables) {
				numbers[number] = table;

				tables.registerTable(table);
				updateClients();

				return `You are now signed up for table ${ table }`;
			} else return `Table ${ table } does not exist.`;
		} else return 'Please enter a valid table number to sign up';
	}
}


/* --- Routes --- */

// -- Submit

app.post('/submit', (req, res) => {
	const { number, message } = req.body;

	res.send(submitMessage(number, message));
});

app.post('/sms', (req, res) => {
	const { From, Body } = req.body;

	const twiml = new MessagingResponse();
	twiml.message(submitMessage(From, Body));

	res.writeHead(200, { 'Content-Type': 'text/xml' });
	res.end(twiml.toString());
});

// -- Start a round

app.get('/start/:questionID', (req, res) => {
	const questionID = parseInt(req.params.questionID);

	if (isFinite(questionID)) {
		clearInterval(endTimeout);

		game = new Game(questionID, numbers);
		//res.send(`New game: Would they rather ${ game.options[0] } or ${ game.options[1] }`);
		res.json(game.options);

		game.on('tick', gameTickEvent);
		game.on('update', throttle(gameUpdateEvent, 500));

		game.emitUpdate();

	} else res.send('Invalid game ID');
});

// -- End a round

app.get('/end/:choice', (req, res) => {
	const choice = parseInt(req.params.choice);

	if (isFinite(choice)) {
		clearInterval(endTimeout);
		
		const newScores = game.end(choice);

		tables.applyGameScores(newScores);

		endTimeout = setTimeout(() => {
			emitScoresState();
			game.removeAllListeners();
			game = null;
		}, 5000);

		res.send('Game Ended');
	} else res.send('Invalid choice');
});

// -- Get a list of questions (for admin)

app.get('/questions', (req, res) => {
	res.json(questions);
});

// -- Clear scores

app.get('/clearscores', (req, res) => {
	tables.clearScores();
	updateClients();

	res.send('scores cleared');
});

// -- Get round summary (for testing purposes)

app.get('/scores', (req, res) => {
	res.json(tables.getState());
});

module.exports = server;