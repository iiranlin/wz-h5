<template>
  <div ref="container" class="in-out-management-list">
     <van-sticky>
      <div class="list-search-container">
       <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" left-icon="none" @search="handeSearchClick()">
          <template slot='right-icon'>
            <van-icon name="search" @click="handeSearchClick()"/>
          </template>
        </van-search>
    </div>
    </van-sticky>
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list
        v-model="allLoading"
        :finished="allFinished"
        finished-text="没有更多了..."
        @load="onLoad">

        <div v-for="(item,index) in allOrderList" :key="index" class="box-container" @click="handleAllItemClick(item)">
          <div class="list-title-content">
          <span>退货单号：</span>
          <span class="font-weight" style="color:#8C8FA0;"  >{{item.backNumber}}</span>
        </div>
          <ul class="list-ul">
            <li class="li-item-overlength">
              <!-- <span>供应需求名称：</span> -->
              <span class="font-weight">{{item.planName}}</span>
            </li>
            <li>
              <span>发货单号：</span>
              <span class="li-span-click" @click.stop="viewDelivery(item)">{{item.shipmentBatchNumber}}</span>
            </li>
            <!-- <li>
              <span>建设项目：</span>
              <span>{{ item.projectName }}</span>
            </li> 
            <li>
              <span>标段项目：</span>
              <span>{{ item.sectionName }}</span>
            </li> -->
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
              <span class="li-span-click">{{item.createUserName}}</span>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
     <back-to-top className=".in-out-management"></back-to-top>
  </div>

</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import BackToTop from '@/components/BackToTop'
import {listCyRetreat} from '@/api/prodmgr-inv/AcceptanceReturn'


export default {
  name: 'Return',
  mixins: [keepPages],
  components:{BackToTop},
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
      let params = {pageNum:this.allListQuery.pageNum,pageSize:this.allListQuery.pageSize,queryField:this.formData.keywords,takeStatus:val?val:''}
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
    viewDelivery(item){
      this.$router.push({name: 'cargoDetails', query: {id:item.id,btnEvent:item.takeNumber?false:true}})
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
    // handleWaitItemClick(item) {
    //   // this.$router.push({
    //   //     name: "ApprovalDetail",
    //   //     params: {
    //   //         id:item.id,
    //   //     },
    //   // });
    // },
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
.in-out-management-list {

  ::v-deep .van-sticky--fixed{
    top: 0px !important;
  }
  
  .list-search-container {
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    background: #eef6ff;
    margin-bottom: 10px;

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
}
</style>
