<template>
  <div class="default-containerA">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>需求名称：</span>
        <span>{{detailInfo.planName}}</span>
      </div>
      <div>
        <ul class="detail-ul">
          <li>
            <span>需求项目：</span>
            <span>{{detailInfo.sectionName}}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{detailInfo.deptName}}</span>
          </li>
        </ul>
      </div>
    </div>
     <div class="detail-base-info detail-base-info-edited" v-if="fileList.length">
          <div class="detail-title-content">
            <img src="/static/icon-file.png" />
            <span>报检信息</span>
          </div>
          <file-download-view :fileList="fileList"></file-download-view>
        </div>
    <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>物资明细（共{{detailList.length}}项）</span>
    </div>
    <div class="box-container" v-for="(item,index) in detailList" :key="index">
      <div @click="detailsClick(item)">
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
            <span>生产日期：</span>
            <span>{{item.manufactureDate && parseTime(item.manufactureDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li class="li-item-overlength">
            <span>有效截止日期：</span>
            <span>{{item.expirationDate && parseTime(item.expirationDate,'{y}-{m}-{d}')}}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次出库数量：</span>
            <span class="li-span-click">{{item.outTotal}}</span>
          </li>
          <li class="li-item-remark">
            <span>备注：</span>
            <div class="remark-detail">{{item.remark || '未填写'}}</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="default-button-container default-button-container-box" v-if="from === 'WaitExamineList'">
        <div class="default-button-container-div">
          <p @click="handleReject()"><img src="@/assets/img/Icon-detailInfo.png" alt=""><span>驳回</span></p>
        </div>
        <van-button class="button-info button-info-container" block type="info" round @click="handleAdopt()">通过</van-button>
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
    <!-- 附件预览 -->
    <file-preview ref="filePreview"/>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import {detailStoreBack} from '@/api/prodmgr-inv/materialStoreTableRest'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import BackToTop from '@/components/BackToTop'
import { auditReject,wfNextAssignee,auditApprove } from '@/api/myToDoList'
import eventBus from '@/utils/eventBus.js'

export default {
  //入库详情
  name: 'InboundDetails',
  components: {FilePreview,FileDownloadView,BackToTop},

  data() {
    return {
      id: '',
      detailInfo:{},
      detailList:[],
      fileList:[],
      from: "",
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
      // 待审核带过来的审核参数对象定义
      listObj: {},
    }
  },
  created() {
    const { businessType, businessId, businessCode, taskId, procInstId } = this.$route.query
    this.listObj = { businessType, businessId, businessCode, taskId, procInstId }
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
  },
  mounted() {
    this.id = this.$route.query.id
    this.from = this.$route.query.from
    this.getDetail();
  },
  activated() {

  },
  methods: {
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
            this.$router.push({ name: this.from });
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
            this.$router.push({ name: this.from });
        }).catch((error) => {
            
        }).finally(() => {
            toast.clear();
        });
    },
      //审核意见回调
    examineOpinionEdit(opinion,type){
        this.opinion = opinion;
        switch(type){
          case 'reject':
            this.rejectRequest();
          break;
          case 'adopt':
            this.getNextAssignee();
          break;
        }
    },
    //驳回
    handleReject(){
        this.$router.push({
            name: "ExamineOpinionEdit",
            params: {
                type: 'reject'
            },
        });
    },
    //通过
    handleAdopt(){
        this.$router.push({
            name: "ExamineOpinionEdit",
            params: {
                type: 'adopt'
            },
        });
    },
    //获取详情信息
    getDetail(){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      detailStoreBack(this.id).then(({ data }) => {
        this.detailInfo = data;
        this.detailList = data.materialCirculationDetailsTableDTOS;
        this.fileList = JSON.parse(data.fileByList).jcbg;

        // this.fileList = [...this.fileList,...this.fileList]
      }).catch((error) => {

      }).finally(() => {
        toast.clear();
      });
    },
    imgClick() {
      this.$refs.filePreview.init(this.fileList[0].fileName, this.fileList[0].filePath)
    },
    detailsClick (item) {
      console.log(item)
      this.$router.push({name: 'InboundMaterialDetails', query: {id: item.id}, params: item})
    }
  }
}
</script>
<style lang="less" scoped>
.default-containerA {
  padding-bottom: 20px;
}
.box-container {
  padding: 0px;
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