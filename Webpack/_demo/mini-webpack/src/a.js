import logB from './b.js';

function logA(){
    console.log('logA')
    logB();
}

export default logA;