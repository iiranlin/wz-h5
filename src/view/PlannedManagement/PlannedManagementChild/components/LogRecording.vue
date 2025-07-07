<template>
  <div>
    <div class="box-container" v-for="(item, index) in list" :key="index">
      <div>
        <div class="detail-list-title-content">
          <span>{{ item.logName }}</span>
          <span class="li-item-right">{{ parseTime(item.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </div>
        <ul class="detail-ul">
          <li>
            <span>事件组织：</span>
            <span>{{ item.deptName }}</span>
          </li>
          <li>
            <span>操作人：</span>
            <span>{{ item.createUserName }}</span>
          </li>
          <li>
            <span>备注：</span>
            <span>{{ item.amount }}</span>
          </li>
        </ul>
      </div>
    </div>
    <van-empty v-if="list.length === 0" description="暂无数据" />
  </div>
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
  mounted() {
    const businessId = this.$route.query.id
    businessId && this.materialOperateLogGetList(businessId)
  },
  methods: {
    materialOperateLogGetList(businessId) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialOperateLogGetList({ businessId }).then(({ data }) => {
        this.list = data || []
      }).finally((err) => {
        toast.clear()
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
.box-container {
  padding: 0px;

  .li-item-right {
    float: right;
  }
}
</style>