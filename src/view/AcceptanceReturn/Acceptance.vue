<template>
  <div ref="container">
    <div class="list-search-container">
      <van-search
        v-model="formData.keywords"
        placeholder="输入关键字搜索"
        shape="round"
        background="#8ebdec"
        readonly
        @click="handeSearchClick()">
      </van-search>
    </div>
    <div class="tabs">
      <van-tabs
        v-model="menuActiveIndex"
        color="#0571ff"
        background="#8ebdec"
        title-active-color="#0571ff"
        title-inactive-color="#2e2e2e">
        <van-tab title="全部">
          <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
            <van-list
              v-model="allLoading"
              :finished="allFinished"
              finished-text="没有更多了..."
              @load="getAllList">

              <div v-for="(item,index) in 10" :key="index" class="box-container" @click="handleAllItemClick(item)">
                <ul class="list-ul">
                  <li>
                    <span class="font-weight">收货单号：</span>
                    <span class="font-weight">XQ2025050007</span>
                  </li>
                  <li>
                    <span>发货单号：</span>
                    <span>分部用料需求</span>
                  </li>
                  <li>
                    <span>供应需求：</span>
                    <span>工程部</span>
                  </li>
                  <li>
                    <span>物流单号：</span>
                    <span>物流单号名称</span>
                  </li>
                  <li>
                    <span>需求组织：</span>
                    <span>需求计划名称</span>
                  </li>
                  <li>
                    <span>供应商：</span>
                    <span>需求计划名称</span>
                  </li>
                  <li>
                    <span>发货时间：</span>
                    <span>需求计划名称</span>
                  </li>
                  <li class="li-status">
                    <van-tag type="primary" round size="medium">未收货</van-tag>
                  </li>
                </ul>
                <div class="list-ul-button">
                  <van-button class="button-info" round type="info" @click="handleExamineClick()">初验收货</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="未收货">
          <van-pull-refresh v-model="waitRefreshLoading" @refresh="waitRefresh" success-text="刷新成功">
            <van-list
              v-model="waitLoading"
              :finished="waitFinished"
              finished-text="没有更多了..."
              @load="getWaitList">

              <div v-for="(item,index) in 10" :key="index" class="box-container" @click="handleWaitItemClick(item)">
                <ul class="list-ul">
                  <li>
                    <span class="font-weight">收货单号：</span>
                    <span class="font-weight">XQ2025050007</span>
                  </li>
                  <li>
                    <span>发货单号：</span>
                    <span>分部用料需求</span>
                  </li>
                  <li>
                    <span>供应需求：</span>
                    <span>工程部</span>
                  </li>
                  <li>
                    <span>需求项目：</span>
                    <span>物流单号名称</span>
                  </li>
                  <li>
                    <span>需求名称：</span>
                    <span>需求计划名称</span>
                  </li>
                </ul>
                <div class="list-ul-button">
                  <van-button class="button-info" round type="info" @click="handleExamineClick()">初验收货</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="已收货">
          <van-pull-refresh v-model="waitHandleRefreshLoading" @refresh="waitHandleRefresh" success-text="刷新成功">
            <van-list
              v-model="waitHandleLoading"
              :finished="waitHandleFinished"
              finished-text="没有更多了..."
              @load="getWaitHandleList">

              <div v-for="(item,index) in 10" :key="index" class="box-container" @click="handleWaitHandleItemClick(item)">
                <ul class="list-ul">
                  <li>
                    <span class="font-weight">收货单号：</span>
                    <span class="font-weight">XQ2025050007</span>
                  </li>
                  <li>
                    <span>发货单号：</span>
                    <span>分部用料需求</span>
                  </li>
                  <li>
                    <span>需求项目：</span>
                    <span>物流单号名称</span>
                  </li>
                  <li>
                    <span>需求名称：</span>
                    <span>需求计划名称</span>
                  </li>
                  <li>
                    <span>审核时间：</span>
                    <span>2025-03-20 15:35</span>
                  </li>
                  <li>
                    <span>审核意见：</span>
                    <span>审核意见审核意见审核意见</span>
                  </li>
                </ul>
                <div class="list-ul-button">
                  <van-button class="button-info" plain round type="info" @click="handleProcessClick()">查看流程</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="部分退货">
          <van-pull-refresh v-model="waitRefreshLoading" @refresh="waitRefresh" success-text="刷新成功">
            <van-list
              v-model="waitLoading"
              :finished="waitFinished"
              finished-text="没有更多了..."
              @load="getHistoryList">

              <div v-for="(item,index) in 10" :key="index" class="box-container" @click="handleHistoryItemClick(item)">
                <ul class="list-ul">
                  <li>
                    <span class="font-weight">收货单号：</span>
                    <span class="font-weight">XQ2025050007</span>
                  </li>
                  <li>
                    <span>发货单号：</span>
                    <span>分部用料需求</span>
                  </li>
                  <li>
                    <span>需求项目：</span>
                    <span>物流单号名称</span>
                  </li>
                  <li>
                    <span>需求名称：</span>
                    <span>需求计划名称</span>
                  </li>
                  <li>
                    <span>审核时间：</span>
                    <span>2025-03-20 15:35</span>
                  </li>
                  <li>
                    <span>审核意见：</span>
                    <span>审核意见审核意见审核意见</span>
                  </li>
                  <li class="li-status">
                    <van-tag type="primary" round size="medium">同意</van-tag>
                  </li>
                </ul>
                <div class="list-ul-button">
                  <van-button class="button-info" plain round type="info" @click="handleProcessClick()">查看流程</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="已退货">
          <van-pull-refresh v-model="waitRefreshLoading" @refresh="waitRefresh" success-text="刷新成功">
            <van-list
              v-model="waitLoading"
              :finished="waitFinished"
              finished-text="没有更多了..."
              @load="getHistoryList">

              <div v-for="(item,index) in 10" :key="index" class="box-container" @click="handleHistoryItemClick(item)">
                <ul class="list-ul">
                  <li>
                    <span class="font-weight">收货单号：</span>
                    <span class="font-weight">XQ2025050007</span>
                  </li>
                  <li>
                    <span>发货单号：</span>
                    <span>分部用料需求</span>
                  </li>
                  <li>
                    <span>需求项目：</span>
                    <span>物流单号名称</span>
                  </li>
                  <li>
                    <span>需求名称：</span>
                    <span>需求计划名称</span>
                  </li>
                  <li>
                    <span>审核时间：</span>
                    <span>2025-03-20 15:35</span>
                  </li>
                  <li>
                    <span>审核意见：</span>
                    <span>审核意见审核意见审核意见</span>
                  </li>
                  <li class="li-status">
                    <van-tag type="primary" round size="medium">同意</van-tag>
                  </li>
                </ul>
                <div class="list-ul-button">
                  <van-button class="button-info" plain round type="info" @click="handleProcessClick()">查看流程</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'

export default {
  name: 'Acceptance',
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
      allFinished: false,

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
        pageNum: 1,
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
    // this.getOrderStatusOptions();
  },
  activated() {
    if (this.$route.params.refresh) {
      this.waitRefresh()
      this.historyRefresh()
    }
    this.$store.commit('removeThisPage', 'MyToDoDetail')
  },
  methods: {
    //获取订单状态字典
    getOrderStatusOptions() {

    },
    //获取全部订单
    getAllList() {
      this.allRefreshLoading = false
      this.allFinished = true
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
    //获取待处理数据
    getWaitHandleList() {

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
      this.$router.push({name: 'DoAccept'})
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
    //待处理列表条目点击
    handleWaitHandleItemClick(item) {
      // this.$router.push({
      //     name: "ApprovalDetail",
      //     params: {
      //         id:item.id,
      //     },
      // });
    },
    //已审核列表条目点击
    handleHistoryItemClick(item) {
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
    //去审核点击
    handleExamineClick() {
      this.$router.push({
        name: 'MyToDoDetail',
        params: {
          type: '0'
        }
      })
    },
    //搜索点击
    handeSearchClick() {
      this.$router.push({
        name: 'MyToDoSearch',
        params: {
          type: '0'
        }
      })
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
    //待处理列表刷新
    waitHandleRefresh() {
      this.waitHandleRefreshLoading = true
      this.waitHandleLoading = true
      this.waitHandleFinished = false
      this.waitHandleListQuery.pageNum = 1
      this.getWaitHandleList()
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
::v-deep .van-tabs__content {
  height: calc(100vh - 167px);
  overflow-y: scroll;
}
</style>
