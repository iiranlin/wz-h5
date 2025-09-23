<!-- 施工单位首页 -->
<template>
  <div class="my-to-do-list">
    <van-pull-refresh v-model="refreshLoading" @refresh="refreshCheck" success-text="刷新成功">
      <div>
        <VideoArea ref="VideoArea"></VideoArea>
      </div>

      <div>
        <CheckModule ref="checkModule" @refreshL="handleLoading"></CheckModule>
      </div>

      <div style="margin: 10px 0;" @click="handleRouter('/PlannedManagementList')">
        <div class="demandInfo">
          计划管理
          <van-icon name="plus" @click.stop="addClick()" />
        </div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="lastModule">
          <div class="twoLines" @click="handleRouter('/Acceptance')">
            <img :src="Receiving">
            收货管理
          </div>
          <div class="twoLines" style="margin-left: 10px;" @click="handleRouter('/Return')">
            <img :src="returns">
            初验退货
          </div>
        </div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="lastModule">
          <div class="twoLines" @click="handleRouter('/InListContent')">
            <img :src="warehousing">
            入库单
          </div>
          <div class="twoLines" style="margin-left: 10px;" @click="handleRouter('/InventoryListContent')">
            <img :src="DemandInventory">
            需求库存
          </div>
        </div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="lastModule">
          <div class="twoLines" @click="handleRouter('/RefundListContent')">
            <img :src="CreditOrder">
            质检退货
          </div>
          <div class="twoLines" style="margin-left: 10px;" @click="handleRouter('/OutListContent')">
            <img :src="StockOut">
            出库单
          </div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="selfBuying">
          <div class="selfTitle">
            自购物资核备
          </div>
          <van-cell title="采购文件核备" is-link @click="handleRouter('/purchaseFile')">
            <template #icon>
              <img :src="BuyerFile">
            </template>
          </van-cell>
          <van-cell title="采购合同核备" is-link @click="handleRouter('/purchaseContract')">
            <template #icon>
              <img :src="BuyerPact">
            </template>
          </van-cell>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import keepPages from '@/view/mixins/keepPages'

const Receiving = require('@/assets/img/Receiving.png');
const returns = require('@/assets/img/returns.png');
const warehousing = require('@/assets/img/warehousing.png');
const DemandInventory = require('@/assets/img/DemandInventory.png');
const CreditOrder = require('@/assets/img/CreditOrder.png');
const StockOut = require('@/assets/img/StockOut.png');
const BuyerFile = require('@/assets/img/BuyerFile.png');
const BuyerPact = require('@/assets/img/BuyerPact.png');

import VideoArea from './components/VideoArea.vue';
import CheckModule from './components/checkModule.vue';
export default {
  name: 'constructionUnitsPage',
  mixins: [keepPages],

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
      StockOut,
      BuyerFile,
      BuyerPact
    };
  },

  activated() {
    this.$nextTick(() => {
      this.$refs.VideoArea?.$refs.videos?.play();
      this.$refs.checkModule?.handlerTodoCount();
    })
  },

  mounted() {

  },

  methods: {
    addClick() {
      this.$store.dispatch('public/setMateriaList', [])
      this.$store.dispatch('public/setInterfaceMateriaList', [])
      this.$store.dispatch('public/setDemandPlanningInfo', {})

      this.$router.push({ name: 'SelectContract' })
    },
    handleRouterAndTab(path, tabIndex, flag) {
      this.$router.push({ path: path, query: { tabIndex, flag } })
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

.selfTitle {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.selfBuying {
  width: 94%;
  // height: 80px;
  margin: 0 auto;
  border-radius: 8px;
  // line-height: 80px;
  font-size: 18px;
  background-color: #fff;
  box-sizing: border-box;
  background-blend-mode: multiply;
  position: relative;

  img {
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }

  ::v-deep .van-cell {
    padding: 0.1rem 0.4rem 0.1rem 0.25rem;
    border-radius: 8px;
  }

  ::v-deep .van-cell__title {
    display: flex;
    align-items: center;
  }

  ::v-deep .van-cell__right-icon {
    line-height: 0.9rem;
  }
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

.van-icon-plus {
  position: absolute;
  right: 10px;
  bottom: 30%;
  z-index: 999;
  width: 30px;
  height: 30px;
  background: #1989fa;
  border-radius: 30px;
  border: 1px solid #1989fa;
  text-align: center;
  line-height: 30px;
  color: #fff;
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