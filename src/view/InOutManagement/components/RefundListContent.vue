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
        <div v-for="(item, index) in dataList" :key="index" class="box-container" @click="handleWaitItemClick(item)">
           <div class="list-title-content">
            <span>退货单号：</span>
            <span class="font-weight" style="color:#134daa;">{{item.backNode == '2'?item.backNumber:item.backQualNumber}}</span>
          </div>
          <ul class="list-ul">
            <li>
              <span>收货单号：</span>
              <span @click.stop="detailsClick(item)" class="li-span-click">{{ item.takeNumber }}</span>
            </li>
            <li>
              <span class="li-item-span-auto">供应需求名称：</span>
              <span>{{ item.planName }}</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>{{ item.deptName }}</span>
            </li>
            <li>
              <span>供应商：</span>
              <span>{{ item.sellerName }}</span>
            </li>
            <li>
              <span>退货时间：</span>
              <span>{{  item.backNode == '2'?item.backDate && parseTime(item.backDate, '{y}-{m}-{d} {h}:{i}'):item.backQualDate && parseTime(item.backQualDate, '{y}-{m}-{d} {h}:{i}') }}</span>
            </li>
            <li>
              <span>操作人：</span>
              <span>{{ item.createUserName }}</span>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {listCrRetreat} from '@/api/prodmgr-inv/materialCirculationTableRest'
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
      dataList: [],
      allListQuery: {
        pageNum: 1,
        pageSize: 10,
      }
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
      listCrRetreat(Object.assign({},this.allListQuery,this.formData)).then(({ data }) => {
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
    handleWaitItemClick (item) {
      // this.$router.push({ name: 'SubmitStore', query: {type: 'view'} })
      this.$router.push({name: 'DoReturn',query:{id: item.id}})
    },
    detailsClick (item) {
      this.$router.push({ name: 'DoAcceptDetail', query: {id: item.id}  })
    },
    handeSearchClick () {
      this.allRefresh()
    }
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