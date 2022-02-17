const MyPromise = require("./index.js");

let p = new MyPromise((resolve, reject) => {
  resolve("后盾人");
  console.log("hdcms.com");
})
.then(
  value => {
    console.log(value);
    return "大叔视频";
  },
  reason => {
    console.log(reason);
  }
)
.then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
);
console.log("houdunren.com");
