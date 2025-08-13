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
          <span>需求数量：</span>
          <span>{{ sectionInfo.planAmount }}</span>
        </li>
        <li>
          <span>生产日期：</span>
          <span>{{ sectionInfo.manufactureDate ? parseTime(sectionInfo.manufactureDate, '{y}-{m}-{d}') : '' }}</span>
        </li>
        <li>
          <span>有效截止日期：</span>
          <span>{{ sectionInfo.expirationDate ? parseTime(sectionInfo.expirationDate, '{y}-{m}-{d}') : '' }}</span>
        </li>
        <li>
          <span>包装方式：</span>
          <span>{{ sectionInfo.packagingFm }}</span>
        </li>
        <li style="margin: 10px 0; padding: 10px 0 0; border-top: 1px solid #ebedf0;">
          <span>本次实收数量：</span>
          <span>{{ sectionInfo.putTotal }}</span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="queryType == 'submit'">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-time.png" />
        <span>收货操作</span>
      </div>
      <!-- <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input"> -->
      <van-radio-group v-model="sectionInfo.defaultRadio" direction="horizontal" style="justify-content: end;">
        <van-radio name="1" shape="square" class="detail-radio"><img src="@/assets/img/Icon_Receiving.png" />全部收货</van-radio>
        <van-radio name="2" shape="square" class="detail-radio"><img src="@/assets/img/Icon-modify-after.png" />全部退货</van-radio>
      </van-radio-group>
      <!-- <van-field label="入库数量" placeholder="请输入数量" required clearable input-align="right">
            <template #input>
              <van-stepper v-model="sectionInfo.storeTotal" min='0' @change="putChange(sectionInfo)" />
            </template>
</van-field>

<van-field label="退货数量" placeholder="请输入数量" required clearable input-align="right">
  <template #input>
              <van-stepper v-model="sectionInfo.refundZjTotal"  min='0' @change="changeRefund(sectionInfo)"/>
            </template>
</van-field> -->
      <!-- </li>
      </ul> -->
    </div>

    <div class="detail-base-info detail-base-info-edited" v-else>
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-time.png" />
        <span>收货信息</span>
      </div>
      <ul class="detail-list-ul">
        <li>
          <span>入库数量：</span>
          <span class="li-span-click">{{ sectionInfo.storeTotal }}</span>
        </li>
        <li>
          <span>退货数量：</span>
          <span style="color: #e4393c;">{{ sectionInfo.refundZjTotal }}</span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="queryType == 'submit'">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>备注</span>
      </div>
      <div class="detail-title-content-field">
        <van-field class="detail-base-info-edited-textarea" v-model="sectionInfo.remark" rows="3" autosize
          type="textarea" placeholder="请输入备注信息" />
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-else>
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>备注</span>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <!-- <span>使用地点：</span> -->
            <span class="remark-detail">{{ sectionInfo.remark || '未填写' }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;" v-if="queryType == 'submit' && sectionInfo.defaultRadio == '2'">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>退货附件</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo.fileList03?.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持PDF格式</p>
      <file-upload-view :fileList="sectionInfo.fileList03 || []" businessType="01" class="outbound-field-uploader" />
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;"
      v-if="queryType != 'submit' && sectionInfo.fileList03?.length > 0">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>退货附件</span>
      </div>
      <file-download-view class="outbound-field-uploader"
        :fileList="sectionInfo.fileList03 || []" />
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <template v-if="sectionInfo.receiver">
        <div class="detail-title-content detail-title-edited-p">
          <p>
            <img src="@/assets/img/Icon-address.png" />
            <span>其他信息</span>
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

        <ul class="detail-info-ul">
          <li>
            <span>供应时间：</span>
            <span>{{ sectionInfo.supplyDate | formatToDate }}</span>
          </li>
          <li>
            <span>投资方：</span>
            <span>{{ sectionInfo.field0 }}</span>
          </li>
          <li>
            <span>投资比例：</span>
            <span>{{ sectionInfo.field1 }}</span>
          </li>
        </ul>
      </template>
    </div>
    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>合格证附件</span>
      </div>
      <file-download-view class="outbound-field-uploader" :fileList="sectionInfo.fileList01 || []" />
    </div>
    <div class="detail-base-info detail-base-info-edited" style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>厂检报告附件</span>
      </div>
      <file-download-view class="outbound-field-uploader"
        :fileList="sectionInfo.fileList02 || []" />
    </div>

    <div class="default-button-container" v-if="queryType == 'submit' && sectionInfo.defaultRadio">

      <div class="default-button-container-selected" v-if="sectionInfo.defaultRadio == '1'">
        <span>确认收货： <span class="li-span-click" style="font-size: 30px;line-height: 30px;">{{ sectionInfo.storeTotal }}</span> 套
        </span>
      </div>

      <div class="default-button-container-selected" v-if="sectionInfo.defaultRadio == '2'">
        <span>确认退货： <span class="li-span-orange" style="font-size: 30px;line-height: 30px;">{{ sectionInfo.refundZjTotal }}</span> 套
        </span>
      </div>

      <van-button class="button-info" round type="info" @click="sureClick(true)">确认</van-button>
    </div>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import indexMixin from '@/view/mixins'
import FileUploadView from "@/components/FileUploadView.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
export default {
  name: 'EditedMaterials',
  mixins: [keepPages, indexMixin],
  components: { FileUploadView, FileDownloadView },
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
  watch: {
    'sectionInfo.defaultRadio': {
      handler(val) {
        if (val === '1') {
          this.sectionInfo.storeTotal = this.sectionInfo.putTotal
          this.sectionInfo.refundZjTotal = 0
          this.sectionInfo.fileList03 = []
        } else if (val === '2') {
          this.sectionInfo.refundZjTotal = this.sectionInfo.putTotal
          this.sectionInfo.storeTotal = 0
        }
      }
    }
  },
  data() {
    return {
      sectionInfo: {},
      queryType: false,
      id: '',
      supplyId: '',
      storeStatus: '',
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
    putChange(item) {
      this.$nextTick(() => {
        if (Number(item.storeTotal) > 0) {
          this.sectionInfo.storeTotal = item.putTotal
          this.sectionInfo.refundZjTotal = 0
        } else {
          this.sectionInfo.refundZjTotal = item.putTotal
        }
      })
    },
    changeRefund(item) {
      //退货不能超过收货，最终算出入库
      this.$nextTick(() => {
        if (Number(item.refundZjTotal) > 0) {
          this.sectionInfo.refundZjTotal = item.putTotal
          this.sectionInfo.storeTotal = 0
        } else {
          this.sectionInfo.storeTotal = item.putTotal
        }
      })
    },
    init() {
      const { id = '', supplyId = '', queryType = false, storeStatus = '' } = this.$route.query

      this.id = id
      this.supplyId = supplyId
      this.queryType = queryType
      this.storeStatus = storeStatus


      const data = Object.assign({}, this.$store.state.public.materiaData || {})

      this.sectionInfo = data;
    },
    boolExceptZero(val) {
      return val === 0 || Boolean(val);
    },
    sureClick(isData) {
      if (isData) {
        if (!this.sectionInfo.defaultRadio) {
          this.$notify({
            type: 'warning',
            message: '请选择收货操作!',
          });
          return
        }

        if (+this.sectionInfo.refundZjTotal > 0 && this.sectionInfo.fileList03.length == 0) {
          this.$notify({
            type: 'warning',
            message: '有退货数量，请上传退货附件!'
          });
          return
        }

        const data = this.$store.state.public.selectStoreData || []
        data.forEach((item, index) => {
          if (item.id == this.sectionInfo.id) {
            this.$set(data, index, this.sectionInfo)
          }
        });
        this.$store.dispatch('public/setSelectStoreData', data)
      }
      this.$router.push({ name: 'SubmitStore', query: { id: this.id, type: this.queryType, supplyId: this.supplyId, storeStatus: this.storeStatus } })
    },
  }
}
</script>
<style lang="less" scoped>
.edited-materials {
  padding-bottom: 60px;

  .detail-radio {
    width: 100px;
    height: 40px;
    border: 1px solid #e5e5e5;
    padding: 0 30px;
    border-radius: 5px;
    margin-right: 16px;
    font-size: 14px;
    position: relative;

    img {
       width: 23px;
       height: 23px;
       vertical-align: top;
    }
  }

  .detail-radio[aria-checked="true"] {
      border: 1px solid #028bff;
    }
    .detail-radio[aria-checked="true"]::before {
      content: '';
      width: 0px;
      height: 0px;
      border-top: 25px solid transparent;
      border-left: 25px solid transparent ;
      border-bottom: 25px solid #028bff;
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
      line-height: 15px;
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

    .detail-ul-text2 {
      width: 100%;
      padding-top: 5px;
      background: #ffffff;
      padding: 10px 5px;

      .detail-title-content {
        width: 100%;
        // height: 34px;
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        // align-items: center;
        // padding-left: 9px;
        // padding-right: 27px;
        box-sizing: border-box;

        img {
          width: 18px;
          height: 18px;
        }

        & span:nth-child(2) {
          margin-left: 6px;
          color: #151b3e;
          font-size: 15px;
          font-weight: 600;
          line-height: 20px;
        }

        & span:nth-child(3) {
          color: #151b3e;
          font-size: 15px;
          font-weight: 600;
          flex: 1;
          word-break: break-all;
          line-height: 20px;
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
        .default-button-container-selected {
      font-size: 15px;

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }

      .default-button-container-selected-img {
        transform: rotate(180deg)
      }
    }

    .button-info {
      width: 169px;
      height: 34px;
    }
  }
}

/deep/.van-calendar__popup.van-popup--bottom,
.van-calendar__popup.van-popup--top {
  height: 92% !important;
}
</style>