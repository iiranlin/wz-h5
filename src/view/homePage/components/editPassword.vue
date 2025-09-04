<template>
  <div class="change-password-page">

    <!-- 表单 -->
    <van-field v-model="oldPass" type="password" label="旧密码*" placeholder="请输入旧密码" left-icon="user-o"
      :right-icon="showOld ? 'eye-o' : 'closed-eye'" @click-right-icon="toggleOld" :type="showOld ? 'text' : 'password'"
      class="custom-field" />
    <van-field v-model="password" type="password" label="新密码*" placeholder="请输入新密码" left-icon="lock"
      :right-icon="showNew ? 'eye-o' : 'closed-eye'" @click-right-icon="toggleNew" :type="showNew ? 'text' : 'password'"
      class="custom-field" />
    <van-field v-model="confirmPassword" type="password" label="确认密码*" placeholder="请再次输入密码" left-icon="lock"
      :right-icon="showConfirm ? 'eye-o' : 'closed-eye'" @click-right-icon="toggleConfirm"
      :type="showConfirm ? 'text' : 'password'" class="custom-field" />

    <!-- 按钮 -->
    <div class="btns">
      <van-button plain hairline round class="cancel-btn" @click="onCancel">取消</van-button>
      <van-button type="info" round class="confirm-btn" @click="onSubmit">确定</van-button>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/user-info'
import { changePassword } from '@/api/blcd-base/auth'
import { isAndroid } from "@/utils";

export default {
  name: "ChangePassword",
  data() {
    return {
      oldPass: "",
      password: "",
      confirmPassword: "",
      showOld: false,
      showNew: false,
      showConfirm: false,
      userInfo: getUserInfo(),
    };
  },
  methods: {
    toggleOld() {
      this.showOld = !this.showOld;
    },
    toggleNew() {
      this.showNew = !this.showNew;
    },
    toggleConfirm() {
      this.showConfirm = !this.showConfirm;
    },
    onCancel() {
      this.$router.go(-1)
    },
    onSubmit() {
      if (!this.oldPass || !this.password || !this.confirmPassword) {
        this.$toast("请填写完整信息");
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.$toast("两次输入密码不一致");
        return;
      }
      if (this.oldPass === this.password) {
        this.$toast("新密码不能与旧密码相同");
        return;
      }

      changePassword({
        oldPass: this.oldPass,
        password: this.password,
        pwdInitStatus: false,
        username: this.userInfo.username,
      }).then(res => {
        if (res.success) {
          this.$dialog.confirm({
            message: '密码修改成功,请重新登录!',
            confirmButtonText: '确认',
            showCancelButton: false
          }).then(() => {
            this.$store.dispatch('LogOut');
            if (isAndroid()) {
              Android.startToLogin()
            }
          }).catch(() => {
            // on cancel
          })
        }
      })

    },
  },
};
</script>

<style scoped>
.change-password-page {
  padding: 20px;
  background: #fff;
  height: 100vh;
  box-sizing: border-box;
}

.title {
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
}

.custom-field {
  border: 1px solid #000;
  border-radius: 12px;
  margin-bottom: 15px;
}

::v-deep(.van-field__control) {
  font-size: 16px;
}

.btns {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.cancel-btn {
  flex: 1;
  margin-right: 10px;
  color: #1989fa;
  border: 1px solid #1989fa;
}

.confirm-btn {
  flex: 1;
  background-color: #1989fa;
  color: #fff;
}
</style>
