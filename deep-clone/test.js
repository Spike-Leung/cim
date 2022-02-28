const deepClone = require('./index');

const map = new Map();
map.set('key', 'value');
map.set('key2', 'value2');

const set = new Set();
set.add('hello');
set.add('hi');

const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8],
    empty: null,
    map,
    set,
    bool: new Boolean(true),
    num: new Number(2),
    str: new String(2),
    symbol: Object(Symbol(1)),
    date: new Date(),
    reg: /\d+/,
    error: new Error(),
    func1: () => {
        console.log('is function');
    },
    func2: function (a, b) {
        return a + b;
    }
};


const result = deepClone(target);

console.log(target);
console.log(result);
