<template>
  <div class="requirement-details" :class="[(isView||tabs)?'default-container1':'default-container','default-scroll']">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ dataList.planName }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>建设项目：</span>
            <span>{{ dataList.projectName }}</span>
          </li>
          <li>
            <span>标段项目：</span>
            <span>{{ dataList.sectionName }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ dataList.deptName }}</span>
          </li>
          <li v-if="isLable">
            <span>操作人：</span>
            <span>{{dataList.createUserName}}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="filterList(dataList.fileByList, 'fhd')?.length > 0">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>发货单附件</span>
      </div>
      <file-download-view :fileList="filterList(dataList.fileByList, 'fhd') || []" />
    </div>
    <div class="detail-base-info detail-base-info-edited" v-if="filterList(dataList.fileByList, 'zczp')?.length > 0">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>装车照片</span>
      </div>
      <file-download-view :fileList="filterList(dataList.fileByList, 'zczp') || []" />
    </div>

        <div class="detail-base-info detail-base-info-edited" v-if="dataPc.length">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-logistics.png" />
        <span>物流信息</span>
      </div>
      <ul class="detail-list-ul" style="background: #f0f2f6;margin-bottom: 8px; margin-left: 5px; margin-right: 5px; border-radius: 5px;" v-for="(item, index) in dataPc" :key="index" @click="logisticsClick(item)">
        <li>
          <span>发货批次{{ index + 1 }}</span>
          <span><img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Arrow-R.png" /></span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="!isView">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-time.png" />
        <span>收货时间</span>
      </div>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <van-field readonly clickable required name="calendar" :value="dataList.takeDate" label="收货时间："
            placeholder="点击选择日期" @click="showDatePicker = true" />
          <van-calendar v-model="showDatePicker" @confirm="onDateConfirm" />
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-else>
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-time.png" />
        <span>收货时间</span>
      </div>
        <ul class="detail-info-ul">
        <li>
          <span>收货时间：</span>
          <span>{{dataList.takeDate}}</span>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="!isView">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>自检单</span>
      </div>
      <p class="box-container-p" v-if="!fileZjdList?.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持PDF格式</p>
      <file-upload-view :fileList="fileZjdList" businessType="01" />
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="!isView">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>其他资料</span>
      </div>
      <p class="box-container-p" v-if="!fileQtzlList?.length">非必填，请选择文件上传，支持PDF格式</p>
      <file-upload-view :fileList="fileQtzlList" businessType="01" />
    </div>

    <div class="detail-base-info detail-base-info-edited"
      v-if="isView && filterList(dataList.fileByList, 'zjd')?.length > 0">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>自检单</span>
      </div>
      <file-download-view class="outbound-field-uploader" :fileList="filterList(dataList.fileByList, 'zjd') || []" />
    </div>

    <div class="detail-base-info detail-base-info-edited"
      v-if="isView && filterList(dataList.fileByList, 'qtzl')?.length > 0">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>其他资料</span>
      </div>
      <file-download-view class="outbound-field-uploader" :fileList="filterList(dataList.fileByList, 'qtzl') || []" />
    </div>

    <div v-if="!isView" class="detail-floor-content">
      <div>
        <van-button type="default" :class="{ 'van-button-selected': btnClickIndex == '0' }"
          @click="btnClick('0')">全部物资</van-button>
        <van-button type="default" :class="{ 'van-button-selected': btnClickIndex == '1' }"
          @click="btnClick('1')">未完善物资</van-button>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="isView" style="margin-bottom: 8px;background-color: #F2F4F8;">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-batch.png" />
        <span>物资明细</span>
        <span style="text-align: right;">共 <span style="color: #134DAA;">{{ materiaList.length }}</span> 项</span>
      </div>
    </div>

    <div class="box-container" v-for="(item, index) in btnClickIndex == '0' ? materiaList : editMateriaList"
      :key="item.id"
      :class="boolExceptZero(item.putTotal) && boolExceptZero(item.refundTotal) ? '' : 'box-container-unedited'">
      <div class="div-child">
        <ul class="detail-list-ul">
          <li class="detail-list-ul-text">
            <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
            <img v-if="!isView" :src="boolExceptZero(item.putTotal) && boolExceptZero(item.refundTotal) ? editedStatus : editStatus" />
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <!-- <li>
            <span>计量单位：</span>
            <span>{{ item.unit }}</span>
          </li>
          <li>
            <span>包装形式：</span>
            <span>{{ item.packagingFm }}</span>
          </li>
          <li>
            <span>需求数量：</span>
            <span class="li-span-click">{{ item.planAmount }}</span>
          </li> -->
          <li class="li-item-overlength">
            <span>有效期截止日期：</span>
            <span>{{ item.expirationDate }}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次发货数量：</span>
            <span class="li-span-click">{{ item.sendTotal }}</span>
          </li>
          <li>
            <span>实收数量：</span>
            <span class="li-span-click">{{ item.putTotal }}</span>
          </li>
          <li>
            <span>退货数量：</span>
            <span style="color: #e4393c;">{{ item.refundTotal }}</span>
          </li>
          <!-- <li >
                      <span>生产日期：</span>
                      <span>{{ item.manufactureDate |formatToDate }}</span>
                    </li>
                    <li >
                      <span >使用地点：</span>
                      <span>{{ item.addr }}</span>
                    </li>
                    <li >
                      <span>收货地址：</span>
                      <span>{{ item.field2 }}</span>
                    </li>
                    <li >
                      <span>供应时间：</span>
                      <span>{{ item.supplyDate |formatToDate}}</span>
                    </li>
                    <li class="li-item-overlength" >
                      <span>收货人及联系方式：</span>
                      <span>{{ item.receiver }}</span>
                    </li>
                    <li >
                      <span>投资方：</span>
                      <span>{{ item.field0 }}</span>
                    </li>
                    <li >
                      <span>投资比例：</span>
                      <span>{{ item.field1 }}</span>
                    </li>

                    <li class="li-item-remark" >
                      <span>备注：</span>
                      <div class="remark-detail">{{item.remark || '未填写'}}</div>
                    </li> -->
        </ul>
      </div>
      <div class="list-ul-button">
        <van-button v-if="!isView" class="button-info" plain round type="info" native-type="button"
          @click="editedClick(item, index)">{{ boolExceptZero(item.putTotal) && boolExceptZero(item.refundTotal) ? '编辑'
          : '处理' }} </van-button>
        <van-button v-if="isView" class="button-info" plain round type="info" native-type="button"
          @click="editedClick(item, index)">查看</van-button>
      </div>
    </div>

    <div class="default-button-container" v-if="!isView">
      <div class="default-button-container-selected">
        <span>已填写 <span class="li-span-click">{{ editedMateriaList.length }}</span><span>/{{ materiaList.length
            }}</span>
        </span>
      </div>
      <div class="default-button-container-button" v-if="!isView">

        <van-button v-if="isFlag" class="button-info" round type="info" @click="addClick">提交收货审核</van-button>

        <p style="font-size: 12px;" v-else><van-icon name="warning-o" color="#1989fa" /> 提示： <span>请完善所有物资收货信息</span>
        </p>
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
    <!-- <div class="default-button-container" v-if="!tabs">
      <div class="default-button-container-selected">
        <span>已填写 <span class="li-span-click">{{ editedMateriaList.length }}</span><span>/{{ materiaList.length
            }}</span>
        </span>
      </div>

      <div class="default-button-container-button" v-if="!tabs">

        <van-button v-if="isFlag" class="button-info" round type="info" @click="checkClick">初验收货</van-button>

        <p style="font-size: 12px;" v-else><van-icon name="warning-o" color="#1989fa" /> 提示： <span>请完善所有物资收货信息</span>
        </p>
      </div>
    </div> -->

    <file-preview ref="filePreview"></file-preview>

    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>

    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import {parseTime} from '@/utils'
import editedStatus from '@/assets/img/editedStatus.png'
import editStatus from '@/assets/img/editStatus.png'
import BackToTop from '@/components/BackToTop'
import indexMixin from '@/view/mixins'
import keepPages from "@/view/mixins/keepPages";
import {saveTake,defaultTake, detailTakeBack} from '@/api/prodmgr-inv/AcceptanceReturn'
import { listPc } from '@/api/prodmgr-inv/materialCirculationTableRest'
import FilePreview from "@/components/FilePreview.vue";
import FileUploadView from "@/components/FileUploadView.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import activitiAssignee from '@/components/activitiAssignee'
import { submitTodo } from "@/api/prodmgr-inv/receive"
import { materialDemandPlanRestDetail,auditReject,wfNextAssignee,auditApprove,wfHistoryList } from '@/api/myToDoList'
import eventBus from '@/utils/eventBus.js'

export default {
  name: 'DoAccept',
  mixins: [indexMixin,keepPages],
  components: { FilePreview,FileUploadView ,FileDownloadView,BackToTop, activitiAssignee},
  props: {
    isView: {
      type: Boolean,
      default: false
    }
  },
  activated() {
    this.getDetailList();
  },
  computed: {
    isFlag() {
      const { takeDate } = this.dataList;

      let flag = false;

      this.materiaList.forEach(item => {
        if (this.boolExceptZero(item.putTotal) && this.boolExceptZero(item.refundTotal)) {
          flag = true;
        } else {
          flag = false;
        }
      })

      return takeDate && flag;
    },
    takeStatus(){
      return this.$route.query?.takeStatus ;
    },
  },
  data() {
    return {
      dataPc: [],
      minDate: new Date(),
      formData: {
        name: '',
        password: '',
        currentDate: '',
        num1: '',
        num2: '',
        remark: ''
      },
      showDatePicker: false, // 控制日期选择器显示
      id:"",
      tabs:true,  
      isLable:false,
      dataList:[],
      fileTHList:[],
      fileZjdList:[],
      fileQtzlList:[],
      currentTime: new Date() ,// 获取当前时间
      menuActiveIndex: '0',
      btnClickIndex: '0',
      materiaList: [],
      editMateriaList: [],
      editedMateriaList: [],
      editedStatus,
      editStatus,
      backupParams: {},
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
  filters: {
    formatDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }else{
        return ""
      }  
    },
    formatToDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      }else{
        return ""
      }  
    }
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
            this.$router.back();
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
    async getBatch(id) {
      const res = await listPc(id)
      this.dataPc = res.data
    },
    logisticsClick(item) {
      this.$router.push({ name: 'LogisticsView', query: { id: this.dataList.id, shipmentBatchNumber: item.shipmentBatchNumber } })
    },
    boolExceptZero(val) {
      return val === 0 || Boolean(val);
    },
    btnClick(code) {
      this.btnClickIndex = code
    },

    editedClick(item, index) {
      this.$store.dispatch('public/setMateriaData', item)

      this.$store.dispatch('public/setGoodsReceiptInfo', this.dataList)

      this.$router.push({ name: 'EditedMaterialDoAccept', query: {from: this.from, id: this.id, tabs: this.tabs, isLable: this.isLable, isView: this.isView, takeStatus: this.takeStatus}  })
    },
    historyCaches() {
      const data = this.$store.state.public.selectGoodData || []
      
      const finallyData = data.map((item) => Object.assign({}, item, {
        supplyDate: item.supplyDate || parseTime(new Date(), '{y}-{m}-{d}'),
        minDate: this.minDate,
        showDatePicker: this.showDatePicker,
        planAmount: item.planAmount || item.amount - item.cumulativeAmount,
        allocationUniqueNumber: item.uniqueNumber || item.allocationUniqueNumber,
        field2: item.field2 || item.deliveryLocation,
      }))


      this.editedMateriaList = finallyData.filter(item => this.boolExceptZero(item.putTotal) && this.boolExceptZero(item.refundTotal))
      this.editMateriaList = finallyData.filter(item => !(this.boolExceptZero(item.putTotal) && this.boolExceptZero(item.refundTotal)))

      return finallyData
    },
    getDetailList(){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      const getDetailApi = this.takeStatus == 5 || this.takeStatus == void 0 ? detailTakeBack : defaultTake;
       getDetailApi(this.id).then((res)=>{
          if(res.success){
            const GoodsReceiptInfo = this.$store.state.public.goodsReceiptInfo || {};

            if (Object.keys(GoodsReceiptInfo).length > 0) {
              this.dataList = Object.assign({}, this.dataList, GoodsReceiptInfo);
            } else {
              this.dataList = res.data
            }

            const data = this.$store.state.public.selectGoodData?.length > 0 ? this.$store.state.public.selectGoodData : this.dataList.materialCirculationDetailsTableDTOS;

            this.dataList.materialCirculationDetailsTableDTOS = data;

            if (!this.isView) {
              this.dataList.takeDate = parseTime(this.currentTime, '{y}-{m}-{d}')
            } else {
              this.dataList.takeDate = parseTime(this.dataList.takeDate, '{y}-{m}-{d}')
            }

            if(this.isView==false){
              data.forEach(el => {
                if (this.$store.state.public.selectGoodData?.length == 0) {
                  el.putTotal = el.sendTotal
                }
                  el.values = el.values?.length > 0 ? el.values : []
                  this.fileTHList.push({id:el.id,value:[]})
              })  
            }

            this.$store.dispatch('public/setSelectGoodData', data);

            this.materiaList = this.historyCaches();
          }
       }).finally(() => {
          toast.clear();
      });
    },
    handleInput(val,index,item){
      const num = Number(val);
      if (!isNaN(num) && num <= item.sendTotal) {
        this.dataList.materialCirculationDetailsTableDTOS[index].putTotal = num; 
        this.dataList.materialCirculationDetailsTableDTOS[index].refundTotal =this.dataList.materialCirculationDetailsTableDTOS[index].sendTotal - this.dataList.materialCirculationDetailsTableDTOS[index].putTotal
      } else {
        this.$toast('实收数量不能大于发货数量'); 
        this.dataList.materialCirculationDetailsTableDTOS[index].putTotal = 0; 
      }
    },
    handleInput1(val,index,item){
      const num = Number(val);
      if (!isNaN(num) && num <= item.sendTotal) {
        this.dataList.materialCirculationDetailsTableDTOS[index].refundTotal = num; 
        this.dataList.materialCirculationDetailsTableDTOS[index].putTotal = this.dataList.materialCirculationDetailsTableDTOS[index].sendTotal - this.dataList.materialCirculationDetailsTableDTOS[index].refundTotal
      } else {
        this.$toast('退货数量不能大于发货数量'); 
        this.dataList.materialCirculationDetailsTableDTOS[index].refundTotal=0 
      }
    },
    onDateConfirm(val) {
      this.currentTime = val
      this.dataList.takeDate = parseTime(val, '{y}-{m}-{d}')
      this.showDatePicker = false
    },
    addClick() {
      this.dataList.materialCirculationDetailsTableDTOS.forEach(item=>{
        if(item.values?.length) {
          let byList=this.dataList.materialCirculationDetailsTableDTOS.find(el=>el.id == item.id).fileByList
          let fileObj={
            thfj_sh:item.values
          }
          let newObj=Object.assign({}, JSON.parse(byList),fileObj)
          this.dataList.materialCirculationDetailsTableDTOS.find(el=>el.id == item.id).fileByList =  JSON.stringify(newObj)
        }
      })
      
      if(this.fileZjdList.length){
        let fileObj={
          zjd:this.fileZjdList
        }
        let newObj =Object.assign({}, JSON.parse(this.dataList.fileByList),fileObj) 
        this.dataList.fileByList = JSON.stringify(newObj)
      }

      if(this.fileQtzlList.length){
        let fileObj={
          qtzl:this.fileQtzlList
        }
        let newObj =Object.assign({}, JSON.parse(this.dataList.fileByList),fileObj) 
        this.dataList.fileByList = JSON.stringify(newObj)
      }

      let params= {
        createUserName:this.dataList.createUserName,
        deptName:this.dataList.deptName,
        fileByList:this.dataList.fileByList,
        id:this.dataList.id,
        materialCirculationDetailsTableParamList:this.dataList.materialCirculationDetailsTableDTOS,
        planName:this.dataList.planName,
        sectionName:this.dataList.sectionName,
        sellerName:this.dataList.sellerName,
        shippingDate:this.formatByDate(this.dataList.shippingDate),
        takeDate:new Date(this.currentTime.getTime() + this.currentTime.getTimezoneOffset() * 60000).toISOString()

      }

      if(!params.takeDate){
        this.$notify({
            type: 'warning',
            message: '请选择收货时间!',
          });
        return
      }
      if(!JSON.parse(params.fileByList).zjd){
         this.$notify({
            type: 'warning',
            message: '请上传自检单!',
          });
         return
      }
      this.backupParams = params
      this.handleExamineClick(params)
      
    },
    checkClick(){
      this.$router.push({name: 'DoAccept',query: {id:this.id,tabs:true,isLable:false}})
    },
    formatByDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      }else{
        return ""
      }  
    },
    onClickBack() {
      this.$router.push({path: '/AcceptanceReturn'})
    },
    imgClick({ fileName, filePath }) {
      this.$refs.filePreview.init(fileName, filePath)
    },
    getFile(id){
      return  this.fileTHList.find(item=>item.id == id).value
    },
    //选择审核人回调
    optionsSuccess(assignee, { id, planType }) {
      submitTodo({ id, planType: planType, assignee, ...this.backupParams }).then(() => {
        this.$toast('提交审核成功')
        this.$router.push({path: '/AcceptanceReturn'})  
      })
    },
    //去审核点击
    handleExamineClick(item) {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要提交审核吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs.activitiAssignee.init('SHLC', item)
      })
    },
  },
  created(){
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
    this.from = this.$route.query.from
    this.id = this.$route.query.id
    this.tabs = this.$route.query.tabs==(true||'true') 
    this.isLable =this.$route.query.isLable==(true||'true')
    this.getBatch(this.id)
    this.getDetailList()  
  }
}
</script>
<style lang="less" scoped>
.requirement-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

    .detail-info-ul {
        padding: 5px 16px 5px 16px;

    li {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #151b3e;
        line-height: 26px;

        // & :nth-child(1){
        //     min-width: 70px
        // }
        & :nth-child(2){
            // width: calc(100% - 70px);
            overflow: hidden;
            text-align: right;
            word-break: break-all;
            flex: 1;
        }
    }
    // .li-item-overlength {
    //     & :nth-child(1){
    //         min-width: initial;
    //         white-space: nowrap;
    //     }
    // }
    .li-item-remark {
        display: flex;
        flex-direction: column;
        position: relative;
        margin-bottom: 5px;

        .remark-detail {
            box-sizing: border-box;
            color: #272b31;
            font-size: 13px;
            line-height: 26px;
            background: #f6f6f6;
            border-radius: 3px;
            width: 100%;
            text-align: left;
            padding: 8px 14px;
            word-wrap:break-word;
        }
    }
    .li-item-after::after {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 25%;
        background: #028bff;
        position: absolute;
        left: -15px;
        top: 10px;
    }
    .van-cell {
        padding: 8px 0px;
    }
    .van-cell--required::before {
        left: -15px;
    }
    .li-span-open{
      justify-content: end;
      padding-top: 5px;
      i{
        vertical-align: middle;
      }
    }
  }

  .list-title-content {
    display: flex;
    margin: 0 0 0 5px;
  }

  .li-title-status {
    margin-right: 15px;
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

      .detail-floor-content {
    justify-content: space-between;
    padding: 5px 12px;

    span {
      color: #151b3e;
      font-weight: 400;
    }

    .van-button {
      border-radius: 5px;
      margin-right: 8px;
      height: 30px;
    }

    .van-button-selected {
      span {
        color: #0861db;
      }
    }

    .detail-floor-content-add {
      color: #1189f6;
      padding-right: 2px;
      font-size: 16px;
      vertical-align: middle;
    }
  }

  .detail-ul-text {
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;

    .detail-ul {
      padding: 10px 8px;
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

  .box-container-p{
      font-size: 11px;
      color: #4a4a4a;
      text-align: center;
      margin-top: 22px;
      margin-bottom: 13px;
      span{
        vertical-align: middle;
      }
    }

      .detail-list-ul {
    padding-left: 12px;

    .detail-list-ul-text {
      justify-content: space-between;

      img {
        width: 18px;
        height: 18px;
        flex: none;
        margin-top: 4px;
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
  .default-button-container {
    justify-content: space-between;
    padding-left: 14px;
    padding-right: 19px;
    box-sizing: border-box;
    box-shadow: 4px 0px 5px rgba(32, 30, 74, 0.1);

    .default-button-container-selected {
      font-size: 13px;

      span {
        vertical-align: middle;
      }

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }

      .default-button-container-selected-img {
        transform: rotate(180deg)
      }
    }

    .default-button-container-button{
      display: flex;
      .button-info{
        margin-left: 10px;
      }
    }

    .button-info {
      width: 120px;
      height: 34px;
    }

    ::v-deep .file-add{
      margin: 0;
      padding: 0;
    }
  }
}


.default-container{
  padding-bottom: 10px;
}
.default-container1 {
 padding-bottom: 40px;
}
.box-container {
  padding: 0px;
}


.detail-list-li-input {
  border-top: 1px solid #e3e3e3;

  & :nth-child(2) {
    text-align: center;
  }

  ::v-deep .van-cell__title {
    color: #151b3e;
  }

  .van-cell {
   
    padding-right: 10px;
  }

  .van-stepper {
    border: 1px solid #dbdbdb;
    border-radius: 5px;

    ::v-deep .van-stepper__input {
      background: #fff;
      width: 50px;
    }
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
