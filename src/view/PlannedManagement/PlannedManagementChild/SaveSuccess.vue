<template>
  <div class="save-success">
    <div class="save-success-img">
      <img src="@/assets/img/Success.png">
      <p>保存成功</p>
    </div>
    <div class="save-success-button">
      <van-button class="button-info" round type="info" @click="buttonClick('returnList')">返回列表</van-button>
      <van-button class="button-info" round @click="buttonClick('view')">查看详情</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SaveSuccess',
  data() {
    return {
    }
  },
  methods: {
    buttonClick (code) {
      const { id = null } = this.$route.query
      const objFun = {
        'returnList': () => {
          this.$router.push({ name: 'PlannedManagementList' })
        },
        'view': () => {
          this.$router.push({ name: 'RequirementDetails', query: { id } })
        }
      }
      objFun[code] && objFun[code]()
    }
  },
}
</script>
<style lang="less" scoped>
.save-success{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  .save-success-img{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 110px;
    img{
      width: 160px;
      height: 128px;
    }
    p{
      font-size: 24px;
      padding: 11px;
    }
  }
  .save-success-button{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 110px;
    .button-info{
      width: 212px;
      height: 43px;
      margin-bottom: 13px;
    }
  }
}
</style>