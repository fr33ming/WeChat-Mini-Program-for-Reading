// pages/cases/cases.js
Page({
  onShow(){
    wx.showModal({
      title: '提示',
      content: '页面开发中，敬请期待！',
      showCancel: false, // 隐藏取消按钮，只留确定
      confirmText: '知道了',
      success(res) {
        if (res.confirm) {
          wx.switchTab({url: '/pages/books/books'})
        }
      }
    })
  }
})