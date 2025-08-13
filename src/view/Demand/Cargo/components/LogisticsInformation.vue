<template>
  <div class="Logistics-Information">
    <ul class="detail-ul">
      <li>
        <span>发货单号：</span>
        <span>{{ detailObj.shipmentBatchNumber }}</span>
      </li>
      <li>
        <span>物流单号：</span>
        <span>{{ detailObj.oddNumbers }}</span>
      </li>
      <li>
        <span>发货时间：</span>
        <span>{{ parseTime(detailObj.shippingDate, '{y}-{m}-{d}') }}</span>
      </li>
      <li>
        <span>发货地址：</span>
        <span>{{ detailObj.shippingAddress }}</span>
      </li>
      <li>
        <span class="li-span-width">预计到达时间：</span>
        <span>{{ parseTime(detailObj.arrivalDate, '{y}-{m}-{d}') }}</span>
      </li>
      <li>
        <span>车牌号：</span>
        <span>{{ detailObj.carNumber }}</span>
      </li>
      <li>
        <span>联系人：</span>
        <span>{{ detailObj.contacts }}</span>
      </li>
      <li>
        <span>联系电话：</span>
        <span>{{ detailObj.contactsPhone }}</span>
      </li>
    </ul>
    <template v-if="detailObj.oddNumbers">
      <div class="Logistics-Information-dt">
        <wuliu :courierNumber="detailObj.oddNumbers" @expressDataFun="expressDataFun" />
      </div>
      <div class="Logistics-Information-list">
        <ul>
          <li v-for="(item, index) in expressData.routeDtos" :key="index">
            <p>{{ item.context }}</p>
            <p>{{ item.time }}</p>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div class="tab-div">
        <van-row class="th-row">
          <van-col>操作人</van-col>
          <van-col>货运位置</van-col>
          <van-col>填写时间</van-col>
        </van-row>
        <van-row class="th-rows" v-for="item in detailObj.materialTrackMessageDTOS" :key="item.id">
          <van-col>{{ item.createUserName }}</van-col>
          <van-col>{{ item.positionInformation }}</van-col>
          <van-col>{{ parseTime(item.createDate, '{y}-{m}-{d} {h}:{i}') }}</van-col>
        </van-row>
      </div>
    </template>
  </div>
</template>
<script>
import wuliu from '@/components/wuliu'
export default {
  name: 'LogisticsInformation',
  components: { wuliu },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      appid: "bjhzcZ1hF8rR5gF5mK9qW",
      appSecret: "4c18253ddba74d30b1b74a692aab6606",
      formData: {
        mailNo:'',  //快递单号
        cpCode:'',  //快递公司编码
        cpName:'',  //快递公司名称
        phone:'',   //寄件人电话
      },
      expressCompanyOptions: [], //快递公司数据
      expressData: {}
    }
  },
	computed: {
		detailObj() {
			return this.detail
		},
	},
  created() {
  },
  activated() {
  },
  mounted () {
  },
  methods: {
    expressDataFun (expressData) {
      this.expressData = expressData
    }
  },
}
</script>
<style lang="less" scoped>
.Logistics-Information {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #fff;

  .detail-ul {
    padding: 4px;
    li {
      .li-span-width {
       min-width: 100px !important;
      }
    }
  }

  .Logistics-Information-dt {
    width: 100%;
    height: 164px;
  }

  ::v-deep .van-step__title {
    color: #272b31 !important;
    display: flex;
    justify-content: space-between;

    div:nth-child(1) {
      flex: 1;
    }

    .Logistics-Information-text {
      color: #999999 !important;
    }
  }

  .tab-div {
    border: 1px solid #e9e9e9;
    border-bottom: 0;
    border-right: 0;

    .th-row,
    .th-rows {
      display: flex;
      background: #f1f8ff;
      border-bottom: 1px solid #e9e9e9;
      text-align: center;

      .van-col {
        line-height: 40px;
        padding: 0 2px;
        border-right: 1px solid #e9e9e9;
        font-size: 12px;
        flex: 1;
      }
    }

    .th-rows {
      background: #fff;
    }
  }
  .Logistics-Information-list{
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
}
</style>