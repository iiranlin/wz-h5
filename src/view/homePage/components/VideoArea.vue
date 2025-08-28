<!-- 视频区域 -->
<template>
  <div>
    <div style="position: relative;">
      <video ref="videos" class="videoModel" :src="videoUrl" autoplay loop muted playsinline></video>

      <div class="userInfo" @click="handlerLogOut">
        <div>
          <img src="@/assets/img/userVia.png" />
        </div>

        <div>
          {{ userInfo.nickName }}
        </div>
      </div>

      <div class="firmInfo">
        <div class="SystemName">
          <p>建设物资管理系统</p>
        </div>

        <div class="unitInfo">
          {{ newfirmInfo }}
        </div>
      </div>
    </div>

    <div>

    </div>
  </div>
</template>

<script>
import { isAndroid } from "@/utils";
import videoUrl from '@/assets/video/Banner.mp4'
import { getUserInfo } from '@/utils/user-info'
export default {
  name: 'VideoArea',

  computed: {
    // 如果单位名称和部门名称相同，则只显示单位名称
    newfirmInfo() {
      return this.userInfo.unitName == this.userInfo.deptName ? this.userInfo.unitName : this.userInfo.unitName + '/' + this.userInfo.deptName
    }
  },

  data() {
    return {
      videoUrl,
      userInfo: getUserInfo()
    };
  },

  mounted() {

  },

  methods: {
    handlerLogOut() {
      this.$dialog.confirm({
        message: '是否确认退出系统？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$store.dispatch('LogOut');
        if (isAndroid()) {
          Android.startToLogin()
        }
      }).catch(() => {
        // on cancel
      })
    }
  },
};
</script>

<style lang="less" scoped>
.videoModel {
  width: 100%;
  height: 46vh;
  object-fit: fill;
  display: block;
}

.userInfo {
  width: fit-content;
  height: 24px;
  color: #E4E2E8;
  font-size: 14px;
  background-color: rgba(27, 48, 127, 0.8);
  position: absolute;
  top: 30px;
  right: 10px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 0 5px 0 0;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
  }
}

.firmInfo {
  width: 100%;
  color: #E4E2E8;
  position: absolute;
  bottom: 0;
  margin: 0 auto;
  line-height: 35px;
  // backdrop-filter: blur(3px);
  background: linear-gradient(to bottom, transparent 10%, rgb(45, 93, 172) 80%);
  padding: 20px 0;
}

.SystemName {
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 3px;
  text-align: center;
  color: #fff;
}

.unitInfo {
  text-align: center;
  font-size: 14px;
  line-height: 18px;
  margin-top: 8px;
}
</style>