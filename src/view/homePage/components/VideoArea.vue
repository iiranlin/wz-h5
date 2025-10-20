<!-- 视频区域 -->
<template>
  <div>
    <div style="position: relative;">
      <video ref="videos" class="videoModel" controls poster="@/assets/img/Banner.png" :src="videoUrl" autoplay loop
        muted playsinline></video>

      <div class="userInfo" @click="showPopup">
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

      <van-popup v-model="show" position="right" get-container="body" :style="{ width: '200px', height: '100%' }">

        <div class="sidebar">
          <div class="user-info">
            <div class="user-name">{{ userInfo.nickName }}</div>
            <div class="account">账号: {{ username }}</div>
            <!-- divider -->
            <div class="divider"></div>

            <div class="login-out" @click="$router.push({ path: '/editPassword' })">
              <van-image width="26" height="26" :src="EditPasswordIcon" />
              修改密码
            </div>

            <div v-if="projectShow" class="login-out" @click="handlerProjects">
              <van-image width="26" height="26" :src="SwitchProjectsIcon" />
              切换项目
            </div>

            <div class="login-out" @click="handlerLogOut">
              <van-image width="26" height="26" :src="LoginOutIcon" />
              退出登录
            </div>



          </div>

        </div>
      </van-popup>
    </div>

    <selectProject ref="selectProjectVideo" :showCancelButton="true"></selectProject>
  </div>
</template>

<script>
import { isAndroid } from "@/utils";
import videoUrl from '@/assets/video/Banner.mp4'
import { getUserInfo } from '@/utils/user-info'
import LoginOutIcon from '@/assets/img/退出登录.png';
import EditPasswordIcon from '@/assets/img/修改密码.png';
import SwitchProjectsIcon from '@/assets/img/SwitchProjectsIcon.png';

import selectProject from './selectProject.vue';
export default {
  name: 'VideoArea',

  components: {
    selectProject
  },

  computed: {
    // 如果单位名称和部门名称相同，则只显示单位名称
    newfirmInfo() {
      return this.userInfo.unitName == this.userInfo.deptName ? this.userInfo.unitName : this.userInfo.unitName + '/' + this.userInfo.deptName
    },
    username() {
      return this.userInfo.username
    },
    projectShow() {
      return this.$store.getters.selectProjectUserData?.length > 1
    }
  },

  data() {
    return {
      videoUrl,
      userInfo: getUserInfo(),
      show: false,
      LoginOutIcon,
      EditPasswordIcon,
      SwitchProjectsIcon
    };
  },

  mounted() {

  },

  methods: {
    showPopup() {
      this.show = true;
    },
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
    },
    handlerProjects() {
      this.$refs.selectProjectVideo.dialogShow = true;
      this.$store.commit('SET_SELECT_PROJECT_DIALOG', true);
    }, 
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


// 全屏按钮
video::-webkit-media-controls-fullscreen-button {
  display: none;
}

//播放按钮
video::-webkit-media-controls-play-button {
  display: none;
}

//进度条
video::-webkit-media-controls-timeline {
  display: none;
}

//观看的当前时间
video::-webkit-media-controls-current-time-display {
  display: none;
}

//剩余时间
video::-webkit-media-controls-time-remaining-display {
  display: none;
}

//音量按钮
video::-webkit-media-controls-mute-button {
  display: none;
}

// 画中画
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}

//音量的控制条
video::-webkit-media-controls-volume-slider {
  display: none;
}

//所有控件
video::-webkit-media-controls-enclosure {
  display: none;
}

.sidebar {
  background: linear-gradient(179deg, #1895FF 0%, #FFFFFF 100%);
  height: 100%;
  padding-top: 20px;
  color: #fff;
  box-sizing: border-box;
}

.user-info {
  text-align: center;
  margin-bottom: 20px;

  .user-name {
    margin-top: 114px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }

  .account {
    width: fit-content;
    height: 20px;
    border-radius: 15px;
    border: 1px solid #FFFFFF;
    margin: 10px auto;
    padding: 5px 10px;
    margin-bottom: 32px;


    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #FFFFFF;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }

  .divider {
    height: 0px;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #EAEAEA;
  }

  .login-out {
    width: 120px;
    height: 36px;
    border-radius: 26px 26px 26px 26px;
    border: 1px solid #FFFFFF;
    width: fit-content;
    height: 20px;
    padding: 5px 8px;
    margin: 31px auto;
    display: flex;
    align-items: center;
    justify-content: center;



    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.btn {
  margin-top: 10px;
}
</style>