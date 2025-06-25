<template>
  <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
  <div>
    <div class="box-container" v-for="(item, index) in list" :key="index">
      <div>
        <ul class="detail-ul">
          <li>
            <span class="font-weight">事件组织：</span>
            <span class="font-weight">{{ item.deptName }}</span>
          </li>
          <li>
            <span>事件：</span>
            <span>{{ item.logName }}</span>
          </li>
          <li>
            <span>操作人：</span>
            <span>{{ item.createUserName }}</span>
          </li>
          <li>
            <span>操作时间：</span>
            <span>{{ parseTime(item.createDate, '{y}-{m}-{d}') }}</span>
          </li>
          <!-- <li class="li-item-both">
            <div>
              <span>事件：</span>
              <span>{{ item.logName }}</span>
            </div>
            <div>
              <span>操作人：</span>
              <span>{{ item.createUserName }}</span>
            </div>
            <div>
              <span>操作时间：</span>
              <span>{{ parseTime(item.createDate, '{y}-{m}-{d}') }}</span>
            </div>
          </li> -->
          <li>
            <span>备注：</span>
            <span>{{ item.amount }}</span>
          </li>
        </ul>
      </div>
    </div>
    <van-empty v-if="list.length === 0" description="暂无数据" />
  </div>
  <!-- </van-list> -->
</template>
<script>
import { materialOperateLogGetList } from '@/api/prodmgr-inv/materialOperateLog'
export default {
  name: 'LogRecording',
  components: {},
  data() {
    return {
      loading: false,
      // finished: false,
      list: []
    }
  },
  created() {
  },
  activated() {
  },
  mounted () {
    const businessId = this.$route.query.id
    businessId && this.materialOperateLogGetList(businessId)
  },
  methods: {
    materialOperateLogGetList (businessId) {
      this.loading = true
      materialOperateLogGetList({businessId}).then(({data}) => {
        this.list = data || []
      }).finally( (err) => {
        this.loading = false
      })
    }
    // onLoad() {
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }
    //     // 加载状态结束
    //     this.loading = false;

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true;
    //     }
    //   }, 500);
    // },
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
</style>