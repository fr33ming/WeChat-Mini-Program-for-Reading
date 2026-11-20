const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具
const util = require('../../utils/util.js'); // 工具函数：时间格式化等

Page({
  // ====================== 页面数据区 ======================
  data: {
    content: '' // 反馈内容
  },

  // ====================== 表单事件 ======================
  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  // ====================== 提交反馈 ======================
  submit() {
    const content = this.data.content.trim();
    if (!content) { // 校验反馈内容不能为空
      wx.showToast({ title: '请填写反馈内容', icon: 'none' });
      return;
    }
    if (content.length > 500) { // 校验长度
      wx.showToast({ title: '内容最多500字', icon: 'none' });
      return;
    }
    // 写入云端（发布者_openid由云开发自动记录）
    cloudUtil.addFeedback({
      content,
      time: util.formatMinute(new Date())
    }).then(() => {
      wx.showToast({ title: '反馈成功，谢谢！', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 800); // 提交后返回上一页
    }).catch(err => {
      console.error('反馈提交失败（请确认已创建feedbacks集合）', err);
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
    });
  }
});
