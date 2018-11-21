const Game = require('../game');

jest.mock('../../data/questions.json', () => [
	['Apple', 'Banana'],
	['Option 1', 'Option 2'],
	['Tabs', 'Spaces']
]);

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
		game = new Game(1, numbers);
	});

	describe('constructor', () => {
		it('should construct', () => {
			expect(game.options).toEqual(['Option 1', 'Option 2']);
			expect(game.votes).toEqual([]);
			expect(game.numbers).toEqual(numbers);
		});

		it('should error on inavlid question ID', () => {
			expect(() => new Game(9999, numbers))
				.toThrowError('Invalid question ID: 9999');
		});
	});

	describe('submit', () => {
		it('should not let unregistered numbers vote', () => {
			const message = game.submit('888', 'a');
			
			expect(message).toBe('Your number is not signed up for a table');
		});

		it('should accept votes for a', () => {
			const message = game.submit('123', 'a');

			expect(message).toBe('Voted for A!');
			expect(game.votes).toEqual([,,,0]);
		});

		it('should accept votes for b', () => {
			const message = game.submit('123', 'b');

			expect(message).toBe('Voted for B!');
			expect(game.votes).toEqual([,,,1]);
		});

		it('should allow multiple votes', () => {
			const voteA = game.submit('123', 'a');
			const voteB = game.submit('456', 'b');

			expect(voteA).toBe('Voted for A!');
			expect(voteB).toBe('Voted for B!');
			expect(game.votes).toEqual([,,,0,1]);
		});

		it('should handle votes when multiple numbers are assigned to the same table', () => {
			const voteA = game.submit('101', 'a');

			expect(voteA).toBe('Voted for A!');
			expect(game.votes).toEqual([,0]);

			const voteB = game.submit('111', 'b');

			expect(voteB).toBe('Voted for B!');
			expect(game.votes).toEqual([,1]);
		});

		it('should allow vote changes', () => {
			game.submit('123', 'a');
			const message = game.submit('123', 'a');

			expect(message).toBe('Voted for A!');
			expect(game.votes).toEqual([,,,0]);

			const message2 = game.submit('123', 'b');

			expect(message2).toBe('Voted for B!');
			expect(game.votes).toEqual([,,,1]);
		});

		it('should not accept invalid votes', () => {
			const message = game.submit('123', 'c');

			expect(message).toBe('Please vote with "A" or "B"');
			expect(game.votes).toEqual([]);
		});

		it('should should make votes lowercase', () => {
			const message = game.submit('123', 'B');

			expect(message).toBe('Voted for B!');
			expect(game.votes).toEqual([,,,1]);
		});

		it('should should strip non-letter characters', () => {
			const message = game.submit('123', '124A\n .&@#^$*@&#^$2');

			expect(message).toBe('Voted for A!');
			expect(game.votes).toEqual([,,,0]);
		});
	});

	describe('getSummary', () => {
		it('should get votes', () => {
			game.submit('123', 'a');
			game.submit('456', 'b');
			game.submit('789', 'a');

			const votes = game.getSummary();
			const expected = [
				{
					option: 'Option 1',
					votes: 2
				}, {
					option: 'Option 2',
					votes: 1
				}
			];

			expect(votes).toEqual(expected);
		});
	});
});