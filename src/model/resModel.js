class BaseModel {  // 建立基本模型，根据情况会返回 msg 和 data 还有 errNo
  constructor(data, message) {
    if (typeof data === "string") { // 如果 data 不是 一个 json 格式，则会返回 msg
      this.message = data;
      data = null;
      message = null;
    }
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errno = 0;
  }
}

class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errno = -1;
  }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
