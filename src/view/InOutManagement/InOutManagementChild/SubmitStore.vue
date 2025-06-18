<template>
  <div class="submit-store-view">
    <div class="submit-store-view-mian">
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
            <li class="li-item-both" v-if="queryType === 'view'">
              <div class="li-item-left">
                <span>入库时间：</span>
                <span>2025-06-03</span>
              </div>
              <div class="li-item-right">
                <span>操作人：</span>
                <span>name</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">收货明细（共7项）</p>
      </div>
      <div class="box-container">
        <div>
          <ul class="detail-ul">
            <li>
              <span>物资名称：</span>
              <span>物资名称物资名称</span>
            </li>
            <li>
              <span>规格型号：</span>
              <span>规格型号</span>
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
              <span>本次收货数量：</span>
              <span>5</span>
            </li>
            <li class="li-item-both">
              <div class="li-item">
                <span>生产日期：</span>
                <span>2025-6-1</span>
              </div>
              <div class="li-item">
                <span>有效截止日期：</span>
                <span class="li-span-red">2026-6-1</span>
              </div>
            </li>
            <li>
              <span>包装方式：</span>
              <span>捆包</span>
            </li>
            <li>
              <span>收货地址：</span>
              <span>收货地址收货地址</span>
            </li>
            <li class="li-item-overlength">
              <span>收货人及联系方式：</span>
              <span>name 18111111111</span>
            </li>
            <li>
              <span>供应时间：</span>
              <span>2025-6-1</span>
            </li>
            <li>
              <span>投资方：</span>
              <span>投资方</span>
            </li>
            <li>
              <span>投资比例：</span>
              <span>投资比例</span>
            </li>
            <li class="li-item-overlength">
              <span>合格证附件：</span>
              <span @click="imgClick" class="li-span-click">XXXXX.pdf</span>
            </li>
            <li>
              <span>厂检附件：</span>
              <span @click="imgClick" class="li-span-click">XXXXX.pdf</span>
            </li>
            <van-form @submit="onSubmit" label-align="right" label-width="145px" v-if="queryType === 'submit'">
              <van-field v-model="formData.num" name="入库数量" label="入库数量" placeholder="请输入入库数量" input-align="right" />
              <van-field v-model="formData.name" name="退货数量" label="退货数量" placeholder="请输入退货数量" input-align="right" />
            </van-form>
            <template v-else>
              <li class="li-item-both">
                <div class="li-item-left">
                  <span>入库数量：</span>
                  <span>10</span>
                </div>
                <div class="li-item-right">
                  <span>退货数量：</span>
                  <span>10</span>
                </div>
              </li>
            </template>
            <li>
              <span>退货附件：</span>
              <span @click="imgClick" class="li-span-click">XXXXX.pdf</span>
            </li>
            <li class="li-item-overlength">
              <span>备注：</span>
              <span>备注备注备注备注</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">报检信息</p>
      </div>
      <div class="box-container">
        <div>
          <ul class="detail-ul">
            <li>
              <span>检测报告：</span>
              <span @click="imgClick" class="li-span-click">XXXXX.pdf</span>
            </li>
            <li class="li-item-overlength">
              <span>质量证明文件：</span>
              <span @click="imgClick" class="li-span-click">XXXXX.pdf</span>
            </li>
            <li>
              <span>报验结果：</span>
              <span @click="imgClick" class="li-span-click">XXXXX.pdf</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="default-button-container" v-if="queryType === 'submit'">
      <van-button class="button-info" round type="info" @click="onSubmit">提交入库审核</van-button>
    </div>
    <van-popup v-model="showPopup" position="bottom">
      <van-image-preview v-model="showImg" :images="images" :startPosition="startPosition" :loop="false" @close="showPopup = false"/>
    </van-popup>
  </div>
</template>
<script>
import dt from '@/assets/img/img.png';
export default {
  name: 'SubmitStore',
  components: {},
  data() {
    return {
      queryType: '',
      activeKey: 0,
      menuActiveIndex: '',
      formData: {
        num: '',
        name: ''
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
    onSubmit () {
      this.$toast('提交入库审核成功');
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
.submit-store-view {
  width: 100%;
  height: 100%;

  .submit-store-view-mian{
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

  ::v-deep .van-field__label{
    color: #272b31;
  }
  .default-button-container{
    .button-info {
      min-width: 150px;
    }
  }
}
</style>