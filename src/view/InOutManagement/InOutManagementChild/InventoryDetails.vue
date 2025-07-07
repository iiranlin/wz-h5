<template>
  <div class="default-container">
    <div class="detail-base-info">
       <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>需求编号：</span>
        <span>{{detailInfo.planNumber}}</span>
      </div>
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
          <li>
            <span>需求状态：</span>
            <span>{{detailInfo.status == '5'?'已完成':'未完成'}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>物资明细（共{{detailList.length}}项）</span>
    </div>
    <div class="box-container" v-for="(item,index) in detailList" :key="index">
      <div>
        <div class="detail-list-title-content">
          <span>物资名称：</span>
          <span>{{item.materialName}}</span>
        </div>
      </div>
      <ul class="detail-list-ul">
        <li class="li-item-overlength">
          <span>供应商名称：</span>
          <span>{{item.sellerName}}</span>
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
.default-container {
  padding-bottom: 20px;
}
.box-container {
  padding: 0px;
}
</style>