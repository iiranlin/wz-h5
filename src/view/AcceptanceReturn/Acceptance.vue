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
                    <van-tag :type="item.status | statusStyleFilter" round size="medium" :class="{'li-status-completed': item.status == 4}">{{ item.status | statusFilter(tabList) }}</van-tag>
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
      dataList: [],
      allList: [
        {
          receiptNumber: '',
          deliveryNumber: 'FH202505310006',
          supplyDemand: '2025年5月甲供物资计划申请表-04',
          logisticsNumber: 'Es130343925KR',
          requiredOrganization: '施工单位名称（分部）',
          supplier: '五道口有限责任公司',
          shippingTime: '2025-04-20',
          status: '1'
        },
        {
          receiptNumber: '',
          deliveryNumber: 'FH202505310005',
          supplyDemand: '2025年5月甲供物资计划申请表-03',
          logisticsNumber: 'Es130343925KR',
          requiredOrganization: '施工单位名称（分部）',
          supplier: '五道口有限责任公司',
          shippingTime: '2025-04-20',
          status: '1'
        },
        {
          receiptNumber: 'SH202506010004',
          deliveryNumber: 'FH202505310004',
          supplyDemand: '2025年5月甲供物资计划申请表-02',
          logisticsNumber: 'Es130343925KR',
          requiredOrganization: '施工单位名称（分部）',
          supplier: '五道口有限责任公司',
          shippingTime: '2025-04-20',
          status: '2'
        },
        {
          receiptNumber: 'SH202506010003',
          deliveryNumber: 'FH202505310003',
          supplyDemand: '2025年5月甲供物资计划申请表-04',
          logisticsNumber: '其它',
          requiredOrganization: '施工单位名称（分部）',
          supplier: '五道口有限责任公司',
          shippingTime: '2025-04-20',
          status: '2'
        },
        {
          receiptNumber: 'SH202506010002',
          deliveryNumber: 'FH202505310002',
          supplyDemand: '2025年5月甲供物资计划申请表-03',
          logisticsNumber: '其它',
          requiredOrganization: '施工单位名称（分部）',
          supplier: '五道口有限责任公司',
          shippingTime: '2025-04-20',
          status: '3'
        },
        {
          receiptNumber: 'SH202506010001',
          deliveryNumber: 'FH202505310001',
          supplyDemand: '2025年5月甲供物资计划申请表-02',
          logisticsNumber: 'Es130343925KR',
          requiredOrganization: '施工单位名称（分部）',
          supplier: '五道口有限责任公司',
          shippingTime: '2025-04-20',
          status: '4'
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
    this.dataList = this.allList
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
  height: calc(100vh - 240px);
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
