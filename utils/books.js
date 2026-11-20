// =====================================================================
// 书籍数据 · 月度书籍推荐（来源于《推荐书单.doc》）
// ---------------------------------------------------------------------
// 【字段说明】
//   shelf   所属栏目：required 课标必读 / grade 分年级拓展 / deep 人文深度
//   grade   年级（仅 shelf=grade 的书有值）：10=高一 11=高二 12=高三
//   guide   专业导读（书籍详情页展示）
//   month   所属书单月份（每月更新书单时，改这个字段和书目即可）
// ---------------------------------------------------------------------
// 【如何增删书籍】
//   照抄一行对象，改字段即可；id 保持唯一递增，不要重复。
// =====================================================================
module.exports = [
  // ============ 课标必读（不分年级） ============
  { id: 1, title: '乡土中国', author: '费孝通',
  cover: '/images/books/乡土中国.jpg',
  tags: ['社会学', '经典'], shelf: 'required', month: '2026-08',
  guide: '理解中国乡土社会结构，学习社会学的思辨视角，把握书中核心概念，适配高一整本书阅读单元。' },

  { id: 2, title: '红楼梦', author: '曹雪芹', 
  cover: '/images/books/红楼梦.jpg', 
  tags: ['古典名著', '四大名著'], shelf: 'required', month: '2026-08',
  guide: '古典小说巅峰，从家族兴衰、人物命运与诗词细节读懂悲剧内核，建议分回精读，不必急于求成。' },

  { id: 3, title: '呐喊', author: '鲁迅',
  cover: '/images/books/呐喊.jpg',
  tags: ['现代文学', '鲁迅'], shelf: 'required', month: '2026-08',
  guide: '读懂国民性的叩问，体会现代文学的批判力量，可结合时代背景理解人物的困境与觉醒。' },

  { id: 4, title: '老人与海', author: '海明威', 
  cover: '/images/books/老人与海.jpg',
  tags: ['外国文学', '诺贝尔奖'], shelf: 'required', month: '2026-08',
  guide: '极简叙事之下的生命抗争，学习小说象征手法，适合做人物、主题的思辨写作素材。' },

  // ============ 分年级拓展·高一 ============
  { id: 5, title: '苏东坡传', author: '林语堂',
  cover: '/images/books/苏东坡传.jpg',
  tags: ['传记', '林语堂'], shelf: 'grade', grade: 10, month: '2026-08',
  guide: '看见逆境之中的生命旷达，积累人物素材，体会文人的精神世界。' },

  { id: 6, title: '平凡的世界', author: '路遥',
  cover: '/images/books/平凡的世界.jpg', 
  tags: ['当代文学', '茅盾文学奖'], shelf: 'grade', grade: 10, month: '2026-08',
  guide: '在时代洪流里看见普通人的奋斗，理解个体命运与时代之间的联结。' },

  { id: 7, title: '古文观止', author: '吴楚材、吴调侯选注', 
  cover: '/images/books/古文观止.jpg',
  tags: ['文言文', '古典散文'], shelf: 'grade', grade: 10, month: '2026-08',
  guide: '精选历代散文，提升文言文语感，碎片化选读，辅助课内古文学习。' },

  { id: 8, title: '我与地坛', author: '史铁生', 
  cover: '/images/books/我与地坛.jpg',
  tags: ['散文', '史铁生'], shelf: 'grade', grade: 10, month: '2026-08',
  guide: '关于苦难、生命与自我和解，散文语言细腻，适合启发学生向内思考生命意义。' },

  // ============ 分年级拓展·高二 ============
  { id: 9, title: '中国哲学简史', author: '冯友兰', 
  cover: '/images/books/中国哲学简史.jpg',
  tags: ['哲学', '国学'], shelf: 'grade', grade: 11, month: '2026-08',
  guide: '通俗梳理中国哲学脉络，搭建基础哲学认知，为议论文提供思想角度。' },

  { id: 10, title: '围城', author: '钱钟书', 
  cover: '/images/books/围城.jpg',
  tags: ['讽刺文学', '钱钟书'], shelf: 'grade', grade: 11, month: '2026-08',
  guide: '以幽默讽刺洞察人性与世相，读懂比喻与反讽艺术，练习对社会现象的反思。' },

  { id: 11, title: '雷雨', author: '曹禺', cover: '/images/books/雷雨.jpg', tags: ['戏剧', '曹禺'], shelf: 'grade', grade: 11, month: '2026-08',
    guide: '研读戏剧冲突，体会时代背景下人物的命运悲剧，学习戏剧文本的解读方法。' },
  { id: 12, title: '寂静的春天', author: '蕾切尔·卡逊', cover: '/images/books/寂静的春天.jpg', tags: ['生态', '科普'], shelf: 'grade', grade: 11, month: '2026-08',
    guide: '生态与人文结合，学会从文学视角审视现实社会议题，拓展思考边界。' },

  // ============ 分年级拓展·高三 ============
  { id: 13, title: '文化苦旅', author: '余秋雨', cover: '/images/books/文化苦旅.jpg', tags: ['文化散文', '余秋雨'], shelf: 'grade', grade: 12, month: '2026-08',
    guide: '行走山河读懂文明，文字厚重优美，积累文化类作文立意与素材。' },
  { id: 14, title: '万历十五年', author: '黄仁宇', cover: '/images/books/万历十五年.jpg', tags: ['历史', '黄仁宇'], shelf: 'grade', grade: 12, month: '2026-08',
    guide: '以小事件看见大历史，学习"大历史观"，训练历史类文本思辨分析。' },
  { id: 15, title: '沉默的大多数', author: '王小波', cover: '/images/books/沉默的大多数.jpg', tags: ['杂文', '王小波'], shelf: 'grade', grade: 12, month: '2026-08',
    guide: '随笔短文合集，犀利清醒，学习议论文的逻辑表达，碎片化时间阅读即可。' },
  { id: 16, title: '唐诗鉴赏辞典', author: '萧涤非', cover: '/images/books/唐诗鉴赏辞典.jpg', tags: ['诗词', '工具书'], shelf: 'grade', grade: 12, month: '2026-08',
    guide: '随手翻阅，感受古典诗歌审美，助力诗歌鉴赏题型，积累作文意象素材。' },

  // ============ 人文深度·中国方向 ============
  { id: 17, title: '楚辞选', author: '陆侃如、龚克昌选译', cover: '/images/books/楚辞.jpg', tags: ['古典文学', '楚辞'], shelf: 'deep', month: '2026-08',
    guide: '感受楚辞瑰丽浪漫，理解屈原的家国情怀，领略先秦浪漫主义文学风采。' },
  { id: 18, title: '美学散步', author: '宗白华', cover: '/images/books/美学散步.jpg', tags: ['美学', '艺术'], shelf: 'deep', month: '2026-08',
    guide: '带领读者漫步中国传统美学，体悟书法、绘画、诗歌之中的东方审美意境。' },
  { id: 19, title: '万古江河', author: '许倬云', cover: '/images/books/万古江河.jpg', tags: ['历史', '许倬云'], shelf: 'deep', month: '2026-08',
    guide: '跳出朝代叙事，从文明流动视角读懂中国历史，建立宏大的历史视野。' },
  { id: 20, title: '陶庵梦忆', author: '张岱', cover: '/images/books/陶庵梦忆.jpg', tags: ['小品文', '晚明'], shelf: 'deep', month: '2026-08',
    guide: '晚明小品文，繁华与沧桑交织，短小篇章，体会古典散文的文字之美与历史感慨。' },

  // ============ 人文深度·外国方向 ============
  { id: 21, title: '复活', author: '列夫·托尔斯泰', cover: '/images/books/复活.jpg', tags: ['外国文学', '托尔斯泰'], shelf: 'deep', month: '2026-08',
    guide: '关于人性的忏悔、救赎与社会反思，探讨道德与时代的复杂命题。' },
  { id: 22, title: '局外人', author: '加缪', cover: '/images/books/局外人.jpg', tags: ['存在主义', '诺贝尔奖'], shelf: 'deep', month: '2026-08',
    guide: '理解荒诞文学，思考个体与世界之间的关系，适合思辨类主题研读。' },
  { id: 23, title: '你当像鸟飞往你的山', author: '塔拉·韦斯特弗', cover: '/images/books/你当像鸟飞往你的山.jpg', tags: ['自传', '成长'], shelf: 'deep', month: '2026-08',
    guide: '教育如何重塑自我，真实自传，启发学生思考自我成长与认知的力量。' },
  { id: 24, title: '瓦尔登湖', author: '梭罗', cover: '/images/books/瓦尔登湖.jpg', tags: ['自然文学', '梭罗'], shelf: 'deep', month: '2026-08',
    guide: '在自然之中反思现代生活，文字沉静，引导思考自我、物质与精神的取舍。' }
];
