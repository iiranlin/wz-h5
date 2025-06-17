<template>

  <div class="in-out-management-list">
    <div class="list-search-container">
      <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" background="#eef6ff" readonly
        @click="handeSearchClick()">
      </van-search>
      <van-dropdown-menu active-color="#028bff">
        <van-dropdown-item v-model="value1" :options="option1" />
      </van-dropdown-menu>
    </div>
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." @load="getAllList">

        <div v-for="(item, index) in 10" :key="index" class="box-container">
          <ul class="list-ul">
            <li v-if="[0, 3, 4, 5].includes(value1)">
              <span>入库单号：</span>
              <span @click="detailsClick('1')" class="li-span-click">RK2025050001</span>
            </li>
            <li>
              <span>收货单号：</span>
              <span @click="detailsClick('2')" class="li-span-click">SH2025050001</span>
            </li>
            <li>
              <span>需求名称：</span>
              <span>需求名称需求名称需求名称需求名称需求名称需求名称</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>施工单位名称（分部）</span>
            </li>
            <li>
              <span>供应商：</span>
              <span>供应商名称供应商名称供应商名称供应商名称供应商名称供应商名</span>
            </li>
            <li class="li-item-both">
              <div class="li-item-left">
                <span>收货时间：</span>
                <span>2025-04-20</span>
              </div>
              <div class="li-item-right">
                <span>入库时间：</span>
                <span>2025-04-20</span>
              </div>
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
      allRefreshLoading: false,
      allLoading: false,
      allFinished: false,
    };
  },
  created() {
  },
  activated() {
  },
  methods: {
    //全部列表刷新
    allRefresh() {
      this.allRefreshLoading = true
      this.allLoading = true
      this.allFinished = false
      this.getAllList()
    },
    getAllList() {
      this.allRefreshLoading = false
      this.allFinished = true
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
    detailsClick (key) {
      const objKey = {
        '1': () => {
          this.$router.push({ name: 'SubmitStore', query: {type: 'view'} })
        },
        '2': () => {
          // this.$router.push({ name: 'SubmitStore' })
        }
      }
      objKey && objKey[key]()
    }
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {

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


  ::v-deep .van-pull-refresh {
    height: calc(100vh - 150px);
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
}
</style>