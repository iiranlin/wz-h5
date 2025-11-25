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
          <van-field v-model="sectionInfo.contractName" required name="contractName" label="合同名称" placeholder="请输入合同名称"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field readonly v-model="sectionInfo.amount" name="amount" type="number" label="合同金额"
            placeholder="请输入合同金额" input-align="right" @input="handlerAmount">
            <template #button>
              <span style="color: #333;">万元</span>
            </template>
          </van-field>
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.contractNumber" required name="contractNumber" label="合同编号"
            placeholder="请输入合同编号" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.purchaseNumber" required name="purchaseNumber" label="采购编号"
            placeholder="请输入采购编号" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.name" readonly clickable required name="name" label="物资大类"
            placeholder="请选择物资大类" right-icon="arrow" input-align="right" @click="showGeneraPicker = true">

          </van-field>
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.packageNumber" required name="packageNumber" label="包件号" placeholder="请输入包件号"
            input-align="right" />
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
          <van-field v-model="sectionInfo.supplierName" required name="supplierName
" label="供应商" placeholder="请输入供应商" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.startTime" readonly clickable required name="startTime" label="合同签订日期"
            placeholder="请选择合同签订日期" right-icon="arrow" @click="handlerShowCalendar('calendar', 0)"
            input-align="right" />
        </li>
      </ul>
    </div>

    <van-collapse v-model="activeNames">
      <van-collapse-item class="detail-base-info detail-base-info-edited"
        :style="index + 1 == sectionInfo.contractDetailsList.length ? { boxShadow: '0 -2px 5px rgba(32,30,74,.1)' } : ''"
        v-for="(item, index) in sectionInfo.contractDetailsList" :key="index" :name="index">
        <template #title>
          <div class="detail-title-content" style="display: flex;align-items: center; ">
              <img src="@/assets/img/Icon_notarize.png" />
              <span>物资明细{{ index + 1 }}</span>
              
              
          </div>
        </template>
        <template #value>
          <div style="display: flex; justify-content: flex-end;align-items: center;gap: 5px;">
            <van-button v-if="index == 0" class="detail-button" style="margin-left: auto;"  @click="onPerfectContractDetail">批量上传物资</van-button>
            <span v-if="sectionInfo.contractDetailsList.length > 1" style="color: #1989FA;"
              @click.stop="handleDelete(index)">删除</span>
          </div>
        </template>
        <ul class="detail-list-ul-edited">
          <li class="detail-list-li-input">
            <van-field v-model="item.materialName" required name="materialName" label="物资名称" placeholder="请输入物资名称"
              input-align="right" />
          </li>
          <li class="detail-list-li-input">
            <van-field v-model="item.specModel" required name="specModel" label="规格型号" placeholder="请输入规格型号"
              input-align="right" />
          </li>
           <li class="detail-list-li-input">
            <van-field v-model="item.brand" required name="brand" label="物资品牌" placeholder="请输入物资品牌"
              input-align="right" />
          </li>
           <li class="detail-list-li-input">
            <van-field v-model="item.technicalStandard"  name="technicalStandard" label="技术标准" placeholder="请输入技术标准"
              input-align="right" />
          </li>
          <li class="detail-list-li-input">
            <van-field v-model="item.unit" required name="unit" label="计量单位" placeholder="请输入或选择计量单位"
              input-align="right" right-icon="arrow" @click-right-icon="handleUnit(index)" />
          </li>
          <li class="detail-list-li-input">
            <van-field type="number" v-model="item.amount" required name="amount
" label="数量" placeholder="请输入数量" input-align="right" />
          </li>
          <li class="detail-list-li-input">
            <van-field v-model="item.price" required name="price" type="number" label="单价" placeholder="请输入单价金额"
              input-align="right">
              <template #button>
                <span style="color: #333;">元</span>
              </template>
            </van-field>
          </li>
          <li class="detail-list-li-input">
            <van-field type="number" v-model="item.vatRate" required name="vatRate
" label="税率" placeholder="请输入税率" input-align="right">
              <template #button>
                <span style="color: #333;">%</span>
              </template>
            </van-field>
          </li>
          <li class="detail-list-li-input">
            <van-field type="number" v-model="item.totalAmount" required name="totalAmount
" label="合价" placeholder="请输入合价" input-align="right">
              <template #button>
                <span style="color: #333;">元</span>
              </template>
            </van-field>
          </li>
          <li class="detail-list-li-input">
            <van-field readonly required name="railwaySpecial" label="铁路专用产品" input-align="right">
              <template #input>
                <van-radio-group @change="(name) => handleRailwaySpecial(name, index)" v-model="item.railwaySpecial"
                  direction="horizontal" style="justify-content: end;">
                  <van-radio name="1" shape="square" class="detail-radio">是</van-radio>
                  <van-radio name="0" shape="square" class="detail-radio">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>
          </li>
        </ul>

        <div v-if="item.railwaySpecial != '0'" style="border-top: 1px solid #e5e5e5;">
          <div class="detail-base-info detail-base-info-edited">
            <div class="detail-title-content">
              <img src="@/assets/img/certificate.png" />
              <span>许可/认证证书</span>
            </div>
            <ul class="detail-list-ul-edited">
              <li class="detail-list-li-input">
                <van-field v-model="item.licenseCategory" required name="licenseCategory" label="许可/认证类别"
                  placeholder="请输入许可/认证类别" input-align="right" label-width="7.2em" />
              </li>
              <li class="detail-list-li-input">
                <van-field v-model="item.issuanceUnit" required name="issuanceUnit" label="发证单位" placeholder="请输入发证单位"
                  input-align="right" />
              </li>
              <li class="detail-list-li-input">
                <van-field v-model="item.quantity" required name="quantity
" label="证书编号" placeholder="请输入证书编号" input-align="right" />
              </li>
              <li class="detail-list-li-input">
                <van-field v-model="item.validPeriod" readonly clickable required name="validPeriod" label="有效期限"
                  placeholder="请选择有效期限" @click="handlerShowCalendar('calendar1', 0, index)" right-icon="arrow"
                  input-align="right" />
              </li>
            </ul>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

    <div class="file-add">
      <van-button @click="handerAdd" class="button-info" type="default" round block><span
          style="color: #1989FA;">+添加物资明细</span></van-button>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>合同副本扫描件</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.htfbsmj?.length"><span
          class="li-span-red">*</span>必填项，请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view :maxCount="99" accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="sectionInfo.htfbsmj
        || []" businessType="01" class="outbound-field-uploader" />
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>供应商质量终身承诺书</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.gyszlzscns?.length"><span
          class="li-span-red">*</span>必填项，请选择文件上传，支持jpg、png、jpeg、pdf、doc格式</p>
      <file-upload-view :maxCount="99" accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="sectionInfo.gyszlzscns
        || []" businessType="02" class="outbound-field-uploader" />
    </div>
    <div class="detail-base-info detail-base-info-edited" style="margin-bottom: 65px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>合同核备附件</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.hthbfj?.length">请选择文件上传，支持jpg、png、jpeg、pdf、doc格式，可上传多个</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf,.doc,.docx" :fileList="sectionInfo.hthbfj
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
    <!-- 计量单位 -->
    <van-popup v-model="showUnitPicker" round position="bottom">
      <van-picker show-toolbar :columns="unitColumns" @cancel="showUnitPicker = false" @confirm="onUnitConfirm" />
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
import { parseTime } from '@/utils/index'
import { materialCategoryList, purchasefindAllList, purchasefindAllListType, purchasefindAllListDetail, materialSectionProject, materialPurchaseContractcreate, materialPurchaseContractdetail, materialPurchaseContractmodify } from "@/api/prodmgr-inv/SelfBuying"
import keepPages from '@/view/mixins/keepPages'

export default {
  name: 'PerfectFile',
  mixins: [keepPages],

  components: { FileUploadView, Calendar, rangeCalendar },

  computed: {
    unitColumns() {
      if (this.dict && this.dict.MeasureUnit) {
        return this.dict.MeasureUnit.map(item => item.label);
      }
      return [];
    },
    contractValue() {
      const list = Array.isArray(this.sectionInfo.contractDetailsList) ? this.sectionInfo.contractDetailsList : [];

      return list.reduce((total, el) => {
        const amount = el && el.totalAmount ? el.totalAmount : 0;
        return total + Number(amount) ;
      }, 0);
    },
  },

  watch: {
    contractValue: {
      handler(val) {
        this.sectionInfo.amount = (val / 10000).toFixed(2);
      },
      immediate: true,
    }
  },

  dicts: ['MeasureUnit'],

  data() {
    return {
      contractDetailsIndex: 0,
      activeNames: [0],
      detailInfo: {},
      sectionInfo: {
        htfbsmj: [],
        gyszlzscns: [],
        hthbfj: [],
        contractDetailsList: [
          {
            materialName: '',
            specModel: '',
            unit: '',
            amount: '',
            price: '',
            vatRate: '',
            totalAmount: '',
            railwaySpecial: '0',
            licenseCategory: '',
            issuanceUnit: '',
            quantity: '',
            validPeriod: '',
            startTime: '',
            endTime: '',
            brand:'',
            technicalStandard:''
          }
        ],
      },
      contractLicenseIndex: 0,
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
    };
  },
  activated(){
    const importedDetails = sessionStorage.getItem('perfectContract_imported_details');

    if(importedDetails){
      try {
        const parsedList = JSON.parse(importedDetails || '[]');

        this.sectionInfo.contractDetailsList = Array.isArray(parsedList) ? parsedList.map(item => {
          const validPeriod = item?.startTime && item?.endTime ? `${item.startTime} 至 ${item.endTime}` : '';

          return {
            ...item,
            validPeriod,
          };
        }) : [];
      } catch (error) {
        console.log('解析批量导入物资明细失败', error);
      }
    }
  },

  async created() {
    this.getGeneraList();
    this.detailInfo = await this.getMaterialSectionProject();
    // 判断是编辑还是新增，查询展示信息和回显数据
    if (this.$route.query.type == 'create') {
      this.sectionInfo.projectId = this.detailInfo.projectId;
      this.sectionInfo.unitName = this.detailInfo.constructionCompany;
      this.sectionInfo.projefctName = this.detailInfo.sectionName;
    } else {
      try {
        const data = await this.getGeneraDetail();

        data.htfbsmj = JSON.parse(data.files)?.htfbsmj || [];
        data.gyszlzscns = JSON.parse(data.files)?.gyszlzscns || [];
        data.hthbfj = JSON.parse(data.files)?.hthbfj || [];
        data.startTime = parseTime(data.startTime, '{y}-{m}-{d}');

        data.contractDetailsList.forEach((el, index) => {
          if (el.railwaySpecial == '1') {
            el.validPeriod = el.startTime && el.endTime ? this.formatTimestamp(el.startTime) + ' 至 ' + this.formatTimestamp(el.endTime) : '';
          }

          this.activeNames.push(index);
        })


        this.sectionInfo = data;
        this.sectionInfo.projectId = this.detailInfo.projectId;

        await this.onGeneraConfirm({ text: data.name, code: data.code }, false);
        await this.oncategoryConfirm({ text: data.purchaseName, code: data.purchaseCode }, false);
        await this.onvarietyConfirm({ text: data.purchaseTypeName, code: data.purchaseTypeCode }, false);
      } catch (error) {
        console.log(error, "error")
      }

    }
  },

  methods: {
    // 跳转批量导入页面
    onPerfectContractDetail(){
      this.$router.push({
        name: 'perfectContractBatchUpload', 
        query: {
          id: this.$route.query.id // 传入 contractId
        }
      });
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    handleRailwaySpecial(name, index) {
      if (name == 0) {
        this.sectionInfo.contractDetailsList[index].licenseCategory = '';
        this.sectionInfo.contractDetailsList[index].issuanceUnit = '';
        this.sectionInfo.contractDetailsList[index].quantity = '';
        this.sectionInfo.contractDetailsList[index].validPeriod = '';
        this.sectionInfo.contractDetailsList[index].startTime = '';
        this.sectionInfo.contractDetailsList[index].endTime = '';
      }
    },
    handleUnit(index) {
      this.contractDetailsIndex = index;
      this.showUnitPicker = true;
    },
    handleDelete(index) {
      this.$dialog.confirm({
        message: '是否确认删除？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.sectionInfo.contractDetailsList.splice(index, 1);
      })
    },
    handerAdd() {
      this.sectionInfo.contractDetailsList.push(
        {
          materialName: '',
          specModel: '',
          brand:'',
          technicalStandard:'',
          unit: '',
          amount: '',
          price: '',
          vatRate: '',
          totalAmount: '',
          railwaySpecial: '0',
          licenseCategory: '',
          issuanceUnit: '',
          quantity: '',
          validPeriod: '',
          startTime: '',
          endTime: '',
        }
      );

      this.activeNames.push(this.sectionInfo.contractDetailsList.length - 1);
    },
    // 计量单位确认事件
    onUnitConfirm(value) {
      if (!value) {
        return this.showUnitPicker = false;
      }
      this.$nextTick(() => {
        this.sectionInfo.contractDetailsList[this.contractDetailsIndex].unit = value;
      })
      this.showUnitPicker = false;
    },
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
    async ondetailConfirm(value) {
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
      const res = await materialPurchaseContractdetail(this.$route.query.id);

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

      this.sectionInfo.contractDetailsList[this.contractLicenseIndex].validPeriod = `${year}-${month}-${day} 至 ${year2}-${month2}-${day2}`;

      this.sectionInfo.contractDetailsList[this.contractLicenseIndex].startTime = `${year}-${month}-${day}`; this.sectionInfo.contractDetailsList[this.contractLicenseIndex].endTime = `${year2}-${month2}-${day2}`;

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

      this.sectionInfo.startTime = `${year}-${month}-${day}`
      this.$forceUpdate();
    },
    handlerShowCalendar(elementName, num, index = undefined) {
      this.contractLicenseIndex = index;
      this.$refs[elementName]?.handleCalendarShow(num);
    },
    // 许可/认证证书必填验证
    isEveryItemValid(list, requiredKeys) {
      if (!Array.isArray(list)) return false;

      return list.every(item => {
        if (!item || typeof item !== 'object') return false;

        return requiredKeys.every(key => {
          const val = item[key];
          // 把“有值”定义为：不是 undefined/null/空字符串
          return val !== undefined && val !== null && String(val).trim() !== '';
        });
      });
    },
    validateContractDetails(contractDetailsList) {
      // 需要验证的字段数组
      const requiredFields = ['materialName', 'specModel', 'unit', 'price', 'vatRate', 'totalAmount', 'amount', 'railwaySpecial', 'licenseCategory', 'issuanceUnit', 'quantity', 'validPeriod', 'startTime', 'endTime'];

      const requiredFields2 = ['materialName', 'specModel', 'unit', 'price', 'vatRate', 'totalAmount', 'amount', 'railwaySpecial','brand'];

      for (let i = 0; i < contractDetailsList.length; i++) {
        const item = contractDetailsList[i];

        // 只有当 railwaySpecial == '1' 时才验证这些字段
        if (item.railwaySpecial === '1') {
          for (const field of requiredFields) {
            // 检查字段是否为空（空字符串、null、undefined）
            if (!item[field]) {
              return {
                isValid: false,
              };
            }
          }
        } else {
          for (const field of requiredFields2) {
            // 检查字段是否为空
            if (!item[field]) {
              return {
                isValid: false,
              };
            }
          }
        }
      }

      return {
        isValid: true,
      };
    },
    handlerfix(str) {
      const [i, d] = String(str).split('.');
      return d && d.length >= 6;
    },
    handlerAmount(value) {
      const [i, d] = String(value).split('.');

      this.sectionInfo.amount = this.handlerfix(value) ? `${i}.${d.slice(0, 6)}` : value;
    },
    sureClick(isData) {
      if (isData) {
        if (!this.sectionInfo.contractName) {
          this.$notify({
            type: 'warning',
            message: '请输入合同名称!',
          });
          return
        }
        // if (!this.sectionInfo.amount) {
        //   this.$notify({
        //     type: 'warning',
        //     message: '请输入合同金额!',
        //   });
        //   return
        // }
        if (!this.sectionInfo.contractNumber) {
          this.$notify({
            type: 'warning',
            message: '请输入合同编号!',
          });
          return
        }
        if (!this.sectionInfo.purchaseNumber) {
          this.$notify({
            type: 'warning',
            message: '请输入采购编号!',
          });
          return
        }
        if (!this.sectionInfo.name) {
          this.$notify({
            type: 'warning',
            message: '请选择物资大类!',
          });
          return
        }
        if (!this.sectionInfo.packageNumber) {
          this.$notify({
            type: 'warning',
            message: '请输入包件号!',
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
        // if (!this.sectionInfo.purchaseDetailName) {
        //   this.$notify({
        //     type: 'warning',
        //     message: '请选择物资细目!',
        //   });
        //   return
        // }
        if (!this.sectionInfo.supplierName) {
          this.$notify({
            type: 'warning',
            message: '请输入供应商!',
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
        if (!this.sectionInfo.startTime) {
          this.$notify({
            type: 'warning',
            message: '请选择合同签订日期!',
          });
          return
        }
        // if (!this.sectionInfo.railwaySpecial) {
        //   this.$notify({
        //     type: 'warning',
        //     message: '请选择是否为铁路产品!',
        //   });
        //   return
        // }

        if (!this.validateContractDetails(this.sectionInfo.contractDetailsList).isValid) {
          this.$notify({
            type: 'warning',
            message: '请完善物资明细信息!',
          });
          return
        }

        if (!this.sectionInfo.htfbsmj?.length > 0) {
          this.$notify({
            type: 'warning',
            message: '请上传合同副本扫描件!',
          });
          return
        }
        if (!this.sectionInfo.gyszlzscns?.length > 0) {
          this.$notify({
            type: 'warning',
            message: '请上传供应商质量终身承诺书!',
          });
          return
        }
        

        // 判断新增或编辑调用不同接口，成功后跳转回列表页面
        const time = new Date(this.sectionInfo.startTime);

        this.sectionInfo.amount = +this.sectionInfo.amount;

        if (this.$route.query.type == 'create') {

          const params = {
            ...this.sectionInfo,
            id: null,
            files: JSON.stringify({ htfbsmj: this.sectionInfo.htfbsmj, gyszlzscns: this.sectionInfo.gyszlzscns, hthbfj: this.sectionInfo.hthbfj }),
            startTime: time.getTime(),
            contractDetailsList: this.sectionInfo.contractDetailsList,
            sectionShortName: this.detailInfo.projectShortName,
            projectName: this.detailInfo.projectName,
          }

          materialPurchaseContractcreate(params).then(res => {
            if (res.code == 0) {
              sessionStorage.removeItem('perfectContract_imported_details')
              this.$toast('新增成功')
              this.$router.push({ name: 'purchaseContract' })
            }
          })
        } else {
          const params = {
            ...this.sectionInfo,
            files: JSON.stringify({ htfbsmj: this.sectionInfo.htfbsmj, gyszlzscns: this.sectionInfo.gyszlzscns, hthbfj: this.sectionInfo.hthbfj }),
            startTime: time.getTime(),
            contractDetailsList: this.sectionInfo.contractDetailsList,
          }

          materialPurchaseContractmodify(params).then(res => {
            if (res.code == 0) {
              sessionStorage.removeItem('perfectContract_imported_details')
              
              this.$toast('修改成功')
              this.$router.push({ name: 'purchaseContract' })

            }
          })
        }

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

.file-add {
  text-align: center;
  padding: 10px 40px 10px 40px;
  width: auto;
  box-sizing: border-box;
  margin-left: 6px;
  margin-right: 6px;
  background: #ffffff;
  border-radius: 7px;
  box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);

  ::v-deep .van-uploader {
    width: 100%;
  }

  ::v-deep .van-uploader__input-wrapper {
    width: 100%;
  }

  ::v-deep .van-button {
    height: 36px;
  }

  .van-button__text {
    span {
      vertical-align: middle;
    }

    .file-download {
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }
  }
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

  .detail-button{
        height: 30px;
      }
</style>
