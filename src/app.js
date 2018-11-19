require('dotenv').config();

const express = require('express');
const Game    = require('./game');

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

	} else {
		const table = parseInt(message);

		if (isFinite(table)) {
			if (table > 0 && table <= tables) {
				numbers[number] = table;

				res.send(`You are now signed up for table ${ table }`);
			} res.send(`Table ${ table } does not exist.`)
		} else res.send('Please enter a valid table number to sign up');
	}
});

app.get('/start', (req, res) => {
	game = new Game(numbers);

	res.send('New game started!');
});

module.exports = app;