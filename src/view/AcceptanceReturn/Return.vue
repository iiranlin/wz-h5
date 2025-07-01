<template>
  <div ref="container">
    <div class="list-search-container">
      <van-search
        v-model="formData.keywords"
        placeholder="输入关键字搜索"
        shape="round"
        background="#eef6ff"
        @search="handeSearchClick()">
      </van-search>
    </div>
    <div class="tabs">
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
        <van-list
          v-model="allLoading"
          :finished="allFinished"
          finished-text="没有更多了..."
          @load="onLoad">

          <div v-for="(item,index) in allOrderList" :key="index" class="box-container" >
            <ul class="list-ul">
              <li>
                <span class="font-weight">退货单号：</span>
                <span class="font-weight" @click="handleAllItemClick(item)" style="color: #0689ff">{{item.backNumber}}</span>
              </li>
              <li>
                <span>发货单号：</span>
                <span>{{item.shipmentBatchNumber}}</span>
              </li>
              <li>
                <span>供应需求名称：</span>
                <span>{{item.planName}}</span>
              </li>
              <li>
                <span>需求组织：</span>
                <span>{{item.deptName}}</span>
              </li>
              <li>
                <span>供应商：</span>
                <span>{{item.sellerName}}</span>
              </li>
              <li>
                <span>发货时间：</span>
                <span>{{item.shippingDate | formatDate}}</span>
              </li>
              <li>
                <span>退货时间：</span>
                <span>{{item.backDate | formatDate}}</span>
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
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import {listCyRetreat} from '@/api/prodmgr-inv/AcceptanceReturn'

export default {
  name: 'Return',
  mixins: [keepPages],

  data() {
    return {
      menuActiveIndex: 0,
      formData: {
        keywords: ''
      },
      //全部
      allOrderList: [],

      allRefreshLoading: false,
      allLoading: false,
      allFinished: true,

      allListQuery: {
        pageNum: 1,
        pageSize: 10
      },
      //待审批
      waitOrderList: [],

      waitRefreshLoading: false,
      waitLoading: false,
      waitFinished: false,

      waitListQuery: {
        pageNum: 0,
        pageSize: 10
      },
      //待处理
      waitHandleList: [],

      waitHandleRefreshLoading: false,
      waitHandleLoading: false,
      waitHandleFinished: false,

      waitHandleListQuery: {
        pageNum: 1,
        pageSize: 10
      },
      //已审批
      historyOrderList: [],

      historyRefreshLoading: false,
      historyLoading: false,
      historyFinished: false,

      historyListQuery: {
        pageNum: 1,
        pageSize: 10
      },

      //订单状态字典
      orderStatusOptions: [],
      //优先保障字典
      guaranteeOptions: []
    }
  },
  created() {
    this.getAllList();
  },
  activated() {
    if (this.$route.params.refresh) {
      this.waitRefresh()
      this.historyRefresh()
    }
    this.$store.commit('removeThisPage', 'MyToDoDetail')
  },
  filters: {
    formatDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }else{
        return ""
      }  
    },
    formatToDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      }else{
        return ""
      }  
    }
  },
  methods: {
      //收获列表
    getAllList(val){
      let params = {pageNum:this.allListQuery.pageNum,pageSize:this.allListQuery.pageSize,planName:this.formData.keywords,takeStatus:val?val:''}
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      listCyRetreat(params).then((res) => {
        if(res.success){
          this.listLoading = false //加载结束
            if (this.allRefreshLoading) {
              this.allOrderList = [];
              this.allRefreshLoading = false;
            }
            if (this.allListQuery.pageNum === 1) {
              this.allOrderList =res.data.list
            } else {
              this.allOrderList = [...this.allOrderList, ...res.data.list]
            }
            if (this.allOrderList.length == res.data.total) {
              this.allFinished = true
            } else {
              this.allFinished = false
            }
        }
       }).finally(() => {
          toast.clear();
      });
    },
    onLoad() {
      this.allListQuery.pageNum ++
      this.getAllList()
    },
    //获取订单状态字典
    getOrderStatusOptions() {

    },
    //获取待审批的订单
    getWaitList() {
      // let toast = this.$toast.loading({
      //     duration: 0,
      //     message: "正在加载...",
      //     forbidClick: true
      // });
      // let  params = {
      //     reviewCompleted: '0',
      // }
      // gcywVehicleRequestListPageForH5(Object.assign({}, params,this.waitListQuery)).then(({ data }) => {
      //     if(this.waitRefreshLoading){
      //         this.waitOrderList = [];
      this.waitRefreshLoading = false
      //     }
      //     this.waitLoading = false;
      //     this.waitOrderList = [...this.waitOrderList, ...data.list];

      //     if (!data.hasNextPage) {
      this.waitFinished = true
      //         return;
      //     }
      //     this.waitListQuery.pageNum = this.waitListQuery.pageNum + 1;
      // }).catch((error) => {
      //     this.waitLoading = false;
      //     this.waitFinished = true;
      // }).finally(() => {
      //     toast.clear();
      // });
    },
    //获取已审批订单
    getHistoryList() {
      // let toast = this.$toast.loading({
      //     duration: 0,
      //     message: "正在加载...",
      //     forbidClick: true
      // });
      // let  params = {
      //     reviewCompleted: '1',
      // }
      // gcywVehicleRequestListPageForH5(Object.assign({}, params,this.historyListQuery)).then(({ data }) => {
      //     if(this.historyRefreshLoading){
      //         this.historyOrderList = [];
      this.historyRefreshLoading = false
      //     }
      //     this.historyLoading = false;
      //     this.historyOrderList = [...this.historyOrderList, ...data.list];

      //     if (!data.hasNextPage) {
      this.historyFinished = true
      //         return;
      //     }
      //     this.historyListQuery.pageNum = this.historyListQuery.pageNum + 1;
      // }).catch((error) => {
      //     this.historyLoading = false;
      //     this.historyFinished = true;
      // }).finally(() => {
      //     toast.clear();
      // });
    },
    //全部列表条目点击
    handleAllItemClick(item) {
      this.$router.push({name: 'DoReturn',query:{id:item.id}})
    },
    //待审核列表条目点击
    handleWaitItemClick(item) {
      // this.$router.push({
      //     name: "ApprovalDetail",
      //     params: {
      //         id:item.id,
      //     },
      // });
    },
    //查看流程点击
    handleProcessClick() {
      this.$router.push({
        name: 'MyProcess',
        params: {}
      })
    },
    //搜索点击
    handeSearchClick() {
      this.allListQuery.pageNum = 1
      this.getAllList()
      
    },
    //全部列表刷新
    allRefresh() {
      this.allRefreshLoading = true
      this.allLoading = true
      this.allFinished = false
      this.allListQuery.pageNum = 1
      this.getAllList()
    },
    //待审核列表刷新
    waitRefresh() {
      this.waitRefreshLoading = true
      this.waitLoading = true
      this.waitFinished = false
      this.waitListQuery.pageNum = 1
      this.getWaitList()
    },
    //已审核列表刷新
    historyRefresh() {
      this.historyRefreshLoading = true
      this.historyLoading = true
      this.historyFinished = false
      this.historyListQuery.pageNum = 1
      this.getHistoryList()
    }
  }
}
</script>
<style lang="less" scoped>
.tabs {
  height: calc(100vh - 4.4rem);
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
.list-ul li :nth-child(1){
  min-width: 2.6rem;
}
</style>
