<template>
  <div class="default-container default-scroll">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>供应需求名称：</span>
        <span>{{dataList.planName}}</span>
      </div>
       <div >
      <ul class="detail-ul">
        <li>
          <span>建设项目：</span>
          <span>{{dataList.projectName}}</span>
        </li> 
        <li>
          <span>标段项目：</span>
          <span>{{dataList.sectionName}}</span>
        </li> 
        <li>
          <span>需求组织：</span>
          <span>{{dataList.deptName}}</span>
        </li>
        <li>
          <span>退货单号：</span>
          <span>{{backNode == '1'?dataList.backQualNumber:dataList.backNumber}}</span>
        </li>
        <li>
          <span>收货单号：</span>
          <span>{{dataList.takeNumber}}</span>
        </li>
        <li>
          <span>退货环节：</span>
          <span>{{dataList.backNode=='2'?"收货不通过":"报检不通过"}}</span>
        </li>
        <li>
          <span>退货时间：</span>
          <span>{{  dataList.backNode=='2'? dataList.backDate : dataList.backQualDate | formatDate}}</span>
        </li>
        <li>
          <span>操作人：</span>
          <span>{{dataList.createUserName}}</span>
        </li>
      </ul>
    </div>
    </div>
  
    <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
          title-inactive-color="#2e2e2e">
      <van-tab :title="`退货明细（共${dataList.materialCirculationDetailsTableDTOS?dataList.materialCirculationDetailsTableDTOS.length:0}项）`" name="0" key="0">
          <div class="box-container" v-for="(item,index) in dataList.materialCirculationDetailsTableDTOS" :key="index">
            <div>
              <div class="detail-list-title-content">
                  <span>物资名称：</span>
                  <span>{{item.materialName}}</span>
              </div>
            <ul class="detail-list-ul">
              <li>
                <span>退货数量：</span>
                <span style="color: #e4393c;">{{item.refundTotal}}</span>
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
                <span>包装形式：</span>
                <span>{{item.packagingFm}}</span>
              </li>
              <li>
                <span>需求数量：</span>
                <span class="li-span-click">{{item.planAmount}}</span>
              </li>
              <li class="li-item-overlength">
                <span>本次收货数量：</span>
                <span class="li-span-click">{{item.putTotal}}</span>
              </li>
              <li>
                <span>生产日期：</span>
                <span>{{item.manufactureDate |formatToDate}}</span>
              </li>
              <li class="li-item-overlength">
                <span>有效期截止日期：</span>
                <span>{{item.expirationDate |formatToDate}}</span>
              </li>
              <li>
                <span>使用地点：</span>
                <span>{{ item.addr }}</span>
              </li>
              <li>
                <span>收货地址：</span>
                <span>{{item.field2}}</span>
              </li>
              <li>
                <span>供应时间：</span>
                <span>{{item.supplyDate |formatToDate}}</span>
              </li>
              <li class="li-item-overlength">
                <span>收货人及联系方式：</span>
                <span>{{item.receiver}}</span>
              </li>
              <li>
                <span>投资方：</span>
                <span>{{item.field0}}</span>
              </li>
              <li >
                <span>投资比例：</span>
                <span>{{item.field1}}</span>
              </li>
              <li class="li-item-remark">
                <span>备注：</span>
                <div class="remark-detail">{{item.remark || '未填写'}}</div>
              </li>
            </ul>
              <file-download-view title="合格证附件：" :fileList="filterList(item.fileByList, 'hgz') || []"/>
              <file-download-view  title="厂检报告附件：" :fileList="filterList(item.fileByList, 'cjbg') || []"/>
              <file-download-view class="remark-detail" title="退货附件：" :fileList="filterList(item.fileByList, 'thfj_sh') || []"/>
            </div>
          </div>
      </van-tab>
      <van-tab title="初验信息" name="1" key="1">
         <div class="box-container">
          <file-download-view title="自检单：" :fileList="filterList(dataList.fileByList, 'zjd') || []"/>
          <file-download-view title="其他资料：" :fileList="filterList(dataList.fileByList, 'qtzl') || []"/>
        </div>
      </van-tab>
    </van-tabs>
    <back-to-top className=".default-scroll"></back-to-top>
    <file-preview ref="filePreview"></file-preview>
  </div>
</template>
<script>
import {parseTime} from '@/utils'
import BackToTop from '@/components/BackToTop'
import indexMixin from '@/view/mixins'
import {detailByBack} from '@/api/prodmgr-inv/AcceptanceReturn'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";

export default {
  name: 'DoReturn',
  mixins: [indexMixin],
  components: { FilePreview ,FileDownloadView,BackToTop},
  data() {
    return {
      id:'',
      minDate: new Date(),
      dataList:[],
      formData: {
        name: '',
        password: '',
        currentDate: '',
        num1: '',
        num2: '',
        remark: ''
      },
      showDatePicker: false, // 控制日期选择器显示
      menuActiveIndex:'0',
      backNode: ''
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.backNode = this.$route.query.backNode
    this.getDetailList() 
  },
    filters: {
    formatDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }else{
        return ""
      }  
    },
    formatToDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      }else{
        return ""
      }  
    }
  },
  methods: {
    getDetailList(){
       let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
       detailByBack(this.id).then((res)=>{
          if(res.success){
            this.dataList = res.data
          }
       }).finally(() => {
          toast.clear();
      });
    },
    onClickBack() {
      this.$router.go(-1)
    },
    dateClick() {
      this.showDatePicker = true
    },
    onDateConfirm() {
      this.formData.currentDate = parseTime(this.minDate, '{y}-{m}-{d}')
      this.showDatePicker = false
    },
    hideDatePicker() {
      this.showDatePicker = false
    },
    addClick() {
      this.$toast('保存成功')
      this.$router.push({path: '/PlannedManagementList'})
    },
    imgClick({ fileName, filePath }) {
      this.$refs.filePreview.init(fileName, filePath)
    }
  }
}
</script>
<style lang="less" scoped>
// .save-materials {
//   display: flex;
//   flex-direction: column;
//   padding-bottom: 40px;

//   .save-materials-contract {
//     margin-top: 10px;
//     box-sizing: border-box;
//     margin-left: 8px;
//     margin-right: 8px;
//     margin-bottom: 10px;
//     background: #ffffff;
//     border-radius: 7px;
//     box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
//     position: relative;
//     padding: 10px;

//     .li-status {
//       top: auto;
//       bottom: 12px;

//       span {
//         background-color: #edf2ff;
//         border: 1px solid #289fec;
//         color: #1d93ff;
//       }
//     }
//   }

//   .button-info {
//     position: fixed;
//     bottom: 10px;
//     min-width: 200px;
//     height: 30px;
//     left: 50%;
//     transform: translateX(-50%);
//   }

//   .van-cell {
//     padding-left: 15px;
//     padding-right: 0;
//   }

//   //列表ul
//   .detail-ul {

//     li {
//       width: 100%;
//       & :nth-child(2) {
//         width: calc(100% - 40px);
//         overflow: inherit;
//         text-overflow: inherit;
//         white-space: inherit; 
//       }
//       .span-secl{
//         width: calc(100% - 4.5rem) !important;
//       }

//     }
//      .img-text {
//         color: #0689ff;
//       }
//   }
// }

// .detail-title {
//   font-weight: bold;
//   margin: 0.2rem;
// }

// .upload-btn {
//   width: 100px;
//   height: 30px;
// }

// .outbound-field-uploader{
//   ::v-deep li{
//     display: block;
//   }
//   ::v-deep .file-info{
//     width: auto !important;
//   }
// }
.default-container {
  padding-bottom: 20px;
}
.box-container {
  padding: 0px;
}
</style>
