<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" background="#eef6ff" readonly
          @click="handeSearchClick()">
        </van-search>
        <van-dropdown-menu active-color="#028bff">
          <van-dropdown-item v-model="value1" :options="option1" />
        </van-dropdown-menu>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了..." @load="onLoad">

        <div v-for="(item, index) in dataList" :key="index" class="box-container">
          <ul class="list-ul"  @click="detailsClick('1')">
            <li v-if="[0, 3, 4, 5].includes(value1)">
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
              <span>{{ item.storeDate?parseTime(item.storeDate, '{y}-{m}-{d} {h}:{s}'):'' }}</span>
            </li>
            <li class="li-status" v-if="value1 == 0">
              <template v-for="items in option1">
                <van-tag plain round size="medium" :key="items.value" v-if="items.value != 0 && item == items.value">{{ items.text }}</van-tag>
              </template>
              <!-- <van-tag type="primary" round size="medium" v-if="item == 2">审核中</van-tag>
              <van-tag type="primary" round size="medium" v-if="item == 3">已生效</van-tag> -->
            </li>
          </ul>
          <div class="list-ul-button">
            <van-button class="button-info" plain round type="info" @click="handleProcessClick">查看流程</van-button>
            <van-button class="button-info" plain round type="info" @click="withdrawClick">撤回</van-button>
            <van-button class="button-info" round type="info" @click="submitStore">入库</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { listStore } from '@/api/prodmgr-inv/materialCirculationTableRest'
export default {
  name: 'InListContent',
  data() {
    return {
      activeIndex: 0,
      formData: {
        keywords: ''
      },
      value1: 0,
      option1: [
        { text: '全部', value: 0 },
        { text: '未入库', value: 1 },
        { text: '审核中', value: 2 },
        { text: '已入库', value: 3 },
        { text: '部分入库', value: 4 },
        { text: '已退货', value: 5 },
        { text: '已驳回', value: 6 }
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
    listStore () {
      if (this.refreshLoading) {
        this.dataList = []
        this.refreshLoading = false
      }
      const params = {
        ...this.listQuery
      }
      listStore(params).then( ({data}) => {
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
      }).finally( (err) => {
        this.loading = false
      })
    },
    submitStore () {
      this.$router.push({ name: 'SubmitStore', query: {type: 'submit'} })
    },
    withdrawClick () {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要撤回吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$toast('撤回成功');
      }).catch(() => {
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
    detailsClick (key, item) {
      const objKey = {
        '1': () => {
          this.$router.push({ name: 'SubmitStore', query: {type: 'view'} })
        },
        '2': () => {
          this.$router.push({ name: 'DoAcceptDetail', query: {id: item.id}  })
        }
      }
      objKey && objKey[key]()
    }
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {
  ::v-deep .van-sticky--fixed{
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