const app = require('./src/app');
const port = 80;

console.log('');
console.log('+----------------------------------+');
console.log('| WOULD YOU RATHER SERVER STARTING |');
console.log('+----------------------------------+');
console.log('');

const server = app.listen(port, () => console.log(`RUNNING ON PORT ${ port }`));