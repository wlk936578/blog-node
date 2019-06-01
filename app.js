const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog.js");
const { handleUserRouter, getCookieExpires } = require("./src/router/user.js");
const { get, set } = require("./src/db/redis");
const {access} = require('./src/utils/log.js')

// session 数据
// const SESSION_DATA = {};

// 处理 post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    // 非 post 请求直接返回空对象
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    // Content-type 格式不对也要提前返回
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    postData = "";
    req.on("data", thunk => {
      postData += thunk.toString();
    });
    req.on("end", () => {
      req.postData = postData;
      // 空数据也要提前返回
      if (postData === "" || !postData) {
        resolve({});

        return;
      }
      // 成功获取数据后
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};
const serverHandle = (req, res) => {

  // 记录日志内容 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} --  ${Date.now()}`)

  // 设置返回格式 JSON
  res.setHeader("content-type", "application/json");

  // 获取 path
  const url = req.url;
  req.path = url.split("?")[0];

  // 解析 query
  req.query = querystring.parse(url.split("?")[1]);

  // 解析 cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || ""; // 获取 cookie => k1=v1;k2=v2

  cookieStr.split(";").forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val; // 将 key 对应 value
  });

  // 解析 session
  // 默认判断 是否需要设置 session
  // let needSetCookie = false;
  // let userId = req.cookie.userId;
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {};
  //   }
  // } else {
  //   needSetCookie = true;
  //   userId = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userId] = {};
  // }
  // req.session = SESSION_DATA[userId];

  // 解析 session (使用redis)
  let needSetCookie = false;
  let userId = req.cookie.userId;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化 redis 中的 session
    set(userId, {}); // 用 redis 的方法处理
  }
  req.sessionId = userId;
  // 获取 session (异步处理),通过 id 返回对应 session
  get(req.sessionId)
    .then(sessionData => {
      if (sessionData === null) {
        // 初始化 redis 中的 session
        set(req.sessionId, {}); // 用 redis 的方法处理
        // 设置 session
        req.session = {};
      } else {
        // 设置 session
        req.session = sessionData;
      }
      console.log("req.session is ===> ", req.session);
      // 处理 post data, 返回 promise 对象
      return getPostData(req);
    })
    .then(postData => {
      // 所有操作在获取post data 之后执行
      req.body = postData;

      // 处理 blog 路由(非异步处理)
      // const blogData = handleBlogRouter(req, res);
      // if (blogData) {
      //   res.end(JSON.stringify(blogData));
      //   return;
      // }

      // 处理 blog 路由(异步处理)
      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            // 后端 操作 cookie
            res.setHeader(
              "Set-Cookie",
              `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()} `
            );
            // 设置为全部路由都会生效,httpOnly 意思是 只允许后端修改，即使前端修改，也会被后端的设置重新覆盖掉
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      const loginResult = handleUserRouter(req, res);
      // if (userData) {
      //   res.end(JSON.stringify(userData));
      //   return;
      // }

      if (loginResult) {
        loginResult.then(loginData => {
          if (needSetCookie) {
            // 后端 操作 cookie
            res.setHeader(
              "Set-Cookie",
              `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()} `
            );
            // 设置为全部路由都会生效,httpOnly 意思是 只允许后端修改，即使前端修改，也会被后端的设置重新覆盖掉
          }
          res.end(JSON.stringify(loginData));
        });
        return;
      }

      // 未命中任何路由,返回404
      res.writeHead(404, { "content-type": "text/plain" });
      res.write("404 Not Found\n");
      res.end();
    });
};

module.exports = serverHandle;
