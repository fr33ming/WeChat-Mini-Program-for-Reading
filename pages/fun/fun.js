Page({
  goToEssay() {
    wx.navigateTo({
      url: '/pages/essays/essays'
    });
  },

  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  comingSoon() {
    wx.showToast({ title: '功能开发中，敬请期待！', icon: 'none' });
  }
});