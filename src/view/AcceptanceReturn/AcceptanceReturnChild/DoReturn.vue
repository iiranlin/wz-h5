<template>
  <div class="save-materials">
    <div class="save-materials-contract">
      <ul class="detail-ul">
        <li class="li-item-overlength">
          <span class="font-weight">供应需求名称：</span>
          <span class="font-weight">{{dataList.planName}}</span>
        </li>
        <li>
          <span>需求项目：</span>
          <span>{{dataList.sectionName}}</span>
        </li> 
        <li>
          <span>需求组织：</span>
          <span>{{dataList.deptName}}</span>
        </li>
        <li>
          <span>退货单号：</span>
          <span>{{dataList.backNumber}}</span>
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

    <div class="detail-title">退货明细</div>
    <div class="box-container" v-for="(item,index) in dataList.materialCirculationDetailsTableDTOS" :key="index">
      <ul class="detail-ul">
        <li class="save-materials-li">
          <span class="font-weight">物资名称：</span>
          <span class="font-weight span-secl">{{item.materialName}}</span>
           <span style="color: #e4393c;">退货数量：{{item.refundTotal}}</span>
        </li>
        <li>
          <span>规格型号：</span>
          <span>{{item.specModel}}</span>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>计量单位：</span>
            <span>{{item.unit}}</span>
          </div>
          <div class="li-item-right li-item-overlength">
            <span>包装形式：</span>
            <span>{{item.packagingFm}}</span>
          </div>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>需求数量：</span>
            <span>{{item.planAmount}}</span>
          </div>
          <div class="li-item-right li-item-overlength">
            <span>本次收货数量：</span>
            <span>{{item.putTotal}}</span>
          </div>
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

        <li class="li-item-both">
          <div class="li-item-left">
            <span>投资比例：</span>
            <span>{{item.field1}}</span>
          </div>
          <!-- <div class="li-item-right li-item-overlength">
          
          </div> -->
        </li>

        <!-- <li class="li-item-overlength">
            <span>合格证附件：</span>
            <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(item.fileByList, 'hgz')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
        </li> -->
        <file-download-view class="outbound-field-uploader" title="合格证附件：" :fileList="filterList(item.fileByList, 'hgz') || []"/>
        <!-- <li class="li-item-overlength">
         <span>厂检报告附件：</span>
            <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(item.fileByList, 'cjbg')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
        </li> -->
        <file-download-view class="outbound-field-uploader" title="厂检报告附件：" :fileList="filterList(item.fileByList, 'cjbg') || []"/>

        <!-- <li>
          <span>退货附件：</span>
         <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(item.fileByList, 'thfj_sh')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
        </li> -->
        <file-download-view class="outbound-field-uploader" title="退货附件：" :fileList="filterList(item.fileByList, 'thfj_sh') || []"/>

        <li>
          <span>备注：</span>
          <span>{{item.remark}}</span>
        </li>
      </ul>
    </div>

    <div class="detail-title">初验信息</div>
    <div class="box-container">
      <ul class="detail-ul">
        <!-- <li>
          <span>自检单：</span>
          <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(dataList.fileByList, 'zjd')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
        </li> -->
         <file-download-view class="outbound-field-uploader" title="自检单：" :fileList="filterList(dataList.fileByList, 'zjd') || []"/>
         <file-download-view class="outbound-field-uploader" title="其他资料：" :fileList="filterList(dataList.fileByList, 'qtzl') || []"/>

        <!-- <li>
          <span>其他资料：</span>
         <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(dataList.fileByList, 'qtzl')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
        </li> -->
      </ul>
    </div>

    <file-preview ref="filePreview"></file-preview>
  </div>
</template>
<script>
import {parseTime} from '@/utils'
import indexMixin from '@/view/mixins'
import {detailByBack} from '@/api/prodmgr-inv/AcceptanceReturn'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";

export default {
  name: 'DoReturn',
  mixins: [indexMixin],
  components: { FilePreview ,FileDownloadView},
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
      showDatePicker: false // 控制日期选择器显示
    }
  },
  mounted() {
    this.id = this.$route.query.id
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
.save-materials {
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;

  .save-materials-contract {
    margin-top: 10px;
    box-sizing: border-box;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 10px;

    .li-status {
      top: auto;
      bottom: 12px;

      span {
        background-color: #edf2ff;
        border: 1px solid #289fec;
        color: #1d93ff;
      }
    }
  }

  .button-info {
    position: fixed;
    bottom: 10px;
    min-width: 200px;
    height: 30px;
    left: 50%;
    transform: translateX(-50%);
  }

  .van-cell {
    padding-left: 15px;
    padding-right: 0;
  }

  //列表ul
  .detail-ul {

    li {
      width: 100%;
      & :nth-child(2) {
        width: calc(100% - 40px);
        overflow: inherit;
        text-overflow: inherit;
        white-space: inherit; 
      }
      .span-secl{
        width: calc(100% - 4.5rem) !important;
      }

    }
     .img-text {
        color: #0689ff;
      }
  }
}

.detail-title {
  font-weight: bold;
  margin: 0.2rem;
}

.upload-btn {
  width: 100px;
  height: 30px;
}

.outbound-field-uploader{
  ::v-deep li{
    display: block;
  }
  ::v-deep .file-info{
    width: auto !important;
  }
}
</style>
