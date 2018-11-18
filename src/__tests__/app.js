const app = require('../app');
const request = require('supertest');

const defaultEnv = { ...process.env };

describe('app', () => {
	let server;

	beforeEach(() => {
		process.env.tables = 10;
		server = app.listen(3000);
	});

	afterEach(() => {
		process.env = defaultEnv;
		server.close();
	});

	describe('submit', () => {
		const defaultPlayerSettings = { number: '123', message: '5' };

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
				message: '10'
			}

			return request(server).post('/submit').send(settings)
				.then(res => {
					expect(res.text).toEqual('You are now signed up for table 10');
				});
		});

		it('should register players', () => {
			return request(server).post('/submit').send(defaultPlayerSettings)
				.then((res) => {
					expect(res.text).toEqual('You are now signed up for table 5');
				});
		});
	});
});