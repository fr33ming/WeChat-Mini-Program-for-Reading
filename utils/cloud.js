// utils/cloud.js
// 云数据库通用工具：各页面按需调用，新增功能不需要改app.js
// 集合说明：
//   reviews  评价（权限：所有用户可读，仅创建者可读写）
//   readBooks 已读（权限：仅创建者可读写）每条记录 = 一个用户读过的一本书 {bookId}
//   comments  评论（权限：所有用户可读，仅创建者可读写）每条记录 = 一条评论
//   commentMarks 点赞/收藏记录（权限：仅创建者可读写）每条记录 = {commentId, kind: 'like'|'fav'}
//   commentReplies 评论回复（权限：所有用户可读，仅创建者可读写）每条记录 = {commentId, content, time}
// 云函数：getOpenid（获取当前用户openid，需在开发者工具中部署一次）

// ====================== 当前用户openid ======================
let myOpenid = '';

// 获取当前用户openid（带缓存，避免重复调用云函数）
function getMyOpenid() {
  if (myOpenid) return Promise.resolve(myOpenid);
  const cached = wx.getStorageSync('myOpenid');
  if (cached) {
    myOpenid = cached;
    return Promise.resolve(cached);
  }
  return wx.cloud.callFunction({ name: 'getOpenid' }).then(res => {
    myOpenid = res.result.openid;
    wx.setStorageSync('myOpenid', myOpenid); // 缓存到本地，下次免请求
    return myOpenid;
  }).catch(err => {
    console.error('获取openid失败（请确认已部署getOpenid云函数）', err);
    return ''; // 失败时返回空串，页面按未登录处理，不影响其他功能
  });
}

// ====================== 已读 ======================
// 我的已读书籍id列表（「仅创建者可读写」权限下，get()自动只返回自己的记录）
function getMyReadBooks() {
  const db = wx.cloud.database();
  return db.collection('readBooks').get().then(res =>
    res.data.map(r => r.bookId).filter(id => !!id) // 过滤掉可能存在的旧格式记录
  );
}

// 标记/取消已读，返回最新状态（true=已读）
function toggleReadBook(bookId) {
  const db = wx.cloud.database();
  return db.collection('readBooks').where({ bookId }).get().then(res => {
    if (res.data.length > 0) {
      // 已读过 → 删除这条记录，即取消已读
      return db.collection('readBooks').doc(res.data[0]._id).remove()
        .then(() => false);
    }
    // 未读过 → 新增一条（_openid由云开发自动记录发布者，无需自己保存）
    return db.collection('readBooks').add({ data: { bookId } })
      .then(() => true);
  });
}

// ====================== 评价 ======================
// 某本书的全部评价（按时间倒序）
function getBookReviews(bookId) {
  const db = wx.cloud.database();
  return db.collection('reviews').where({ bookId }).get().then(res =>
    res.data.sort((a, b) => b.time.localeCompare(a.time))
  );
}

// 我的评价列表（通过openid筛选，按时间倒序）
function getMyReviews() {
  const db = wx.cloud.database();
  return getMyOpenid().then(openid => {
    if (!openid) return []; // 拿不到openid时（云函数未部署）返回空列表
    return db.collection('reviews').where({ _openid: openid }).get()
      .then(res => res.data.sort((a, b) => b.time.localeCompare(a.time)));
  });
}

// 全部评价（分页拉取，突破单次20条上限，用于书单页统计条数）
function getAllReviews() {
  const db = wx.cloud.database();
  const PAGE_SIZE = 20;
  let all = [];
  const fetchPage = skip => db.collection('reviews').skip(skip).limit(PAGE_SIZE).get()
    .then(res => {
      all = all.concat(res.data);
      if (res.data.length === PAGE_SIZE) return fetchPage(skip + PAGE_SIZE); // 还有下一页
      return all;
    });
  return fetchPage(0);
}

// 新增一条评价
function addReview({ bookId, bookTitle, rating, content, time }) {
  const db = wx.cloud.database();
  return db.collection('reviews').add({
    data: { bookId, bookTitle, rating, content, time }
  });
}

// ====================== 评论 ======================
// 全部评论（分页拉取，突破单次20条上限）
function getAllComments() {
  const db = wx.cloud.database();
  const PAGE_SIZE = 20;
  let all = [];
  const fetchPage = skip => db.collection('comments').skip(skip).limit(PAGE_SIZE).get()
    .then(res => {
      all = all.concat(res.data);
      if (res.data.length === PAGE_SIZE) return fetchPage(skip + PAGE_SIZE); // 还有下一页
      return all;
    });
  return fetchPage(0);
}

// 单条评论详情（按_id读取）
function getComment(commentId) {
  const db = wx.cloud.database();
  return db.collection('comments').doc(commentId).get().then(res => res.data);
}

// 某本书的评论（按时间倒序）
function getCommentsByBook(bookId) {
  const db = wx.cloud.database();
  return db.collection('comments').where({ bookId }).get()
    .then(res => res.data.sort((a, b) => b.time.localeCompare(a.time)));
}

// 我的评论（通过openid筛选，按时间倒序）
function getMyComments() {
  const db = wx.cloud.database();
  return getMyOpenid().then(openid => {
    if (!openid) return []; // 拿不到openid时（云函数未部署）返回空列表
    return db.collection('comments').where({ _openid: openid }).get()
      .then(res => res.data.sort((a, b) => b.time.localeCompare(a.time)));
  });
}

// 新增一条评论（发布者_openid由云开发自动记录）
function addComment({ bookId, bookTitle, type, title, content, time }) {
  const db = wx.cloud.database();
  return db.collection('comments').add({
    data: { bookId, bookTitle, type, title, content, time }
  });
}

// ====================== 评论点赞与收藏 ======================
// 点赞/取消点赞，返回最新状态（true=已点赞）
function toggleLike(commentId) {
  return toggleMark(commentId, 'like');
}

// 收藏/取消收藏，返回最新状态（true=已收藏）
function toggleFav(commentId) {
  return toggleMark(commentId, 'fav');
}

// 点赞与收藏的通用增删逻辑（kind: 'like'点赞 | 'fav'收藏）
function toggleMark(commentId, kind) {
  const db = wx.cloud.database();
  return getMyOpenid().then(openid => {
    if (!openid) return false;
    // 查我是否已经点过（带openid精确匹配，避免误删别人的记录）
    return db.collection('commentMarks').where({ commentId, kind, _openid: openid }).get().then(res => {
      if (res.data.length > 0) {
        // 已点过 → 删除记录，取消
        return db.collection('commentMarks').doc(res.data[0]._id).remove().then(() => false);
      }
      // 没点过 → 新增一条
      return db.collection('commentMarks').add({ data: { commentId, kind } }).then(() => true);
    });
  });
}

// 某条评论的点赞/收藏信息（数量 + 我是否已点）
function getCommentMarkInfo(commentId) {
  const db = wx.cloud.database();
  return getMyOpenid().then(openid => Promise.all([
    db.collection('commentMarks').where({ commentId, kind: 'like' }).count(),
    db.collection('commentMarks').where({ commentId, kind: 'fav' }).count(),
    db.collection('commentMarks').where({ commentId, kind: 'like', _openid: openid }).get(),
    db.collection('commentMarks').where({ commentId, kind: 'fav', _openid: openid }).get()
  ])).then(([likeCnt, favCnt, myLike, myFav]) => ({
    likeCount: likeCnt.total,
    favCount: favCnt.total,
    liked: myLike.data.length > 0,
    faved: myFav.data.length > 0
  }));
}

// 全部点赞/收藏记录（分页拉取，用于评论列表统计）
function getAllMarks() {
  const db = wx.cloud.database();
  const PAGE_SIZE = 20;
  let all = [];
  const fetchPage = skip => db.collection('commentMarks').skip(skip).limit(PAGE_SIZE).get()
    .then(res => {
      all = all.concat(res.data);
      if (res.data.length === PAGE_SIZE) return fetchPage(skip + PAGE_SIZE);
      return all;
    });
  return fetchPage(0);
}

// 我收藏的评论列表（通过收藏记录反查评论）
function getMyFavoriteComments() {
  const db = wx.cloud.database();
  return getMyOpenid().then(openid => {
    if (!openid) return [];
    return db.collection('commentMarks').where({ kind: 'fav', _openid: openid }).get()
      .then(res => {
        const ids = res.data.map(m => m.commentId); // 我收藏的评论id列表
        if (ids.length === 0) return [];
        return getAllComments().then(all => all.filter(e => ids.includes(e._id)));
      });
  });
}

// 我点赞过的评论列表（通过点赞记录反查评论，用于”我的喜欢”）
function getMyLikedComments() {
  const db = wx.cloud.database();
  return getMyOpenid().then(openid => {
    if (!openid) return [];
    return db.collection('commentMarks').where({ kind: 'like', _openid: openid }).get()
      .then(res => {
        const ids = res.data.map(m => m.commentId); // 我点赞的评论id列表
        if (ids.length === 0) return [];
        return getAllComments().then(all => all.filter(e => ids.includes(e._id)));
      });
  });
}

// ====================== 评论回复 ======================
// 某条评论的回复列表（按时间倒序）
function getCommentReplies(commentId) {
  const db = wx.cloud.database();
  return db.collection('commentReplies').where({ commentId }).get()
    .then(res => res.data.sort((a, b) => b.time.localeCompare(a.time)));
}

// 全部回复记录（分页拉取，用于评论列表统计回复数）
function getAllReplies() {
  const db = wx.cloud.database();
  const PAGE_SIZE = 20;
  let all = [];
  const fetchPage = skip => db.collection('commentReplies').skip(skip).limit(PAGE_SIZE).get()
    .then(res => {
      all = all.concat(res.data);
      if (res.data.length === PAGE_SIZE) return fetchPage(skip + PAGE_SIZE);
      return all;
    });
  return fetchPage(0);
}

// 发表一条回复（发布者_openid由云开发自动记录）
function addReply({ commentId, content, time }) {
  const db = wx.cloud.database();
  return db.collection('commentReplies').add({
    data: { commentId, content, time }
  });
}

// ====================== 活动反馈 ======================
// 提交一条活动反馈（发布者_openid由云开发自动记录）
function addFeedback({ content, time }) {
  const db = wx.cloud.database();
  return db.collection('feedbacks').add({
    data: { content, time }
  });
}

// ====================== 用户昵称 ======================
// 默认昵称：书友 + openid尾4位（拿不到openid时只有前缀）
function defaultNickname(openid) {
  return '书友' + (openid ? openid.slice(-4) : '');
}

// 我的用户资料（users集合中查我的记录，没改过名字时返回null）
function getMyUser() {
  const db = wx.cloud.database();
  return getMyOpenid().then(openid => {
    if (!openid) return null; // 拿不到openid时按未设置处理
    return db.collection('users').where({ _openid: openid }).get()
      .then(res => (res.data.length > 0 ? res.data[0] : null))
      .catch(err => {
        console.error('查询我的昵称失败（请确认已创建users集合）', err);
        return null; // 集合未创建时按未设置昵称处理，不影响其他功能
      });
  });
}

// 保存我的昵称（已存在记录则更新，没有则新增一条）
function saveMyNickname(nickname) {
  const db = wx.cloud.database();
  return getMyOpenid().then(openid => {
    if (!openid) return Promise.reject(new Error('获取openid失败'));
    return db.collection('users').where({ _openid: openid }).get().then(res => {
      if (res.data.length > 0) {
        // 已有记录 → 更新昵称
        return db.collection('users').doc(res.data[0]._id).update({ data: { nickname } });
      }
      // 没有记录 → 新增（_openid由云开发自动记录）
      return db.collection('users').add({ data: { nickname } });
    });
  });
}

// 全部用户的昵称映射（openid -> nickname），供作者名显示
function getUserNicknameMap() {
  const db = wx.cloud.database();
  const PAGE_SIZE = 20;
  let all = [];
  const fetchPage = skip => db.collection('users').skip(skip).limit(PAGE_SIZE).get()
    .then(res => {
      all = all.concat(res.data);
      if (res.data.length === PAGE_SIZE) return fetchPage(skip + PAGE_SIZE); // 还有下一页
      const map = {};
      all.forEach(u => { map[u._openid] = u.nickname; });
      return map;
    })
    .catch(err => {
      console.error('拉取用户昵称失败（请确认已创建users集合）', err);
      return {}; // 集合未创建时返回空映射，作者名回退默认名
    });
  return fetchPage(0);
}

module.exports = {
  getMyOpenid,
  getMyReadBooks,
  toggleReadBook,
  getBookReviews,
  getMyReviews,
  getAllReviews,
  addReview,
  getAllComments,
  getComment,
  getCommentsByBook,
  getMyComments,
  addComment,
  toggleLike,
  toggleFav,
  getCommentMarkInfo,
  getAllMarks,
  getMyFavoriteComments,
  getCommentReplies,
  getAllReplies,
  addReply,
  getMyLikedComments,
  addFeedback,
  defaultNickname,
  getMyUser,
  saveMyNickname,
  getUserNicknameMap
}
