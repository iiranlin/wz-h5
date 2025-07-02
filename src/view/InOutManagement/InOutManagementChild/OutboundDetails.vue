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
            <li class="li-item-overlength">
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
              <span>领料单：</span>
              <span @click="imgClick()" class="li-span-click" v-if="fileList.length > 0">{{fileList[0].fileName}}</span>
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
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">物资明细（共{{detailList.length}}项）</p>
      </div>
      <div class="box-container" v-for="(item,index) in detailList" :key="index">
        <div>
          <ul class="detail-ul">
            <li>
              <span>供应商：</span>
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
            <li>
              <span>备注：</span>
              <span>{{item.remark}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 附件预览 -->
    <file-preview ref="filePreview"></file-preview>
  </div>
</template>
<script>
import {materialSupplierOutRestDetail} from '@/api/prodmgr-inv/materialDemandPlanRest'
import FilePreview from "@/components/FilePreview.vue";

export default {
  name: 'OutboundDetails',
  components: {FilePreview},

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