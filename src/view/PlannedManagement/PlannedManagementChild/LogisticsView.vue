<template>
  <div class="logistics-view">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ detailData.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>需求编号：</span>
            <span>{{ detailData.planNumber }}</span>
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
            <span>{{ detailData.createDate && parseTime(detailData.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-floor-content">
      <div>
        <img src="@/assets/img/Icon-batch.png"/>
        <span>{{ activeKey.text }}</span>
      </div>
      <van-popover v-model="showPopover" trigger="click" v-if="!shipmentBatchNumber">
        <div class="van-popover__action" v-for="item in tabList" :key="item.value" @click="activeKeyChange(item)">
          <div class="van-popover__action-text van-hairline--bottom" :class="{'van-popover__action-text-active': activeKey.value == item.value}" v-if="item.text">{{ item.text }}</div>
        </div>
        <template #reference>
          <span>其他批次</span>
          <img src="@/assets/img/DropArrow.png"/>
        </template>
      </van-popover>
    </div>
    <div class="logistics-information" v-if="tabList.length">
      <!-- <van-sidebar v-model="activeKey" @change="activeKeyChange">
        <van-sidebar-item v-for="item in tabList" :title="item.label" :key="item.value"/>
      </van-sidebar> -->
      <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff" title-inactive-color="#2e2e2e">
        <van-tab title="物流信息" name="0" key="0">
          <logistics-information :detail="detail"></logistics-information>
        </van-tab>
        <van-tab title="发货物资明细" name="1" key="1">
          <delivery-material-details :materialCirculationDetailsTableDTOS="detail.materialCirculationDetailsTableDTOS"></delivery-material-details>
        </van-tab>
      </van-tabs>
    </div>
    <van-empty v-else description="暂无数据" />
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import LogisticsInformation from './components/LogisticsInformation'
import DeliveryMaterialDetails from './components/DeliveryMaterialDetails'
import { materialDemandPlanRestDetail } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { listPc, detailWlgz } from '@/api/prodmgr-inv/materialCirculationTableRest'
export default {
  name: 'LogisticsView',
  components: { LogisticsInformation, DeliveryMaterialDetails, BackToTop },
  data() {
    return {
      activeKey: {},
      menuActiveIndex: '',
      detailData: {},
      tabList: [],
      detail: {},
      showPopover: false,
      shipmentBatchNumber: ''
    }
  },
  created() {
  },
  activated() {
  },
  mounted () {
    const {id = null, shipmentBatchNumber = ''} = this.$route.query
    this.shipmentBatchNumber = shipmentBatchNumber
    this.materialDemandPlanRestDetail(id)
    this.getBatch(id)
  },
  methods: {
    activeKeyChange (action) {
      this.showPopover = false
      if(this.activeKey.value == action.value){
        return
      }
      this.activeKey = action
      this.detailWlgz(action.value)
    },
    materialDemandPlanRestDetail (id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      })
      materialDemandPlanRestDetail(id).then( ({data}) => {
        this.detailData = data
      }).finally(() => {
        toast.clear()
      })
    },
    async getBatch (id) {
      const res = await listPc(id)
      this.tabList = res.data.map((item, i) => ({
        text: `发货批次${i + 1}`,
        value: item.shipmentBatchNumber,
      }))
      if (this.tabList.length) {
        if(this.shipmentBatchNumber){
          this.tabList.forEach((item) => {
            if(item.value === this.shipmentBatchNumber){
              this.activeKey = item
            }
          })
        }else{
          this.activeKey = this.tabList[0]
        }
        this.detailWlgz(this.activeKey.value)
      }
    },
    async detailWlgz (id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      })
      const res = await detailWlgz(id)
      this.detail = res.data
      toast.clear()
    }
  }
}
</script>
<style lang="less" scoped>

// 浮框选中状态
.van-popover__action-text-active::before{
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 1px;
  background: #1d7dff;
  position: absolute;
  left: 5px;
  top: 18px;
}

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
    padding: 10px 6px;
    padding-top: 0px;
    width: 100%;
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
      background: #fff;
      ::v-deep .van-tabs__wrap{
        height: 36px;
      }
      ::v-deep .van-tab{
        background: #f2f2f2;
      }
      ::v-deep .van-tab--active{
        background: #fff;
      }
      ::v-deep .van-tabs__line{
        width: 120px;
      }
    }
  }
  
  .detail-title-text{
    padding: 0 12px;
    p{
      &:nth-child(1){
        font-size: 11px;
        color: #1159cc;
        padding-bottom: 5px;
      }
      &:nth-child(2){
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }
  .detail-ul-text{
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;
    .detail-ul{
      padding: 10px 12px;
    }
  }
  .detail-floor-content{
    justify-content: space-between;
    padding-top: 10px;
    padding-bottom: 10px;
    img{
      vertical-align: middle;
    }
    span{
      vertical-align: middle;
    }
    .van-popover__wrapper{
      span{
        font-weight: 400;
      }
      img{
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>