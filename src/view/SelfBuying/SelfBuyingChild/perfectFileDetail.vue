<!-- 采购文件核备详情 -->
<template>
  <div class="requirement-details">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>物资名称：</p>
        <p>{{ formData.purchaseFileName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>标段项目：</span>
            <span>{{ formData.projefctName }}</span>
          </li>
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
        <li>
          <span>物资细目：</span>
          <span>{{ formData.purchaseDetailName }}</span>
        </li>
        <li>
          <span>数量：</span>
          <span>{{ formData.quantity }}</span>
        </li>
        <li>
          <span>物资种类：</span>
          <span>{{ formData.purchaseTypeName }}</span>
        </li>
        <li>
          <span>预算金额：</span>
          <span>{{ formData.amount }}</span>
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

    <div class="detail-base-info detail-base-info-edited" v-if="formData.executionStandard">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>执行标准</span>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span class="remark-detail">{{ formData.executionStandard }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 流程信息待完善 -->
    <div class="detail-base-info detail-base-info-edited" v-if="recordList.length">
      <div class="detail-title-content detail-base-info-edited-div" @click="handleProcessClick(formData)">
        <div class="detail-base-info-edited-img">
          <img src="@/assets/img/Icon-process.png" />
          <span>流程信息</span>
        </div>
        <div class="detail-base-info-edited-img">
          <img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Arrow-R.png" />
        </div>
      </div>
      <ul class="detail-ul">
        <li>
          <p class="detail-ul-p">
            <img v-if="historyData.status == '2' || historyData.actId == 'root'" src="@/assets/img/Icon-state-yes.png"
              alt="">
            <img v-if="historyData.status == '3'" src="@/assets/img/Icon-state-no.png" alt="">
            <img v-if="historyData.status == '6'" src="@/assets/img/Icon-state-goback.png" alt="">
            <img v-if="historyData.status == '' && historyData.actId != 'root'"
              src="@/assets/img/Icon-state-waiting.png" alt="">
            <span>{{ historyData.assigneeName }}</span>
            <span v-if="historyData.status == '2'" style="color:rgba(19, 77, 170, 1);font-weight: 600">通过</span>
            <span v-if="historyData.status == '3'" style="color:rgba(244, 160, 47, 1);font-weight: 600">驳回</span>
            <span v-if="historyData.status == '6'" style="color:rgba(19, 77, 170, 1);font-weight: 600">撤销审核</span>
            <span v-if="historyData.status == '' && historyData.actId == 'root'"
              style="color:rgba(19, 77, 170, 1);font-weight: 600">发起</span>
            <span v-if="historyData.status == '' && historyData.actId != 'root'"
              style="color:rgba(21, 27, 62, 0.5);font-weight: 400">未审批</span>
          </p>
          <span>{{ historyData.endTime ? historyData.endTime.substr(0, 10) : "" }}</span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-bottom: 8px;background-color: #F2F4F8;">
      <div class="detail-title-content">
        <span style="font-size: 16px;">核备文件</span><span
          style="font-size: 12px; color: #898C9F; font-weight: 300;">(必传项)</span>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>采购方案或招标计划</span>
      </div>
      <file-download-view :fileList="formData.fileList01 || []" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>招标文件（含技术规格书）</span>
      </div>
      <file-download-view :fileList="formData.fileList02 || []" />
    </div>
  </div>
</template>

<script>
import FileDownloadView from "@/components/FileDownloadView.vue";
import { mergeByActId } from '@/utils/index.js'
import indexMixin from '@/view/mixins'

import { materialPurchaseFiledetail } from '@/api/prodmgr-inv/SelfBuying'


export default {
  name: 'PerfectFileDetail',

  mixins: [indexMixin],

  components: {
    FileDownloadView
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
        fileList01: [],
        fileList02: [],
      },
      recordList: [],
      historyData: {},
    };
  },

  mounted() {
    this.handleDetail();
  },

  methods: {
    // 获取详情
    handleDetail() {
      materialPurchaseFiledetail(this.$route.query.id).then(({ data }) => {
        this.formData = data
        this.formData.fileList01 = JSON.parse(data.registration) || []
        this.formData.fileList02 = JSON.parse(data.bidDocument) || []
      })
    },
    // 流程信息
    wfHistoryList() {
      // wfHistoryList(this.listObj.businessId).then(({ data }) => {
      //   if (data.recordList.length) {
      //     this.recordList = mergeByActId(data.recordList || []);
      //     this.historyData = mergeByActId(data.recordList)[0]
      //   }
      // })
    },
    //查看流程点击
    handleProcessClick(item) {
      this.$router.push({ name: "MyProcess", params: { businessId: item.id } })
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