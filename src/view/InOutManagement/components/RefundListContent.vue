<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" background="#eef6ff" readonly
          @click="handeSearchClick()">
        </van-search>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." @load="getAllList">
        <div v-for="(item, index) in 10" :key="index" class="box-container" @click="handleWaitItemClick(item)">
          <ul class="list-ul">
            <li>
              <span>退货单号：</span>
              <span>TH20250531004</span>
            </li>
            <li>
              <span>收货单号：</span>
              <span @click.stop="detailsClick" class="li-span-click">SH20250531004</span>
            </li>
            <li>
              <span class="li-item-span-auto">供应需求名称：</span>
              <span>南京枢纽（江北地区）和南通地区工程2025年5月甲供物资需求计划表</span>
            </li>
            <li class="li-item-both">
              <div class="li-item-left">
                <span>需求组织：</span>
                <span>施工单位名称</span>
              </div>
              <div class="li-item-right">
                <span class="li-item-span-auto">供应商：</span>
                <span>供应商供应商</span>
              </div>
            </li>
            <li>
              <span>退货时间：</span>
              <span>2025-05-21</span>
            </li>
            <li>
              <span>操作人：</span>
              <span>name</span>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  name: 'RefundListContent',
  data() {
    return {
      activeIndex: 0,
      formData: {
        keywords: ''
      },
      value1: 0,
      allRefreshLoading: false,
      allLoading: false,
      allFinished: false,
    };
  },
  created() {
  },
  activated() {
  },
  methods: {
    //全部列表刷新
    allRefresh() {
      this.allRefreshLoading = true
      this.allLoading = true
      this.allFinished = false
      this.getAllList()
    },
    getAllList() {
      this.allRefreshLoading = false
      this.allFinished = true
    },
    handleWaitItemClick (item) {
      // this.$router.push({ name: 'SubmitStore', query: {type: 'view'} })
      this.$router.push({name: 'DoReturn'})
    },
    detailsClick () {
      this.$router.push({ name: 'DoAcceptDetail' })
    }
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {

  ::v-deep .van-sticky--fixed{
    top: 44px !important;
  }
  
  .list-search-container {
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    background: #eef6ff;

    .van-search {
      flex: 1;
    }

    ::v-deep .van-dropdown-menu__bar {
      border-radius: 50px;
      width: 90px;
      height: 32px;
      margin-top: 10px;
      margin-right: 15px;
      font-size: 12px;
      box-shadow: inherit;

      .van-dropdown-menu__title {
        font-size: 12px;
      }

    }
  }

  .van-search {

    .van-search__content {
      border-radius: 50px;
      background: #fff;
    }

    .van-cell {
      border-radius: 50px;
      background: #fff;
    }
  }
  .list-ul{
    li{
      span{
        width: auto !important;
        min-width: auto !important;
        &:nth-child(2){
          width: auto !important;
          flex: 1;
        }
      }
    }
  } 
  .li-item-span-auto{
    width: auto !important;
    min-width: auto !important;
  }
}
</style>