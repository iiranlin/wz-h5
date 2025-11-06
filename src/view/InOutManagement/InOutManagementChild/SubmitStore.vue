<template>
  <div class="requirement-details">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>入库单号：</p>
        <p>{{ formData.storeNumber }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
            <li>
              <span>需求名称：</span>
              <span>{{ formData.planName }}</span>
            </li>
            <li>
              <span>建设项目：</span>
              <span>{{ formData.projectName }}</span>
            </li>
            <li>
              <span>标段项目：</span>
              <span>{{ formData.sectionName }}</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>{{ formData.deptName }}</span>
            </li>
            <li v-if="formData.storeDate">
              <span>填报时间：</span>
              <span>{{ formData.storeDate ? parseTime(formData.storeDate, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
            </li>
            <li v-if="formData.storeOperator">
              <span>操作人：</span>
              <span>{{ formData.storeOperator }}</span>
            </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="queryType === 'submit'">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>报检结果</span>
      </div>
      <p class="box-container-p" v-if="!formData.fileList01?.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持jpg、png、jpeg、pdf格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :maxCount="99" :fileList="formData.fileList01 || []" businessType="01" />
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="queryType != 'submit' && formData.fileList01?.length">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>报检结果</span>
      </div>
      <file-download-view :fileList="formData.fileList01 || []" />
    </div>

    <div v-if="queryType === 'submit'" class="detail-floor-content">
      <div>
        <van-button type="default" :class="{ 'van-button-selected': btnClickIndex == '0' }"
          @click="btnClick('0')">全部物资</van-button>
        <van-button type="default" :class="{ 'van-button-selected': btnClickIndex == '1' }"
          @click="btnClick('1')">未完善物资</van-button>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-else style="margin-bottom: 8px; background-color: #F2F4F8;">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-batch.png" />
        <span>物资明细</span>
        <span style="text-align: right;">共 <span style="color: #134DAA;">{{ materiaList.length }}</span> 项</span>
      </div>
    </div>

    <div style="padding-bottom: 50px;">
      <div class="box-container" v-for="(item, index) in btnClickIndex == '0' ? materiaList : editMateriaList"
      :key="item.id"
      :class="boolExceptZero(item.putTotal) && boolExceptZero(item.refundTotal) ? '' : 'box-container-unedited'">
      <div class="div-child">
        <ul class="detail-list-ul">
          <li class="detail-list-ul-text">
            <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
            <img v-if="queryType === 'submit'" :src="boolExceptZero(item.putTotal) && boolExceptZero(item.refundTotal) ? editedStatus : editStatus" />
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li class="li-item-overlength">
            <span>有效期截止日期：</span>
            <span>{{ item.expirationDate | formatToDate }}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次实收数量：</span>
            <span class="li-span-click">{{ item.putTotal }} {{ item.unit }}</span>
          </li>
          <li>
            <span>报检通过：</span>
            <span class="li-span-click">{{ item.storeTotal }} {{ item.unit }}</span>
          </li>
          <li>
            <span>报检退货：</span>
            <span style="color: #e4393c;">{{ item.refundZjTotal }} {{ item.unit }}</span>
          </li>
        </ul>
      </div>
      <div class="list-ul-button">
        <van-button v-if="queryType === 'submit'" class="button-info" plain round type="info" native-type="button"
          @click="editedClick(item, index)">{{ boolExceptZero(item.putTotal) && boolExceptZero(item.refundTotal) ? '编辑'
          : '处理' }} </van-button>
        <van-button v-else class="button-info" plain round type="info" native-type="button"
          @click="editedClick(item, index)">查看</van-button>
      </div>
    </div>
    </div>

    <div class="default-button-container" v-if="queryType === 'submit'">
      <div class="default-button-container-selected">
        <span>已填写 <span class="li-span-click">{{ editedMateriaList.length }}</span><span>/{{ materiaList.length
            }}</span>
        </span>
      </div>
      <div class="default-button-container-button" v-if="queryType === 'submit'">

        <van-button v-if="isFlag" class="button-info" round type="info" @click="onSubmit">提交报检审核</van-button>

        <p style="font-size: 12px;" v-else><van-icon name="warning-o" color="#1989fa" /> 提示： <span>请完善所有物资入库信息</span>
        </p>
      </div>
    </div>
    <!-- 附件预览 -->
    <file-preview ref="filePreview"></file-preview>
    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import {parseTime} from '@/utils'
import editedStatus from '@/assets/img/editedStatus.png'
import editStatus from '@/assets/img/editStatus.png'
import keepPages from "@/view/mixins/keepPages";
import indexMixin from '@/view/mixins'
import { detailByStore } from '@/api/prodmgr-inv/materialCirculationTableRest'
import {detailStoreBack} from '@/api/prodmgr-inv/materialStoreTableRest'
import { materialStoreTableRestSubmit } from '@/api/prodmgr-inv/materialStoreTableRest'
import FilePreview from "@/components/FilePreview.vue";
import activitiAssignee from '@/components/activitiAssignee'
import FileUploadView from "@/components/FileUploadView.vue"
import FileDownloadView from "@/components/FileDownloadView.vue"
import BackToTop from '@/components/BackToTop'
export default {
  name: 'SubmitStore',
  mixins: [indexMixin, keepPages],
  components: { FilePreview, activitiAssignee, FileUploadView, FileDownloadView, BackToTop },
  filters: {
    formatDate(value) {
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
    },
    formatToDate(value) {
      if (value) {
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      } else {
        return ""
      }
    }
  },
  computed: {
    isFlag() {

      let flag = false;

      this.materiaList.forEach(item => {
        if (this.boolExceptZero(item.putTotal) && this.boolExceptZero(item.refundTotal)) {
          flag = true;
        } else {
          flag = false;
        }
      })

      return flag;
    }
  },
  data() {
    return {
      queryType: '',
      storeStatus: '',
      formData: {},
      tableData: [],
      rules: {
        storeTotal: [
          { required: true, message: '请输入入库数量' },
        ],
        refundZjTotal: [
          { required: true, message: '请输入退货数量' },
        ],
      },
      supplyId: null,
      id: null,
      statusArr: [
        { value: '', text: '全部' },
        { value: "1", text: "待检测" },
        { value: "2", text: "部分退货" },
        { value: "3", text: "已入库" },
        { value: "4", text: "已退货" },
        { value: "5", text: "审核中" },
        { value: "6", text: "已驳回" }
      ],
      menuActiveIndex: '0',
      btnClickIndex: '0',
      materiaList: [],
      editMateriaList: [],
      editedMateriaList: [],
      editedStatus,
      editStatus,
    }
  },
  activated() {
    const { type, id, storeStatus, supplyId } = this.$route.query
    this.supplyId = supplyId
    this.queryType = type
    this.id = id
    this.storeStatus = storeStatus
    this.detailByStore(id, storeStatus)
  },
  mounted() {
    const { type, id, storeStatus, supplyId } = this.$route.query
    this.supplyId = supplyId
    this.queryType = type
    this.id = id
    this.storeStatus = storeStatus
    this.detailByStore(id, storeStatus)
  },
  methods: {
    btnClick(code) {
      this.btnClickIndex = code
    },
    boolExceptZero(val) {
      return val === 0 || Boolean(val);
    },
    editedClick(item, index) {
      this.$store.dispatch('public/setMateriaData', item)

      this.$store.dispatch('public/setInboundInformation', this.formData)

      this.$router.push({ name: 'EditedMaterialSubmitStore', query: {queryType: this.queryType, id: this.id, supplyId: this.supplyId,storeStatus: this.storeStatus} })
    },
    checkStatusText(status) {
      let name = ''
      this.statusArr.forEach(item => {
        if (item.value === status) {
          name = item.text
        }
      })
      return name
    },
    checkAuditStatus(status) {
      if (status == '6') {
        return '/static/icon-reject.png'
      } else if (['2', '4'].includes(status)) {
        return '/static/icon-return.png'
      } else if (['1'].includes(status)) {
        return '/static/icon-xqjh.png'
      } else {
        return '/static/icon-success.png'
      }
    },
    historyCaches() {
      const data = this.$store.state.public.selectStoreData || []

      const finallyData = data.map((item) => Object.assign({}, item, {
        supplyDate: item.supplyDate || parseTime(new Date(), '{y}-{m}-{d}'),
        minDate: this.minDate,
        showDatePicker: this.showDatePicker,
        planAmount: item.planAmount || item.amount - item.cumulativeAmount,
        allocationUniqueNumber: item.uniqueNumber || item.allocationUniqueNumber,
        field2: item.field2 || item.deliveryLocation,
      }))


      this.editedMateriaList = finallyData.filter(item => this.boolExceptZero(item.putTotal) && this.boolExceptZero(item.refundTotal))
      this.editMateriaList = finallyData.filter(item => !(this.boolExceptZero(item.putTotal) && this.boolExceptZero(item.refundTotal)))

      return finallyData
    },
    detailByStore(id, storeStatus) {
      const url = storeStatus == "5" || storeStatus == "6" ? detailStoreBack : detailByStore
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      url(id).then(({ data }) => {
        data.materialCirculationDetailsTableDTOS.forEach(item => {
          item.storeTotal = this.queryType == "submit" ? item.putTotal : item.storeTotal; //新增默认入库数量=收货数量
          item.defaultRadio = '1';
        })

        const selectStoreData = this.$store.state.public.selectStoreData || [];

        const newData = selectStoreData?.length > 0 ? selectStoreData : data.materialCirculationDetailsTableDTOS;

        const InboundInformation = this.$store.state.public.InboundInformation || {};

        if (Object.keys(InboundInformation)?.length > 0) {
                  this.formData = Object.assign({}, this.formData, InboundInformation);
        } else {
                  this.formData = {
          ...data,
          fileList01: data.fileByList ? JSON.parse(data.fileByList).jcbg || [] : [], //检测报告
          fileList02: data.fileByList ? JSON.parse(data.fileByList).zlzm || [] : [], //证明文件
          fileList03: data.fileByList ? JSON.parse(data.fileByList).byjg || [] : [], //报验结果
        }
        }

        if(selectStoreData?.length > 0) {
          this.tableData = newData.map((item) => ({
            ...item,
          }))
        } else {
          this.tableData = newData.map((item) => ({
            ...item,
            // storeTotal: this.queryType == "submit" ? item.putTotal : item.storeTotal, //新增默认入库数量=收货数量
            fileList01: item.fileByList ? JSON.parse(item.fileByList).hgz || [] : [], //合格证
            fileList02: item.fileByList ? JSON.parse(item.fileByList).cjbg || [] : [], //厂检报告
            fileList03: item.fileByList ? JSON.parse(item.fileByList).thfj_im || [] : [], //退货附件
          }))
        }


        this.$store.dispatch('public/setSelectStoreData', this.tableData);

        this.materiaList = this.historyCaches();
      }).finally((err) => {
        toast.clear()
      })
    },
    //附件上传前
    beforeRead(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isFileName = file.name.length < 90;

      if (!isLt10M) {
        this.$notify({
          type: 'warning',
          message: '上传文件大小不能超过 10MB!',
        });
        return false;
      }
      if (!isFileName) {
        this.$notify({
          type: 'warning',
          message: '上传文件名过长!',
        });
        return false;
      }
      return true;
    },
    putChange(item, index) {
      //入库不能超过收货，最终算出退货
      this.$nextTick( () => {
        if(Number(item.storeTotal) > 0){
          this.tableData[index].storeTotal = item.putTotal
          this.tableData[index].refundZjTotal = 0
        }else{
          this.tableData[index].refundZjTotal = item.putTotal
        }
        // if (Number(item.storeTotal) > Number(item.putTotal)) {
        //   this.$toast('入库数量不能大于收货数量！')
        //   this.tableData[index].storeTotal = item.putTotal
        // } else {
        //   this.tableData[index].refundZjTotal = Number(item.putTotal) - Number(item.storeTotal)
        // }
      })
    },
    //填写退货数量
    changeRefund(item, index) {
      //退货不能超过收货，最终算出入库
      this.$nextTick( () => {
        if(Number(item.refundZjTotal) > 0){
          this.tableData[index].refundZjTotal = item.putTotal
          this.tableData[index].storeTotal = 0
        }else{
          this.tableData[index].storeTotal = item.putTotal
        }
        // if (Number(item.refundZjTotal) > Number(item.putTotal)) {
        //   this.$toast('退货数量不能大于收货数量！')
        //   this.tableData[index].refundZjTotal = Number(item.putTotal) - Number(item.storeTotal);
        // } else {
        //   this.tableData[index].storeTotal = Number(item.putTotal) - Number(item.refundZjTotal);
        // }
      })
    },
    onCheck(tableData) {
      const errors = [];
      tableData.forEach((row, index) => {
        const rowNum = index + 1;
        if (Number(row.refundZjTotal) > 0 && row.fileList03.length == 0) {
          errors.push(`第${rowNum}个，有退货数量，请上传退货附件 `);
        }
      });

      if (errors.length > 0) {
        this.$toast({
          type: 'html',
          message: errors.join("<br/>")
        })
        return false;
      }
      return true;
    },
    onSubmit() {
      const isValid = this.onCheck(this.tableData);
      if (!isValid) {
        return;
      }
      for (let i in this.tableData) {
        let fileByList = this.tableData[i].fileByList
          ? JSON.parse(this.tableData[i].fileByList)
          : {};
        //退货附件
        if (this.tableData[i].fileList03.length > 0) {
          this.$set(fileByList, "thfj_im", this.tableData[i].fileList03);
        }
        this.tableData[i].fileByList = JSON.stringify(fileByList);
      }
      //组装附件
      let fileByList = this.formData.fileByList ? JSON.parse(this.formData.fileByList) : {};
      //检测报告
      if (this.formData.fileList01.length > 0) {
        this.$set(fileByList, "jcbg", this.formData.fileList01);
      } else {
        this.$notify({
          type: 'warning',
          message: "请上传报检结果附件"
        });
        return
      }
      //质量证明文件
      if (this.formData.fileList02.length > 0) {
        this.$set(fileByList, "zlzm", this.formData.fileList02);
      }
      //报验结果
      if (this.formData.fileList03.length > 0) {
        this.$set(fileByList, "byjg", this.formData.fileList03);
      }
      this.formData.fileByList = JSON.stringify(fileByList);

      this.$dialog.confirm({
        message: '提交报检结果审核?',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs.activitiAssignee.init('RKLC', this.formData)
      })
    },
    //选择审核人回调
    optionsSuccess(assignee, { id, planType }) {
      const params = Object.assign({ supplyId: this.supplyId, id: this.id, planType: planType, assignee }, this.formData, { materialCirculationDetailsTableParamList: this.tableData })
      materialStoreTableRestSubmit(params).then(() => {
        this.$toast('提交入库审核成功')
        this.$router.push({ path: '/InListContent' })
      })
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
        & :nth-child(2){
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
            word-wrap:break-word;
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
    .li-span-open{
      justify-content: end;
      padding-top: 5px;
      i{
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
    margin: 5px;
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

  .box-container-p{
      font-size: 11px;
      color: #4a4a4a;
      text-align: center;
      margin-top: 22px;
      margin-bottom: 13px;
      span{
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
    justify-content: space-between;
    padding-left: 14px;
    padding-right: 19px;
    box-sizing: border-box;
    box-shadow: 4px 0px 5px rgba(32, 30, 74, 0.1);

    .default-button-container-selected {
      font-size: 13px;

      span {
        vertical-align: middle;
      }

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }

      .default-button-container-selected-img {
        transform: rotate(180deg)
      }
    }

    .default-button-container-button{
      display: flex;
      .button-info{
        margin-left: 10px;
      }
    }

    .button-info {
      width: 120px;
      height: 34px;
    }

    ::v-deep .file-add{
      margin: 0;
      padding: 0;
    }
  }
}
// .detail-list-li-input {

//   & :nth-child(2) {
//     text-align: center;
//   }

//   ::v-deep .van-cell__title {
//     color: #151b3e;
//   }

//   .van-stepper {
//     border: 1px solid #dbdbdb;
//     border-radius: 5px;

//     ::v-deep .van-stepper__input {
//       background: #fff;
//       width: 50px;
//     }
//   }
// }

// .submit-store-view-mian {
//   display: flex;
//   flex-direction: column;
//   padding-bottom: 50px;
// }

// .detail-title-content {
//   position: relative;

//   .detail-title-status {
//     position: absolute;
//     right: 10px;
//     top: 0;
//     display: flex;
//     align-items: center;
//     height: 100%;

//     img {
//       width: 16px;
//       height: 16px;
//     }

//     span {
//       margin-left: 3px;
//       color: #134daa;
//       font-size: 11px;
//     }
//   }

// }

// .box-container {
//   padding: 0;
// }

// .outbound-field-uploader {
//   ::v-deep li {
//     display: block;
//   }

//   ::v-deep .file-info {
//     width: auto !important;

//     img {
//       min-width: auto !important;
//     }
//   }
// }

// .detail-title-contentA {
//   width: 100%;
//   height: 34px;
//   display: flex;
//   align-items: center;
//   padding-left: 2px;
//   padding-right: 27px;
//   box-sizing: border-box;
//   border-top: 1px solid #f1f4f8;

//   img {
//     width: 25px;
//     height: 25px;
//   }

//   & span:nth-child(2) {
//     margin-left: 6px;
//     color: #151b3e;
//     font-size: 15px;
//     font-weight: 600;
//   }

//   & span:nth-child(3) {
//     color: #151b3e;
//     font-size: 15px;
//     font-weight: 600;
//   }
// }
</style>