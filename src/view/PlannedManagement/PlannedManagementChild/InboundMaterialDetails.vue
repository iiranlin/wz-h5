<template>
  <div class="view-materials">
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
          <span>包装方式：</span>
          <span>{{ sectionInfo.packagingFm }}</span>
        </li>
        <li>
          <span>生产日期：</span>
          <span>{{ sectionInfo.manufactureDate  && parseTime(sectionInfo.manufactureDate, '{y}-{m}-{d}') }}</span>
        </li>
        
        <li>
          <span>有效截止日期：</span>
          <span>{{ sectionInfo.expirationDate  && parseTime(sectionInfo.expirationDate, '{y}-{m}-{d}') }}</span>
        </li>

        <li>
          <span>需求数量：</span>
          <span class="li-span-click">{{ sectionInfo.planAmount }} {{ sectionInfo.unit }}</span>
        </li>

        <li>
            <span>本次实收数量：</span>
            <span class="li-span-click">{{sectionInfo.storeTotal}} {{ sectionInfo.unit }}</span>
          </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content detail-title-edited-p">
        <p>
          <img src="@/assets/img/Icon-time.png" />
          <span>收货信息</span>
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
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-address.png" />
        <span>其他信息</span>
      </div>
      <ul class="detail-ul detail-ul-border">
        <li>
          <span>供应时间：</span>
          <span>{{ sectionInfo.supplyDate  && parseTime(sectionInfo.supplyDate, '{y}-{m}-{d}') }}</span>
        </li>
        <li>
          <span>投资方：</span>
          <span>{{ sectionInfo.field0 }}</span>
        </li>
        <li>
          <span>投资比例：</span>
          <span class="li-span-click">{{ sectionInfo.field1 }}</span>
        </li>
      </ul>
    </div>
     <div class="detail-base-info detail-base-info-edited" v-if="fileList1.length">
          <div class="detail-title-content">
            <img src="/static/icon-file.png" />
            <span>合格证附件</span>
          </div>
          <file-download-view :fileList="fileList1 || []"></file-download-view>
        </div>
         <div class="detail-base-info detail-base-info-edited" v-if="fileList2.length">
          <div class="detail-title-content">
            <img src="/static/icon-file.png" />
            <span>厂检报告附件</span>
          </div>
          <file-download-view :fileList="fileList2 || []"></file-download-view>
        </div>
        <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>备注</span>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>{{ sectionInfo.remark || '未填写' }}</span>
          </li>
        </ul>
      </div>
    </div>
   
  </div>
</template>
<script>
import { materialDemandPlanDetailsDetail } from '@/api/prodmgr-inv/materialDemandPlanDetails'
import FileDownloadView from "@/components/FileDownloadView.vue";
export default {
  // 入库-物资详情
  name: 'InboundMaterialDetails',
  components: { FileDownloadView },
  data() {
    return {
      sectionInfo: {},
      fileList1: [],
      fileList2: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { id = '' } = this.$route.query
      this.sectionInfo = this.$route.params
      let fileByList = JSON.parse(this.sectionInfo.fileByList)
      this.fileList1 = fileByList.hgz
      this.fileList2 = fileByList.cjbg
      // this.materialDemandPlanDetailsDetail(id)
    },
    materialDemandPlanDetailsDetail(id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialDemandPlanDetailsDetail(id).then(({ data }) => {
        this.sectionInfo = data
      }).finally((err) => {
        toast.clear()
      })
    },
  }
}
</script>
<style lang="less" scoped>
.view-materials {
  .detail-ul-border {
    padding: 10px 17px;
    border-top: 1px solid #e3e3e3;
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
}
</style>