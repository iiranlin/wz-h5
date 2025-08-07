<template>
  <div class="cargo-position-container">
    <van-form @submit="onSubmit" ref="form" :key="formKey">
      <div class="detail-title-contentA">
        <img src="/static/icon-address.png">
        <span class="title">新增货运位置</span>
      </div>

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

      <div class="action-buttons">
        <van-button
            round
            plain
            type="info"
            size="small"
            @click="cancelDiaLog"
        >
          取消
        </van-button>
        <van-button
            round
            block
            type="info"
            size="small"
            native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {addFreightLocations, addList} from "@/api/demand/sendGoods";
import {Toast} from "vant";

export default {
  data() {
    return {
      cargoList: [],
      formKey: 0,
      positionInformation: "",
      shipmentBatchNumber: "",
    }
  },
  created() {
    this.shipmentBatchNumber = this.$route.params.shipmentBatchNumber ||
        this.$route.query.shipmentBatchNumber;

    if (this.shipmentBatchNumber) {
      this.handleConfirmClick(this.shipmentBatchNumber);
    }
  },
  methods: {
    cancelDiaLog() {
      this.formKey++
      this.$router.push({path: '/Information'})
    },
    onSubmit(values){
      let params = {
        shipmentBatchNumber: this.shipmentBatchNumber,
        positionInformation: values.positionInformation
      }
      this.$refs.form
          .validate()
          .then(() => {
            addFreightLocations(params).then((res) => {
              if (res.code == 0) {
                Toast.success(res.message);
                this.$router.push({path: '/Information'})
              }
            })
          })
    },
    handleConfirmClick(number) {
      this.formKey++
      this.shipmentBatchNumber = number
      let params = {
        shipmentBatchNumber: number
      }
      addList(params).then((res) => {
        if (res.code == 0) {
          this.cargoList = res.data.list
        }
      })
    },
    formattedCreateDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }
}
</script>

<style scoped lang="less">
.cargo-position-container {
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
}

.header {
  padding: 16px 0;
  border-bottom: 1px solid #f1f4f8;

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #151b3e;
  }
}

.position-field {
  margin: 16px 0;
  padding: 13px 16px;
  background-color: #f7f8fa;
  border-radius: 8px;
}

.location-history {
  margin-top: 24px;

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
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding: 0 16px;

  .van-button {
    flex: 1;
  }
}
.detail-title-contentA {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  padding-left: 2px;
  padding-right: 27px;
  box-sizing: border-box;
  border-top: 1px solid #f1f4f8;

  img {
    width: 25px;
    height: 25px;
  }

  & span:nth-child(2) {
    margin-left: 6px;
    color: #151b3e;
    font-size: 15px;
    font-weight: 600;
  }

  & span:nth-child(3) {
    color: #151b3e;
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
