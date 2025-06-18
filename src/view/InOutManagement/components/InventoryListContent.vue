<template>

  <div class="in-out-management-list">
    <div class="list-search-container">
      <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" background="#eef6ff" readonly
        @click="handeSearchClick()">
      </van-search>
      <van-dropdown-menu active-color="#028bff">
        <van-dropdown-item v-model="value1" :options="option1" />
      </van-dropdown-menu>
    </div>
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." @load="getAllList">
        <div v-for="(item, index) in 10" :key="index" class="box-container">
          <ul class="list-ul">
            <li>
              <span>当前库存：</span>
              <span>{{ [0, 1].includes(value1)?'有':'无' }}</span>
            </li>
            <li>
              <span>需求编号：</span>
              <span class="li-span-click">XQ20250500001</span>
            </li>
            <li>
              <span>需求名称：</span>
              <span>需求名称需求名称需求名称需求名称需求名称需求名称</span>
            </li>
            <li>
              <span>物资名称：</span>
              <span>物资名称物资名称物资名称物资名称物资名称物资名称</span>
            </li>
            <li>
              <span>供应商：</span>
              <span>供应商名称供应商名称供应商名称供应商名称供应商名称供应商名</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>施工单位名称（分部）</span>
            </li>
            <li class="li-item-both">
              <div class="li-item-left">
                <span>提报人：</span>
                <span>name</span>
              </div>
              <div class="li-item-right">
                <span>提报时间：</span>
                <span>2025-04-20</span>
              </div>
            </li>
            <li class="li-status" v-if="value1 == 0">
              <template v-for="items in option1">
                <van-tag plain round size="medium" :key="items.value" v-if="items.value != 0 && item == items.value">{{ items.text }}</van-tag>
              </template>
            </li>
          </ul>
          <div class="list-ul-button">
            <van-button class="button-info" plain round type="info" @click="detailsClick">库存详情</van-button>
            <van-button class="button-info" round type="info" @click="outboundClick">出库</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  name: 'InventoryListContent',
  data() {
    return {
      activeIndex: 0,
      formData: {
        keywords: ''
      },
      value1: 0,
      option1: [
        { text: '全部', value: 0 },
        { text: '未完成', value: 1 },
        { text: '已完成', value: 2 },
      ],
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
    outboundClick () {
      this.$router.push({ name: 'Outbound', query: {type: 'submit'} })
    },
    detailsClick () {
      this.$router.push({ name: 'InventoryDetails' })
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


  ::v-deep .van-pull-refresh {
    height: calc(100vh - 150px);
    overflow-y: scroll;
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
}
</style>