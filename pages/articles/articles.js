const ARTICLES = require('../../utils/articles.js'); // 推文数据（随笔/案例，编辑说明见该文件）

Page({
  // ====================== 页面数据区 ======================
  data: {
    activeTab: 'essay', // 当前板块：essay=随笔 case=案例
    showList: []        // 当前板块的推文列表
  },

  // ====================== 页面生命周期 ======================
  onLoad() {
    this.applyTab(this.data.activeTab); // 默认展示随笔板块
  },

  // ====================== 板块切换 ======================
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab; // 点击的板块：essay/case
    this.setData({ activeTab: tab });
    this.applyTab(tab);
  },

  // 按板块过滤推文列表
  applyTab(tab) {
    const list = ARTICLES.filter(a => a.type === tab);
    this.setData({ showList: list });
  },

  // ====================== 页面跳转 ======================
  goDetail(e) {
    const id = e.currentTarget.dataset.id; // 推文id
    wx.navigateTo({
      url: `/pages/articleDetail/articleDetail?id=${id}`
    });
  }
});
