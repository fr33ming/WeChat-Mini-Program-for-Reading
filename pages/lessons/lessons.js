// pages/lessons/lessons.js
// 云窗观书：以书为"视频"，B站首页卡片样式，一行两个，纯图片预览（不展示观看人数）
const durations = ['08:24', '12:36', '05:48', '15:02', '09:15', '21:40'];

Page({
  // ====================== 页面数据区 ======================
  data: {
    lessons: [
      { id: 1, title: '北上', cover: '/images/lessons/北上.jpg', author: '徐则臣' },
      { id: 2, title: '变形记', cover: '/images/lessons/变形记.jpg', author: '卡夫卡' },
      { id: 3, title: '搜神记', cover: '/images/lessons/搜神记.jpg', author: '干宝' },
      { id: 4, title: '燕食记', cover: '/images/lessons/燕食记.jpg', author: '葛亮' },
      { id: 5, title: '百年孤独', cover: '/images/lessons/百年孤独.jpg', author: '加西亚·马尔克斯' },
      { id: 6, title: '红楼梦', cover: '/images/lessons/红楼梦.jpg', author: '曹雪芹' }
    ].map((b, i) => ({ ...b, duration: durations[i % durations.length] }))
  }
});
