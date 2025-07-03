<template>
    <div :class="['default-container',type == '0'?'detail-button-container':'']">
        <div class="box-container">
            <div>
                <ul class="detail-ul">
                    <li>
                        <span>需求名称：</span>
                        <span>{{detailInfo.planName}}</span>
                    </li>
                    <li>
                        <span>标段名称:</span>
                        <span>{{detailInfo.sectionName}}</span>
                    </li>
                    <li>
                        <span>填报组织：</span>
                        <span>{{detailInfo.deptName}}</span>
                    </li>
                    <li>
                        <span>填报人：</span>
                        <span>{{detailInfo.createUserName}}</span>
                    </li>
                    <li>
                        <span>填报时间：</span>
                        <span>{{parseTime(detailInfo.createDate,'{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <van-tabs 
            sticky
            v-model="menuActiveIndex" 
            color="#0571ff"
            background="#eef6ff"
            title-active-color="#0571ff"
            title-inactive-color="#2e2e2e">
            <van-tab title="物资明细">
                <div class="box-container" v-for="(item,index) in detailList" :key="index">
                    <div>
                        <ul class="detail-ul">
                            <li>
                                <span>供应商：</span>
                                <span>{{item.sellerName}}</span>
                            </li>
                            <li>
                                <span>物资名称：</span>
                                <span>{{item.materialName}}</span>
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
                            <li>
                                <span>备注：</span>
                                <span>{{item.remark}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </van-tab>
            <van-tab title="查看流程">
                <van-list 
                    v-model="loading" 
                    :finished="finished" 
                    finished-text="没有更多了..." 
                    @load="getProcessList">

                    <div v-for="(item,index) in processList" :key="index" class="box-container">
                        <ul class="list-ul">
                            <li>
                                <span class="font-weight">节点：</span>
                                <span class="font-weight">{{item.actName}}</span>
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
        </van-tabs>
        <div class="default-button-container" v-if="type == 0">
            <van-button class="button-info" block type="info" round @click="handleReject()">驳回</van-button>
            <van-button class="button-info" block type="info" round @click="handleEditAdopt()">修改后通过</van-button>
            <van-button class="button-info" block type="info" round @click="handleAdopt()">通过</van-button>
        </div>
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
    </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import eventBus from '@/utils/eventBus.js'
import { materialDemandPlanRestDetail,auditReject,wfNextAssignee,auditApprove,wfHistoryList } from '@/api/myToDoList'

export default {
    name: 'DemandPlanningExamine',
    mixins: [keepPages],
    components: {},

    data () {
        return {
            menuActiveIndex: 0,
            //审核状态
            type: '',   //0 未审核 1 已审核
            //列表条目信息
            listObj:{},
            //详情信息
            detailInfo:{},
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
        }
    },
    created() {
        this.listObj = JSON.parse(this.$route.params.obj);
        this.type = this.$route.params.type;
        
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
    },
    activated() {
       
    },
    methods: {
        //获取审批详情
        getDetail(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            materialDemandPlanRestDetail(this.listObj.businessId).then(({data}) => {
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
                    this.approvalRequest();
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
        },
        //选择审核人提交
        handleAssigneeSubmit(){
            this.approvalRequest();
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
    },
}
</script>
<style lang="less" scoped>
.default-container {
    padding-top: 10px;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
}
.detail-button-container {
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
}
::v-deep .van-tabs {
    flex: 1;
    overflow-y: auto
}
::v-deep .van-tabs__content {
    height: calc(100% - 56px);
    overflow-y: auto;
}
</style>