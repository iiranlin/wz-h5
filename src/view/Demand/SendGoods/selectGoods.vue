<template>
  <div class="select-materials">
   
    <div class="select-materials-search">
     
      <van-search v-model="value" placeholder="输入关键字搜索" background="center" :show-action="showAction"
        @search="onSearch" @cancel="onCancel" @focus="onFocus" />
    </div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-checkbox-group v-model="result">
        <van-checkbox shape="square" :name="index+''" v-for="(item, index) in list" :key="index">
          <ul class="list-ul">
            <li>
              <span class="font-weight">物资名称：</span>
              <span class="font-weight">计算机联锁设备</span>
            </li>
            <li>
              <span>规格型号：</span>
              <span>2x2取2s10组道岔</span>
            </li>
             <li class="li-item-both">
              <div class="li-item-left">
                <span>计量单位:</span>
                <span>套</span>
              </div>
              <div class="li-item-right">
                <span>合同数量:</span>
                <span>5</span>
              </div>
            </li>
             <li class="li-item-both">
              <div class="li-item-left">
                <span>累计计划量(含本次):</span>
                <span>4</span>
              </div>
              <div class="li-item-right">
                <span>本次计划数量:</span>
                <span>5</span>
              </div>
            </li>
            <li>
              <span>供应时间:</span>
              <span>2025-04-20</span>
            </li>
                <li>
              <span>使用地点:</span>
              <span>使用地点使用地点使用地点使用地点</span>
            </li>
              <li>
              <span>收货人及联系方式:</span>
              <span>张晓明 13865444566</span>
            </li>
             <li>
              <span>投资方:</span>
              <span>
投资方名称投资方名称投资方名称投资方名称</span>
            </li>
             <li class="li-item-both">
              <div class="li-item-left">
                <span>投资比例:</span>
                <span>40%，60%</span>
              </div>
              <div class="li-item-right" style="color:red;">
                <span >本次需求未发货数量:</span>
                <span>1</span>
              </div>
            </li>
            <li>
              <span>备注：</span>
              <span>备注备注备注备注备注备注备注备注</span>
            </li>
          </ul>
        </van-checkbox>
      </van-checkbox-group>
    </van-list>
    <div class="default-button-container">
        <div>
            已选物资<span class="number">3</span>项
        </div>
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

    },
    selectClick () {
      this.$router.push({ name: 'SelectContract' })
    },
    addClick() {
    //   if(!this.result.length){
    //     this.$notify({ type: 'warning', message: '请选择需求物资' });
    //     return
    //   }
      this.$router.push({ path: 'finishGoods' })
    }
  }
}
</script>
<style lang="less" scoped>
.select-materials {
  display: flex;
  flex-direction: column;

  .select-materials-contract{
    margin-top: 10px;
    box-sizing: border-box;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow:0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 10px;
    .li-status{
      top: auto;
      bottom: 12px;
      span{
        background-color: #edf2ff;
        border: 1px solid #289fec;
        color: #1d93ff;
      }
    }
  }

  .select-materials-search{
    display: flex;
    justify-content: space-between;
    .select-materials-search-p{
      font-size: 14px;
      line-height: 38px;
      padding: 0 10px;
    }
    .select-materials-select{
      font-size: 12px;
    }
    .select-materials-select-num{
      color: #1d93ff;
    }
  }
  
  .van-search {
    padding-top: 10px;
    width: 100%;
    // width: 165px;
    .van-search__content {
      border-radius: 15px;
      background: #fff;
    }

    .van-cell {
      border-radius: 15px;
      background: #fff;
    }
  }

  .van-list {
    background: #f8f8f8;
    padding-bottom: 40px;
    .van-checkbox{
      box-sizing: border-box;
      margin-left: 8px;
      margin-right: 8px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 7px;
      box-shadow:0px 2px 5px rgba(32, 30, 74, 0.1);
      position: relative;
      padding: 10px;
      ::v-deep .van-checkbox__label{
        width: calc(100% - 25px);
        .list-ul{
          li{
            span:nth-child(2){
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

  .button-info{
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
.default-button-container{
    display: flex;
    font-size: 14px;
    justify-content:space-around;
}
.number{
    font-size: 16px;
    margin: 0 5px;
    color: rgb(8, 49, 234);
    font-weight: 600;
}
</style>