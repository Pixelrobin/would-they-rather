const setup = require('../setup.json');

let scores = {};

const names = [
	'zero', 'one', 'two', 'three', 'four', 'five',
	'six', 'seven', 'eight', 'nine', 'ten',
	'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
	'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
];

function registerTable(tableNumber) {
	scores[tableNumber] = 0;
}

function get() {
	return scores;
}

function clearScores() {
	Object.keys(scores).map(key => {
		scores[key] = 0;
	});
}

function getState() {
	let tables = Object.keys(scores).map(table => {
		const tableNum = parseInt(table);

		return {
			number: tableNum,
			name: `Table ${ names[tableNum] }`,
			score: scores[table],
			top: false
		}
	});

	tables.sort((a, b) => {
		if (a.score === b.score) return a.number - b.number;
		else return b.score - a.score;
	});

	tables.forEach((value, index, array) => {
		if (value.score !== 0) {
			if (value.score === array[0].score) {
				array[index].top = true;
			}
		}
	});

	return {
		type: 'tables',
		tables: tables
	}
}

function applyGameScores(newScores) {
	newScores.map((score, index) => {
		if(index in scores) {
			scores[index] += score;
		}
	});
}

module.exports = { registerTable, get, getState, applyGameScores, clearScores }