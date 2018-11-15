const express = require('express');
const app = express();
const port = 80;

app.use(express.static('client/build'));

app.get('/test', (req, res) => {
	res.send('hi');
});

app.listen(port, () => console.log(`would-they-rather running on port ${ port }`));