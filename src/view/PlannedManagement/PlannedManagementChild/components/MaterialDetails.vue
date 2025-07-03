<template>
  <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
  <div>
    <div class="box-container" v-for="(item, index) in list" :key="index">
      <div>
        <ul class="detail-ul">
          <!-- <li class="li-item-overlength">
            <span class="font-weight">供应商名称：</span>
            <span class="font-weight">{{ item.sellerName }}</span>
          </li> -->
          <li>
            <span class="font-weight">物资名称：</span>
            <span class="font-weight">{{ item.materialName }}</span>
          </li>
          <li>
            <span>供应商：</span>
            <span>{{ item.sellerName }}</span>
          </li>
          <li class="li-item-both">
            <div class="li-item-left">
              <span>规格型号：</span>
              <span>{{ item.specModel }}</span>
            </div>
            <div class="li-item-right">
              <span>计量单位：</span>
              <span>{{ item.unit }}</span>
            </div>
          </li>
          <li class="li-item-both">
            <div class="li-item-left">
              <span>合同数量：</span>
              <span>{{ item.amount }}</span>
            </div>
            <div class="li-item-right">
              <span>累计计划量(含本次)：</span>
              <span>{{ item.cumulativeAmount }}</span>
            </div>
          </li>
          <li class="li-item-both">
            <div class="li-item-left li-item-left-num">
              <span>本次计划数量：</span>
              <span>{{ item.planAmount }}</span>
            </div>
            <div class="li-item-right">
              <span>供应时间：</span>
              <span>{{ parseTime(item.supplyDate, '{y}-{m}-{d}') }}</span>
            </div>
          </li>
          <li>
            <span>使用地点：</span>
            <span>{{ item.addr }}</span>
          </li>
          <li>
            <span>收货地址：</span>
            <span>{{ item.addr }}</span>
          </li>
          <li class="li-item-overlength">
            <span>收货人及联系方式：</span>
            <span>{{ item.receiver }}</span>
          </li>
          <li>
            <span>投资方：</span>
            <span>{{ item.field0 }}</span>
          </li>
          <li>
            <span>投资比例：</span>
            <span>{{ item.field1 }}</span>
          </li>
          <li>
            <span>备注：</span>
            <span>{{ item.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <van-empty v-if="list.length === 0" description="暂无数据" />
  </div>
  <!-- </van-list> -->
</template>
<script>
export default {
  name: 'MaterialDetails',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
    }
  },
  created() {
  },
  activated() {
  },
  mounted () {
  },
  methods: {
  },
}
</script>
<style lang="less" scoped>
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