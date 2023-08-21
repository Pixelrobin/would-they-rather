const Server = require('./src/Server');
const port = 8080;

console.log('');
console.log('+----------------------------------+');
console.log('| WOULD YOU RATHER SERVER STARTING |');
console.log('+----------------------------------+');
console.log('');

Server.listen(port, () => console.log(`RUNNING ON PORT ${ port }`));

require('./test-utils/players2');
