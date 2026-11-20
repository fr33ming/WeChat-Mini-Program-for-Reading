const cloudUtil = require('../../utils/cloud.js'); // 云数据库通用工具

Page({
  // ====================== 页面数据区 ======================
  data: {
    myNickname: '' // 我的用户名（默认：书友+id）
  },

  // ====================== 页面生命周期 ======================
  onShow() {
    this.loadData(); // 每次页面显示重新加载用户名
  },

  // ====================== 加载用户名 ======================
  loadData() {
    // 并行查询：我的用户资料 + 我的openid
    Promise.all([
      cloudUtil.getMyUser(),
      cloudUtil.getMyOpenid()
    ]).then(([myUser, myOpenid]) => {
      // 改过用昵称，没改过用默认名（书友+id尾号）
      this.setData({
        myNickname: myUser ? myUser.nickname : cloudUtil.defaultNickname(myOpenid)
      });
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

  // ====================== 跳转个人纪录 ======================
  goToRecords() {
    wx.navigateTo({
      url: '/pages/records/records'
    });
  }
});
