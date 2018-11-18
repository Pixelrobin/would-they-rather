class Game {
	constructor() {
		this.numbers = {};
		this.votes = {};
	}

	submit(number, message) {
		if (number in this.numbers) {
			const vote = message.toLowerCase().replace(/([^a-z])/g, '');

			if (vote === 'a' || vote === 'b') {
				this.votes[number] = vote;

				return `Your vote is now ${ vote.toUpperCase() }`;
			} else return 'Please vote with "A" or "B"';
		} else {
			const table = parseInt(message);

			if (isFinite(table)) {
				if (table > 0 && table <= 10) {
					this.numbers[number] = table;
				}

				return `You are now signed up for table ${ table }`
			} else return 'Please enter a valid table number to sign up';
		}
	}

	getVotes() {
		return this.votes;
		/*return Object.keys(this.votes)
			.reduce((result, number) => {
				const vote = this.votes[number];

				if (vote in result) {
					result[vote ++];
				}
			}, { a: 0, b: 0 });*/
	}
}

module.exports = Game;