const mysql = require("mysql");
const { MYSQL_CONFIG } = require("../config/db");

// 创建连接对象

const con = mysql.createConnection(MYSQL_CONFIG);

// 开始连接
con.connect();

// 执行 sql 函数
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      // 异步处理数据库的语句操作
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
  return promise;
}


module.exports = {
  exec
};
