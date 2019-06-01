const { ErrorModel } = require('../model/resModel')

// 统一的登陆验证函数

const loginCheck = req => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }
}

module.exports = {
    loginCheck
}