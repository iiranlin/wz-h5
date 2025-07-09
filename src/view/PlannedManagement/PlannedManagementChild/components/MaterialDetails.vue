<template>
  <div>
    <div class="box-container" v-for="(item, index) in list" :key="index">
      <div>
        <div class="detail-list-title-content">
            <span>物资名称：</span>
            <span>{{item.materialName}}</span>
        </div>
        <ul class="detail-list-ul">
          <li>
            <span>供应商：</span>
            <span>{{ item.sellerName }}</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li>
            <span>计量单位：</span>
            <span>{{ item.unit }}</span>
          </li>
          <li>
            <span>合同数量：</span>
            <span class="li-span-click">{{ item.amount }}</span>
          </li>
          <li class="li-item-overlength">
            <span>累计计划量(含本次)：</span>
            <span class="li-span-click">{{ item.cumulativeAmount }}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次计划数量：</span>
            <span class="li-span-click">{{ item.planAmount }}</span>
          </li>
          <li>
            <span>供应时间：</span>
            <span>{{ item.supplyDate && parseTime(item.supplyDate, '{y}-{m}-{d}') }}</span>
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
          <li class="li-item-remark"> 
            <span>备注：</span>
            <div class="remark-detail">{{item.remark || '未填写'}}</div>
          </li>
        </ul>
      </div>
    </div>
    <van-empty v-if="list.length === 0" description="暂无数据" />
  </div>
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
.box-container {
  padding: 0px;
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