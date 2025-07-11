<template>
  <van-icon name="arrow-up" v-show="visible"
    @click="scrollToTop" />
</template>

<script>
export default {
  props: ['className'],
  data() {
    return {
      visible: false, // 控制按钮的显示隐藏
    };
  },
  watch:{
    
  },
  methods: {
    scrollTops() {
      // 当页面滚动超过一定距离时显示按钮
      this.visible = document.querySelector(this.className) && document.querySelector(this.className).scrollTop > 300
    },
    scrollToTop() {
      // 平滑滚动到页面顶部
      if (document.querySelector(this.className).scrollTop !== 0) {
        if (document.querySelector(this.className).scrollTop < 50) {
          document.querySelector(this.className).scrollTop = 0
        } else {
          document.querySelector(this.className).scrollTop -= 400
        }
        setTimeout(() => {
          this.scrollToTop()
        }, 20)
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.scrollTops, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollTops)
  }
};
</script>
<style lang="less" scoped>
.van-icon{
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 999;
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 30px;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 30px;
}
</style>