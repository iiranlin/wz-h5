<template>
  <div>
    <div class="box-container" v-for="(item, index) in list" :key="index">
      <div class="box-container-main" @click="detailsClick(item)">
        <div class="material-details-detail-list-title-content">
          <span>{{ index + 1 }}.{{ item.materialName }}</span>
          <img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Arrow-R.png" />
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
         
          <li class="li-item-overlength">
            <span>收货人及联系方式：</span>
            <span>{{ item.receiver }}</span>
          </li>
        </ul>
        <div class="detail-ul-text" v-if="searchChecked && ['6', '7', '8', '9'].includes(planStatus)">
          <ul class="detail-ul">
            <li>
              <p>
                <span>已发货：</span>
                <span>{{ item.sendTotal }}</span>
              </p>
              <p>
                <span>已验收：</span>
                <span>{{ item.putTotal }}</span>
              </p>
            </li>
            <li>
              <p>
                <span>已入库：</span>
                <span>{{ item.storeTotal }}</span>
              </p>
              <p>
                <span>已出库：</span>
                <span>{{ item.outCkTotal }}</span>
              </p>
            </li>
            <li>
              <p>
                <span>已退回：</span>
                <span>{{ item.refundAllTotle }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <van-empty image="/empty-image-default.png" v-if="list.length === 0" description="暂无数据" />
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
    },
    searchChecked: {
      type: Boolean,
      default: true
    },
    planStatus: {
      type: String,
      default: ''
    },
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
  mounted() {
  },
  methods: {
    detailsClick (item) {
      console.log(item)
      this.$router.push({name: 'ViewMaterials', query: {id: item.id}})
    }
  },
}
</script>
<style lang="less" scoped>
.box-container {
  padding: 0px;

  .box-container-main{
    display: flex;
    flex-direction: column;
  }

  .material-details-detail-list-title-content {
    box-sizing: border-box;
    width: 100%;
    line-height: 34px;
    font-size: 13px;
    font-weight: 600;
    color: #151b3e;
    padding-left: 12px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .detail-ul-bottom-text-Arrow {
      width: 14px !important;
      height: 14px !important;
    }
  }

  .detail-list-ul{
    padding-left: 12px;
    padding-right: 12px;
  }

  .detail-ul-text {
    margin: 10px;
    margin-top: 0;
    background: #f0f2f6;
    border-radius: 5px;

    .detail-ul {
      padding: 10px 12px;
      padding-left: 20px;
      p{
        flex: 1;
        text-align: left;
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