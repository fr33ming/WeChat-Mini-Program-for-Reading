const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具

Page({
  // ====================== 页面数据区 ======================
  data: {
    essays: [] // 随笔列表
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    this.loadEssays(); // 每次显示刷新（写完随笔返回时能看到新内容）
  },

  // ====================== 加载随笔广场 ======================
  loadEssays() {
    // 并行查询：全部随笔 + 点赞/收藏记录 + 评论 + 全部用户昵称映射
    Promise.all([
      cloudUtil.getAllEssays(),
      cloudUtil.getAllMarks(),
      cloudUtil.getAllComments(),
      cloudUtil.getUserNicknameMap()
    ]).then(([essays, marks, comments, userMap]) => {
      // 统计每篇随笔的点赞数、评论数
      const likeMap = {}, commentMap = {};
      marks.forEach(m => {
        if (m.kind === 'like') likeMap[m.essayId] = (likeMap[m.essayId] || 0) + 1;
      });
      comments.forEach(c => {
        commentMap[c.essayId] = (commentMap[c.essayId] || 0) + 1;
      });
      // 最新的在前，拼接展示字段（作者名：改过名字用昵称，否则用默认名）
      const essayList = essays
        .sort((a, b) => b.time.localeCompare(a.time))
        .map(e => ({
          ...e,
          typeName: e.type === 'reading' ? '读后感' : '书评', // 类型标签文案
          userName: userMap[e._openid] || cloudUtil.defaultNickname(e._openid),
          likeCount: likeMap[e._id] || 0,
          commentCount: commentMap[e._id] || 0
        }));
      this.setData({ essays: essayList });
    }).catch(err => {
      console.error('随笔广场加载失败（请确认云集合已创建）', err);
      this.setData({ essays: [] }); // 集合未就绪时显示空状态
    });
  },

  // ====================== 页面跳转 ======================
  goToEssay(e) {
    const id = e.currentTarget.dataset.id; // 随笔id
    wx.navigateTo({
      url: `/pages/essayDetail/essayDetail?id=${id}`
    });
  }
});
