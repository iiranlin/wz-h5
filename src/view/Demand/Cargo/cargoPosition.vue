<template>
  <div class="cargo-position-container">
    <!-- 顶部固定区域 -->
    <div class="fixed-header">
      <div class="detail-title-contentA">
        <img src="/static/icon-address.png">
        <span class="title">新增货运位置</span>
      </div>

      <van-form @submit="onSubmit" ref="form" :key="formKey">
        <van-field
            v-model="positionInformation"
            name="positionInformation"
            label="当前位置"
            class="position-field"
            placeholder="请输入新的位置"
            input-align="right"
            :rules="[{ required: true, message: '请填写当前位置' }]"
            required
        />
      </van-form>
    </div>

    <!-- 中间可滚动区域 -->
    <div class="scrollable-content">
      <div class="location-history">
        <van-steps direction="vertical" active-color="#0086ff" :active="0">
          <van-step v-for="(item, index) in cargoList" :key="index">
            <div class="location-item">
              <p class="time">{{ formattedCreateDate(item.createDate) }} {{ formatTime(item.createDate) }}</p>
              <p class="address">{{ item.positionInformation }}</p>
            </div>
          </van-step>
        </van-steps>
      </div>
    </div>

    <!-- 底部固定区域 -->
    <div class="fixed-footer">
      <div class="action-buttons">
        <van-button round plain type="info" size="small" @click="cancelDiaLog">取消</van-button>
        <van-button round block type="info" size="small"  @click="onSubmit(positionInformation)" native-type="submit">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addFreightLocations, addList } from "@/api/demand/sendGoods";
import { Toast } from "vant";

export default {
  data() {
    return {
      cargoList: [],
      formKey: 0,
      positionInformation: "",
      shipmentBatchNumber: "",
    };
  },
  created() {
    this.shipmentBatchNumber =
        this.$route.params.shipmentBatchNumber ||
        this.$route.query.shipmentBatchNumber;

    if (this.shipmentBatchNumber) {
      this.handleConfirmClick(this.shipmentBatchNumber);
    }
  },
  methods: {
    cancelDiaLog(event) {
      if (event) {
        event.preventDefault();
      }
      this.formKey++;
      this.$router.go(-1);
    },
    onSubmit(values) {
      let params = {
        shipmentBatchNumber: this.shipmentBatchNumber,
        positionInformation: values,
      };
      this.$refs.form.validate().then(() => {
        addFreightLocations(params).then((res) => {
          if (res.code == 0) {
            Toast.success(res.message);
            this.$router.go(-1);
          }
        });
      });
    },
    handleConfirmClick(number) {
      this.formKey++;
      this.shipmentBatchNumber = number;
      let params = {
        shipmentBatchNumber: number,
      };
      addList(params).then((res) => {
        if (res.code == 0) {
          this.cargoList = res.data.list;
        }
      });
    },
    formattedCreateDate(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatTime(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },
  },
};
</script>

<style scoped lang="less">
.cargo-position-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0;
  background-color: #fff;
}

/* 顶部固定区域 */
.fixed-header {
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #f1f4f8;
}

/* 中间可滚动区域 */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

/* 底部固定区域 */
.fixed-footer {
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #f1f4f8;
}

.position-field {
  margin: 16px 0;
  padding: 13px 16px;
  background-color: #f7f8fa;
  border-radius: 8px;
}

.location-history {
  margin-top: 16px;
  padding-bottom: 16px;
}

.location-item {
  padding: 8px 0;
  .time {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
  .address {
    margin: 4px 0 0;
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  .van-button {
    flex: 1;
  }
}

.detail-title-contentA {
  display: flex;
  align-items: center;
  img {
    width: 25px;
    height: 25px;
  }
  .title {
    margin-left: 6px;
    color: #151b3e;
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
