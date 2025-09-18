<template>
  <div class="device-detail-container">
    <!-- 填写模式 -->
    <div v-if="!status" class="form-page">
      <van-form @submit="onSubmit">
        <!-- 基本信息 -->
        <div class="detail-base-info detail-base-info-edited">
          <ul class="detail-list-ul-edited">
            <li class="detail-list-li-input">
              <van-field name="unitType" label="单位类型"   label-align="left" required
                :rules="[{ required: true, message: '请选择单位类型' }]" readonly :value="formData.unitType" placeholder="请选择"
                @click="showUnitTypePicker = true" is-link input-align="left" />
            </li>
            <li class="detail-list-li-input">
              <van-field name="deviceType" label="设备类型"   label-align="left" required
                :rules="[{ required: true, message: '请选择设备类型' }]" readonly :value="formData.deviceType"
                placeholder="请选择" @click="showDeviceTypePicker = true" is-link input-align="left" />
            </li>
            <li class="detail-list-li-input">
              <van-field v-model="formData.unitName" name="unitName" label="单位名称"   label-align="left"
                required placeholder="请输入" :rules="[{ required: true, message: '请填写单位名称' }]" input-align="left" />
            </li>
            <li class="detail-list-li-input">
              <van-field v-model="formData.name" name="na'me" label="使用人"   label-align="left" required
                placeholder="请输入" :rules="[{ required: true, message: '请填写使用人' }]" input-align="left" />
            </li>
            <li class="detail-list-li-input">
              <van-field :value="deviceNum" readonly label="设备授权码"   label-align="left"
                input-align="left" />
            </li>
          </ul>

          <div class="button-container" style="margin-bottom: 100px;">
            <van-button class="button-info" round @click="goBack">返回</van-button>
            <van-button class="button-info" round type="info" native-type="submit">立即申请</van-button>
          </div>
        </div>


      </van-form>

      <!-- 单位类型选择器 -->
      <van-popup v-model="showUnitTypePicker" position="bottom">
        <van-picker show-toolbar title="选择单位类型" :columns="unitTypeOptions" @confirm="onUnitTypeConfirm"
          @cancel="showUnitTypePicker = false" />
      </van-popup>

      <!-- 设备类型选择器 -->
      <van-popup v-model="showDeviceTypePicker" position="bottom">
        <van-picker show-toolbar title="选择设备类型" :columns="deviceTypeOptions" @confirm="onDeviceTypeConfirm"
          @cancel="showDeviceTypePicker = false" />
      </van-popup>
    </div>

    <!-- 阅读模式 -->
    <div v-else class="read-page detail-base-info detail-base-info-edited">

      <!-- 申请信息 -->
      <div class="application-info">
        <div class="info-item">
          <span class="info-label">单位类型：</span>
          <span class="info-value">{{ formData.unitType }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">设备类型：</span>
          <span class="info-value">{{ formData.deviceType }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">单位名称：</span>
          <span class="info-value">{{ formData.unitName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">使用人：</span>
          <span class="info-value">{{ formData.name }}</span>
        </div>
        <!-- 驳回原因 -->
        <div class="info-item" v-if="status == '3'">
          <span class="info-label">驳回原因：</span>
          <span class="info-value">{{ formData.remake }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">设备授权码：</span>
          <span class="info-value">{{ deviceNum }}</span>
        </div>


        <!-- 驳回按钮 -->
        <div v-if="status == '3'" class="button-container ">
          <van-button class="button-info" round @click="goBack">返回</van-button>
          <van-button class="button-info" round type="info" @click="goEdit">修改</van-button>
        </div>
        <div v-else class="button-container ">
          <van-button class="button-info" style="width: 300px;" round @click="goBack">返回</van-button>
        </div>
      </div>

      <div v-if="status == '2'" class="buttom-tips" style=" color: #008CFFB2;">
        <img src="@/assets/img/正在授权.png" /><span>授权审核中，请稍后......</span>
      </div>

      <div v-if="status == '1'" class="buttom-tips" style=" color: #0DAA01;">
        <img src="@/assets/img/已通过授权.png" /><span>已顺利通过授权</span>
      </div>

      <div v-if="status == '3'" class="buttom-tips" style=" color: #FF171A;">
        <img src="@/assets/img/未通过授权.png" /><span>后台审核反映未通过</span>
      </div>

      <div v-if="status == '0'" class="buttom-tips" style=" color: #00000080;">
        <img src="@/assets/img/关闭授权.png" /><span>如需开启，请联系指挥部管理员！</span>
      </div>


    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import { create, apply, getDetail } from '@/api/prodmgr-inv/deviceDetail';
import { isAndroid } from '@/utils';

export default {
  name: 'DeviceDetail',
  // 0 关闭 1 开启 2 审核中 3 驳回
  data() {
    return {
      status: null,
      deviceNum: '', // 从URL获取的设备授权码
      formData: {
        unitType: '',
        deviceType: '',
        unitName: '',
        name: ''
      },
      showUnitTypePicker: false,
      showDeviceTypePicker: false,
      unitTypeOptions: ['指挥部','物代', '施工单位','监理单位','供应商'],
      deviceTypeOptions: ['手机', '平板']
    };
  },

  created() {
    // 获取URL参数status和deviceNum
    this.status = this.$route.query.status;
    this.deviceNum = this.$route.query.deviceNum || '';

    if (this.status) {
      getDetail({ deviceNum: this.deviceNum }).then(response => {
        this.formData = response.data;
      }).catch(error => {
        console.error(error);
      });
    }
  },
  methods: {
    onUnitTypeConfirm(value) {
      this.formData.unitType = value;
      this.showUnitTypePicker = false;
    },
    onDeviceTypeConfirm(value) {
      this.formData.deviceType = value;
      this.showDeviceTypePicker = false;
    },
    goBack() {
      if (isAndroid()) {
        Android.startToLogin()
      }
    },
    onSubmit() {
      // 提交表单逻辑
      Dialog.confirm({
        title: '确认提交',
        message: '确定要提交设备使用授权申请吗？',
      }).then(() => {
        // 调用真实接口
        Toast.loading({
          message: '提交中...',
          forbidClick: true,
        });

        const submitData = {
          ...this.formData,
          unitType: this.formData.unitType,
          deviceType: this.formData.deviceType,
          unitName: this.formData.unitName,
          name: this.formData.name,
          deviceNum: this.deviceNum
        };

        apply(submitData).then(response => {
          console.log(response, 'res123123123')
          Toast.clear();
          Toast.success('申请提交成功');

          // 提交成功后跳转到成功页面
          if (isAndroid()) {
            Android.startToLogin()
          }
        }).catch(error => {
          Toast.clear();
          Toast.fail(error.message || '提交失败，请重试');
        });
      }).catch(() => {
        // 取消操作
      });
    },
    goEdit() {
      // 当状态为3（驳回）时，返回到填写页面，保持当前数据
      this.status = null;
    }
  }
};
</script>

<style lang="less" scoped>
.device-detail-container {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 80px;
}

.form-page {
  padding: 0;
}



.success-icon {
  margin-bottom: 20px;
}

.read-page h2 {
  font-size: 20px;
  color: #323233;
  margin-bottom: 8px;
}

.read-page p {
  // color: #969799;
  margin-bottom: 4px;
}

.application-info {
  width: 100%;
  margin: 30px 0;
}

.info-item {
  display: flex;
  margin-bottom: 20px;
  font-size: 16px;
  color: #323233;
  padding-left: 20px;
}

.info-label {
  color: #323233;
  margin-right: 8px;
  min-width: 100px;
}

.info-value {
  color: #323233;
  flex: 1;
}

.detail-list-ul-edited {
  margin: 0 7px;

  .detail-list-li-input {
    border-bottom: 1px solid #e3e3e3;

    .van-cell {
      padding-left: 23px;
      padding-right: 10px;
    }
  }
}

.detail-base-info-edited {
  width: auto;
  box-sizing: border-box;
  margin-inline: 20px;
  margin-block: 20px;
  background: #ffffff;
  border-radius: 7px;
  box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
  position: relative;
  padding: 5px;
  display: flex;
  flex-direction: column;

  .detail-title-content {
    padding-left: 0;
    padding-right: 0;
    padding: 10px 15px;
    display: flex;
    align-items: center;

    img {
      width: 26px;
      height: 26px;
    }

    span {
      line-height: 26px;
      margin-left: 8px;
      font-size: 16px;
      color: #151b3e;
      font-weight: 500;
    }
  }

  .detail-ul-text {
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 10px;
    background: #f2f2f2;
    border-radius: 5px;

    .detail-ul {
      padding: 10px 12px;
      margin: 0;
      list-style: none;

      li {
        display: flex;
        padding: 8px 0;
        font-size: 14px;
        color: #323233;

        span {
          &:first-child {
            color: #969799;
            width: 80px;
            flex-shrink: 0;
            text-align: right;
          }

          &:last-child {
            flex: 1;
            text-align: right;
            padding-left: 10px;
          }
        }
      }
    }
  }
}

.button-container {
  display: flex;
  justify-content: space-around;
  padding: 20px 16px;
  margin-top: 50px;

  .button-info {
    width: 120px;
    height: 34px;
  }
}

.buttom-tips {
  margin: 50px auto;
  display: flex;
  align-items: center;

  font-size: 10px;

  gap: 2px;

  img {
    width: 12px;
    height: 12px;
  }
}
</style>