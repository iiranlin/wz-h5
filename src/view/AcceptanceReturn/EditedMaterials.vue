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
          <span>需求数量：</span>
          <span>{{ sectionInfo.planAmount }}</span>
        </li>
        <li>
          <span>包装方式：</span>
          <span>{{ sectionInfo.packagingFm }}</span>
        </li>
        <!-- <li>
          <span>本次需求未发货数量：</span>
          <span>{{ sectionInfo.ssendTotal }}</span>
        </li> -->
        <li style="margin: 10px 0; padding: 10px 0 0; border-top: 1px solid #ebedf0;">
          <span>本次发货数量：</span>
          <span>{{ sectionInfo.sendTotal }}</span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="!isView">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-time.png" />
        <span>收货操作</span>
      </div>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <van-field label="实收数量" placeholder="请输入数量" required clearable input-align="right">
            <template #input>
              <van-stepper v-model="sectionInfo.putTotal" min='0'  :max="sectionInfo.sendTotal" @input="handleInput(sectionInfo)" />
            </template>
          </van-field>

          <van-field label="退货数量" placeholder="请输入数量" required clearable input-align="right">
            <template #input>
              <van-stepper v-model="sectionInfo.refundTotal"  min='0'  :max="sectionInfo.sendTotal" @input="handleInput1(sectionInfo)"/>
            </template>
          </van-field>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-else>
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-time.png" />
        <span>收货信息</span>
      </div>
      <ul class="detail-list-ul">
        <li>
          <span>实收数量：</span>
          <span class="li-span-click">{{ sectionInfo.putTotal }}</span>
        </li>
        <li>
          <span>退货数量：</span>
          <span style="color: #e4393c;">{{ sectionInfo.refundTotal }}</span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;" v-if="!isView && +sectionInfo.refundTotal > 0">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>退货附件</span>
      </div>
      <p class="box-container-p" v-if="!sectionInfo.values?.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持PDF格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="sectionInfo.values || []" businessType="01" class="outbound-field-uploader" />
    </div>

    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;" v-if="isView && filterList(sectionInfo.fileByList, 'thfj_sh')?.length > 0">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>退货附件</span>
      </div>
      <file-download-view class="outbound-field-uploader"
            :fileList="filterList(sectionInfo.fileByList, 'thfj_sh') || []" />
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
          <span>{{ sectionInfo.supplyDate | formatToDate}}</span>
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
    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>合格证附件</span>
      </div>
      <file-download-view class="outbound-field-uploader" :fileList="filterList(sectionInfo.fileByList, 'hgz') || []"/>
    </div>
    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>厂检报告附件</span>
      </div>
      <file-download-view class="outbound-field-uploader" :fileList="filterList(sectionInfo.fileByList, 'cjbg') || []"/>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="!isView">
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

    <div class="default-button-container" v-if="!isView">
      <van-button class="button-info" round @click="sureClick(false)">返回</van-button>
      <van-button class="button-info" round type="info" @click="sureClick(true)">确定</van-button>
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
  mixins: [keepPages,indexMixin],
  components: {FileUploadView,FileDownloadView},
  filters: {
    formatDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }else{
        return ""
      }  
    },
    formatToDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      }else{
        return ""
      }  
    }
  },
  data() {
    return {
      sectionInfo: {},
      isView: false,
      id: '',
      tabs: true,
      isLable: false,
      takeStatus: '',
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
    handleInput(item){
      if (item.putTotal == undefined || item.sendTotal == undefined) {
        return
      }

      const num = Number(item.putTotal);

      if (!isNaN(num) && num <= item.sendTotal) {
        this.sectionInfo.putTotal = num; 
        this.sectionInfo.refundTotal =(this.sectionInfo.sendTotal - this.sectionInfo.putTotal).toFixed(2)
      } else {
        this.$toast('实收数量不能大于发货数量'); 
        this.sectionInfo.putTotal = 0; 
      }
    },
    handleInput1(item){
      if (item.refundTotal == undefined || item.sendTotal == undefined) {
        return
      }

      const num = Number(item.refundTotal);
      if (!isNaN(num) && num <= item.sendTotal) {
        this.sectionInfo.refundTotal = num; 
        this.sectionInfo.putTotal = (this.sectionInfo.sendTotal - this.sectionInfo.refundTotal).toFixed(2)
      } else {
        this.$toast('退货数量不能大于发货数量'); 
        this.sectionInfo.refundTotal=0 
      }
    },
    init() {
      const { id = '', tabs = true, isLable = false, isView = false, takeStatus = ''} = this.$route.query

      this.id = id
      this.tabs = tabs == (true || 'true')
      this.isLable = isLable == (true || 'true')
      this.isView = JSON.parse(isView)
      this.takeStatus = takeStatus


      const data = Object.assign({}, this.$store.state.public.materiaData || {})
      
      this.sectionInfo = data;
    },
    boolExceptZero(val) {
      return val === 0 || Boolean(val);
    },
    sureClick(isData) {
      if (isData) {
        if (!this.boolExceptZero(this.sectionInfo.putTotal)) {
          this.$notify({
            type: 'warning',
            message: '请输入实收数量!',
          });
          return
        }
        if (!this.boolExceptZero(this.sectionInfo.refundTotal)) {
          this.$notify({
            type: 'warning',
            message: '请输入退货数量!',
          });
          return
        }

        if (+this.sectionInfo.refundTotal > 0 && this.sectionInfo.values.length == 0) {
          this.$notify({
            type: 'warning',
            message: '有退货数量，请上传退货附件!'
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
      this.$router.push({ name: 'DoAccept', query: { id: this.id, tabs: this.tabs, isLable: this.isLable, takeStatus: this.takeStatus } })
    },
  }
}
</script>
<style lang="less" scoped>
.edited-materials {
  padding-bottom: 60px;

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
        & span:nth-child(2){
            margin-left: 6px;
            color: #151b3e;
            font-size: 15px;
            font-weight: 600;
            line-height: 20px;
        }
        & span:nth-child(3){
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
    .button-info {
      width: 169px;
      height: 34px;
    }
  }
}

/deep/.van-calendar__popup.van-popup--bottom, .van-calendar__popup.van-popup--top{
    height: 94% !important;
}
</style>