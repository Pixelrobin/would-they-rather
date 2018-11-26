const utils = require('./utils');

const possibleVotes = ['a', 'b'];

for (let p = 0; p < 7; p ++) {
	const vote = Math.floor(Math.random() * 2);

	utils.submit({
		number: p.toString(),
		message: possibleVotes[vote]
	});
}