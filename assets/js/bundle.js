;(function (global) {

    const logger = (...args) => console.log.apply(this, args);
    
    const test = logger('Hello World!');

    const name = 'yo';
    const age = 28; 
    const displayName = 'loyal';

    const val = {
        name,
        displayName
    };

    const valExtra = {...val, age}

    return global.myApp = {};

})(window);
