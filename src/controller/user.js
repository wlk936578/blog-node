const { exec } = require("../db//mysql");

const login = (username, password) => {
  const sql = `select username, realname from users where username='${username}' and password='${password}';`;
  return exec(sql).then(rows => {
    return rows[0] || {}; // 避免返回 undefined
  });
  // if (username === "zhangsan" && password === "123") {
  //   return true;
  // }
};

module.exports = {
  login
};
