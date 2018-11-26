const axios = require('axios');

function get(path) {
	axios.get('http://localhost' + path)
		.then(res => { console.log(res.data) });
}

function submit(data) {
	axios.post('http://localhost/submit', data)
		.then(res => { console.log(res.data) });
}

module.exports = {
	get, submit
}