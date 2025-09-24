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
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.purchaseDetailName" readonly clickable required name="purchaseDetailName
" label="物资细目" placeholder="请选择物资细目" right-icon="arrow" @click="showdetailPicker = true" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.quantity" required name="quantity
" label="数量" placeholder="请输入数量" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.amount" required name="amount" type="number" label="预算金额"
            placeholder="请输入预算金额" input-align="right">
            <template #button>
              <span style="color: #333;">万元</span>
            </template>
          </van-field>
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.purchaseFileName" required name="purchaseFileName" label="物资名称"
            placeholder="请输入物资名称" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.registrationDate" readonly clickable required name="registrationDate"
            label="预计采购完成日期" placeholder="请选择预计采购完成日期" right-icon="arrow" @click="handlerShowCalendar('calendar')"
            input-align="right" />
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>备注</span>
      </div>
      <div class="detail-title-content-field">
        <van-field v-model="sectionInfo.remak" class="detail-base-info-edited-textarea" rows="3" autosize
          type="textarea" placeholder="请输入备注信息" />
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
          style="font-size: 12px; color: #898C9F; font-weight: 300;">(必传项)</span>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>采购方案或招标计划</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.registration?.length"><span
          class="li-span-red">*</span>必填项，请选择文件上传，支持jpg、png、jpeg、pdf格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="sectionInfo.registration
        || []" businessType="01" class="outbound-field-uploader" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 65px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>采购文件（含技术规格书）</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.bidDocument?.length"><span
          class="li-span-red">*</span>必填项，请选择文件上传，支持jpg、png、jpeg、pdf格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="sectionInfo.bidDocument
        || []" businessType="01" class="outbound-field-uploader" />
    </div>

    <div class="default-button-container">
      <van-button class="button-info" round @click="sureClick(false)">返回</van-button>
      <van-button class="button-info" round type="info" @click="sureClick(true)">确定</van-button>
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
    <!-- 预计采购完成日期 -->
    <Calendar ref="calendar" @onConfirm="handleDataConfirm" />
  </div>
</template>

<script>
import FileUploadView from "@/components/FileUploadView.vue";
import Calendar from "@/layout/components/calendar.vue";
import { parseTime } from '@/utils/index'
import { materialCategoryList, purchasefindAllList, purchasefindAllListType, purchasefindAllListDetail, materialSectionProject, materialPurchaseFilecreate, materialPurchaseFilemodify, materialPurchaseFiledetail } from "@/api/prodmgr-inv/SelfBuying"

export default {
  name: 'PerfectFile',

  components: { FileUploadView, Calendar },

  data() {
    return {
      detailInfo: {},
      sectionInfo: {
        registration: [],
        bidDocument: [],
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
    };
  },

  async mounted() {
    this.getGeneraList();
    this.detailInfo = await this.getMaterialSectionProject();
    // 判断是编辑还是新增，查询展示信息和回显数据
    if (this.$route.query.type == 'create') {
      this.sectionInfo.unitName = this.detailInfo.constructionCompany;
      this.sectionInfo.projectId = this.detailInfo.projectId;
      this.sectionInfo.projefctName = this.detailInfo.sectionName;
    } else {
      const data = await this.getGeneraDetail();

      data.registration = JSON.parse(data.registration);
      data.bidDocument = JSON.parse(data.bidDocument);
      data.registrationDate = parseTime(data.registrationDate, '{y}-{m}-{d}');

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
    sureClick(isData) {
      if (isData) {
        if (!this.sectionInfo.name) {
          this.$notify({
            type: 'warning',
            message: '请选择物资大类!',
          });
          return
        }
        if (!this.sectionInfo.purchaseName) {
          this.$notify({
            type: 'warning',
            message: '请选择类别!',
          });
          return
        }
        if (!this.sectionInfo.purchaseDetailName) {
          this.$notify({
            type: 'warning',
            message: '请选择物资细目!',
          });
          return
        }
        if (!this.sectionInfo.quantity) {
          this.$notify({
            type: 'warning',
            message: '请输入数量!',
          });
          return
        }
        if (!this.sectionInfo.purchaseTypeName) {
          this.$notify({
            type: 'warning',
            message: '请选择物资种类!',
          });
          return
        }
        if (!this.sectionInfo.amount) {
          this.$notify({
            type: 'warning',
            message: '请输入预算金额!',
          });
          return
        }
        if (!this.sectionInfo.purchaseFileName) {
          this.$notify({
            type: 'warning',
            message: '请输入物资名称!',
          });
          return
        }
        if (!this.sectionInfo.registrationDate) {
          this.$notify({
            type: 'warning',
            message: '请选择预计采购完成日期!',
          });
          return
        }
        if (!this.sectionInfo.registration?.length > 0) {
          this.$notify({
            type: 'warning',
            message: '请选择采购方案或招标计划!',
          });
          return
        }
        if (!this.sectionInfo.bidDocument?.length > 0) {
          this.$notify({
            type: 'warning',
            message: '请选择采购文件（含技术规格书）!',
          });
          return
        }

        if (this.$route.query.type == 'create') {
          const registrationDate = new Date(this.sectionInfo.registrationDate).toISOString();

          const params = {
            ...this.sectionInfo,
            id: "",
            registration: JSON.stringify(this.sectionInfo.registration),
            bidDocument: JSON.stringify(this.sectionInfo.bidDocument),
            registrationDate,
            schemeApproval: "\"\"",
            tenderAnnouncement: "\"\"",
            bidEvaluationReport: "\"\"",
            acceptance: "\"\"",
            contractCopy: "\"\"",
            other: "\"\"",
            scheme: "\"\"",
            bidAddendum: "\"\"",
            bidCandidateWeb: "\"\"",
            bidCopy: "\"\"",
            commitment: "\"\"",
          }

          materialPurchaseFilecreate(params).then(res => {
            if (res.code == 0) {
              this.$toast('新增成功')
              this.$router.push({ name: 'purchaseFile' })
            }
          })
        } else {
          const params = {
            ...this.sectionInfo,
            registration: JSON.stringify(this.sectionInfo.registration),
            bidDocument: JSON.stringify(this.sectionInfo.bidDocument),
          }

          materialPurchaseFilemodify(params).then(res => {
            if (res.code == 0) {
              this.$toast('修改成功')
              this.$router.push({ name: 'purchaseFile' })
            }
          })
        }


      } else {
        this.$router.push({ name: 'purchaseFile' })
      }
    },
  },
};
</script>

<style lang="less" scoped>
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