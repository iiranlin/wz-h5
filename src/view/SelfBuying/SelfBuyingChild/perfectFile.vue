<!-- 新增、修改文件核备 -->
<template>
  <div class="requirement-details">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>标段项目：</p>
        <p>{{ detailInfo.sectionName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>采购单位：</span>
            <span>{{ detailInfo.constructionCompany }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-invest.png" />
        <span>基本信息</span>
      </div>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.name" readonly clickable required name="name" label="物资大类"
            placeholder="请选择物资大类" right-icon="arrow" input-align="right" @click="showGeneraPicker = true">

          </van-field>
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.purchaseName" readonly clickable required name="purchaseName
" label="类别" placeholder="请选择类别" right-icon="arrow" @click="showcategoryPicker = true" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.purchaseTypeName" readonly clickable required name="purchaseTypeName
" label="物资种类" placeholder="请选择物资种类" right-icon="arrow" @click="showvarietyPicker = true" input-align="right" />
        </li>
        <!-- <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.purchaseDetailName" readonly clickable required name="purchaseDetailName
" label="物资细目" placeholder="请选择物资细目" right-icon="arrow" @click="showdetailPicker = true" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field type="number"  v-model="sectionInfo.quantity" required name="quantity
" label="数量" placeholder="请输入数量" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.unit" required name="unit" label="计量单位" placeholder="请输入或选择计量单位"
            input-align="right" right-icon="arrow" @click-right-icon="showUnitPicker = true" />
        </li> -->
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.purchaseFileName" required name="purchaseFileName" label="物资名称"
            placeholder="请输入物资名称" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.amount" required name="amount" type="number" label="预估采购金额" placeholder="请输入预估采购金额"
            @input="handlerAmount" input-align="right">
            <template #button>
              <span style="color: #333;">万元</span>
            </template>
          </van-field>
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.registrationDate" readonly clickable required name="registrationDate"
            label="预计采购完成日期" placeholder="请选择预计采购完成日期" right-icon="arrow" label-width="8.2em"
            @click="handlerShowCalendar('calendar')" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.purchaseMethod" readonly clickable required name="purchaseMethod" label="采购方式"
            placeholder="请选择采购方式" right-icon="arrow" @click="showprocurementPicker = true"
            input-align="right" />
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>
          备注
        </span>
      </div>
      <div class="detail-title-content-field">
        <van-field v-model="sectionInfo.remak" class="detail-base-info-edited-textarea" rows="3" autosize
          type="textarea" placeholder="请备注物资相关信息"
          :maxlength="remarkInputMaxLength" :show-word-limit="remarkLength <= remarkMaxLength"
          :error-message="remarkLength > remarkMaxLength ? `备注不能超过 ${remarkMaxLength} 字（当前 ${remarkLength} 字）` : ''" />
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>执行标准</span>
      </div>
      <div class="detail-title-content-field">
        <van-field v-model="sectionInfo.executionStandard" class="detail-base-info-edited-textarea" rows="3" autosize
          type="textarea" placeholder="请输入执行标准" />
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-bottom: 8px;background-color: #F2F4F8;">
      <div class="detail-title-content">
        <span style="font-size: 16px;">核备文件</span><span
          style="font-size: 12px; color: #898C9F; font-weight: 300;">（按采购方式确定必传项）</span>
      </div>
    </div>

    <div v-for="(attachment, index) in attachmentSections" :key="attachment.key"
      class="detail-base-info detail-base-info-edited"
      :style="{ marginTop: 0, marginBottom: index === attachmentSections.length - 1 ? '65px' : '5px' }">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span v-if="attachment.required" class="attachment-required-mark">*</span>
        <span>{{ attachment.label }}</span>
      </div>
      <p class="box-container-p" v-if="!attachment.files.length">
        {{ attachment.required ? '必填项，' : '非必填项，' }}请选择文件上传，支持jpg、png、jpeg、pdf、doc、docx格式，可上传多个
      </p>
      <file-upload-view :maxCount="99" accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="attachment.files"
        businessType="01" class="outbound-field-uploader" />
    </div>

    <div class="default-button-container">
      <van-button class="button-info" round @click="saveDraft" :disabled="saving">暂存</van-button>
      <van-button class="button-info" round type="info" @click="sureClick" :disabled="saving">确定</van-button>
    </div>

    <!-- 物资大类 -->
    <van-popup v-model="showGeneraPicker" round position="bottom">
      <van-picker show-toolbar :columns="generaColumns" @cancel="showGeneraPicker = false" @confirm="onGeneraConfirm" />
    </van-popup>
    <!-- 类别 -->
    <van-popup v-model="showcategoryPicker" round position="bottom">
      <van-picker show-toolbar :columns="categoryColumns" @cancel="showcategoryPicker = false"
        @confirm="oncategoryConfirm" />
    </van-popup>
    <!-- 物资细目 -->
    <van-popup v-model="showdetailPicker" round position="bottom">
      <van-picker show-toolbar :columns="detailColumns" @cancel="showdetailPicker = false" @confirm="ondetailConfirm" />
    </van-popup>
    <!-- 物资种类 -->
    <van-popup v-model="showvarietyPicker" round position="bottom">
      <van-picker show-toolbar :columns="varietyColumns" @cancel="showvarietyPicker = false"
        @confirm="onvarietyConfirm" />
    </van-popup>
    <!-- 计量单位 -->
    <van-popup v-model="showUnitPicker" round position="bottom">
      <van-picker show-toolbar :columns="unitColumns" @cancel="showUnitPicker = false" @confirm="onUnitConfirm" />
    </van-popup>
    <!-- 预计采购完成日期 -->
    <Calendar ref="calendar" :unlimited="true" @onConfirm="handleDataConfirm" />
    <!-- 采购方式 -->
    <van-popup v-model="showprocurementPicker" round position="bottom">
      <van-picker show-toolbar :columns="procurementColumns" @cancel="showprocurementPicker = false"
        @confirm="procurementConfirm" />
    </van-popup>
  </div>
</template>

<script>
import FileUploadView from "@/components/FileUploadView.vue";
import Calendar from "@/layout/components/calendar.vue";
import { parseTime } from '@/utils/index'
import { clearDraftEmptyPlaceholders, PURCHASE_METHODS, PURCHASE_FILE_ATTACHMENTS, isAttachmentRequired, parseAttachmentList } from '@/utils/selfBuyingAttachments'
import { materialCategoryList, purchasefindAllList, purchasefindAllListType, purchasefindAllListDetail, materialSectionProject, materialPurchaseFilecreate, materialPurchaseFilemodify, materialPurchaseFiledetail } from "@/api/prodmgr-inv/SelfBuying"

export default {
  name: 'PerfectFile',

  components: { FileUploadView, Calendar },
  dicts: ['MeasureUnit'],
  data() {
    return {
      detailInfo: {},
      saving: false,
      draftCreatedWithoutId: false,
      remarkMaxLength: 500,
      sectionInfo: {
        sectionId: '',
        registration: [],
        bidDocument: [],
        registrationAttach: [],
        name: '',
        code: '',
        purchaseName: '',
        purchaseCode: '',
        purchaseTypeName: '',
        purchaseTypeCode: '',
        purchaseDetailName: '',
        purchaseDetailCode: '',
        quantity: '',
        unit: '',
        amount: '',
        purchaseFileName: '',
        registrationDate: '',
        purchaseMethod: '',
        remak: '',
        executionStandard: ''
      },
      // 物资大类
      showGeneraPicker: false,
      generaColumns: [],
      // 类别
      showcategoryPicker: false,
      categoryColumns: [],
      // 物资细目
      showdetailPicker: false,
      detailColumns: [],
      // 物资种类
      showvarietyPicker: false,
      varietyColumns: [],
      // 计量单位
      showUnitPicker: false,
      // unitColumns: ['个', '件', '台', '套', '米', '吨', '千克', '平方米', '立方米'],
      // 采购方式
      showprocurementPicker: false,
      procurementColumns: PURCHASE_METHODS,
    };
  },
  computed: {
    attachmentSections() {
      return PURCHASE_FILE_ATTACHMENTS.map(item => ({
        ...item,
        required: isAttachmentRequired(item, this.sectionInfo.purchaseMethod),
        files: this.sectionInfo[item.key],
      }));
    },
    remarkLength() {
      return (this.sectionInfo.remak || '').length;
    },
    remarkInputMaxLength() {
      // Vant 会截断超过 maxlength 的回填值，保留历史备注供用户手动删减。
      return Math.max(this.remarkMaxLength, this.remarkLength);
    },
    unitColumns() {
      if (this.dict && this.dict.MeasureUnit) {
        return this.dict.MeasureUnit.map(item => item.label);
      }
      return [];
    }
  },
  async created() {
    this.getGeneraList();
    this.detailInfo = await this.getMaterialSectionProject();
    // 判断是编辑还是新增，查询展示信息和回显数据
    if (this.$route.query.type == 'create') {
      this.sectionInfo.unitName = this.detailInfo.constructionCompany;
      this.sectionInfo.projectId = this.detailInfo.projectId;
      this.sectionInfo.projefctName = this.detailInfo.sectionName;
      this.sectionInfo.sectionId = this.detailInfo.id;
    } else {
      const data = await this.getGeneraDetail();

      PURCHASE_FILE_ATTACHMENTS.forEach(item => {
        data[item.key] = parseAttachmentList(data[item.key]);
      });
      const { registrationDate } = data;
      const formattedDate = typeof registrationDate === 'string' || typeof registrationDate === 'number'
        ? parseTime(registrationDate, '{y}-{m}-{d}')
        : '';
      data.registrationDate = formattedDate === 'NaN-NaN-NaN' ? '' : formattedDate;

      this.sectionInfo = data;

      await this.onGeneraConfirm({ text: data.name, code: data.code }, false);
      await this.oncategoryConfirm({ text: data.purchaseName, code: data.purchaseCode }, false);
      await this.onvarietyConfirm({ text: data.purchaseTypeName, code: data.purchaseTypeCode }, false);
    }
  },

  methods: {
    // 物资大类确认事件
    async onGeneraConfirm(value, flag = true) {
      this.sectionInfo.name = value.text;
      this.sectionInfo.code = value.code;
      this.showGeneraPicker = false;

      if (flag) {
        this.sectionInfo.purchaseName = '';
        this.sectionInfo.purchaseDetailName = '';
        this.sectionInfo.purchaseTypeName = '';
        this.categoryColumns = [];
        this.detailColumns = [];
        this.varietyColumns = [];
      }

      const data = await this.getPurchaseList({ code: value.text });

      this.categoryColumns = data?.map(el => {
        return { text: el.purchaseName, code: el.purchaseCode }
      }) || [];
    },
    // 类别确认事件
    async oncategoryConfirm(value, flag = true) {
      if (!value) {
        return this.showcategoryPicker = false;
      }
      this.sectionInfo.purchaseName = value.text;
      this.sectionInfo.purchaseCode = value.code;
      this.showcategoryPicker = false;

      if (flag) {
        this.sectionInfo.purchaseDetailName = '';
        this.sectionInfo.purchaseTypeName = '';
        this.detailColumns = [];
        this.varietyColumns = [];
      }

      const data = await this.getPurchaseListType({ code: this.sectionInfo.name, purchaseCode: value.code });

      this.varietyColumns = data?.map(el => {
        return { text: el.purchaseTypeName, code: el.purchaseTypeCode }
      }) || [];
    },
    // 物资细目确认事件
    ondetailConfirm(value) {
      if (!value) {
        return this.showdetailPicker = false;
      }
      this.sectionInfo.purchaseDetailName = value.text;
      this.sectionInfo.purchaseDetailCode = value.code;
      this.showdetailPicker = false;
    },
    // 物资种类确认事件
    async onvarietyConfirm(value, flag = true) {
      if (!value) {
        return this.showvarietyPicker = false;
      }
      this.sectionInfo.purchaseTypeName = value.text;
      this.sectionInfo.purchaseTypeCode = value.code;
      this.showvarietyPicker = false;

      if (flag) {
        this.sectionInfo.purchaseDetailName = '';
        this.detailColumns = [];
      }

      const data = await this.getPurchaseListDetail({ code: this.sectionInfo.name, purchaseCode: this.sectionInfo.purchaseCode, purchaseTypeCode: value.code });

      this.detailColumns = data?.map(el => {
        return { text: el.purchaseDetailName, code: el.purchaseDetailCode }
      }) || [];
    },
    // 计量单位确认事件
    onUnitConfirm(value) {
      if (!value) {
        return this.showUnitPicker = false;
      }
      this.$nextTick(() => {
        this.sectionInfo.unit = value;
      })
      this.showUnitPicker = false;
    },
    // 获取详情
    async getGeneraDetail() {
      const res = await materialPurchaseFiledetail(this.$route.query.id);

      if (res.code == 0) {
        return res.data
      }
    },
    // 获取物资大类
    async getGeneraList() {
      await materialCategoryList().then(res => {
        if (res.code == 0) {
          this.generaColumns = res.data.map(el => {
            return { text: el.name, code: el.code }
          });
        }
      });
    },
    // 获取类别、物资种类、物资细目
    async getPurchaseList(params) {
      const res = await purchasefindAllList(params);

      if (res.code == 0) {
        return res.data
      }
    },
    // 获取物资种类
    async getPurchaseListType(params) {
      const res = await purchasefindAllListType(params);

      if (res.code == 0) {
        return res.data
      }
    },
    // 获取物资细目
    async getPurchaseListDetail(params) {
      const res = await purchasefindAllListDetail(params);

      if (res.code == 0) {
        return res.data
      }
    },
    // 获取基本信息
    async getMaterialSectionProject(params) {
      const res = await materialSectionProject(params);

      if (res.code == 0) {
        return res.data
      }
    },
    // 预计采购完成日期
    handleDataConfirm(time) {
      const date = new Date(time);
      let dateString = date.toLocaleDateString().replace(/\//g, "-");

      // 分割字符串并补零
      const parts = dateString.split('-');
      const year = parts[0];
      let month = parts[1];
      let day = parts[2];

      month = month.length === 1 ? `0${month}` : month;
      day = day.length === 1 ? `0${day}` : day;

      this.sectionInfo.registrationDate = `${year}-${month}-${day}`
      this.$forceUpdate();
    },
    handlerShowCalendar(elementName, num = 0) {
      this.$refs[elementName]?.handleCalendarShow(num);
    },
    handlerfix(str) {
      const [i, d] = String(str).split('.');
      return d && d.length >= 6;
    },
    handlerAmount(value) {
      const [i, d] = String(value).split('.');

      this.sectionInfo.amount = this.handlerfix(value) ? `${i}.${d.slice(0, 6)}` : value;
    },
    // 采购方式确认事件
    procurementConfirm(value) {
      if (!value) {
        return this.showprocurementPicker = false;
      }
      this.sectionInfo.purchaseMethod = value;
      this.showprocurementPicker = false;
    },
    saveDraft() {
      if (!this.validateBasicInfo()) return;
      return this.savePurchaseFile(true);
    },
    async savePurchaseFile(isDraft = false) {
      if (this.saving) return;
      if (this.draftCreatedWithoutId) {
        this.$toast('请从采购文件列表打开已暂存的记录后继续保存');
        return;
      }

      const isCreate = this.$route.query.type === 'create' && !this.sectionInfo.id;
      const params = { ...this.sectionInfo };
      PURCHASE_FILE_ATTACHMENTS.forEach(({ key }) => {
        params[key] = JSON.stringify(this.sectionInfo[key]);
      });
      if (isCreate) {
        const date = params.registrationDate ? new Date(params.registrationDate) : null;
        Object.assign(params, {
          id: '',
          registrationDate: date && !Number.isNaN(date.getTime()) ? date.toISOString() : null,
          schemeApproval: '',
          tenderAnnouncement: '',
          bidEvaluationReport: '',
          acceptance: '',
          contractCopy: '',
          other: '',
          scheme: '',
          bidAddendum: '',
          bidCandidateWeb: '',
          bidCopy: '',
          commitment: '',
          sectionShortName: this.detailInfo.projectShortName
        });
      }

      if (isDraft) {
        clearDraftEmptyPlaceholders(params);
      }

      this.saving = true;
      try {
        const save = isCreate ? materialPurchaseFilecreate : materialPurchaseFilemodify;
        const res = await save(params);
        if (res.code != 0) return;

        if (isDraft) {
          if (isCreate) {
            const data = res.data;
            const id = data && typeof data === 'object' ? data.id : data;
            if ((typeof id === 'string' && id.trim()) || (typeof id === 'number' && id > 0)) {
              this.$set(this.sectionInfo, 'id', id);
            } else {
              this.draftCreatedWithoutId = true;
            }
          }
          this.$toast('暂存成功，下次可继续编辑');
          return;
        }

        this.$toast(isCreate ? '新增成功' : '修改成功');
        this.$router.push({ name: 'purchaseFile' });
      } catch {
        // 接口错误由公共请求层提示。
      } finally {
        this.saving = false;
      }
    },
    validateBasicInfo() {
      if (!this.sectionInfo.name) {
        this.$notify({
          type: 'warning',
          message: '请选择物资大类!',
        });
        return false;
      }
      if (!this.sectionInfo.purchaseName) {
        this.$notify({
          type: 'warning',
          message: '请选择类别!',
        });
        return false;
      }
      if (!this.sectionInfo.purchaseTypeName) {
        this.$notify({
          type: 'warning',
          message: '请选择物资种类!',
        });
        return false;
      }
      if (!this.sectionInfo.amount) {
        this.$notify({
          type: 'warning',
          message: '请输入预估采购金额!',
        });
        return false;
      }
      if (!String(this.sectionInfo.purchaseFileName ?? '').trim()) {
        this.$notify({
          type: 'warning',
          message: '请输入物资名称!',
        });
        return false;
      }
      if (!this.sectionInfo.registrationDate) {
        this.$notify({
          type: 'warning',
          message: '请选择预计采购完成日期!',
        });
        return false;
      }
      if (!PURCHASE_METHODS.includes(this.sectionInfo.purchaseMethod)) {
        this.$notify({
          type: 'warning',
          message: '请选择采购方式!',
        });
        return false;
      }
      return true;
    },
    sureClick() {
      if (!this.validateBasicInfo()) return;
      if (this.remarkLength > this.remarkMaxLength) {
        this.$notify({
          type: 'warning',
          message: `备注不能超过 ${this.remarkMaxLength} 字`,
        });
        return
      }
      const missingAttachment = this.attachmentSections.find(item => item.required && !item.files.length);
      if (missingAttachment) {
        this.$notify({
          type: 'warning',
          message: `请上传${missingAttachment.label}!`,
        });
        return
      }
      return this.savePurchaseFile();
    },
  },
};
</script>

<style lang="less" scoped>
.detail-base-info .detail-title-content > .attachment-required-mark {
  color: #1989fa;
}

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
