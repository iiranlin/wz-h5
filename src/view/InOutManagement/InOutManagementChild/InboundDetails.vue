<template>
  <div class="default-containerA">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>需求名称：</span>
        <span>{{detailInfo.planName}}</span>
      </div>
      <div>
        <ul class="detail-ul">
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
     <div class="detail-base-info detail-base-info-edited" v-if="fileList.length">
          <div class="detail-title-content">
            <img src="/static/icon-file.png" />
            <span>报检信息</span>
          </div>
          <file-download-view :fileList="fileList"></file-download-view>
        </div>
    <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>物资明细（共{{detailList.length}}项）</span>
    </div>
    <div class="box-container" v-for="(item,index) in detailList" :key="index">
      <div @click="detailsClick(item)">
        <div class="detail-list-title-content">
            <span>物资名称：</span>
            <span>{{item.materialName}}</span>
        </div>
        <ul class="detail-list-ul">
          <li>
            <span>供应商：</span>
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
          <li>
            <span>生产日期：</span>
            <span>{{item.manufactureDate && parseTime(item.manufactureDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li class="li-item-overlength">
            <span>有效截止日期：</span>
            <span>{{item.expirationDate && parseTime(item.expirationDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次出库数量：</span>
            <span class="li-span-click">{{item.outTotal}}</span>
          </li>
          <li class="li-item-remark">
            <span>备注：</span>
            <div class="remark-detail">{{item.remark || '未填写'}}</div>
          </li>
        </ul>
      </div>
    </div>


    <!-- 附件预览 -->
    <file-preview ref="filePreview"/>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import {detailStoreBack} from '@/api/prodmgr-inv/materialStoreTableRest'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import BackToTop from '@/components/BackToTop'

export default {
  //入库详情
  name: 'InboundDetails',
  components: {FilePreview,FileDownloadView,BackToTop},

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
      detailStoreBack(this.id).then(({ data }) => {
        this.detailInfo = data;
        this.detailList = data.materialCirculationDetailsTableDTOS;
        this.fileList = JSON.parse(data.fileByList).jcbg;

        // this.fileList = [...this.fileList,...this.fileList]
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    imgClick() {
      this.$refs.filePreview.init(this.fileList[0].fileName, this.fileList[0].filePath)
    },
    detailsClick (item) {
      console.log(item)
      this.$router.push({name: 'InboundMaterialDetails', query: {id: item.id}, params: item})
    }
  }
}
</script>
<style lang="less" scoped>
.default-containerA {
  padding-bottom: 20px;
}
.box-container {
  padding: 0px;
}
</style>