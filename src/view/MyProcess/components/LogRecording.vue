<template>
  <div>
    <div class="box-container" v-for="(item, index) in list" :key="index">
      <div>
        <div class="detail-list-title-content">
          <span>{{ item.logName }}</span>
          <span class="li-item-right">{{ parseTime(item.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </div>
        <ul class="detail-list-ul">
          <li>
            <span>事件组织：</span>
            <span>{{ item.deptName }}</span>
          </li>
          <li>
            <span>操作人：</span>
            <span>{{ item.createUserName }}</span>
          </li>
          <li v-if="item.amount">
            <span>备注：</span>
            <span>{{ item.amount }}</span>
          </li>
        </ul>
      </div>
    </div>
    <van-empty image="/empty-image-default.png" v-if="list.length === 0" description="暂无数据" />
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
    const businessId = this.$route.params.logId
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

        console.log(data,"111")
        this.list = data || []
        console.log(this.list,"2222")

      }).finally((err) => {
        toast.clear()
      })
    }
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