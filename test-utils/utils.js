const axios = require('axios');

function get(path) {
	axios.get('http://localhost:8080' + path)
		.then(res => { console.log(res.data) });
}

function submit(data) {
	axios.post('http://localhost:8080/submit', data)
		.then(res => { console.log(res.data) });
}

module.exports = {
	get, submit
}