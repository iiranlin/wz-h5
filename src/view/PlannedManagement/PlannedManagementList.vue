<template>
  <div class="planned-management">
    <div class="planned-management-top">
      <van-sticky>
        <div class="planned-management-search">
          <van-search v-model="searchValue" placeholder="输入关键字搜索" left-icon="none" shape="round" :show-action="showAction"
            @search="onSearch">
            <template slot='right-icon'>
              <van-icon name="search" @click="statusChange()" />
            </template>
          </van-search>
          <!-- <van-dropdown-menu active-color="#028bff">
            <van-dropdown-item v-model="statusValue" :options="statusArr" @change="statusChange" />
          </van-dropdown-menu>
          <van-button round @click="resetClick">重置</van-button> -->
        </div>
        <van-tabs v-model="statusValue" color="#0571ff" background="#ffffff" title-active-color="#0571ff"
          title-inactive-color="#2e2e2e" @change="statusChange">
          <van-tab v-for="item in statusArr" :title="item.text" :name="item.value" :key="item.value">
          </van-tab>
        </van-tabs>
      </van-sticky>
    </div>
    <div class="planned-management-list" v-if="list.length > 0">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" :error.sync="error"
          error-text="请求失败，点击重新加载" @load="onLoad">
          <div v-for="(item, index) in list" :key="index" class="box-container">
            <div class="list-title-content">
              <span class="li-span-grey">需求编号：</span>
              <span class="li-span-grey">{{ item.planNumber }}</span>
              <div class="li-title-status">
                <img :src="checkAuditStatus(item.planStatus)" />
                <span :style="handlerTextColor(statusArr, 'value', item.planStatus)">{{ checkStatusText(item.planStatus) }}</span>
              </div>
            </div>
            <ul class="list-ul" @click="handleWaitItemClick(item)">
              <li>
                <span class="font-weight">{{ item.planName }}</span>
              </li>
              <li>
                <span>建设项目：</span>
                <span>{{ item.projectName }}</span>
              </li> 
              <li>
                <span>标段项目：</span>
                <span>{{ item.sectionShortName }}</span>
              </li>
              <li>
                <span>供应商：</span>
                <span>{{ item.sellerName }}</span>
              </li>
              <li>
                <span>物资名称：</span>
                <span>{{ item.materialName }}</span>
              </li>
              <li>
                <span>提报人：</span>
                <span>{{ item.createUserName }}</span>
              </li>
              <li>
                <span>提报时间：</span>
                <span>{{ parseTime(item.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
              </li>
              <li>
                <span>供应时间：</span>
                <span>{{ parseTime(item.supplyDate, '{y}-{m}-{d}') }}</span>
              </li>
            </ul>
            <div class="list-ul-button">
              <van-button class="button-info" plain round type="info"
                v-if="['6', '7', '8', '9'].includes(item.planStatus)"
                @click="supplyOverviewClick(item)">供应概览</van-button>
              <van-button class="button-info" plain round type="info"
                v-if="['6', '7', '8', '9'].includes(item.planStatus)"
                @click="logisticsViewClick(item)">物流查看</van-button>
              <van-button class="button-info" plain round type="info" v-if="['2'].includes(item.planStatus) && isJL"
                @click="withdrawClick(item)">撤回</van-button>
              <van-button class="button-info" plain round type="danger"
                v-if="['1', '0', '5', '10'].includes(item.planStatus) && isJL" @click="deleteClick(item)">删除</van-button>
              <van-button class="button-info" plain round type="info"
                v-if="['3', '4', '0', '2'].includes(item.planStatus)"
                @click="handleProcessClick(item)">查看流程</van-button>
              <van-button class="button-info" plain round type="default"
                v-if="['1', '4', '0', '5', '10'].includes(item.planStatus) && isJL" @click="addClick(item)">编辑</van-button>
              <van-button class="button-info" round type="info"
                v-if="['1', '4', '0', '5', '10'].includes(item.planStatus) && isJL"
                @click="handleExamineClick(item)">提交审核</van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div v-if="list.length == 0">
        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
          <van-empty image="/empty-image-default.png" description="暂无数据" />

        </van-pull-refresh>
      </div>
    <van-icon name="plus" @click="addClick()" v-if="isJL"/>
    <back-to-top :className="className"></back-to-top>
    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
import BackToTop from '@/components/BackToTop'
import activitiAssignee from '@/components/activitiAssignee'
import { materialDemandPlanRestList, materialDemandPlanRestBatchRemove, materialDemandPlanRestSubmit } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { getUserInfo } from '@/utils/user-info'
export default {
  name: 'PlannedManagementList',
  mixins: [indexMixin],
  components: { BackToTop, activitiAssignee },
  beforeRouteLeave (to, from, next) {
    from.meta.plannedManagementIndex = this.statusValue
    this.$store.dispatch('public/setScrollPosition', {[from.name]: document.querySelector(this.className).scrollTop})
    next()
  },
  data() {
    return {
      searchValue: '',
      showAction: false,
      list: [],
      refreshLoading: false,
      loading: false,
      finished: false,
      error: false,
      statusValue: '',
      statusArr: [
        { text: '全部', value: '', imgPath: '' },
        { text: '已驳回', value: '0', imgPath: '/static/newIcon_Rejected.png' },
        { text: '未提交', value: '1', imgPath: '/static/newIcon_notfiled.png' },
        { text: '审核中', value: '2', imgPath: '/static/newIcon_audit.png' },
        { text: '已生效', value: '3', imgPath: '/static/newIcon_tookEffect.png' },
        { text: '修改后同意', value: '4', imgPath: '/static/newIcon_alterAgree.png' },
        // { text: '已撤回', value: '5', imgPath: '/static/newIcon_Withdrawn.png' },
        { text: '供应中', value: '6', imgPath: '/static/newIcon_Supplying.png' },
        { text: '收货完成', value: '7', imgPath: '/static/newIcon_received.png' },
        { text: '已入库', value: '8', imgPath: '/static/newIcon_Storage.png' },
        { text: '已完成', value: '9', imgPath: '/static/newIcon_done.png' },
        { text: '已退回', value: '10', imgPath: '/static/newIcon_Returned.png' },
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      businessCode: { '1': 'FBYLXQ', '2': 'FBYLJH', '3': 'YLXQ', '4': 'YLJH' },
      className: '.planned-management',
      userInfo: getUserInfo(),

    }
  },
	computed: {
    isJL() {
      const deptCode = this.userInfo.deptCode
      return !deptCode.startsWith('JL')
    }
  },
  created () {
    if(this.$route.meta.plannedManagementIndex){
      this.statusValue = this.$route.meta.plannedManagementIndex
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    onSearch() {
      this.refreshLoading = true
      this.listQuery.pageNum = 1
      this.materialDemandPlanRestList()
    },
    statusChange() {
      this.refreshLoading = true
      this.listQuery.pageNum = 1
      this.materialDemandPlanRestList()
    },
    resetClick() {
      this.refreshLoading = true
      this.statusValue = ''
      this.searchValue = ''
      this.listQuery.pageNum = 1
      this.materialDemandPlanRestList()
    },
    onLoad() {
      this.materialDemandPlanRestList()
    },
    getList() {
      this.refreshLoading = true
      this.listQuery.pageNum = 1
      this.materialDemandPlanRestList()
    },
    materialDemandPlanRestList() {
      this.error = false
      if (this.refreshLoading) {
        this.list = [];
        this.refreshLoading = false;
      }
      const params = {
        pageStatus: '0',
        planStatus: this.statusValue,
        queryField: this.searchValue,
        ...this.listQuery
      }
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialDemandPlanRestList(params).then(({ data }) => {
        this.list.push(...(data.list || []))
        // 数据全部加载完成
        if (this.list.length >= data.total) {
          this.finished = true
          return
        }else{
          this.finished = false
        }
        this.listQuery.pageNum++
      }).catch(() => {
        this.finished = true
        this.error = true
      }).finally((err) => {
        this.loading = false
        toast.clear()
        this.scrollPositionInit(this.className, this.finished)
      })
    },
    //列表刷新
    onRefresh() {
      this.refreshLoading = true
      this.loading = true
      this.listQuery.pageNum = 1
      this.onLoad();
    },
    handleWaitItemClick(item) {
      this.$router.push({ name: 'RequirementDetails', query: { id: item.id } })
    },
    addClick(item) {
      this.$store.dispatch('public/setMateriaList', [])
      this.$store.dispatch('public/setInterfaceMateriaList', [])
      this.$store.dispatch('public/setDemandPlanningInfo', {})
      if (item) {
        this.$router.push({ name: 'SaveMaterials', query: { id: item.id, contractId: item.contractId, type: 'update' } })
        return
      }
      // this.$router.push({ name: 'RequirementFilling' })
      this.$router.push({ name: 'SelectContract' })
    },
    supplyOverviewClick(item) {
      this.$router.push({ name: 'SupplyOverview', query: { id: item.id } })
    },
    logisticsViewClick(item) {
      this.$router.push({ name: 'LogisticsView', query: { id: item.id } })
    },
    //去审核点击
    handleExamineClick(item) {
      this.$dialog.confirm({
        message: '确认要提交审核吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs.activitiAssignee.init(this.businessCode[item.planType], item)
      })
    },
    //选择审核人回调
    optionsSuccess(assignee, { id, planType }) {
      materialDemandPlanRestSubmit({ ids: [id], planType: planType, assignee }).then(() => {
        this.$toast('提交审核成功')
        this.getList()
      })
    },
    //查看流程点击
    handleProcessClick(item) {
      this.$router.push({
        name: "MyProcess",
        params: {
          businessId: item.id
        },
      });
    },
    deleteClick(item) {
      this.$dialog.confirm({
        message: '确认要删除吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        materialDemandPlanRestBatchRemove({ ids: [item.id] }).then(({ message }) => {
          this.$toast(message)
          this.refreshLoading = true
          this.listQuery.pageNum = 1
          this.materialDemandPlanRestList()
        })
      })
    },
    withdrawClick(item) {
      this.handleWithdraw({ businessId: item.id, businessType: 'YLXQ' })
    },
    checkStatusText(status) {
      let name = ''
      this.statusArr.forEach(item => {
        if (item.value === status) {
          name = item.text
        }
      })
      return name
    },
    checkAuditStatus(status) {
      // 获取状态对应图片路径
      let imgPath = this.statusArr.find(el => {
        return el.value === status
      })?.imgPath || "";

      return imgPath;
      // if (status == '0') {
      //   return '/static/icon-reject.png'
      // } else if (['5', '10'].includes(status)) {
      //   return '/static/icon-return.png'
      // } else if (['1', '2', '6'].includes(status)) {
      //   return '/static/icon-xqjh.png'
      // } else {
      //   return '/static/icon-success.png'
      // }

    },
  }
}
</script>
<style lang="less" scoped>
.planned-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

  .planned-management-search {
    ::v-deep .van-sticky {
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      background: #eef6ff;
    }

    .van-button--round {
      width: 60px;
      height: 32px;
      margin-top: 10px;
      margin-left: 5px;
      margin-right: 10px;

      .van-button__text {
        font-size: 12px;
      }
    }
  }

  // .van-search {
  //   flex: 1;

  //   .van-search__content {
  //     border-radius: 50px;
  //     background: #fff;
  //   }

  //   .van-cell {
  //     border-radius: 50px;
  //     background: #fff;
  //   }
  // }

  .planned-management-list {
    flex: 1;
  }

  ::v-deep .van-dropdown-menu__bar {
    border-radius: 50px;
    width: 90px;
    height: 32px;
    margin-top: 10px;
    font-size: 12px;
    box-shadow: inherit;

    .van-dropdown-menu__title {
      font-size: 12px;
    }

  }


  .van-list {
    // padding-top: 10px;
    background: #f8f8f8;

    .list-ul-button {
      .button-info {
        width: auto;
      }
    }

    .li-status {
      .van-tag--primary {
        color: #028bff;
        background: #edf4ff;
      }

      .van-tag--danger {
        color: #f83738;
        background: #ffe2e2;
      }

      .li-status-completed {
        color: #6f6f6f;
        background: #ededed;
      }
    }
  }
}

.van-icon-plus {
  position: fixed;
  right: 20px;
  bottom: 150px;
  z-index: 999;
  width: 30px;
  height: 30px;
  background: #1989fa;
  border-radius: 30px;
  border: 1px solid #1989fa;
  text-align: center;
  line-height: 30px;
  color: #fff;
}
</style>