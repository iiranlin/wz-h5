<!-- 施工单位首页 -->
<template>
  <div class="my-to-do-list">
    <van-pull-refresh v-model="refreshLoading" @refresh="refreshCheck" success-text="刷新成功">
      <div>
        <VideoArea></VideoArea>
      </div>

      <div>
        <CheckModule ref="checkModule" @refreshL="handleLoading"></CheckModule>
      </div>

      <div style="margin: 10px 0;" @click="handleRouter('/PlannedManagementList')">
        <div class="demandInfo">
          计划管理
        </div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="lastModule">
          <div class="twoLines" @click="handleRouterAndTab('/AcceptanceReturn', 0)">
            <img :src="Receiving">
            收货管理
          </div>
          <div class="twoLines" style="margin-left: 10px;" @click="handleRouterAndTab('/AcceptanceReturn', 1)">
            <img :src="returns">
            退货管理
          </div>
        </div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="lastModule">
          <div class="twoLines" @click="handleRouterAndTab('/InOutManagementList', 0)">
            <img :src="warehousing">
            入库单
          </div>
          <div class="twoLines" style="margin-left: 10px;" @click="handleRouterAndTab('/InOutManagementList', 1)">
            <img :src="DemandInventory">
            需求库存
          </div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="lastModule">
          <div class="twoLines" @click="handleRouterAndTab('/InOutManagementList', 2)">
            <img :src="CreditOrder">
            退货单
          </div>
          <div class="twoLines" style="margin-left: 10px;" @click="handleRouterAndTab('/InOutManagementList', 3)">
            <img :src="StockOut">
            出库单
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
const Receiving = require('@/assets/img/Receiving.png');
const returns = require('@/assets/img/returns.png');
const warehousing = require('@/assets/img/warehousing.png');
const DemandInventory = require('@/assets/img/DemandInventory.png');
const CreditOrder = require('@/assets/img/CreditOrder.png');
const StockOut = require('@/assets/img/StockOut.png');

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
      refreshLoading: false,
      Receiving,
      returns,
      warehousing,
      DemandInventory,
      CreditOrder,
      StockOut
    };
  },

  mounted() {

  },

  methods: {
    handleRouterAndTab(path, tabIndex) {
      this.$router.push({ path: path, query: { tabIndex } })
    },
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
  height: 100px;
  margin: 0 auto;
  border-radius: 8px;
  line-height: 90px;
  padding-left: 30px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(to right, white 0%, #BEDBF4 100%), url('../../assets/img/demand.png') no-repeat right top / 200px 100px;
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
  height: 100px;
  margin: 0 auto;
  border-radius: 8px;
  line-height: 90px;
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