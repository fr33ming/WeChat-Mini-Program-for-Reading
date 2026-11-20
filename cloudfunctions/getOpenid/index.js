// 云函数：获取当前用户的openid（小程序端无法直接读取自己的openid，需通过云函数）
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 自动使用当前云环境

exports.main = async () => {
  const wxContext = cloud.getWXContext() // 获取调用者上下文
  return { openid: wxContext.OPENID }
}
