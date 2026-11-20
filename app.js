// app.js
App({
  onLaunch() {
    // 初始化云开发
    wx.cloud.init({
      env: 'cloud1-d0ge0gybca9aca0d1',   // 云开发环境ID（以云开发控制台显示为准）
      traceUser: true
    });
  },

  globalData: {
    // 全局数据（可被所有页面访问）
    // 说明：数据不再在启动时集中加载，各页面按需查询云端（统一封装在 utils/cloud.js）
  }
})
