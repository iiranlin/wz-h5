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
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li>
            <span>发货数量：</span>
            <span>{{ item.sendTotal }}</span>
          </li>
          <li>
            <span>退货数量：</span>
            <span class="li-span-click">{{ item.refundTotal }}</span>
          </li>
          <li>
            <span>退货附件（数量）：</span>
            <span class="li-span-click">{{ filterList(item.fileByList, 'thfj_sh')?.length }}</span>
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
          </ul>
        </div>
      </div>
    </div>
    <van-empty v-if="list.length === 0" description="暂无数据" />
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
export default {
  name: 'MaterialDetails',
  components: {},
  mixins: [indexMixin],
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
      this.$router.push({name: 'ViewMaterialsReturnD', query: {data: JSON.stringify(item)}})
    }
  },
}
</script>
<style lang="less" scoped>
.box-container {
  padding: 0px;
  margin: 0px;

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