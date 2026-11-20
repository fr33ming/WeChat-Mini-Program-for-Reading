const allBooks = require('../../utils/books.js');
const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具
const util = require('../../utils/util.js'); // 工具函数：时间格式化等

Page({
  // ====================== 页面数据区 ======================
  data: {
    bookTitle: '',    // 当前书籍标题（从书籍详情页带入，写死不可改）
    type: 'reading',  // 评论类型：'reading'读后感 | 'review'书评
    title: '',        // 评论标题
    content: ''       // 评论内容
  },

  // ====================== 页面生命周期 ======================
  onLoad(options) {
    // 只能从书籍详情页进入（必须带bookId），书籍固定为那一本
    const book = allBooks.find(b => b.id === Number(options.bookId));
    if (!book) {
      wx.showToast({ title: '请从书籍详情页进入', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800); // 稍作停留后返回
      return;
    }
    this.bookId = book.id; // 书籍id存在实例上，不进入页面数据
    this.setData({ bookTitle: book.title });
  },

  // ====================== 表单事件 ======================
  onTypeChange(e) {
    this.setData({ type: e.currentTarget.dataset.type });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  // ====================== 发布评论 ======================
  submit() {
    const { bookTitle, type, title, content } = this.data;
    if (!this.bookId) { // 兜底校验：必须有书籍
      wx.showToast({ title: '请从书籍详情页进入', icon: 'none' });
      return;
    }
    if (!title.trim()) { // 校验标题不能为空
      wx.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }
    if (!content.trim()) { // 校验内容不能为空
      wx.showToast({ title: '请填写内容', icon: 'none' });
      return;
    }
    // 写入云端（发布者_openid由云开发自动记录）
    cloudUtil.addComment({
      bookId: this.bookId,
      bookTitle,
      type,
      title: title.trim(),
      content: content.trim(),
      time: util.formatMinute(new Date())
    }).then(() => {
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 800); // 发布后返回上一页
    }).catch(err => {
      console.error('评论发布失败', err);
      wx.showToast({ title: '发布失败，请重试', icon: 'none' });
    });
  }
});
