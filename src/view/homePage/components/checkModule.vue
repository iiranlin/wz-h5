<!-- 审核 -->
<template>
  <div>
    <ul class="auditInfo">
       <li  @click="handleRouter('/ByMeList')">
        <div>{{ checkInfo.launchNum }}</div>
        <div> <span class="title1">我的发起</span></div>
      </li>
      <li  @click="handleRouter('/WaitExamineList')">
        <div>{{ checkInfo.auditNum }}</div>
        <div> <span class="title">待审核</span></div>
      </li>
      <li  @click="handleRouter('/WaitHandleList')">
        <div>{{ checkInfo.handleNum }}</div>
        <div><span class="title2">待处理</span></div>
      </li>
      <li @click="handleRouter('/OverExamineList')">
        <div>{{ checkInfo.auditedNum }}</div>
        <div><span class="title3">已审核</span></div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Toast } from 'vant';
import Vue from 'vue';
Vue.use(Toast);

import { getTodoCount } from '../api/homePage.js'
export default {
  name: 'CheckModule',

  data() {
    return {
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
          this.$emit('refreshL', false);

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
.dot() {
  // 注意：名字后面带 ()，表示不会直接输出到 CSS
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 25%;
  position: absolute;
  left: -12px;
  top: 30%;
}

.auditInfo {
  width: 94%;
  height: 100px;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 8px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    div:nth-child(1) {
      font-size: 35px;
      font-weight: 600;
    }

    div:nth-child(2) {
      font-size: 14px;
      font-weight: 600;
      position: relative;

      .title::after {
        .dot();
        background: #F5A627;
      }

       .title1::after {
        .dot();
        background: #3cc4f6;
      }

      .title2::after {
        .dot();
        background: #2B6EED;
      }

      .title3::after {
        .dot();
        background: #32DD9B;
      }
    }
  }
}
</style>