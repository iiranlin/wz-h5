<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <div class="box-container" v-for="(item, index) in list" :key="index">
      <div>
        <ul class="detail-ul">
          <li>
            <span class="font-weight">事件组织：</span>
            <span class="font-weight">施工单位分部名称-物资部</span>
          </li>
          <li class="li-item-both">
            <div>
              <span>事件：</span>
              <span>出库</span>
            </div>
            <div>
              <span>操作人：</span>
              <span>name</span>
            </div>
            <div>
              <span>操作时间：</span>
              <span>2025-05-30</span>
            </div>
          </li>
          <li>
            <span>备注：</span>
            <span>同意/不同/修改后同意</span>
          </li>
        </ul>
      </div>
    </div>
  </van-list>
</template>
<script>
export default {
  name: 'LogRecording',
  components: {},
  data() {
    return {
      loading: false,
      finished: false,
      list: []
    }
  },
  created() {
  },
  activated() {
  },
  methods: {
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 500);
    },
  },
}
</script>
<style lang="less" scoped>
.detail-ul{
  li{
    span{
      width: auto !important;
    }
    div{
      flex: 1;
      width: auto !important;
      &:nth-child(3){
        flex: 1.5;
      }
    }
  }
}
.li-item-both {
}
</style>