const EventEmitter = require('events');

const questions = require('../data/questions.json');
const setup     = require('../setup.json');

class Game extends EventEmitter {
	constructor(questionID, numbers) {
		super();

		const options = questions[questionID];
		const roundLength = setup.roundLength;

		if (options) {
			this.options = options;
		} else throw new Error(`Invalid question ID: ${questionID}`);

		this.votes = {};
		this.numbers = numbers;
		this.time = roundLength;
		this.finished = false;
		this.choice = -1;

		this.tickInterval = setInterval(() => { this.tick() }, 1000);
	}

	submit(number, message) {
		if (number in this.numbers) {
			const vote = message.toLowerCase().replace(/([^a-z])/g, '');
			const table = this.numbers[number].toString();

			const voteIndex = ['a', 'b'].indexOf(vote);

			if (voteIndex !== -1) {
				this.votes[number] = voteIndex;

				this.emitUpdate();

				return `Voted for ${ vote.toUpperCase() }!`;
			} else return 'Please vote with "A" or "B"';
		} else return 'Your number is not signed up for a table';
	}

	tick() {
		if (this.time > 0) {
			this.time --;
			this.emit('tick', this.time);
		} else if (!this.finished) {
			this.emit('timeout');
			this.finished = true;

			clearInterval(this.tickInterval);
		}
	}

	emitUpdate() {
		this.emit('update', this.getState());
	}

	getState() {
		const votes = Object.keys(this.votes)
			
			.reduce((result, number) => {
				const vote = this.votes[number];

				if (result[vote] !== undefined) {
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
			type: 'game',
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
			this.emitUpdate();

			//return this.votes.map(vote => vote === choice ? 1 : 0);
			return Object.keys(this.votes).reduce((scores, number) => {
				const vote = this.votes[number];
				const table = this.numbers[number];

				if (vote === choice) {
					if (scores[table] === undefined) scores[table] = 0;
					scores[table] ++;
				}

				return scores;
			}, []);
		}
	}
}

module.exports = Game;