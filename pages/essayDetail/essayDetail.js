const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具
const util = require('../../utils/util.js'); // 工具函数：时间格式化等

Page({
  // ====================== 页面数据区 ======================
  data: {
    essay: {},        // 随笔内容
    typeName: '',     // 类型标签文案
    userName: '',     // 作者显示名
    liked: false,     // 我是否已点赞
    faved: false,     // 我是否已收藏
    likeCount: 0,     // 点赞数
    favCount: 0,      // 收藏数
    comments: [],     // 评论列表
    commentInput: ''  // 评论输入框内容
  },

  // ====================== 页面生命周期 ======================
  onLoad(options) {
    this.essayId = options.id; // 随笔id（存在实例上，不进入页面数据）
    this.loadDetail();
  },

  // ====================== 加载详情（正文 + 互动信息 + 评论） ======================
  loadDetail() {
    const essayId = this.essayId;
    Promise.all([
      cloudUtil.getEssay(essayId),
      cloudUtil.getEssayMarkInfo(essayId),
      cloudUtil.getEssayComments(essayId),
      cloudUtil.getUserNicknameMap()
    ]).then(([essay, markInfo, comments, userMap]) => {
      // 评论列表拼接作者名（改过名字用昵称，否则用默认名）
      const fmtComments = comments.map(c => ({
        ...c,
        userName: userMap[c._openid] || cloudUtil.defaultNickname(c._openid)
      }));
      this.setData({
        essay,
        typeName: essay.type === 'reading' ? '读后感' : '书评',
        userName: userMap[essay._openid] || cloudUtil.defaultNickname(essay._openid),
        liked: markInfo.liked,
        faved: markInfo.faved,
        likeCount: markInfo.likeCount,
        favCount: markInfo.favCount,
        comments: fmtComments
      });
    }).catch(err => {
      console.error('随笔详情加载失败', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  // ====================== 点赞 / 收藏 ======================
  toggleLike() {
    cloudUtil.toggleLike(this.essayId).then(liked => {
      this.setData({
        liked,
        likeCount: this.data.likeCount + (liked ? 1 : -1) // 按返回的最新状态更新计数
      });
    });
  },

  toggleFav() {
    cloudUtil.toggleFav(this.essayId).then(faved => {
      this.setData({
        faved,
        favCount: this.data.favCount + (faved ? 1 : -1)
      });
      wx.showToast({ title: faved ? '已收藏' : '已取消收藏', icon: 'none' });
    });
  },

  // ====================== 评论 ======================
  onCommentInput(e) {
    this.setData({ commentInput: e.detail.value });
  },

  sendComment() {
    const content = this.data.commentInput.trim();
    if (!content) { // 校验评论不能为空
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }
    cloudUtil.addComment({
      essayId: this.essayId,
      content,
      time: util.formatMinute(new Date())
    }).then(() => {
      this.setData({ commentInput: '' }); // 清空输入框
      wx.showToast({ title: '评论成功', icon: 'success' });
      this.loadDetail(); // 刷新评论列表
    }).catch(err => {
      console.error('评论失败', err);
      wx.showToast({ title: '评论失败，请重试', icon: 'none' });
    });
  },

  // ====================== 跳转书籍详情 ======================
  goToBook() {
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?id=${this.data.essay.bookId}`
    });
  }
});
