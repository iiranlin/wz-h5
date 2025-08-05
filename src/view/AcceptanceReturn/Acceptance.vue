<template>
  <div class="tab-list in-out-management-list default-scroll">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" left-icon="none" @search="handeSearchClick()">
          <template slot='right-icon'>
            <van-icon name="search" @click="handeSearchClick()"/>
          </template>
        </van-search>
      </div>
      <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e" @change="tabsChange">
        <van-tab v-for="item in tabList" :title="item.title" :name="item.status" :key="item.status">
        </van-tab>
      </van-tabs>
    </van-sticky>
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
            <van-list
              v-model="listLoading"
              :finished="allFinished"
              finished-text="没有更多了..."
              @load="onLoad">

              <div v-for="(item,index) in dataList" :key="index" class="box-container"  @click="viewAcceptDetail(item)">
                <div class="list-title-content">
                  <span>收货单号：</span>
                  <span class="font-weight" style="color:#134daa;" >{{ item.takeNumber}}</span>
                  <div class="li-title-status">
                    <img :src="checkAuditStatus(item.takeStatus)"/>
                    <span :type="item.takeStatus | statusStyleFilter" round size="medium" :class="{'li-status-completed': item.takeStatus == 4}">{{
                        item.takeStatus | statusFilter(tabList)
                      }}
                    </span>
                  </div>
                </div>
                <ul class="list-ul" >
                  <li>
                    <span>发货单号：</span>
                    <span @click.stop="viewDelivery(item)" style="color: #0689ff">{{ item.shipmentBatchNumber }}</span>
                  </li>
                  <li>
                    <span>需求名称：</span>
                    <span>{{ item.planName }}</span>
                  </li>
                  <li>
                    <span>物流单号：</span>
                    <span @click.stop="viewLogistic(item)" style="color: #0689ff">{{ item.oddNumbers?item.oddNumbers:"其他" }}</span>
                  </li>
                  <li>
                    <span>建设项目：</span>
                    <span>{{ item.projectName }}</span>
                  </li> 
                  <li>
                    <span>标段项目：</span>
                    <span>{{ item.sectionName }}</span>
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
                  <!-- <li class="li-status">
                    <van-tag :type="item.takeStatus | statusStyleFilter" round size="medium" :class="{'li-status-completed': item.takeStatus == 4}">{{
                        item.takeStatus | statusFilter(tabList)
                      }}
                    </van-tag>
                  </li> -->
                </ul>
                <div class="list-ul-button">
                  <!-- 状态不是未收货，按钮全不能操作 -->
                  <van-button class="button-info" round type="info" v-if="item.takeStatus === '1'" @click.stop="handleDoAccept(item)">收货</van-button>
                  <!--  非审核中不允许撤回 -->
                  <van-button class="button-info" plain round type="info" v-if="item.takeStatus === '5'" @click.stop="recallClick(item)">撤回</van-button>
                  <!--  未收货不能下载 -->
                  <van-button class="button-info" round type="info" v-if="!['1', '5'].includes(item.takeStatus)" @click.stop="downLoadAcceptanceOrder(item)">下载验收单</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
    <back-to-top :className="className"></back-to-top>
    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import indexMixin from '@/view/mixins'
import BackToTop from '@/components/BackToTop'
import activitiAssignee from '@/components/activitiAssignee'
import {listTake} from '@/api/prodmgr-inv/AcceptanceReturn'
import { materialCirculationTableRestSubmit } from '@/api/prodmgr-inv/materialCirculationTableRest'
import { recall } from '@/api/prodmgr-inv/audit'

export default {
  name: 'Acceptance',
  mixins: [keepPages, indexMixin],
  components:{BackToTop, activitiAssignee},
  data() {
    return {
      className: '.in-out-management',

      menuActiveIndex: '',

      formData: {
        keywords: ''
      },
      tabList: [
        {title: '全部', status: ''},
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
    this.scrollPositionInit(this.className, this.allFinished)
    if (this.$route.params.refresh) {
      this.waitRefresh()
      this.historyRefresh()
    }
    this.$store.commit('removeThisPage', 'MyToDoDetail')
  },
  methods: {
    //收获列表
    getList(){
      let params = {pageNum:this.allListQuery.pageNum,pageSize:this.allListQuery.pageSize,queryField:this.formData.keywords,takeStatus:this.menuActiveIndex?this.menuActiveIndex:''}
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
      // if(!item.takeNumber){
      //   return
      // }
     this.$store.dispatch('updateActiveTab', {
        activeTab:this.menuActiveIndex
      })
      this.$router.push({name: 'DoAcceptDetail', query: {id:item.id,tabs:item.takeNumber?true:false,isLable:item.takeNumber?true:false}})
    },
    viewLogistic(item){
      this.$router.push({name: 'lookCargo', query: {id:item.planId,number:item.shipmentBatchNumber,logisticsNumber:item.oddNumbers}})
    },
    // 发货
    viewDelivery(item){
      this.$router.push({name: 'cargoDetails', query: {id:item.id,btnEvent:item.takeNumber?false:true}})
    },
    //去审核点击
    handleDoAccept(item) {
      this.$store.dispatch('updateActiveTab', {
        activeTab:this.menuActiveIndex

      })
      this.$router.push({name: 'DoAccept',query: {id:item.id,tabs:true,isLable:false}})
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
    checkAuditStatus(status){
      if(status == '1'){
        return '/static/icon-xqjh.png'
      }else if(status == '2'){
        return '/static/icon-success.png'
      }else if(status == '3'){
        return '/static/icon-xqjh.png'
      }else if(status == '4'){
        return '/static/icon-return.png'
      }
        
    },
    tabsChange(){
      this.allRefresh();
    },
    //选择审核人回调
    optionsSuccess(assignee, { id, planType }) {
      materialCirculationTableRestSubmit({ ids: [id], planType: planType, assignee }).then(() => {
        this.$toast('提交审核成功')
        this.allRefresh()
      })
    },
    //去审核点击
    handleExamineClick(item) {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要提交审核吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs.activitiAssignee.init('SH', item)
      })
    },
    // 撤回
    recallClick ({id}) {
      this.$dialog.confirm({
        title: '标题',
        message: '是否确认撤回?',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then( () => {
        return recall({ businessId:id, businessType:'SHLC' })
      }).then(() => {
        this.$toast("撤回成功")
        this.getList()
      })
    },
    // 下载验收单
    downLoadAcceptanceOrder(item) {
    }
  }
}
</script>
<style lang="less" scoped>
.in-out-management-list {

  ::v-deep .van-tabs__wrap{
    margin-bottom: 10px !important;
    height: 44px !important;
  }

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
