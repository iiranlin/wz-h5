<template>
  <div class="planned-management">
    <van-sticky class="planned-management-search">
      <van-search v-model="searchValue" placeholder="请输入需求名称" background="#eef6ff" :show-action="showAction"
        @search="onSearch" />
      <van-dropdown-menu active-color="#028bff">
        <van-dropdown-item v-model="statusValue" :options="statusArr" @change="statusChange" />
      </van-dropdown-menu>
      <van-button round @click="resetClick">重置</van-button>
    </van-sticky>
    <div class="planned-management-list">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功" >
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
          <div v-for="(item, index) in list" :key="index" class="box-container">
            <ul class="list-ul" @click="handleWaitItemClick(item)">
              <li>
                <span class="font-weight">需求编号：</span>
                <span class="font-weight">{{ item.planNumber }}</span>
              </li>
              <li>
                <span>需求名称：</span>
                <span>{{ item.planName }}</span>
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
                <span>{{ parseTime(item.createDate, '{y}-{m}-{d} {h}:{s}') }}</span>
              </li>
              <li class="li-status">
                <template v-for="row in statusArr">
                  <van-tag :class="{'li-status-completed': row.value == '9'}" :type="['0', '5'].includes(row.value)?'danger' : 'primary'" round size="medium" :key="row.value" v-if="item.planStatus == row.value">{{ row.text }}</van-tag>
                </template>
              </li>
            </ul>
            <div class="list-ul-button">
              <van-button class="button-info" plain round type="info" v-if="['6', '7', '8', '9'].includes(item.planStatus)"
                @click="supplyOverviewClick(item)">供应概览</van-button>
              <van-button class="button-info" plain round type="info" v-if="['6', '7', '8', '9'].includes(item.planStatus)"
                @click="logisticsViewClick(item)">物流查看</van-button>
              <van-button class="button-info" plain round type="info" v-if="['2'].includes(item.planStatus)"
                @click="withdrawClick(item)">撤回</van-button>
              <van-button class="button-info" plain round type="danger" v-if="['1', '0', '5', '10'].includes(item.planStatus)"
                @click="deleteClick(item)">删除</van-button>
              <van-button class="button-info" plain round type="info" v-if="['3', '4', '0', '2'].includes(item.planStatus)"
                @click="handleProcessClick(item)">查看流程</van-button>
              <van-button class="button-info" plain round type="info" v-if="['1', '4', '0', '5', '10'].includes(item.planStatus)"
                @click="addClick(item)">编辑</van-button>
              <van-button class="button-info" round type="info" v-if="['1', '4', '0', '5', '10'].includes(item.planStatus)"
                @click="handleExamineClick(item)">提交审核</van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-icon name="plus" @click="addClick()" />
    <back-to-top className=".planned-management"></back-to-top>
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
import BackToTop from '@/components/BackToTop'
import { materialDemandPlanRestList, materialDemandPlanRestBatchRemove } from '@/api/prodmgr-inv/materialDemandPlanRest'
export default {
  name: 'PlannedManagement',
  mixins: [indexMixin],
  // dicts: ['JLDW'],
  components: { BackToTop },
  data() {
    return {
      searchValue: '',
      showAction: false,
      list: [],
      refreshLoading:false,
      loading: false,
      finished: false,
      error: false,
      statusValue: '',
      statusArr: [
        { text: '全部', value: '' },
        { text: '已驳回', value: '0' },
        { text: '未提交', value: '1' },
        { text: '已提交', value: '2' },
        { text: '已生效', value: '3' },
        { text: '修改后同意', value: '4' },
        { text: '已撤回', value: '5' },
        { text: '供应中', value: '6' },
        { text: '收货完成', value: '7' },
        { text: '已入库', value: '8' },
        { text: '已完成', value: '9' },
        { text: '已退回', value: '10' },
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      }
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
    statusChange () {
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
      // console.log(this.listQuery.pageNum++)
      // this.listQuery.pageNum
      this.materialDemandPlanRestList()
    },
    getList () {
      this.refreshLoading = true
      this.listQuery.pageNum = 1
      this.materialDemandPlanRestList()
    },
    materialDemandPlanRestList () {
      if (this.refreshLoading) {
        this.list = [];
        this.refreshLoading = false;
      }
      const params = {
        pageStatus: '0',
        planStatus: this.statusValue,
        planName: this.searchValue,
        ...this.listQuery
      }
      materialDemandPlanRestList(params).then( ({data}) => {
        this.list.push(...(data.list || []))
        // 数据全部加载完成
        if (this.list.length >= data.total) {
          this.finished = true
          return
        }
        this.listQuery.pageNum++
      }).catch(() => {
        this.finished = true
        this.error = true
      }).finally( (err) => {
        this.loading = false
      })
    },
    //列表刷新
    onRefresh(){
      this.refreshLoading = true
      this.loading = true
      this.finished = false
      this.listQuery.pageNum = 1
      this.onLoad();
    },
    handleWaitItemClick(item) {
      this.$router.push({ name: 'RequirementDetails', query: {id: item.id} })
    },
    addClick(item) {
      if(item){
        this.$router.push({ name: 'SaveMaterials', query: {id: item.id, type: 'update'} })
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
    handleExamineClick() {
      this.$router.push({
        name: "MyToDoDetail",
        params: {
          type: '0',
        },
      });
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
        title: '标题',
        message: '确认要删除吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        materialDemandPlanRestBatchRemove({ids: [item.id]}).then( ({message}) => {
          this.$toast(message)
          this.refreshLoading = true
          this.listQuery.pageNum = 1
          this.materialDemandPlanRestList()
        })
      })
    },
    withdrawClick(item) {
      this.handleWithdraw({ businessId: item.id, businessType: item.planType == 1 ? 'FBYLXQ' : 'YLXQ'})
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

  .van-search {
    flex: 1;

    .van-search__content {
      border-radius: 50px;
      background: #fff;
    }

    .van-cell {
      border-radius: 50px;
      background: #fff;
    }
  }
  .planned-management-list{
    height: 100%;
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