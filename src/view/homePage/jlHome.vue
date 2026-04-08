<!-- 监理首页 -->
<template>
  <div class="my-to-do-list">
    <van-pull-refresh v-model="refreshLoading" @refresh="refreshCheck" success-text="刷新成功">
      <div>
        <VideoArea ref="VideoArea"></VideoArea>
      </div>

      <div>
        <CheckModule ref="checkModule" @refreshL="handleLoading"></CheckModule>
      </div>

      <div style="margin: 10px 0;" @click="handleRouter('/selfContractSelect')">
        <div class="demandInfo">
          自购物资合同
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import VideoArea from './components/VideoArea.vue';
import CheckModule from './components/checkModule.vue';
export default {
  name: 'constructionUnitsPage',
  components: {
    VideoArea,
    CheckModule
  },

  data() {
    return {
      refreshLoading: false
    };
  },

  methods: {
    handleRouter(path) {
      this.$router.push({ path: path })
    },
    handleLoading(val) {
      this.refreshLoading = val;
    },
    refreshCheck() {
      this.refreshLoading = true
      this.$refs.checkModule?.handlerTodoCount()
    },
  },
};
</script>

<style lang="less" scoped>
.my-to-do-list {
  height: 100%;
  overflow-y: auto;
  background-color: #2E5EAD;
}

::v-deep .van-pull-refresh__head {
  color: #fff;
}

::v-deep .van-loading__text {
  color: #fff;
}

.demandInfo {
  width: 94%;
  height: 80px;
  margin: 0 auto;
  border-radius: 8px;
  line-height: 80px;
  padding-left: 30px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(to right, white 0%, #BEDBF4 100%), url('../../assets/img/demand.png') no-repeat right top / 200px 80px;
  box-sizing: border-box;
  background-blend-mode: multiply;
  position: relative;
}
</style>
