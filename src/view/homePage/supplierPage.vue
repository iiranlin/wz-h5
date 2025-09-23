<!-- 供应商首页 -->
<template>
  <div class="my-to-do-list">
    <van-pull-refresh v-model="refreshLoading" @refresh="refreshCheck" success-text="刷新成功">
      <div>
        <VideoArea ref="VideoArea"></VideoArea>
      </div>

      <div>
        <CheckModule ref="checkModule" @refreshL="handleLoading"></CheckModule>
      </div>

      <div style="margin: 10px 0;" @click="handleRouter('/dashboard')">
        <div class="demandInfo">
          需求管理
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="lastModule">
          <div class="twoLines" @click="handleRouter('/Information')">
            <img :src="shipments">
            发货管理
          </div>
          <div class="twoLines" style="margin-left: 10px;" @click="handleRouter('/MyManager')">
            <img :src="returns">
            退货管理
          </div>
        </div>

      </div>
    </van-pull-refresh>


  </div>
</template>

<script>
import keepPages from '@/view/mixins/keepPages'

const shipments = require('@/assets/img/shipments.png');
const returns = require('@/assets/img/returns.png');

import VideoArea from './components/VideoArea.vue';
import CheckModule from './components/checkModule.vue';
export default {
  name: 'SupplierPage',
  mixins: [keepPages],

  components: {
    VideoArea,
    CheckModule
  },
  
  activated() {
    this.$nextTick(() => {
      this.$refs.VideoArea?.$refs.videos?.play();
      this.$refs.checkModule?.handlerTodoCount();
    })
  },

  data() {
    return {
      refreshLoading: false,
      shipments,
      returns
    };
  },

  mounted() {

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
}

.lastModule {
  display: flex;
  width: 94%;
  margin: 0 auto;
  justify-content: space-between;
}

.twoLines {
  width: 50%;
  height: 70px;
  margin: 0 auto;
  border-radius: 8px;
  line-height: 70px;
  text-align: center;
  font-size: 16px;
  background-color: #fff;

  img {
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }
}
</style>