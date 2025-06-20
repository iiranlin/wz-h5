<template>
  <div class="in-out-management-list">
    <van-sticky :offset-top="112">
      <div class="list-search-container">
        <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" background="#eef6ff" readonly
          @click="handeSearchClick()">
        </van-search>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." @load="getAllList">
        <div v-for="(item, index) in 10" :key="index" class="box-container" @click="outClick">
          <ul class="list-ul">
            <li>
              <span>出库单号：</span>
              <span>CK20250531004</span>
            </li>
            <li>
              <span>需求编号：</span>
              <span>XQ20250531004</span>
            </li>
            <li>
              <span>需求名称：</span>
              <span>南京枢纽（江北地区）和南通地区工程2025年5月甲供物资需求计划表</span>
            </li>
            <li>
              <span>领用单位：</span>
              <span>领用单位领用单位领用单位领用单位领用单位</span>
            </li>
            <li class="li-item-both">
              <div class="li-item-left">
                <span>发料人：</span>
                <span>name</span>
              </div>
              <div class="li-item-right">
                <span class="li-item-span-auto">领料人：</span>
                <span>name</span>
              </div>
            </li>
            <li>
              <span>领用日期：</span>
              <span>2025-06-04</span>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  name: 'OutListContent',
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
    outClick () {
      this.$router.push({ name: 'OutboundDetails' })
    }
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {

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