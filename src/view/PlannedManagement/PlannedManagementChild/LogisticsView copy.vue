<template>
  <div class="logistics-view">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>需求编号：</span>
        <span>{{ detailData.planNumber }}</span>
      </div>
      <ul class="detail-list-ul">
        <li>
          <span>需求名称：</span>
          <span>{{ detailData.planName }}</span>
        </li>
        <li>
          <span>建设项目：</span>
          <span>{{ detailData.projectName }}</span>
        </li> 
        <li>
          <span>标段项目：</span>
          <span>{{ detailData.sectionName }}</span>
        </li>
        <li>
          <span>需求组织：</span>
          <span>{{ detailData.deptName }}</span>
        </li>
        <li>
          <span>提报人：</span>
          <span>{{ detailData.createUserName }}</span>
        </li>
        <li>
          <span>提报时间：</span>
          <span>{{ parseTime(detailData.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </li>
      </ul>
    </div>
    <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>物流信息</span>
    </div>
    <div class="logistics-information" v-if="tabList.length">
      <van-sidebar v-model="activeKey" @change="activeKeyChange">
        <van-sidebar-item v-for="item in tabList" :title="item.label" :key="item.value"/>
      </van-sidebar>
      <van-tabs v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff" title-inactive-color="#2e2e2e">
        <van-tab title="物流信息" name="0" key="0">
          <logistics-information :activeKey="activeKey" :detail="detail"></logistics-information>
        </van-tab>
        <van-tab title="发货物资明细" name="1" key="1">
          <delivery-material-details :materialCirculationDetailsTableDTOS="detail.materialCirculationDetailsTableDTOS"></delivery-material-details>
        </van-tab>
      </van-tabs>
    </div>
    <van-empty image="/empty-image-default.png" v-else description="暂无数据" />
  </div>
</template>
<script>
import LogisticsInformation from './components/LogisticsInformation'
import DeliveryMaterialDetails from './components/DeliveryMaterialDetails'
import { materialDemandPlanRestDetail } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { listPc, detailWlgz } from '@/api/prodmgr-inv/materialCirculationTableRest'
export default {
  name: 'LogisticsView',
  components: { LogisticsInformation, DeliveryMaterialDetails },
  data() {
    return {
      activeKey: 0,
      menuActiveIndex: '',
      detailData: {},
      tabList: [],
      detail: {}
    }
  },
  created() {
  },
  activated() {
  },
  mounted () {
    const {id = null} = this.$route.query
    this.materialDemandPlanRestDetail(id)
    this.getBatch(id)
  },
  methods: {
    activeKeyChange () {
      this.detailWlgz(this.tabList[this.activeKey].value)
    },
    materialDemandPlanRestDetail (id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialDemandPlanRestDetail(id).then( ({data}) => {
        this.detailData = data
      }).finally(() => {
          toast.clear();
      });
    },
    async getBatch (id) {
      const res = await listPc(id)
      this.tabList = res.data.map((item, i) => ({
        label: `发货批次${i + 1}`,
        value: item.shipmentBatchNumber,
      }))
      if (this.tabList.length) {
        this.detailWlgz(this.tabList[0].value)
      }
    },
    async detailWlgz (id) {
      const res = await detailWlgz(id)
      this.detail = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.logistics-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      line-height: 30px;
      padding: 0 10px;
    }
  }

  .logistics-information {
    display: flex;
    padding: 10px 10px;
    padding-top: 0px;
    width: 100%;
    // height: calc(100% - 200px);
    height: 200px;
    box-sizing: border-box;
    flex: 1;

    .van-sidebar {
      display: block;
      width: 106px;
      padding-right: 10px;

      .van-sidebar-item--select::before {
        content: none
      }

      .van-sidebar-item {
        background-color: #fff;
        padding: 5px;
        ::v-deep .van-sidebar-item__text{
          padding: 5px 10px;
          border-radius: 5px;
        }
      }

      .van-sidebar-item--select {
        ::v-deep .van-sidebar-item__text {
          background: #e5f1ff !important;
          color: #46a8ff;
        }
      }
    }


    .van-tabs {
      flex: 1;
      background: #fff;

      ::v-deep .van-tab {
        flex: none !important;
        padding: 0 10px;
      }
    }
    ::v-deep .van-tabs__content {
      height: calc(100% - 54px);
      overflow-y: auto;
    }
  }
}
</style>