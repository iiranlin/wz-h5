<template>
  <div class="acceptance-return in-out-management">
    <!-- <div class="tab-img">
      <div>
        <img src="@/assets/img/acceptImg.png" alt="" @click="changeTab(0)">
      </div>
      <div>
        <img src="@/assets/img/returnImg.png" alt="" @click="changeTab(1)">
      </div>
    </div> -->

     <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e" class="in-out-management-tab">
    <!-- <van-tabs
      class="switch-tab"
      v-model="menuActiveIndex"
      color="#0571ff"
      background="#eef6ff"
      title-active-color="#0571ff"
      title-inactive-color="#2e2e2e"> -->
      <van-tab title="收货管理">
        <div slot="title">
            <img src="@/assets/img/SHGL.png">
            <span class="in-out-management-tab-span">收货管理</span>
          </div>
        <acceptance/>
      </van-tab>
      <van-tab title="退货管理">
          <div slot="title">
            <img src="@/assets/img/THGL.png">
            <span class="in-out-management-tab-span">退货管理</span>
          </div>
        <return/>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import Acceptance from '@/view/AcceptanceReturn/Acceptance.vue'
import Return from '@/view/AcceptanceReturn/Return.vue'




export default {
  name: 'AcceptanceReturn',
  components: {Return, Acceptance},
  mixins: [keepPages],

  data() {
    return {
      menuActiveIndex: 0,
    }
  },
  beforeRouteLeave (to, from, next) {
      from.meta.myToDoNavIndex = this.menuActiveIndex;
      next();
  },
  created () {
      if(this.$route.meta.myToDoNavIndex){
        this.menuActiveIndex = this.$route.meta.myToDoNavIndex;
      }
      
  },
  methods: {
    changeTab(index) {
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
      align-items: anchor-center;
      img{
        width: 24px;
        height: 24px;
        margin-top: 8px;
      }
    }
  }
}

</style>
