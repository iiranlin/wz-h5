<template>
  <div class="outbound">
    <div class="outbound-mian">
      <van-form @submit="outboundClick" label-align="left" label-width="180px">
        <div class="box-container" style="margin-top: 20px;">
          <div>
            <ul class="detail-ul">
              <li>
                <span>需求名称：</span>
                <span>{{detailInfo.planName}}</span>
              </li>
              <li>
                <span>需求项目：</span>
                <span>{{detailInfo.sectionName}}</span>
              </li>
              <li>
                <span>需求组织：</span>
                <span>{{detailInfo.deptName}}</span>
              </li>
              <template v-if="queryType === 'submit'">
                <van-field v-model="formData.receiveDeptName" name="领用单位" label="领用单位：" placeholder="请输入领用单位" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入领用单位' }]" />
                <van-field v-model="formData.pickUserName" name="领料人" label="领料人：" placeholder="请输入领料人" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入领料人' }]" />
                <van-field v-model="formData.pickDate" 
                  label="领料日期："
                  required
                  input-align="right"
                  readonly 
                  clickable 
                  name="领料日期" 
                  :rules="[{ required: true, message: '请选择领料日期' }]"
                  placeholder="请选择领料日期" 
                  @click="showsTimePop=true" />
                <van-field v-model="formData.useLocation" name="使用地点" label="使用地点：" placeholder="请输入使用地点" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入使用地点' }]" />
                <van-field v-model="formData.issueUserName" name="发料人" label="发料人：" placeholder="请输入发料人" required clearable
                  input-align="right" :rules="[{ required: true, message: '请输入发料人' }]" />
                <van-field v-model="formData.uploader" name="uploader" label="领料单：" class="outbound-field-uploader" required :rules="[{ required: true, message: '请上传领料单' }]">
                  <template #input>
                    <van-uploader
                      :preview-imag='false'
                      :after-read="afterReadTransfer"
                      :before-read="beforeRead"
                      accept="">
                      <van-button round type="info" class="outbound-uploader">上传</van-button>
                    </van-uploader>
                  </template>
                </van-field>
              </template>
              <template v-else>
                <li>
                  <span>领用单位：</span>
                  <span>{{formData.receiveDeptName}}</span>
                </li>
                <li>
                  <span>领料人：</span>
                  <span>{{formData.pickUserName}}</span>
                </li>
                <li>
                  <span>领料日期：</span>
                  <span>{{formData.pickDate}}</span>
                </li>
                <li>
                  <span>使用地点：</span>
                  <span>{{formData.useLocation}}</span>
                </li>
                <li>
                  <span>发料人：</span>
                  <span>{{formData.issueUserName}}</span>
                </li>
                <li>
                  <span>领料单：</span>
                  <span class="li-span-click">{{file.fileName}}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div class="select-materials-search">
          <p class="select-materials-search-p font-weight">物资明细（共{{detailList.length}}项）</p>
        </div>
        <div class="box-container" v-for="(item,index) in detailList" :key="index">
          <div class="div-parent">
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
                <span>需求数量：</span>
                <span>{{item.planAmount}}</span>
              </li>
              <li class="li-item-overlength">
                <span>当前库存数量：</span>
                <span>{{item.stockStatus}}</span>
              </li>
            </ul>
          </div>
          <div class="div-child">
            <ul class="detail-ul">
              <li>
                <span>入库单号：</span>
                <span></span>
              </li>
              <li class="li-item-overlength">
                <span>当前库存数量：</span>
                <span></span>
              </li>
              <li>
                <span>生产日期：</span>
                <span></span>
              </li>
              <li class="li-item-overlength">
                <span>有效期截至日期：</span>
                <span></span>
              </li>
              <template v-if="queryType === 'submit'">
                <van-field class="outbound-field-text" v-model="formData.num" name="出库数量" label="出库数量：" placeholder="请输入出库数量" input-align="right" label-width="252px" />
                <van-field class="outbound-field-text" v-model="formData.name" name="备注" label="备注：" placeholder="请输入备注" input-align="right" label-width="110px"/>
              </template>
            </ul>
          </div>
              <!-- <li class="li-item-both li-item-overlength">
                <div class="li-item-left">
                  <span>入库单号：</span>
                  <span>RK202506260001</span>
                </div>
                <div class="li-item-right">
                  <span>当前库存数量：</span>
                  <span>5</span>
                </div>
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
              </li> -->
              <!-- <template v-if="queryType === 'submit'"> -->
                <!-- <van-form @submit="outboundClick" label-align="right" label-width="145px" v-if="queryType === 'submit'"> -->
                <!-- <van-field class="outbound-field-text" v-model="formData.num" name="本次出库数量" label="本次出库数量：" placeholder="请输入入库数量" input-align="right" label-width="252px" />
                <van-field class="outbound-field-text" v-model="formData.name" name="备注" label="备注：" placeholder="请输入备注" input-align="right" label-width="110px"/> -->
                <!-- </van-form> -->
              <!-- </template>
              <template v-else>
                <li class="li-item-overlength">
                  <span>本次出库数量：</span>
                  <span>10</span>
                </li>
                <li class="li-item-overlength">
                  <span>备注：</span>
                  <span>备注备注备注</span>
                </li>
              </template> -->
        </div>
      </van-form>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="previewClick('save')" v-if="queryType === 'submit'">预览</van-button>
      <van-button class="button-info" round type="info" @click="previewClick('submit')" v-if="queryType === 'save'">上一步</van-button>
      <van-button class="button-info" round type="info" @click="outboundClick" v-if="queryType === 'save'">确定出库</van-button>
    </div>
    <van-calendar v-model="showsTimePop" 
      @confirm="timeConfirm">
    </van-calendar>
  </div>
</template>
<script>
import dt from '@/assets/img/img.png';
import {materialDemandPlanRestDetailOut} from '@/api/prodmgr-inv/materialDemandPlanRest'
import {minioUpload} from '@/api/blcd-base/minio'

export default {
  name: 'Outbound',
  components: {},
  data() {
    return {
      id:'',
      queryType: '',
      detailInfo:{},
      detailList:[],
      showsTimePop: false, 

      formData: {
        receiveDeptName: '',  //领用单位
        pickUserName: '',   //领料人
        pickDate: '',   //领料日期
        useLocation: '',   //使用地点
        issueUserName: '',   //发料人
        uploader: null
      },
      file:{},



      showPopup: false,
      startPosition: 0,
      showImg: false,
      images: [dt]
    }
  },
  created() {
    this.queryType = this.$route.query.type
    this.id = this.$route.query.id

    this.getDetail();
  },
  activated() {

  },
  methods: {
    getDetail(){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialDemandPlanRestDetailOut(this.id).then(({ data }) => {
        this.detailInfo = data;
        this.detailList = data.details;
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    previewClick (type) {
      console.log(this.formData)
      this.queryType = type
    },
    outboundClick() {
      this.$toast('出库成功');
      this.$router.push({ path: '/InOutManagementList' })
    },
    imgClick() {
      this.showImg = true
      this.showPopup = true
    },
    //领料日期选择回调
    timeConfirm(value){
      this.formData.pickDate = this.parseTime(value, '{y}-{m}-{d}');
      this.showsTimePop = false;
    },
    //附件上传前
    beforeRead(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isFileName = file.name.length < 90;

      if (!isLt10M) {
        this.$notify({
          type: 'warning',
          message: '上传文件大小不能超过 10MB!',
        });
        return false;
      }
      if (!isFileName) {
        this.$notify({
          type: 'warning',
          message: '上传文件名过长!',
        });
        return false;
      }
      return true;
    },
    //校验附件上传
    afterReadTransfer(file){
      let formData = new FormData();
      formData.append("file", file.file);
      formData.append("businessType","01");
      formData.append("key",file.file.name);
      
      file.status = 'uploading';
      file.message = '上传中...';

      minioUpload(formData).then(({data}) => {
        this.$notify({
          type: 'success',
          message: "上传成功"
        });
        this.file = data;
      }).catch((err) => {
        this.$notify({
          type: 'warning',
          message: "上传失败"
        });
      })
    },
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
  ::v-deep .van-field__body {
    float: right;
  }
  .div-parent {
    padding-bottom: 5px;
    border-bottom: 1px solid #f3f5f7;
  }
  .div-child {
    margin-top: 10px;
  }
}
</style>