const utils = require('./utils');

async function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function test() {
    let number = 0;

    for (let table = 1; table <= 10; table ++) {
        const members = 15;

        for (let member = 0; member < members; member ++) {
            utils.submit({ number: number.toString(), message: table.toString() });

            number ++;
        }
    }
}

test();