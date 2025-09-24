<!-- 证书更新 -->
<template>
  <div class="requirement-details">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>合同名称：</p>
        <p>{{ $route.query.contractName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>合同编号：</span>
            <span>{{ $route.query.contractNumber }}</span>
          </li>
          <li>
            <span>标段项目：</span>
            <span>{{ $route.query.projefctName }}</span>
          </li>
          <li>
            <span>买方单位：</span>
            <span>{{ $route.query.unitName }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/certificate.png" />
        <span>许可/认证证书</span>
      </div>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <van-field v-model="formData.licenseCategory" required name="licenseCategory" label="许可/认证类别"
            placeholder="请输入许可/认证类别" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="formData.unit" required name="unit" label="发证单位" placeholder="请输入发证单位"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="formData.quantity" required name="quantity
" label="证书编号" placeholder="请输入证书编号" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="formData.validPeriod" readonly clickable required name="validPeriod" label="有效期限"
            placeholder="请选择有效期限" @click="handlerShowCalendar('calendar')" right-icon="arrow" input-align="right" />
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-bottom: 65px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>合同核备附件</span>
      </div>
      <p class="box-container-p" v-if="!formData?.attachmentFile?.length">请选择文件上传，支持jpg、png、jpeg、pdf格式，可上传多个</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="formData.attachmentFile
        || []" :maxCount="99" businessType="03" class="outbound-field-uploader" />
    </div>

    <div class="default-button-container">
      <van-button class="button-info" round @click="sureClick(false)">返回</van-button>
      <van-button class="button-info" round type="info" @click="sureClick(true)">确定</van-button>
    </div>

    <!-- 有效期限 -->
    <rangeCalendar ref="calendar" @onConfirm="handleDataConfirm" :unlimited="true" />
  </div>
</template>

<script>
import FileUploadView from "@/components/FileUploadView.vue";
import rangeCalendar from "./components/calendar.vue";

import { materialPurchaseContractLicensecreate } from '@/api/prodmgr-inv/SelfBuying'


export default {
  name: 'certificateUpdate',

  components: {
    FileUploadView,
    rangeCalendar
  },

  data() {
    return {
      formData: {
        attachmentFile: [],
        validityGuarantee: []
      },
    };
  },

  mounted() {

  },

  methods: {
    handlerShowCalendar(elementName, num = 0) {
      this.$refs[elementName]?.handleCalendarShow(num);
    },
    // 有效期
    handleDataConfirm(time) {
      const date = new Date(time[0]);
      let dateString = date.toLocaleDateString().replace(/\//g, "-");

      // 分割字符串并补零
      const parts = dateString.split('-');
      const year = parts[0];
      let month = parts[1];
      let day = parts[2];

      month = month.length === 1 ? `0${month}` : month;
      day = day.length === 1 ? `0${day}` : day;

      const date2 = new Date(time[1]);
      let dateString2 = date2.toLocaleDateString().replace(/\//g, "-");

      // 分割字符串并补零
      const parts2 = dateString2.split('-');
      const year2 = parts2[0];
      let month2 = parts2[1];
      let day2 = parts2[2];

      month2 = month2.length === 1 ? `0${month2}` : month2;
      day2 = day2.length === 1 ? `0${day2}` : day2;

      const startTime = `${year}-${month}-${day}`;
      const endTime = `${year2}-${month2}-${day2}`;

      const dateObj = new Date(startTime).toISOString();
      const dateObj2 = new Date(endTime).toISOString();

      this.formData.validityGuarantee = [dateObj, dateObj2]

      this.formData.validPeriod = `${year}-${month}-${day} 至 ${year2}-${month2}-${day2}`

      this.$forceUpdate();
    },
    sureClick(isData) {
      if (isData) {
        if (!this.formData.licenseCategory) {
          this.$notify({
            type: 'warning',
            message: '请输入许可/认证类别!',
          });
          return
        }
        if (!this.formData.unit) {
          this.$notify({
            type: 'warning',
            message: '请输入发证单位!',
          });
          return
        }
        if (!this.formData.quantity) {
          this.$notify({
            type: 'warning',
            message: '请输入证书编号!',
          });
          return
        }
        if (!this.formData.validPeriod) {
          this.$notify({
            type: 'warning',
            message: '请选择有效期限!',
          });
          return
        }

        const params = {
          contractNumber: this.$route.query.contractNumber,
          licenseCategory: this.formData.licenseCategory,
          unit: this.formData.unit,
          quantity: this.formData.quantity,
          startTime: this.formData.validityGuarantee[0],
          endTime: this.formData.validityGuarantee[1],
          validityGuarantee: this.formData.validityGuarantee,
          attachmentFile: this.formData.attachmentFile?.length > 0 ? JSON.stringify(this.formData.attachmentFile) : ''
        }

        materialPurchaseContractLicensecreate(params).then(res => {
          if (res.code == 0) {
            this.$toast('证书更新成功')
            this.$router.push({ name: 'purchaseContract' })
          }
        })

      } else {
        this.$router.push({ name: 'purchaseContract' })
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