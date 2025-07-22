<template>
  <div class="requirement-details">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ detail.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>需求编号：</span>
            <span>{{ detail.planNumber }}</span>
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
            <span>{{ detail.createDate && parseTime(detail.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
          </li>
        </ul>
      </div>
      <div class="detail-ul-bottom-text">
        <ul class="detail-ul">
          <li>
            <span>物资项目：<span class="li-span-click">{{ detail.details.length }}</span> 项</span>
            <span><img class="detail-ul-bottom-text-log" src="@/assets/img/Icon-log.png" /> <span
                class="detail-ul-bottom-text-span">查看日志</span> <img class="detail-ul-bottom-text-Arrow"
                src="@/assets/img/Arrow-R.png" /></span>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-logistics.png" />
        <span>物流信息</span>
      </div>
      <ul class="detail-list-ul" v-for="(item, index) in dataPc" :key="index">
        <li>
          <span>发货批次{{ index + 1 }}：</span>
          <span><img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Arrow-R.png" /></span>
        </li>
        <li>
          <span>规格型号：</span>
        </li>
        <li>
          <span>计量单位：</span>
        </li>
      </ul>
    </div> -->
    <div class="detail-base-info detail-base-info-edited" v-if="recordList.length">
      <div class="detail-title-content detail-base-info-edited-div">
        <div class="detail-base-info-edited-img">
          <img src="@/assets/img/Icon-process.png" />
          <span>流程信息</span>
        </div>
        <div class="detail-base-info-edited-img">
          <img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Arrow-R.png" />
        </div>
      </div>
      <ul class="detail-ul">
        <li>
          <p class="detail-ul-p">
            <img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Icon-state.png"
              v-if="historyData.status == '2'" />
            <img class="detail-ul-bottom-text-Arrow" src="/static/icon-reject.png" v-else />
            <span>{{ historyData.assigneeName }}</span>
            <span :class="historyData.status == '2' ? 'li-span-click' : 'li-span-orange'">{{ historyData.status ==
          '2' ? '通过' : '驳回' }}</span>
          </p>
          <span>{{ historyData.endTime }}</span>
        </li>
      </ul>
    </div>
    <van-sticky class="select-materials-sticky">
      <div class="select-materials-search">
        <van-search v-model="searchValue" placeholder="输入规格型号" left-icon="none" background="center"
          :show-action="showAction">
          <template slot='right-icon'>
            <van-icon name="search" />
          </template>
        </van-search>
        <div class="select-materials-search-switch">
          <van-switch v-model="searchChecked" /><span>显示供应概览</span>
        </div>
      </div>
    </van-sticky>
    <material-details :list="detail.details" :searchChecked="searchChecked"></material-details>
    <div class="default-button-container" v-if="['1', '4', '0', '5', '10'].includes(detail.planStatus)">
      <van-button class="button-info" round type="info" @click="handleExamineClick(detail)">提交审核</van-button>
    </div>
    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import MaterialDetails from './components/MaterialDetails'
import LogRecording from './components/LogRecording'
import { materialDemandPlanRestDetail, materialDemandPlanRestSubmit } from '@/api/prodmgr-inv/materialDemandPlanRest'
import activitiAssignee from '@/components/activitiAssignee'
import { listPc } from '@/api/prodmgr-inv/materialCirculationTableRest'
import { wfHistoryList } from '@/api/myToDoList'
export default {
  name: 'RequirementDetails',
  components: { MaterialDetails, LogRecording, activitiAssignee, BackToTop },
  data() {
    return {
      menuActiveIndex: '',
      searchValue: '',
      showAction: false,
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
      businessCode: { '1': 'FBYLXQ', '2': 'FBYLJH', '3': 'YLXQ', '4': 'YLJH' },
      dataPc: [],
      recordList: [],
      historyData: {},
      searchChecked: true
    }
  },
  created() {
  },
  activated() {
  },
  mounted() {
    const id = this.$route.query.id
    if (id) {
      this.materialDemandPlanRestDetail(id)
      this.getBatch(id)
      this.wfHistoryList(id)
    }
  },
  methods: {
    async getBatch(id) {
      const res = await listPc(id)
      this.dataPc = res.data
    },
    wfHistoryList(id) {
      wfHistoryList(id).then(({ data }) => {
        this.recordList = data.recordList
        this.historyData = data.recordList[data.recordList.length - 1];
      })
    },
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
.requirement-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

  .detail-title-text {
    padding: 0 12px;

    p {
      &:nth-child(1) {
        font-size: 11px;
        color: #1159cc;
        padding-bottom: 5px;
      }

      &:nth-child(2) {
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }

  .detail-ul-text {
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;

    .detail-ul {
      padding: 10px 12px;
    }
  }

  .detail-ul-bottom-text {
    padding-bottom: 10px;

    .detail-ul {
      padding: 0 22px;

      .detail-ul-bottom-text-span,
      img {
        vertical-align: middle;
      }

      .detail-ul-bottom-text-log {
        width: 13px;
        height: 14px;
      }
    }
  }

  .detail-base-info-edited {
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 0;
    display: flex;
    flex-direction: column;

    .detail-title-content {
      padding-left: 5px;
      padding-right: 5px;
      margin-top: 5px;
      margin-bottom: 5px;

      img {
        width: 26px;
        height: 26px;
      }

      span {
        line-height: 26px;
        margin-left: 0;
        font-size: 13px;
      }
    }

    .detail-list-ul {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 8px;
      border-radius: 5px;
      padding-left: 17px;
      padding-right: 12px;
      background: #f0f2f6;
    }

    .detail-ul {
      padding-left: 16px;
      padding-right: 30px;
      border-top: 0.5px solid #e3e3e3;

      .detail-ul-p {
        display: flex;
        align-items: center;

        & :nth-child(1) {
          margin-right: 3px;
        }

        & :nth-child(2) {
          margin-right: 3px;
        }
      }
    }

    .detail-base-info-edited-div {
      justify-content: space-between;

      .detail-base-info-edited-img {
        display: flex;
        align-items: center;
      }
    }
  }

  .detail-ul-bottom-text-Arrow {
    width: 14px !important;
    height: 14px !important;
  }

  .select-materials-sticky {
    ::v-deep .van-sticky {
      background: #f2f4f8;
    }
  }

  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      padding-left: 13px;

      .van-checkbox {
        height: 100%;
        margin-left: 2px;

        ::v-deep .van-checkbox__icon {
          font-size: 18px;

          .van-icon {
            border: 1px solid #1989fa;
          }
        }
      }
    }
  }

  .van-search {
    width: 222px;

    .van-search__content {
      border-radius: 50px;
      background: #fff;
    }

    .van-cell {
      border-radius: 50px;
      background: #fff;
    }
  }

  .select-materials-search-switch {
    display: flex;
    align-items: center;
    padding-right: 15px;

    span {
      margin-left: 5px;
      font-size: 12px;
    }

    .van-switch {
      width: 34px;
      height: 18px;
      font-size: inherit;

      ::v-deep .van-switch__node {
        width: 18px;
        height: 18px;
      }
    }
  }
}

.select-materials-select {
  font-size: 12px;
}

.van-tabs {
  padding-bottom: 62px;
}

.detail-title-content {
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