<template>
  <div class="planned-management">
    <van-sticky class="planned-management-search">
      <van-search v-model="value" placeholder="请输入搜索关键词" background="#eef6ff" :show-action="showAction"
        @search="onSearch" @cancel="onCancel" @focus="onFocus" />
      <van-dropdown-menu active-color="#028bff">
        <van-dropdown-item v-model="value1" :options="option1" />
      </van-dropdown-menu>
      <van-button round @click="resetClick">重置</van-button>
    </van-sticky>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="(item, index) in list" :key="index" class="box-container">
        <ul class="list-ul" @click="handleWaitItemClick(item)">
          <li>
            <span class="font-weight">业需求ID：</span>
            <span class="font-weight">XQ2025050007</span>
          </li>
          <li>
            <span>需求名称：</span>
            <span>南京枢纽（江北地区）和南通地区工程2025年5月甲供物资需求计划表-04</span>
          </li>
          <li>
            <span>供应商：</span>
            <span>供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称</span>
          </li>
          <li>
            <span>物资名称：</span>
            <span>物资名称物资名称物资名称</span>
          </li>
          <li class="li-status">
            <van-tag type="primary" round size="medium" v-if="item == 1">未提交</van-tag>
            <van-tag type="primary" round size="medium" v-if="item == 2">已提交</van-tag>
            <van-tag type="primary" round size="medium" v-if="item == 3">已生效</van-tag>
            <van-tag type="primary" round size="medium" v-if="item == 4">修改后生效</van-tag>
            <van-tag type="danger" round size="medium" v-if="item == 5">已驳回</van-tag>
            <van-tag type="danger" round size="medium" v-if="item == 6">已撤回</van-tag>
            <van-tag type="primary" round size="medium" v-if="item == 7">供应中</van-tag>
            <van-tag type="primary" round size="medium" v-if="item == 8">收货完成</van-tag>
            <van-tag type="primary" round size="medium" v-if="item == 9">已入库</van-tag>
            <van-tag type="primary" round size="medium" v-if="item == 10" class="li-status-completed">已完成</van-tag>
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
    <van-icon name="plus" @click="addClick" />
    <back-to-top className=".planned-management"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
export default {
  name: 'PlannedManagement',
  components: { BackToTop },
  data() {
    return {
      value: '',
      showAction: false,
      list: [],
      loading: false,
      finished: false,
      value1: 0,
      option1: [
        { text: '需求状态', value: 0 },
      ],
      scrollTop1: 0,
    }
  },
  mounted() {
  },
  methods: {
    onSearch() {
      this.$toast(this.value);
    },
    onFocus() {
      // this.showAction = true;
    },
    onCancel() {
      // this.showAction = false;
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 500);
    },
    handleWaitItemClick() {
      this.$router.push({ name: 'RequirementDetails' })
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
    resetClick() {
      this.value = ''
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
    ::v-deep .van-sticky{
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
    padding-top: 10px;
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