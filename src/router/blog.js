const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
} = require("../controller/blog");
const { ErrorModel, SuccessModel } = require("../model/resModel");
const { loginCheck } = require("../utils/loginCheck");

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id;
  // 获取博客列表
  if (method === "GET" && req.path === "/api/blog/list") {
    let author = req.query.author || "";
    const keyword = req.query.keyword || "";
    // const listData = getList(author, keyword);
    // return new SuccessModel(listData); // 成功获取数据后，返回对应模型对象

    if (req.query.isadmin) {
      // 管理员界面
      // 校验登陆验证
      const loginCheckResult = loginCheck(req);
      if (loginCheckResult) {
        return loginCheckResult;
      }
      // 强制查询自己的博客
      author = req.session.username
    }

    const result = getList(author, keyword);
    return result.then(listData => {
      // 路由也需要 promise 对象
      return new SuccessModel(listData);
    });
  }

  // 获取博客详情
  if (method === "GET" && req.path === "/api/blog/detail") {
    // const detailData = getDetail(id);
    // return new SuccessModel(detailData); // 成功获取数据后，返回对应模型对象
    const result = getDetail(id);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 新增一篇博客
  if (method === "POST" && req.path === "/api/blog/new") {
    // const newData = newBlog(req.body);

    // 校验登陆状态
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    // return new SuccessModel(newData); // 成功获取数据后，返回对应模型对象
    req.body.author = req.session.username; // 假数据，待开发登录时再改成真实数据
    const result = newBlog(req.body);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 更新一篇博客
  if (method === "POST" && req.path === "/api/blog/update") {
    // 校验登陆验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const result = updateBlog(id, req.body);
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("更新博客失败");
      }
    }); // 返回值 true | false
  }

  // 删除一篇博客
  if (method === "POST" && req.path === "/api/blog/del") {
    // 校验登陆验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }
    const author = req.session.username;
    const result = deleteBlog(id, author); // 返回值 true | false
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("删除博客失败");
      }
    });
    // if (result) {
    //   return new SuccessModel();
    // } else {
    //   return new ErrorModel("删除博客失败");
    // }
  }
};

module.exports = handleBlogRouter;
