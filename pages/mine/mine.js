const app = getApp(); // 获取全局app实例，读取全局数据

Page({
  // ====================== 页面数据区 ======================
  data: {
    readBooks: [],        // 已读书籍完整数组
    userReviews: [],      // 用户自己发布的评价列表
    readCount: 0,         // 已读书籍数量
    reviewCount: 0,       // 用户评价条数
    completionRate: 0,    // 阅读完成百分比
    activeTab: 'read'     // 当前激活tab，默认已读
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    // 云端数据异步加载，就绪后再渲染统计与列表
    app.dataReady.then(() => {
      this.loadData();
    });
  },

  // ====================== 加载统计与列表数据 ======================
  loadData() {
    // 模拟全部书籍基础数据源
    const allBooks = [
      { id: 1, title: '三体', author: '刘慈欣', cover: '三体', coverColor: '#2C3E50', category: '科幻' },
      { id: 2, title: '活着', author: '余华', cover: '活着', coverColor: '#C0392B', category: '文学' },
      { id: 3, title: '百年孤独', author: '马尔克斯', cover: '百年孤独', coverColor: '#8E44AD', category: '外国文学' },
      { id: 4, title: '小王子', author: '圣埃克苏佩里', cover: '小王子', coverColor: '#E67E22', category: '童话' },
      { id: 5, title: '解忧杂货店', author: '东野圭吾', cover: '解忧', coverColor: '#16A085', category: '日本文学' },
      { id: 6, title: '人类简史', author: '尤瓦尔·赫拉利', cover: '人类', coverColor: '#2980B9', category: '历史' }
    ];
    const readBookIds = app.globalData.readBooks;
    const readBooks = allBooks.filter(book => readBookIds.includes(book.id)); // 根据已读id筛选出完整书籍对象

    // 筛选当前用户自己的评价（通过openid匹配发布者），拼接星级展示字符串
    const userReviews = app.globalData.reviews
      .filter(r => r._openid === app.globalData.myOpenid)
      .map(r => ({
        ...r,
        stars: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)
      }));

    const totalBooks = allBooks.length;
    const completionRate = totalBooks > 0 ? Math.round((readBooks.length / totalBooks) * 100) : 0; // 计算阅读完成率，四舍五入取整

    this.setData({
      readBooks,
      userReviews,
      readCount: readBooks.length,
      reviewCount: userReviews.length,
      completionRate
    });
  },

  // ====================== Tab切换 ======================
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab; // 获取点击tab标识
    this.setData({ activeTab: tab });
  },

  // ====================== 跳转书籍详情 ======================
  goToDetail(e) {
    const id = e.currentTarget.dataset.id; // 获取书籍id
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?id=${id}` // url传参跳转详情页
    });
  }
});
