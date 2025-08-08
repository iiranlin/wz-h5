<template>
  <div class="edited-materials">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>{{ sectionInfo.materialName }}</span>
      </div>
      <ul class="detail-list-ul">
        <li>
          <span>规格型号：</span>
          <span>{{ sectionInfo.specModel }}</span>
        </li>
        <li>
          <span>供应商：</span>
          <span>{{ sectionInfo.sellerName }}</span>
        </li>
        <li>
          <span>计量单位：</span>
          <span>{{ sectionInfo.unit }}</span>
        </li>
        <li>
          <span>本次计划数量：</span>
          <span>{{ sectionInfo.planAmount }}</span>
        </li>
        <li>
          <span>本次需求未发货数量：</span>
          <span>{{ sectionInfo.ssendTotal }}</span>
        </li>
      </ul>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <van-field label="发货数量" placeholder="请输入发货数量" required clearable
            input-align="right">
            <template #input>
              <van-stepper v-model="sectionInfo.sendTotal" :min="0" :max="sectionInfo.ssendTotal" />
            </template>
          </van-field>
        </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-invest.png" />
        <span>基本信息</span>
      </div>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <van-field required v-model="sectionInfo.packagingFm" label="包装形式" placeholder="请输入包装形式"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field readonly clickable v-model="sectionInfo.manufactureDate" required name="datetimePicker"
                :value="sectionInfo.manufactureDate" label="生产日期" placeholder="点击选择日期"
                @click="showCalendars('show')" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field readonly clickable v-model="sectionInfo.expirationDate" name="datetimePicker"
                :value="sectionInfo.expirationDate" label="有效截止日期" placeholder="有效截止日期"
                @click="showCalendars('end')" input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.field0" label="投资方" placeholder="投资方"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.field1" label="投资比例" placeholder="投资比例"
            input-align="right" />
        </li>
        <li class="detail-list-li-input">
          <van-field v-model="sectionInfo.addr" label="使用地点" placeholder="使用地点"
            input-align="right" />
        </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <template v-if="sectionInfo.receiver">
        <div class="detail-title-content detail-title-edited-p">
          <p>
            <img src="@/assets/img/Icon-address.png" />
            <span>收货信息</span>
          </p>
          <p @click="receiptClick">
            <img src="@/assets/img/Icon-edit.png" />
            <span>更改</span>
          </p>
        </div>
        <div class="detail-ul-text">
          <ul class="detail-ul">
            <li>
              <span>{{ sectionInfo.receiver }} {{ sectionInfo.phone }}</span>
            </li>
            <li>
              <span>使用地点：</span>
              <span>{{ sectionInfo.addr }}</span>
            </li>
            <li>
              <span>收货地址：</span>
              <span>{{ sectionInfo.field2 }}</span>
            </li>
          </ul>
        </div>
        <div class="detail-base-info-edited-all" style="padding-top: 0;">
          <p @click="applicationAllClick({receiver: '', addr: '', field2: '', phone: ''})"><img src="@/assets/img/Icon-Copy2All.png" />应用到所有物资</p>
        </div>
      </template>
      <template v-else>
        <div class="detail-title-content">
          <img src="@/assets/img/Icon-address.png" />
          <span>收货信息</span>
        </div>
        <div class="detail-title-content-edited">
          <span>还未完善收货信息，请点击下方按钮</span>
        </div>
        <div class="detail-title-content-edited detail-title-content-edited-button">
          <van-button type="default" plain round @click="receiptClick">选择收货</van-button>
          <van-button plain round type="info" @click="createClick"><img src="@/assets/img/Icon-plus.png"
              class="detail-title-content-edited-add" />新建</van-button>
        </div>
      </template>
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-time.png" />
        <span>供应时间</span>
      </div>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <van-field required readonly is-link v-model="sectionInfo.supplyDate" label="选择时间" placeholder="请选择时间"
            @click="dateClick(sectionInfo)" input-align="right" />
          <van-popup v-model="sectionInfo.showDatePicker" position="bottom" round>
            <van-datetime-picker type="date" v-model="sectionInfo.minDate" @confirm="onDateConfirm(sectionInfo)"
              @cancel="hideDatePicker(sectionInfo)" />
          </van-popup>
        </li>
      </ul>
      <div class="detail-base-info-edited-all">
        <p @click="applicationAllClick({supplyDate: ''})"><img src="@/assets/img/Icon-Copy2All.png" />应用到所有物资</p>
      </div>
    </div>
    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>合格证附件</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.fileList01?.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持PDF格式</p>
      <file-upload-view :fileList="sectionInfo.fileList01 || []" businessType="01" class="outbound-field-uploader" />
    </div>
    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>厂检报告附件</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo?.fileList02?.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持PDF格式</p>
      <file-upload-view :fileList="sectionInfo.fileList02 || []" businessType="01" class="outbound-field-uploader" />
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>备注</span>
      </div>
      <div class="detail-title-content-field">
        <van-field class="detail-base-info-edited-textarea" v-model="sectionInfo.remark" rows="3" autosize
          type="textarea" placeholder="请输入备注信息" />
      </div>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round @click="sureClick(false)">返回</van-button>
      <van-button class="button-info" round type="info" @click="sureClick(true)">确定</van-button>
    </div>
    <!-- 生产日期 -->
    <van-calendar v-model="showCreateDates" @confirm="createConfirm" :min-date='minDate' :max-date="maxDate"/>
    <van-calendar v-model="showCalendar" @confirm="createConfirm" />
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import { parseTime } from '@/utils/index'
import FileUploadView from "@/components/FileUploadView.vue";
export default {
  name: 'EditedMaterials',
  mixins: [keepPages],
  components: {FileUploadView},
  data() {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // 设置为今天的最后一
    return {
      sectionInfo: {},
      queryType: '',
      contractId: '',
      queryId: '',
      planId: '',
      title: '',
      showCreateDates: false,
      showCalendar: false,
      minDate: new Date(2010, 0, 1),
      maxDate: today,
    }
  },
  activated() {
    const historyData = this.$store.state.public.historyData || {}
    if (JSON.stringify(historyData) === '{}') {
      this.init()
      return
    }
    this.sectionInfo = Object.assign({}, this.sectionInfo, historyData)
    this.$store.dispatch('public/setHistoryData', {})
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { type = '', contractId = '', id = '', planId = '' } = this.$route.query
      this.contractId = contractId
      this.queryType = type
      this.queryId = id
      this.planId = planId


      const data = Object.assign({}, this.$store.state.public.materiaData || {})
      
      data.fileList01 = data.fileList01?.length > 0 ? data.fileList01 : [];
      data.fileList02 = data.fileList02?.length > 0 ? data.fileList02 : [];
      this.sectionInfo = data;
    },
    dateClick(item) {
      this.sectionInfo = Object.assign({}, item, { showDatePicker: true })
    },
    onDateConfirm(item) {
      this.sectionInfo = Object.assign({}, item, { supplyDate: parseTime(item.minDate, '{y}-{m}-{d}'), showDatePicker: false })
    },
    hideDatePicker(item) {
      this.sectionInfo = Object.assign({}, item, { showDatePicker: false })
    },
    receiptClick() {
      this.$router.push({ name: 'ReceiptListgoods', query: { contractId: this.contractId, type: this.queryType, id: this.queryId } })
    },
    createClick() {
      this.$router.push({ name: 'ReceiptOperategoods', query: { type: 'create' } })
    },
    showCalendars(title) {
      this.title = title
      //生产日期
      if (title == 'show') {
        // this.goodsData[index]
        this.showCreateDates = true;
      }
      if (title == 'end') {
        this.showCalendar = true;
      }
      if (title == 'gong') {
        this.showCalendar = true;
      }

    },
    createConfirm(time) {
      const date = new Date(time);
      let dateString = date.toLocaleDateString().replace(/\//g, "-");

      // 分割字符串并补零
      const parts = dateString.split('-');
      const year = parts[0];
      let month = parts[1];
      let day = parts[2];

      month = month.length === 1 ? `0${month}` : month;
      day = day.length === 1 ? `0${day}` : day;
      if (this.title == 'show') {
        this.sectionInfo.manufactureDate = `${year}-${month}-${day}`
        this.showCreateDates = false;
      }
      if (this.title == 'gong') {
        this.sectionInfo.supplyDate = `${year}-${month}-${day}`
        this.showCalendar = false;
      }
      if (this.title == 'end') {
        this.sectionInfo.expirationDate = `${year}-${month}-${day}`
        this.showCalendar = false;
      }
    },
    sureClick(isData) {
      if (isData) {
        if (!this.sectionInfo.sendTotal) {
          this.$notify({
            type: 'warning',
            message: '请输入发货数量!',
          });
          return
        }
        if (!this.sectionInfo.packagingFm) {
          this.$notify({
            type: 'warning',
            message: '请输入包装形式!',
          });
          return
        }
        if (!this.sectionInfo.manufactureDate) {
          this.$notify({
            type: 'warning',
            message: '请选择生产日期!',
          });
          return
        }
        if (!(this.sectionInfo.receiver && this.sectionInfo.addr && this.sectionInfo.field2)) {
          this.$notify({
            type: 'warning',
            message: '请完善收货信息!',
          });
          return
        }
        if (!this.sectionInfo.supplyDate) {
          this.$notify({
            type: 'warning',
            message: '请选择供应时间!',
          });
          return
        }
        if (!this.sectionInfo.fileList01?.length > 0) {
          this.$notify({
            type: 'warning',
            message: '请选择合格证附件!',
          });
          return
        }
        if (!this.sectionInfo.fileList02?.length > 0) {
          this.$notify({
            type: 'warning',
            message: '请选择厂检报告附件!',
          });
          return
        }
        const data = this.$store.state.public.selectGoodData || []
        data.forEach((item, index) => {
          if (item.id == this.sectionInfo.id) {
            this.$set(data, index, this.sectionInfo)
          }
        });
        this.$store.dispatch('public/setSelectGoodData', data)
      }
      this.$router.push({ name: 'SendGoods', query: { text: this.queryType, id: this.queryId, planId: this.planId } })
    },
    applicationAllClick (obj) {
      this.$dialog.confirm({
        title: '提示',
        message: '确认要应用到所有物资吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        const data = this.$store.state.public.selectGoodData || []
        data.forEach((item, index) => {
          for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
              item[key] = this.sectionInfo[key]
            }
          }
        });
        this.$store.dispatch('public/setSelectGoodData', data)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.edited-materials {
  padding-bottom: 60px;

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

  .detail-list-ul-edited {
    margin: 0 7px;

    .detail-list-li-input {
      border-top: 1px solid #e3e3e3;

      & :nth-child(2) {
        text-align: center;
      }

      ::v-deep .van-cell__title {
        color: #151b3e;
      }

      .van-cell {
        padding-left: 23px;
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
  }

  .detail-base-info-edited {
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    margin-bottom: 8px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 5px;
    display: flex;
    flex-direction: column;

    .detail-title-content {
      padding-left: 0;
      padding-right: 0;

      img {
        width: 26px;
        height: 26px;
      }

      span {
        line-height: 26px;
        margin-left: 0;
      }
    }

    .detail-title-content-edited {
      margin: 21px;
      text-align: center;
      font-size: 12px;

      .van-button {
        width: 110px;
        height: 28px;
        margin-right: 6px;
        font-size: 12px;
      }

      .detail-title-content-edited-add {
        width: 16px;
        height: 16px;
        vertical-align: sub;
      }
    }

    .detail-title-content-edited-button {
      margin-top: 10px;
      margin-bottom: 12px;
    }

    .detail-list-ul-edited {
      border-bottom: 1px solid #e3e3e3;
    }

    .detail-base-info-edited-all {
      text-align: right;
      font-size: 12px;
      padding-top: 10px;
      padding-right: 16px;

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
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

    .detail-ul-text {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 10px;
      background: #f2f2f2;
      border-radius: 5px;

      .detail-ul {
        padding: 10px 12px;

        li {
          span {
            text-align: left;
          }
        }
      }
    }

    .detail-title-edited-p {
      justify-content: space-between;

      p {
        img {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }

        &:nth-child(2) {
          padding-right: 10px;

          span {
            font-weight: 400;
            font-size: 12px;
          }
        }
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

/deep/.van-calendar__popup.van-popup--bottom, .van-calendar__popup.van-popup--top{
    height: 92% !important;
}
</style>