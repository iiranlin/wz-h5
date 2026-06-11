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
            <template slot="action">
              <span class="search-action" @click="handleExport">导出</span>
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
    <div class="planned-management-list" v-if="list.length > 0">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" :error.sync="error"
          error-text="请求失败，点击重新加载" @load="onLoad">
          <div v-for="(item, index) in list" :key="index" class="box-container">
            <div class="list-title-content">
              <span class="li-span-grey">需求编号：</span>
              <span class="li-span-grey">{{ item.planNumber }}</span>
              <div class="li-title-status">
                <img v-if="checkStatusText(item.status)" :src="checkAuditStatus(item.status)" />
                <span :style="handlerTextColor(statusArr, 'value', String(item.status))">{{ checkStatusText(item.status) }}</span>
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
                <span>{{ item.sectionName }}</span>
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
                <span>提报时间：</span>
                <span>{{ item.createDate && parseTime(item.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
              </li>
              <li>
                <span>确认消息：</span>
                <span>{{ item.confirmValidate || '--' }}</span>
              </li>
            </ul>
            <div class="list-ul-button">
              <van-button class="button-info" plain round type="info"
                v-if="isSupplyActionVisible(item)"
                @click="supplyOverviewClick(item)">供应概览</van-button>
              <van-button class="button-info" plain round type="info"
                v-if="isSupplyActionVisible(item)"
                @click="logisticsViewClick(item)">物流查看</van-button>
              <van-button class="button-info" plain round type="info" v-if="['2'].includes(String(item.status))"
                @click="recallClick(item)">撤回</van-button>
              <van-button class="button-info" round v-if="['0'].includes(String(item.status))" @click="returnClick(item)">退回经办人</van-button>
              <van-button class="button-info" plain round type="info" v-if="['0'].includes(String(item.status))" @click="submitClick(item)">提交供应商</van-button>
              <van-button class="button-info" round type="info" @click="fileDownLoadStream(item)">下载需求计划表</van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="planned-management-empty" v-else>
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
        <van-empty image="/empty-image-default.png" description="暂无数据" />
      </van-pull-refresh>
    </div>
    <back-to-top :className="className"></back-to-top>
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
import BackToTop from '@/components/BackToTop'
import { materialDemandPlanRestList, recall } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { customDownload } from '@/api/prodmgr-inv/file'
export default {
  name: 'DemandSupplyManagement',
  mixins: [indexMixin],
  components: { BackToTop },
  beforeRouteLeave (to, from, next) {
    from.meta.plannedManagementIndex = this.statusValue
    this.$store.dispatch('public/setScrollPosition', {[from.name]: document.querySelector(this.className).scrollTop})
    next()
  },
  data() {
    return {
      searchValue: '',
      showAction: true,
      list: [],
      refreshLoading: false,
      loading: false,
      finished: false,
      error: false,
      total: 0,
      statusValue: '',
      statusArr: [
        { text: '全部', value: '', color: '' },
        { text: '未提交', value: '0', color: '#134daa' },
        { text: '未确认', value: '2', color: '#134daa' },
        { text: '已确认', value: '3', color: '#51CA40' },
        { text: '供货中', value: '4', color: '#134daa' },
        { text: '已完成', value: '5', color: '#51CA40' },
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      className: '.planned-management',

    }
  },
  created () {
    if(this.$route.meta.plannedManagementIndex){
      this.statusValue = this.$route.meta.plannedManagementIndex
    }
  },
  mounted() {
    this.getList()
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
        this.finished = false
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
        const rows = data.list || []
        this.total = data.total || 0
        this.list.push(...rows)
        this.listQuery.pageNum++
        // 数据全部加载完成
        if (!rows.length || this.list.length >= this.total) {
          this.finished = true
          return
        }else{
          this.finished = false
        }
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
      this.$router.push({ name: 'RequirementDetails', query: { id: item.id, name: 'DemandSupplyManagement' } })
    },
    supplyOverviewClick(item) {
      this.$router.push({ name: 'SupplyOverview', query: { id: item.id } })
    },
    logisticsViewClick(item) {
      this.$router.push({ name: 'LogisticsView', query: { id: item.id } })
    },
    checkStatusText(status) {
      let name = ''
      const statusValue = String(status)
      this.statusArr.forEach(item => {
        if (item.value === statusValue) {
          name = item.text
        }
      })
      return name
    },
    checkAuditStatus(status) {
      if (status == '0') {
        return '/static/newIcon_notfiled.png'
      } else if (status == '2') {
        return '/static/newIcon_unconfirmed.png'
      } else if (status == '3') {
        return '/static/newIcon_confirmed.png'
      } else if (status == '4') {
        return '/static/newIcon_Supply.png'
      } else {
        return '/static/newIcon_done.png'
      }
    },
    recallClick ({id}) {
      this.$dialog.confirm({
        message: '是否确认撤回?',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then( () => {
        return recall({ id })
      }).then(() => {
        this.$toast("撤回成功")
        this.getList()
      })
    },
    returnClick (item) {
      this.$router.push({name: 'ReturnHandledBy', query: {id: item.id}})
    },
    submitClick (item) {
      this.$router.push({name: 'SubmitSupplier', query: {id: item.id}})
    },
    isSupplyActionVisible(item) {
      return [ '4', '5'].includes(String(item.status))
    },
    async fileDownLoadStream (item) {
      try {
        await customDownload({ businessType: 1, businessData: item.id })
      } catch (error) {
        this.$toast('下载失败')
      }
    },
    async handleExport () {
      const params = {
        pageStatus: '1',
        status: this.statusValue,
        queryField: this.searchValue,
        idList: null
      }
      try {
        await customDownload({ businessType: 131, businessData: JSON.stringify(params) })
      } catch (error) {
        this.$toast('导出失败')
      }
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

    .search-action {
      display: inline-block;
      padding: 0 12px 0 4px;
      color: #0571ff;
      font-size: 14px;
      line-height: 34px;
    }
  }

  .planned-management-list {
    flex: 1;
  }

  .planned-management-empty {
    flex: 1;
    background: #f8f8f8;
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
