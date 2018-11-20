const Game = require('../game');

describe('game', () => {
	const numbers = {
		'123': 3,
		'456': 4,
		'789': 5,
		'101': 1,
		'111': 1,
		'213': 2,
		'141': 6,
		'516': 7,
		'171': 8,
		'819': 9,
		'202': 10
	}

	let game;

	beforeEach(() => {
		game = new Game(numbers);
	});

	describe('submit', () => {
		it('should register defaults', () => {
			expect(game.votes).toEqual({});
			expect(game.numbers).toEqual(numbers);
		});

		it('should not let unregistered numbers vote', () => {
			const message = game.submit('888', 'a');
			
			expect(message).toBe('Your number is not signed up for a table');
		});

		it('should accept votes for a', () => {
			const message = game.submit('123', 'a');

			expect(message).toBe('Voted for A!');
			expect(game.votes).toEqual({ '3': 'a' })
		});

		it('should accept votes for b', () => {
			const message = game.submit('123', 'b');

			expect(message).toBe('Voted for B!');
			expect(game.votes).toEqual({ '3': 'b' })
		});

		it('should allow multiple votes', () => {
			const voteA = game.submit('123', 'a');
			const voteB = game.submit('456', 'b');

			expect(voteA).toBe('Voted for A!');
			expect(voteB).toBe('Voted for B!');
			expect(game.votes).toEqual({
				'3': 'a',
				'4': 'b'
			});
		});

		it('should handle votes when multiple numbers are assigned to the same table', () => {
			const voteA = game.submit('101', 'a');

			expect(voteA).toBe('Voted for A!');
			expect(game.votes).toEqual({ '1': 'a' });

			const voteB = game.submit('111', 'b');

			expect(voteB).toBe('Voted for B!');
			expect(game.votes).toEqual({ '1': 'b' });
		});

		it('should allow vote changes', () => {
			game.submit('123', 'a');
			const message = game.submit('123', 'a');

			expect(message).toBe('Voted for A!');
			expect(game.votes).toEqual({ '3': 'a' });

			const message2 = game.submit('123', 'b');

			expect(message2).toBe('Voted for B!');
			expect(game.votes).toEqual({ '3': 'b' });
		});

		it('should not accept invalid votes', () => {
			const message = game.submit('123', 'c');

			expect(message).toBe('Please vote with "A" or "B"');
			expect(game.votes).toEqual({});
		});

		it('should should make votes lowercase', () => {
			const message = game.submit('123', 'B');

			expect(message).toBe('Voted for B!');
			expect(game.votes).toEqual({ '3': 'b' });
		});

		it('should should strip non-letter characters', () => {
			const message = game.submit('123', '124A\n .&@#^$*@&#^$2');

			expect(message).toBe('Voted for A!');
			expect(game.votes).toEqual({ '3': 'a' });
		});
	});

	describe('getSummary', () => {
		it('should get votes', () => {
			game.submit('123', 'a');
			game.submit('456', 'b');
			game.submit('789', 'a');

			const votes = game.getSummary();

			expect(votes).toEqual({ a: 2, b: 1 });
		});
	});
});