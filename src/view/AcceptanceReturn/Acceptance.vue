<template>
  <div ref="container">
    <div class="list-search-container">
      <van-search
        v-model="formData.keywords"
        placeholder="输入关键字搜索"
        shape="round"
        background="#eef6ff"
        readonly
        @click="handeSearchClick()">
      </van-search>
    </div>
    <div class="tabs">
      <van-tabs
        v-model="menuActiveIndex"
        color="#0571ff"
        background="#eef6ff"
        title-active-color="#0571ff"
        title-inactive-color="#2e2e2e">
        <van-tab v-for="(item,index) in tabList" :key="index" :title="item.title">
          <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
            <van-list
              v-model="allLoading"
              :finished="allFinished"
              finished-text="没有更多了..."
              @load="getAllList">

              <div v-for="(item,index) in dataList" :key="index" class="box-container">
                <ul class="list-ul" @click="handleAllItemClick(item)">
                  <li>
                    <span class="font-weight">收货单号：</span>
                    <span class="font-weight">{{ item.receiptNumber }}</span>
                  </li>
                  <li>
                    <span>发货单号：</span>
                    <span>{{ item.deliveryNumber }}</span>
                  </li>
                  <li>
                    <span>供应需求：</span>
                    <span>{{ item.supplyDemand }}</span>
                  </li>
                  <li>
                    <span>物流单号：</span>
                    <span>{{ item.logisticsNumber }}</span>
                  </li>
                  <li>
                    <span>需求组织：</span>
                    <span>{{ item.requiredOrganization }}</span>
                  </li>
                  <li>
                    <span>供应商：</span>
                    <span>{{ item.supplier }}</span>
                  </li>
                  <li>
                    <span>发货时间：</span>
                    <span>{{ item.shippingTime }}</span>
                  </li>
                  <li class="li-status">
                    <van-tag :type="item.status | statusStyleFilter" round size="medium">{{ item.status | statusFilter(tabList) }}</van-tag>
                  </li>
                </ul>
                <div class="list-ul-button" v-if="item.status === '1'">
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
      dataList: [
        {
          receiptNumber: 'XQ2025050007',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称1',
          requiredOrganization: '需求计划名称1',
          supplier: '供应商1',
          shippingTime: '2025-03-10 15:35',
          status: '1'
        },
        {
          receiptNumber: 'XQ2025050008',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称2',
          requiredOrganization: '需求计划名称2',
          supplier: '供应商2',
          shippingTime: '2025-03-11 15:35',
          status: '2'
        },
        {
          receiptNumber: 'XQ2025050009',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称3',
          requiredOrganization: '需求计划名称3',
          supplier: '供应商3',
          shippingTime: '2025-03-12 15:35',
          status: '3'
        },
        {
          receiptNumber: 'XQ2025050010',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称4',
          requiredOrganization: '需求计划名称4',
          supplier: '供应商4',
          shippingTime: '2025-03-13 15:35',
          status: '4'
        },
        {
          receiptNumber: 'XQ2025050011',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称5',
          requiredOrganization: '需求计划名称5',
          supplier: '供应商5',
          shippingTime: '2025-03-14 15:35',
          status: '1'
        },
        {
          receiptNumber: 'XQ2025050012',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称6',
          requiredOrganization: '需求计划名称6',
          supplier: '供应商6',
          shippingTime: '2025-03-15 15:35',
          status: '2'
        },
        {
          receiptNumber: 'XQ2025050013',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称7',
          requiredOrganization: '需求计划名称7',
          supplier: '供应商7',
          shippingTime: '2025-03-16 15:35',
          status: '3'
        },
        {
          receiptNumber: 'XQ2025050014',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称8',
          requiredOrganization: '需求计划名称8',
          supplier: '供应商8',
          shippingTime: '2025-03-17 15:35',
          status: '4'
        },
        {
          receiptNumber: 'XQ2025050015',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称9',
          requiredOrganization: '需求计划名称9',
          supplier: '供应商9',
          shippingTime: '2025-03-18 15:35',
          status: '1'
        },
        {
          receiptNumber: 'XQ2025050016',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称10',
          requiredOrganization: '需求计划名称10',
          supplier: '供应商10',
          shippingTime: '2025-03-19 15:35',
          status: '2'
        }
      ],
      allList: [
        {
          receiptNumber: 'XQ2025050007',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称1',
          requiredOrganization: '需求计划名称1',
          supplier: '供应商1',
          shippingTime: '2025-03-10 15:35',
          status: '1'
        },
        {
          receiptNumber: 'XQ2025050008',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称2',
          requiredOrganization: '需求计划名称2',
          supplier: '供应商2',
          shippingTime: '2025-03-11 15:35',
          status: '2'
        },
        {
          receiptNumber: 'XQ2025050009',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称3',
          requiredOrganization: '需求计划名称3',
          supplier: '供应商3',
          shippingTime: '2025-03-12 15:35',
          status: '3'
        },
        {
          receiptNumber: 'XQ2025050010',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称4',
          requiredOrganization: '需求计划名称4',
          supplier: '供应商4',
          shippingTime: '2025-03-13 15:35',
          status: '4'
        },
        {
          receiptNumber: 'XQ2025050011',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称5',
          requiredOrganization: '需求计划名称5',
          supplier: '供应商5',
          shippingTime: '2025-03-14 15:35',
          status: '1'
        },
        {
          receiptNumber: 'XQ2025050012',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称6',
          requiredOrganization: '需求计划名称6',
          supplier: '供应商6',
          shippingTime: '2025-03-15 15:35',
          status: '2'
        },
        {
          receiptNumber: 'XQ2025050013',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称7',
          requiredOrganization: '需求计划名称7',
          supplier: '供应商7',
          shippingTime: '2025-03-16 15:35',
          status: '3'
        },
        {
          receiptNumber: 'XQ2025050014',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称8',
          requiredOrganization: '需求计划名称8',
          supplier: '供应商8',
          shippingTime: '2025-03-17 15:35',
          status: '4'
        },
        {
          receiptNumber: 'XQ2025050015',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称9',
          requiredOrganization: '需求计划名称9',
          supplier: '供应商9',
          shippingTime: '2025-03-18 15:35',
          status: '1'
        },
        {
          receiptNumber: 'XQ2025050016',
          deliveryNumber: '分部用料需求',
          supplyDemand: '工程部',
          logisticsNumber: '物流单号名称10',
          requiredOrganization: '需求计划名称10',
          supplier: '供应商10',
          shippingTime: '2025-03-19 15:35',
          status: '2'
        }
      ],

      allRefreshLoading: false,
      allLoading: false,
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
    }
  },
  watch: {
    menuActiveIndex(val) {
      if (val != '0') {
        this.dataList = this.allList.filter(item => item.status == val)
      } else {
        this.dataList = this.allList
      }
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
    //获取全部订单
    getAllList() {
      this.allRefreshLoading = false
      this.allFinished = true
    },
    //全部列表条目点击
    handleAllItemClick(item) {
      this.$router.push({name: 'DoAcceptDetail', query: {from: 'AcceptanceReturn'}})
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
      this.allLoading = true
      this.allFinished = false
      this.allListQuery.pageNum = 1
      this.getAllList()
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .van-tabs__content {
  height: calc(100vh - 205px);
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
