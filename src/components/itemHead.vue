<template>
  <div class="default-container" :style="containerStyle">
    <keep-alive :include="keepPages">
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    key() {
      return this.$route.path
    },
    keepPages() {
      return this.$store.getters.getKeepPages;
    },
    containerStyle() {
      // 如果是 finishGoods 路由，返回特定样式，否则默认
      return this.$route.name === 'finishGoods' 
        ? { height: 'calc(100vh - 1.44rem)' } 
        : {}; // 默认无额外样式
    },
  },
};
</script>