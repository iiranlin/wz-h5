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
            <span>建设项目：</span>
            <span>{{ detail.projectName }}</span>
          </li> 
          <li>
            <span>标段项目：</span>
            <span>{{ detail.sectionShortName }}</span>
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
            <span>物资项目：<span class="li-span-click">{{ detail.demandPlanDetailsGyDTOList.length }}</span> 项</span>
            <span @click="handleLogClick(detail)"><img class="detail-ul-bottom-text-log" src="@/assets/img/Icon-log.png" /> <span
                class="detail-ul-bottom-text-span">查看日志</span> <img class="detail-ul-bottom-text-Arrow"
                src="@/assets/img/Arrow-R.png" /></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-base-info detail-base-info-edited" v-if="detail.fileList[0]?.fileList.length">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>计划附件</span>
      </div>
      <file-download-view :fileList="detail.fileList[0]?.fileList || []"></file-download-view>
    </div>
    <div class="detail-base-info detail-base-info-edited" v-if="dataPc.length">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-logistics.png" />
        <span>物流信息</span>
      </div>
      <ul class="detail-list-ul" v-for="(item, index) in dataPc" :key="index" @click="logisticsClick(item)">
        <li>
          <span>发货批次{{ index + 1 }}</span>
          <span><img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Arrow-R.png" /></span>
        </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited" v-if="recordList.length">
      <div class="detail-title-content detail-base-info-edited-div" @click="handleProcessClick(detail)">
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
            <!-- <img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Icon-state.png"
              v-if="historyData.status == '2'" />
            <img class="detail-ul-bottom-text-Arrow" src="/static/icon-reject.png" v-else /> -->
            <img v-if="historyData.status == '2' || historyData.actId=='root'" src="@/assets/img/Icon-state-yes.png" alt="">
            <img v-if="historyData.status == '3'" src="@/assets/img/Icon-state-no.png" alt="">
            <img v-if="historyData.status == '6'" src="@/assets/img/Icon-state-goback.png" alt="">
            <img v-if="historyData.status == '' && historyData.actId!='root'" src="@/assets/img/Icon-state-waiting.png" alt="">
            <span>{{ historyData.assigneeName }}</span>
            <!-- <span :class="historyData.status == '2' ? 'li-span-click' : 'li-span-orange'">{{ historyData.status ==
          '2' ? '通过' : '驳回' }}</span> -->
            <span v-if="historyData.status == '2'" style="color:rgba(19, 77, 170, 1);font-weight: 600">通过</span>
            <span v-if="historyData.status == '3'"  style="color:rgba(244, 160, 47, 1);font-weight: 600">驳回</span>
            <span v-if="historyData.status == '6'" style="color:rgba(19, 77, 170, 1);font-weight: 600">撤销审核</span>
            <span v-if="historyData.status == '' && historyData.actId=='root'"  style="color:rgba(19, 77, 170, 1);font-weight: 600">发起</span>
            <span v-if="historyData.status == '' && historyData.actId!='root'"  style="color:rgba(21, 27, 62, 0.5);font-weight: 400">未审批</span>
          </p>
          <span>{{ historyData.endTime?historyData.endTime.substr(0, 10):'' }}</span>
        </li>
      </ul>
    </div>
    <van-sticky class="select-materials-sticky">
      <div class="select-materials-search">
        <van-search v-model="searchValue" placeholder="输入关键字搜索" left-icon="none" background="center"
          :show-action="showAction">
          <template slot='right-icon'>
            <van-icon name="search" />
          </template>
        </van-search>
        <div class="select-materials-search-switch" v-if="['6', '7', '8', '9'].includes(detail.planStatus)">
          <van-switch v-model="searchChecked" /><span>显示供应概览</span>
        </div>
      </div>
    </van-sticky>
    <div style="padding-bottom: 55px;">
      <material-details :list="filteredList" :planStatus="detail.planStatus" :searchChecked="searchChecked"></material-details>
    </div>
    <div class="default-button-container" v-if="queryName === 'DemandSupplyManagement' && ['0'].includes(detail.status)">
      <van-button class="button-info" round @click="returnClick(detail)"><img src="@/assets/img/Icon-detailInfo.png"/>退回经办人</van-button>
      <van-button class="button-info" round type="info" @click="submitClick(detail)">提交供应商</van-button>
    </div>
    <div class="default-button-container" v-else-if="['1', '4', '0', '5', '10'].includes(detail.planStatus) && isJL">
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
import { materialDemandPlanRestDetail, materialDemandPlanRestDetailGyMx, materialDemandPlanRestSubmit } from '@/api/prodmgr-inv/materialDemandPlanRest'
import activitiAssignee from '@/components/activitiAssignee'
import { listPc } from '@/api/prodmgr-inv/materialCirculationTableRest'
import { wfHistoryList } from '@/api/myToDoList'
import FileDownloadView from "@/components/FileDownloadView.vue"
import { getUserInfo } from '@/utils/user-info'
import { mergeByActId } from '@/utils/index.js'
export default {
  name: 'RequirementDetails',
  components: { MaterialDetails, LogRecording, activitiAssignee, BackToTop, FileDownloadView },
  data() {
    return {
      menuActiveIndex: '',
      searchValue: '',
      showAction: false,
      detail: {
        demandPlanDetailsGyDTOList: [],
        fileList: []
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
      searchChecked: true,
      userInfo: getUserInfo(),
      queryName: ''
    }
  },
  computed: {
    filteredList() {
      if (!this.searchValue) return this.detail.demandPlanDetailsGyDTOList; // 如果搜索值为空，返回所有数据
      return this.detail.demandPlanDetailsGyDTOList.filter(item => item.specModel.includes(this.searchValue) ||
        item.materialName.includes(this.searchValue) ||
        item.unit.includes(this.searchValue) ||
        item.receiver.includes(this.searchValue)
      ); // 过滤匹配的数据项
    },
    isJL() {
      const deptCode = this.userInfo.deptCode
      return !deptCode.startsWith('JL')
    }
  },
  created() {
  },
  activated() {
  },
  mounted() {
    const {id = null, name = ''} = this.$route.query
    this.queryName = name
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
        if(data.recordList.length){
          this.recordList = mergeByActId(data.recordList)
          this.historyData = mergeByActId(data.recordList)[0];
        }
      })
    },
    async materialDemandPlanRestDetail(id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      const params = { pageNum: 1, pageSize: -1, id }
      // const GyMxData = await materialDemandPlanRestDetailGyMx(params)
      // console.log(GyMxData.data.demandPlanDetailsGyDTOList)
      materialDemandPlanRestDetailGyMx(params).then(({ data }) => {
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
    handleLogClick(item) {
      this.$router.push({name: "viewLog", params: {logId: item.id}})
    },
    //查看流程点击
    handleProcessClick(item) {
      this.$router.push({ name: "MyProcess", params: { businessId: item.id } })
    },
    logisticsClick(item) {
      this.$router.push({ name: 'LogisticsView', query: { id: this.detail.id, shipmentBatchNumber: item.shipmentBatchNumber } })
    },
    submitClick (item) {
      this.$router.push({name: 'SubmitSupplier', query: {id: item.id}})
    },
    returnClick (item) {
      this.$router.push({name: 'ReturnHandledBy', query: {id: item.id}})
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
        img{
          width: 14px;
          height: 14px;
          margin-top: -2px;
        }

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
  .default-button-container{
    .button-info{
      width: 169px;
      img{
        width: 24px;
        height: 24px;
        vertical-align: middle;
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