<template>
  <div class="in-out-management">
    <div class="tabs">
      <van-tabs v-model="activeIndex"  @change="changeTab" color="#0571ff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e" class="in-out-management-tab">
        <van-tab title="入库列表">
          <div slot="title">
            <img src="@/assets/img/RKLB.png">
            <span class="in-out-management-tab-span">入库单</span>
          </div>
          <in-list-content ref="InListContent"></in-list-content>
        </van-tab>
        <van-tab title="需求库存">
          <div slot="title">
            <img src="@/assets/img/KCLB.png">
            <span class="in-out-management-tab-span">需求库存</span>
          </div>
          <inventory-list-content ref="InventoryListContent"></inventory-list-content>
        </van-tab>
        <van-tab title="退货列表">
          <div slot="title">
            <img src="@/assets/img/THLB.png">
            <span class="in-out-management-tab-span">退货单</span>
          </div>
          <refund-list-content ref="RefundListContent"></refund-list-content>
        </van-tab>
        <van-tab title="出库列表">
          <div slot="title">
            <img src="@/assets/img/CKLB.png">
            <span class="in-out-management-tab-span">出库单</span>
          </div>
          <out-list-content ref="OutListContent"></out-list-content>
        </van-tab>
      </van-tabs>
    </div>
    <back-to-top :className="className"></back-to-top>
  </div>
</template>
<script>
import InListContent from './components/InListContent'
import InventoryListContent from './components/InventoryListContent'
import RefundListContent from './components/RefundListContent'
import OutListContent from './components/OutListContent'
import BackToTop from '@/components/BackToTop'
export default {
  name: 'InOutManagementList',
  components: { InListContent, InventoryListContent, RefundListContent, OutListContent, BackToTop },
  beforeRouteLeave (to, from, next) {
    from.meta.activeIndex = this.activeIndex
    from.meta.storeStatus = this.$refs.InListContent?.formData.storeStatus
    from.meta.inventoryStatus = this.$refs.InventoryListContent?.formData.status
    this.$store.dispatch('public/setScrollPosition', {[from.name]: document.querySelector(this.className).scrollTop})
    next();
  },

  data() {
    return {
      className: '.in-out-management',
      activeIndex: 0,
    };
  },
  created() {
    if(this.$route.meta.activeIndex){
      this.activeIndex = this.$route.meta.activeIndex
    }

    if(this.$route.query?.tabIndex) {
        this.changeTab(+this.$route.query?.tabIndex)
      }
  },
  methods: {
    changeTab(index) {
      this.activeIndex = index
    }
  },
};
</script>
<style lang="less" scoped>
.in-out-management {
  height: 100%;
  overflow-y: auto;
  .in-out-management-tab{
    ::v-deep .van-tabs__wrap{
      margin-bottom: 0px;
      height: 70px;
    }
    .in-out-management-tab-span{
      padding: 5px 0;
    }
    // padding-top: 5px;
    // line-height: 28px;
  }
  .van-tab__text{
    div{
      display: flex;
      flex-direction: column;
      align-items: center;
      img{
        width: 24px;
        height: 24px;
        margin-top: 8px;
      }
    }
  }
}
</style>