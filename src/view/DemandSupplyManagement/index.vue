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
        </div>
        <van-tabs v-model="statusValue" color="#0571ff" background="#ffffff" title-active-color="#0571ff"
          title-inactive-color="#2e2e2e" @change="statusChange">
          <van-tab v-for="item in statusArr" :title="item.text" :name="item.value" :key="item.value">
          </van-tab>
        </van-tabs>
      </van-sticky>
    </div>
    <div class="planned-management-list">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error"
          error-text="请求失败，点击重新加载" @load="onLoad">
          <div v-for="(item, index) in list" :key="index" class="box-container">
            <div class="list-title-content">
              <span class="li-span-grey">需求编号：</span>
              <span class="li-span-grey">{{ item.planNumber }}</span>
              <div class="li-title-status">
                <img v-if="checkStatusText(item.status)" :src="checkAuditStatus(item.status)" />
                <span>{{ checkStatusText(item.status) }}</span>
              </div>
            </div>
            <ul class="list-ul" @click="handleWaitItemClick(item)">
              <li>
                <span class="font-weight">{{ item.planName }}</span>
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
                <span>建设项目：</span>
                <span>{{ item.projectName }}</span>
              </li> 
              <li>
                <span>标段项目：</span>
                <span>{{ item.sectionName }}</span>
              </li>
              <li>
                <span>提报时间：</span>
                <span>{{ item.createDate && parseTime(item.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
              </li>
            </ul>
            <div class="list-ul-button">
              <van-button class="button-info" plain round type="info"
                v-if="!['0', '2'].includes(item.status)"
                @click="supplyOverviewClick(item)">供应概览</van-button>
              <van-button class="button-info" plain round type="info"
                v-if="!['0', '2'].includes(item.status)"
                @click="logisticsViewClick(item)">物流查看</van-button>
              <van-button class="button-info" plain round type="info" v-if="['2'].includes(item.status)"
                @click="withdrawClick(item)">撤回</van-button>
              <van-button class="button-info" round type="info" v-if="['0'].includes(item.status)">退回经办人</van-button>
              <van-button class="button-info" round type="info" v-if="['0'].includes(item.status)">提交供应商</van-button>
              <van-button class="button-info" round type="info" @click="fileDownLoadStream(item)">下载需求计划表</van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <back-to-top :className="className"></back-to-top>
    <file-preview ref="filePreview"></file-preview>
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
import BackToTop from '@/components/BackToTop'
import activitiAssignee from '@/components/activitiAssignee'
import { materialDemandPlanRestList, downloadPlan } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { getUserInfo } from '@/utils/user-info'
import FilePreview from "@/components/FilePreview.vue"
export default {
  name: 'DemandSupplyManagement',
  mixins: [indexMixin],
  components: { BackToTop, activitiAssignee, FilePreview },
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
        { text: '全部', value: '' },
        { text: '未提交', value: '0' },
        { text: '未确认', value: '2' },
        { text: '已确认', value: '3' },
        { text: '供货中', value: '4' },
        { text: '已完成', value: '9' },
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
  created () {
    if(this.$route.meta.plannedManagementIndex){
      this.statusValue = this.$route.meta.plannedManagementIndex
    }
  },
  mounted() {
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
        pageStatus: '1',
        status: this.statusValue,
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
    supplyOverviewClick(item) {
      this.$router.push({ name: 'SupplyOverview', query: { id: item.id } })
    },
    logisticsViewClick(item) {
      this.$router.push({ name: 'LogisticsView', query: { id: item.id } })
    },
    withdrawClick(item) {
      this.handleWithdraw({ businessId: item.id, businessType: item.planType == 1 ? 'FBYLXQ' : 'YLXQ' })
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
      if (status == '0') {
        return '/static/icon-reject.png'
      } else if (['5', '10'].includes(status)) {
        return '/static/icon-return.png'
      } else if (['1', '2', '6'].includes(status)) {
        return '/static/icon-xqjh.png'
      } else {
        return '/static/icon-success.png'
      }
    },
    fileDownLoadStream (item) {
        downloadPlan(item.id)
      let userAgent = navigator.userAgent
      // if(/Android|adr/gi.test(userAgent)){
      //   downloadPlan(item.id)
      // }
    }
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

    .list-ul-li-span{
      display: flex;
      white-space: normal;
      justify-content: flex-end;
      span{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      img{
        flex: none;
        width: 24px;
        height: 24px;
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