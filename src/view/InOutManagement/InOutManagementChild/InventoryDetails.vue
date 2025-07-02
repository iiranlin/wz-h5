<template>
  <div class="outbound">
    <div class="outbound-mian">
      <div class="box-container" style="margin-top: 20px;">
        <div>
          <ul class="detail-ul">
            <li>
              <span>需求名称：</span>
              <span>{{detailInfo.planName}}</span>
            </li>
            <li>
              <span>需求项目：</span>
              <span>{{detailInfo.sectionName}}</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>{{detailInfo.deptName}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">物资明细（共{{detailList.length}}项）</p>
      </div>
      <div class="box-container" v-for="(item,index) in detailList" :key="index">
        <ul class="detail-ul">
          <li class="li-item-overlength">
            <span>供应商名称：</span>
            <span>{{item.sellerName}}</span>
          </li>
          <li>
            <span class="font-weight">物资名称：</span>
            <span class="font-weight">{{item.materialName}}</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{item.specModel}}</span>
          </li>
          <li>
            <span>计量单位：</span>
            <span>{{item.unit}}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次计划数量：</span>
            <span>{{item.planAmount}}</span>
          </li>
          <li class="li-item-overlength">
            <span>累计入库数量：</span>
            <span>{{item.storeTotal}}</span>
          </li>
          <li>
            <span>当前库存：</span>
            <span>{{item.stockStatus}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {materialDemandPlanRestDetailGyMx} from '@/api/prodmgr-inv/materialDemandPlanRest'

export default {
  name: 'InventoryDetails',
  components: {},
  data() {
    return {
      id: '',
      detailInfo:{},
      detailList:[],
    }
  },
  created() {
    this.id = this.$route.query.id

    this.getDetail();
  },
  activated() {
  },
  methods: {
    //获取详情信息
    getDetail(){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      let params = {
        id: this.id,
      }
      materialDemandPlanRestDetailGyMx(params).then(({ data }) => {
        this.detailInfo = data;
        this.detailList = data.demandPlanDetailsGyDTOList;
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
  }
}
</script>
<style lang="less" scoped>
.outbound {
  width: 100%;
  height: 100%;

  .outbound-mian {
    display: flex;
    flex-direction: column;
  }

  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      line-height: 30px;
      padding: 0 10px;
    }
  }

  .li-item-both {
    .li-item {
      flex: 1;
      width: auto !important;
    }
  }

  .van-cell {
    padding-left: 0;
    padding-right: 0;
  }

  ::v-deep .van-field__label {
    color: #272b31;
  }

  .default-button-container {
    .button-info {
      min-width: 150px;
    }
  }

  .van-cell {
    padding-left: 12px;
    padding-right: 0;
  }

  .van-cell--required::before {
    left: 4px;
  }

  ::v-deep .outbound-field-uploader {
    &:before {
      top: 16px;
    }

    .van-field__label {
      line-height: 35px;
    }
  }

  .van-field__control--custom {
    .outbound-uploader {
      min-width: 80px;
      height: 25px;
    }
  }

  ::v-deep .outbound-field-text {
    padding-left: 0;
  }
}
</style>