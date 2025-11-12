<!-- 采购合同核备详情 -->
<template>
  <div class="requirement-details">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>合同名称：</p>
        <p>{{ formData.contractName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>合同编号：</span>
            <span>{{ formData.contractNumber }}</span>
          </li>
          <li>
            <span>标段项目：</span>
            <span>{{ formData.projefctName }}</span>
          </li>
          <li>
            <span>买方单位：</span>
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
          <span>采购编号：</span>
          <span>{{ formData.purchaseNumber }}</span>
        </li>
        <li>
          <span>买方单位：</span>
          <span>{{ formData.unitName }}</span>
        </li>
        <li>
          <span>供应商：</span>
          <span>{{ formData.supplierName }}</span>
        </li>
        <li>
          <span>物资大类：</span>
          <span>{{ formData.name }}</span>
        </li>
        <li>
          <span>包件号：</span>
          <span>{{ formData.packageNumber }}</span>
        </li>
        <li>
          <span>类别：</span>
          <span>{{ formData.purchaseName }}</span>
        </li>
        <li>
          <span>签订日期：</span>
          <span>{{ formData.startTime | formatDate }}</span>
        </li>
        <li>
          <span>物资种类：</span>
          <span>{{ formData.purchaseTypeName }}</span>
        </li>
        <li>
          <span>合同金额(万元)：</span>
          <span>{{ formData.amount }}</span>
        </li>
      </ul>
    </div>
    <van-collapse v-model="activeNames">
      <van-collapse-item class="detail-base-info detail-base-info-edited"
        v-for="(item, index) in formData.contractDetailsList" :key="index" :name="index">
        <template #title>
          <div class="detail-title-content">
            <img src="@/assets/img/Icon_notarize.png" />
            <span>物资明细{{ index + 1 }}</span>
          </div>
        </template>
        <ul class="detail-info-ul">
          <li>
            <span>物资名称：</span>
            <span>{{ item.materialName }}</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li>
            <span>计量单位：</span>
            <span>{{ item.unit }}</span>
          </li>
          <li>
            <span>数量：</span>
            <span>{{ item.amount }}</span>
          </li>
          <li>
            <span>单价：</span>
            <span>{{ item.price }} 万元</span>
          </li>
          <li>
            <span>税率：</span>
            <span>{{ item.vatRate }} %</span>
          </li>
          <li>
            <span>合价：</span>
            <span>{{ item.totalAmount }} 万元</span>
          </li>
          <li>
            <span>铁路专用产品：</span>
            <span>{{ item.railwaySpecial == '1' ? '是' : '否' }}</span>
          </li>
        </ul>

        <div v-if="item.railwaySpecial != '0'" style="border-top: 1px solid #e5e5e5;">
          <div class="detail-base-info detail-base-info-edited">
            <div class="detail-title-content">
              <img src="@/assets/img/certificate.png" />
              <span>许可/认证证书</span>
            </div>
            <ul class="detail-info-ul">
              <li>
                <span>许可/认证类别：</span>
                <span>{{ item.licenseCategory }}</span>
              </li>
              <li>
                <span>发证单位：</span>
                <span>{{ item.issuanceUnit }}</span>
              </li>
              <li>
                <span>证书编号：</span>
                <span>{{ item.quantity }}</span>
              </li>
              <li>
                <span>有效期限：</span>
                <span>{{ item.startTime | formatDate }} 至 {{ item.endTime | formatDate }}</span>
              </li>
            </ul>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

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

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>合同副本扫描件</span>
      </div>
      <file-download-view :fileList="filterList(formData.files, 'htfbsmj') || []" />
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>供应商质量终身承诺书</span>
      </div>
      <file-download-view :fileList="filterList(formData.files, 'gyszlzscns') || []" />
    </div>

    <div class="detail-base-info detail-base-info-edited"
      :style="{ marginBottom: formData.railwaySpecial == '0' ? '65px' : '0' }">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>合同核备附件</span>
      </div>
      <file-download-view :fileList="filterList(formData.files, 'hthbfj') || []" />
    </div>

    <div class="default-button-container default-button-container-box"
      v-if="from === 'WaitExamineList' && formData.status == 2">
      <div class="default-button-container-div">
        <p @click="handleReject()"><img src="@/assets/img/Icon-detailInfo.png" alt=""><span>驳回</span></p>
      </div>
      <van-button class="button-info button-info-container" block type="info" round
        @click="handleAdopt()">通过</van-button>
    </div>

    <!--选择审批人弹框-->
    <van-popup v-model="assigneePopupShow" round :close-on-click-overlay="false">
      <div class="assignee-popup">
        <span>提示</span>
        <van-cell :title="assigner" required is-link center @click="handleAssigneePopupClick()" />
        <div class="default-button-container">
          <van-button class="button-info" plain block type="info" round @click="handleAssigneeCancel()">取消</van-button>
          <van-button class="button-info" block type="info" round @click="handleAssigneeSubmit()">提交</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import keepPages from '@/view/mixins/keepPages'
import FileDownloadView from "@/components/FileDownloadView.vue";
import { mergeByActId } from '@/utils/index.js'
import { wfHistoryList } from '@/api/myToDoList'
import indexMixin from '@/view/mixins'

import { auditReject, wfNextAssigneeMore, auditApprove } from '@/api/myToDoList'
import eventBus from '@/utils/eventBus.js'

import { materialPurchaseContractdetail } from '@/api/prodmgr-inv/SelfBuying'

export default {
  name: 'perfectContractDetail',

  mixins: [indexMixin, keepPages],

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
      multiple: false,
      rQueryId: '',
      activeNames: [0],
      from: "",
      //是否显示选择审批人弹框
      assigneePopupShow: false,
      //审批人数据
      assigneeList: [],
      //审核参数
      candidateUser: [],
      //审批人
      assigner: '请选择下一级审核人',
      //审批意见
      opinion: '',
      // 待审核带过来的审核参数对象定义
      listObj: {},
      formData: {

      },
      recordList: [],
      historyData: {},
    };
  },

  mounted() {    
    const { businessType, businessId, businessCode, taskId, procInstId, from, id } = this.$route.query
    this.rQueryId = id
    this.from = from
    this.listObj = { businessType, businessId, businessCode, taskId, procInstId }

    this.handleDetail();
    this.wfHistoryList();
    //审核意见回调
    eventBus.$off('examineOpinionEdit');
    eventBus.$on('examineOpinionEdit', function (opinion, type) {
      this.examineOpinionEdit(opinion, type);
    }.bind(this));

    //选择审核人回调
    eventBus.$off('approverChoiceCallBack');
    eventBus.$on('approverChoiceCallBack', function (item) {
      this.approverChoiceCallBack(item);
    }.bind(this));
  },

  activated() {
    const { businessType, businessId, businessCode, taskId, procInstId, from, id } = this.$route.query
    this.rQueryId = id
    this.from = from
    this.listObj = { businessType, businessId, businessCode, taskId, procInstId }

    this.handleDetail();
    this.wfHistoryList();
  },

  methods: {
    // 获取详情
    handleDetail() {
      materialPurchaseContractdetail(this.rQueryId).then(({ data }) => {
        data.contractDetailsList.forEach((el, index) => {
          this.activeNames.push(index);
        })

        this.formData = data
      })
    },
    // 流程信息
    wfHistoryList() {
      wfHistoryList(this.rQueryId).then(({ data }) => {
        if (data.recordList.length) {
          this.recordList = mergeByActId(data.recordList || []);
          this.historyData = mergeByActId(data.recordList)[0]
        }
      })
    },
    //查看流程点击
    handleProcessClick(item) {
      this.$router.push({ name: "MyProcess", params: { businessId: item.id, businessType: "CGHT", } })
    },
    //通过请求
    approvalRequest() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      let params = {
        businessId: this.listObj.businessId,
        businessType: this.listObj.businessType,
        candidateUsers: this.candidateUser,
        message: this.opinion,
        procInstId: this.listObj.procInstId,
        taskId: this.listObj.taskId
      }
      auditApprove(params).then(({ message }) => {
        this.$notify({
          type: 'success',
          message: message
        });
        this.$router.push({ name: this.from });
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    //选择下一级审核人弹框点击
    handleAssigneePopupClick() {
      this.$router.push({
        name: "ApproverChoice",
        params: {
          obj: JSON.stringify(this.assigneeList),
          selectd: JSON.stringify(this.candidateUser) ,
          multiple: this.multiple
        },
      });
    },
    //选择审核人回调
    approverChoiceCallBack(item) {
       this.assigner = item.map(x=> x.nickName).join('，');
       this.candidateUser = item.map(x => x.id);
    },
    //选择审核人取消
    handleAssigneeCancel() {
      this.assigneePopupShow = false;
      this.assigner = '请选择下一级审核人';
      this.candidateUser = [];
    },
    //选择审核人提交
    handleAssigneeSubmit() {
      this.approvalRequest();
    },
    //获取下一级审批人
    getNextAssignee() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      wfNextAssigneeMore(this.listObj.taskId).then(({ data }) => {
        if(data.data && data.data.length > 0){
                this.assigneeList = data.data;
                 if(data.nextTaskType ==="APPOINT_AND"){
                    this.multiple = true;
                  }
                this.assigneePopupShow = true;
            } else {
          this.approvalRequest();
        }
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    //驳回请求
    rejectRequest() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      let params = {
        businessId: this.listObj.businessId,
        businessType: this.listObj.businessType,
        candidateUsers: this.candidateUser,
        message: this.opinion,
        procInstId: this.listObj.procInstId,
        taskId: this.listObj.taskId
      }

      auditReject(params).then(({ message }) => {
        this.$notify({
          type: 'success',
          message: message
        });
        this.$router.push({ name: this.from });
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    //审核意见回调
    examineOpinionEdit(opinion, type) {
      this.opinion = opinion;
      switch (type) {
        case 'reject':
          this.rejectRequest();
          break;
        case 'adopt':
          this.getNextAssignee();
          break;
      }
    },
    //驳回
    handleReject() {
      this.$router.push({
        name: "ExamineOpinionEdit",
        params: {
          type: 'reject'
        },
      });
    },
    //通过
    handleAdopt() {
      this.$router.push({
        name: "ExamineOpinionEdit",
        params: {
          type: 'adopt'
        },
      });
    },
  },
};
</script>

<style lang='less' scoped>
/deep/.van-calendar__popup.van-popup--bottom,
.van-calendar__popup.van-popup--top {
  height: 94% !important;
}

::v-deep .van-collapse-item__content {
  padding: 0 !important;
}

::v-deep .van-cell__right-icon {
  height: 0.8rem !important;
  line-height: 0.8rem !important;
}

::v-deep .van-collapse-item .van-collapse-item__title {
  padding-left: 0 !important;
  padding-right: 10px !important;
  align-items: center;
}

.file-download-title {
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;

  .title {
    font-size: 13px;
    color: #1c1c1c;
    font-weight: 600;
    padding-left: 30px;
  }

  .title::after {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 25%;
    background: #028bff;
    position: absolute;
    left: 20px;
    top: 18px;
  }
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
        // box-sizing: border-box;
        // color: #272b31;
        // font-size: 13px;
        // line-height: 26px;
        // background: #f6f6f6;
        // border-radius: 3px;
        width: 100%;
        // text-align: left;
        // padding: 8px 14px;
        // word-wrap: break-word;
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
    margin: 0 !important;
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

        img {
          width: 14px;
          height: 14px;
          margin-top: -2px;
        }

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