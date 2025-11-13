<template>
  <div class="default-container save-materials">
    <div class="detail-base-info" v-if="businessType === 'CGWJ'">
      <div class="detail-title-text">
        <p>物资名称：</p>
        <p>{{ detail.purchaseFileName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>标段项目：</span>
            <span>{{ detail.projefctName }}</span>
          </li>
          <li>
            <span>采购单位：</span>
            <span>{{ detail.unitName }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-base-info" v-else-if="businessType === 'CGHT'">
      <div class="detail-title-text">
        <p>合同名称：</p>
        <p>{{ detail.contractName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>标段项目：</span>
            <span>{{ detail.projefctName }}</span>
          </li>
          <li>
            <span>采购单位：</span>
            <span>{{ detail.unitName }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-base-info" v-else>
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ detail.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>建设项目：</span>
            <span>{{ detail.projectName }}</span>
          </li> 
          <li>
            <span>标段项目：</span>
            <span>{{ detail.sectionName }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ detail.deptName }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-log-info">
        <index-detail></index-detail>
    </div>
  </div>
</template>
<script>
import IndexDetail from './components/indexDetail'
import { materialDemandPlanRestDetail } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { materialPurchaseFiledetail,materialPurchaseContractdetail } from '@/api/prodmgr-inv/SelfBuying'
import { detailTakeBack, detailTake } from "@/api/prodmgr-inv/receive";
import {detailBySend} from '@/api/demand/sendGoods'
import {detailStoreBack} from '@/api/prodmgr-inv/materialStoreTableRest'
import {detailByStore} from '@/api/prodmgr-inv/materialCirculationTableRest'

export default {
  name: 'RequirementDetails',
  components: { IndexDetail, },
  data() {
    return {
      menuActiveIndex: '',
      detail: {
        details: []
      },
      businessType: "",
      takeStatus: "",
      form: "",
      storeStatus: "",
    }
  },
  created() {
  },
  activated() {
  },
  computed: {
    detailApi(){
      // 收货流程 
      if(this.businessType === "SHLC"){
        return this.form == "AcceptanceReturn" || this.takeStatus == 5 || this.takeStatus == void 0 ? detailTakeBack : detailTake;
      }
      if(this.businessType === "RKLC"){
        console.log(this.form,this.storeStatus,'-----------------');
        return ['WaitHandleList','OverExamineList','WaitExamineList'].includes(this.form)   || ["5", "6","0"].includes(this.storeStatus) ? detailStoreBack : detailByStore
      }
      if(this.businessType === "FHLC"){
        return detailBySend
      }
      if(this.businessType === "CGWJ"){
        return materialPurchaseFiledetail
      }
      if(this.businessType === "CGHT"){
        return materialPurchaseContractdetail
      }
      
      return materialDemandPlanRestDetail
    },
  },
  mounted() {
    const { takeStatus, businessType, businessId: id, form = "", storeStatus = "" } = this.$route.params

    this.takeStatus = takeStatus
    this.businessType = businessType
    this.form = form
    this.storeStatus = storeStatus
    id && this.materialDemandPlanRestDetail(id)
  },
  methods: {
    materialDemandPlanRestDetail(id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      this.detailApi(id).then(({ data }) => {
        this.detail = data
      }).finally((err) => {
        toast.clear()
      })

    },
  },
}
</script>
<style lang="less" scoped>
.save-materials {
  display: flex;
  flex-direction: column;
  .detail-title-text{
    padding: 0.25rem 0.5rem;
    p{
      &:nth-child(1){
        font-size: 11px;
        color: rgba(17, 89, 204, 1);
        padding-bottom: 0.25rem;
      }
      &:nth-child(2){
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }
  .detail-ul-text{
    margin: 0.25rem 0.5rem 0.5rem 0.5rem;
    background: #f2f2f2;
    border-radius: 5px;
    .detail-ul{
      padding: 10px 12px;
    }
  }
}
.select-materials-select {
  font-size: 12px;
}
.van-tabs{
  padding-bottom: 62px;
}
.detail-title-content{
  position: relative;
  .detail-title-status {
    position: absolute;
    right: 10px;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;

    img {
      width: 16px;
      height: 16px;
    }

    span {
      margin-left: 3px;
      color: #134daa;
      font-size: 11px;
    }
  }

}
.detail-log-info{
    margin-top: 0.25rem;
    margin-bottom: 0.1rem;
}
</style>