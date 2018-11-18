const express = require('express');
const app = express();
const port = 80;
const Game = require('./game');

console.log('');
console.log('+----------------------------------+');
console.log('| WOULD YOU RATHER SERVER STARTING |');
console.log('+----------------------------------+');
console.log('');

const votes = {
	a: 0,
	b: 0
}

let game = new Game();

app.use(express.static('client/build'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/test', (req, res) => {
	res.send('hi');
});

app.post('/submit', (req, res) => {
	const { number, message } = req.body;

	if (game) {
		const response = game.submit(number, message);

		res.send(response);
	} else res.send('no game started');
});

app.get('/data', (req, res) => {
	if (game) {
		res.send(game.getVotes());
	} else res.send('no game started');
});

app.get('/start', (req, res) => {
	game = new Game();

	res.send('new game started');
});

const server = app.listen(port, () => console.log(`would-they-rather running on port ${ port }`));
module.exports = server;