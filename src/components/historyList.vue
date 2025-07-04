<template>
  <van-popup v-model="historyShow" position="bottom">
    <div class="detail-container">
      <div class="box-container">
        <div class="detail-title-info">
          <span class="info-title">历史地址</span>
        </div>
        <van-field v-model="field" :label="label" :placeholder="`请输入${label}`" :label-width="240" input-align="right" />
        <div v-for="(item, index) in historyList" :key="index" class="item-container" @click="historyClick(item)">
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default {
  props: [ 'label' ],
  data() {
    return {
      field: '',
      historyShow: false,
      loading: false,
      finished: true,
      historyList: ['北京', '海淀'],
    }
  },
  methods: {
    init () {
      this.historyList = this.$store.state.public.historyList || []
      this.historyShow = true
    },
    historyClick(item) {
      this.$emit('historyClick', item)
      this.historyShow = false
    }
  },
}
</script>
<style lang="less" scoped>
.item-container {
  width: 100%;
  height: 58px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  position: relative;
  background: #ffffff;

  span {
    font-size: 14px;
    color: #2e2e2e;
    margin-left: 10px;
  }
}
</style>