<template>
  <div class="acceptance-return in-out-management">
     <van-tabs  v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff" @change="changeTab"
        title-inactive-color="#2e2e2e" class="in-out-management-tab">
      <van-tab title="采购文件核备">
        <div slot="title">
            <img src="@/assets/img/SHGL.png">
            <span class="in-out-management-tab-span">采购文件核备</span>
          </div>
        <purchaseFile ref="purchaseFile"/>
      </van-tab>
      <van-tab title="采购合同核备">
          <div slot="title">
            <img src="@/assets/img/THGL.png">
            <span class="in-out-management-tab-span">采购合同核备</span>
          </div>
        <purchaseContract ref="purchaseContract"/>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import purchaseFile from '@/view/SelfBuying/purchaseFile.vue'
import purchaseContract from '@/view/SelfBuying/purchaseContract.vue'




export default {
  name: 'SelfBuying',
  components: {purchaseContract, purchaseFile},

  data() {
    return {
      className: '.in-out-management',
      menuActiveIndex: 0,
    }
  },

  activated() {
      if(this.$route.query?.tabIndex) {
        this.changeTab(+this.$route.query?.tabIndex)
      }
  },

  created () {

      if(this.$route.query?.tabIndex) {
        this.changeTab(+this.$route.query?.tabIndex)
      }
      
  },
  methods: {
    changeTab(index) {
      this.$nextTick(() => {
        if (index === 0) {
          this.$refs.purchaseFile.allRefresh()
        } else if (index === 1) {
          this.$refs.purchaseContract.allRefresh()
        }
      })
      this.menuActiveIndex = index
    }
  }
}
</script>
<style lang="less" scoped>
.switch-tab {
  ::v-deep & > .van-tabs__wrap {
    margin-bottom: 0;
    height: 0.8rem;

  }
}

.tab-img {
  background-color: #eef6ff;
  display: flex;
  position: relative;

  & > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    img {
      width: 0.6rem;
    }
  }
}
.in-out-management {
  height: 100%;
  overflow-y: auto;
  .in-out-management-tab{
    ::v-deep .van-tabs__wrap{
      margin-bottom: 0px;
      height: 70px;
    }
    .in-out-management-tab-span{
      padding: 5px 0;
    }
    // padding-top: 5px;
    // line-height: 28px;
  }
  .van-tab__text{
    div{
      display: flex;
      flex-direction: column;
      align-items: center;
      img{
        width: 24px;
        height: 24px;
        margin-top: 8px;
      }
    }
  }
}

</style>
