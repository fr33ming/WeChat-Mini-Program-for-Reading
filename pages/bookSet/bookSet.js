const allBooks = require('../../utils/bookSet.js');
const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具

Page({
  // ====================== 页面数据区 ======================
  data: {
    books: [] // 全部书籍（带已读标记）
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    // 页面每次显示刷新（云端按需查询）
    this.loadBooks();
  },

  // ====================== 加载书籍 ======================
  loadBooks() {
    // 查询我的已读书籍id，用于标记已读状态
    cloudUtil.getMyReadBooks().then(readBookIds => {
      const books = allBooks.map(book => ({
        ...book,
        isRead: readBookIds.includes(book.id) // 判断本书是否已读
      }));
      this.setData({ books });
    }).catch(err => {
      console.error('书单加载失败（请确认云集合已创建）', err);
      // 云端集合未就绪时，退化为静态书单展示（无已读标记）
      const books = allBooks.map(book => ({ ...book, isRead: false }));
      this.setData({ books });
    });
  },

  // ====================== 页面跳转 ======================
  goToDetail(e) {
    // 首页统一入口：跳转到 Books 页面（完整书库，支持搜索与筛选）
    wx.navigateTo({
      url: '/pages/books/books'
    });
  }
});
