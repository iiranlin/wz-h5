<!-- 新增、修改合同核备 -->
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
            <span>买方单位：</span>
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
          <van-field v-model="sectionInfo.itemName" required name="itemName" label="合同名称" placeholder="请输入合同名称"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.budget" required name="budget" label="合同金额" placeholder="请输入合同金额"
            input-align="right">
            <template #button>
              <span style="color: #333;">万元</span>
            </template>
          </van-field>
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.itemCode" required name="itemCode" label="合同编号" placeholder="请输入合同编号"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.buyerCode" required name="buyerCode" label="采购编号" placeholder="请输入采购编号"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.genera" readonly clickable required name="genera" label="物资大类"
            placeholder="请选择物资大类" right-icon="arrow" input-align="right" @click="showGeneraPicker = true">

          </van-field>
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.parcelCode" required name="parcelCode" label="包件号" placeholder="请输入包件号"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.category" readonly clickable required name="category
" label="类别" placeholder="请选择类别" right-icon="arrow" @click="showcategoryPicker = true" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.variety" readonly clickable required name="variety
" label="物资种类" placeholder="请选择物资种类" right-icon="arrow" @click="showvarietyPicker = true" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.detail" readonly clickable required name="detail
" label="物资细目" placeholder="请选择物资细目" right-icon="arrow" @click="showdetailPicker = true" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.amount" required name="amount
" label="供应商" placeholder="请输入供应商" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.expectedCompletion" readonly clickable required name="expectedCompletion"
            label="合同签订日期" placeholder="请选择合同签订日期" right-icon="arrow" @click="handlerShowCalendar('calendar')"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field readonly required name="defaultRadio" label="铁路专用产品" input-align="right">
            <template #input>
              <van-radio-group v-model="sectionInfo.defaultRadio" direction="horizontal" style="justify-content: end;">
                <van-radio name="0" shape="square" class="detail-radio">是</van-radio>
                <van-radio name="1" shape="square" class="detail-radio">否</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>合同副本扫描件</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.schemeList?.length"><span
          class="li-span-red">*</span>必填项，请选择文件上传，支持jpg、png、jpeg、pdf格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="sectionInfo.schemeList
        || []" businessType="01" class="outbound-field-uploader" />
    </div>

    <div class="detail-base-info detail-base-info-edited"
      :style="{ marginBottom: sectionInfo.defaultRadio == '1' ? '65px' : '0' }">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>供应商质量终身承诺书</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.fileList?.length"><span
          class="li-span-red">*</span>必填项，请选择文件上传，支持jpg、png、jpeg、pdf格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="sectionInfo.fileList
        || []" businessType="02" class="outbound-field-uploader" />
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="sectionInfo.defaultRadio != '1'">
      <div class="detail-title-content">
        <img src="@/assets/img/certificate.png" />
        <span>许可/认证证书</span>
      </div>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.licence" required name="licence" label="许可/认证类别" placeholder="请输入许可/认证类别"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.issueUnit" required name="issueUnit" label="发证单位" placeholder="请输入发证单位"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.certificateNo" required name="certificateNo
" label="证书编号" placeholder="请输入证书编号" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.validPeriod" readonly clickable required name="validPeriod" label="有效期限"
            placeholder="请选择有效期限" @click="handlerShowCalendar('calendar1')" right-icon="arrow" input-align="right" />
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-bottom: 65px;"
      v-if="sectionInfo.defaultRadio != '1'">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>合同核备附件</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.fileList01?.length">请选择文件上传，支持jpg、png、jpeg、pdf格式，可上传多个</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="sectionInfo.fileList01
        || []" :maxCount="99" businessType="03" class="outbound-field-uploader" />
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
    <!-- 合同签订日期 -->
    <Calendar ref="calendar" @onConfirm="handleDataConfirm" :unlimited="true" />
    <!-- 有效期限 -->
    <rangeCalendar ref="calendar1" @onConfirm="handlevalidPeriodConfirm" :unlimited="true" />
  </div>
</template>

<script>
import FileUploadView from "@/components/FileUploadView.vue";
import Calendar from "@/layout/components/calendar.vue";
import rangeCalendar from "./components/calendar.vue";
import { materialCategoryList, purchasefindAllList, purchasefindAllListType, purchasefindAllListDetail, materialSectionProject } from "@/api/prodmgr-inv/SelfBuying"

export default {
  name: 'PerfectFile',

  components: { FileUploadView, Calendar, rangeCalendar },

  data() {
    return {
      detailInfo: {},
      sectionInfo: {
        schemeList: [],
        fileList: [],
        fileList01: [],
      },
      rearHand: [],
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
    // 判断是编辑还是新增，查询展示信息和回显数据
    if (this.$route.query.type == 'create') {
      this.getGeneraList();
      this.detailInfo = await this.getMaterialSectionProject();
    } else {
      console.log("修改")
    }
  },

  methods: {
    // 物资大类确认事件
    async onGeneraConfirm(value) {
      this.sectionInfo.genera = value.text;
      this.sectionInfo.generaCode = value.code;
      this.showGeneraPicker = false;

      const data = await this.getPurchaseList({ code: value.text });

      this.sectionInfo.category = '';
      this.sectionInfo.detail = '';
      this.sectionInfo.variety = '';
      this.categoryColumns = [];
      this.detailColumns = [];
      this.varietyColumns = [];

      this.categoryColumns = data?.map(el => {
        return { text: el.purchaseName, code: el.purchaseCode }
      }) || [];
    },
    // 类别确认事件
    async oncategoryConfirm(value) {
      if (!value) {
        return this.showcategoryPicker = false;
      }
      this.sectionInfo.category = value.text;
      this.sectionInfo.categoryCode = value.code;
      this.showcategoryPicker = false;

      const data = await this.getPurchaseListType({ code: this.sectionInfo.genera, purchaseCode: value.code });

      this.sectionInfo.detail = '';
      this.sectionInfo.variety = '';
      this.detailColumns = [];
      this.varietyColumns = [];

      this.varietyColumns = data?.map(el => {
        return { text: el.purchaseTypeName, code: el.purchaseTypeCode }
      }) || [];
    },
    // 物资细目确认事件
    async ondetailConfirm(value) {
      if (!value) {
        return this.showdetailPicker = false;
      }
      this.sectionInfo.detail = value.text;
      this.sectionInfo.detailCode = value.code;
      this.showdetailPicker = false;
    },
    // 物资种类确认事件
    async onvarietyConfirm(value) {
      if (!value) {
        return this.showvarietyPicker = false;
      }
      this.sectionInfo.variety = value.text;
      this.sectionInfo.varietyCode = value.code;
      this.showvarietyPicker = false;

      const data = await this.getPurchaseListDetail({ code: this.sectionInfo.genera, purchaseCode: this.sectionInfo.categoryCode, purchaseTypeCode: value.code });

      this.sectionInfo.detail = '';
      this.detailColumns = [];

      this.detailColumns = data?.map(el => {
        return { text: el.purchaseDetailName, code: el.purchaseDetailCode }
      }) || [];
    },
    // 获取物资大类
    async getGeneraList() {
      await materialCategoryList().then(res => {
        if (res.code == 0) {
          this.generaColumns = res.data.map(el => {
            return { text: el.name }
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
    // 有效期限
    handlevalidPeriodConfirm(time) {
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

      this.rearHand = [`${year}-${month}-${day}`, `${year2}-${month2}-${day2}`]

      this.sectionInfo.validPeriod = `${year}-${month}-${day} 至 ${year2}-${month2}-${day2}`

      this.$forceUpdate();
    },
    // 合同签订日期
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

      this.sectionInfo.expectedCompletion = `${year}-${month}-${day}`
      this.$forceUpdate();
    },
    handlerShowCalendar(elementName, num = 0) {
      this.$refs[elementName]?.handleCalendarShow(num);
    },
    sureClick(isData) {
      console.log(this.sectionInfo.defaultRadio, 'sectionInfo.defaultRadio')
      if (isData) {
        if (!this.sectionInfo.itemName) {
          this.$notify({
            type: 'warning',
            message: '请输入合同名称!',
          });
          return
        }
        if (!this.sectionInfo.budget) {
          this.$notify({
            type: 'warning',
            message: '请输入合同金额!',
          });
          return
        }
        if (!this.sectionInfo.itemCode) {
          this.$notify({
            type: 'warning',
            message: '请输入合同编号!',
          });
          return
        }
        if (!this.sectionInfo.buyerCode) {
          this.$notify({
            type: 'warning',
            message: '请输入采购编号!',
          });
          return
        }
        if (!this.sectionInfo.genera) {
          this.$notify({
            type: 'warning',
            message: '请选择物资大类!',
          });
          return
        }
        if (!this.sectionInfo.parcelCode) {
          this.$notify({
            type: 'warning',
            message: '请输入包件号!',
          });
          return
        }
        if (!this.sectionInfo.category) {
          this.$notify({
            type: 'warning',
            message: '请选择类别!',
          });
          return
        }
        if (!this.sectionInfo.detail) {
          this.$notify({
            type: 'warning',
            message: '请选择物资细目!',
          });
          return
        }
        if (!this.sectionInfo.amount) {
          this.$notify({
            type: 'warning',
            message: '请输入供应商!',
          });
          return
        }
        if (!this.sectionInfo.variety) {
          this.$notify({
            type: 'warning',
            message: '请选择物资种类!',
          });
          return
        }
        if (!this.sectionInfo.expectedCompletion) {
          this.$notify({
            type: 'warning',
            message: '请选择合同签订日期!',
          });
          return
        }
        if (!this.sectionInfo.defaultRadio) {
          this.$notify({
            type: 'warning',
            message: '请选择是否为铁路产品!',
          });
          return
        }
        if (!this.sectionInfo.schemeList?.length > 0) {
          this.$notify({
            type: 'warning',
            message: '请选择合同副本扫描件!',
          });
          return
        }
        if (!this.sectionInfo.fileList?.length > 0) {
          this.$notify({
            type: 'warning',
            message: '请选择供应商质量终身承诺书!',
          });
          return
        }

        if (this.sectionInfo.defaultRadio == '0') {
          if (!this.sectionInfo.licence) {
            this.$notify({
              type: 'warning',
              message: '请输入许可/认证类别!',
            });
            return
          }

          if (!this.sectionInfo.issueUnit) {
            this.$notify({
              type: 'warning',
              message: '请输入发证单位!',
            });
            return
          }

          if (!this.sectionInfo.certificateNo) {
            this.$notify({
              type: 'warning',
              message: '请输入证书编号!',
            });
            return
          }

          if (!this.sectionInfo.validPeriod) {
            this.$notify({
              type: 'warning',
              message: '请选择有效期限!',
            });
            return
          }
        }


        // 判断新增或编辑调用不同接口，成功后跳转回列表页面

      } else {
        this.$router.push({ name: 'purchaseContract' })
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

  .detail-radio {
    width: 80px;
    height: 27px;
    border: 1px solid #e5e5e5;
    padding: 0 10px;
    border-radius: 5px;
    margin-right: 16px;
    font-size: 14px;
    position: relative;

    ::v-deep .van-radio__label {
      margin: 0 auto;
    }
  }

  .detail-radio[aria-checked="true"] {
    border: 1px solid #028bff;
  }

  .detail-radio[aria-checked="true"]::before {
    content: '';
    width: 0px;
    height: 0px;
    border-top: 20px solid transparent;
    border-left: 20px solid transparent;
    border-bottom: 20px solid #028bff;
    border-radius: 20%;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .detail-radio[aria-checked="true"]::after {
    content: '√';
    width: 15px;
    height: 15px;
    position: absolute;
    bottom: 0;
    right: 0;
    color: #fff;
    line-height: 20px;
    text-align: center;
    font-size: 10px;
  }

  ::v-deep .detail-radio .van-radio__icon {
    display: none;
  }

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