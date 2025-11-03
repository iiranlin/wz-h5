<!-- 采购归档资料 -->
<template>
  <div class="requirement-details">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>标段项目：</p>
        <p>{{ formData.projefctName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>采购单位：</span>
            <span>{{ formData.unitName }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-basic-information.png" />
        <span>基本信息</span>
      </div>
      <ul class="detail-info-ul">
        <li>
          <span>物资大类：</span>
          <span>{{ formData.name }}</span>
        </li>
        <li>
          <span>类别：</span>
          <span>{{ formData.purchaseName }}</span>
        </li>
        <!-- <li>
          <span>物资细目：</span>
          <span>{{ formData.purchaseDetailName }}</span>
        </li> -->
        <li>
          <span>物资名称：</span>
          <span>{{ formData.purchaseFileName }}</span>
        </li>
        <!-- <li>
          <span>数量：</span>
          <span>{{ formData.quantity }}</span>
        </li>
         <li>
          <span>计量单位：</span>
          <span>{{ formData.unit }}</span>
        </li> -->
        <li>
          <span>物资种类：</span>
          <span>{{ formData.purchaseTypeName }}</span>
        </li>
        <li>
          <span>预算金额：</span>
          <span class="li-span-click">{{ formData.amount }}</span>
          <span>万元</span>
        </li>
        <li>
          <span>预计采购完成日期：</span>
          <span>{{ formData.registrationDate | formatDate }}</span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="formData.remak">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>备注</span>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span class="remark-detail">{{ formData.remak }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-bottom: 8px;background-color: #F2F4F8;">
      <div class="detail-title-content">
        <span style="font-size: 16px;">招标归档文件</span>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>招标公告网页版</span>
      </div>
      <p class="box-container-p" v-if="!formData.tenderAnnouncement?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="formData.tenderAnnouncement" businessType="01" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>招标文件答疑、补遗</span>
      </div>
      <p class="box-container-p" v-if="!formData.bidAddendum?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="formData.bidAddendum" businessType="02" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>评标报告</span>
      </div>
      <p class="box-container-p" v-if="!formData.bidEvaluationReport?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="formData.bidEvaluationReport" businessType="03" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>中标候选人公示网页版</span>
      </div>
      <p class="box-container-p" v-if="!formData.bidCandidateWeb?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="formData.bidCandidateWeb" businessType="04" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>中标通知书</span>
      </div>
      <p class="box-container-p" v-if="!formData.acceptance?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="formData.acceptance" businessType="05" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>中标人的投标文件副本</span>
      </div>
      <p class="box-container-p" v-if="!formData.bidCopy?.length">请选择文件上传，支持jpg、png、jpeg、pdf格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="formData.bidCopy" businessType="06" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>合同副本</span>
      </div>
      <p class="box-container-p" v-if="!formData.contractCopy?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="formData.contractCopy" businessType="07" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>供应商质量终身承诺书</span>
      </div>
      <p class="box-container-p" v-if="!formData.commitment?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="formData.commitment" businessType="08" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 65px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>其他文件</span>
      </div>
      <p class="box-container-p" v-if="!formData.other?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view :maxCount="100" accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="formData.other" businessType="09" />
    </div>

    <div class="default-button-container">
      <van-button class="button-info" round @click="sureClick(false)">返回</van-button>
      <van-button class="button-info" round type="info" @click="sureClick(true)">保存</van-button>
    </div>
  </div>
</template>

<script>
import FileUploadView from "@/components/FileUploadView.vue";
import { materialPurchaseFiledetail, materialPurchaseFilemodify } from '@/api/prodmgr-inv/SelfBuying'

export default {
  name: 'archivedData',

  components: {
    FileUploadView
  },

  filters: {
    formatDate(value) {
      if (value) {
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      } else {
        return ""
      }
    },
    formatToDate(value) {
      if (value) {
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      } else {
        return ""
      }
    }

  },

  data() {
    return {
      formData: {
        tenderAnnouncement: [],
        bidAddendum: [],
        bidEvaluationReport: [],
        bidCandidateWeb: [],
        acceptance: [],
        bidCopy: [],
        contractCopy: [],
        commitment: [],
        other: [],
      },
    };
  },

  mounted() {
    // 查询基础信息和文件信息
    this.handleDetail()
  },

  methods: {
    // 获取详情
    handleDetail() {
      materialPurchaseFiledetail(this.$route.query.id).then(({ data }) => {
        this.formData = data
        this.formData.tenderAnnouncement = JSON.parse(data.tenderAnnouncement) || []
        this.formData.bidAddendum = JSON.parse(data.bidAddendum) || []
        this.formData.bidEvaluationReport = JSON.parse(data.bidEvaluationReport) || []
        this.formData.bidCandidateWeb = JSON.parse(data.bidCandidateWeb) || []
        this.formData.acceptance = JSON.parse(data.acceptance) || []
        this.formData.bidCopy = JSON.parse(data.bidCopy) || []
        this.formData.contractCopy = JSON.parse(data.contractCopy) || []
        this.formData.commitment = JSON.parse(data.commitment) || []
        this.formData.other = JSON.parse(data.other) || []
      })
    },
    sureClick(isData) {
      if (isData) {
        const params = {
          ...this.formData,
          tenderAnnouncement: this.formData.tenderAnnouncement?.length > 0 ? JSON.stringify(this.formData.tenderAnnouncement) : "\"\"",
          bidAddendum: this.formData.bidAddendum?.length > 0 ? JSON.stringify(this.formData.bidAddendum) : "\"\"",
          bidEvaluationReport: this.formData.bidEvaluationReport?.length > 0 ? JSON.stringify(this.formData.bidEvaluationReport) : "\"\"",
          bidCandidateWeb: this.formData.bidCandidateWeb?.length > 0 ? JSON.stringify(this.formData.bidCandidateWeb) : "\"\"",
          acceptance: this.formData.acceptance?.length > 0 ? JSON.stringify(this.formData.acceptance) : "\"\"",
          bidCopy: this.formData.bidCopy?.length > 0 ? JSON.stringify(this.formData.bidCopy) :"\"\"",
          contractCopy: this.formData.contractCopy?.length > 0 ? JSON.stringify(this.formData.contractCopy) : "\"\"",
          commitment: this.formData.commitment?.length > 0 ? JSON.stringify(this.formData.commitment) : "\"\"",
          other: this.formData.other?.length > 0 ? JSON.stringify(this.formData.other) : "\"\"",
        }

        materialPurchaseFilemodify(params).then(res => {
          if (res.code == 0) {
            this.$toast('保存成功')
            this.$router.push({ name: 'purchaseFile' })
          }
        })

      } else {
        this.$router.push({ name: 'purchaseFile' })
      }
    },
  },
};
</script>

<style lang='less' scoped>
/deep/.van-calendar__popup.van-popup--bottom,
.van-calendar__popup.van-popup--top {
  height: 94% !important;
}

.requirement-details {
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
      & :nth-child(2) {
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
        word-wrap: break-word;
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

    .li-span-open {
      justify-content: end;
      padding-top: 5px;

      i {
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
    justify-content: space-between;
    padding: 5px 12px;

    span {
      color: #151b3e;
      font-weight: 400;
    }

    .van-button {
      border-radius: 5px;
      margin-right: 8px;
      height: 30px;
    }

    .van-button-selected {
      span {
        color: #0861db;
      }
    }

    .detail-floor-content-add {
      color: #1189f6;
      padding-right: 2px;
      font-size: 16px;
      vertical-align: middle;
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

  .box-container-p {
    font-size: 11px;
    color: #4a4a4a;
    text-align: center;
    margin-top: 22px;
    margin-bottom: 13px;

    span {
      vertical-align: middle;
    }
  }

  .detail-list-ul {
    padding-left: 12px;

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
      color: #7F8397;
      font-weight: 600;

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

  .detail-title-content-field {
    padding-left: 20px;
    padding-right: 10px;
    padding-bottom: 5px;

    .detail-base-info-edited-textarea {
      background: #f6f6f6;
      border-radius: 10px;
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

  .default-button-container {
    .button-info {
      width: 169px;
      height: 34px;
    }
  }
}


.default-container {
  padding-bottom: 10px;
}

.default-container1 {
  padding-bottom: 40px;
}

.box-container {
  padding: 0px;
}


.detail-list-li-input {
  border-top: 1px solid #e3e3e3;

  & :nth-child(2) {
    text-align: center;
  }

  ::v-deep .van-cell__title {
    color: #151b3e;
  }

  .van-cell {

    padding-right: 10px;
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

.default-button-container-box {
  justify-content: space-between;

  .default-button-container-div {
    display: flex;

    p {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 10px;
      width: 80px;

      &:nth-child(1) {
        border-right: 0.5px solid #f1f1f1;
      }

      img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .button-info-container {
    width: 169px !important;
    margin-right: 12px;
  }
}
</style>