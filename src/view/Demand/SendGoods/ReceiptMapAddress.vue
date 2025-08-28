<template>
  <div class="Logistics-Details">
    <div class="Logistics-Information-dt" ref="information">
      <mapSelection :addrData="addrData" :addr="addr" @updateLocation="updateLocation"/>
    </div>
  </div>
</template>
<script>
import mapSelection from '@/components/map-selection'

export default {
  name: 'ReceiptMapAddress',
  components: { mapSelection },
  data() {
    return {
      appid: "bjhzcZ1hF8rR5gF5mK9qW",
      appSecret: "4c18253ddba74d30b1b74a692aab6606",
      addrData:{},
      addr:''
    }
  },
	computed: {

	},
  created() {
    if(this.$route.query.type=='create'){
      this.addr = this.$route.query.addr
    }else{
      this.addrData =JSON.parse(this.$route.query.obj)
    }
    
  },
  activated() {
  },
  watch:{
    
  },
  mounted () {
   
  },
  methods: {
    updateLocation(address){
        if(this.$route.query.type=='create'){
           this.$router.push({
                path: 'ReceiptOperates',
                query: {
                    type: 'create',
                    addr:address
                },
            })

        }else{
          this.addrData.receiveraddress = address
          this.$router.push({
              path: 'ReceiptOperates',
              query: {
                  type: this.$route.query.type,
                  position: this.$route.query.position,
                  obj: JSON.stringify(this.addrData) ,
              },
          })

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