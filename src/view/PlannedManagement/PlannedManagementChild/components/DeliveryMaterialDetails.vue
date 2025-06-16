<template>
  <div>
    <div class="box-container" v-for="(item, index) in 5" :key="index">
      <div>
        <ul class="detail-ul">
          <li>
            <span>物资名称：</span>
            <span>计算机联锁设备</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>2x2取2s10</span>
          </li>
          <li>
            <span>计量单位：</span>
            <span>套</span>
          </li>
          <li>
            <span>本次计划数量：</span>
            <span>10</span>
          </li>
          <li>
            <span>本次发货数量：</span>
            <span>4</span>
          </li>
          <li>
            <span>生产日期：</span>
            <span>2025-07-15</span>
          </li>
          <li>
            <span>有效期截止日期：</span>
            <span>2025-07-15</span>
          </li>
          <li>
            <span>供应时间：</span>
            <span>2025年6月12日</span>
          </li>
          <li>
            <span>包装形式：</span>
            <span>捆包</span>
          </li>
          <li>
            <span>收货地址：</span>
            <span>华庄/永津路/高里东/浦口北</span>
          </li>
          <li>
            <span>收货人及联系方式：</span>
            <span>name 15888888888</span>
          </li>
          <li>
            <span>投资方：</span>
            <span>公司名称公司名称公司名称公</span>
          </li>
          <li>
            <span>投资比例：</span>
            <span>40%;60%</span>
          </li>
          <li>
            <span>合格证附件：</span>
            <span @click="imgClick" class="img-text">合格证附件/xxxxx.pdf</span>
          </li>
          <li>
            <span>厂检报告附件：</span>
            <span @click="imgClick" class="img-text">合格证附件/xxxxx.pdf</span>
          </li>
          <li>
            <span>备注：</span>
            <span>备注内容备注内容备注内容备</span>
          </li>
        </ul>
      </div>
    </div>
    <van-popup v-model="showPopup" position="bottom">
      <van-image-preview v-model="showImg" :images="images" :startPosition="startPosition" :loop="false" @close="showPopup = false"/>
    </van-popup>
  </div>
</template>
<script>
import dt from '@/assets/img/dt.png';
export default {
  name: 'DeliveryMaterialDetails',
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