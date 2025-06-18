<template>
  <div class="select-Contract">
    <van-sticky class="select-Contract-search">
      <van-search v-model="value" placeholder="请输入搜索关键词" background="#f8f8f8" :show-action="showAction"
        @search="onSearch" @cancel="onCancel" @focus="onFocus" />
      <p class="select-Contract-p">请选择合同</p>
    </van-sticky>
    <div class="select-Contract-list">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-radio-group v-model="radio">
            <van-radio :name="index + ''" v-for="(item, index) in list" :key="index">
              <ul class="list-ul">
                <li>
                  <span class="font-weight">合同名称：</span>
                  <span class="font-weight">新建南京至淮安城泳铁路第二批建管甲供物资采购会</span>
                </li>
                <li>
                  <span>合同编号：</span>
                  <span>NHTL-2024-001</span>
                </li>
                <li>
                  <span>物资名称：</span>
                  <span>特殊桥梁支庄</span>
                </li>
                <li>
                  <span>供应商：</span>
                  <span>供应商名称供应商名称供应商名称</span>
                </li>
                <li class="select-Contract-money">
                  <span style="color: red;">计划金额比例：</span>
                  <span style="color: red;">88.88%</span>
                </li>
              </ul>
            </van-radio>
          </van-radio-group>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" type="info" round @click="addClick">确定选择</van-button>
    </div>
    <!-- <van-button class="button-info" round type="info" @click="addClick">确定选择</van-button> -->
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
export default {
  name: 'SelectContract',
  components: { BackToTop },
  data() {
    return {
      value: '',
      showAction: false,
      refreshLoading: false,
      loading: false,
      finished: false,
      radio: null,
      list: []
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
        if (this.refreshLoading) {
          this.list = [];
          this.refreshLoading = false;
        }

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
    //列表刷新
    onRefresh(){
      this.refreshLoading = true
      this.loading = true
      this.finished = false
      // this.listQuery.pageNum = 1
      this.onLoad();
    },
    handleWaitItemClick() {

    },
    addClick() {
      if (!this.radio) {
        this.$notify({ type: 'warning', message: '请选择合同' });
        return
      }
      this.$router.push({ name: 'SelectMaterials' })
    }
  }
}
</script>
<style lang="less" scoped>
.select-Contract {
  display: flex;
  flex-direction: column;

  .select-Contract-search {
    width: 100%;
    background: #f8f8f8;
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

  .select-Contract-list{
    height: 100%;
  }

  .van-list {
    // padding-top: 80px;
    padding-bottom: 40px;
    background: #f8f8f8;

    .van-radio {
      box-sizing: border-box;
      margin-left: 8px;
      margin-right: 8px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
      position: relative;
      padding: 10px;
      display: flex;

      ::v-deep .van-radio__label {
        width: calc(100% - 25px);

        .list-ul {
          li {
            span:nth-child(2) {
              width: auto !important;
            }
          }
        }
      }
    }
  }

  .select-Contract-p {
    padding-left: 10px;
    padding-bottom: 8px;
    font-size: 14px;
    background: #f8f8f8;
  }

  .button-info {
    min-width: 150px;
  }

  .select-Contract-money {
    :nth-child(1) {
      width: auto !important;
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