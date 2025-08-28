<template>
  <div class="editFontSize">
    <div class="center">
      <div class="content">
        <p>
          点击按钮切换文字大小
        </p>
        <p>
          设置后，会改变全局页面的字体大小。
        </p>
      </div>
    </div>

    <div class="footer-spacer">
      <div class="btn-group">
        <!-- <van-button type="info" round @click="handleSize(32)">小号</van-button> -->
        <van-button type="info" :plain="handleButtonStyle(42)" round @click="handleSize(42)">标准</van-button>
        <van-button type="info" :plain="handleButtonStyle(52)" round @click="handleSize(52)">大号</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {

    };
  },
  methods: {
    // 判断按钮样式
    handleButtonStyle(size) {
      return size != this.$store.state.public.fontSizeSum;
    },
    handleSize(size) {
      // 存到缓存里
      this.$store.dispatch('public/SetFontSizeSum', size)
    }
  }
};
</script>
<style lang="less" scoped>
.editFontSize {
  height: 100%;
  display: flex;
  flex-direction: column;
  // background: #e3f2fd;
}

.center {
  flex: 1;
  /* 撑满剩余空间 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;

  p:nth-child(1) {
    font-size: 25px;
    text-align: center;
    font-weight: 600;
  }

  p:nth-child(2) {
    font-size: 18px;
  }
}

.footer-spacer {
  padding-bottom: 30px;
  /* 距离底部的空隙，可任意调 */
  background: transparent;
  /* 无背景，仅作垫高 */
}

.bottom {
  // background: #1976d2;
  color: white;
  padding: 16px 0;
  /* 上下留空 */
  text-align: center;
}

/* 按钮横向排列 + 美化 */
.btn-group {
  display: flex;
  justify-content: center;
  gap: 72px;
  /* 按钮间距 */
}

.btn-group button {
  padding: 8px 20px;
  // border: none;
  // border-radius: 4px;
  // background: #fff;
  // color: #1976d2;
  // font-size: 14px;
  // cursor: pointer;
  // transition: background .2s;
}
</style>