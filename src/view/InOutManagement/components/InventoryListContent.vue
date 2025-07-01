<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" background="#eef6ff"
          @search="handeSearch()">
        </van-search>
        <van-dropdown-menu active-color="#028bff">
          <van-dropdown-item v-model="value1" :options="option1" @change="handleMenuChange"/>
        </van-dropdown-menu>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." @load="getAllList">
        <div v-for="(item, index) in dataList" :key="index" class="box-container">
          <ul class="list-ul" @click="detailsClick">
            <li>
              <span>当前库存：</span>
              <span>{{item.relatedCount == 0?'无':'有'}}</span>
            </li>
            <li>
              <span class="font-weight">需求Id：</span>
              <span class="font-weight">{{item.planNumber}}</span>
            </li>
            <li>
              <span>需求名称：</span>
              <span>{{item.planName}}</span>
            </li>
            <li>
              <span>物资名称：</span>
              <span>{{item.materialName}}</span>
            </li>
            <li>
              <span>供应商：</span>
              <span>{{item.sellerName}}</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>{{item.deptName}}</span>
            </li>
            <li>
              <span>提报人：</span>
              <span>{{item.createUserName}}</span>
            </li>
            <li>
              <span>提报时间：</span>
              <span>{{parseTime(item.createDate,'{y}-{m}-{d} {h}:{i}')}}</span>
            </li>
            <li class="li-status">
                <van-tag type="primary" round size="medium">{{item.status == '5'?'已完成':'未完成'}}</van-tag>
            </li>
          </ul>
          <div class="list-ul-button" v-if="item.relatedCount == '1'">
            <van-button class="button-info" round type="info" @click="outboundClick(item)">出库</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {materialDemandPlanRestListStock} from '@/api/prodmgr-inv/materialDemandPlanRest'

export default {
  name: 'InventoryListContent',

  data() {
    return {
      formData: {
        keywords: '',
        status: '',
      },
      dataList:[],
      value1: 0,
      option1: [
        { text: '全部', value: 0 },
        { text: '未完成', value: 4 },
        { text: '已完成', value: 5 },
      ],
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
      materialDemandPlanRestListStock(Object.assign({},this.allListQuery,this.formData)).then(({ data }) => {
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
    outboundClick (item) {
      this.$router.push({ name: 'Outbound', query: {type: 'submit',id: item.id} })
    },
    detailsClick () {
      this.$router.push({ name: 'InventoryDetails' })
    },
    handeSearch(){
      this.allRefresh();
    },
    handleMenuChange(value){
      if(value == 0){
        this.formData.status = '';
      }else{
        this.formData.status = value;
      }
      this.allRefresh();
    },
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
}
</style>