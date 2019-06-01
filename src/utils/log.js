const fs = require("fs");
const path = require("path");

// 写日志
function writeLog(writeStream, log) {
  writeStream.write(log + "\n"); // 关键代码
}

// 生成 writeStream
function createWriteStream(fileName) {
  const fullFileName = path.join(__dirname, "../", "../", "logs", fileName); // 找到日志目录
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: "a" // 配置
  });
  return writeStream;
}

const accessWriteStream = createWriteStream("access.log");

// 访问日志
function access(log) {
    writeLog(accessWriteStream,log)
}

module.exports = {
    access
};
