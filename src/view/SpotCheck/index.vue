<template>
  <div class="requirement-details">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>供应需求名称：</p>
        <div class="detail-title-main">
          <p>{{ detailInfo.planName || '--' }}</p>
          <span v-if="samplingStatusText" class="status-pill">{{ samplingStatusText }}</span>
        </div>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>需求项目：</span>
            <span>{{ detailInfo.sectionName || '--' }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ detailInfo.deptName || '--' }}</span>
          </li>
          <li>
            <span>供应商名称：</span>
            <span>{{ detailInfo.sellerName || '--' }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-basic-information.png">
        <span>基本信息</span>
      </div>
      <ul class="detail-info-ul">
        <li v-for="item in baseInfoList" :key="item.label">
          <span>{{ item.label }}：</span>
          <span>{{ item.value || '--' }}</span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="fileList.length">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>抽检结果材料</span>
      </div>
      <file-download-view :fileList="fileList" />
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="detailInfo.remark">
      <div class="detail-title-content">
        <img src="@/assets/img/icon-picking-list.png">
        <span>说明</span>
      </div>
      <div class="remark-panel">{{ detailInfo.remark }}</div>
    </div>

    <van-collapse v-model="activeNames">
      <van-collapse-item
        v-for="(item, index) in detailList"
        :key="item.id || index"
        class="detail-base-info detail-base-info-edited material-collapse-item"
        :name="index"
      >
        <template #title>
          <div class="detail-title-content">
            <img src="@/assets/img/Icon_notarize.png">
            <span>抽检物资{{ index + 1 }}</span>
            <em class="material-title-name">{{ item.materialName || '--' }}</em>
            <span :class="['result-tag', item.detailStatus === '2' ? 'result-tag-danger' : 'result-tag-pass']">
              {{ getSamplingResultText(item.detailStatus) }}
            </span>
          </div>
        </template>

        <ul class="detail-info-ul">
          <li v-for="summary in getSummaryFields(item)" :key="summary.label">
            <span>{{ summary.label }}：</span>
            <span>{{ summary.value }}</span>
          </li>
        </ul>

        <div class="material-divider"></div>

        <ul class="detail-info-ul">
          <li v-for="field in getExpandedFields(item)" :key="field.label">
            <span>{{ field.label }}：</span>
            <span>{{ field.value }}</span>
          </li>
        </ul>

        <div v-if="item.remark" class="material-extra-block">
          <div class="material-extra-title">备注</div>
          <div class="material-extra-text">{{ item.remark }}</div>
        </div>

        <div v-if="item.hgzfj.length" class="material-extra-block">
          <div class="material-extra-title">合格证附件</div>
          <file-download-view :fileList="item.hgzfj" />
        </div>

        <div v-if="item.cjbgfj.length" class="material-extra-block">
          <div class="material-extra-title">厂检报告附件</div>
          <file-download-view :fileList="item.cjbgfj" />
        </div>

        <div v-if="item.fileList.length" class="material-extra-block">
          <div class="material-extra-title">抽检材料附件</div>
          <file-download-view :fileList="item.fileList" />
        </div>
      </van-collapse-item>
    </van-collapse>

    <div class="default-button-container default-button-container-box" v-if="from === 'WaitExamineList'">
      <div class="default-button-container-div">
        <p @click="handleReject()"><img src="@/assets/img/Icon-detailInfo.png" alt=""><span>驳回</span></p>
      </div>
      <van-button class="button-info button-info-container" block type="info" round @click="handleAdopt()">通过</van-button>
    </div>

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

    <back-to-top className=".default-container" />
  </div>
</template>
<script>
import { detail } from '@/api/prodmgr-inv/spok'
import FileDownloadView from "@/components/FileDownloadView.vue";
import BackToTop from '@/components/BackToTop'
import { auditReject, wfNextAssigneeMore, auditApprove } from '@/api/myToDoList'
import eventBus from '@/utils/eventBus.js'

const SAMPLING_RESULT_MAP = {
  '1': '合格',
  '2': '不合格'
}

const DEAL_RESULT_MAP = {
  '1': '无处理',
  '2': '只退换库存数量',
  '3': '退换入库质检通过数量'
}

const SAMPLING_STATUS_MAP = {
  // '0': '待抽检',
  '1': '合格',
  '2': '部分合格',
  '3': '不合格'
}

export default {
  name: 'SpotCheck',
  components: { FileDownloadView, BackToTop },
  data() {
    return {
      multiple: false,
      id: '',
      detailInfo: {},
      detailList: [],
      fileList: [],
      from: "",
      assigneePopupShow: false,
      assigneeList: [],
      candidateUser: [],
      assigner: '请选择下一级审核人',
      opinion: '',
      listObj: {},
      activeNames: [0],
    }
  },

  computed: {
    baseInfoList() {
      return [
        { label: '发货单号', value: this.detailInfo.shipmentBatchNumber },
        { label: '抽检单号', value: this.detailInfo.samplingNumber },
        { label: '发货日期', value: this.formatDate(this.detailInfo.shippingDate) },
        { label: '入库单号', value: this.detailInfo.storeNumber },
        { label: '入库日期', value: this.formatDate(this.detailInfo.storeDate) },
        { label: '提交时间', value: this.formatDate(this.detailInfo.submitDate, '{y}-{m}-{d} {h}:{i}') },
        { label: '抽检人', value: this.detailInfo.createUserName },
      ]
    },
    samplingStatusText() {
      return SAMPLING_STATUS_MAP[this.detailInfo.samplingStatus] || ''
    },
    from(){
      return this.$route.query.from
    }
  },

  created() {
    const { businessType, businessId, businessCode, taskId, procInstId } = this.$route.query
    this.listObj = { businessType, businessId, businessCode, taskId, procInstId }

    eventBus.$off('examineOpinionEdit');
    eventBus.$on('examineOpinionEdit', function(opinion, type) {
      this.examineOpinionEdit(opinion, type);
    }.bind(this));

    eventBus.$off('approverChoiceCallBack');
    eventBus.$on('approverChoiceCallBack', function(item) {
      this.approverChoiceCallBack(item);
    }.bind(this));
  },

  mounted() {
    this.id = this.$route.query.id
    this.from = this.$route.query.from
    this.getDetail();
  },

  methods: {
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
      }).catch(() => {
      }).finally(() => {
        toast.clear();
      });
    },

    handleAssigneePopupClick() {
      this.$router.push({
        name: "ApproverChoice",
        params: {
          obj: JSON.stringify(this.assigneeList),
          selectd: JSON.stringify(this.candidateUser),
          multiple: this.multiple
        },
      });
    },

    approverChoiceCallBack(item) {
      this.assigner = item.map(x => x.nickName).join('，');
      this.candidateUser = item.map(x => x.id);
    },

    handleAssigneeCancel() {
      this.assigneePopupShow = false;
      this.assigner = '请选择下一级审核人';
      this.candidateUser = [];
    },

    handleAssigneeSubmit() {
      this.approvalRequest();
    },

    getNextAssignee() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      wfNextAssigneeMore(this.listObj.taskId).then(({ data }) => {
        if (data.data && data.data.length > 0) {
          this.assigneeList = data.data;
          if (data.nextTaskType === "APPOINT_AND") {
            this.multiple = true;
          }
          this.assigneePopupShow = true;
        } else {
          this.approvalRequest();
        }
      }).catch(() => {
      }).finally(() => {
        toast.clear();
      });
    },

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
      }).catch(() => {
      }).finally(() => {
        toast.clear();
      });
    },

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

    handleReject() {
      this.$router.push({
        name: "ExamineOpinionEdit",
        params: {
          type: 'reject'
        },
      });
    },

    handleAdopt() {
      this.$router.push({
        name: "ExamineOpinionEdit",
        params: {
          type: 'adopt'
        },
      });
    },

    async getDetail() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      detail(this.id,{detailStatus:this.from ==='THXQ'?'2':''}).then(({ data }) => {
        this.detailInfo = data || {};
        this.fileList = this.safeParseFileList(data && data.fileList);
        this.detailList = ((data && data.materialCirSamplingDetailList) || []).map((item, index) => {
          return this.normalizeDetailItem(item, index);
        });
        this.activeNames = this.detailList.length > 0 ? [0] : [];
      }).catch(() => {
      }).finally(() => {
        toast.clear();
      });
    },

    normalizeDetailItem(item, index) {
      const fileByList = this.safeParseObject(item.fileByList);
      return {
        ...item,
        sortIndex: index,
        hgzfj: fileByList.hgz || [],
        cjbgfj: fileByList.cjbg || [],
        fileList: this.safeParseFileList(item.fileList),
      }
    },

    safeParseObject(value) {
      if (!value) {
        return {};
      }
      if (typeof value === 'object') {
        return value;
      }
      try {
        return JSON.parse(value);
      } catch (error) {
        return {};
      }
    },

    safeParseFileList(value) {
      const parsedValue = this.safeParseObject(value);
      return Array.isArray(parsedValue) ? parsedValue : [];
    },

    formatDate(value, format = '{y}-{m}-{d}') {
      return value ? this.parseTime(value, format) : '--';
    },

    getSamplingResultText(status) {
      return SAMPLING_RESULT_MAP[status] || '未抽检';
    },

    getDealResultText(status) {
      return DEAL_RESULT_MAP[status] || '--';
    },

    getReturnAmount(item) {
      if (item.returnAmount !== '' && item.returnAmount !== null && item.returnAmount !== undefined) {
        return item.returnAmount;
      }
      if (item.status === '2') {
        return item.remainingStock || 0;
      }
      if (item.status === '3') {
        return item.storeTotal || 0;
      }
      return 0;
    },

    getSummaryFields(item) {
      return [
        { label: '物资名称', value: item.materialName || '--' },
        { label: '规格型号', value: item.specModel || '--' },
        { label: '计量单位', value: item.unit || '--' },
        { label: '发货数量', value: this.formatAmount(item.sendTotal, item.unit) },
        { label: '本次实收', value: this.formatAmount(item.storeTotal, item.unit) },
        { label: '可抽检数量', value: this.formatAmount(item.storeTotal, item.unit) },
      ]
    },

    getExpandedFields(item) {
      return [
        { label: '规格型号', value: item.specModel || '--' },
        { label: '包装形式', value: item.packagingFm || '--' },
        { label: '生产日期', value: this.formatDate(item.manufactureDate) },
        { label: '有效截止日期', value: this.formatDate(item.expirationDate) },
        { label: '当前库存数量', value: this.formatAmount(item.remainingStock, item.unit) },
        { label: '抽检结果', value: this.getSamplingResultText(item.detailStatus) },
        { label: '结果处理', value: item.detailStatus === '2' ? this.getDealResultText(item.status) : '无处理' },
        { label: '退换货数量', value: this.formatAmount(this.getReturnAmount(item), item.unit) },
      ]
    },

    formatAmount(value, unit) {
      const amount = value === '' || value === null || value === undefined ? '--' : value;
      return unit && amount !== '--' ? `${amount} ${unit}` : amount;
    }
  }
}
</script>
<style lang="less" scoped>
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

.requirement-details {
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;

  .detail-title-text {
    padding: 0 12px;

    p {
      &:nth-child(1) {
        font-size: 11px;
        color: #1159cc;
        padding-bottom: 5px;
      }
    }
  }

  .detail-title-main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;

    p {
      flex: 1;
      padding-left: 5px;
      font-weight: 600;
      word-break: break-all;
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
  }
}

.detail-info-ul {
  padding: 5px 16px 5px 16px;

  li {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #151b3e;
    line-height: 26px;

    & :nth-child(2) {
      overflow: hidden;
      text-align: right;
      word-break: break-all;
      flex: 1;
    }
  }
}

.remark-panel {
  margin: 0 16px 12px;
  padding: 10px 12px;
  border-radius: 6px;
  background: #f7f8fb;
  color: rgba(21, 27, 62, 0.8);
  font-size: 13px;
  line-height: 22px;
  word-break: break-all;
}

.status-pill {
  flex-shrink: 0;
  margin-top: 2px;
  padding: 2px 10px;
  border-radius: 12px;
  background: rgba(19, 77, 170, 0.1);
  color: rgba(19, 77, 170, 1);
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
}

.material-collapse-item {
  margin-top: 0.2rem;
}

.material-title-name {
  flex: 1;
  min-width: 0;
  max-width: 200px;
  margin-left: 8px;
  font-style: normal;
  color: rgba(21, 27, 62, 0.7);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-tag {
  flex-shrink: 0;
  max-width: 80px;
  margin-left: 8px;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  line-height: 18px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-tag-pass {
  background: rgba(19, 77, 170, 0.08);
  color: rgba(19, 77, 170, 1);
}

.result-tag-danger {
  background: rgba(244, 160, 47, 0.14);
  color: rgba(244, 160, 47, 1);
}

.material-divider {
  height: 1px;
  margin: 4px 16px 0;
  background: #e5e5e5;
}

.material-extra-block {
  padding: 12px 0 4px;
  border-top: 1px solid #f1f1f1;
}

.material-extra-title {
  padding: 0 16px;
  margin-bottom: 8px;
  color: #151b3e;
  font-size: 13px;
  font-weight: 600;
}

.material-extra-text {
  margin: 0 16px 8px;
  padding: 10px 12px;
  border-radius: 6px;
  background: #f7f8fb;
  color: rgba(21, 27, 62, 0.8);
  font-size: 13px;
  line-height: 22px;
  word-break: break-all;
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

.default-button-container {
  .button-info {
    width: 169px;
    height: 34px;
  }
}
</style>
