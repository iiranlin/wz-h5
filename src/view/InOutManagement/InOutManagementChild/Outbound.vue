<template>
  <div class="detail-button-container">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ detailInfo.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>建设项目：</span>
            <span>{{ detailInfo.projectName }}</span>
          </li>
          <li>
            <span>标段项目：</span>
            <span>{{ detailInfo.sectionName }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ detailInfo.deptName }}</span>
          </li>
        </ul>
      </div>
    </div>
   <div class="detail-base-info detail-base-info-edited"  v-if="queryType === 'submit'">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-basic-information.png" />
        <span>基本信息</span>
      </div>
      <ul class="detail-list-ul-edited">
        <template>
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
              @click="handlerShowCalendar('calendar')" />
            <van-field v-model="formData.issueUserName" name="发料人" label="发料人：" placeholder="请输入发料人" required clearable
              input-align="right"/>
        </template>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited" v-else>
      <div class="detail-title-content">
        <img src="@/assets/img/icon-basic-information.png" />
        <span>基本信息</span>
      </div>
        <ul class="detail-info-ul">
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
              <span>发料人：</span>
              <span>{{formData.issueUserName}}</span>
            </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="queryType === 'submit'">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-place-of-use.png" />
        <span>使用地点</span>
      </div>
      <div class="detail-title-content-field">
        <van-field class="detail-base-info-edited-textarea" required v-model="formData.useLocation" rows="2" autosize
          type="textarea" placeholder="请输入使用地点" />
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-else>
      <div class="detail-title-content">
        <img src="@/assets/img/icon-place-of-use.png" />
        <span>使用地点</span>
      </div>
        <div class="detail-ul-text">
          <ul class="detail-ul">
            <li>
              <!-- <span>使用地点：</span> -->
              <span class="remark-detail">{{ formData.useLocation || '未填写' }}</span>
            </li>
          </ul>
        </div>
    </div>
    <div class="detail-base-info detail-base-info-edited" v-if="queryType === 'submit'">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>领料单</span>
      </div>
      <p class="box-container-p" v-if="!fileList.values?.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持PDF格式</p>
      <!-- <file-upload-view :fileList="sectionInfo.values || []" businessType="01" class="outbound-field-uploader" /> -->
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="fileList" businessType="01"/>
    </div>

    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;" v-else>
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>领料单</span>
      </div>
     <file-download-view :fileList="fileList"/>
    </div>


  <div class="detail-floor-content">
      <img src="@/assets/img/icon-logistics-information.png"/>
      <span>物资明细（共{{detailList.length}}项）</span>
      <van-search ref="getheight"
          v-model="searchValue" 
          placeholder="输入关键字搜索" 
          shape="round" 
          left-icon="none"
          background="#f2f4f8"
          @search="onSearch()">
          <template slot='right-icon'>
              <van-icon name="search" @click="onSearch()"/>
          </template>
      </van-search>
    </div>
    <div v-for="(item,index) in filteredList" :key="index">
      <div class="box-container" v-if="checkParent(item)">
        <div class="div-parent">
          <ul class="detail-list-ul">
            <li class="detail-list-ul-text">
              <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
              <img
                :src="item.planAmount && item.supplyDate && item.addr && item.field2 && item.receiver && item.field0 && item.field1 ? editedStatus : editStatus" />
           </li>
            <!-- <li>
              <span>供应商：</span>
              <span>{{item.sellerName}}</span>
            </li> -->
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
            <li>
              <span>出库数量：</span>
              <span>{{item.sumTotal}}</span>
            </li>
          </ul>
        </div>
         <template v-if="queryType === 'submit'">
              <div class="list-ul-button">
                <van-button class="button-info" plain round type="info" native-type="button"
                  @click="editedClick(item, index)" v-if="item.stockStatus">编辑</van-button>
              </div>
            </template>
      </div>
    </div>
    <div class="default-button-container">
      <div class="default-button-container-selected" @click="selectedClick" v-if="queryType === 'submit'">
        <img src="@/assets/img/Icon.png" />
        <span>已填写 <span class="li-span-click">{{ 6-countEmptyProperties }}</span> 项</span>
      </div>
      <van-button class="button-info" round type="info" @click="previewClick('save')" v-if="queryType === 'submit'">预览</van-button>
      <van-button class="button-info" round type="info" @click="previewClick('submit')" v-if="queryType === 'save'">上一步</van-button>
      <van-button class="button-info" round type="info" @click="outboundClick" v-if="queryType === 'save'">确定出库</van-button>
    </div>
    <!-- <van-calendar v-model="showsTimePop" 
      @confirm="timeConfirm">
    </van-calendar> -->
    <Calendar ref="calendar" @onConfirm="timeConfirm" />
    <!-- 附件预览 -->
    <file-preview ref="filePreview"></file-preview>
    <back-to-top className=".detail-button-container"></back-to-top>
  </div>
</template>
<script>
import editedStatus from '@/assets/img/editedStatus.png'
import editStatus from '@/assets/img/editStatus.png'
import {materialDemandPlanRestDetailOut,
materialCirculationDetailsTableRestListByPlanDetailId,
materialSupplierOutRestSaveOut} from '@/api/prodmgr-inv/materialDemandPlanRest'
import {minioUpload} from '@/api/blcd-base/minio'
import FilePreview from "@/components/FilePreview.vue";
import FileUploadView from "@/components/FileUploadView.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import Calendar from "@/layout/components/calendar.vue";
import { getUserInfo } from '@/utils/user-info'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'Outbound',
  components: {FilePreview,FileUploadView,FileDownloadView,BackToTop, Calendar},

  computed: {
    filteredList() {
      if (!this.searchValue) return this.detailList; // 如果搜索值为空，返回所有数据
      return this.detailList.filter(item => item.specModel.includes(this.searchValue) ||
        item.materialName.includes(this.searchValue) ||
        item.unit.includes(this.searchValue) ||
        item.sellerName.includes(this.searchValue)
      ); // 过滤匹配的数据项
    },
    countEmptyProperties() {
      this.$set(this.formData,'fileList',this.fileList)
      return Object.keys(this.formData).reduce((count, key) => {
        if (this.formData[key] === null || this.formData[key] === undefined || this.formData[key] === '' || this.formData[key].length === 0) {
          return count + 1;
        }
        return count;
      }, 0);
  }
  },

  data() {
    return {
      editedStatus,
      editStatus,
      id:'',
      queryType: '',
      detailInfo:{},
      detailList:[],
      showsTimePop: false, 
      searchValue: '',
      formData: {
        planName: '',     //需求名称
        sectionName: '',  //标段项目
        deptName: '',     //需求组织
        receiveDeptName: '',  //领用单位
        pickUserName: '',   //领料人
        pickDate: this.parseTime(new Date().getTime(),'{y}-{m}-{d}'),   //领料日期
        useLocation: '',   //使用地点
        issueUserName: getUserInfo().nickName,   //发料人
      },
      fileList:[],
      editMateria:[],
      inventorySum:0,
      queryIndex:0

    }
  },
  created() {
    this.queryType = this.$route.query.type
    this.queryIndex = this.$route.query.index
    this.id = this.$route.query.id
    this.getDetail();
  },
  activated() {
  },
  methods: {
    handlerShowCalendar(elementName) {
      this.$refs[elementName]?.handleCalendarShow();
    },
    //获取详情信息
    getDetail(){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      
      if(this.queryIndex!=undefined){
        this.fileList = this.$store.state.public.outboundFileList.length?this.$store.state.public.outboundFileList:[]
        this.formData = Object.keys(this.$store.state.public.outboundFormData).length?this.$store.state.public.outboundFormData:this.formData
        this.detailInfo = this.$store.state.public.outboundInfo
        this.detailList = this.$store.state.public.outboundList
        if(Object.keys(this.$store.state.public.outboundData).length) {
            this.detailList[this.queryIndex] = this.$store.state.public.outboundData
            let sum=0 
            this.detailList[this.queryIndex].childList.forEach(item=>{
              sum = sum + item.outTotal
            })
            this.detailList[this.queryIndex].sumTotal = sum
            
          }
         toast.clear();
      }else{
        materialDemandPlanRestDetailOut(this.id).then(({ data }) => {
            this.detailInfo = data;
            this.detailList =data.details;
            this.formData.planName = data.planName;
            this.formData.sectionName =data.sectionName;
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
          })
        
      }
    },
    //获取明细子集信息
    getChildDetail(item){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialCirculationDetailsTableRestListByPlanDetailId(item.id).then(({ data }) => {
        let sumTotal = 0
        data.forEach((item) => {
          this.$set(item, 'outTotal', item.remainingStock);
          sumTotal = sumTotal + item.outTotal
        })
        this.$set(item, 'sumTotal', sumTotal);
        this.$set(item, 'childList', data);
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    //领料日期选择回调
    timeConfirm(value){
      this.formData.pickDate = this.parseTime(value, '{y}-{m}-{d}');
      this.$forceUpdate();
      // this.showsTimePop = false;
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
        let outTotalSum = 0
        for (let i = 0; i < this.detailList.length; i++) {
          let childList = this.detailList[i].childList
          outTotalSum = outTotalSum + (this.detailList[i].sumTotal?this.detailList[i].sumTotal:0)
          if(childList && childList.length> 0){
            for (let j = 0; j < childList.length; j++) {
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
        if(outTotalSum==0){
          this.$notify({
              type: 'warning',
              message: '出库数量不能为空!',
            });
            return
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
        materialSupplierOutDetailParams: this.initSubmitList(),
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
    initSubmitList(){
      this.submitList = [];

      this.detailList.forEach((item) => {
        if(item.childList && item.childList.length > 0){
          item.childList.forEach((childItem) => {
            if(childItem.outTotal != '0' && !!childItem.outTotal){
              this.submitList.push(childItem);
            }
          })
        }
      })
      return this.submitList;
    },
    selectedClick(){},
    editedClick(item, index) {
      this.$store.dispatch('public/setOutboundFormData', this.formData)
      this.$store.dispatch('public/setoutboundFileList', this.fileList)
      this.$store.dispatch('public/setOutboundData', item)
      this.$store.dispatch('public/setOutboundList', this.detailList)
      this.$store.dispatch('public/setOutboundInfo', this.detailInfo)
      
      const query = {type:'submit',id:this.id,index:index}
      this.$router.push({ name: 'EditedOutbound' ,query})
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.van-calendar__popup.van-popup--bottom, .van-calendar__popup.van-popup--top{
    height: 94% !important;
}

.box-container {
  padding: 0px;
}

::v-deep .van-cell__title {
  color: #151b3e;
}

.detail-button-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

    .detail-info-ul {
        padding: 5px 16px 5px 16px;

    li {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #151b3e;
        line-height: 26px;

        // & :nth-child(1){
        //     min-width: 70px
        // }
        & :nth-child(2){
            // width: calc(100% - 70px);
            overflow: hidden;
            text-align: right;
            word-break: break-all;
            flex: 1;
        }
    }
    // .li-item-overlength {
    //     & :nth-child(1){
    //         min-width: initial;
    //         white-space: nowrap;
    //     }
    // }
    .li-item-remark {
        display: flex;
        flex-direction: column;
        position: relative;
        margin-bottom: 5px;

        .remark-detail {
            box-sizing: border-box;
            color: #272b31;
            font-size: 13px;
            line-height: 26px;
            background: #f6f6f6;
            border-radius: 3px;
            width: 100%;
            text-align: left;
            padding: 8px 14px;
            word-wrap:break-word;
        }
    }
    .li-item-after::after {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 25%;
        background: #028bff;
        position: absolute;
        left: -15px;
        top: 10px;
    }
    .van-cell {
        padding: 8px 0px;
    }
    .van-cell--required::before {
        left: -15px;
    }
    .li-span-open{
      justify-content: end;
      padding-top: 5px;
      i{
        vertical-align: middle;
      }
    }
  }

  .list-title-content {
    display: flex;
    margin: 0 0 0 5px;
  }

  .li-title-status {
    margin-right: 15px;
  }

  .detail-title-text {
    padding: 0 12px;

    p {
      &:nth-child(1) {
        font-size: 11px;
        color: #1159cc;
        padding-bottom: 5px;
      }

      &:nth-child(2) {
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }

  .detail-floor-content {
    margin:0.3rem 0;
    margin-left: 0.125rem;
    .van-search{
      margin-top: 0.1rem;
    }
  }

  .detail-ul-text {
    margin: 10px;
    background: rgba(242, 242, 242, 1);
    border-radius: 5px;

    .detail-ul {
      padding: 10px 8px;
    }
  }

  .detail-ul-bottom-text {
    padding-bottom: 10px;

    .detail-ul {
      padding: 0 22px;

      .detail-ul-bottom-text-span,
      img {
        vertical-align: middle;
      }

      .detail-ul-bottom-text-log {
        width: 13px;
        height: 14px;
      }
    }
  }

  .box-container-p{
      font-size: 11px;
      color: #4a4a4a;
      text-align: center;
      margin-top: 22px;
      margin-bottom: 13px;
      span{
        vertical-align: middle;
      }
    }

  // .detail-list-ul {
  //   padding-left: 12px;

  //   .detail-list-ul-text {
  //     justify-content: space-between;

  //     img {
  //       width: 18px;
  //       height: 18px;
  //       flex: none;
  //       margin-top: 4px;
  //     }
  //   }
  // }

  .detail-base-info-edited {
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 0;
    display: flex;
    flex-direction: column;

    .detail-title-content {
      padding-left: 5px;
      padding-right: 5px;
      margin-top: 5px;
      margin-bottom: 5px;

      img {
        width: 26px;
        height: 26px;
      }

      span {
        line-height: 26px;
        margin-left: 0;
        font-size: 13px;
      }
    }

   .detail-title-content-field {
      .van-cell{
        padding-top: 0;
      }
      .detail-base-info-edited-textarea {
        ::v-deep .van-cell__value{
          background: rgba(242, 242, 242, 1);
          border-radius: 0.125rem;
          .van-field__body{
            padding: 5px 10px;
          }
        }
     
      }
    }
    .detail-ul {
      padding-left: 16px;
      padding-right: 30px;
      border-top: 0.5px solid #e3e3e3;

      .detail-ul-p {
        display: flex;
        align-items: center;

        & :nth-child(1) {
          margin-right: 3px;
        }

        & :nth-child(2) {
          margin-right: 3px;
        }
      }
    }

    .detail-base-info-edited-div {
      justify-content: space-between;

      .detail-base-info-edited-img {
        display: flex;
        align-items: center;
      }
    }
  }

  .detail-ul-bottom-text-Arrow {
    width: 14px !important;
    height: 14px !important;
  }

  .select-materials-sticky {
    ::v-deep .van-sticky {
      background: #f2f4f8;
      
    }
  }

  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      padding-left: 13px;

      .van-checkbox {
        height: 100%;
        margin-left: 2px;

        ::v-deep .van-checkbox__icon {
          font-size: 18px;

          .van-icon {
            border: 1px solid #1989fa;
          }
        }
      }
    }
  }

  .van-search {
    width: 222px;

    .van-search__content {
      border-radius: 50px;
      background: #fff;
    }

    .van-cell {
      border-radius: 50px;
      background: #fff;
    }
  }

  .select-materials-search-switch {
    display: flex;
    align-items: center;
    padding-right: 15px;

    span {
      margin-left: 5px;
      font-size: 12px;
    }

    .van-switch {
      width: 34px;
      height: 18px;
      font-size: inherit;

      ::v-deep .van-switch__node {
        width: 18px;
        height: 18px;
      }
    }
  }
}



.detail-list-li-input {

  & :nth-child(2) {
    text-align: center;
  }

  .van-stepper {
    border: 1px solid #dbdbdb;
    border-radius: 5px;

    ::v-deep .van-stepper__input {
      background: #fff;
      width: 50px;
    }
  }
}
.default-button-container {
  justify-content: space-between;
  padding-left: 14px;
  padding-right: 19px;
  box-sizing: border-box;
  box-shadow: 4px 0px 5px rgba(32, 30, 74, 0.1);
  z-index: 10000;

  .default-button-container-selected {
    font-size: 13px;

    span {
      vertical-align: middle;
    }

    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }

    .default-button-container-selected-img {
      transform: rotate(180deg)
    }
  }

  .default-button-container-button{
    display: flex;
    .button-info{
      margin-left: 10px;
    }
  }

  .button-info {
    width: 120px;
    height: 34px;
  }

  ::v-deep .file-add{
    margin: 0;
    padding: 0;
  }
}
.div-parent{
  .detail-list-ul{
     padding-bottom: 0;
  }
}
.div-child{
  .detail-list-ul{
     padding-top: 0;
  }
}
.detail-list-ul {
  padding-left: 12px;
  // padding-bottom: 0;
  // padding-top: 0;

  .detail-list-ul-text {
    justify-content: space-between;

    img {
      width: 18px;
      height: 18px;
      flex: none;
      margin-top: 4px;
    }
  }
}
</style>