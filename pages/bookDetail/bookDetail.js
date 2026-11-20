const app = getApp(); // 获取全局app实例，访问全局数据与持久化方法
const allBooks = require('../../utils/books.js');
const util = require('../../utils/util.js'); // 工具函数：时间格式化等

Page({
  // ====================== 页面数据区 ======================
  data: {
    book: {},                // 当前书籍详情对象
    isRead: false,           // 是否标记为已读
    selectedRating: 0,       // 用户选中的评分星星
    stars: [1,2,3,4,5],      // 评分组件循环数组
    reviewContent: '',       // 用户评价输入框内容
    reviews: []              // 当前书籍的评价列表
  },

  // ====================== 页面生命周期 ======================
  onLoad(options) {
    const id = Number(options.id); // 获取url传递过来的书籍id
    // 云端数据是异步加载的，等就绪后再加载书籍详情与评价
    app.dataReady.then(() => {
      this.loadBookDetail(id);
    });
  },

  onShow() {
    // 从其他页面返回时刷新评价列表（同样等云端数据就绪）
    if (this.data.book.id) {
      app.dataReady.then(() => {
        this.loadReviews(this.data.book.id);
      });
    }
  },

  // ====================== 加载书籍详情 ======================
  loadBookDetail(id) {
    const book = allBooks.find(b => b.id === id); // 根据id查找对应书籍
    if (book) {
      this.setData({
        book,
        isRead: app.globalData.readBooks.includes(id) // 判断本书是否已标记已读
      });
      this.loadReviews(id); // 加载本书对应的评价
    }
  },

  // ====================== 加载评价列表（从云端） ======================
  loadReviews(bookId) {
    const db = wx.cloud.database();
    // 按书籍id查询该书的评价
    db.collection('reviews')
      .where({ bookId })
      .get()
      .then(res => {
        const myOpenid = app.globalData.myOpenid; // 当前用户openid，用于标记“我的评价”
        // 客户端按时间倒序（避免依赖数据库组合索引），并拼接★☆字符串、区分自己与他人的评价
        const reviews = res.data
          .sort((a, b) => b.time.localeCompare(a.time))
          .map(r => ({
            ...r,
            stars: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating),
            isUser: r._openid === myOpenid,
            userName: r._openid === myOpenid ? '我' : '书友' + r._openid.slice(-4)
          }));
        this.setData({ reviews });
      });
  },

  // ====================== 标记/取消已读 ======================
  toggleRead() {
    const bookId = this.data.book.id;
    const readBooks = app.globalData.readBooks;
    const index = readBooks.indexOf(bookId);
    if (index > -1) {
      readBooks.splice(index, 1); // 移除id，取消已读
      wx.showToast({ title: '取消已读', icon: 'none' });
    } else {
      readBooks.push(bookId); // 新增id，标记已读
      wx.showToast({ title: '标记已读', icon: 'success' });
    }
    app.saveReadBooks(); // 调用全局方法持久化存储
    this.setData({ isRead: index === -1 });
  },

  // ====================== 评分与评价提交 ======================
  setRating(e) {
    const rating = Number(e.currentTarget.dataset.rating); // 获取点击的星数
    this.setData({ selectedRating: rating });
  },

  onReviewInput(e) {
    this.setData({ reviewContent: e.detail.value }); // 更新评价输入框内容
  },

  submitReview() {
    const { reviewContent, selectedRating, book } = this.data;
    if (!reviewContent.trim()) { // 校验评价内容不能为空
      wx.showToast({ title: '请输入评价内容', icon: 'none' });
      return;
    }
    if (selectedRating === 0) { // 校验必须选择评分
      wx.showToast({ title: '请选择评分', icon: 'none' });
      return;
    }
    const db = wx.cloud.database();
    // 组装评价对象写入云端（发布者_openid由云开发自动记录，无需自己保存）
    db.collection('reviews').add({
      data: {
        bookId: book.id,
        bookTitle: book.title,
        rating: selectedRating,
        content: reviewContent,
        time: util.formatMinute(new Date())
      }
    }).then(() => {
      // 同步到全局缓存，保证书单页的评价数量即时刷新
      app.globalData.reviews.push({
        bookId: book.id,
        bookTitle: book.title,
        rating: selectedRating,
        content: reviewContent,
        time: util.formatMinute(new Date()),
        _openid: app.globalData.myOpenid
      });
      wx.showToast({ title: '评价成功', icon: 'success' }); // 弹窗提示
      this.setData({ reviewContent: '', selectedRating: 0 });  // 提交完成清空表单
      this.loadReviews(book.id);  // 刷新评价列表
    }).catch(err => {
      console.error('评价提交失败', err);
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
    });
  }
});
