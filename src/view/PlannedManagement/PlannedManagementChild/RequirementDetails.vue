<template>
  <van-tabs v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff" title-inactive-color="#2e2e2e">
    <van-tab title="物资明细">
      <material-details></material-details>
    </van-tab>
    <van-tab title="日志记录">
      <log-recording></log-recording>
    </van-tab>
  </van-tabs>
</template>
<script>
import MaterialDetails from './components/MaterialDetails'
import LogRecording from './components/LogRecording'
export default {
  name: 'RequirementDetails',
  components: { MaterialDetails, LogRecording },
  data() {
    return {
      menuActiveIndex: ''
    }
  },
  created() {
  },
  activated() {
  },
  mounted () {
  },
  methods: {
  },
}
</script>
<style lang="less" scoped>
::v-deep .van-tabs__wrap {
  position: fixed;
  z-index: 1;
  width: 100%;
}

::v-deep .van-tabs__content {
  padding-top: 50px;
}

.detail-ul {
  li {
    span {
      &:nth-child(1) {
        width: 80px;
      }
    }
  }
}

.li-item-both {
  justify-content: space-between;
}

.li-item-left {
  width: auto !important;
}

.li-item-left-num {
  span:nth-child(1) {
    min-width: 100px;
  }
}

.li-item-right {
  width: auto !important;

  span:nth-child(1) {
    width: auto;
    text-align: right;
  }

  span:nth-child(2) {
    width: auto;
  }
}
</style>