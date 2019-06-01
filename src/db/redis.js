const redis = require("redis");
const { REDIS_CONFIG } = require("../config/db");

// 创建 redis 客户端
const redisClient = redis.createClient(REDIS_CONFIG);
redisClient.on("error", err => {
  console.error(err);
});

function set(key, val) {
  if (typeof val === "object") {
    val = JSON.stringify(val); // 此处为对象的处理
  }
  redisClient.set(key, val, redis.print);
}

function get(key) {
  // 异步处理
  const promise = new Promise((reslove, reject) => {
      redisClient.get(key, (err, val) => {
        if (err) {
          reject(err);
          return;
        }
        if (val === null) {
          // 某些 key 可能获取不到值
          reslove(null);
          return;
        }
        // 兼容对象和一般字符串的 try catch 处理
        try {
          reslove(JSON.parse(val));
          console.log("val ===>", val);
        } catch (err) {
          reslove(val);
          console.log("val ===>", val);
        }
      });
  });
  return promise;
}

module.exports = {
  set,
  get
};
