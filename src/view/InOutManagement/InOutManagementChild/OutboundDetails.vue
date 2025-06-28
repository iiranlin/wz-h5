<template>
  <div class="outbound">
    <div class="outbound-mian">
      <div class="box-container" style="margin-top: 20px;">
        <div>
          <ul class="detail-ul">
            <li>
              <span>出库单号：</span>
              <span>CK2025050007</span>
            </li>
            <li class="li-item-overlength">
              <span>需求编号：</span>
              <span>XQ2025050007</span>
            </li>
            <li>
              <span>需求名称：</span>
              <span>需求名称需求名称需求名称</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>需求组织需求组织需求组织需求组织</span>
            </li>
            <li>
              <span>领用单位：</span>
              <span>领用单位领用单位领用单位</span>
            </li>
            <li class="li-item-both li-item-overlength">
              <div class="li-item-left">
                <span>发料人：</span>
                <span>发料人</span>
              </div>
              <div class="li-item-right">
                <span>领料人：</span>
                <span>领料人</span>
              </div>
            </li>
            <li>
              <span>领料日期：</span>
              <span>2025-06-04</span>
            </li>
            <li class="li-item-overlength">
              <span>领料单：</span>
              <span @click="imgClick" class="li-span-click">XXXXX领料单.pdf</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">物资明细（共7项）</p>
      </div>
      <div class="box-container">
        <div>
          <ul class="detail-ul">
            <li class="li-item-overlength">
              <span>供应商：</span>
              <span>供应商供应商供应商供应商</span>
            </li>
            <li>
              <span class="font-weight">物资名称：</span>
              <span class="font-weight">物资名称物资名称物资名称</span>
            </li>
            <li>
              <span>规格型号：</span>
              <span>规格型号规格型号规格型号</span>
            </li>
            <li>
              <span>计量单位：</span>
              <span>套</span>
            </li>
            <li class="li-item-both">
              <div class="li-item">
                <span>生产日期：</span>
                <span>2025-6-1</span>
              </div>
              <div class="li-item">
                <span>有效截止日期：</span>
                <span>2026-6-1</span>
              </div>
            </li>
            <li class="li-item-overlength">
              <span>本次出库数量：</span>
              <span>10</span>
            </li>
            <li class="li-item-overlength">
              <span>备注：</span>
              <span>备注备注备注</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <van-popup v-model="showPopup" position="bottom">
      <van-image-preview v-model="showImg" :images="images" :startPosition="startPosition" :loop="false"
        @close="showPopup = false" />
    </van-popup>
  </div>
</template>
<script>
import dt from '@/assets/img/img.png';
export default {
  name: 'OutboundDetails',
  components: {},
  data() {
    return {
      queryType: '',
      activeKey: 0,
      menuActiveIndex: '',
      formData: {
        num: '',
        name: '',
        uploader: null
      },

      showPopup: false,
      startPosition: 0,
      showImg: false,
      images: [dt]
    }
  },
  created() {
    this.queryType = this.$route.query.type
  },
  activated() {
  },
  methods: {
    activeKeyChange() {
      console.log(this.activeKey)
    },
    previewClick() {
      this.queryType = 'save'
    },
    outboundClick() {
      this.$toast('出库成功');
      this.$router.push({ path: '/InOutManagementList' })
    },
    imgClick() {
      this.showImg = true
      this.showPopup = true
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