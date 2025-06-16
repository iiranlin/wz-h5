<template>
  <div class="supply-overview">
    <div class="box-container" style="margin-top: 20px;">
      <div>
        <ul class="detail-ul">
          <li>
            <span>需求名称：</span>
            <span>南京枢纽(江北地区)和南通地区工程</span>
          </li>
          <li>
            <span>需求项目：</span>
            <span>南京枢纽(江北地区)和南通地区工程</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>施工单位名称</span>
          </li>
          <li class="li-item-both">
            <div class="li-item-left">
              <span>提报人：</span>
              <span>张山</span>
            </div>
            <div class="li-item-right" style="flex: 2;">
              <span>提报时间：</span>
              <span>2025-07-15 15:30</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="select-materials-search">
      <p class="select-materials-search-p font-weight">供应信息</p>
    </div>
    <div class="box-container" v-for="(item, index) in 5" :key="index">
      <div>
        <ul class="detail-ul detail-ul-mian">
          <li>
            <span class="font-weight">供应商：</span>
            <span class="font-weight">北京全路通信信号研究设计院集团</span>
          </li>
          <li>
            <span>物资名称：</span>
            <span>计算机联锁设备</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>2x2取2s10组</span>
          </li>
          <li class="li-item-both">
            <div class="li-item-left">
              <span>计量单位：</span>
              <span>套</span>
            </div>
            <div class="li-item-right">
              <span>合同数量：</span>
              <span>10</span>
            </div>
          </li>
          <li class="li-item-both li-item-both-long">
            <div class="li-item-left">
              <span>累计计划量(含本次)：</span>
              <span>6</span>
            </div>
            <div class="li-item-right">
              <span>本次计划数量：</span>
              <span>2</span>
            </div>
          </li>
          <li class="li-item-both li-item-both-red">
            <div class="li-item-left li-item-left-num">
              <span>已发货：</span>
              <span>3</span>
            </div>
            <div class="li-item-right">
              <span>已验收：</span>
              <span>2</span>
            </div>
          </li>
          <li class="li-item-both li-item-both-red">
            <div class="li-item-left li-item-left-num">
              <span>已入库：</span>
              <span>3</span>
            </div>
            <div class="li-item-right">
              <span>已出库：</span>
              <span>2</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SupplyOverview',
  components: {},
  data() {
    return {
    }
  },
  created() {
  },
  activated() {
  },
  methods: {
  },
}
</script>
<style lang="less" scoped>
.supply-overview{
  .select-materials-search{
    display: flex;
    justify-content: space-between;
    .select-materials-search-p{
      font-size: 14px;
      line-height: 30px;
      padding: 0 10px;
    }
  }
  .detail-ul-mian{
    .font-weight{
      width: auto !important;
    }
    .li-item-both-long{
      div{
        span:nth-child(1){
          width: auto !important;
        }
      }
    }
    .li-item-both-red{
      span{
        color: red !important;
      }
    }
  }
}
</style>