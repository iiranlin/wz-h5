<template>
  <div class="Logistics-Information">
    <ul class="detail-ul">
      <li>
        <span>发货单号：</span>
        <span>{{ detail.shipmentBatchNumber }}</span>
      </li>
      <li>
        <span>物流单号：</span>
        <span>{{ detail.oddNumbers }}</span>
      </li>
      <li>
        <span>发货时间：</span>
        <span>{{ parseTime(detail.shippingDate, '{y}-{m}-{d}') }}</span>
      </li>
      <li>
        <span>发货地址：</span>
        <span>{{ detail.shippingAddress }}</span>
      </li>
      <li>
        <span class="li-span-width">预计到达时间为：</span>
        <span>{{ parseTime(detail.arrivalDate, '{y}-{m}-{d}') }}</span>
      </li>
      <li>
        <span>车牌号为：</span>
        <span>{{ detail.carNumber }}</span>
      </li>
      <li>
        <span>联系人：</span>
        <span>{{ detail.contacts }}</span>
      </li>
      <li>
        <span>联系电话：</span>
        <span>{{ detail.contactsPhone }}</span>
      </li>
    </ul>
    <template v-if="activeKey == 0">
      <div class="Logistics-Information-dt">
        <img :src="dt" />
      </div>
      <van-steps direction="vertical" active-color="#0086ff" :active="0">
        <van-step>
          <div>
            <p>派送中</p>
            <p class="Logistics-Information-text">货物派送中</p>
          </div>
          <div class="Logistics-Information-text">2016-07-12 12:40</div>
        </van-step>
        <van-step>
          <div>
            <p>运输中</p>
            <p class="Logistics-Information-text">货物运输中</p>
          </div>
          <div class="Logistics-Information-text">2016-07-12 12:40</div>
          <div></div>
        </van-step>
        <van-step>
          <div>
            <p>发货中</p>
            <p class="Logistics-Information-text">货物正在发货</p>
          </div>
          <div class="Logistics-Information-text">2016-07-12 12:40</div>
          <div></div>
        </van-step>
        <van-step>
          <div>
            <p>确认下单</p>
            <p class="Logistics-Information-text">订单确认中</p>
          </div>
          <div class="Logistics-Information-text">2016-07-12 12:40</div>
        </van-step>
      </van-steps>
    </template>
    <template v-else>
      <div class="tab-div">
        <van-row class="th-row">
          <van-col>操作人</van-col>
          <van-col>货运位置</van-col>
          <van-col>填写时间</van-col>
        </van-row>
        <van-row class="th-rows" v-for="item in 6" :key="item">
          <van-col>张三</van-col>
          <van-col>中铁三局宁</van-col>
          <van-col>2025-05-06 09:30</van-col>
        </van-row>
      </div>
    </template>
  </div>
</template>
<script>
import dt from '@/assets/img/dt.png';
export default {
  name: 'LogisticsInformation',
  components: {},
  props: {
    activeKey: {
      type: Number,
      default: 0
    },
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
      dt,
      formData: {
        mailNo:'',  //快递单号
        cpCode:'',  //快递公司编码
        cpName:'',  //快递公司名称
        phone:'',   //寄件人电话
      },
      expressCompanyOptions: [], //快递公司数据
    }
  },
	computed: {
		key() {
			return this.detail
		},
	},
  created() {
    console.log(this.activeKey)
  },
  activated() {
  },
  mounted () {
      console.log(this.key)
    if(!!this.detail.oddNumbers){
      console.log(this.detail.oddNumbers)
      this.handleInputChange()
    }
  },
  methods: {
    //快递单号改变后
    handleInputChange() {
      if (!this.detail.oddNumbers) {
        return;
      }
      let obj = {
        mailNo: this.detail.oddNumbers,
      }
      let params = {
        appid: this.appid,
        sign: this.initSign(JSON.stringify(obj)),
        requestData: JSON.stringify(obj),
      }
      axios.post('https://express.xuanquetech.com/express/v2/exCompany', qs.stringify(params), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
      }).then((res) => {
        if (res.data.success) {
          this.expressCompanyOptions = []

          res.data.list.forEach((item) => {
            let obj = {
              companyName: item.cpName,
              companyCode: item.cpCode
            }
            this.expressCompanyOptions.push(obj)
          })
          this.formData.cpCode = this.expressCompanyOptions[0].companyCode
          this.formData.cpName = this.expressCompanyOptions[0].companyName

        } else {
          this.expressCompanyOptions = this.localExpressCompanyOptions
          this.formData.cpCode = ''
          this.formData.cpName = ''
        }
      }).catch((err) => {

      })
    },
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

  .detail-ul {
    li {
      .li-span-width {
        width: auto !important;
      }
    }
  }

  .Logistics-Information-dt {
    width: 100%;

    img {
      width: 100%;
    }
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
      justify-content: space-between;
      background: #f1f8ff;
      border-bottom: 1px solid #e9e9e9;

      .van-col {
        line-height: 40px;
        width: 90px;
        padding: 0 10px;
        border-right: 1px solid #e9e9e9;
        font-size: 12px;

        &:nth-child(1) {
          width: 60px;
        }
      }
    }

    .th-rows {
      background: #fff;
    }
  }
}
</style>