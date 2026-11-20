好，就用刚做的 fun 页海报轮播当例子，把整个"滑动"拆开讲。它其实由三个文件配合完成：WXML（结构）、JS（数据）、WXSS（样式）。

---

**一、WXML：搭骨架**

```xml
<swiper class="quiz-swiper" circular previous-margin="70rpx" next-margin="70rpx" bindchange="onSwiperChange">
  <swiper-item wx:for="{{quizzes}}" wx:key="id">
    <view class="quiz-poster {{index === currentIndex ? 'quiz-poster-active' : ''}}" style="background: {{item.color}}" bindtap="comingSoon">
      ...海报内容...
    </view>
  </swiper-item>
</swiper>
```

- **`<swiper>`** 是小程序自带的轮播容器，**`<swiper-item>`** 是它里面的每一页。一页就相当于一张"幻灯片"，滑动是 swiper 自带的能力，不用自己写手势。
- **`wx:for="{{quizzes}}"`**：数据里有 3 个测试对象，循环生成 3 个 `swiper-item`。以后加第 4 张海报，只要往 `quizzes` 数组里加一个对象，这里自动多一页，不用动 WXML。
- **`circular`**：循环滑动——滑到第 3 张再往左滑，直接回到第 1 张（首尾相连），不会卡住。
- **`previous-margin` / `next-margin`**：让左右两侧露出 70rpx 的边，这样旁边海报露个角，用户知道"还有东西可以滑"。
- **`bindchange="onSwiperChange"`**：每次滑动停下时触发 JS 里的这个函数，告诉我们"现在停在第几张"。
- 中间那行 class 是"中间大两侧小"的关键，下面讲。

---

**二、JS：数据 + 响应滑动**

```js
data: {
  quizzes: [
    { id: 1, name: '阅读水平测试', emoji: '📚', color: '#B8860B', science: '★★★★★', entertainment: '★★☆☆☆' },
    { id: 2, ... },
    { id: 3, ... }
  ],
  currentIndex: 0 // 当前居中的海报下标
},

onSwiperChange(e) {
  this.setData({ currentIndex: e.detail.current });
},
```

- **`quizzes`**：3 张海报的全部内容（名字、图标、颜色、评分）。WXML 里的 `{{item.name}}`、`{{item.color}}` 就是从这取值的。
- **`currentIndex`**：记录"现在第几张"（0、1、2）。
- **`onSwiperChange(e)`**：滑动停住后，`e.detail.current` 就是新的页码，存进 `currentIndex`。这就是"中间大两侧小"的依据——哪个 `index` 等于 `currentIndex`，哪张就是当前的。

---

**三、WXSS：中间大、两侧小的视觉**

```css
.quiz-poster {            /* 默认：所有海报都是"两侧"的样子 */
  transform: scale(0.9);  /* 缩小到 90% */
  opacity: 0.55;          /* 半透明，退到后面去 */
  transition: transform 0.3s, opacity 0.3s;  /* 变化过程 0.3 秒渐变，不生硬 */
}

.quiz-poster-active {     /* 当前这张：额外叠加这套样式 */
  transform: scale(1);    /* 变回 100% */
  opacity: 1;             /* 恢复全彩 */
}
```

原理一句话：**所有海报默认是"缩小+半透明"，只有当前那张（WXML 里 index === currentIndex 的那张）加上 `quiz-poster-active`，变回"大+全彩"**。加上 `transition` 后，从缩小到放大是平滑的 0.3 秒动画，滑动时看起来就是"中间大、两边小"的封面效果。

---

**小结：想改效果改哪里**

- 想加海报 → `fun.js` 的 `quizzes` 数组加一个对象
- 想改露出的宽度 → WXML 里 `previous-margin` / `next-margin` 的 `70rpx`
- 想调两侧缩小的程度 → WXSS 里 `scale(0.9)` 和 `opacity(0.55)`
- 想改滑动动画快慢 → WXSS 里 `transition` 的 `0.3s`

这个模式（swiper + 数据数组 + currentIndex 做样式切换）是所有轮播页面的通用写法，以后做别的地方（比如书单轮播）直接照着套就行。
