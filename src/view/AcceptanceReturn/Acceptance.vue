<template>
  <div class="tab-list">
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
      <van-tabs
        v-model="menuActiveIndex"
        color="#0571ff"
        background="#eef6ff"
        title-active-color="#0571ff"
        title-inactive-color="#2e2e2e"
        @click="handleChange">
        <van-tab v-for="(item,index) in tabList" :key="index" :title="item.title">
          <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
            <van-list
              v-model="listLoading"
              :finished="allFinished"
              finished-text="没有更多了..."
              @load="onLoad">

              <div v-for="(item,index) in dataList" :key="index" class="box-container">
                <ul class="list-ul" >
                  <li>
                    <span class="font-weight">收货单号：</span>
                    <span class="font-weight" @click="viewAcceptDetail(item)" style="color: #0689ff">{{ item.takeNumber }}</span>
                  </li>
                  <li>
                    <span>发货单号：</span>
                    <span>{{ item.shipmentBatchNumber }}</span>
                  </li>
                  <li>
                    <span>需求名称：</span>
                    <span>{{ item.planName }}</span>
                  </li>
                  <li>
                    <span>物流单号：</span>
                    <span @click="viewLogistic(item)" style="color: #0689ff">{{ item.oddNumbers?item.oddNumbers:"其他" }}</span>
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
                    <span>发货时间：</span>
                    <span>{{ item.shippingDate | formatDate}}</span>
                  </li>
                  <li v-if="item.takeStatus === '2'">
                    <span>收货时间：</span>
                    <span>{{ item.takeDate | formatToDate}}</span>
                  </li>
                  <li  v-if="item.takeStatus === '2'">
                    <span>收货人：</span>
                    <span>{{ item.consigneeOperator}}</span>
                  </li>
                  <li class="li-status">
                    <van-tag :type="item.takeStatus | statusStyleFilter" round size="medium" :class="{'li-status-completed': item.takeStatus == 4}">{{
                        item.takeStatus | statusFilter(tabList)
                      }}
                    </van-tag>
                  </li>
                </ul>
                <div class="list-ul-button" v-if="item.takeStatus === '1'">
                  <van-button class="button-info" round type="info" @click="handleDoAccept(item)">初验收货</van-button>
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
import {listTake} from '@/api/prodmgr-inv/AcceptanceReturn'

export default {
  name: 'Acceptance',
  mixins: [keepPages],

  data() {
    return {
      menuActiveIndex: '',

      formData: {
        keywords: ''
      },
      tabList: [
        {title: '全部', status: '0'},
        {title: '未收货', status: '1'},
        {title: '已收货', status: '2'},
        {title: '部分退货', status: '3'},
        {title: '已退货', status: '4'}
      ],
      dataList: [],
      allRefreshLoading: false,
      listLoading: false,
      allFinished: false,
      allListQuery: {
        pageNum: 0,
        pageSize: 10
      },
    }
  },
  computed: {
    activeTab () {
      return this.$store.getters.activeTab
    }
  },
  filters: {
    statusFilter(status, tabList) {
      return tabList.find(item => item.status === status).title
    },
    statusStyleFilter(status) {
      const statusMap = [
        {status: '1', type: 'primary'},
        {status: '2', type: 'success'},
        {status: '3', type: 'danger'},
        {status: '4', type: 'default'}
      ]
      return statusMap.find(item => item.status === status).type
    },
    formatDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
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
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }else{
        return ""
      }  
    }

  },
  created () {
    this.menuActiveIndex=this.activeTab.activeTab
    if(this.$route.meta.myToDoNavIndex){
        this.menuActiveIndex = this.$route.meta.myToDoNavIndex;
    }
  },
  activated() {
    if (this.$route.params.refresh) {
      this.waitRefresh()
      this.historyRefresh()
    }
    this.$store.commit('removeThisPage', 'MyToDoDetail')
  },
  methods: {
    //收获列表
    getList(){
      let params = {pageNum:this.allListQuery.pageNum,pageSize:this.allListQuery.pageSize,planName:this.formData.keywords,takeStatus:this.menuActiveIndex?this.menuActiveIndex:''}
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      listTake(params).then((res) => {
        if(res.success){
          this.listLoading = false //加载结束
            if (this.allRefreshLoading) {
              this.dataList = [];
              this.allRefreshLoading = false;
            }
            if (this.allListQuery.pageNum === 1) {
              this.dataList =res.data.list
            } else {
              this.dataList = [...this.dataList, ...res.data.list]
            }
            if (this.dataList.length == res.data.total) {
              this.allFinished = true
            } else {
              this.allFinished = false
            }
          }
       }).finally(() => {
          toast.clear();
      });
    },
    handleChange(val){
      this.menuActiveIndex = val?val:''
      this.allListQuery.pageNum = 1
      this.allRefreshLoading = true
      this.allFinished = true
      this.getList()
    },
    //获取全部订单
    loadList() {
      this.allRefreshLoading = false
      this.allFinished = true
    },
    //全部列表条目点击
    viewAcceptDetail(item) {
      if(!item.takeNumber){
        return
      }
     this.$store.dispatch('updateActiveTab', {
        activeTab:this.menuActiveIndex
      })
      this.$router.push({name: 'DoAcceptDetail', query: {id:item.id}})
    },
    viewLogistic(item){

      this.$router.push({name: 'LogisticsView', query: {id:item.planId}})
    },
    //去审核点击
    handleDoAccept(item) {
      this.$store.dispatch('updateActiveTab', {
        activeTab:this.menuActiveIndex
      })
      this.$router.push({name: 'DoAccept',query: {id:item.id}})
    },
    //搜索点击
    handeSearchClick() {
      this.allListQuery.pageNum = 1
      this.getList()
    },
    //全部列表刷新
    allRefresh() {
      this.allListQuery.pageNum = 1
      this.getList()
    },
    onLoad() {
      this.allListQuery.pageNum ++
      this.getList()
    },
  }
}
</script>
<style lang="less" scoped>
::v-deep .van-tabs__content {
  height: calc(100vh - 5.7rem);
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
</style>
