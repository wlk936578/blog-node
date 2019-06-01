const env = process.env.NODE_ENV; // 获取环境参数

// 环境配置
let MYSQL_CONFIG;
let REDIS_CONFIG;

if (env === "dev") {
  MYSQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: "wlk19930510",
    port: "3306",
    database: "myblog"
  };

  // redis 配置
  REDIS_CONFIG = {
    port:6379,
    http:'127.0.0.1'
  }
} else if (env === "production") {
  MYSQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: "wlk19930510",
    port: "3306",
    database: "myblog"
  };
  REDIS_CONFIG = {
    port:6379,
    http:'127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONFIG,
  REDIS_CONFIG
};
