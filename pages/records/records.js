const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具
const ALL_BOOKS = require('../../utils/books.js'); // 共享书籍数据（月度书单）

Page({
  // ====================== 页面数据区 ======================
  data: {
    readCount: 0,         // 已读书籍数量
    essayCount: 0,        // 我的随笔条数
    favCount: 0,          // 我的收藏条数
    likeCount: 0,         // 我的喜欢条数
    readBooks: [],        // 已读书籍完整数组
    myEssays: [],         // 我发布的随笔列表
    favEssays: [],        // 我收藏的全部内容（原始数据）
    likedEssays: [],      // 我点赞的全部内容（原始数据）
    favShow: [],          // 收藏列表（按类型筛选后展示）
    likeShow: [],         // 喜欢列表（按类型筛选后展示）
    favFilter: 'essay',   // 收藏类型筛选：essay=随笔 article=资讯（资讯为tab3预留）
    likeFilter: 'essay',  // 喜欢类型筛选：essay=随笔 article=资讯
    activeTab: 'read'     // 当前激活tab，默认已读
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    this.loadData(); // 每次页面显示重新加载统计与列表数据
  },

  // ====================== 加载统计与列表数据 ======================
  loadData() {
    // 并行查询：我的已读id + 我的随笔 + 我的收藏 + 我的点赞
    Promise.all([
      cloudUtil.getMyReadBooks(),
      cloudUtil.getMyEssays(),
      cloudUtil.getMyFavoriteEssays(),
      cloudUtil.getMyLikedEssays()
    ]).then(([readBookIds, myEssays, favEssays, likedEssays]) => {
      // 已读书籍：根据已读id从共享书单筛选出完整书籍对象
      const readBooks = ALL_BOOKS.filter(book => readBookIds.includes(book.id));

      // 随笔/收藏/喜欢：拼接类型标签文案
      const withTypeName = list => list.map(e => ({
        ...e,
        typeName: e.type === 'reading' ? '读后感' : '书评'
      }));

      // 类型筛选：收藏/喜欢里同时可能有随笔和资讯（资讯未上线，暂无kind字段的记录都算随笔）
      const byType = (list, type) => list.filter(e => (e.kind || 'essay') === type);

      this.setData({
        readBooks,
        myEssays: withTypeName(myEssays),
        favEssays: withTypeName(favEssays),
        likedEssays: withTypeName(likedEssays),
        favShow: byType(favEssays, this.data.favFilter),
        likeShow: byType(likedEssays, this.data.likeFilter),
        readCount: readBooks.length,
        essayCount: myEssays.length,
        favCount: favEssays.length,
        likeCount: likedEssays.length
      });
    }).catch(err => {
      console.error('个人纪录加载失败（请确认云集合已创建）', err);
    });
  },

  // ====================== Tab切换 ======================
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab; // 获取点击tab标识
    this.setData({ activeTab: tab });
  },

  // ====================== 收藏/喜欢类型筛选 ======================
  onFavFilter(e) {
    const type = e.currentTarget.dataset.filter; // essay=随笔 article=资讯
    this.setData({
      favFilter: type,
      favShow: this.data.favEssays.filter(item => (item.kind || 'essay') === type)
    });
  },

  onLikeFilter(e) {
    const type = e.currentTarget.dataset.filter;
    this.setData({
      likeFilter: type,
      likeShow: this.data.likedEssays.filter(item => (item.kind || 'essay') === type)
    });
  },

  // ====================== 跳转书籍详情 ======================
  goToDetail(e) {
    const id = e.currentTarget.dataset.id; // 获取书籍id
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?id=${id}` // url传参跳转详情页
    });
  },

  // ====================== 跳转随笔详情 ======================
  goToEssay(e) {
    const id = e.currentTarget.dataset.id; // 获取随笔id
    wx.navigateTo({
      url: `/pages/essayDetail/essayDetail?id=${id}`
    });
  }
});
