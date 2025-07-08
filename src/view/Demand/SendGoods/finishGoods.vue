<template>
  <div class="finish">
    <div class="main">
      <div class="box" v-for="(item, index) in goodsData" :key="index">
        <div class="detail-base-info">
        <div class="detail-title-content">
            <img src="/static/icon-xqjh.png">
            <span>物资名称：</span>
            <span>{{item.materialName}}</span>
        </div>
        <div>
            <ul class="detail-ul">
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li>
            <span>计量单位：</span>
            <span>{{ item.unit }}</span>
          </li>
          <li>
            <span style="min-width: 2rem;">次计划数量：</span>
            <span>{{ item.planAmount }}</span>
          </li>
          <li>
            <span style="min-width: 4rem;">本次需求未发货数量：</span>
            <span>{{ item.ssendTotal }}</span>
          </li>
          <!-- <li class="li-status">
            <template v-for="row in statusArr">
              <van-tag :class="{ 'li-status-completed': row.value == '9' }"
                :type="['0', '5'].includes(row.value) ? 'danger' : 'primary'" round size="medium" :key="row.value"
                v-if="detail.planStatus == row.value">{{ row.text }}</van-tag>
            </template>
            </li> -->
            </ul>
        </div>
    </div>
        <van-divider />
        <div class="list-ul" style="margin-top: 26px;padding: 10px;">
          <van-form ref="form">
            <van-field v-model="goodsData[index].sendTotal" :disabled="fileDisabled" required name="发货数量" label="发货数量"
              placeholder="发货数量" input-align="right" />
            <van-field v-model="goodsData[index].packagingFm" :disabled="fileDisabled" name="包装形式" required label="包装形式"
              placeholder="请输入包装形式" input-align="right" />
            <van-field readonly clickable v-model="goodsData[index].createDate" :disabled="fileDisabled" required
              name="datetimePicker" :value="goodsData[index].createDate" label="生产日期" placeholder="点击选择日期"
              @click="showCalendars(item, index, 'show')" input-align="right" />
            <van-field readonly clickable v-model="goodsData[index].updateDate" :disabled="fileDisabled"
              name="datetimePicker" :value="goodsData[index].updateDate" label="有效截止日期" placeholder="有效截止日期"
              @click="showCalendars(item, index, 'end')" input-align="right" />
            <van-field v-model="goodsData[index].field2" label="收货地址" required :disabled="fileDisabled"
              placeholder="收货地址" input-align="right" />
            <van-field readonly clickable v-model="goodsData[index].supplyDate" :disabled="fileDisabled"
              name="datetimePicker" required :value="goodsData[index].supplyDate" label="供应时间" placeholder="点击选择时间"
              @click="showCalendars(item, index, 'gong')" input-align="right" />
            <van-field v-model="goodsData[index].receiver" name="收货人" :disabled="fileDisabled" required label="收货人和电话"
              placeholder="收货人" input-align="right" />
            <van-field v-model="goodsData[index].addr" label="使用地点" placeholder="使用地点" input-align="right" disabled />
            <van-field v-model="goodsData[index].field0" :name="goodsData[index].field0" label="投资方" required
              placeholder="投资方" disabled input-align="right" />
            <van-field v-model="goodsData[index].field1" name="投资比例" required label="投资比例" disabled placeholder="投资比例"
              input-align="right" />
            <file-upload-view title="合格证附件" :fileList="goodsData[index].fileList01" businessType="01" />
            <file-upload-view title="厂检报告附件" :fileList="goodsData[index].fileList02" businessType="01" />
            <van-field v-model="goodsData[index].remark" label="备注" :disabled="fileDisabled" placeholder="请输入备注"
              input-align="right" />
          </van-form>
        </div>
      </div>
    </div>

    <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="back">上一步</van-button>
      <van-button class="button-info" round type="info" @click="save">保存</van-button>
    </div>
    <!-- 生产日期 -->
    <van-calendar v-model="showCreateDates" @confirm="createConfirm" :min-date="minDate" :max-date="maxDate" />
    <van-calendar v-model="showCalendar" @confirm="createConfirm" />
  </div>

</template>

<script>
import Vue from 'vue';
import { Divider } from 'vant';
import { Toast } from 'vant';
import { DatetimePicker } from 'vant';

import _ from 'lodash'
import { demandSnedGoods, demandSnedGoodsUpload, demandSaveSendGoods } from '@/api/demand/demandManagement'
import { modifySendGoods } from '@/api/demand/sendGoods'
import { minioUpload } from '@/api/blcd-base/minio'
import { Notify } from 'vant';
import FileUploadView from "@/components/FileUploadViewType.vue";
Vue.use(Notify)
Vue.use(DatetimePicker);
Vue.use(Toast);
Vue.use(Divider);
export default {
  name: "finishGoods",
  components: {
    FileUploadView
  },
  data() {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // 设置为今天的最后一
    return {
      stopDate: "",
      username: '',
      password: '',
      value: '',
      showCalendar: false,
      goodsData: [],
      minDate: new Date(2010, 0, 1),
      maxDate: today,
      value: '',
      showPicker: false,
      stopCalendar: false,
      uploader: [],
      isActive: 0,
      title: '',
      goodsId: "",
      showCreateDates: false,
      text: "",
      //如果是修改文件禁用其他禁用
      fileDisabled: false,
      fileList01: [],
      fileList02: [],
      // fileList1:[],
      // fileList2:[]
    };
  },
  created() {
    this.goodsId = this.$route.query.id
    // 带回来的编辑标识
    this.text = this.$route.query.text
    if (this.text == 'add') {
      this.goodsData = _.cloneDeep(JSON.parse(this.$route.query.goodData)).map(item => ({
        ...item,
        planDetailId: item.id,
        fileList01: [],
        fileList02: []
      }))
    }
    if (this.text == 'edit') {
      this.goodsData = _.cloneDeep(JSON.parse(this.$route.query.goodData)).map(item => ({
        ...item,
        planDetailId: item.id,
        // 回显图片
        fileList01: this.fileLists(item.fileByList),
        fileList02: this.fileListss(item.fileByList),
      }))
    }


  },
  methods: {
    // 用于编辑回显
    fileLists(data) {
      let imgUrl = JSON.parse(data)

      let img = [{ fileName: imgUrl.hgz[0].fileName, filePath: imgUrl.hgz[0].filePath }]
      return img
    },
    fileListss(data) {
      let imgUrl = JSON.parse(data)

      let img = [{ fileName: imgUrl.cjbg[0].fileName, filePath: imgUrl.cjbg[0].filePath }]
      return img
    },
    onSubmit(values) {

    },
    onConfirm(date) {
      this.gongyingDate = `${date.getMonth() + 1}/${date.getDate()}`;
      this.showCalendar = false;
    },
    chooseGoods() {
      this.$router.push({ path: '/selectGoods' })
    },
    showCalendars(data, index, title) {
      this.isActive = index
      this.title = title
      //生产日期
      if (title == 'show') {
        // this.goodsData[index]
        this.showCreateDates = true;
      }
      if (title == 'end') {
        this.showCalendar = true;
      }
      if (title == 'gong') {
        this.showCalendar = true;
      }

    },
    // // 日期格式化
    createConfirm(time) {
      const date = new Date(time);
      let dateString = date.toLocaleDateString().replace(/\//g, "-");

      // 分割字符串并补零
      const parts = dateString.split('-');
      const year = parts[0];
      let month = parts[1];
      let day = parts[2];

      month = month.length === 1 ? `0${month}` : month;
      day = day.length === 1 ? `0${day}` : day;
      if (this.title == 'show') {
        this.goodsData[this.isActive].createDate = `${year}-${month}-${day}`
        this.showCreateDates = false;
      }
      if (this.title == 'gong') {
        this.goodsData[this.isActive].supplyDate = `${year}-${month}-${day}`
        this.showCalendar = false;
      }
      if (this.title == 'end') {
        this.goodsData[this.isActive].updateDate = `${year}-${month}-${day}`
        this.showCalendar = false;
      }
      // 
      // 

    },
    passReadUpload(file, index) {

      let imgFile = new FormData();

      imgFile.append("businessType", '01');
      imgFile.append("key", file.file.name);
      imgFile.append("file", file.file);
      minioUpload(imgFile).then((res) => {
        if (res.code == 0) {
          this.$notify({
            type: 'success',
            message: "上传成功"
          });
          this.goodsData[index].fileList01 = [{
            name: res.data.fileName,
            url: res.data.filePath // 注意Vant通常使用url而不是path
          }];
          // this.$set(this.goodsData[index], 'certificateFileName', res.data.fileName); // 显示文件名
          // this.params.fileName = res.data.fileName
          // this.params.filePath = res.data.filePath
        }
      }).catch((err) => {
        this.$notify({
          type: 'warning',
          message: "上传失败"
        });
      })
    },
    //厂检
    checkReadUpload(file, index) {
      let imgFile = new FormData();
      imgFile.append("businessType", '01');
      imgFile.append("key", file.file.name);
      imgFile.append("file", file.file);
      minioUpload(imgFile).then((res) => {
        if (res.code == 0) {
          this.$notify({
            type: 'success',
            message: "上传成功"
          });
          this.goodsData[index].fileList02 = [{
            name: res.data.fileName,
            url: res.data.filePath // 注意Vant通常使用url而不是path
          }];
          // this.$set(this.goodsData[index], 'factoryFileName', res.data.fileName); // 显示文件名

          // this.params.fileName = res.data.fileName
          // this.params.filePath = res.data.filePath
        }
      }).catch((err) => {
        this.$notify({
          type: 'warning',
          message: "上传失败"
        });
      })
    },
    back() {
      window.history.back();
    },
    delgoods(index) {
      this.goodsData.splice(index)
    },
    save() {
      if (this.goodsData.length == 0) {
        Toast('没有可提交的内容');
        return;
      }

      // 先校验所有数据
      const isValid = this.goodsData.every((item) => {
        return (
          item.supplyDate &&
          item.createDate &&
          item.sendTotal &&
          item.packagingFm &&
          item.addr &&
          item.field2 &&
          item.fileList01 &&
          item.receiver &&
          item.fileList02 &&
          item.fileList01.length > 0 &&
          item.fileList02.length > 0
        );
      });

      if (!isValid) {
        Toast.fail('请完善信息');
        return;
      }
      let hgz = [] //合格证
      let cjbg = []
      let fileList = []
      this.goodsData.forEach((item) => {
        hgz.push({
          fileName: item.fileList01[0].fileName,
          filePath: item.fileList01[0].filePath,
        });
        cjbg.push({
          fileName: item.fileList02[0].fileName,
          filePath: item.fileList02[0].filePath,
        });
      });
      let materialCirculationDetailsTableParamList = this.goodsData.map((item) => ({
        ...item,
        fileByList: JSON.stringify({ hgz, cjbg })
      }))
      // 如果网络请求只有这个字段的值materialCirculationDetailsTableParamList，那就是缓存里的值被刷新没了，从头开始走流程就可以了
      let params = {
        ...this.$store.state.public.sendGoods,
        materialCirculationDetailsTableParamList: materialCirculationDetailsTableParamList //取出store里的物资数据用于保存
      }
      //保存
      if (this.text == 'add') {
        demandSaveSendGoods(params).then((res) => {
          if (res.code == 0) {
            Toast.success(res.data);
            this.$router.push({ path: "/Information" })
          }

        })
      }
      if (this.text == 'edit') {
        modifySendGoods(params).then((res) => {
          if (res.code == 0) {
            Toast.success(res.data);
            this.$router.push({ path: "/Information" })
          }

        })
      }
      // 只修改文件
      if (this.text == 'file') {
        modifySendGoods(params).then((res) => {
          if (res.code == 0) {
            Toast.success(res.data);
            this.$router.push({ path: "/Information" })
          }
        })

      }
    },
    //附件上传前
    beforeRead(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isFileName = file.name.length < 90;

      if (!isLt10M) {
        this.$notify({
          type: 'warning',
          message: '上传文件大小不能超过 10MB!',
        });
        return false;
      }
      if (!isFileName) {
        this.$notify({
          type: 'warning',
          message: '上传文件名过长!',
        });
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped lang="less">
.finish {
  height: 100vh;
  width: 100%;
  background: #f5f5f5;
  padding: 10px 10px 10px 10px;
  box-sizing: border-box;

  .main {
    height: calc(100vh - 150px);

    .box {

      // overflow: scroll;
      padding: 10px 10px 10px 10px;
      border-radius: 15px;
      background: #fff;
      margin-bottom: 10px;
      // margin: 10px 0;
    }

    .box::-webkit-scrollbar {
      display: none;
    }
  }

}

.list_title {
  position: relative;
}

.title::before {
  content: '';
  position: absolute;
  top: 50%;
  padding-left: 10px;
  width: 6px;
  height: 6px;
  background: blue;
}

/deep/.van-button--primary {
  background-color: #1989fa;
  border: 1px solid #1989fa;
}

// .dian{
//   background-color: blue;
//   height: 6px;
//   width: 6px;
// }</style>