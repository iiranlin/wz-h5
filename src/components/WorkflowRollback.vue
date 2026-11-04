<template>
  <div class="workflow-rollback" :class="{ 'workflow-rollback-action': action }" @click.stop>
    <button v-if="action" class="rollback-trigger" type="button" :disabled="!task.taskId || submitting || completed" @click="open">
      <van-icon name="revoke" size="24" />
      <span>退回上一步</span>
    </button>
    <van-button v-else class="button-info" plain round type="info" :disabled="!task.taskId || submitting || completed" @click="open">退回上一步</van-button>
    <van-popup v-model="visible" class="rollback-popup" round get-container="body" close-on-popstate :close-on-click-overlay="false">
      <div class="rollback-title">退回上一步</div>
      <div v-if="currentTask.businessCode" class="rollback-code">单据编号：{{ currentTask.businessCode }}</div>
      <div class="rollback-tip">退回后，单据仍处于审核中，由上一步审批人或审批环节重新审核。</div>
      <van-field
        v-model="reason"
        label="退回原因"
        type="textarea"
        placeholder="请输入退回原因"
        maxlength="200"
        rows="3"
        required
        show-word-limit
        :disabled="submitting"
      />
      <div class="rollback-buttons">
        <van-button plain round type="info" :disabled="submitting" @click="visible = false">取消</van-button>
        <van-button round type="info" :loading="submitting" :disabled="submitting" loading-text="退回中" @click="submit">确认退回</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { rollbackToPrevious } from '@/api/workflow/wf'
import eventBus from '@/utils/eventBus'

export default {
  name: 'WorkflowRollback',
  props: {
    task: { type: Object, required: true },
    action: { type: Boolean, default: false }
  },
  data() {
    return {
      visible: false,
      submitting: false,
      reason: '',
      currentTask: {},
      completedTaskId: ''
    }
  },
  computed: {
    completed() {
      return this.completedTaskId === this.task.taskId
    }
  },
  deactivated() {
    this.visible = false
  },
  methods: {
    open() {
      if (this.submitting || this.completed || !this.task.taskId) return
      this.currentTask = { ...this.task }
      this.reason = ''
      this.visible = true
    },
    async submit() {
      if (this.submitting || this.completed) return
      const backReason = this.reason.trim()
      if (!backReason) {
        this.$notify({ type: 'warning', message: '请填写退回原因' })
        return
      }
      if (!this.currentTask.taskId || this.currentTask.taskId !== this.task.taskId) {
        this.$notify({ type: 'warning', message: '审批任务已变化，请刷新列表后重试' })
        return
      }
      this.submitting = true
      const route = this.$route
      try {
        const res = await rollbackToPrevious({ taskId: this.currentTask.taskId, backReason })
        this.completedTaskId = this.currentTask.taskId
        this.visible = false
        this.$notify({ type: 'success', message: res.message })
        eventBus.$emit('workflowRollbackSuccess')
        // 页面退出期间完成请求时，不再让旧页面改变当前路由。
        if (this.$route === route) this.$emit('success')
      } catch (error) {
        // 网络及通用接口异常由现有请求封装提示，此处补充文字业务失败。
        if (error && error.isRollbackResult) {
          this.$notify({ type: 'danger', message: error.message })
        }
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.workflow-rollback {
  display: inline-flex;
  float: right;
}
.workflow-rollback-action {
  flex: 1;
  min-width: 0;
  justify-content: center;
}
.rollback-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 10px;
  line-height: 18px;
  white-space: nowrap;
  &:disabled {
    opacity: 0.5;
  }
}
.rollback-popup {
  width: 320px;
  max-width: calc(100vw - 32px);
  max-height: 85vh;
  box-sizing: border-box;
  padding: 20px 16px;
  color: #151b3e;
}
.rollback-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}
.rollback-code, .rollback-tip {
  margin-top: 12px;
  font-size: 13px;
  line-height: 22px;
  word-break: break-all;
}
.rollback-tip {
  margin-bottom: 12px;
  color: #73768b;
}
.rollback-buttons {
  display: flex;
  margin-top: 20px;
  .van-button {
    flex: 1;
    min-width: 0;
    height: 38px;
    padding: 0 8px;
    + .van-button {
      margin-left: 12px;
    }
  }
}
</style>
