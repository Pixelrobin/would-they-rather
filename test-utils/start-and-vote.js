const utils = require('./utils');

const letters = ['A', 'B'];
const choice = 0;

async function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function test() {
    utils.get('/start/1');

    await delay(500);

    let number = 0;

    const submitVote = async (number, message) => {
        await delay(Math.random() * 9000);

        utils.submit({ number, message })
    }

    for (let table = 1; table <= 10; table ++) {
        const members = 15;

        for (let member = 0; member < members; member ++) {
            const vote = member < table ? choice : Math.abs(choice - 1);

            //setTimeout((number, message) => { utils.submit({ number: number.toString(), message: letters[vote] }) }, Math.random() * 3000);
            submitVote(number.toString(), letters[vote]);

            number ++;
        }
    }

    await delay(10000);

    utils.get('/end/0');
}

test();