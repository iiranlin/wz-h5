<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <div class="box-container" v-for="(item, index) in list" :key="index">
      <div>
        <ul class="detail-ul">
          <li>
            <span class="font-weight">供应商名称：</span>
            <span class="font-weight">北京全路通信信号研究设计院集团</span>
          </li>
          <li>
            <span>物资名称：</span>
            <span>计算机联锁设备</span>
          </li>
          <li>
            <span>使用地点：</span>
            <span>华庄/永津路/高里东/浦口北</span>
          </li>
          <li>
            <span>收货人：</span>
            <span>name 15888888888</span>
          </li>
          <li class="li-item-both">
            <div class="li-item-left">
              <span>规格型号：</span>
              <span>2x2取2s10</span>
            </div>
            <div class="li-item-right">
              <span>计量单位：</span>
              <span>套</span>
            </div>
          </li>
          <li class="li-item-both">
            <div class="li-item-left">
              <span>合同数量：</span>
              <span>10</span>
            </div>
            <div class="li-item-right">
              <span>累计计划量(含本次)：</span>
              <span>6</span>
            </div>
          </li>
          <li class="li-item-both">
            <div class="li-item-left li-item-left-num">
              <span>本次计划数量：</span>
              <span>3</span>
            </div>
            <div class="li-item-right">
              <span>供应时间：</span>
              <span>2025-07-15</span>
            </div>
          </li>
          <li>
            <span>投资方：</span>
            <span>北京全路通信信号研究设计院集团有限公司</span>
          </li>
          <li>
            <span>投资比例：</span>
            <span>40%;60%</span>
          </li>
          <li>
            <span>备注：</span>
            <span>备注内容备注内容备注内容备注内容</span>
          </li>
        </ul>
      </div>
    </div>
  </van-list>
</template>
<script>
export default {
  name: 'MaterialDetails',
  components: {},
  data() {
    return {
      loading: false,
      finished: false,
      list: []
    }
  },
  created() {
  },
  activated() {
  },
  methods: {
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
  },
}
</script>
<style lang="less" scoped>
.detail-ul {
  li {
    span {
      &:nth-child(1) {
        width: 80px;
      }
    }
  }
}

.li-item-both {
  justify-content: space-between;
}

.li-item-left {
  width: auto !important;
}

.li-item-left-num {
  span:nth-child(1) {
    min-width: 100px;
  }
}

.li-item-right {
  width: auto !important;

  span:nth-child(1) {
    width: auto !important;
    text-align: right;
  }

  span:nth-child(2) {
    width: auto !important;
  }
}
</style>