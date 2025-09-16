<template>
  <div class="submit-supplier">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ detail.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>供应商名称：</span>
            <span>{{detail.sellerName}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="box-container">
      <div class="detail-title-contentA">
        <img src="/static/icon-file.png">
        <span>需求计划表附件</span>
      </div>
      <p class="box-container-p" v-if="!fileList.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持jpg、png、jpeg、pdf格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="fileList || []" businessType="01" />
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round @click="cancelClick">取消</van-button>
      <van-button class="button-info" round type="info" @click="submitSeller">提交</van-button>
    </div>
  </div>
</template>
<script>
import { materialDemandPlanRestDetail, submitSeller } from '@/api/prodmgr-inv/materialDemandPlanRest'
import FileUploadView from "@/components/FileUploadView.vue"
export default {
  name: 'SubmitSupplier',
  components: { FileUploadView },
  data() {
    return {
      detail: {},
      fileList: []
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
    submitSeller () {
      if(!this.fileList.length){
        this.$notify({
          type: 'warning',
          message: '请上传附件!',
        });
        return
      }
      const params = {
        ...this.detail,
        fileList: [{ fileList: this.fileList }]
      }
      let toast = this.$toast.loading({
        duration: 0,
        message: "提交中...",
        forbidClick: true
      });
      submitSeller(params).then(({ message }) => {
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
.submit-supplier {
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

    .box-container-p{
      font-size: 11px;
      color: #4a4a4a;
      text-align: center;
      margin-top: 22px;
      margin-bottom: 13px;
      span{
        vertical-align: middle;
      }
    }
  }
}
</style>