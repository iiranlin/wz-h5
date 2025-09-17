<template>
  <div v-if="materialCirculationDetailsTableDTOS.length" class="deliveryMaterial-details">
    <div class="box-container" v-for="(item, index) in materialCirculationDetailsTableDTOS" :key="index">
      <div>
        <ul class="detail-ul">
          <li>
            <span class="font-weight">{{ index+1 }}.{{ item.materialName }}</span>
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
            <span>本次计划数量：</span>
            <span class="li-span-click">{{ item.planAmount }} {{ item.unit }}</span>
          </li>
          <li>
            <span>本次发货数量：</span>
            <span class="li-span-click">{{ item.sendTotal }} {{ item.unit }}</span>
          </li>
          <li>
            <span>包装形式：</span>
            <span>{{ item.packagingFm }}</span>
          </li>
          <li>
            <span>生产日期：</span>
            <span>{{ item.manufactureDate && parseTime(item.manufactureDate, '{y}-{m}-{d}') }}</span>
          </li>
          <li>
            <span>有效期截止日期：</span>
            <span>{{ item.expirationDate && parseTime(item.expirationDate, '{y}-{m}-{d}') }}</span>
          </li>
          <li>
            <span>使用地点：</span>
            <span>{{ item.addr }}</span>
          </li>
          <li>
            <span>供应时间：</span>
            <span>{{ item.supplyDate && parseTime(item.supplyDate, '{y}-{m}-{d}') }}</span>
          </li>
          <li>
            <span>收货地址：</span>
            <span>{{ item.field2 }}</span>
          </li>
          <li>
            <span>收货人及联系方式：</span>
            <span>{{ item.receiver }}</span>
          </li>
          <li>
            <span>投资方：</span>
            <span>{{ item.field0 }}</span>
          </li>
          <li>
            <span>投资比例：</span>
            <span>{{ item.field1 }}</span>
          </li>
          <!-- <li>
            <span>合格证附件：</span>
            <span @click="imgClick(item)" class="img-text" v-for="item in filterList(item.fileByList, 'hgz')"
              :key="item.filePath">{{ item.fileName }}</span>
          </li>
          <li>
            <span>厂检报告附件：</span>
            <span @click="imgClick(item)" class="img-text" v-for="item in filterList(item.fileByList, 'cjbg')"
              :key="item.filePath">{{ item.fileName }}</span>
          </li> -->
          <li>
            <span>备注：</span>
            <span>{{ item.remark }}</span>
          </li>
        </ul>
        <div class="detail-title-contentA">
          <img src="/static/icon-file.png">
          <span>附件</span>
        </div>
        <file-download-view class="outbound-field-uploader" title="合格证附件"
          :fileList="filterList(item.fileByList, 'hgz') || []" />
        <file-download-view class="outbound-field-uploader" title="厂检报告附件"
          :fileList="filterList(item.fileByList, 'cjbg') || []" />
      </div>
    </div>
    <!-- 附件预览 -->
    <!-- <file-preview ref="filePreview"></file-preview> -->
  </div>
  <van-empty image="/empty-image-default.png" v-else description="暂无数据" />
</template>
<script>
import indexMixin from '@/view/mixins'
// import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue"
export default {
  name: 'DeliveryMaterialDetails',
  mixins: [indexMixin],
  props: {
    materialCirculationDetailsTableDTOS: {
      type: Array,
      default: []
    }
  },
  // components: { FilePreview },
  components: { FileDownloadView },
  data() {
    return {
    }
  },
  created() {
  },
  activated() {
  },
  methods: {
    // imgClick({ fileName, filePath }) {
    //   this.$refs.filePreview.init(fileName, filePath)
    // }
  },
}
</script>
<style lang="less" scoped>
.deliveryMaterial-details{
  background: #fff;
}
.box-container {
  box-shadow: none;
  padding: 0;
  border-bottom: 0.5px solid #e3e3e3;
  border-radius: inherit;

  .detail-ul {
    padding: 4px;
    li {
      span {
        width: auto !important;
        font-size: 12px;
      }

      .img-text {
        color: #0689ff;
      }
    }
  }
  .detail-title-contentA {
    width: 100%;
    height: 34px;
    display: flex;
    align-items: center;
    padding-left: 2px;
    padding-right: 27px;
    box-sizing: border-box;
    border-top: 1px solid #f1f4f8;

    img {
      width: 25px;
      height: 25px;
    }

    & span:nth-child(2) {
      margin-left: 6px;
      color: #151b3e;
      font-size: 15px;
      font-weight: 600;
    }

    & span:nth-child(3) {
      color: #151b3e;
      font-size: 15px;
      font-weight: 600;
    }
  }
}
</style>