const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具
const ALL_BOOKS = require('../../utils/books.js'); // 共享书籍数据（月度书单）

// 类型筛选：评论=kind comment（无kind的旧数据也算评论）/ 案例=kind case / 随笔=kind essay
const byType = (list, type) => list.filter(e => {
  if (type === 'comment') return (e.kind || 'comment') === 'comment';
  return e.kind === type;
});

Page({
  // ====================== 页面数据区 ======================
  data: {
    myNickname: '',       // 我的用户名（默认：书友+id）
    readCount: 0,         // 已读书籍数量
    commentCount: 0,      // 我的评论条数
    favCount: 0,          // 我的收藏条数
    likeCount: 0,         // 我的喜欢条数
    readBooks: [],        // 已读书籍完整数组
    myComments: [],       // 我发布的评论列表
    favComments: [],      // 我收藏的全部内容（原始数据）
    likedComments: [],    // 我点赞的全部内容（原始数据）
    favShow: [],          // 收藏列表（按类型筛选后展示）
    likeShow: [],         // 喜欢列表（按类型筛选后展示）
    favFilter: 'comment', // 收藏类型筛选：comment=评论 case=案例 essay=随笔
    likeFilter: 'comment',// 喜欢类型筛选：comment=评论 case=案例 essay=随笔
    activeTab: 'read'     // 当前激活tab，默认已读
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    this.loadData(); // 每次页面显示重新加载用户名与列表数据
  },

  // ====================== 加载用户名与统计列表 ======================
  loadData() {
    // 并行查询：我的用户资料 + openid + 已读id + 我的评论 + 我的收藏 + 我的点赞
    Promise.all([
      cloudUtil.getMyUser(),
      cloudUtil.getMyOpenid(),
      cloudUtil.getMyReadBooks(),
      cloudUtil.getMyComments(),
      cloudUtil.getMyFavoriteComments(),
      cloudUtil.getMyLikedComments()
    ]).then(([myUser, myOpenid, readBookIds, myComments, favComments, likedComments]) => {
      // 改过用昵称，没改过用默认名（书友+id尾号）
      const myNickname = myUser ? myUser.nickname : cloudUtil.defaultNickname(myOpenid);

      // 已读书籍：根据已读id从共享书单筛选出完整书籍对象
      const readBooks = ALL_BOOKS.filter(book => readBookIds.includes(book.id));

      // 评论/收藏/喜欢：拼接类型标签文案
      const withTypeName = list => list.map(e => ({
        ...e,
        typeName: e.type === 'reading' ? '读后感' : '书评'
      }));

      this.setData({
        myNickname,
        readBooks,
        myComments: withTypeName(myComments),
        favComments: withTypeName(favComments),
        likedComments: withTypeName(likedComments),
        favShow: byType(favComments, this.data.favFilter),
        likeShow: byType(likedComments, this.data.likeFilter),
        readCount: readBooks.length,
        commentCount: myComments.length,
        favCount: favComments.length,
        likeCount: likedComments.length
      });
    }).catch(err => {
      console.error('个人数据加载失败（请确认云集合已创建）', err);
    });
  },

  // ====================== 修改用户名 ======================
  onEditName() {
    wx.showModal({
      title: '修改用户名',
      editable: true,          // 显示输入框
      content: this.data.myNickname, // 预填当前名字，方便直接改
      placeholderText: '输入新的用户名（10字以内）',
      success: res => {
        if (!res.confirm) return; // 用户点了取消
        const nickname = (res.content || '').trim();
        if (!nickname) { // 校验不能为空
          wx.showToast({ title: '用户名不能为空', icon: 'none' });
          return;
        }
        if (nickname.length > 10) { // 校验长度
          wx.showToast({ title: '用户名最多10个字', icon: 'none' });
          return;
        }
        cloudUtil.saveMyNickname(nickname).then(() => {
          wx.showToast({ title: '修改成功', icon: 'success' });
          this.loadData(); // 刷新页面上的名字
        }).catch(err => {
          console.error('保存昵称失败', err);
          wx.showToast({ title: '修改失败，请重试', icon: 'none' });
        });
      }
    });
  },

  // ====================== Tab切换 ======================
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab; // 获取点击tab标识
    this.setData({ activeTab: tab });
  },

  // ====================== 收藏/喜欢类型筛选 ======================
  onFavFilter(e) {
    const type = e.currentTarget.dataset.filter; // comment=评论 case=案例 essay=随笔
    this.setData({
      favFilter: type,
      favShow: byType(this.data.favComments, type)
    });
  },

  onLikeFilter(e) {
    const type = e.currentTarget.dataset.filter;
    this.setData({
      likeFilter: type,
      likeShow: byType(this.data.likedComments, type)
    });
  },

  // ====================== 跳转书籍详情 ======================
  goToDetail(e) {
    const id = e.currentTarget.dataset.id; // 获取书籍id
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?id=${id}` // url传参跳转详情页
    });
  },

  // ====================== 跳转评论详情 ======================
  goToComment(e) {
    const id = e.currentTarget.dataset.id; // 获取评论id
    wx.navigateTo({
      url: `/pages/commentDetail/commentDetail?id=${id}`
    });
  }
});
