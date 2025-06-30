<template>
  <div class="acceptance-return">
    <div class="tab-img">
      <div>
        <img src="@/assets/img/acceptImg.png" alt="" @click="changeTab(0)">
      </div>
      <div>
        <img src="@/assets/img/returnImg.png" alt="" @click="changeTab(1)">
      </div>
    </div>
    <van-tabs
      class="switch-tab"
      v-model="menuActiveIndex"
      color="#0571ff"
      background="#eef6ff"
      title-active-color="#0571ff"
      title-inactive-color="#2e2e2e">
      <van-tab title="收货管理">
        <acceptance/>
      </van-tab>
      <van-tab title="退货管理">
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
</style>
