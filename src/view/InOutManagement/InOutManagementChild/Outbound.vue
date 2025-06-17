<template>
  <div class="outbound">
    <div class="outbound-mian">
      <van-form @submit="outboundClick" label-align="left" label-width="180px">
        <div class="box-container" style="margin-top: 20px;">
          <div>
            <ul class="detail-ul">
              <li>
                <span>需求名称：</span>
                <span>南京枢纽(江北地区)和南通地区工程</span>
              </li>
              <li>
                <span>需求项目：</span>
                <span>南京枢纽(江北地区)和南通地区工程</span>
              </li>
              <li>
                <span>需求组织：</span>
                <span>施工单位名称</span>
              </li>
              <template v-if="queryType === 'submit'">
                <van-field v-model="formData.num" name="领用单位" label="领用单位：" placeholder="请输入领用单位" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入领用单位' }]" />
                <van-field v-model="formData.name" name="领料人" label="领料人：" placeholder="请输入领料人" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入领料人' }]" />
                <van-field v-model="formData.name" name="领料日期" label="领料日期：" placeholder="请输入领料日期" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入领料日期' }]" />
                <van-field v-model="formData.name" name="发料人" label="发料人：" placeholder="请输入发料人" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入发料人' }]" />
                <!-- <van-field v-model="formData.name" name="领料单" label="领料单" placeholder="请输入领料单" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入领料单' }]" /> -->
                <van-field v-model="formData.uploader" name="uploader" label="领料单：" class="outbound-field-uploader" required :rules="[{ required: true, message: '请上传领料单' }]">
                  <template #input>
                    <van-uploader>
                      <van-button round type="info" class="outbound-uploader">上传</van-button>
                    </van-uploader>
                  </template>
                </van-field>
              </template>
              <template v-else>
                <li>
                  <span>领用单位：</span>
                  <span>领用单位领用单位领用单位</span>
                </li>
                <li class="li-item-both li-item-overlength">
                  <div class="li-item-left">
                    <span>领料人：</span>
                    <span>领料人</span>
                  </div>
                  <div class="li-item-right">
                    <span>领料日期：</span>
                    <span>2025-06-04</span>
                  </div>
                </li>
                <li class="li-item-overlength">
                  <span>发料人：</span>
                  <span>发料人</span>
                </li>
                <li class="li-item-overlength">
                  <span>领料单：</span>
                  <span @click="imgClick" class="li-span-click">XXXXX领料单.pdf</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div class="select-materials-search">
          <p class="select-materials-search-p font-weight">物资明细（共7项）</p>
        </div>
        <div class="box-container">
          <div>
            <ul class="detail-ul">
              <li>
                <span>供应商：</span>
                <span>供应商供应商供应商供应商</span>
              </li>
              <li>
                <span>物资名称：</span>
                <span>物资名称物资名称物资名称</span>
              </li>
              <li>
                <span>规格型号：</span>
                <span>规格型号规格型号规格型号</span>
              </li>
              <li class="li-item-both">
                <div class="li-item-left">
                  <span>计量单位：</span>
                  <span>套</span>
                </div>
                <div class="li-item-right">
                  <span>需求数量：</span>
                  <span>5</span>
                </div>
              </li>
              <li class="li-item-overlength">
                <span>当前库存数量：</span>
                <span>5</span>
              </li>
              <li class="li-item-both">
                <div class="li-item">
                  <span>生产日期：</span>
                  <span class="li-span-red">2025-6-1</span>
                </div>
                <div class="li-item">
                  <span>有效截止日期：</span>
                  <span class="li-span-red">2026-6-1</span>
                </div>
              </li>
              <template v-if="queryType === 'submit'">
                <!-- <van-form @submit="outboundClick" label-align="right" label-width="145px" v-if="queryType === 'submit'"> -->
                <van-field class="outbound-field-text" v-model="formData.num" name="本次出库数量" label="本次出库数量：" placeholder="请输入入库数量" input-align="right" label-width="252px" />
                <van-field class="outbound-field-text" v-model="formData.name" name="备注" label="备注：" placeholder="请输入备注" input-align="right" label-width="110px"/>
                <!-- </van-form> -->
              </template>
              <template v-else>
                <li class="li-item-overlength">
                  <span>本次出库数量：</span>
                  <span>10</span>
                </li>
                <li class="li-item-overlength">
                  <span>备注：</span>
                  <span>备注备注备注</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </van-form>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="previewClick" v-if="queryType === 'submit'">预览</van-button>
      <van-button class="button-info" round type="info" @click="outboundClick" v-if="queryType === 'save'">确定出库</van-button>
    </div>
    <van-popup v-model="showPopup" position="bottom">
      <van-image-preview v-model="showImg" :images="images" :startPosition="startPosition" :loop="false"
        @close="showPopup = false" />
    </van-popup>
  </div>
</template>
<script>
import dt from '@/assets/img/dt.png';
export default {
  name: 'Outbound',
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
    previewClick () {
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
    padding-bottom: 50px;
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
  .van-cell--required::before{
    left: 4px;
  }
  ::v-deep .outbound-field-uploader{
    &:before{
      top: 16px;
    }
    .van-field__label{
      line-height: 35px;
    }
  }
  .van-field__control--custom{
    .outbound-uploader{
      min-width: 80px;
      height: 25px;
    }
  }
  ::v-deep .outbound-field-text{
    padding-left: 0;
  }
}
</style>