<template>

  <div class="requirement-details">


    <div class="detail-base-info">

      <div class="list-title-content">
        <p style="color: #656980; font-size: 14px;">
          <span>发货单号：</span>
          <span class="font-weight" >{{ params.shipmentBatchNumber }}</span>
        </p>
        <div class="li-title-status">
          <img :src="checkAuditStatus(params.status)"/>
          <span :style="handlerTextColor(statusArr, 'value', params.status)">{{ checkStatusText(params.status) }}</span>
        </div>
      </div>


      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span class="detail-label">发货时间：</span>
            <span class="detail-value">{{ formattedCreateDate(params.shippingDate) }}</span>
          </li>
          <li>
            <span class="detail-label">操作人：</span>
            <span class="detail-value">{{ params.createUserName }}</span>
          </li>
          <li>
            <span class="detail-label">操作时间：</span>
            <span class="detail-value">{{ formatTimestamp(params.createDate) }}</span>
          </li>
          <li>
            <span class="detail-label">需求项目：</span>
            <span class="detail-value">{{ params.sectionName }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-address.png">
        <span>货运位置</span>
      </div>
      <div>
<!--        <ul class="detail-ul">-->
<!--          <li>-->
<!--            <span>物流单号:</span>-->
<!--            <span>{{ !params.oddNumbers ? '其它' : params.oddNumbers }}</span>-->
<!--          </li>-->
<!--          <li>-->
<!--            <span>发货时间:</span>-->
<!--            <span v-if="params.shippingDate">{{-->
<!--                formattedCreateDate(params.shippingDate)-->
<!--              }}</span>-->
<!--          </li>-->

<!--          <li>-->
<!--            <span>发货地址:</span>-->
<!--            <span>{{ params.shippingAddress }}</span>-->
<!--          </li>-->
<!--          <li>-->
<!--            <span style="min-width: 3rem;">预计到达时间:</span>-->
<!--            <span v-if="params.arrivalDate">{{-->
<!--                formattedCreateDate(params.arrivalDate)-->
<!--              }}</span>-->
<!--          </li>-->

<!--          <li>-->
<!--            <span>车牌号:</span>-->
<!--            <span>{{ params.carNumber }}</span>-->
<!--          </li>-->

<!--          <li>-->
<!--            <span>联系人:</span>-->
<!--            <span>{{ params.contacts }}</span>-->
<!--          </li>-->
<!--          <li>-->
<!--            <span>联系电话:</span>-->
<!--            <span>{{ params.contactsPhone }}</span>-->
<!--          </li>-->


<!--        </ul>-->
        <logistics-information :detail="params"></logistics-information>
      </div>





    </div>

  </div>
</template>

<script>
import LogisticsInformation from "@/view/Demand/Cargo/components/LogisticsInformation.vue";

import {  detailWlgz } from '@/api/prodmgr-inv/materialCirculationTableRest'
export default {
  components: {LogisticsInformation},
  data() {
    return {
      params: {},
      expressData: {},
      statusArr: [
        {text: '全部', value: ''},
        {text: '未发货', value: '1', color: '#134daa'},
        {text: '货运中', value: '2', color: '#134daa'},
        {text: '已完成', value: '3', color: '#51CA40'}
      ],
    }
  },

  methods: {
    async detailWlgz (id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      })
      const res = await detailWlgz(id)
      this.params = res.data
      toast.clear()
    },
    expressDataFun (expressData) {
      this.expressData = expressData
    },
    formattedCreateDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    ,
    checkAuditStatus(status) {
      console.log(JSON.stringify(this.params));
      if ('2' == status) {
        return '/static/newIcon_freight.png'
      } else if ('3' == status) {
        return '/static/newIcon_done.png'
      } else {
        return '/static/newIcon_unshipped.png'
      }
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
    formatTimestamp(timestamp) {
      if (!timestamp) return ''; // 处理空值
      const date = new Date(timestamp); // 时间戳可以是毫秒或秒（需 * 1000）

      // 补零函数（确保个位数显示为两位，如 1 → '01'）
      const padZero = (num) => (num < 10 ? `0${num}` : num);

      const year = date.getFullYear();
      const month = padZero(date.getMonth() + 1); // 月份从 0 开始
      const day = padZero(date.getDate());
      const hours = padZero(date.getHours());
      const minutes = padZero(date.getMinutes());
      const seconds = padZero(date.getSeconds());

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  },
  created() {
    console.log("到了哦"+this.$route.query.id)
    // this.params =
    //     this.$route.query.params;
    this.detailWlgz(this.$route.query.id);
    // const res =  detailWlgz(this.$route.query.params.id)
    //  console.log("--------------------------");
    //  console.log(JSON.stringify(res.data));
  },
}

</script>


<style scoped lang="less">
.requirement-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

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

    .detail-list-ul {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 8px;
      border-radius: 5px;
      padding-left: 17px;
      padding-right: 12px;
      background: #f0f2f6;
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
    .button-info {
      width: 169px;

      img {
        vertical-align: middle;
      }
    }
  }
}

.detail-title-content {
  position: relative;

  .detail-title-status {
    position: absolute;
    right: 10px;
    top: 0;
    display: flex;
    align-items: center;
    height: 0.55rem;

    img {
      width: 16px;
      height: 16px;
    }

    span {

      color: #134daa;
      font-size: 11px;
    }
  }

}
.Logistics-Information-dt {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 100%;
  height: 164px;
}
.Logistics-Information-list{
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #fff;
  ul{
    li{
      margin-top: 8px;
      background: #f0f2f6;
      padding: 10px 12px 10px 17px;
      font-size: 12px;
      p:nth-child(2){
        margin-top: 10px;
        opacity: 0.5;
      }
    }
  }
}
</style>
