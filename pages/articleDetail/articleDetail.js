const ARTICLES = require('../../utils/articles.js'); // 推文数据（与阅读札记列表页共用）

Page({
  // ====================== 页面数据区 ======================
  data: {
    article: {} // 当前推文
  },

  // ====================== 页面生命周期 ======================
  onLoad(options) {
    const id = Number(options.id); // 从列表页带过来的推文id
    const article = ARTICLES.find(a => a.id === id);
    if (!article) { // 兜底：找不到时提示并返回
      wx.showToast({ title: '内容不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    this.renderArticle(article);
  },

  renderArticle(article) {
    this.setData({ article });
    wx.setNavigationBarTitle({ title: article.title }); // 导航栏显示文章标题
  }
});
