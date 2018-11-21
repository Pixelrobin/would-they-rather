const EventEmitter = require('events');

const questions = require('../data/questions.json');

class Game extends EventEmitter {
	constructor(questionID, numbers) {
		super();

		const options = questions[questionID];
		const roundLength = parseInt(process.env.length);

		if (options) {
			this.options = options;
		} else throw new Error(`Invalid question ID: ${questionID}`);

		this.votes = [];
		this.numbers = numbers;
		this.time = roundLength;
		this.finished = false;
		this.choice = -1;

		setInterval(() => { this.tick() }, 1000);
	}

	submit(number, message) {
		if (number in this.numbers) {
			const vote = message.toLowerCase().replace(/([^a-z])/g, '');
			const table = this.numbers[number].toString();

			const voteIndex = ['a', 'b'].indexOf(vote);

			if (voteIndex !== -1) {
				this.votes[table] = voteIndex;

				return `Voted for ${ vote.toUpperCase() }!`;
			} else return 'Please vote with "A" or "B"';
		} else return 'Your number is not signed up for a table';
	}

	tick() {
		if (this.time > 0) this.time --;
		else if (!this.finished) {
			this.emit('timeout');
			this.finished = true;
		}
	}

	getStateSummary() {
		const votes = this.votes
			
			.reduce((result, table, index, array) => {
				const vote = this.votes[table];

				if (array[vote] !== undefined) {
					result[vote] ++;
				}

				return result;
			}, [0, 0])
			
			.map((numVotes, index) => {
				return {
					option: this.options[index],
					votes: numVotes
				}
			});
		
		return {
			time: this.time,
			finished: this.finished,
			votes,
			choice: this.choice
		}
	}

	end(choice) {
		if (!this.finshed) {
			if (this.time > 0) this.time = 0;
			if (!this.finished) this.finished = true;

			this.choice = choice;

			return this.votes.map(vote => vote === choice ? 1 : 0);
		}
	}
}

module.exports = Game;