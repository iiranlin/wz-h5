<template>
  <div class="edited-materials">
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
          <span>需求数量：</span>
          <span>{{sectionInfo.planAmount}}</span>
        </li>
        <li class="li-item-overlength">
          <span>当前库存数量：</span>
          <span>{{sectionInfo.stockStatus}}</span>
        </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited" v-for="(item,index) in sectionInfo.childList" :key="index">
      <div class="detail-title-content">
          <img src="@/assets/img/Icon-notes.png" />
          <span>入库批次</span>
      </div>
      <div class="detail-title-content-field">
            <ul class="detail-list-ul-edited detail-list-ul">
              <li class="li-item-overlength">
                <span>当前库存数量：</span>
                <span>{{item.remainingStock}}</span>
              </li>
              <li >
                <span>入库单号：</span>
                <span>{{item.storeNumber}}</span>
              </li>
              <li>
                <span>生产日期：</span>
                <span>{{item.manufactureDate && parseTime(item.manufactureDate,'{y}-{m}-{d}')}}</span>
              </li>
              <li class="li-item-overlength">
                <span>有效期截至日期：</span>
                <span>{{item.expirationDate && parseTime(item.expirationDate,'{y}-{m}-{d}')}}</span>
              </li>
              <template>
                <van-field label="出库数量" class="detail-base-info-edited-input" placeholder="请输入数量" required clearable
                  input-align="right">
                  <template #input>
                    <van-stepper v-model="item.outTotal" :min="0" :max="item.remainingStock" />
                  </template>
                </van-field>
              </template>
              <div class="detail-title-content-field">
                <van-field class="detail-base-info-edited-textarea" v-model="item.remark" rows="2" autosize
                  type="textarea" placeholder="请输入备注信息" />
              </div>
            </ul>
        </div>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round @click="sureClick(false)">返回</van-button>
      <van-button class="button-info" round type="info" @click="sureClick(true)">确定</van-button>
    </div>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
export default {
  name: 'EditedMaterials',
  mixins: [keepPages],
  components: {},
  data() {
    return {
      sectionInfo: {},
      queryType: '',
      contractId: '',
      queryId: '',
      queryIndex:0
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
    init() {
      const { type ,index, id  } = this.$route.query
      this.queryType = type
      this.queryId = id
      this.queryIndex= index
      console.log(this.queryIndex,"this.queryIndex")
      this.sectionInfo = Object.assign({}, this.$store.state.public.outboundData || {})
    },
    sureClick(isData) {
      let that  = this 
      if (isData) {
        const data = this.$store.state.public.outboundData || []
        if(data.childList&&data.childList.length){
           data.childList.forEach((item, index) => {
            that.sectionInfo.childList.forEach((list,listIndex)=>{
              if (item.id ==list.id) {
                  this.$set(data.childList, index, list)
                }
            })
          });
        }
       
        this.$store.dispatch('public/setOutboundData', data)
      }
      this.$router.push({ name: 'Outbound', query: { type: this.queryType, id: this.queryId,index:this.queryIndex } })
    },
  }
}
</script>
<style lang="less" scoped>
.edited-materials {
  padding-bottom: 60px;

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
      .van-cell::after{
        border-bottom:none !important;
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

    // .detail-title-content-field {
    //   // padding-left: 20px;
    //   // padding-right: 10px;
    //   // padding-bottom: 5px;

    //   .detail-base-info-edited-textarea {
    //     background: #f6f6f6;
    //     border-radius: 10px;
    //   }
    // }
    .detail-base-info-edited-input{
      ::v-deep .van-field__label{
        font-size: 0.325rem;
        color: #151b3e;

      }
    }
    .detail-title-content-field {
      .van-cell{
        padding-top: 0;
      }
      .detail-base-info-edited-textarea {
        ::v-deep .van-cell__value{
          background: rgba(242, 242, 242, 1);
          border-radius: 0.125rem;
          .van-field__body{
            padding: 5px 10px;
          }
        }
     
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

  .default-button-container {
    .button-info {
      width: 169px;
      height: 34px;
    }
  }
}
</style>