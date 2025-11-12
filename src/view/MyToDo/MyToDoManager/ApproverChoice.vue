<template>
  <div class="detail-container">
    <div class="box-container">
      <div class="detail-title-info">
        <span class="info-title">请选择审批人</span>
      </div>
      <van-list
        v-model="loading"
        offset="30"
        :finished="finished"
        finished-text="没有更多了..."
      >
        <div
          v-for="(item, index) in assigneeList"
          :key="index"
          class="item-container"
          :class="{ active: isSelected(item.id) }"
          @click="handleItemClick(item)"
        >
          <span>{{ item.nickName }}</span>
          <i
            v-if="multiple && isSelected(item.id)"
            class="van-icon van-icon-success selected-icon"
          ></i>
        </div>
      </van-list>
    </div>

    <div class="default-button-container">
      <van-button
        class="button-info"
        icon="arrow-left"
        block
        type="default"
        round
        @click="handleCancel"
        style="width: calc(50% - 30px);"
      >
        上一步
      </van-button>

      <!-- ✅ 仅在多选模式下显示 -->
      <van-button
        v-if="multiple"
        class="button-info"
        type="info"
        block
        round
        @click="handleSubmit"
        style="width: calc(50% - 30px);"
      >
        确定
      </van-button>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus.js'

export default {
  name: 'ApproverChoice',

  data() {
    return {
      loading: false,
      finished: true,
      assigneeList: [],
      selectedValues: [] // ✅ 存储多选的id
    }
  },
  computed: {
    multiple() {
      // 从路由参数获取
      return this.$route.params.multiple === true || this.$route.params.multiple === 'true'
    },
    selectd(){
      return  JSON.parse(this.$route.params.selectd || '[]')
    }
  },
  created() {
    // 从路由参数获取审批人列表
    this.assigneeList = JSON.parse(this.$route.params.obj || '[]')
    this.selectedValues = this.selectd

  },
  methods: {
    // 判断是否选中
    isSelected(id) {
      return this.selectedValues.includes(id)
    },

    // 点击条目
    handleItemClick(item) {
      if (this.multiple) {
        // ✅ 多选模式
        const idx = this.selectedValues.indexOf(item.id)
        if (idx > -1) {
          this.selectedValues.splice(idx, 1)
        } else {
          this.selectedValues.push(item.id)
        }
      
      } else {
        // ✅ 单选模式，立即返回
        eventBus.$emit('approverChoiceCallBack', [item])
        this.$router.back()
      }
    },

    // 上一步
    handleCancel() {
      this.$router.back()
    },

    // ✅ 提交选中的多个审批人
    handleSubmit() {
      const selectedItems = this.assigneeList.filter(item =>
        this.selectedValues.includes(item.id)
      )
      eventBus.$emit('approverChoiceCallBack', selectedItems)
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.detail-container {
  padding-top: 10px;
}

.item-container {
  width: 100%;
  height: 58px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  span {
    font-size: 14px;
    color: #2e2e2e;
    margin-left: 10px;
  }

  &.active {
    background: #e8f5ff;
  }

  .selected-icon {
    color: #1989fa;
    font-size: 18px;
    margin-right: 12px;
  }
}

.default-button-container {
  margin-top: 15px;
  padding: 0 5px;
  display: flex;
  gap: 10px;
}
</style>
