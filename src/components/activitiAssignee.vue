<template>
  <!--选择审批人弹框-->
  <van-popup v-model="assigneePopupShow" round :close-on-click-overlay="false">
    <div class="assignee-popup">
      <span>提示</span>
      <van-cell :title="assigner" required is-link center @click="handleAssigneePopupClick()" />
      <div class="default-button-container">
        <van-button class="button-info" plain block type="info" round @click="handleAssigneeCancel()">取消</van-button>
        <van-button class="button-info" block type="info" round @click="handleAssigneeSubmit()">提交</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { commitNextAssignee } from '@/api/workflow/wf'
export default {
  props: {
    multiple: {
      type: Boolean,
    }
  },
  data() {
    return {
      //是否显示选择审批人弹框
      assigneePopupShow: false,
      //审批人
      assigner: '请选择下一级审核人',
      assigneeList: [],
      listObj: {
        code: null
      }
    }
  },
  methods: {
    async init(businessType) {
      const res = await commitNextAssignee({businessType})
      if(res.data.length > 1){
        this.assigneePopupShow = true
        this.listObj.code = null
        this.assigneeList = res.data
      } else {
        let assignee = ''
        if (res.data[0]) {
          assignee = res.data[0].id
        }
        this.$emit('optionsSuccess', assignee)
      }
    },
    //选择下一级审核人弹框点击
    handleAssigneePopupClick() {
      this.$router.push({
        name: "ApproverChoice",
        params: {
          obj: JSON.stringify(this.assigneeList),
        },
      });
    },
    //选择审核人取消
    handleAssigneeCancel() {
      this.assigneePopupShow = false;
      this.assigner = '请选择下一级审核人';
      this.candidateUser = [];
    },
    //选择审核人提交
    handleAssigneeSubmit() {
      this.approvalRequest();
    },
    //通过请求
    approvalRequest() {
      this.$emit('optionsSuccess', this.listObj.code)
    },
    titleAssigner (assigner) {
      this.assigneePopupShow = true
      this.assigner = assigner
    }
  }
};
</script>