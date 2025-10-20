<!-- 选择项目弹窗 -->
<template>
  <div>
    <van-dialog v-model="dialogShow" title="请选择进入的项目" :show-confirm-button="false" :showCancelButton="showCancelButton">
      <div style="padding: 0 16px 16px; max-height: 40vh; overflow-y: auto">
        <div v-for="item in projects" :key="item.id" class="project-item">
          <span class="name-box">
            <van-popover v-model="item.showFull" placement="bottom-start" trigger="click">
              <div style="max-width:220px;padding:8px 12px;font-size:14px;border-bottom: 1px solid #e5e5e5;">
                {{ item.unitName }}
              </div>
              <template #reference>
                <span class="project-name">{{ item.unitName }}</span>
              </template>
            </van-popover>
          </span>

          <button class="enter-btn" @click="enterProject(item)">进入</button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { setToken } from "@/utils/auth"

export default {
  name: 'selectProject',

  props: {
    showCancelButton: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialogShow: false,
    };
  },

  computed: {
    projects() {
      return this.$store.getters.selectProjectUserData
    }
  },

  mounted() {
    
  },

  methods: {
    async enterProject(item) {
      this.dialogShow = false
      this.$store.dispatch('public/setScrollPositionReset', {});
      this.$store.commit('SET_SELECT_PROJECT_DIALOG', false)

      // 替换选中token并跳转首页
      setToken(item.token);
      // 获取用户信息
      await this.$store.dispatch("GetInfo");
      this.$router.replace({ path: '/constructionUnitsPage', query: { _t: Date.now() } });
    }
  },
};
</script>

<style lang="less" scoped>
::v-deep .van-dialog__header {
  padding: 0.35rem;
  border-bottom: 1px solid #e5e5e5;
}

.name-box {
  flex: 1;
  overflow: hidden;
}

.dialog-content {
  padding: 0 16px 16px;
  min-height: 50vh;
  max-height: 50vh;
  overflow-y: auto;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0 16px 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.project-name {
  font-size: 15px;
  color: #333;
  display: block;
  width: 230px;
}

.enter-btn {
  color: #1989fa;
  font-size: 14px;
  border: none;
  background: none;
  padding: 4px 8px;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>