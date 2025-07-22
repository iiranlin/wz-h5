<template>
  <div class="default-container">
    <div class="detail-base-info">
      <div>
        <div class="detail-title-content">
          <img src="/static/icon-xqjh.png">
          <span>需求编号：</span>
          <span>{{ detail.planNumber }}</span>
          <div class="detail-title-status">
            <img :src="checkAuditStatus(detail.planStatus)" />
            <span>{{ checkStatusText(detail.planStatus) }}</span>
          </div>
        </div>
        <ul class="detail-ul">
          <li>
            <span>需求名称：</span>
            <span>{{ detail.planName }}</span>
          </li>
          <li>
            <span>需求项目：</span>
            <span>{{ detail.sectionName }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ detail.deptName }}</span>
          </li>
          <li>
            <span>提报人：</span>
            <span>{{ detail.createUserName }}</span>
          </li>
          <li>
            <span>提报时间：</span>
            <span>{{ parseTime(detail.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
          </li>
        </ul>
      </div>
    </div>
    <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff" title-inactive-color="#2e2e2e">
      <van-tab :title="`物资明细（${detail.details.length}项）`">
        <div slot="title">
          <span>物资明细</span>
          <span class="select-materials-select">（{{ detail.details.length }}项）</span>
        </div>
        <material-details :list="detail.details"></material-details>
      </van-tab>
      <van-tab title="日志记录">
        <log-recording></log-recording>
      </van-tab>
    </van-tabs>
    <div class="default-button-container" v-if="['1', '4', '0', '5', '10'].includes(detail.planStatus)">
      <van-button class="button-info" round type="info" @click="handleExamineClick(detail)">提交审核</van-button>
    </div>
    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>
  </div>
</template>
<script>
import MaterialDetails from './components/MaterialDetails'
import LogRecording from './components/LogRecording'
import { materialDemandPlanRestDetail, materialDemandPlanRestSubmit } from '@/api/prodmgr-inv/materialDemandPlanRest'
import activitiAssignee from '@/components/activitiAssignee'
export default {
  name: 'RequirementDetails',
  components: { MaterialDetails, LogRecording, activitiAssignee },
  data() {
    return {
      menuActiveIndex: '',
      detail: {
        details: []
      },
      statusArr: [
        { text: '全部', value: '' },
        { text: '已驳回', value: '0' },
        { text: '未提交', value: '1' },
        { text: '已提交', value: '2' },
        { text: '已生效', value: '3' },
        { text: '修改后同意', value: '4' },
        { text: '已撤回', value: '5' },
        { text: '供应中', value: '6' },
        { text: '收货完成', value: '7' },
        { text: '已入库', value: '8' },
        { text: '已完成', value: '9' },
        { text: '已退回', value: '10' },
      ],
      businessCode: { '1': 'FBYLXQ', '2': 'FBYLJH', '3': 'YLXQ', '4': 'YLJH' }
    }
  },
  created() {
  },
  activated() {
  },
  mounted() {
    const id = this.$route.query.id
    id && this.materialDemandPlanRestDetail(id)
  },
  methods: {
    materialDemandPlanRestDetail(id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialDemandPlanRestDetail(id).then(({ data }) => {
        this.detail = data
      }).finally((err) => {
        toast.clear()
      })
    },
    //去审核点击
    handleExamineClick(item) {
      this.$refs.activitiAssignee.init(this.businessCode[item.planType], item)
    },
    //选择审核人回调
    optionsSuccess(assignee, { id, planType }) {
      materialDemandPlanRestSubmit({ ids: [id], planType: planType, assignee }).then(() => {
        this.$toast('提交审核成功')
        this.$router.push({ name: 'PlannedManagementList' })
      })
    },
    checkStatusText(status) {
      let name = ''
      this.statusArr.forEach(item => {
        if (item.value === status) {
          name = item.text
        }
      })
      return name
    },
    checkAuditStatus(status) {
      if (status == '0') {
        return '/static/icon-reject.png'
      } else if (['5', '10'].includes(status)) {
        return '/static/icon-return.png'
      } else {
        return '/static/icon-success.png'
      }
    },
  },
}
</script>
<style lang="less" scoped>
.select-materials-select {
  font-size: 12px;
}
.van-tabs{
  padding-bottom: 62px;
}
.detail-title-content{
  position: relative;
  .detail-title-status {
    position: absolute;
    right: 10px;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;

    img {
      width: 16px;
      height: 16px;
    }

    span {
      margin-left: 3px;
      color: #134daa;
      font-size: 11px;
    }
  }

}
</style>