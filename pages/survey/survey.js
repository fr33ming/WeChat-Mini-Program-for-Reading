Page({
  // ====================== 页面数据区 ======================
  data: {
    surveyTitle: '高中生调查问卷',
    questions: []
  },

  // 两套问卷题目：上半年围绕阅读偏好与计划，下半年围绕阅读收获与展望
  // 标识统一为"年份+学期"（如 2025年上），以后新增问卷照此命名
  questionSets: {
    '2026年上': [
      { id: 1, title: '您所在的年级', options: ['高一', '高二', '高三'], selected: -1 },
      { id: 2, title: '平时的日常阅读频率是', options: ['每天坚持阅读', '每周阅读2—4次', '偶尔阅读，每周起码1次', '几乎不主动进行课外阅读'], selected: -1 },
      { id: 3, title: '你平时每周的阅读时间约为', options: ['阅读时长≥7小时', '4小时—6小时', ' 1小时—3小时', '不足1小时'], selected: -1 },
      { id: 4, title: '你是否完整读完《中国孤儿》与《赵氏孤儿》两本读物？', options: ['两本均完整读完', '读完《中国孤儿》', '读完《赵氏孤儿》', '两本均未完整读完'], selected: -1 }
    ],
    '2025年下': [
      { id: 1, title: '您所在的年级', options: ['高一', '高二', '高三'], selected: -1 },
      { id: 2, title: '您的性别', options: ['男生', '女生'], selected: -1 },
      { id: 3, title: '您对阅读的兴趣（程度为1-5递增）', options: ['1', '2', '3', '4', '5'], selected: -1 },
      { id: 4, title: '您每周花费在阅读上的时间', options: ['小于1小时', '1~3小时', '3~5小时', '5~7小时', '7~9小时', '9~10小时', '10小时以上'], selected: -1 }
    ],
    '2025年上': [
      { id: 1, title: '您所在的年级', options: ['高一', '高二', '高三'], selected: -1 },
      { id: 2, title: '您的性别', options: ['男生', '女生'], selected: -1 },
    ]
  },

  // ====================== 生命周期 ======================
  // 根据入口传入的 term 加载对应的标题与题目
  // 以后新增问卷：只需在 questionSets 里加一套，此处无需改动
  onLoad(options) {
    const term = this.questionSets[options.term] ? options.term : '2026年上';
    wx.setNavigationBarTitle({ title: term });
    this.setData({
      surveyTitle: term,
      questions: this.questionSets[term]
    });
  },

  // ====================== 事件处理 ======================
  // 点击选项：选中该选项
  onSelect(e) {
    const qid = e.currentTarget.dataset.qid;
    const idx = e.currentTarget.dataset.idx;
    const questions = this.data.questions;
    questions.forEach(q => {
      if (q.id === qid) {
        q.selected = idx;
      }
    });
    this.setData({ questions });
  },

  // 提交：目前仅展示提交样式，不实际存储
  submit() {
    wx.showToast({ title: '提交成功，感谢参与！', icon: 'success' });
  }
});
