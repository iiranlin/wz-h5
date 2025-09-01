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
            <span>包装形式：</span>
            <span>{{ item.packagingFm }}</span>
          </li>
          <li>
            <span>供应时间：</span>
            <span v-if="item.supplyDate">{{ item.supplyDate | formatDate }}</span>
          </li>
          <li>
            <span>收货人及联系方式：</span>
            <span>{{ item.receiver }}</span>
          </li>
          <li>
            <span>本次计划数量：</span>
            <span class="li-span-click">{{ item.planAmount }}</span>
          </li>
          <li>
            <span>发货数量：</span>
            <span class="li-span-click">{{ item.sendTotal }}</span>
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
    <van-empty image="/empty-image-default.png" v-if="list.length === 0" description="暂无数据" />
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
  filters: {
    formatDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      }else{
        return ""
      }
    },
     formatToDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }else{
        return ""
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
  mounted() {
  },
  methods: {
    formattedCreateDate(timestamp) {
      if (!timestamp) return ''; // 处理空值
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0
      return `${year}-${month}-${day}`;
    },
    detailsClick (item) {
      this.$router.push({name: 'ViewMaterialsCargo', query: {data: JSON.stringify(item)}})
    }
  },
}
</script>
<style lang="less" scoped>
.box-container {
  padding: 10px;
  margin: 10px;

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