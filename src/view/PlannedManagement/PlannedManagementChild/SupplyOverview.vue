<template>
  <div class="supply-overview">
    <div class="box-container" style="margin-top: 20px;">
      <div>
        <ul class="detail-ul">
          <li>
            <span>需求编号：</span>
            <span>{{ detailGyMx.planNumber }}</span>
          </li>
          <li>
            <span>需求名称：</span>
            <span>{{ detailGyMx.planName }}</span>
          </li>
          <li>
            <span>需求项目：</span>
            <span>{{ detailGyMx.sectionName }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ detailGyMx.deptName }}</span>
          </li>
          <li>
            <span>提报人：</span>
            <span>{{ detailGyMx.createUserName }}</span>
          </li>
          <li>
            <span>提报时间：</span>
            <span>{{ parseTime(detailGyMx.createDate, '{y}-{m}-{d} {h}:{s}') }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="select-materials-search">
      <p class="select-materials-search-p font-weight">供应信息</p>
    </div>
    <div class="box-container" v-for="(item, index) in detailGyMx.demandPlanDetailsGyDTOList" :key="index">
      <div>
        <ul class="detail-ul detail-ul-mian">
          <li>
            <span class="font-weight">供应商：</span>
            <span class="font-weight">{{ item.sellerName }}</span>
          </li>
          <li>
            <span class="font-weight">物资名称：</span>
            <span class="font-weight">{{ item.materialName }}</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li class="li-item-both">
            <div class="li-item-left">
              <span>计量单位：</span>
              <span>{{ item.unit }}</span>
            </div>
            <div class="li-item-right">
              <span>合同数量：</span>
              <span>{{ item.amount }}</span>
            </div>
          </li>
          <li class="li-item-both li-item-both-long">
            <div class="li-item-left">
              <span>累计计划量(含本次)：</span>
              <span>{{ item.cumulativeAmount }}</span>
            </div>
            <div class="li-item-right">
              <span>本次计划数量：</span>
              <span>{{ item.planAmount }}</span>
            </div>
          </li>
          <li class="li-item-both li-item-both-red">
            <div class="li-item-left li-item-left-num">
              <span>已发货：</span>
              <span>{{ item.sendTotal }}</span>
            </div>
            <div class="li-item-right">
              <span>已验收：</span>
              <span>{{ item.putTotal }}</span>
            </div>
          </li>
          <li class="li-item-both li-item-both-red">
            <div class="li-item-left li-item-left-num">
              <span>已入库：</span>
              <span>{{ item.storeTotal }}</span>
            </div>
            <div class="li-item-right">
              <span>已出库：</span>
              <span>{{ item.outCkTotal }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { materialDemandPlanRestDetailGyMx } from '@/api/prodmgr-inv/materialDemandPlanRest'
export default {
  name: 'SupplyOverview',
  components: {},
  data() {
    return {
      detailGyMx: {}
    }
  },
  created() {
  },
  activated() {
  },
  mounted () {
    const id = this.$route.query.id
    id && this.materialDemandPlanRestDetailGyMx(id)
  },
  methods: {
    materialDemandPlanRestDetailGyMx (id) {
      const params = { pageNum: 1, pageSize: -1, id }
      materialDemandPlanRestDetailGyMx(params).then(({data}) => {
        this.detailGyMx = data
      })
    }
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