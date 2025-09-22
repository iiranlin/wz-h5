<template>
    <div :class="['default-container', 'default-container-scroll',type == '0'?'detail-button-container':'']">
        <div class="detail-base-info">
            <div class="detail-title-text">
                <p>需求名称：</p>
                <p>{{ detailInfo.planName }}</p>
            </div>
            <div class="detail-ul-text">
                <ul class="detail-ul">
                    <li>
                        <span>标段名称:</span>
                        <span>{{detailInfo.sectionName}}</span>
                    </li>
                    <li>
                        <span>需求组织：</span>
                        <span>{{detailInfo.deptName}}</span>
                    </li>
                    <li>
                        <span>填报人：</span>
                        <span>{{detailInfo.createUserName}}</span>
                    </li>
                    <li>
                        <span>填报时间：</span>
                        <span>{{detailInfo.createDate && parseTime(detailInfo.createDate,'{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                    </li>
                </ul>
            </div>
            <div class="detail-ul-bottom-text">
              <ul class="detail-ul">
                <li>
                  <span>物资项目：<span class="li-span-click">{{ detailInfo.demandPlanDetailsGyDTOList.length }}</span> 项</span>
                  <span @click="handleLogClick(detailInfo)"><img class="detail-ul-bottom-text-log" src="@/assets/img/Icon-log.png" /> <span
                      class="detail-ul-bottom-text-span">查看日志</span> <img class="detail-ul-bottom-text-Arrow"
                      src="@/assets/img/Arrow-R.png" /></span>
                </li>
              </ul>
            </div>
        </div>
        <div class="detail-base-info detail-base-info-edited" v-if="detailInfo.fileList[0]?.fileList.length">
          <div class="detail-title-content">
            <img src="/static/icon-file.png" />
            <span>附件</span>
          </div>
          <file-download-view :fileList="detailInfo.fileList[0]?.fileList || []"></file-download-view>
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
          <div class="detail-title-content detail-base-info-edited-div" @click="handleProcessClick(detailInfo)">
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
                <img v-if="historyData.status == '2' || historyData.actId=='root'" src="@/assets/img/Icon-state-yes.png" alt="">
                <img v-if="historyData.status == '3'" src="@/assets/img/Icon-state-no.png" alt="">
                <img v-if="historyData.status == '6'" src="@/assets/img/Icon-state-goback.png" alt="">
                <img v-if="historyData.status == '' && historyData.actId!='root'" src="@/assets/img/Icon-state-waiting.png" alt="">
                <span>{{ historyData.assigneeName }}</span>
                <span v-if="historyData.status == '2'" style="color:rgba(19, 77, 170, 1);font-weight: 600">通过</span>
                <span v-if="historyData.status == '3'"  style="color:rgba(244, 160, 47, 1);font-weight: 600">驳回</span>
                <span v-if="historyData.status == '6'" style="color:rgba(19, 77, 170, 1);font-weight: 600">撤销审核</span>
                <span v-if="historyData.status == '' && historyData.actId=='root'"  style="color:rgba(19, 77, 170, 1);font-weight: 600">发起</span>
                <span v-if="historyData.status == '' && historyData.actId!='root'"  style="color:rgba(21, 27, 62, 0.5);font-weight: 400">未审批</span>
              </p>
              <span>{{ historyData.endTime?historyData.endTime.substr(0, 10):"" }}</span>
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
            <div class="select-materials-search-switch" v-if="['6', '7', '8', '9'].includes(detailInfo.planStatus)">
              <van-switch v-model="searchChecked" /><span>显示供应概览</span>
            </div>
          </div>
        </van-sticky>
        <material-details :list="filteredList" :planStatus="detailInfo.planStatus" :searchChecked="searchChecked"></material-details>
        <!-- <van-tabs
            sticky
            v-model="menuActiveIndex"
            color="#0571ff"
            title-active-color="#0571ff"
            title-inactive-color="#2e2e2e">
            <van-tab title="物资明细">
                <div class="box-container" v-for="(item,index) in detailList" :key="index">
                    <div class="detail-list-title-content">
                        <span>物资名称：</span>
                        <span>{{item.materialName}}</span>
                    </div>
                    <ul class="detail-list-ul">
                        <li>
                            <span>供应商：</span>
                            <span>{{item.sellerName}}</span>
                        </li>
                        <li>
                            <span>规格型号：</span>
                            <span>{{item.specModel}}</span>
                        </li>
                        <li>
                            <span>计量单位：</span>
                            <span>{{item.unit}}</span>
                        </li>
                        <li>
                            <span>合同数量：</span>
                            <span>{{item.amount}}</span>
                        </li>
                        <li class="li-item-overlength">
                            <span>累计计划量（含本次）：</span>
                            <span>{{item.cumulativeAmount}}</span>
                        </li>
                        <li class="li-item-overlength">
                            <span>本次计划量：</span>
                            <span>{{item.planAmount}}</span>
                        </li>
                        <li>
                            <span>供应时间：</span>
                            <span>{{parseTime(item.supplyDate,'{y}-{m}-{d}')}}</span>
                        </li>
                        <li>
                            <span>使用地点：</span>
                            <span>{{item.addr}}</span>
                        </li>
                        <li>
                            <span>收货地址：</span>
                            <span>{{item.field2}}</span>
                        </li>
                        <li class="li-item-overlength">
                            <span>收货人及联系方式：</span>
                            <span>{{item.receiver}}</span>
                        </li>
                        <li>
                            <span>投资方：</span>
                            <span>{{item.field0}}</span>
                        </li>
                        <li>
                            <span>投资比例：</span>
                            <span>{{item.field1}}</span>
                        </li>
                        <li class="li-item-remark">
                            <span>备注：</span>
                            <div class="remark-detail">{{item.remark || '未填写'}}</div>
                        </li>
                    </ul>
                </div>
            </van-tab>
            <van-tab title="查看流程">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了..."
                    @load="getProcessList">

                    <div v-for="(item,index) in processList" :key="index" class="box-container">
                        <ul class="detail-list-ul">
                            <li>
                                <span>节点：</span>
                                <span>{{item.actName}}</span>
                            </li>
                            <li>
                                <span>单位：</span>
                                <span>{{item.orgName}}</span>
                            </li>
                            <li>
                                <span>操作人：</span>
                                <span>{{item.assigneeName}}</span>
                            </li>
                            <li>
                                <span>操作时间：</span>
                                <span>{{item.endTime}}</span>
                            </li>
                            <li class="li-status">
                                <span>状态：</span>
                                <span class="font-weight" style="color:#158aff" v-if="item.status == '2'">通过</span>
                                <span class="font-weight" style="color:#ee0a24" v-if="item.status == '3'">驳回</span>
                            </li>
                            <li>
                                <span>意见：</span>
                                <span>{{item.message}}</span>
                            </li>
                        </ul>
                    </div>
                </van-list>
            </van-tab>
        </van-tabs> -->
        <div class="default-button-container default-button-container-box" v-if="type == 0">
            <div class="default-button-container-div">
              <p @click="handleReject()"><img src="@/assets/img/Icon-detailInfo.png" alt=""><span>驳回</span></p>
              <p v-if="showEditAdop" @click="handleEditAdopt()"><img src="@/assets/img/Icon-modify-after.png" alt=""><span>修改后通过</span></p>
            </div>
            <!-- <van-button class="button-info" block type="info" round @click="handleReject()">驳回</van-button>
            <van-button class="button-info" block type="info" round @click="handleEditAdopt()">修改后通过</van-button> -->
            <van-button class="button-info button-info-container" block type="info" round @click="handleAdopt()">通过</van-button>
        </div>
        <!-- <div class="default-button-container" v-if="listObj.nameType == 'handle'">
          <van-button class="button-info button-info-container" round type="info" @click.stop="handleClick(listObj)">处理</van-button>
        </div> -->
        <!--选择审批人弹框-->
        <van-popup v-model="assigneePopupShow" round :close-on-click-overlay="false">
            <div class="assignee-popup">
                <span>提示</span>
                <van-cell :title="assigner" required is-link center @click="handleAssigneePopupClick()"/>
                <div class="default-button-container">
                    <van-button class="button-info" plain block type="info" round @click="handleAssigneeCancel()">取消</van-button>
                    <van-button class="button-info" block type="info" round @click="handleAssigneeSubmit()">提交</van-button>
                </div>
            </div>
        </van-popup>
        <back-to-top className=".default-container-scroll"></back-to-top>
    </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import keepPages from '@/view/mixins/keepPages'
import eventBus from '@/utils/eventBus.js'
import { materialDemandPlanRestDetail,auditReject,wfNextAssignee,auditApprove,auditEditApprove,wfHistoryList } from '@/api/myToDoList'
import { materialDemandPlanRestDetailGyMx } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { listPc } from '@/api/prodmgr-inv/materialCirculationTableRest'
import MaterialDetails from '@/view/PlannedManagement/PlannedManagementChild/components/MaterialDetails'
import FileDownloadView from "@/components/FileDownloadView.vue";
import { mergeByActId } from '@/utils/index.js'

export default {
    name: 'DemandPlanningExamine',
    mixins: [keepPages],
    components: {BackToTop, MaterialDetails, FileDownloadView},

    data () {
        return {
            menuActiveIndex: 0,
            //审核状态
            type: '',   //0 未审核 1 已审核
            //列表条目信息
            listObj:{},
            //详情信息
            detailInfo:{demandPlanDetailsGyDTOList: [], fileList: []},
            //明细信息
            detailList:[],
            //是否显示选择审批人弹框
            assigneePopupShow:false,
            //审批人数据
            assigneeList:[],
            //审核参数
            candidateUser:[],
            //审批人
            assigner: '请选择下一级审核人',
            //审批意见
            opinion: '',

            //流程数据
            processList:[],
            loading:false,
            finished:false,
            dataPc: [],
            recordList: [],
            historyData: {},
            searchValue: '',
            showAction: false,
            searchChecked: true,
            showEditAdop: true,
        }
    },
    computed: {
      filteredList() {
        if (!this.searchValue) return this.detailInfo.demandPlanDetailsGyDTOList; // 如果搜索值为空，返回所有数据
        return this.detailInfo.demandPlanDetailsGyDTOList.filter(item => item.specModel.includes(this.searchValue) ||
          item.materialName.includes(this.searchValue) ||
          item.unit.includes(this.searchValue) ||
          item.receiver.includes(this.searchValue)
        ); // 过滤匹配的数据项
      }
    },
    created() {
        this.listObj = JSON.parse(this.$route.params.obj);
        this.type = this.$route.params.type;
        // ⼊库流程、收货流程不能操作修改后同意
        this.showEditAdop = !["RKLC", "SHLC","FHLC"].includes(this.listObj.businessType)

        //审核意见回调
        eventBus.$off('examineOpinionEdit');
        eventBus.$on('examineOpinionEdit',function(opinion,type){
            this.examineOpinionEdit(opinion,type);
        }.bind(this));

        //选择审核人回调
        eventBus.$off('approverChoiceCallBack');
        eventBus.$on('approverChoiceCallBack',function(item){
            this.approverChoiceCallBack(item);
        }.bind(this));

        this.getDetail();
        this.getBatch()
        this.wfHistoryList()
    },
    activated() {

    },
    methods: {
        async getBatch() {
          const res = await listPc(this.listObj.businessId)
          this.dataPc = res.data
        },
        wfHistoryList() {
          wfHistoryList(this.listObj.businessId).then(({ data }) => {
            if(data.recordList.length){
              this.recordList = mergeByActId(data.recordList || []);
              this.historyData = mergeByActId(data.recordList)[0]
            }
          })
        },
        //获取审批详情
        getDetail(){
            const params = { pageNum: 1, pageSize: -1, id: this.listObj.businessId }
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            console.log("params", params)
            materialDemandPlanRestDetailGyMx(params).then(({data}) => {
                this.detailInfo = data;
                this.detailList = data.details;
            }).catch((err) => {

            }).finally(() => {
                toast.clear();
            })
        },
        //获取流程信息
        getProcessList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            wfHistoryList(this.listObj.businessId).then(({ data }) => {
                this.processList = data.recordList;
                this.loading = false;
                this.finished = true;
            }).catch((error) => {
                this.loading = false;
                this.finished = true;
            }).finally(() => {
                toast.clear();
            });
        },
        //不同意
        handleReject(){
            this.$router.push({
                name: "ExamineOpinionEdit",
                params: {
                    type: 'reject'
                },
            });
        },
        //修改后同意
        handleEditAdopt(){
            this.$router.push({
                name: "ExamineOpinionEdit",
                params: {
                    type: 'editAdopt'
                },
            });
        },
        //同意
        handleAdopt(){
            this.$router.push({
                name: "ExamineOpinionEdit",
                params: {
                    type: 'adopt'
                },
            });
        },
        //审核意见回调
        examineOpinionEdit(opinion,type){
            this.opinion = opinion;
            this.type = type
            if(type == 'reject'){
                this.rejectRequest();
            }else if(type == 'editAdopt'){
                this.getNextAssignee();
            }else if(type == 'adopt'){
                this.getNextAssignee();
            }
        },
        //获取下一级审批人
        getNextAssignee(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            wfNextAssignee(this.listObj.taskId).then(({ data }) => {
                if(data && data.length > 0){
                    this.assigneeList = data;
                    this.assigneePopupShow = true;
                }else{
                  if(this.type=='editAdopt'){
                    this.approvalEditRequest()
                  }else{
                    this.approvalRequest();
                  }

                }
            }).catch((error) => {

            }).finally(() => {
                toast.clear();
            });
        },
        //选择下一级审核人弹框点击
        handleAssigneePopupClick(){
            this.$router.push({
                name: "ApproverChoice",
                params: {
                    obj: JSON.stringify(this.assigneeList),
                },
            });
        },
        //选择审核人回调
        approverChoiceCallBack(item){
            this.assigner = item.nickName;
            this.candidateUser.push(item.id);
        },
        //选择审核人取消
        handleAssigneeCancel(){
            this.assigneePopupShow = false;
            this.assigner = '请选择下一级审核人';
            this.candidateUser = [];
            this.type = 0; // 恢复为未审核状态，底部按钮重新显示
        },
        //选择审核人提交
        handleAssigneeSubmit(){
            if (!this.candidateUser.length) {
                this.$toast('请选择下一级审核人');
                return;
            }
            if(this.type=='editAdopt'){
              this.approvalEditRequest()
            }else{
              this.approvalRequest();
            }
        },
        //通过请求
        approvalRequest(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                businessId: this.listObj.businessId,
                businessType: this.listObj.businessType,
                candidateUsers: this.candidateUser,
                message: this.opinion,
                procInstId: this.listObj.procInstId,
                taskId: this.listObj.taskId
            }
            auditApprove(params).then(({ message }) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.$router.back();
            }).catch((error) => {

            }).finally(() => {
                toast.clear();
            });
        },
        approvalEditRequest(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                businessId: this.listObj.businessId,
                businessType: this.listObj.businessType,
                candidateUsers: this.candidateUser,
                message: this.opinion,
                procInstId: this.listObj.procInstId,
                taskId: this.listObj.taskId,
                modifyIds: this.listObj.businessId?[this.listObj.businessId]:[]
            }
            auditEditApprove(params).then(({ message }) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.$router.back();
            }).catch((error) => {

            }).finally(() => {
                toast.clear();
            });
        },
        //驳回请求
        rejectRequest(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                businessId: this.listObj.businessId,
                businessType: this.listObj.businessType,
                candidateUsers: this.candidateUser,
                message: this.opinion,
                procInstId: this.listObj.procInstId,
                taskId: this.listObj.taskId
            }
            auditReject(params).then(({ message }) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.$router.back();
            }).catch((error) => {

            }).finally(() => {
                toast.clear();
            });
        },
        handleLogClick(item) {
          this.$router.push({name: "viewLog", params: {logId: item.id}})
        },
        //查看流程点击
        handleProcessClick(item) {
          this.$router.push({ name: "MyProcess", params: { businessId: item.id } })
        },
        logisticsClick(item) {
          this.$router.push({ name: 'LogisticsView', query: { id: this.detailInfo.id, shipmentBatchNumber: item.shipmentBatchNumber } })
        },
        //处理点击
        handleClick(item){
            this.$router.push({
                name: "SaveMaterials",
                query: {
                    id: item.businessId,
                    type: 'update',
                },
            });
        }
    },
}
</script>
<style lang="less" scoped>
.box-container {
    padding: 0px;
}
.default-container {
    display: flex;
    flex-direction: column;
}
.detail-button-container {
    display: flex;
    flex-direction: column;
}
.button-info {
    width: 106px !important;
}
.detail-base-info {
    border-bottom: 1px solid #e3e3e3;
}
::v-deep .van-tabs {
    flex: 1;
    overflow-y: auto
}
::v-deep .van-tabs__content {
    height: calc(100% - 56px);
    overflow-y: auto;
}
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

.default-button-container{
  .button-info-container{
    width: 169px !important;
  }
}

.default-button-container-box{
  justify-content: space-between;
  .default-button-container-div{
    display: flex;
    p{
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 10px;
      width: 80px;
      &:nth-child(1){
        border-right: 0.5px solid #f1f1f1;
      }
      img{
        width: 24px;
        height: 24px;
      }
    }
  }
  .button-info-container{
    width: 169px !important;
    margin-right: 12px;
  }
}
</style>