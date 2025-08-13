<template>
  <div class="requirement-details">
        <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ detailInfo.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>需求组织：</span>
            <span>{{detailInfo.deptName}}</span>
          </li>
          <li>
            <span>领用单位：</span>
            <span>{{detailInfo.receiveDeptName}}</span>
          </li>
          <li>
            <span>发料人：</span>
            <span>{{detailInfo.issueUserName}}</span>
          </li>
          <li>
            <span>领料人：</span>
            <span class="li-span-click">{{detailInfo.pickUserName}}</span>
          </li>
          <li>
            <span>使用地点：</span>
            <span>{{detailInfo.useLocation}}</span>
          </li>
          <li>
            <span>领料日期：</span>
            <span>{{parseTime(detailInfo.pickDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li>
            <span>出库单号：</span>
            <span>{{detailInfo.outNumber}}</span>
          </li>
          <li>
              <span>操作人：</span>
              <span>{{detailInfo.createUserName}}</span>
            </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="fileList?.length > 0">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>领料单</span>
      </div>
      <file-download-view :fileList="fileList"/>
    </div>

    <div class="detail-base-info detail-base-info-edited" style="margin-bottom: 8px; background-color: #F2F4F8;">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-batch.png" />
        <span>物资明细</span>
        <span style="text-align: right;">共 <span style="color: #134DAA;">{{ detailList.length }}</span> 项</span>
      </div>
    </div>

    <div class="box-container" v-for="(item,index) in detailList" :key="index">
      <div class="div-child">
        <ul class="detail-list-ul">
          <li class="detail-list-ul-text">
            <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
          </li>
          <li>
            <span>供应商：</span>
            <span>{{item.sellerName}}</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{item.specModel}}</span>
          </li>
          <li>
            <span>计量单位：</span>
            <span>{{item.unit}}</span>
          </li>
          <li>
            <span>生产日期：</span>
            <span>{{item.manufactureDate && parseTime(item.manufactureDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li class="li-item-overlength">
            <span>有效截止日期：</span>
            <span>{{item.expirationDate && parseTime(item.expirationDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次出库数量：</span>
            <span class="li-span-click">{{item.outTotal}}</span>
          </li>
          <li class="li-item-remark" v-if="item.remark">
            <span>备注：</span>
            <div class="remark-detail">{{item.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 附件预览 -->
    <file-preview ref="filePreview"/>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import {materialSupplierOutRestDetail} from '@/api/prodmgr-inv/materialDemandPlanRest'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import BackToTop from '@/components/BackToTop'

export default {
  name: 'OutboundDetails',
  components: {FilePreview,FileDownloadView,BackToTop},

  data() {
    return {
      id: '',
      detailInfo:{},
      detailList:[],
      fileList:[],
    }
  },
  created() {
    this.id = this.$route.query.id

    this.getDetail();
  },
  activated() {

  },
  methods: {
    //获取详情信息
    getDetail(){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialSupplierOutRestDetail(this.id).then(({ data }) => {
        this.detailInfo = data;
        this.detailList = data.materialSupplierOutDetailDTOS;
        this.fileList = JSON.parse(data.fileByList).lld;

        // this.fileList = [...this.fileList,...this.fileList]
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    imgClick() {
      this.$refs.filePreview.init(this.fileList[0].fileName, this.fileList[0].filePath)
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
// .default-containerA {
//   padding-bottom: 20px;
// }
// .box-container {
//   padding: 0px;
// }
</style>