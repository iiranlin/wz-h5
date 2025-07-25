<template>
  <div class="view-materials">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>{{ sectionInfo.materialName }}</span>
      </div>
      <ul class="detail-list-ul">
        <li>
          <span>供应商：</span>
          <span>{{ sectionInfo.sellerName }}</span>
        </li>
        <li>
          <span>规格型号：</span>
          <span>{{ sectionInfo.specModel }}</span>
        </li>
        <li>
          <span>计量单位：</span>
          <span>{{ sectionInfo.unit }}</span>
        </li>
        <li>
          <span>合同数量：</span>
          <span class="li-span-click">{{ sectionInfo.amount }}</span>
        </li>
        <li>
          <span>累计计划量（含本次）：</span>
          <span class="li-span-click">{{ sectionInfo.cumulativeAmount }}</span>
        </li>
        <li>
          <span>本次计划数量：</span>
          <span class="li-span-click">{{ sectionInfo.planAmount }}</span>
        </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content detail-title-edited-p">
        <p>
          <img src="@/assets/img/Icon-address.png" />
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
        <img src="@/assets/img/Icon-time.png" />
        <span>供应时间</span>
      </div>
      <ul class="detail-ul detail-ul-border">
        <li>
          <span>供应日期：</span>
          <span>{{ sectionInfo.supplyDate }}</span>
        </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-invest.png" />
        <span>投资信息</span>
      </div>
      <ul class="detail-ul detail-ul-border">
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
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-notes.png" />
        <span>备注</span>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>{{ sectionInfo.receiver }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { materialDemandPlanDetailsDetail } from '@/api/prodmgr-inv/materialDemandPlanDetails'
export default {
  name: 'ViewMaterials',
  data() {
    return {
      sectionInfo: {},
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { id = '' } = this.$route.query
      this.materialDemandPlanDetailsDetail(id)
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