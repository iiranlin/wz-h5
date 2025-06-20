<template>
  <div class="in-out-management">
    <div class="tabs">
      <van-tabs sticky v-model="activeIndex" color="#0571ff" background="#eef6ff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e">
        <van-tab title="入库列表">
          <in-list-content></in-list-content>
        </van-tab>
        <van-tab title="库存列表">
          <inventory-list-content></inventory-list-content>
        </van-tab>
        <van-tab title="退货列表">
          <refund-list-content></refund-list-content>
        </van-tab>
        <van-tab title="出库列表">
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
  data() {
    return {
      activeIndex: 0,
    };
  },
  created() {
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

  ::v-deep .van-tabs__wrap {
    margin-bottom: 0;
  }
}
</style>