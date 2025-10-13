<template>
  <div class="requirement-details default-scroll">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ dataList.planName }}</p>
        <div class="list-title-content">
          <p style="color: #656980; font-size: 14px;">
            <span>需求编号：</span>
            <span class="font-weight" style="color:#3D83E2;">{{ dataList.planNumber }}</span>
          </p>
        </div>
      </div>
      <div class="detail-ul-text">
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
            <span v-if="backNode == '1'">{{dataList.isQualNode=='2'?"质检不通过":""}}</span>
            <span v-else>{{dataList.backNode=='2'?"收货不通过":"报检不通过"}}</span>
          </li>
          <li>
            <span>退货时间：</span>
            <span>{{ dataList.backNode=='2'? dataList.backDate : dataList.backQualDate | formatDate}}</span>
          </li>
        </ul>
      </div>
      <div class="detail-ul-bottom-text">
        <ul class="detail-ul" style="display: flex; justify-content: space-between;">
          <li>
            <span>退货物资项目：<span class="li-span-click">{{ dataList.materialCirculationDetailsTableDTOS ?
                dataList.materialCirculationDetailsTableDTOS.length : 0 }}</span> 项</span>
          </li>
          <li>
            <span>操作人：<span class="li-span-click">{{dataList.consigneeOperator}}</span></span>

          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>退货明细</span>
      </div>
      <material-details :list="dataList.materialCirculationDetailsTableDTOS"
        :planStatus="dataList.planStatus"></material-details>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>初验信息</span>
      </div>
      <file-download-view class="outbound-field-uploader" title="自检单："
        :fileList="filterList(dataList.fileByList, 'zjd') || []" />
      <file-download-view class="outbound-field-uploader" title="到货确认照片："
        :fileList="filterList(dataList.fileByList, 'qtzl') || []" />
      <file-download-view class="outbound-field-uploader" title="交货单："
        :fileList="filterList(dataList.fileByList, 'jhd') || []" />
    </div>
    <back-to-top className=".default-scroll"></back-to-top>
    <file-preview ref="filePreview"></file-preview>
  </div>
</template>
<script>
import {parseTime} from '@/utils'
import BackToTop from '@/components/BackToTop'
import indexMixin from '@/view/mixins'
import MaterialDetails from '@/view/AcceptanceReturn/AcceptanceReturnChild/components/MaterialDetails.vue'
import {detailByBack, detailBySBack} from '@/api/prodmgr-inv/AcceptanceReturn'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";

export default {
  name: 'DoReturn',
  mixins: [indexMixin],
  components: { FilePreview ,FileDownloadView,BackToTop,MaterialDetails},
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
      let url = this.backNode == '1'?detailBySBack:detailByBack
      url(this.id).then((res)=>{
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
.requirement-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

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

  .detail-ul-text {
    margin: 10px;
    background: #f2f2f2;
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

    .detail-list-ul {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 8px;
      border-radius: 5px;
      padding-left: 17px;
      padding-right: 12px;
      background: #f0f2f6;
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
  .default-button-container{
    .button-info{
      width: 169px;
      img{
        vertical-align: middle;
      }
    }
  }
}
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
