<template>
  <div class="select-materials">
    <van-sticky class="select-materials-sticky">
      <div class="select-materials-contract">
        <ul class="list-ul">
          <li>
            <span class="font-weight">合同名称：</span>
            <span class="font-weight">新建南京至淮安城泳铁路第二批建管甲供物资采购会</span>
          </li>
          <li>
            <span>合同物资：</span>
            <span>特殊桥梁支庄</span>
          </li>
          <li>
            <span>合同编号：</span>
            <span>NHTL-2024-001</span>
          </li>
          <li class="li-status">
            <van-tag type="primary" round size="medium" @click="selectClick">选择合同</van-tag>
          </li>
        </ul>
      </div>
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">请选择需求物资<span class="select-materials-select">（已选择<span
              class="select-materials-select-num">2</span>项）</span></p>
        <van-search v-model="value" placeholder="输入关键字搜索" background="center" :show-action="showAction"
          @search="onSearch" @cancel="onCancel" @focus="onFocus" />
      </div>
    </van-sticky>
    <div class="select-materials-list">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-checkbox-group v-model="result">
            <van-checkbox shape="square" :name="index + ''" v-for="(item, index) in list" :key="index">
              <ul class="list-ul">
                <li>
                  <span class="font-weight">物资名称：</span>
                  <span class="font-weight">新建南京至淮安城泳铁路第二批建管甲供物资采购会</span>
                </li>
                <li>
                  <span>规格型号：</span>
                  <span>特殊桥梁支庄</span>
                </li>
                <li>
                  <span>供应商：</span>
                  <span>供应商名称供应商名称供应商名称</span>
                </li>
                <li>
                  <span style="color: red;">计划金额比例：</span>
                  <span style="color: red;">88.88%</span>
                </li>
              </ul>
            </van-checkbox>
          </van-checkbox-group>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="addClick">下一步</van-button>
    </div>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
export default {
  name: 'SelectMaterials',
  components: { BackToTop },
  data() {
    return {
      value: '',
      showAction: false,
      refreshLoading: false,
      loading: false,
      finished: false,
      result: [],
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
    selectClick() {
      this.$router.push({ name: 'SelectContract' })
    },
    addClick() {
      if (!this.result.length) {
        this.$notify({ type: 'warning', message: '请选择需求物资' });
        return
      }
      this.$router.push({ name: 'SaveMaterials' })
    }
  }
}
</script>
<style lang="less" scoped>
.select-materials {
  display: flex;
  flex-direction: column;

  .select-materials-sticky{
    ::v-deep .van-sticky{
      background: #f8f8f8;
    }
  }

  .select-materials-contract {
    margin-top: 10px;
    box-sizing: border-box;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 10px;

    .li-status {
      top: auto;
      bottom: 12px;

      span {
        background-color: #edf2ff;
        border: 1px solid #289fec;
        color: #1d93ff;
      }
    }
  }

  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      line-height: 38px;
      padding: 0 10px;
    }

    .select-materials-select {
      font-size: 12px;
    }

    .select-materials-select-num {
      color: #1d93ff;
    }
  }

  .van-search {
    padding-top: 0;
    width: 165px;

    .van-search__content {
      border-radius: 50px;
      background: #fff;
    }

    .van-cell {
      border-radius: 50px;
      background: #fff;
    }
  }

  .select-materials-list {
    height: 100%;
  }

  .van-list {
    background: #f8f8f8;
    padding-bottom: 40px;

    .van-checkbox {
      box-sizing: border-box;
      margin-left: 8px;
      margin-right: 8px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
      position: relative;
      padding: 10px;

      ::v-deep .van-checkbox__label {
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
  }

  .button-info {
    min-width: 150px;
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