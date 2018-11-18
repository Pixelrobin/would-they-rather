class Game {
	constructor(numbers) {
		this.votes = {};
		this.numbers = numbers;
	}

	submit(number, message) {
		if (number in numbers) {
			const vote = message.toLowerCase().replace(/([^a-z])/g, '');
			const table = this.numbers[number].toString();

			if (vote === 'a' || vote === 'b') {
				this.votes[table] = vote;

				return `Voted for ${ vote.toUpperCase() }!`;
			} else return 'Please vote with "A" or "B"';
		} else return 'Your number is not signed up for a table';
	}

	getVotes() {
		return Object.keys(this.votes)
			.reduce((result, table) => {
				const vote = this.votes[table];

				if (vote in result) {
					result[vote ++];
				}
			}, { a: 0, b: 0 });
	}
}

module.exports = Game;