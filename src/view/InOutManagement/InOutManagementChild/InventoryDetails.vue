<template>
  <div class="default-containerA">
    <div class="detail-base-info">
    
    <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ detailInfo.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>建设项目：</span>
            <span>{{ detailInfo.projectName }}</span>
          </li>
          <li>
            <span>标段项目：</span>
            <span>{{ detailInfo.sectionName }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ detailInfo.deptName }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0.2rem; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>计划附件</span>
      </div>
      <file-download-view class="outbound-field-uploader" :fileList="fileList || []" />
    </div>
    <!-- <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>物资明细（共{{detailList.length}}项）</span>
    </div> -->

     <div class="detail-base-info detail-base-info-edited" style="margin-bottom: 8px; background-color: #F2F4F8;">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-batch.png" />
        <span>物资明细</span>
        <span style="text-align: right;">共 <span style="color: #134DAA;">{{ detailList.length }}</span> 项</span>
      </div>
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
          <span>{{item.planAmount}} {{item.unit}}</span>
        </li>
        <li class="li-item-overlength">
          <span>累计入库数量：</span>
          <span>{{item.storeTotal}} {{item.unit}}</span>
        </li>
        <li>
          <span>当前库存：</span>
          <span>{{item.stockStatus}} {{item.unit}}</span>
        </li>
      </ul>
    </div>
    <div class="default-button-container" v-if="relatedCount == '1'">
      <van-button class="button-info" round type="info" @click="outboundClick(detailInfo)">出库</van-button>
    </div>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import {materialDemandPlanRestDetailGyMx} from '@/api/prodmgr-inv/materialDemandPlanRest'
import BackToTop from '@/components/BackToTop'
import FileDownloadView from "@/components/FileDownloadView.vue";

export default {
  name: 'InventoryDetails',
  components: {BackToTop, FileDownloadView},
  data() {
    return {
      id: '',
      detailInfo:{},
      detailList:[],
      relatedCount: '',
      fileList: [],
    }
  },
  created() {
    this.id = this.$route.query.id
    this.relatedCount = this.$route.query.relatedCount

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
        // fileList回显
        this.fileList = data.fileList[0]?.fileList || []
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    outboundClick (item) {
      this.$router.push({ name: 'Outbound', query: {type: 'submit',id: item.id} })
    },
    checkAuditStatus(status){
      if(status == '5'){
        return '/static/icon-success.png'
      }else
        return '/static/icon-reject.png'
    },
  }
}
</script>
<style lang="less" scoped>
.default-containerA {
  padding-bottom: 60px;
}
.box-container {
  padding: 0px;
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
.detail-base-info{
  padding-bottom: 0.05rem;
}
  .detail-title-text {
    padding: 0 12px;

    p {
      &:nth-child(1) {
        font-size: 11px;
        color: #1159cc;
        padding-bottom: 5px;
      }

      &:nth-child(2) {
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }
  .detail-ul-text {
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;
    margin-bottom: 10px;

    .detail-ul {
      padding: 10px 12px;
    }
  }
  .detail-base-info-edited {
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 0;
    display: flex;
    flex-direction: column;

    .detail-title-content {
      padding-left: 5px;
      padding-right: 5px;
      margin-top: 5px;
      margin-bottom: 5px;

      img {
        width: 26px;
        height: 26px;
      }

      span {
        line-height: 26px;
        margin-left: 0;
        font-size: 13px;
      }
    }

    .detail-ul {
      padding-left: 16px;
      padding-right: 30px;
      border-top: 0.5px solid #e3e3e3;

      .detail-ul-p {
        display: flex;
        align-items: center;

        & :nth-child(1) {
          margin-right: 3px;
        }

        & :nth-child(2) {
          margin-right: 3px;
        }
      }
    }

    .detail-base-info-edited-div {
      justify-content: space-between;

      .detail-base-info-edited-img {
        display: flex;
        align-items: center;
      }
    }
  }

</style>