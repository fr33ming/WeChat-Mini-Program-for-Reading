Page({
  // ====================== 页面数据区 ======================
  data: {
    // 阅读测试海报：三张，可左右循环滑动
    quizzes: [
      { id: 1, name: '阅读水平测试', emoji: '📚', color: '#B8860B', science: '★★★★★', entertainment: '★★☆☆☆' },
      { id: 2, name: '阅读速度测试', emoji: '⚡', color: '#2E86AB', science: '★★★★☆', entertainment: '★★★☆☆' },
      { id: 3, name: '阅读习惯测试', emoji: '🧠', color: '#1F8A70', science: '★★★☆☆', entertainment: '★★★★☆' }
    ],
    currentIndex: 0 // 当前居中的海报下标（中间大、两侧小）
  },

  // ====================== 事件处理 ======================
  // 滑动海报时，同步更新居中的海报
  onSwiperChange(e) {
    this.setData({ currentIndex: e.detail.current });
  },

  goToComment() {
    wx.navigateTo({
      url: '/pages/comments/comments'
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
