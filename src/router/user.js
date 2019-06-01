const { login } = require("../controller/user");
const { ErrorModel, SuccessModel } = require("../model/resModel");
const { set } = require("../db/redis.js");

// 获取 cookie 的过期时间,并重新设置过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000); // 设置为24小时内未重新登陆则会过期
  console.log("d.toGMTString is:", d.toGMTString());
  return d.toGMTString(); // 返回 标准北京时间
};

const handleUserRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];

  // 登陆接口
  if (method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;
    // const { username, password } = req.query;
    const result = login(username, password);
    return result.then(loginData => {
      if (loginData.username) {
        // 设置 session
        req.session.username = loginData.username;
        req.session.realname = loginData.realname;
        // 同步到 redis 中
        set(req.sessionId, req.session);
        console.log("req.session is:", req.session);
        return new SuccessModel();
      } else {
        return new ErrorModel("登陆失败");
      }
    });
    // if (result) {
    //   return new SuccessModel();
    // } else {
    //   return new ErrorModel("登陆失败");
    // }
  }
  
  // 登陆验证的测试
  // if (method === "GET" && req.path === "/api/user/login-test") {
  //   // req.cookie.username
  //   if (req.session.username) {
  //     return Promise.resolve(
  //       new SuccessModel({
  //         session: req.session
  //       })
  //     ); // 可以直接使用 return promise.resolve() 来返回一个 promise 对象
  //   }
  //   return Promise.resolve(new ErrorModel("尚未登陆"));
  // }
};

module.exports = {
  handleUserRouter,
  getCookieExpires
};
