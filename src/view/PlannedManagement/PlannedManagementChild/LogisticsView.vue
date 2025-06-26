<template>
  <div class="logistics-view">
    <div class="box-container" style="margin-top: 20px;">
      <div>
        <ul class="detail-ul">
          <li>
            <span>需求编号：</span>
            <span>{{ detailData.planNumber }}</span>
          </li>
          <li>
            <span>需求名称：</span>
            <span>{{ detailData.planName }}</span>
          </li>
          <li>
            <span>需求项目：</span>
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
            <span>{{ parseTime(detailData.createDate, '{y}-{m}-{d} {h}:{s}') }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="select-materials-search">
      <p class="select-materials-search-p font-weight">物流信息</p>
    </div>
    <div class="logistics-information">
      <van-sidebar v-model="activeKey" @change="activeKeyChange">
        <van-sidebar-item title="发货批次一" />
        <van-sidebar-item title="发货批次二" />
        <van-sidebar-item title="发货批次三" />
        <van-sidebar-item title="发货批次四" />
        <van-sidebar-item title="发货批次五" />
      </van-sidebar>
      <van-tabs v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff" title-inactive-color="#2e2e2e">
        <van-tab title="物流信息" name="0" key="0">
          <logistics-information :activeKey="activeKey"></logistics-information>
        </van-tab>
        <van-tab title="发货物资明细" name="1" key="1">
          <delivery-material-details></delivery-material-details>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import LogisticsInformation from './components/LogisticsInformation'
import DeliveryMaterialDetails from './components/DeliveryMaterialDetails'
import { materialDemandPlanRestDetail } from '@/api/prodmgr-inv/materialDemandPlanRest'
export default {
  name: 'LogisticsView',
  components: { LogisticsInformation, DeliveryMaterialDetails },
  data() {
    return {
      activeKey: 0,
      menuActiveIndex: '',
      detailData: {}
    }
  },
  created() {
  },
  activated() {
  },
  mounted () {
    const {id = null} = this.$route.query
    this.materialDemandPlanRestDetail(id)
  },
  methods: {
    activeKeyChange () {
      console.log(this.activeKey)
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
    height: calc(100% - 200px);
    box-sizing: border-box;
    flex: 1;

    .van-sidebar {
      display: block;
      width: 100px;
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