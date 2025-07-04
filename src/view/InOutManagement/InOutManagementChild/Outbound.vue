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
                  input-align="right"/>
                <van-field v-model="formData.pickUserName" name="领料人" label="领料人：" placeholder="请输入领料人" required clearable
                  input-align="right"/>
                <van-field v-model="formData.pickDate" 
                  label="领料日期："
                  required
                  input-align="right"
                  readonly 
                  clickable 
                  name="领料日期" 
                  placeholder="请选择领料日期" 
                  @click="showsTimePop=true" />
                <van-field v-model="formData.useLocation" name="使用地点" label="使用地点：" placeholder="请输入使用地点" required clearable
                  input-align="right"/>
                <van-field v-model="formData.issueUserName" name="发料人" label="发料人：" placeholder="请输入发料人" required clearable
                  input-align="right"/>
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
              </template>
            </ul>
          </div>
        </div>
        <div class="box-container">
          <div class="detail-title-info">
            <img src="/static/icon-file.png"/>
            <span class="info-title">附件</span>
          </div>
          <file-upload-view v-if="queryType === 'submit'" title="领料单" :fileList="fileList" businessType="01"/>
          <file-download-view v-else title="领料单" :fileList="fileList"/>
        </div>
        <div class="select-materials-search">
          <p class="select-materials-search-p font-weight">物资明细（共{{detailList.length}}项）</p>
          <van-search v-model="searchValue" placeholder="输入规格型号" background="center" @search="onSearch" />
        </div>
        <div v-for="(item,index) in filteredList" :key="index">
          <div class="box-container" v-if="checkParent(item)">
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
            <div class="div-child" v-for="(childItem,childIndex) in item.childList" :key="childIndex">
              <ul class="detail-ul" v-if="checkChild(childItem)">
                <li>
                  <span>入库单号：</span>
                  <span>{{childItem.storeNumber}}</span>
                </li>
                <li class="li-item-overlength">
                  <span>当前库存数量：</span>
                  <span>{{childItem.remainingStock}}</span>
                </li>
                <li>
                  <span>生产日期：</span>
                  <span>{{parseTime(childItem.manufactureDate,'{y}-{m}-{d}')}}</span>
                </li>
                <li class="li-item-overlength">
                  <span>有效期截至日期：</span>
                  <span>{{parseTime(childItem.expirationDate,'{y}-{m}-{d}')}}</span>
                </li>
                <template v-if="queryType === 'submit'">
                  <van-field class="outbound-field-text" v-model="childItem.outTotal" name="出库数量" label="出库数量：" placeholder="请输入出库数量" input-align="right" label-width="252px" />
                  <van-field class="outbound-field-text" v-model="childItem.remark" name="备注" label="备注：" placeholder="请输入备注" input-align="right" label-width="110px"/>
                </template>
                <template v-if="queryType === 'save'">
                  <li>
                    <span>出库数量：</span>
                    <span>{{childItem.outTotal}}</span>
                  </li>
                  <li>
                    <span>备注：</span>
                    <span>{{childItem.remark}}</span>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
        <van-empty v-if="filteredList.length == 0" description="暂无数据" />
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
    <!-- 附件预览 -->
    <file-preview ref="filePreview"></file-preview>
  </div>
</template>
<script>
import {materialDemandPlanRestDetailOut,
materialCirculationDetailsTableRestListByPlanDetailId,
materialSupplierOutRestSaveOut} from '@/api/prodmgr-inv/materialDemandPlanRest'
import {minioUpload} from '@/api/blcd-base/minio'
import FilePreview from "@/components/FilePreview.vue";
import FileUploadView from "@/components/FileUploadView.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";

export default {
  name: 'Outbound',
  components: {FilePreview,FileUploadView,FileDownloadView},

  computed: {
    filteredList() {
      if (!this.searchValue) return this.detailList; // 如果搜索值为空，返回所有数据
      return this.detailList.filter(item => item.specModel.includes(this.searchValue)); // 过滤匹配的数据项
    }
  },

  data() {
    return {
      id:'',
      queryType: '',
      detailInfo:{},
      detailList:[],
      showsTimePop: false, 
      searchValue: '',

      formData: {
        planName: '',     //需求名称
        sectionName: '',  //需求项目
        deptName: '',     //需求组织
        receiveDeptName: '',  //领用单位
        pickUserName: '',   //领料人
        pickDate: '',   //领料日期
        useLocation: '',   //使用地点
        issueUserName: '',   //发料人
      },
      fileList:[],
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
    //获取详情信息
    getDetail(){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialDemandPlanRestDetailOut(this.id).then(({ data }) => {
        this.detailInfo = data;
        this.detailList = data.details;

        this.formData.planName = data.planName;
        this.formData.sectionName = data.sectionName;
        this.formData.deptName = data.deptName;

        //获取子集
        this.detailList.forEach((item) => {
          if(item.stockStatus != '0'){
            this.getChildDetail(item);
          }
        })
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    //获取明细子集信息
    getChildDetail(item){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialCirculationDetailsTableRestListByPlanDetailId(item.id).then(({ data }) => {
        data.forEach((item) => {
          this.$set(item, 'outTotal', item.remainingStock);
        })
        this.$set(item, 'childList', data);
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    //领料日期选择回调
    timeConfirm(value){
      this.formData.pickDate = this.parseTime(value, '{y}-{m}-{d}');
      this.showsTimePop = false;
    },
    //物资明细搜索
    onSearch(){

    },
    //判断预览状态下明细父元素显示与否
    checkParent(item){
      if(this.queryType == 'submit'){
        return true
      }
      if(!item.childList){
        return false
      }
      let findResult = item.childList.some((childItem) => {
        return childItem.outTotal != '0' && !!childItem.outTotal;
      })
      return findResult
    },
    //判断预览状态下明细子元素显示与否
    checkChild(childItem){
      if(this.queryType == 'submit'){
        return true
      }
      return childItem.outTotal != '0' && !!childItem.outTotal;
    },
    //附件上传前
    beforeRead(file){
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
        let file = {
          fileName: data.fileName,
          filePath: data.filePath,
        }
        this.fileList.push(file);
      }).catch((err) => {
        this.$notify({
          type: 'warning',
          message: "上传失败"
        });
      })
    },
    //附件预览
    imgClick(){
      this.$refs.filePreview.init(this.fileList[0].fileName, this.fileList[0].filePath)
    },
    //附件删除
    handleFileDelete(){
      this.fileList = [];
    },
    //预览点击
    previewClick(type) {
      if(this.queryType == 'submit'){
        if(!this.formData.receiveDeptName){
            this.$notify({
                type: 'warning',
                message: '请输入领用单位!',
            });
            return
        }
        if(!this.formData.pickUserName){
            this.$notify({
                type: 'warning',
                message: '请输入领料人!',
            });
            return
        }
        if(!this.formData.pickDate){
            this.$notify({
                type: 'warning',
                message: '请选择领料日期!',
            });
            return
        }
        if(!this.formData.useLocation){
            this.$notify({
                type: 'warning',
                message: '请输入使用地点!',
            });
            return
        }
        if(!this.formData.issueUserName){
            this.$notify({
                type: 'warning',
                message: '请输入发料人!',
            });
            return
        }
        if(this.fileList.length == 0){
            this.$notify({
                type: 'warning',
                message: '请上传领料单!',
            });
            return
        }
        for (let i = 0; i < this.detailList.length; i++) {
          let childList = this.detailList[i].childList

          if(childList && childList.length> 0){
            for (let j = 0; j < childList.length; j++) {
              if(!childList[j].outTotal){
                this.$notify({
                  type: 'warning',
                  message: '出库数量不能为空!',
                });
                return
              }
              if(Number(childList[j].outTotal) > Number(childList[j].remainingStock)){
                this.$notify({
                  type: 'warning',
                  message: '出库数量不能大于当前库存数量!',
                });
                return
              }
            }
          }
        }
      }
      this.queryType = type
    },
    //出库点击
    outboundClick(){
      let fileObj = {
        lld: this.fileList,
      }
      let params = {
        materialSupplierOutDetailParams: this.detailList,
        fileByList: JSON.stringify(fileObj),
        fileList: this.fileList,
        id: this.id,
      }
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialSupplierOutRestSaveOut(Object.assign({}, this.formData,params)).then(({ message }) => {
        this.$notify({
            type: 'success',
            message: message
        });
        this.$router.push({ path: '/InOutManagementList' })
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
   
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
  .van-search {
    padding-top: 0;
    width: 165px;

    .van-search__content {
      border-radius: 50px;
      background: #fff;
    }

    .van-cell {
      border-radius: 50px;
      background: #fff;
      padding-left: 0px;
    }
  }

  .li-item-both {
    .li-item {
      flex: 1;
      width: auto !important;
    }
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
  .div-child {
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px solid #f3f5f7;
  }
  .li-span-click {
    word-wrap: break-word;
  }
  .outbound-uploader-delete {
    min-width: 80px;
    height: 25px;
    transform: translateY(5px);
  }
}
</style>