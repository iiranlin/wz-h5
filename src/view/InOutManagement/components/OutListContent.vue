<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" background="#eef6ff"
          @search="handeSearch()">
        </van-search>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." @load="getAllList">
        <div v-for="(item, index) in dataList" :key="index" class="box-container" @click="outClick(item)">
          <ul class="list-ul">
            <li>
              <span class="font-weight">出库单号：</span>
              <span class="font-weight">{{item.outNumber}}</span>
            </li>
            <li>
              <span>需求编号：</span>
              <span>{{item.planNumber}}</span>
            </li>
            <li>
              <span>需求名称：</span>
              <span>{{item.planName}}</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>{{item.deptName}}</span>
            </li>
            <li>
              <span>领用单位：</span>
              <span>{{item.receiveDeptName}}</span>
            </li>
            <li>
              <span>发料人：</span>
              <span>{{item.issueUserName}}</span>
            </li>
            <li>
              <span>领料人：</span>
              <span>{{item.pickUserName}}</span>
            </li>
            <li>
              <span>领用日期：</span>
              <span>{{parseTime(item.pickDate,'{y}-{m}-{d}')}}</span>
            </li>
            <li>
              <span>操作人：</span>
              <span>{{item.createUserName}}</span>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {materialSupplierOutRestList} from '@/api/prodmgr-inv/materialDemandPlanRest'

export default {
  name: 'OutListContent',
  data() {
    return {
      formData: {
        keywords: '',
      },
      dataList:[],

      allRefreshLoading: false,
      allLoading: false,
      allFinished: false,

      allListQuery: {
        pageNum: 1,
        pageSize: 10,
      },
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
      this.allListQuery.pageNum = 1;
      this.getAllList()
    },
    getAllList() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialSupplierOutRestList(Object.assign({},this.allListQuery,this.formData)).then(({ data }) => {
        if(this.allRefreshLoading){
          this.dataList = [];
          this.allRefreshLoading = false;
        }
        this.allLoading = false;
        this.dataList = [...this.dataList, ...data.list];

        if (data?.list?.length === 0) {
          this.allFinished = true;
          return;
        }
        this.allListQuery.pageNum = this.allListQuery.pageNum + 1;
      }).catch((error) => {
        this.allLoading = false;
        this.allFinished = true;
      }).finally(() => {
        toast.clear();
      });
    },
    outClick(item) {
      this.$router.push({ name: 'OutboundDetails',query: {id: item.id} })
    },
    handeSearch(){
      this.allRefresh();
    },
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {

  ::v-deep .van-sticky--fixed{
    top: 69px !important;
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
}
</style>