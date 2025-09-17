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
          <span>{{ sectionInfo.specModel }} {{ sectionInfo.unit }}</span>
        </li>
        <li>
          <span>需求数量：</span>
          <span>{{ sectionInfo.planAmount }} {{ sectionInfo.unit }}</span>
        </li>
        <li>
          <span>发货数量：</span>
          <span>{{ sectionInfo.sendTotal }} {{ sectionInfo.unit }}</span>
        </li>
        <li>
          <span>退货数量：</span>
          <span style="color: #e4393c;">{{ backNode=='1'?  sectionInfo.refundTotal:sectionInfo.refundZjTotal }} {{ sectionInfo.unit }}</span>
        </li>
        <li>
          <span>收货人及联系方式：</span>
          <span>{{ sectionInfo.receiver }}</span>
        </li>
        <li>
          <span>供应时间：</span>
          <span>{{ sectionInfo.supplyDate | formatDate }}</span>
        </li>
        <li>
          <span>生产日期：</span>
          <span>{{ sectionInfo.manufactureDate | formatDate }}</span>
        </li>
        <li>
          <span>有效期截止日期：</span>
          <span>{{ sectionInfo.expirationDate | formatDate }}</span>
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
      <div class="detail-base-info detail-base-info-edited">
      <div class="file-download-title">
        <span class="title">备注：</span>
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

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>退货附件</span>
      </div>
      <file-download-view class="outbound-field-uploader"
      :fileList="filterList(sectionInfo.fileByList, 'thfj_sh') || []" />
    </div>
  </div>
</template>
<script>
import FileDownloadView from "@/components/FileDownloadView.vue";
import indexMixin from '@/view/mixins'
import { materialDemandPlanDetailsDetail } from '@/api/prodmgr-inv/materialDemandPlanDetails'
import dayjs from "dayjs";
export default {
  name: 'ViewMaterials',
  components: {
    FileDownloadView,
  },
  mixins: [indexMixin],
  data() {
    return {
      sectionInfo: {},
    }
  },
  filters: {
    formatDate(val) {
      return val ? dayjs(val).format('YYYY年MM月DD日') : ''
    }
  },
  computed: {
    backNode() {
      return this.$route.query.backNode
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { data = [] } = this.$route.query
      this.sectionInfo = JSON.parse(data);
    },
    // materialDemandPlanDetailsDetail(id) {
    //   let toast = this.$toast.loading({
    //     duration: 0,
    //     message: "正在加载...",
    //     forbidClick: true
    //   });
    //   materialDemandPlanDetailsDetail(id).then(({ data }) => {
    //     this.sectionInfo = data
    //   }).finally((err) => {
    //     toast.clear()
    //   })
    // },
  }
}
</script>
<style lang="less" scoped>
.file-download-title {
    height: 40px;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 20px;

    .title {
        font-size: 13px;
        color: #1c1c1c;
        font-weight: 600;
    }
    .title::after {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 25%;
        background: #028bff;
        position: absolute;
        left: 10px;
        top: 18px;
    }
}

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