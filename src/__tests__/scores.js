jest.mock('../../setup.json', () => {
	return {
		port: 80,
		numTables: 3,
		roundLength: 20
	}
});

describe('scores', () => {
	let scores;

	beforeEach(() => {
		jest.resetModules();
		scores = require('../scores');
	});

	it('should apply scores', () => {
		scores.applyGameScores([, 0, 1, 2]);

		expect(scores.get()).toEqual({
			'1': 0,
			'2': 1,
			'3': 2
		});
	});

	it('should get scores state and sort scores', () => {
		scores.applyGameScores([, 1, 0, 2]);

		expect(scores.getState()).toEqual({
			type: 'scores',
			scores: [
				{
					name: 'Table 3',
					score: 2,
					inTie: false
				}, {
					name: 'Table 1',
					score: 1,
					inTie: false
				}, {
					name: 'Table 2',
					score: 0,
					inTie: false
				}
			],
			tied: false
		});
	});
})