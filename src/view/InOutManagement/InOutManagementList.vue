<template>
  <div class="in-out-management">
    <div class="tabs">
      <van-tabs sticky v-model="activeIndex" color="#0571ff" background="#eef6ff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e" class="in-out-management-tab">
        <van-tab title="入库列表">
          <div slot="title">
            <img src="@/assets/img/入库列表.png">
            <span class="in-out-management-tab-span">入库列表</span>
          </div>
          <in-list-content></in-list-content>
        </van-tab>
        <van-tab title="需求库存">
          <div slot="title">
            <img src="@/assets/img/库存列表.png">
            <span class="in-out-management-tab-span">需求库存</span>
          </div>
          <inventory-list-content></inventory-list-content>
        </van-tab>
        <van-tab title="退货列表">
          <div slot="title">
            <img src="@/assets/img/退货列表.png">
            <span class="in-out-management-tab-span">退货列表</span>
          </div>
          <refund-list-content></refund-list-content>
        </van-tab>
        <van-tab title="出库列表">
          <div slot="title">
            <img src="@/assets/img/出库列表.png">
            <span class="in-out-management-tab-span">出库列表</span>
          </div>
          <out-list-content></out-list-content>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import InListContent from './components/InListContent'
import InventoryListContent from './components/InventoryListContent'
import RefundListContent from './components/RefundListContent'
import OutListContent from './components/OutListContent'
export default {
  name: 'InOutManagementList',
  components: { InListContent, InventoryListContent, RefundListContent, OutListContent },

  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    from.meta.inOutNavIndex = this.activeIndex;
    next();
  },

  data() {
    return {
      activeIndex: 0,
    };
  },
  created() {
    if(this.$route.meta.inOutNavIndex){
      this.activeIndex = this.$route.meta.inOutNavIndex;
    }
  },
  activated() {
  },
  methods: {
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
      align-items: anchor-center;
      img{
        width: 24px;
        height: 24px;
        margin-top: 8px;
      }
    }
  }
}
</style>