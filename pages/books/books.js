const app = getApp(); // 获取全局app实例，读取globalData全局共享数据
const allBooks = require('../../utils/books.js');

Page({
  // ====================== 页面数据区 ======================
  data: {
    searchTerm: '',        // 搜索框输入内容
    showOnlyUnread: false, // 是否开启只展示未读书籍
    books: []              // 全部原始书籍数据
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    // 页面每次显示刷新，同步已读状态、评价数量（云端数据异步就绪后渲染）
    app.dataReady.then(() => {
      this.loadBooks();
    });
  },

  // ====================== 加载书籍数据 ======================
  loadBooks() {
    const readBooks = app.globalData.readBooks; // 全局已读书籍id数组
    const reviews = app.globalData.reviews;     // 全局所有评价记录

    // 给每本书追加：是否已读、评价条数
    const books = allBooks.map(book => {
      const isRead = readBooks.includes(book.id); // 判断本书是否标记已读
      const reviewCount = reviews.filter(r => r.bookId === book.id).length; //统计该书籍评价数量
      return { ...book, isRead, reviewCount }; // 展开原对象，追加新字段
    });

    this.setData({ books });
    this.applyFilter(); // 加载完立刻执行筛选
  },

  // ====================== 搜索与筛选事件 ======================
  onSearchInput(e) {
    this.setData({ searchTerm: e.detail.value }); // 更新搜索词
    this.applyFilter(); //输入变更立即重新过滤列表
  },

  toggleFilter() {
    this.setData({ showOnlyUnread: !this.data.showOnlyUnread }); // 切换未读筛选开关
    this.applyFilter();
  },

  // 筛选核心逻辑：搜索 + 未读过滤，输出filteredBooks供页面渲染
  applyFilter() {
    const { books, searchTerm, showOnlyUnread } = this.data;
    let filtered = books;

    // 模糊搜索：书名、作者匹配，转小写忽略大小写
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(lower) || book.author.toLowerCase().includes(lower)
      );
    }

    // 开启只看未读，过滤已读条目
    if (showOnlyUnread) {
      filtered = filtered.filter(book => !book.isRead);
    }

    this.setData({ filteredBooks: filtered });
  },

  // ====================== 页面跳转 ======================
  goToDetail(e) {
    const id = e.currentTarget.dataset.id; // 获取点击条目的书籍id
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?id=${id}` // url传参把id带给详情页
    });
  }
});
