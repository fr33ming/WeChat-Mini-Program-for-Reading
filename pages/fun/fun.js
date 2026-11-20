Page({
  // ====================== 页面数据区 ======================
  data: {
    // 阅读测试海报：三张，可左右循环滑动
    quizzes: [
      { id: 1, cover: '/images/tests/水平.png', science: '★★★★★', entertainment: '★★☆☆☆' },
      { id: 2, cover: '/images/tests/速度.png', science: '★★★★☆', entertainment: '★★★☆☆' },
      { id: 3, cover: '/images/tests/习惯.png', science: '★★★☆☆', entertainment: '★★★★☆' }
    ],
    currentIndex: 0, // 当前居中的海报下标（中间大、两侧小）
    // 调查问卷入口：名称前6个字符（如"2026年上"）即问卷标识，新增问卷在此追加即可
    surveys: [
      { name: '2026年暑期广州黄埔图书馆“红韵书香”系列活动调查问卷' },
      { name: '2026年上半年“读懂中国”研学营高中生调查问卷' },
      { name: '2025年下半年“一体化”阅读沙龙高中生调查问卷' },
      { name: '2025年暑期东莞茶山“红色阅读系列活动”调查问卷' },
    ]
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

  goToSurvey(e) {
    // 取入口名称前6个字符（如"2025年下"）作为问卷标识，自动匹配对应问卷
    const name = e.currentTarget.dataset.name;
    const term = name.substring(0, 6);
    wx.navigateTo({
      url: '/pages/survey/survey?term=' + term
    });
  },

  comingSoon() {
    wx.showToast({ title: '功能开发中，敬请期待！', icon: 'none' });
  }
});
