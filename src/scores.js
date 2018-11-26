const setup = require('../setup.json');

let scores = {};

for (let s = 1; s <= setup.numTables; s ++) {
	scores[s] = 0;
}

function get() {
	return scores;
}

function getState() {
	let sortedScores = [];

	for (let s = 1; s <= setup.numTables; s ++) {
		sortedScores.push({
			name: `Table ${ s }`,
			score: scores[s],
			inTie: false
		});
	}

	sortedScores.sort((a, b) => b.score - a.score);

	if (sortedScores[0].score === sortedScores[1].score) {

	}

	return {
		type: 'scores',
		scores: sortedScores,
		tied: false
	}
}

function applyGameScores(newScores) {
	newScores.map((score, index) => {
		scores[index] += score;
	});
}

module.exports = { get, getState, applyGameScores }