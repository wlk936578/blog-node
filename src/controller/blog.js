const { exec } = require("../db/mysql");

const getList = (author, keyword) => {
  // 未对接数据库之前，可先返回假数据(数据格式保持一致)
  // return [
  //   {
  //     id: 1,
  //     title: "标题A",
  //     content: "内容A",
  //     createTime: 1558766098687,
  //     author: "zhangsan"
  //   },
  //   {
  //     id: 2,
  //     title: "标题B",
  //     content: "内容B",
  //     createTime: 1558766023732,
  //     author: "lisi"
  //   }
  // ];

  let sql = `select id,title,content,author from blogs where 1=1 `; // 因为参数的不确定性，加入 where 1=1 可以避免无参数时的报错(常用手段)
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc`;
  // 返回 promise
  return exec(sql);
};

const getDetail = id => {
  // return {
  //   id: 1,
  //   title: "标题A",
  //   content: "内容A",
  //   createTime: 1558766098687,
  //   author: "zhangsan"
  // };
  let sql = `select * from blogs where id='${id}' `;
  return exec(sql).then(rows => {
    return rows[0]; // 查询后数据库返回的结果
  });
};

const newBlog = (blogData = {}) => {
  // blogData ===> title, content,author 属性
  console.log("newBlog blogData... ", blogData);
  const title = blogData.title;
  const content = blogData.content;
  const author = blogData.author;
  const createTime = Date.now();
  let sql = `insert into blogs (title,content,author,createtime) values('${title}','${content}','${author}','${createTime}');`;
  return exec(sql).then(insertData => {
    // console.log("insertData is:", insertData);
    return {
      id: insertData.insertId
    };
  });
  // return {
  //   id: 3 // 表示新建博客插入到数据表里的 id
  // };
};

const updateBlog = (id, blogData = {}) => {
  // id 为 get请求上要更新的文章
  // console.log("updataBlog id,blogData... ", id, blogData);
  const title = blogData.title;
  const content = blogData.content;
  const createTime = Date.now();
  let sql = `update blogs set title='${title}', content='${content}' where id=${id};`;
  return exec(sql).then(updateData => {
    console.log("updateData is: ", updateData);
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
  // if (!id) {
  //   return false;
  // } else {
  //   return true;
  // }
};

const deleteBlog = (id, author) => {
  // console.log("updataBlog id... ", id);
  const sql = `delete from blogs where id=${id} and author='${author}';`; // 该 sql 会保证在删除时 只会删除当前作者的文章(双重保障)
  return exec(sql).then(deleteData => {
    console.log("deleteData is: ", deleteData);
    if (deleteData.affectedRows > 0) {
      return true;
    }
    return false;
  });
  // if (!id) {
  //   return false;
  // } else {
  //   return true;
  // }
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
};
