const allBooks = require('../../utils/books.js');
const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具

Page({
  // ====================== 页面数据区 ======================
  data: {
    book: {},                // 当前书籍详情对象
    isRead: false,           // 是否标记为已读
    bookEssays: []           // 本书的随笔列表
  },

  // ====================== 页面生命周期 ======================
  onLoad(options) {
    const id = Number(options.id); // 获取url传递过来的书籍id
    this.loadBookDetail(id);
  },

  onShow() {
    // 从其他页面返回时刷新已读状态与随笔列表
    if (this.data.book.id) {
      this.refreshBookState(this.data.book.id);
      this.loadBookEssays(this.data.book.id);
    }
  },

  // ====================== 加载书籍详情 ======================
  loadBookDetail(id) {
    const book = allBooks.find(b => b.id === id); // 根据id查找对应书籍
    if (book) {
      this.setData({ book });
      this.refreshBookState(id); // 加载已读状态
      this.loadBookEssays(id);   // 加载本书随笔
    }
  },

  // ====================== 刷新已读状态 ======================
  refreshBookState(bookId) {
    cloudUtil.getMyReadBooks().then(readBookIds => {
      this.setData({
        isRead: readBookIds.includes(bookId) // 判断本书是否已标记已读
      });
    });
  },

  // ====================== 加载本书随笔 ======================
  loadBookEssays(bookId) {
    Promise.all([
      cloudUtil.getEssaysByBook(bookId),
      cloudUtil.getUserNicknameMap()
    ]).then(([essays, userMap]) => {
      // 拼接类型标签与作者名（改过名字用昵称，否则用默认名）
      const bookEssays = essays.map(e => ({
        ...e,
        typeName: e.type === 'reading' ? '读后感' : '书评',
        userName: userMap[e._openid] || cloudUtil.defaultNickname(e._openid)
      }));
      this.setData({ bookEssays });
    });
  },

  // ====================== 页面跳转 ======================
  goToWrite() {
    const bookId = this.data.book.id;
    wx.navigateTo({
      url: `/pages/essayWrite/essayWrite?bookId=${bookId}` // 带上本书id，写随笔页默认选中
    });
  },

  goToEssay(e) {
    const id = e.currentTarget.dataset.id; // 随笔id
    wx.navigateTo({
      url: `/pages/essayDetail/essayDetail?id=${id}`
    });
  },

  // ====================== 标记/取消已读 ======================
  toggleRead() {
    const bookId = this.data.book.id;
    cloudUtil.toggleReadBook(bookId).then(isRead => {
      this.setData({ isRead }); // 用云端返回的最新状态更新界面
      wx.showToast({ title: isRead ? '标记已读' : '取消已读', icon: isRead ? 'success' : 'none' });
    });
  }
});
