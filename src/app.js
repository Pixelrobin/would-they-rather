require('dotenv').config();

const http    = require('http');
const express = require('express');

const Game = require('./game');

const app    = express();
const tables = process.env.tables.toString();

app.use(express.static('client/build'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const numbers = {};
let game;

app.post('/submit', (req, res) => {
	const { number, message } = req.body;

	if (game) {
		const response = game.submit(number, message);

		res.send(response);
	} else {
		const table = parseInt(message);

		if (isFinite(table)) {
			if (table > 0 && table <= tables) {
				numbers[number] = table;

				res.send(`You are now signed up for table ${ table }`);
			} else res.send(`Table ${ table } does not exist.`);
		} else res.send('Please enter a valid table number to sign up');
	}
});

app.get('/start/:questionID', (req, res) => {
	const questionID = parseInt(req.params.questionID);

	if (isFinite(questionID)) {
		game = new Game(questionID, numbers);

		res.send(`New game: Would they rather ${ game.options[0] } or ${ game.options[1] }`);

		setInterval(() => {
			console.log(game.time);
		}, 500);

		game.on('timeout', () => {
			console.log('game over');
		});

	} else res.send('Invalid game ID');
});

app.get('/summary', (req, res) => {
	if (game) {
		res.json(game.getStateSummary());
	} else res.send('no game started');
});

module.exports = app;