// 书籍数据：月度书单示例
// 字段说明：
//   shelf  所属栏目：required 课标必读书目 / grade 分年级拓展书目 / deep 人文深度读物
//   guide  专业导读（示例文案）
//   month  所属书单月份（每月更新 = 改这个字段和书目）
module.exports = [
  { id: 1, title: '三体', author: '刘慈欣', cover: '三体', coverColor: '#2C3E50', description: '地球文明向宇宙发出的一声啼鸣...', tags: ['科幻','硬科幻'], shelf: 'grade', grade: 10, month: '2026-08',
    guide: '地球文明向宇宙发出的一声啼鸣，引来高等文明的降维打击。建议带着"黑暗森林"法则重读，思考文明与文明之间，究竟有没有和平共处的可能。' },
  { id: 2, title: '活着', author: '余华', cover: '活着', coverColor: '#C0392B', description: '讲述了一个人一生的故事...', tags: ['文学','经典'], shelf: 'required', grade: 11, month: '2026-08',
    guide: '一个人、一头牛、一段跨越半个世纪的悲欢。福贵的一生教会我们：活着本身就是意义，即便苦难加身，依然可以温柔地活下去。' },
  { id: 3, title: '百年孤独', author: '马尔克斯', cover: '孤独', coverColor: '#8E44AD', description: '魔幻现实主义代表作...', tags: ['外国文学','魔幻','诺贝尔文学奖'], shelf: 'deep', month: '2026-08',
    guide: '布恩迪亚家族七代人的命运轮回，魔幻与现实的交织。人名重复是阅读的最大障碍，建议边读边画人物关系图，才能理清"孤独"的真意。' },
  { id: 4, title: '小王子', author: '圣埃克苏佩里', cover: '小王子', coverColor: '#E67E22', description: '写给大人的童话...', tags: ['童话','哲学'], shelf: 'grade', grade: 4, month: '2026-08',
    guide: '写给大人的童话。每一章都是一面镜子，照见我们长大后丢失的纯真与想象力。等到长大再重读一遍，会有完全不同的发现。' },
  { id: 5, title: '解忧杂货店', author: '东野圭吾', cover: '解忧', coverColor: '#16A085', description: '温暖人心的推理故事...', tags: ['日本文学', '治愈','推理'], shelf: 'grade', grade: 8, month: '2026-08',
    guide: '一间深夜杂货店，能收到来自过去的烦恼信。温暖治愈的环形结构里，藏着"每一个选择都有意义"的温柔答案。' },
  { id: 6, title: '人类简史', author: '尤瓦尔·赫拉利', cover: '人类', coverColor: '#2980B9', description: '重新审视人类历史...', tags: ['历史','科普'], shelf: 'deep', month: '2026-08',
    guide: '从认知革命到人工智能，人类如何一步步成为地球的主宰？跳出朝代更迭的视角，用十万年的尺度重新理解人类。' },
  { id: 7, title: '朝花夕拾', author: '鲁迅', cover: '朝花', coverColor: '#6D7B8D', description: '鲁迅的童年回忆录，从百草园到三味书屋...', tags: ['散文','鲁迅'], shelf: 'required', grade: 7, month: '2026-08',
    guide: '鲁迅的童年回忆录，《从百草园到三味书屋》等名篇的出处。文字嬉笑怒骂，读懂背后那个时代，就读懂了半部中国近代史。' },
  { id: 8, title: '骆驼祥子', author: '老舍', cover: '祥子', coverColor: '#B5651D', description: '一个老实车夫在旧社会的沉浮...', tags: ['文学','老舍'], shelf: 'required', grade: 8, month: '2026-08',
    guide: '祥子三次买车、三次失去，一个老实人如何在旧社会一步步走向堕落。老舍用最地道的北京话，写最扎心的命运。' },
  { id: 9, title: '平凡的世界', author: '路遥', cover: '平凡', coverColor: '#556B2F', description: '孙少平兄弟在时代洪流中的奋斗...', tags: ['文学','奋斗'], shelf: 'deep', month: '2026-08',
    guide: '孙少平、孙少安兄弟在时代洪流中摸爬滚打，平凡人不平凡的精神世界。路遥用百万字告诉我们：人可以平凡，但不能平庸。' }
];
