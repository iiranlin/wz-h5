<template>
  <!--选择审批人弹框-->
  <div class="assignee-list">
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
    <van-popup class="popup-mian" v-model="showInnerPopup" :close-on-click-overlay="false">
      <div class="detail-container">
          <div class="box-container">
              <div class="detail-title-info">
                  <span class="info-title">请选择审批人</span>
              </div>
              <van-list v-model="loading" offset="30" :finished="finished" finished-text="没有更多了...">
                  <div v-for="(item, index) in assigneeList" :key="index" class="item-container" @click="handleItemClick(item)">
                      <span>{{item.nickName}}</span>
                  </div>
              </van-list>
          </div>
      </div>
    </van-popup>
  </div>
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
      loading: false,
      finished: true,
      //是否显示选择审批人弹框
      assigneePopupShow: false,
      showInnerPopup: false,
      //审批人
      assigner: '请选择下一级审核人',
      assigneeList: [],
      listObj: {
        code: null
      },
      selectedValue: null,
      itemData: null
    }
  },
  methods: {
    async init(businessType, item) {
      this.itemData = item
      const res = await commitNextAssignee({ businessType })
      if (res.data.length > 1) {
        this.assigneePopupShow = true
        this.listObj.code = null
        this.assigneeList = res.data
      } else {
        let assigneeCode = ''
        if (res.data[0]) {
          assigneeCode = res.data[0].id
        }
        this.assigneePopupShow = false
        this.$emit('optionsSuccess', assigneeCode, this.itemData)
      }
    },
    //选择下一级审核人弹框点击
    handleAssigneePopupClick() {
      this.showInnerPopup = true
    },
    handleItemClick (item) {
      this.assigner = item.nickName
      this.listObj.code = item.id
      this.showInnerPopup = false
    },
    //选择审核人取消
    handleAssigneeCancel() {
      this.assigneePopupShow = false
      this.assigner = '请选择下一级审核人'
    },
    //选择审核人提交
    handleAssigneeSubmit() {
      this.assigneePopupShow = false
      this.$emit('optionsSuccess', this.listObj.code, this.itemData)
    }
  }
};
</script>
<style lang="less" scoped>
.assignee-list{
  height: 100%;
  width: 100%;
  .popup-mian{
    width: 100%;
    height: 100%;
  }
  .detail-container {
    padding-top: 10px;
  }
  .item-container {
      width: 100%;
      height: 58px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      position: relative;
      background: #ffffff;

      span {
          font-size: 14px;
          color: #2e2e2e;
          margin-left: 10px;
      } 
  }
}
</style>