<template>
  <div class="finish">
    <div class="main">
      <div v-if="goodsData.length>0">
        <div class="box" v-for="(item, index) in goodsData" :key="index">
        <div class="detail-base-info">
          <div class="detail-title-content" style="padding-right: 0px;">
                <img src="/static/icon-xqjh.png">
                <span>物资名称：</span>
                <span>{{ item.materialName }}</span>
                <div class="detail-title-status">
                    
                    <span @click="delgoods(index)" style="color: red;font-size: 0.3rem;">删除</span>
                </div>
            </div>
          <div>
            <ul class="detail-list-ul">
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
              <li style="color: red;">
                <span style="min-width: 4rem;">本次需求未发货数量：</span>
                <span>{{ item.ssendTotal }}</span>
              </li>
            </ul>
          </div>
        </div>
        <van-divider />
        <div class="detail-list-ul">
          <van-form ref="form">
            <van-field v-model="goodsData[index].sendTotal" required label="发货数量" placeholder="发货数量"
              input-align="right" />
            <van-field v-model="goodsData[index].packagingFm" @click.stop="fieldClick($event, 'packagingFm', index)" required label="包装形式" placeholder="请输入包装形式"
              input-align="right" />
            <van-field readonly clickable v-model="goodsData[index].manufactureDate" required name="datetimePicker"
              :value="goodsData[index].manufactureDate" label="生产日期" placeholder="点击选择日期"
              @click="showCalendars(item, index, 'show')" input-align="right" />
            <van-field readonly clickable v-model="goodsData[index].expirationDate" name="datetimePicker"
              :value="goodsData[index].expirationDate" label="有效截止日期" placeholder="有效截止日期"
              @click="showCalendars(item, index, 'end')" input-align="right" />
            <van-field v-model="goodsData[index].field2" label="收货地址" required placeholder="收货地址" input-align="right" />
            <van-field readonly clickable v-model="goodsData[index].supplyDate" name="datetimePicker" required
              :value="goodsData[index].supplyDate" label="供应时间" placeholder="点击选择时间"
              @click="showCalendars(item, index, 'gong')" input-align="right" />
            <van-field v-model="goodsData[index].receiver" name="收货人" required label="收货人和电话" placeholder="收货人"
              input-align="right" />
            <van-field v-model="goodsData[index].addr" label="使用地点" placeholder="使用地点" input-align="right" disabled />
            <van-field v-model="goodsData[index].field0" :name="goodsData[index].field0" label="投资方" required
              placeholder="投资方" disabled input-align="right" />
            <van-field v-model="goodsData[index].field1" name="投资比例" required label="投资比例" disabled placeholder="投资比例"
              input-align="right" />

            <van-field v-model="goodsData[index].remark" label="备注" placeholder="请输入备注" input-align="right" />
          </van-form>
        </div>
        <div style="padding-right: 0.5rem;">
          <file-upload-view title="合格证附件" :fileList="goodsData[index].fileList01" businessType="01" />
          <file-upload-view title="厂检报告附件" :fileList="goodsData[index].fileList02" businessType="01" />
        </div>
      </div>
      </div>
      <div v-else>
        <van-empty description="暂无数据" />
      </div>
    </div>

    <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="editBack(text, params.id)"
        v-if="text == 'edit'">上一步</van-button>
      <van-button class="button-info" round type="info" @click="back" v-else>上一步</van-button>
      <van-button class="button-info" round type="info" @click="save">保存</van-button>
    </div>
    <!-- 生产日期 -->
    <van-calendar v-model="showCreateDates" @confirm="createConfirm" :min-date="minDate" :max-date="maxDate" />
    <van-calendar v-model="showCalendar" @confirm="createConfirm" />
    <history-list ref="historyList" @historyClick="historyClick"></history-list>
    <back-to-top className=".default-container"></back-to-top>
  </div>

</template>

<script>
import Vue from 'vue';
import BackToTop from '@/components/BackToTop'
import { Divider } from 'vant';
import { Toast } from 'vant';
import { DatetimePicker } from 'vant';
import historyList from '@/components/historyList'
import _ from 'lodash'
import { demandSnedGoods, demandSnedGoodsUpload, demandSaveSendGoods } from '@/api/demand/demandManagement'
import { modifySendGoods, detailBySendEdit } from '@/api/demand/sendGoods'
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
    FileUploadView,
    historyList,
    BackToTop
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
      params: {},
      planId:""
      // fileList1:[],
      // fileList2:[]
    };
  },
  created() {
    this.goodsId = this.$route.query.id
    // 带回来的编辑标识
    this.text = this.$route.query.text,
    this.planId = this.$route.query.planId
    if (this.text == 'add') {
      this.goodsData = _.cloneDeep(JSON.parse(this.$route.query.goodData)).map(item => ({
        ...item,
        planDetailId: item.id,
        fileList01: [],
        fileList02: [],
        manufactureDate:'',
        expirationDate:"",
        sendTotal: item.ssendTotal
      }))
    }
    if (this.text == 'edit') {
      let editGoodsData = JSON.parse(this.$route.query.goodData)
      console.log(editGoodsData,'1111')
      if(Array.isArray(editGoodsData) && editGoodsData.length>0){
        
        this.goodsData = editGoodsData.map(item => ({
        ...item,
        planDetailId: item.id,
        fileList01: [],
        fileList02: [],
        manufactureDate:'',
        expirationDate:"",
        sendTotal: item.ssendTotal
      }))
      }else{
        this.editDetails()
      }
      
    }
  },
  activated() {
    const finallyData = this.historyCache({ packagingFm: ''}, 0)
    const goodsData = this.goodsData.concat(finallyData)
    let obj = {}
    this.goodsData = goodsData.reduce((cur, next) => {
      obj[next.uniqueNumber || next.allocationUniqueNumber] ? "" : obj[next.uniqueNumber || next.allocationUniqueNumber] = true && cur.push(next);
      return cur;
    }, [])
    this.$store.dispatch('public/setMateriaList', this.goodsData)
  },
  methods: {
     init() {
      const finallyData = this.historyCache({ packagingFm: '' }, 0)
      
      this.goodsData.push(...finallyData)
     
    },
        historyCache(obj, index, isDefault) {
      const data = this.$store.state.public.materiaList || []
      const historyList = this.$store.state.public.historyList || {}
      if (historyList) {
        for (const key in obj) {
          if (historyList[key]) {
            obj[key] = historyList[key][index] || ''
          }
        }
      }
      if (isDefault) {
        return obj
      }
      const finallyData = data.map((item) => Object.assign({}, item, {
        packagingFm:item.packagingFm
      }))
      return finallyData
    },
    fieldClick($event, name, index) {
      this.$refs.historyList.init($event, name, index)
    },
     historyClick(data, name, index, historyIndex) {
      let obj = { packagingFm: '' }
      let finallyData = this.historyCache(obj, historyIndex, true)
      for (var key in finallyData) {
        if (finallyData[key] == '') {
          delete finallyData[key]
        }
      }
      this.$set(this.goodsData, index, Object.assign({}, this.goodsData[index], finallyData))
    },
    // 编辑回显
    editDetails() {
      detailBySendEdit(this.goodsId).then((res) => {
        if (res.code == 0) {
          this.params = res.data
          // 存到缓存里
          this.$store.dispatch('public/setGoodsSelect', res.data.materialCirculationDetailsTableDTOS)
          if (res.data.materialCirculationDetailsTableDTOS && res.data.materialCirculationDetailsTableDTOS.length > 0) {
            this.goodsData = res.data.materialCirculationDetailsTableDTOS.map(item => {
              // 辅助函数：格式化日期为 YYYY-MM-DD
              const formatDate = (dateString) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
                const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）
                return `${year}-${month}-${day}`;
              };

              return {
                ...item,
                manufactureDate: formatDate(item.manufactureDate),
                supplyDate: formatDate(item.supplyDate),
                expirationDate: formatDate(item.expirationDate),
                planDetailId: item.id,
                sendTotal: item.ssendTotal,
                fileList01: this.fileLists(item.fileByList),
                fileList02: this.fileListss(item.fileByList),
              };
            })
          }

           let  params = {
              shippingDate: this.params.shippingDate,
              arrivalDate: this.params.arrivalDate,
              carNumber: this.params.carNumber,
              contacts: this.params.contacts,
              contactsPhone: this.params.contactsPhone,
              contractName: this.params.contractName,
              fileByList: this.params.fileByList,
              fileList: this.params.fileList,
              id: this.params.id,
              oddNumbers: this.params.oddNumbers,
              planId: this.params.planId,
              planName: this.params.planName,
              sectionName: this.params.sectionName,
              shipmentBatchNumber: this.params.shipmentBatchNumber,
              shippingAddress: this.params.shippingAddress,
            }
             // 存到缓存里
          this.$store.dispatch('public/setEditGoods', params)
        }
      })
    },
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
        this.goodsData[this.isActive].manufactureDate = `${year}-${month}-${day}`
        this.showCreateDates = false;
      }
      if (this.title == 'gong') {
        this.goodsData[this.isActive].supplyDate = `${year}-${month}-${day}`
        this.showCalendar = false;
      }
      if (this.title == 'end') {
        this.goodsData[this.isActive].expirationDate = `${year}-${month}-${day}`
        this.showCalendar = false;
      }
    },
    back() {
      window.history.back();
    },
    editBack(text, id) {
      // 如果缓存里有数据就带变有可选地物资
     this.$router.push({ path: '/selectGoods', query: { text: text, id: id,id:this.goodsId,planId:this.planId } })

    },
    delgoods(index) {
      this.goodsData.splice(index,1)
    },
    validateForm() {
      // 存储所有错误信息
      const errors = {};
    
      // 遍历 goodsData，逐项验证
      this.goodsData.forEach((item, index) => {
         // 发货数量：必填且必须大于0
        if (item.sendTotal === undefined || item.sendTotal === null || item.sendTotal === "") {
          errors[`goodsData[${index}].sendTotal`] = "请填写发货数量";
        } else if (Number(item.sendTotal) <= 0) {
          errors[`goodsData[${index}].sendTotal`] = "发货数量必须大于0";
        }
         if (!item.packagingFm) {
          errors[`goodsData[${index}].packagingFm`] = "请填写包装形式";
        }
         if (!item.manufactureDate) {
          errors[`goodsData[${index}].manufactureDate`] = "请选择生产日期";
        }
         if (!item.field2) {
          errors[`goodsData[${index}].field2`] = "请填写收货地址";
        }
        if (!item.supplyDate) {
          errors[`goodsData[${index}].supplyDate`] = "请选择供应时间";
        }
        if (!item.receiver) {
          errors[`goodsData[${index}].receiver`] = "请填写收货人";
        }
        if (!item.fileList01 || item.fileList01.length === 0) {
          errors[`goodsData[${index}].fileList01`] = "请上传合格证附件";
        }
        if (!item.fileList02 || item.fileList02.length === 0) {
          errors[`goodsData[${index}].fileList02`] = "请上传厂检报告附件";
        }
      });
 
        // 如果有错误，显示第一个错误并返回 false
        if (Object.keys(errors).length > 0) {
          const firstErrorKey = Object.keys(errors)[0];
          Toast.fail(errors[firstErrorKey]); // 显示第一个错误提示
          return false;
        }
      
        return true; // 验证通过
      },
    save() {
      if (this.goodsData.length == 0) {
        Toast('没有可提交的内容');
        return;
      }
      if(!this.validateForm()){
        return
      }
      // 给字段加缓存
      let obj = { packagingFm: [] }
      obj.packagingFm = this.goodsData.map(item => item.packagingFm)

      this.goodsData.forEach((item) => {
        let fileByList = {};
        //报验结果
        if (item.fileList01.length > 0) {
          this.$set(fileByList, "hgz", item.fileList01);
        }
        if (item.fileList02.length > 0) {
          this.$set(fileByList, "cjbg", item.fileList01);
        }
        item.fileByList = JSON.stringify(fileByList);
      });
      let materialCirculationDetailsTableParamList = this.goodsData
      //保存
      if (this.text == 'add') {
        // 如果网络请求只有这个字段的值materialCirculationDetailsTableParamList，那就是缓存里的值被刷新没了，从头开始走流程就可以了
        let params = {
          ...this.$store.state.public.sendGoods,
          materialCirculationDetailsTableParamList //取出store里的物资数据用于保存
        }
        demandSaveSendGoods(params).then((res) => {
          if (res.code == 0) {
             this.$store.dispatch('public/setHistoryList', obj)
            Toast.success(res.data);
            this.$router.push({ path: "/Information" })
          }

        })
      } else {
        // 判断缓存里有没有编辑好的基础信息
        let dataList = this.$store.state.public.editSendGoods
        let params = {}
        if (dataList.shippingDate) {
          params = {
            ...this.$store.state.public.editSendGoods,
            materialCirculationDetailsTableParamList //取出store里的物资数据用于保存
          }
        } else {
          params = {
            ...this.$store.state.public.editGoods,
            materialCirculationDetailsTableParamList //取出store里的物资数据用于保存
          }
        }
        modifySendGoods(params).then((res) => {
          if (res.code == 0) {
            Toast.success(res.data);
            this.$router.push({ path: "/Information" })
          }

        })
      }
    },
    formattedCreateDate(timestamp) {
      if(!timestamp) return ''
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0
      return `${year}-${month}-${day}`;
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
/deep/.van-divider {
  margin: 0.2rem 0 !important;
}

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
.detail-list-ul {
    padding: 0.125rem 0.3rem 0.125rem 0.525rem;
    // margin: 0 !important;
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