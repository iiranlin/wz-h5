<template>
  <div class="planned-management">
    <van-sticky class="planned-management-search">
      <van-search v-model="searchValue" placeholder="请输入搜索关键词" background="#eef6ff" :show-action="showAction"
        @search="onSearch" @cancel="onCancel" @focus="onFocus" />
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
              <li class="li-status">
                <van-tag type="primary" round size="medium" v-if="item.status == '0'">未提交</van-tag>
                <van-tag type="primary" round size="medium" v-if="item.status == 2">已提交</van-tag>
                <van-tag type="primary" round size="medium" v-if="item.status == 3">已生效</van-tag>
                <van-tag type="primary" round size="medium" v-if="item.status == 4">修改后生效</van-tag>
                <van-tag type="danger" round size="medium" v-if="item.status == 5">已驳回</van-tag>
                <van-tag type="danger" round size="medium" v-if="item.status == 6">已撤回</van-tag>
                <van-tag type="primary" round size="medium" v-if="item.status == 7">供应中</van-tag>
                <van-tag type="primary" round size="medium" v-if="item.status == 8">收货完成</van-tag>
                <van-tag type="primary" round size="medium" v-if="item.status == 9">已入库</van-tag>
                <van-tag type="primary" round size="medium" v-if="item.status == 10" class="li-status-completed">已完成</van-tag>
              </li>
            </ul>
            <div class="list-ul-button">
              <van-button class="button-info" plain round type="info" v-if="[7, 8, 9, 10].includes(item)"
                @click="supplyOverviewClick">供应概览</van-button>
              <van-button class="button-info" plain round type="info" v-if="[7, 8, 9, 10].includes(item)"
                @click="logisticsViewClick">物流查看</van-button>
              <van-button class="button-info" plain round type="info" v-if="[2].includes(item)"
                @click="withdrawClick">撤回</van-button>
              <van-button class="button-info" plain round type="danger" v-if="[1, 5, 6].includes(item)"
                @click="deleteClick">删除</van-button>
              <van-button class="button-info" plain round type="info" v-if="[2, 3, 4, 5].includes(item)"
                @click="handleProcessClick">查看流程</van-button>
              <van-button class="button-info" plain round type="info" v-if="[1, 4, 5, 6].includes(item)"
                @click="addClick">编辑</van-button>
              <van-button class="button-info" round type="info" v-if="[1, 4, 5, 6].includes(item)"
                @click="handleExamineClick">提交审核</van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-icon name="plus" @click="addClick" />
    <back-to-top className=".planned-management"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import { materialDemandPlanRestList } from '@/api/prodmgr-inv/materialDemandPlanRest'
export default {
  name: 'PlannedManagement',
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
        { text: '未提交', value: '0' },
        { text: '未确认', value: '2' },
        { text: '已确认', value: '3' },
        { text: '供货中', value: '4' },
      ],
      scrollTop1: 0,
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
      // this.$toast(this.searchValue);
      this.refreshLoading = true
      this.listQuery.pageNum = 1
      this.materialDemandPlanRestList()
    },
    onFocus() {
      // this.showAction = true;
    },
    onCancel() {
      // this.showAction = false;
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
      this.materialDemandPlanRestList()
    },
    materialDemandPlanRestList () {
      if (this.refreshLoading) {
        this.list = [];
        this.refreshLoading = false;
      }
      const params = {
        status: this.statusValue,
        planName: this.searchValue,
        ...this.listQuery
      }
      materialDemandPlanRestList(params).then( ({data}) => {
        this.list.push(...(data.list || []))
        // 数据全部加载完成
        if (this.list.length >= data.total) {
          this.finished = true
        }
      }).catch(() => {
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
    addClick() {
      this.$router.push({ name: 'RequirementFilling' })
    },
    supplyOverviewClick() {
      this.$router.push({ name: 'SupplyOverview' })
    },
    logisticsViewClick() {
      this.$router.push({ name: 'LogisticsView' })
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
    handleProcessClick() {
      this.$router.push({
        name: "MyProcess",
        params: {
        },
      });
    },
    deleteClick() {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要删除吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$toast('删除成功');
      }).catch(() => {
      });
    },
    withdrawClick() {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要撤回吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$toast('撤回成功');
      }).catch(() => {
      });
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