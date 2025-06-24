<template>
  <div class="tab-list">
    <div class="list-search-container">
      <van-search
        v-model="formData.keywords"
        placeholder="输入关键字搜索"
        shape="round"
        background="#eef6ff"
        @click="handeSearchClick()">
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
              @load="getList">

              <div v-for="(item,index) in dataList" :key="index" class="box-container">
                <ul class="list-ul" @click="viewAcceptDetail(item)">
                  <li>
                    <span class="font-weight">收货单号：</span>
                    <span class="font-weight">{{ item.takeNumber }}</span>
                  </li>
                  <li>
                    <span>发货单号：</span>
                    <span>{{ item.shipmentBatchNumber }}</span>
                  </li>
                  <li>
                    <span>供应需求：</span>
                    <span>{{ item.planName }}</span>
                  </li>
                  <li>
                    <span>物流单号：</span>
                    <span>{{ item.oddNumbers?item.oddNumbers:"其他" }}</span>
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
                  <li class="li-status">
                    <van-tag :type="item.takeStatus | statusStyleFilter" round size="medium" :class="{'li-status-completed': item.takeStatus == 4}">{{
                        item.takeStatus | statusFilter(tabList)
                      }}
                    </van-tag>
                  </li>
                </ul>
                <div class="list-ul-button" v-if="item.takeStatus === '1'">
                  <van-button class="button-info" round type="info" @click="handleDoAccept()">初验收货</van-button>
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
import {ListTake} from '@/api/prodmgr-inv/AcceptanceReturn'

export default {
  name: 'Acceptance',
  mixins: [keepPages],

  data() {
    return {
      menuActiveIndex: 0,

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
        pageNum: 1,
        pageSize: 10
      }
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
        
    }

  },
  created() {
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
    getList(val){
      let params = {pageNum:this.allListQuery.pageNum,pageSize:this.allListQuery.pageSize,takeStatus:val?val:''}
      ListTake(params).then((res) => {
        if(res.success){
          this.dataList = res.data.list
        }
       })
       this.allFinished=true
    },
    handleChange(val){
      this.getList(val)

    },
    //获取全部订单
    loadList() {
      this.allRefreshLoading = false
      this.allFinished = true
    },
    //全部列表条目点击
    viewAcceptDetail(item) {
      if(item.takeStatus==2){
        this.$router.push({name: 'DoAcceptDetail', query: {from: 'AcceptanceReturn',id:item.id}})
      }
      
    },
    //去审核点击
    handleDoAccept() {
      this.$router.push({name: 'DoAccept'})
    },
    //搜索点击
    handeSearchClick() {

    },
    //全部列表刷新
    allRefresh() {
      this.allRefreshLoading = true
      this.listLoading = true
      this.allFinished = false
      this.allListQuery.pageNum = 1
      this.loadList()
    }
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
