<!-- 监理首页 -->
<template>
  <div class="my-to-do-list">
    <van-pull-refresh v-model="refreshLoading" @refresh="refreshCheck" success-text="刷新成功">
      <div>
        <VideoArea ref="VideoArea"></VideoArea>
      </div>

      <div style="margin: 10px 0;" @click="handleRouter('/WaitExamineList')">
        <div class="demandInfo">
          <div class="unitNum">
            <span class="title">待审核：</span><span class="sumStyle">{{ checkInfo.auditNum }}</span>
          </div>
        </div>
      </div>

      <div style="margin: 10px 0;" @click="handleRouter('/OverExamineList')">
        <div class="demandInfo2">
          <div class="unitNum2">
            <span class="title">已审核：</span><span class="sumStyle">{{ checkInfo.auditedNum }}</span>
          </div>
        </div>
      </div>
    </van-pull-refresh>

  </div>
</template>

<script>
import keepPages from '@/view/mixins/keepPages'

import { Toast } from 'vant';
import Vue from 'vue';
Vue.use(Toast);

import { getTodoCount } from './api/homePage.js'
import VideoArea from './components/VideoArea.vue';
export default {
  name: 'supervisorPage',
  mixins: [keepPages],

  components: {
    VideoArea,
  },
  
  activated() {
    this.$nextTick(() => {
      this.$refs.VideoArea?.$refs.videos?.play();
      this.$refs.checkModule?.handlerTodoCount();
    })
  },

  data() {
    return {
      refreshLoading: false,
      checkInfo: {}
    };
  },

  mounted() {
    this.handlerTodoCount();
  },

  methods: {
    handleRouter(path) {
      this.$router.push({ path: path })
    },
    refreshCheck() {
      this.refreshLoading = true
      this.handlerTodoCount();
    },
    // 获取审核数量
    handlerTodoCount() {
      Toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });

      getTodoCount().then(res => {
        const { code, data } = res;
        if (code == 0) {
          this.refreshLoading = false;

          this.checkInfo = data;
        }
      }).finally(() => {
        Toast.clear();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.my-to-do-list {
  height: 100%;
  overflow-y: auto;
  background-color: #2E5EAD;
}

::v-deep .van-pull-refresh__head {
  color: #fff;
}

::v-deep .van-loading__text {
  color: #fff;
}

.dot() {
  // 注意：名字后面带 ()，表示不会直接输出到 CSS
  width: 94%;
  height: 100px;
  margin: 0 auto;
  border-radius: 8px;
  line-height: 90px;
  padding-left: 50px;
  font-size: 18px;
  font-weight: 600;
  box-sizing: border-box;
  background-blend-mode: multiply;
}

.text() {
  // 注意：名字后面带 ()，表示不会直接输出到 CSS
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 25%;
  position: absolute;
  left: -15px;
  top: 45%;
}

.demandInfo {
  .dot();
  background: linear-gradient(to right, white 0%, #BEDBF4 100%), url('../../assets/img/demand.png') no-repeat right top / 200px 100px;
}

.demandInfo2 {
  .dot();
  background: linear-gradient(to right, white 0%, #BEDBF4 100%), url('../../assets/img/review.png') no-repeat right top / 200px 100px;
}

.unitNum {
  position: relative;

  .title::after {
    .text();
    background: #F5A627;
  }
}

.unitNum2 {
  position: relative;

  .title::after {
    .text();
    background: #32DD9B;
  }
}

.sumStyle {
  font-size: 30px;
  font-weight: 600;
  color: #2053C4;
  vertical-align: bottom;
}
</style>