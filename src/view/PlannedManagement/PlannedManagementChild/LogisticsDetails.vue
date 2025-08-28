<template>
  <div class="Logistics-Details">
    <div class="Logistics-Information-dt" ref="information">
      <wuliu :courierNumber="courierNumber" :zoomNum="zoomNum" @expressDataFun="expressDataFun" v-if="courierNumber"/>
    </div>
    <div class="Logistics-Information-list" ref="list">
      <p class="Information-list-title">物流单号: {{courierNumber}}</p>
      <ul >
        <li v-for="(item, index) in expressData.routeDtos" :key="index">
          <!-- <p>{{ item.context }}</p>
          <p>{{ item.time }}</p> -->
          <div class="list-first">
            <p v-if="index=='0'" style=" border: 1px solid #E4393c;background:#E4393c;">
            </p>
            <p v-else style=" border: 1px solid #ddd;">
            </p>
            <p>
            </p>
          </div>
          <div class="list-last">
            <p v-if="index=='0'" style="color:#E4393c;font-size:14px;">{{expressData.logisticsStatusDesc}}</p>
            <p v-else-if="item.status==9" style="font-size:14px;font-weight:bold;">派送中</p>
            <p v-else-if="item.status==7" style="font-size:14px;font-weight:bold;">已揽收</p>
            <p v-else-if="item.status==8" style="font-size:14px;font-weight:bold;">运输中</p>
            <p>{{ item.context }}</p>
            <p>{{ item.time }}</p>
          </div>
        </li>
      </ul>
      
    </div>
  </div>
</template>
<script>
import wuliu from '@/components/wuliu'

export default {
  name: 'LogisticsDetails',
  components: { wuliu },
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
      expressData: {},
      zoomNum:7,
      oldScrollTop: 0,
      scrollTop:0,
      ticking: false,
      containerHeighet:0

    }
  },
	computed: {
    courierNumber() {
      return this.$route.query.courierNumber
    },
	},
  created() {
  },
  activated() {
  },
  watch:{
    scrollTop(newValue,oldValue){
      setTimeout(()=>{
        if(newValue==window.scrollY){
          //滚动结束
          this.oldScrollTop =newValue 
          this.scrollEnd()
        }
      },200)
    }
  },
  mounted () {
    window.addEventListener('scroll',()=>{
      this.scrollTop =window.scrollY 
    })
    this.containerHeighet = this.$refs.information.clientHeight
  },
  beforeDestroy() {
    window.removeEventListener('scroll', ()=>{
      this.scrollTop =window.scrollY
    });
  },
  methods: {
    expressDataFun (expressData) {
      console.log(expressData,"expressData")
      this.expressData = expressData
    },
    scrollEnd(){
      console.log(this.scrollTop,"this.scrollTop")
      if(this.scrollTop==0){
        this.zoomNum = 7 
        // this.$refs.information.style.height="100vh"
      }else{
        this.zoomNum = 7 + Number(this.scrollTop/100)
        // this.$refs.information.style.height=  (this.containerHeighet - this.scrollTop ) +"px" 
      }
    },
  },
}
</script>
<style lang="less" scoped>
.Logistics-Details {
  width: 100%;
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
    height: 100vh;
    position: fixed;
    z-index: 1;
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
      background: #fff;
      position: absolute;
      top: 80vh;
      z-index: 9;
      margin:0 10px;
      border-radius: 10px;
      .Information-list-title{
        padding: 17px 17px 10px 17px;
        font-size: 14px;
      }
    ul{
      li{
        box-sizing: border-box;
        width:100%;
        // margin-top: 8px;
        background: #fff;
        // padding: 10px 12px 10px 17px;
        font-size: 12px;
        display: flex;
        .list-first{
          padding: 0 17px;
          p:nth-child(1){
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid #ddd;
            margin-top: 20px;
          }
          p:nth-child(2){
            height:calc(100% - 12px);
            width: 1px;
            border-left: 1px dotted  rgba(120, 144, 177, 0.5);
            margin-left:calc(50% - 1px);
          }  
        }
        .list-last{
           p:nth-child(1){
            margin-top: 20px;
            padding-right:10px;
           }
            p:nth-child(2){
            margin-top: 10px;
            padding-right:10px;
           }
          p:nth-child(3){
            margin-top: 10px;
            opacity: 0.5;
          }
        }
      }
      li:last-child{
        .list-first{
          p:nth-child(2){
            height:calc(100% - 12px);
            width: 1px;
            border-left: 1px dotted  transparent;
            margin-left:calc(50% - 1px);
          }  
        }
      }
    }
  }
}
</style>