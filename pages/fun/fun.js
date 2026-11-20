Page({
  goToReadingTest() {
    wx.navigateTo({
      url: '/pages/readingTest/readingTest'
    });
  },
  comingSoon() {
    wx.showToast({ title: '功能开发中，敬请期待！', icon: 'none' });
  }
});