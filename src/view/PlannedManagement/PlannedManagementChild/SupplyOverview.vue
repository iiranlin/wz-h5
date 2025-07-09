<template>
  <div class="supply-overview">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>需求编号：</span>
        <span>{{detailGyMx.planNumber}}</span>
      </div>
      <ul class="detail-ul">
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
          <span>{{ parseTime(detailGyMx.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </li>
      </ul>
    </div>
    <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>供应信息</span>
    </div>
    <div class="box-container" v-for="(item, index) in detailGyMx.demandPlanDetailsGyDTOList" :key="index">
      <div>
        <div class="detail-list-title-content">
          <span>供应商：</span>
          <span>{{item.sellerName}}</span>
        </div>
        <ul class="detail-list-ul detail-ul-mian">
          <li>
            <span class="font-weight">物资名称：</span>
            <span class="font-weight">{{ item.materialName }}</span>
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
          <li class="li-item-both">
            <div class="li-item-left li-item-left-num">
              <span>已发货：</span>
              <span class="li-span-click">{{ item.sendTotal }}</span>
            </div>
            <div class="li-item-right">
              <span>已验收：</span>
              <span class="li-span-click">{{ item.putTotal }}</span>
            </div>
          </li>
          <li class="li-item-both">
            <div class="li-item-left li-item-left-num">
              <span>已入库：</span>
              <span class="li-span-click">{{ item.storeTotal }}</span>
            </div>
            <div class="li-item-right">
              <span>已出库：</span>
              <span class="li-span-click">{{ item.outCkTotal }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="box-container" v-if="detailGyMx.demandPlanDetailsGyDTOList && detailGyMx.demandPlanDetailsGyDTOList.length == 0">
      <van-empty description="暂无数据" />
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
.box-container{
  padding: 0;
}
.supply-overview{
  .li-item-left{
    flex: 1;
    min-width: auto !important;
  }
  .li-item-right{
    flex: 1;
    width: auto !important;
  }
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
  }
}
</style>