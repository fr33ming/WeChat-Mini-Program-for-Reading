const allBooks = require('../../utils/books.js');
const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具

// 月度书单的三个栏目（key 与 utils/books.js 里的 shelf 字段对应）
const SHELVES = [
  { key: 'required', title: '课标必读书目', icon: '🎓', desc: '教材指定阅读，打牢语文基础' },
  { key: 'grade', title: '分年级拓展书目', icon: '📚', desc: '按年级拓展阅读，开阔视野' },
  { key: 'deep', title: '人文深度读物', icon: '🕊️', desc: '人文经典，滋养思考与成长' }
];

// 栏目筛选按钮：全部 + 三个栏目
const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'required', label: '课标必读' },
  { key: 'grade', label: '分年级拓展' },
  { key: 'deep', label: '人文深度' }
];

// 年级选项：不限 + 一~九年级 + 高一/高二/高三（value 与 utils/books.js 里的 grade 对应）
const GRADES = [{ value: 0, label: '不限' }];
for (let i = 1; i <= 9; i++) {
  GRADES.push({ value: i, label: `${i}年级` });
}
GRADES.push({ value: 10, label: '高一' });
GRADES.push({ value: 11, label: '高二' });
GRADES.push({ value: 12, label: '高三' });

Page({
  // ====================== 页面数据区 ======================
  data: {
    month: '2026年8月',
    searchTerm: '',        // 搜索框输入内容
    filteredBooks: [],     // 搜索结果列表
    shelfBooks: [],        // 按栏目/年级筛选后的书籍列表
    books: [],             // 全部书籍（带已读标记，供搜索与筛选过滤）
    filters: FILTERS,      // 栏目筛选按钮
    grades: GRADES,        // 年级选项
    filterShelf: 'all',    // 当前选中的栏目（all=全部）
    filterGrade: 0,        // 当前选中的年级（0=不限）
    currentShelfTitle: ''  // 当前筛选栏目的完整标题（如：课标必读书目）
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    // 页面每次显示刷新（云端按需查询）
    this.loadBooks();
  },

  // ====================== 加载书籍与栏目 ======================
  loadBooks() {
    // 查询我的已读书籍id，用于标记已读状态
    cloudUtil.getMyReadBooks().then(readBookIds => {
      const books = allBooks.map(book => ({
        ...book,
        isRead: readBookIds.includes(book.id) // 判断本书是否已读
      }));
      this.setData({ books });
      this.applyFilter(); // 搜索状态下同步过滤
      this.applyShelfFilter(); // 栏目/年级筛选状态同步过滤
    }).catch(err => {
      console.error('书单加载失败（请确认云集合已创建）', err);
      // 云端集合未就绪时，退化为静态书单展示（无已读标记）
      const books = allBooks.map(book => ({ ...book, isRead: false }));
      this.setData({ books });
      this.applyFilter();
      this.applyShelfFilter();
    });
  },

  // ====================== 搜索 ======================
  onSearchInput(e) {
    this.setData({ searchTerm: e.detail.value });
    this.applyFilter(); // 输入变更立即重新过滤
  },

  // 搜索过滤：按书名/作者模糊匹配，结果平铺展示
  applyFilter() {
    const { books, searchTerm } = this.data;
    if (!searchTerm) {
      this.setData({ filteredBooks: [] });
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(lower) || book.author.toLowerCase().includes(lower)
    );
    this.setData({ filteredBooks: filtered });
  },

  // ====================== 栏目/年级筛选 ======================
  onFilterShelf(e) {
    const shelf = e.currentTarget.dataset.shelf; // 点击的栏目key
    this.setData({ filterShelf: shelf, filterGrade: 0 }); // 切换栏目时重置年级
    this.applyShelfFilter();
  },

  onFilterGrade(e) {
    const grade = Number(e.currentTarget.dataset.grade); // 点击的年级值
    this.setData({ filterGrade: grade });
    this.applyShelfFilter();
  },

  // 按栏目+年级过滤书籍（全部时不筛选，直接平铺所有书）
  applyShelfFilter() {
    const { books, filterShelf, filterGrade } = this.data;
    const shelf = SHELVES.find(s => s.key === filterShelf);
    if (filterShelf === 'all') {
      this.setData({ shelfBooks: [], currentShelfTitle: '' }); // 全部时平铺 books，无标题
      return;
    }
    const shelfBooks = books.filter(b =>
      b.shelf === filterShelf && (filterGrade === 0 || b.grade === filterGrade)
    );
    this.setData({ shelfBooks, currentShelfTitle: shelf ? shelf.title : '' });
  },

  // ====================== 页面跳转 ======================
  goToDetail(e) {
    const id = e.currentTarget.dataset.id; // 获取点击条目的书籍id
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?id=${id}`
    });
  }
});
