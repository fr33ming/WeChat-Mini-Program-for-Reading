// app.js
App({
  onLaunch() {
    // 初始化云开发
    wx.cloud.init({
      env: '100052054806',   // 云开发环境ID（从云开发控制台复制）
      traceUser: true
    });
    // 启动时从云端拉取数据（异步），dataReady 是页面等待数据就绪的Promise
    this.dataReady = this.loadFromCloud();
  },

  globalData: {
    // 全局数据（可被所有页面访问）
    readBooks: [],   // 已读书籍ID列表
    reviews: [],     // 评价列表 [{bookId, bookTitle, rating, content, time, _openid}]
    myOpenid: '',    // 当前用户openid，用于标记“我的评价”
    myReadDocId: ''  // 当前用户在readBooks集合中的记录id
  },

  // ====================== 云端数据加载 ======================
  // 并行拉取：全部评价（所有用户共享）+ 我的已读记录（每个用户一条）
  loadFromCloud() {
    const db = wx.cloud.database();
    return Promise.all([
      db.collection('reviews').get(),
      this.ensureMyReadBook()
    ]).then(([reviewsRes]) => {
      this.globalData.reviews = reviewsRes.data;
    }).catch(err => {
      console.error('云端数据加载失败', err);
      wx.showToast({ title: '数据加载失败，请检查云环境', icon: 'none' });
    });
  },

  // 确保当前用户的已读记录存在，并取出openid与记录id
  ensureMyReadBook() {
    const db = wx.cloud.database();
    // 「仅创建者可读写」权限下，get()会自动只返回自己的记录
    return db.collection('readBooks').get().then(res => {
      if (res.data.length > 0) {
        // 已有记录：直接使用
        const mine = res.data[0];
        this.globalData.readBooks = mine.bookIds || [];
        this.globalData.myOpenid = mine._openid;
        this.globalData.myReadDocId = mine._id;
        return;
      }
      // 首次使用：先建一条空记录，再查一次拿回openid
      return db.collection('readBooks').add({ data: { bookIds: [] } })
        .then(() => db.collection('readBooks').get())
        .then(res => {
          const mine = res.data[0];
          this.globalData.readBooks = [];
          this.globalData.myOpenid = mine._openid;
          this.globalData.myReadDocId = mine._id;
        });
    });
  },

  // ====================== 已读列表同步到云端 ======================
  saveReadBooks() {
    const db = wx.cloud.database();
    // 只更新自己那一条已读记录（调用前需确保myReadDocId已就绪）
    return db.collection('readBooks')
      .doc(this.globalData.myReadDocId)
      .update({ data: { bookIds: this.globalData.readBooks } });
  }
})
