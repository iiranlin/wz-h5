<template>
  <div v-if="materialCirculationDetailsTableDTOS.length">
    <div class="box-container" v-for="(item, index) in materialCirculationDetailsTableDTOS" :key="index">
      <div>
        <ul class="detail-ul">
          <li>
            <span>物资名称：</span>
            <span>{{ item.materialName }}</span>
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
            <span>{{ item.planAmount }}</span>
          </li>
          <li>
            <span>本次发货数量：</span>
            <span>{{ item.sendTotal }}</span>
          </li>
          <li>
            <span>包装形式：</span>
            <span>{{ item.packagingFm }}</span>
          </li>
          <li>
            <span>生产日期：</span>
            <span>{{ parseTime(item.manufactureDate, '{y}-{m}-{d}') }}</span>
          </li>
          <li>
            <span>有效期截止日期：</span>
            <span>{{ parseTime(item.expirationDate, '{y}-{m}-{d}') }}</span>
          </li>
          <li>
            <span>使用地点：</span>
            <span>{{ item.addr }}</span>
          </li>
          <li>
            <span>供应时间：</span>
            <span>{{ parseTime(item.supplyDate, '{y}-{m}-{d}') }}</span>
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
          <li>
            <span>合格证附件：</span>
            <span @click="imgClick" class="img-text">{{ item.fileByList | filterFiles('hgz') }}</span>
          </li>
          <li>
            <span>厂检报告附件：</span>
            <span @click="imgClick" class="img-text">{{ item.fileByList | filterFiles('cjbg') }}</span>
          </li>
          <li>
            <span>备注：</span>
            <span>{{ item.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <van-popup v-model="showPopup" position="bottom">
      <van-image-preview v-model="showImg" :images="images" :startPosition="startPosition" :loop="false" @close="showPopup = false"/>
    </van-popup>
  </div>
  <van-empty v-else description="暂无数据" />
</template>
<script>
import indexMixin from '@/view/mixins'
import dt from '@/assets/img/img.png'
export default {
  name: 'DeliveryMaterialDetails',
  mixins: [indexMixin],
  props: {
    materialCirculationDetailsTableDTOS:{
      type: Array,
      default: []
    }
  },
  components: {},
  data() {
    return {
      showPopup: false,
      startPosition: 0,
      showImg: false,
      images: [dt]
    }
  },
  created() {
  },
  activated() {
  },
  methods: {
    imgClick() {
      this.showImg = true
      this.showPopup = true
    }
  },
}
</script>
<style lang="less" scoped>
.box-container {
  box-shadow: none;
  border: 1px solid #e9e9e9;

  .detail-ul {
    li {
      span {
        width: auto !important;
        font-size: 12px;
      }
      .img-text{
        color: #0689ff;
      }
    }
  }
}
</style>