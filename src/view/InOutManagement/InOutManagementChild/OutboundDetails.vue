<template>
  <div class="default-container">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>需求名称：</span>
        <span>{{detailInfo.planName}}</span>
      </div>
      <div>
        <ul class="detail-ul">
          <li>
            <span>需求组织：</span>
            <span>{{detailInfo.deptName}}</span>
          </li>
          <li>
            <span>领用单位：</span>
            <span>{{detailInfo.receiveDeptName}}</span>
          </li>
          <li>
            <span>领料人：</span>
            <span>{{detailInfo.pickUserName}}</span>
          </li>
          <li>
            <span>使用地点：</span>
            <span>{{detailInfo.useLocation}}</span>
          </li>
          <li>
            <span>领料日期：</span>
            <span>{{parseTime(detailInfo.pickDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li>
            <span>出库单号：</span>
            <span>{{detailInfo.outNumber}}</span>
          </li>
          <li>
            <span>发料人：</span>
            <span>{{detailInfo.issueUserName}}</span>
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
            <span>供应商：</span>
            <span>{{item.sellerName}}</span>
        </div>
        <ul class="detail-list-ul">
          <li>
            <span>物资名称：</span>
            <span>{{item.materialName}}</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{item.specModel}}</span>
          </li>
          <li>
            <span>计量单位：</span>
            <span>{{item.unit}}</span>
          </li>
          <li>
            <span>生产日期：</span>
            <span>{{parseTime(item.manufactureDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li class="li-item-overlength">
            <span>有效截止日期：</span>
            <span>{{parseTime(item.expirationDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次出库数量：</span>
            <span>{{item.outTotal}}</span>
          </li>
          <li class="li-item-remark">
            <span>备注：</span>
            <div class="remark-detail">{{item.remark || '未填写'}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-floor-content">
      <img src="/static/icon-file.png"/>
      <span>附件</span>
    </div>
    <div class="box-container">
      <file-download-view title="领料单" :fileList="fileList"/>
    </div>
    <!-- 附件预览 -->
    <file-preview ref="filePreview"/>
  </div>
</template>
<script>
import {materialSupplierOutRestDetail} from '@/api/prodmgr-inv/materialDemandPlanRest'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";

export default {
  name: 'OutboundDetails',
  components: {FilePreview,FileDownloadView},

  data() {
    return {
      id: '',
      detailInfo:{},
      detailList:[],
      fileList:[],
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
      materialSupplierOutRestDetail(this.id).then(({ data }) => {
        this.detailInfo = data;
        this.detailList = data.materialSupplierOutDetailDTOS;
        this.fileList = JSON.parse(data.fileByList).lld;

        this.fileList = [...this.fileList,...this.fileList]
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    imgClick() {
      this.$refs.filePreview.init(this.fileList[0].fileName, this.fileList[0].filePath)
    }
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