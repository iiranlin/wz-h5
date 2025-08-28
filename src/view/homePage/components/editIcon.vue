<template>
  <van-icon class="editIcon" name="setting-o" v-show="visible"
    @click="handlerFontSize" />
</template>

<script>
export default {

  computed: {
    // 判断是否在编辑字体页面,不在则显示
    visible() {
      return this.$route.path != '/editFontSize'
    }
  },

  data() {
    return {
      
    };
  },
  methods: {
    handlerFontSize() {
      this.$router.push({ path: '/editFontSize' })
    }
  },
  mounted() {
    
  },
};
</script>
<style lang="less" scoped>
.editIcon{
  position: fixed;
  right: 20px;
  bottom: 200px;
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