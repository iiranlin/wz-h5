<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.planName" placeholder="输入关键字搜索" shape="round" background="#eef6ff"
          @search="handeSearch()">
        </van-search>
        <van-dropdown-menu active-color="#028bff">
          <van-dropdown-item v-model="formData.storeStatus" :options="statusArr" @change="statusChange" />
        </van-dropdown-menu>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了..." @load="onLoad">

        <div v-for="(item, index) in dataList" :key="index" class="box-container">
          <ul class="list-ul" @click="detailsClick('1', item)">
            <li>
              <span class="font-weight">入库单号：</span>
              <span class="font-weight">{{ item.storeNumber }}</span>
            </li>
            <li>
              <span>收货单号：</span>
              <span @click.stop="detailsClick('2', item)" class="li-span-click">{{ item.takeNumber }}</span>
            </li>
            <li>
              <span>需求名称：</span>
              <span>{{ item.planName }}</span>
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
              <span>收货时间：</span>
              <span>{{ parseTime(item.takeDate, '{y}-{m}-{d} {h}:{s}') }}</span>
            </li>
            <li>
              <span>入库时间：</span>
              <span>{{ item.storeDate ? parseTime(item.storeDate, '{y}-{m}-{d} {h}:{s}') : '' }}</span>
            </li>
            <li class="li-status" v-if="formData.storeStatus == ''">
              <template v-for="items in statusArr">
                <van-tag plain round size="medium" :key="items.value" v-if="items.storeStatus != 0 && item.storeStatus == items.storeStatus">{{ items.text }}</van-tag>
              </template>
              <!-- <van-tag type="primary" round size="medium" v-if="item == 2">审核中</van-tag>
              <van-tag type="primary" round size="medium" v-if="item == 3">已生效</van-tag> -->
            </li>
          </ul>
          <div class="list-ul-button">
            <van-button class="button-info" plain round type="info" @click="handleProcessClick(item)" v-if="item.storeStatus != '1'">查看流程</van-button>
            <van-button class="button-info" plain round type="info" @click="withdrawClick(item)" v-if="item.storeStatus == '5'">撤回</van-button>
            <van-button class="button-info" round type="info" @click="submitStore(item)" v-if="item.storeStatus == '1' || item.storeStatus == '6'">入库</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { listStore } from '@/api/prodmgr-inv/materialCirculationTableRest'
import { recall } from '@/api/prodmgr-inv/audit'
export default {
  name: 'InListContent',
  data() {
    return {
      activeIndex: 0,
      formData: {
        planName: '',
        storeStatus: ''
      },
      statusArr: [
        { value: '', text: '全部' },
        { value: "1", text: "未入库" },
        { value: "2", text: "部分退货" },
        { value: "3", text: "已入库" },
        { value: "4", text: "已退货" },
        { value: "5", text: "审核中" },
        { value: "6", text: "已驳回" }
      ],
      refreshLoading: false,
      loading: false,
      finished: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      dataList: []
    };
  },
  created() {
  },
  activated() {
  },
  methods: {
    handeSearch() {
      this.onRefresh()
    },
    statusChange() {
      this.onRefresh()
    },
    //列表刷新
    onRefresh() {
      this.refreshLoading = true
      this.loading = true
      this.finished = false
      this.listQuery.pageNum = 1
      this.listStore()
    },
    onLoad() {
      this.listStore()
    },
    listStore() {
      if (this.refreshLoading) {
        this.dataList = []
        this.refreshLoading = false
      }
      const params = {
        ...this.listQuery,
        ...this.formData
      }
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      })
      listStore(params).then(({ data }) => {
        this.dataList.push(...(data.list || []))
        // 数据全部加载完成
        if (this.dataList.length >= data.total) {
          this.finished = true
          return
        }
        this.listQuery.pageNum++
      }).catch(() => {
        this.finished = true
        this.error = true
      }).finally((err) => {
        this.loading = false
        toast.clear()
      })
    },
    submitStore(item) {
      this.$router.push({ name: 'SubmitStore', query: { type: 'submit', id: item.id, supplyId: item.planId, storeStatus: item.storeStatus } })
    },
    withdrawClick(item) {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要撤回吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then( () => {
        return recall({ businessId: item.id,businessType:'RK' });
      }).then(() => {
        this.$toast('撤回成功');
      })
    },
    //查看流程点击
    handleProcessClick(item) {
      this.$router.push({name: "MyProcess", params: { businessId: item.id }})
    },
    detailsClick(key, item) {
      const objKey = {
        '1': () => {
          if(item.storeNumber){
            this.$router.push({ name: 'SubmitStore', query: { type: 'view', id: item.id, supplyId: item.planId, storeStatus: item.storeStatus } })
          }else{
            this.$toast('入库完成才能查看详情');
          }
        },
        '2': () => {
          this.$router.push({ name: 'DoAcceptDetail', query: { id: item.id } })
        }
      }
      objKey && objKey[key]()
    }
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {
  ::v-deep .van-sticky--fixed {
    top: 44px !important;
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
}
</style>