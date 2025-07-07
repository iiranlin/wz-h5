<template>
  <div class="default-container">
    <div class="detail-base-info">
        <div class="detail-title-content">
            <img src="/static/icon-xqjh.png">
            <span>需求编号：</span>
            <span>{{detail.planNumber}}</span>
        </div>
        <div>
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
          <!-- <li class="li-status">
            <template v-for="row in statusArr">
              <van-tag :class="{ 'li-status-completed': row.value == '9' }"
                :type="['0', '5'].includes(row.value) ? 'danger' : 'primary'" round size="medium" :key="row.value"
                v-if="detail.planStatus == row.value">{{ row.text }}</van-tag>
            </template>
            </li> -->
            </ul>
        </div>
    </div>
    <van-tabs :class="{'details-van-tabs': ['1', '4', '0', '5', '10'].includes(detail.planStatus)}" sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
      title-inactive-color="#2e2e2e">
      <van-tab title="物资明细">
        <material-details :list="detail.details"></material-details>
      </van-tab>
      <van-tab title="日志记录">
        <log-recording></log-recording>
      </van-tab>
    </van-tabs>
    <div class="default-button-container" v-if="['1', '4', '0', '5', '10'].includes(detail.planStatus)">
      <van-button class="button-info" round type="info"
        @click="handleExamineClick(detail)">提交审核</van-button>
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
  },
}
</script>
<style lang="less" scoped>
.requirement-details {
  display: flex;
  flex-direction: column;

  .select-materials-sticky {
    ::v-deep .van-sticky {
      background: #f8f8f8;
    }
  }

  .requirement-details-contract {
    margin-top: 10px;
    box-sizing: border-box;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 10px;

    .li-status {
      position: absolute;
      right: 15px;
      top: 12px;

      span {
        font-size: 12px;
        width: inherit !important;
        padding: 2px 6px;
        line-height: 16px;
      }

      .van-tag--primary {
        color: #028bff;
        background: #edf4ff;
      }

      .van-tag--danger {
        color: #f83738;
        background: #ffe2e2;
      }

      .li-status-completed {
        color: #6f6f6f;
        background: #ededed;
      }
    }
  }
  .details-van-tabs{
    margin-bottom: 50px;
  }
}

::v-deep .van-tabs__wrap {
  // position: fixed;
  // z-index: 1;
  width: 100%;
}

.detail-ul {
  li {
    span {
      &:nth-child(1) {
        width: 80px;
      }
    }
  }
}

.li-item-both {
  justify-content: space-between;
}

.li-item-left {
  width: auto !important;
}

.li-item-left-num {
  span:nth-child(1) {
    min-width: 100px;
  }
}

.li-item-right {
  width: auto !important;

  span:nth-child(1) {
    width: auto;
    text-align: right;
  }

  span:nth-child(2) {
    width: auto;
  }
}
</style>