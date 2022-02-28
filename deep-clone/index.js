function isObject(obj) {
  const type = typeof obj;
  return obj !== null && (type === "function" || type === "object");
}

function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function deepClone(source, map = new WeakMap()) {
  if (!isObject(source)) {
    return source;
  }

  if (map.get(source)) {
    return map.get(source);
  }

  const type = getType(source);

  if (["String", "Number", "Boolean", "RegExp", "Date", "Error"].includes(type)) {
    return new source.constructor(source);
  }

  if (type === "Symbol") {
    // Symbol 是一个内置对象，因此用 Object 包裹，然后用 valueOf 得到 symbol 本身
    return Object(Symbol.prototype.valueOf.call(source));
  }

  if (type === "Function") {
    return source;
  }

  const cloneObj = new source.constructor();

  map.set(source, cloneObj);

  if (type === "Map") {
    source.forEach((value, key) => {
      cloneObj.set(key, deepClone(value, map));
    });

    return cloneObj;
  }

  if (type === "Set") {
    source.forEach((value) => {
      cloneObj.add(deepClone(value, map));
    });

    return cloneObj;
  }

  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(source[key], map);
    }
  }

  return cloneObj;
}

module.exports = deepClone;
