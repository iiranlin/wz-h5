<template>
  <div class="return-handled-by">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ detail.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>经办人：</span>
            <span>{{detail.createUserName}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="box-container">
      <div class="detail-title-contentA">
        <img src="@/assets/img/Icon-detailInfo.png"/>
        <span>退回说明</span>
      </div>
      <div class="detail-title-content-field">
        <span class="detail-title-content-field-span li-span-red">*</span>
        <van-field class="detail-base-info-edited-textarea" v-model="formMessage" rows="3" autosize type="textarea" placeholder="请输入退回说明" />
      </div>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round @click="cancelClick">取消</van-button>
      <van-button class="button-info" round type="info" @click="backUpClick">确定</van-button>
    </div>
  </div>
</template>
<script>
import { materialDemandPlanRestDetail, backUp } from '@/api/prodmgr-inv/materialDemandPlanRest'
export default {
  name: 'ReturnHandledBy',
  data() {
    return {
      detail: {},
      formMessage: ''
    }
  },
  created() {
  },
  activated() {
  },
  mounted() {
    const { id = null } = this.$route.query
    id && this.materialDemandPlanRestDetail(id)
  },
  methods: {
    materialDemandPlanRestDetail(id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialDemandPlanRestDetail(id).then(({ data }) => {
        this.detail = data
      }).finally((err) => {
        toast.clear()
      })
    },
    backUpClick () {
      if(!this.formMessage){
        this.$notify({
          type: 'warning',
          message: '请输入退回说明!',
        });
        return
      }
      const params = {
        id:this.detail.id,
        message: this.formMessage
      }
      let toast = this.$toast.loading({
        duration: 0,
        message: "退回中...",
        forbidClick: true
      });
      backUp(params).then(({ message }) => {
        this.$toast(message)
        this.$router.go(-1)
      }).finally(() => {
        toast.clear()
      })
    },
    cancelClick () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.return-handled-by {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

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
      padding: 10px 12px;
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
  
  .box-container{
    padding: 0;
    margin-bottom: 0;
    margin-top: 8px;
  
    .detail-title-contentA {
      width: 100%;
      height: 34px;
      display: flex;
      align-items: center;
      padding-left: 2px;
      padding-right: 27px;
      box-sizing: border-box;
      border-top: 1px solid #f1f4f8;

      img {
        width: 25px;
        height: 25px;
      }

      & span:nth-child(2) {
        margin-left: 2px;
        color: #151b3e;
        font-size: 15px;
        font-weight: 600;
      }

      & span:nth-child(3) {
        color: #151b3e;
        font-size: 15px;
        font-weight: 600;
      }
    }

    .detail-title-content-field {
      padding-left: 10px;
      padding-right: 16px;
      padding-bottom: 12px;
      display: flex;

      .detail-title-content-field-span{
        padding-right: 5px;
        padding-left: 5px;
      }

      .detail-base-info-edited-textarea {
        background: #f6f6f6;
        border-radius: 10px;
        padding-left: 13px;
        padding-right: 13px;
      }
    }
  }
}
</style>