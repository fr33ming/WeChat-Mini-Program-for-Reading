const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具

Page({
  // ====================== 页面数据区 ======================
  data: {
    comments: [] // 评论列表
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    this.loadComments(); // 每次显示刷新（写完评论返回时能看到新内容）
  },

  // ====================== 加载评论广场 ======================
  loadComments() {
    // 并行查询：全部评论 + 点赞/收藏记录 + 评论回复 + 全部用户昵称映射
    Promise.all([
      cloudUtil.getAllComments(),
      cloudUtil.getAllMarks(),
      cloudUtil.getAllReplies(),
      cloudUtil.getUserNicknameMap()
    ]).then(([comments, marks, replies, userMap]) => {
      // 统计每篇评论的点赞数、回复数
      const likeMap = {}, replyMap = {};
      marks.forEach(m => {
        if (m.kind === 'like') likeMap[m.commentId] = (likeMap[m.commentId] || 0) + 1;
      });
      replies.forEach(c => {
        replyMap[c.commentId] = (replyMap[c.commentId] || 0) + 1;
      });
      // 最新的在前，拼接展示字段（作者名：改过名字用昵称，否则用默认名）
      const commentList = comments
        .sort((a, b) => b.time.localeCompare(a.time))
        .map(e => ({
          ...e,
          typeName: e.type === 'reading' ? '读后感' : '书评', // 类型标签文案
          userName: userMap[e._openid] || cloudUtil.defaultNickname(e._openid),
          likeCount: likeMap[e._id] || 0,
          commentCount: replyMap[e._id] || 0
        }));
      this.setData({ comments: commentList });
    }).catch(err => {
      console.error('评论广场加载失败（请确认云集合已创建）', err);
      this.setData({ comments: [] }); // 集合未就绪时显示空状态
    });
  },

  // ====================== 页面跳转 ======================
  goToComment(e) {
    const id = e.currentTarget.dataset.id; // 评论id
    wx.navigateTo({
      url: `/pages/commentDetail/commentDetail?id=${id}`
    });
  }
});
