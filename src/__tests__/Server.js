const Server = require('../Server');
const request = require('supertest');

jest.mock('../../data/questions.json', () => [
	['Apple', 'Banana'],
	['Option 1', 'Option 2'],
	['Tabs', 'Spaces']
]);

jest.mock('../../setup.json', () => {
	return {
		port: 80,
		numTables: 3,
		roundLength: 20
	}
});

jest.useFakeTimers();

describe('app', () => {
	let server;

	beforeEach(() => { server = Server.listen(3000) });
	afterEach(() => { server.close() });

	describe('submit', () => {
		const defaultPlayerSettings = { number: '123', message: '1' };

		describe('player registration', () => {
			it('should ignore non-numbers when registering players', () => {
				const settings = {
					number: '123',
					message: 'asdasf'
				}

				return request(server).post('/submit').send(settings)
					.then(res => {
						expect(res.text).toEqual('Please enter a valid table number to sign up');
					});
			});

			it('shouldn\'t let players register to not existing tables', () => {
				const settings = {
					number: '123',
					message: '11'
				}

				return request(server).post('/submit').send(settings)
					.then(res => {
						expect(res.text).toEqual('Table 11 does not exist.');
					});
			});

			it('shouldn\'t let players register to table 0', () => {
				const settings = {
					number: '123',
					message: '0'
				}

				return request(server).post('/submit').send(settings)
					.then(res => {
						expect(res.text).toEqual('Table 0 does not exist.');
					});
			});

			it('shouldn\'t let players register to a negative table', () => {
				const settings = {
					number: '123',
					message: '-5'
				}

				return request(server).post('/submit').send(settings)
					.then(res => {
						expect(res.text).toEqual('Table -5 does not exist.');
					});
			});

			it('should let players register to the last table number', () => {
				const settings = {
					number: '123',
					message: '3'
				}

				return request(server).post('/submit').send(settings)
					.then(res => {
						expect(res.text).toEqual('You are now signed up for table 3');
					});
			});

			it('should register players', () => {
				return request(server).post('/submit').send(defaultPlayerSettings)
					.then((res) => {
						expect(res.text).toEqual('You are now signed up for table 1');
					});
			});
		});
	});

	/*describe('full round', () => {
		it('should complete a full round', async () => {
			const submit = async (data, expected) => {
				const res = await request(server).post('/submit').send(data);
				expect(res.text).toBe(expected);
			}

			const players = [
				{ number: '123', message: '1' },
				{ number: '456', message: '2' },
				{ number: '789', message: '3' },
				{ number: '987', message: '3' }
			];

			// -- Register players
			
			players.forEach(data => {
				submit(data, `You are now signed up for table ${ data.message }`);
			});

			// -- Start round
			
			await request(server).post('/start/1');

			request(server).post('/summary')
				.then(res => {
					expect(res.body).toEqual({

					})
				});

			// -- Do some voting


		});
	});*/
});
