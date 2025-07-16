<template>
  <div class="default-container" ref="container">
    <div class="submit-store-view-mian">
      <div class="detail-base-info">
        <div class="detail-title-content">
          <img src="/static/icon-xqjh.png" />
          <span>需求编号：</span>
          <span>{{ goodsMsg.planNumber }}</span>
        </div>
        <div>
          <ul class="detail-ul">
            <li>
              <span>需求项目：</span>
              <span>{{ goodsMsg.sectionName }}</span>
            </li>
            <li>
              <span>合同名称：</span>
              <span class="text">{{ goodsMsg.deptName }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="list-ul" style="margin-top: 26px; padding: 10px">
        <van-form :key="formKey" ref="form">
          <van-field
            v-model="params.oddNumbers"
            :disabled="fileDisabled"
            label="物流单号"
            placeholder="物流单号"
            input-align="right"
          />
          <van-field
            v-model="params.shippingAddress"
            :disabled="fileDisabled"
            @click.stop="fieldClick($event, 'shippingAddress')"
            required
            label="发货地址"
            placeholder="发货地址"
            input-align="right"
            :rules="[{ required: true, message: '请填写发货地址' }]"
          />
          <van-field
            readonly
            clickable
            name="calendar"
            :disabled="fileDisabled"
            required
            v-model="params.shippingDate"
            label="发货日期"
            input-align="right"
            :value="params.shippingDate"
            placeholder="点击选择日期"
            @click="showCalendar = true"
            :rules="[{ required: true, message: '请填写发货日期' }]"
          />
          <van-calendar v-model="showCalendar" @confirm="onConfirm" />
          <van-field
            readonly
            clickable
            name="calendar"
            :disabled="fileDisabled"
            required
            :value="params.arrivalDate"
            label="预计送到时间"
            input-align="right"
            placeholder="点击选择日期"
            @click="sendStop = true"
            :rules="[{ required: true, message: '请填写预计送达时间' }]"
          />
          <van-calendar v-model="sendStop" @confirm="onStopConfirm" />
          <van-field
            v-model="params.carNumber"
            label="车牌号"
            @click.stop="fieldClick($event, 'carNumber')"
            :disabled="fileDisabled"
            type="text"
            placeholder="车牌号"
            input-align="right"
          />
          <van-field
            v-model="params.contacts"
            required
            label="联系人"
            @click.stop="fieldClick($event, 'contacts')"
            :disabled="fileDisabled"
            placeholder="联系人"
            input-align="right"
            :rules="[{ required: true, message: '请填写联系人' }]"
          />
          <van-field
            v-model="params.contactsPhone"
            required
            label="联系电话"
            @click.stop="fieldClick($event, 'contactsPhone')"
            :disabled="fileDisabled"
            placeholder="联系电话"
            input-align="right"
            :rules="[
              { required: true, message: '请填写手机号' },
              { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！' },
            ]"
          />
        </van-form>
        <div style="padding-right: 0.3rem">
          <file-upload-view
            class="outbound-field-uploader"
            title="发货单附件"
            :fileList="fileList"
            businessType="01"
          />
        </div>
      </div>
      <div class="default-button-container">
        <van-button
          size="mini"
          type="primary"
          round
          class="button-info"
          @click="chooseGoods(goodsId, text)"
          v-if="this.text == 'add'"
          >选择发货物资</van-button
        >
        <!-- 编辑里的选择发货物资传的是planId -->
        <van-button
          size="mini"
          type="primary"
          round
          class="button-info"
          @click="editGoods('edit')"
          v-if="text == 'edit'"
          >选择发货物资</van-button
        >
      </div>
    </div>
    <history-list ref="historyList" @historyClick="historyClick"></history-list>
  </div>
</template>
<script>
import Vue from "vue";
import { Form } from "vant";
import { Field } from "vant";
import {
  demandSnedGoods,
  demandSnedGoodsUpload,
  demandSaveSendGoods,
} from "@/api/demand/demandManagement";
import { minioUpload } from "@/api/blcd-base/minio";
import { detailBySendEdit } from "@/api/demand/sendGoods";
import keepPages from "@/view/mixins/keepPages";
import historyList from "@/components/historyList";
import FileUploadView from "@/components/FileUploadViewType.vue";
import { Toast } from "vant";
import { Notify } from "vant";
Vue.use(Notify);
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);

export default {
  name: "SendGoods",
  mixins: [keepPages],
  components: { FileUploadView, historyList },
  data() {
    return {
      formKey: "",
      username: "",
      password: "",
      value: "",
      showCalendar: false,
      sendStop: false,
      paramsType: false,
      //发货时传来的id
      goodsId: "",
      goodsMsg: {},
      params: {
        shipmentBatchNumber: "",
      },
      goodsList: [],
      fileList: [],
      // 传过来的标识，用来判断是新增还是编辑
      text: "",
      fileDisabled: false,
      fileByList: "",
      planId:''
    };
  },
  created() {
    this.text = this.$route.query.title;
    this.goodsId = this.$route.query.id;
    this.planId = this.$route.query.planId;
    //编辑
    if (this.text == "edit") {
      this.editDetails();
    }
    // 增加
    if (this.text == "add") {
      this.getSendGoods();
    }
    // 默认当前时间
    this.params.shippingDate = this.todayTime();
  },

  methods: {
    historyCache(obj, index, isDefault) {
      const data = this.$store.state.public.materiaList || [];
      const historyList = this.$store.state.public.historyList || {};
      if (historyList) {
        for (const key in obj) {
          if (historyList[key]) {
            obj[key] = historyList[key][index] || "";
          }
        }
      }
      if (isDefault) {
        return obj;
      }
      const finallyData = data.map((item) =>
        Object.assign({}, item, {
          shippingAddress: item.shippingAddress,
          carNumber: this.carNumber,
          contacts: this.contacts,
          contactsPhone: contactsPhone,
          ...obj,
        })
      );
      return finallyData;
    },
    historyClick(data, name, index, historyIndex) {
      let obj = {
        shippingAddress: "",
        carNumber: "",
        contacts: "",
        contactsPhone: "",
      };
      let finallyData = this.historyCache(obj, historyIndex, true);
      for (var key in finallyData) {
        if (finallyData[key] == "") {
          delete finallyData[key];
        }
      }
      this.params = Object.assign({}, this.params, finallyData)
    },
    fieldClick($event, name) {
      this.$refs.historyList.init($event, name);
    },
    getSendGoods() {
      demandSnedGoods(this.goodsId).then((res) => {
        if (res.code == 0) {
          // Toast.clear()
          this.goodsMsg = res.data;
        }
      });
    },
    // 编辑回显
    editDetails() {
      detailBySendEdit(this.goodsId).then((res) => {
        if (res.code == 0) {
          // Toast.clear()
          const { planNumber, sectionName, contractName } = res.data;
          this.goodsMsg.planNumber = planNumber;
          this.goodsMsg.sectionName = sectionName;
          this.goodsMsg.contractName = contractName;
          let file = JSON.parse(res.data.fileByList);
          this.params = res.data;
          this.fileList.push({
            fileName: file.fhd[0].fileName,
            filePath: file.fhd[0].filePath,
          });
          this.fileByList = file.fhd[0].fileName;
          this.params.shippingDate = this.formattedCreateDate(
            res.data.shippingDate
          );
          this.params.arrivalDate = this.formattedCreateDate(
            res.data.arrivalDate
          );
        }
      });
    },
    todayTime() {
      const now = new Date();

      const year = now.getFullYear(); // 年（如：2023）
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份加0  // 月（0-11，需要+1）
      const date = now.getDate().toString().padStart(2, "0"); // 日期加0       // 日（1-31）
      const hours = now.getHours(); // 时（0-23）
      const minutes = now.getMinutes(); // 分（0-59）
      const seconds = now.getSeconds(); // 秒（0-59）
      return `${year}-${month}-${date}`;
    },
    formattedCreateDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份加0
      const day = date.getDate().toString().padStart(2, "0"); // 日期加0
      return `${year}-${month}-${day}`;
    },
    //发货日期
    onConfirm(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份加0
      const day = date.getDate().toString().padStart(2, "0"); // 日期加0（可选）
      this.params.shippingDate = `${year}-${month}-${day}`;
      this.showCalendar = false;
    },
    // 送达时间
    onStopConfirm(date) {
      // 获取当前日期
      // const date = new Date();

      // 获取年、月、日
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份加0
      const day = date.getDate().toString().padStart(2, "0"); // 日期加0（可选）

      // 组合成YYYY-MM-DD格式
      this.params.arrivalDate = `${year}-${month}-${day}`;
      this.sendStop = false;
    },
    chooseGoods(id, text) {
      // this.formKey++
      this.$refs.form
        .validate()
        .then(() => {
          let fileList = [];
          let fhd = [];
          if (this.fileList.length > 0) {
            this.fileList.forEach((item) => {
              fileList.push({
                fileName: item.fileName,
                filePath: item.filePath,
              });
              fhd.push({ fileName: item.fileName, filePath: item.filePath });
            });
          } else {
            Toast.fail("请上传的附件");
            return;
          }
          let obj = {
            shippingAddress: [this.params.shippingAddress],
            carNumber: [this.params.carNumber],
            contacts: [this.params.contacts],
            contactsPhone: [this.params.contactsPhone],
          };
          this.$store.dispatch('public/setHistoryList', obj)
          let fileByList = JSON.stringify({ fhd });
          let params = {
            ...this.params,
            fileList: fileList,
            fileByList: fileByList,
            sectionName: this.goodsMsg.sectionName,
            planName: this.goodsMsg.planName,
            planId: this.goodsMsg.id,
            id: "",
            contractName: this.goodsMsg.contractName,
          };
          // 存到缓存里
          this.$store.dispatch("public/setGoodsList", params);
          // 携带参数跳转到选择商品页
          this.$router.push({
            path: "/selectGoods",
            query: { id: id, text: text },
          });
        })
        .catch(() => {
          //验证失败
        });
    },
    // 编辑时选择的下一步传的参数
    editGoods(text) {
      this.$refs.form
        .validate()
        .then(() => {
          let fileList = [];
          let fhd = [];
          if (this.fileList.length > 0) {
            this.fileList.forEach((item) => {
              fileList.push({
                fileName: item.fileName,
                filePath: item.filePath,
              });
              fhd.push({ fileName: item.fileName, filePath: item.filePath });
            });
          } else {
            Toast.fail("请上传的附件");
            return;
          }
          let fileByList = JSON.stringify({ fhd });

          let params = {
            arrivalDate: this.params.arrivalDate,
            carNumber: this.params.carNumber,
            contacts: this.params.contacts,
            contactsPhone: this.params.contactsPhone,
            contractName: this.params.contractName,
            oddNumbers: this.params.oddNumbers,
            shipmentBatchNumber: this.params.shipmentBatchNumber,
            shippingAddress: this.params.shippingAddress,
            shippingDate: this.params.shippingDate,
            // ...this.params,
            fileByList: fileByList,
            fileList: fileList,
            sectionName: this.goodsMsg.sectionName,
            planName: this.goodsMsg.planName,
            planId: this.goodsMsg.id,
            id: this.params.id,
            contractName: this.goodsMsg.contractName,
          };
          let obj = {
            shippingAddress: [this.params.shippingAddress],
            carNumber: [this.params.carNumber],
            contacts: [this.params.contacts],
            contactsPhone: [this.params.contactsPhone],
          };
        //   obj.shippingAddress = this.params.shippingAddress;
        //   obj.carNumber =this.params.find((item) => item.carNumber);
        //   obj.contacts = this.params.find((item) => item.contacts);
        //   obj.contactsPhone = this.params.find((item) => item.contactsPhone);
          this.$store.dispatch('public/setHistoryList', obj)
          // 编辑时如果到了这页面就把数据存到缓存里
          this.$store.dispatch("public/setEditSendGoods", params);
          //判断有没有可供选择的物资
          this.$router.push({ path: "/selectGoods", query: { text: text,planId:this.planId } });
        })
        .catch(() => {
          //验证失败
        });
    },
    lookGoods(id) {
      this.formKey++;
      this.$router.push({ path: "/selectGoods", query: { id: id } });
    },
    uploadGoosSend() {
      this.formKey++;
    },
    saveClick() {
      let fileList = [];
      this.fileList.forEach((item) => {
        fileList.push({ fileName: item.name, filePath: item.url });
      });
      let params = {
        ...this.params,
        fileList: fileList,
        sectionName: this.goodsMsg.sectionName,
        planName: this.goodsMsg.planName,
        planId: this.goodsMsg.id,
        id: "",
        contractName: this.goodsMsg.contractName,
        materialCirculationDetailsTableParamList:
          this.$store.state.public.goodsList, //取出store里的物资数据用于保存
      };
      demandSaveSendGoods(params).then((res) => {
        if (res.code == 0) {
          Toast.success(res.data);
          this.$router.push({ path: "/Information" });
        }
      });
    },
    beforeReadUpload(file) {
      let imgFile = new FormData();
      imgFile.append("businessType", "01");
      imgFile.append("key", file.file.name);
      imgFile.append("file", file.file);
      minioUpload(imgFile)
        .then((res) => {
          if (res.code == 0) {
            this.$notify({
              type: "success",
              message: "上传成功",
            });
            this.fileList = [
              {
                name: res.data.fileName,
                url: res.data.filePath,
              },
            ];
            // 只用作显示
            this.fileByList = this.fileList[0].name;
            // this.params = res.data
            // this.params.fileName = res.data.fileName
            // this.params.fileName = res.data.fileName
          }
        })
        .catch((err) => {
          this.$notify({
            type: "warning",
            message: "上传失败",
          });
        });
    },
    //附件上传前
    beforeRead(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isFileName = file.name.length < 90;

      if (!isLt10M) {
        this.$notify({
          type: "warning",
          message: "上传文件大小不能超过 10MB!",
        });
        return false;
      }
      if (!isFileName) {
        this.$notify({
          type: "warning",
          message: "上传文件名过长!",
        });
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="less" scoped>
.outbound-field-uploader {
  ::v-deep li {
    display: block;
  }

  ::v-deep .file-info {
    width: auto !important;

    img {
      min-width: auto !important;
    }
  }
}
.default-container {
  padding-top: 10px;
  padding-bottom: 60px;
}

li :nth-child(1) {
  min-width: 60px;
}

li :nth-child(2) {
  width: initial;
}

.li-item-both {
  .li-item-right {
    flex: initial;
  }
}

.list-ul {
  background: #fff;
  margin: 0 10px;
  border-radius: 15px;
  padding: 10px;
}

/deep/.van-button--primary {
  background-color: #1989fa;
  border: 1px solid #1989fa;
}

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>