<template>
  <div class="save-materials" ref="container">
      <div class="detail-base-info">
        <div class="detail-title-text">
          <p>需求名称：</p>
          <p>{{ goodsMsg.planName }}</p>
        </div>
        <div class="detail-ul-text">
          <ul class="detail-ul">
            <li>
              <span>建设项目：</span>
              <span>{{ goodsMsg.projectName }}</span>
            </li> 
            <li>
              <span>标段项目：</span>
              <span>{{ goodsMsg.sectionName }}</span>
            </li>
            <li>
              <span>合同名称：</span>
              <span>{{ goodsMsg.contractName }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="detail-base-info detail-base-info-edited">
      <template v-if="params.receiver || status === '2'">
        <div class="detail-title-content detail-title-edited-p">
          <p>
            <img src="@/assets/img/Icon-address.png" />
            <span>发货信息</span>
          </p>
          <p v-show="status !== '2'" @click="receiptClick">
            <img src="@/assets/img/Icon-edit.png" />
            <span>更改</span>
          </p>
        </div>
        <div class="detail-ul-text">
          <ul class="detail-ul">
            <li>
              <span>{{ params.receiver }} {{ params.phone }}</span>
            </li>
            <!-- <li>
              <span>使用地点：</span>
              <span>{{ params.addr }}</span>
            </li> -->
            <li>
              <span>发货地址：</span>
              <span>{{ params.shippingAddress }}</span>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>
        <div class="detail-title-content">
          <img src="@/assets/img/Icon-address.png" />
          <span>发货信息</span>
        </div>
        <div class="detail-title-content-edited">
          <span>还未完善发货信息，请点击下方按钮</span>
        </div>
        <div class="detail-title-content-edited detail-title-content-edited-button">
          <van-button type="default" plain round @click="receiptClick">选择发货</van-button>
          <van-button plain round type="info" @click="createClick"><img src="@/assets/img/Icon-plus.png"
              class="detail-title-content-edited-add" />新建</van-button>
        </div>
      </template>
    </div>

    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0;">
      <template>
        <div class="detail-title-content">
          <img src="@/assets/img/Icon-invest.png" />
          <span>物流信息</span>
        </div>
         <div class="detail-ul-text" v-if="status === '2'">
          <ul class="detail-ul">
            <li>
              <span>物流单号：</span>
              <span>{{ params.oddNumbers }}</span>
            </li>
            <li>
              <span>发货日期：</span>
              <span>{{ params.shippingDate }}</span>
            </li>
            <li>
              <span>预计送到时间：</span>
              <span>{{ params.arrivalDate }}</span>
            </li>
            <li>
              <span>车牌号：</span>
              <span>{{ params.carNumber }}</span>
            </li>
          </ul>
        </div>
        <div v-else>
                    <van-field
            v-model="params.oddNumbers"
            :disabled="fileDisabled"
            label="物流单号"
            placeholder="物流单号"
            input-align="right"
          />
          <!-- <van-field
            v-model="params.shippingAddress"
            :disabled="fileDisabled"
            @click.stop="fieldClick($event, 'shippingAddress')"
            required
            label="发货地址"
            placeholder="发货地址"
            input-align="right"
            :rules="[{ required: true, message: '请填写发货地址' }]"
          /> -->
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
            @click="handlerShowCalendar('calendar')"
            :rules="[{ required: true, message: '请填写发货日期' }]"
          />
          <!-- <van-calendar v-model="showCalendar" @confirm="onConfirm" /> -->
          <Calendar ref="calendar" @onConfirm="onConfirm" />
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
            @click="handlerShowCalendar('calendar2')"
            :rules="[{ required: true, message: '请填写预计送达时间' }]"
          />
          <!-- <van-calendar v-model="sendStop" @confirm="onStopConfirm" /> -->
          <Calendar ref="calendar2" @onConfirm="onStopConfirm" />
          <van-field
            v-model="params.carNumber"
            label="车牌号"
            @click.stop="fieldClick($event, 'carNumber')"
            :disabled="fileDisabled"
            type="text"
            placeholder="车牌号"
            input-align="right"
          />
        </div>
      </template>
    </div>

    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>发货单附件</span>
      </div>
      <p class="box-container-p" v-if="!fileList.length"><span class="li-span-red">*</span>必填项，请选择文件上传，支持pdf、jpg、png、jpeg格式</p>
      <file-upload-view accept=".jpg,.png,.jpeg,.pdf" :fileList="fileList || []" businessType="01" class="outbound-field-uploader" />
    </div>

    <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0; margin-bottom: 5px;">
      <div class="detail-title-content">
        <img src="/static/icon-file.png">
        <span>装车照片</span>
      </div>
      <p class="box-container-p" v-if="!zczp.length">请选择文件上传，支持JPG格式</p>
      <file-upload-view-type
            :required="false"
            class="outbound-field-uploader"
            :fileList="zczp || []"
            businessType="01"
            accept=".jpg,.png,.jpeg,.pdf"
            :maxCount="100"
          />
    </div>

    <div class="detail-floor-content" v-if="status !== '2'">
      <div >
        <van-button type="default" :class="{ 'van-button-selected': btnClickIndex == '0' }"
          @click="btnClick('0')">全部物资</van-button>
        <van-button type="default" :class="{ 'van-button-selected': btnClickIndex == '1' }"
          @click="btnClick('1')">未完善物资</van-button>
      </div>
      <span @click="returnClick"><span class="detail-floor-content-add">+</span>添加物资</span>
    </div>
    <div v-else class="detail-floor-content detail-header">
      <img src="/static/icon-return.png"/>
      <span>物资明细（共{{btnClickIndex == '0' ? materiaList.length : editMateriaList.length}}项）</span>
    </div>

    <div class="box-container" v-for="(item, index) in btnClickIndex == '0' ? materiaList : editMateriaList" :key="item.id"
      :class="item.manufactureDate && item.packagingFm && item.fileList01?.length > 0 ? '' : 'box-container-unedited'">
      <div class="div-child">
        <ul class="detail-list-ul">
          <li class="detail-list-ul-text">
            <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
            <img
              :src="item.manufactureDate && item.packagingFm && item.fileList01?.length > 0  ? editedStatus : editStatus" />
          </li>
          <!-- <li>
            <span>供应商：</span>
            <span>{{ item.sellerName }}</span>
          </li> -->
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li>
            <span>本次计划数量：</span>
            <span v-if="item.planAmount">{{ item.planAmount }}</span>
            <span v-else class="li-span-grey">填写</span>
          </li>
          <li>
            <span>本次需求未发货数量：</span>
            <span>{{ item.ssendTotal }}</span>
          </li>
          <li>
            <span>发货数量：</span>
            <span class="li-span-click">{{ item.sendTotal }}</span>
          </li>
          <li>
            <span>收货人及联系方式：</span>
            <span>{{ item.receiver }}</span>
          </li>
          <!-- <li>
            <span>计量单位：</span>
            <span>{{ item.unit }}</span>
          </li>
          <li v-if="item.amount">
            <span>合同数量：</span>
            <span class="li-span-click">{{ item.amount }}</span>
          </li>
          <li class="li-item-overlength" v-if="item.cumulativeAmount">
            <span>累计计划量（含本次）：</span>
            <span class="li-span-click">
              {{ item.cumulativeAmount }}
            </span>
          </li>
          <li>
            <span>供应时间：</span>
            <span v-if="item.supplyDate">{{ item.supplyDate }}</span>
            <span v-else class="li-span-grey">填写</span>
          </li>
          <li>
            <span>收货人联系方式：</span>
            <span v-if="item.receiver">{{ item.receiver }}</span>
            <span v-else class="li-span-grey">填写</span>
          </li> -->
        </ul>
      </div>
      <div class="list-ul-button" v-if="status !== '2'">
        <van-button class="button-info" plain round type="info" native-type="button"
          @click="editedClick(item, index)">编辑</van-button>
        <van-button class="button-info" plain round native-type="button" @click="deleteClick(index)">删除</van-button>
      </div>
    </div>

        <div class="default-button-container">
      <div class="default-button-container-selected">
        <span>已填写 <span class="li-span-click">{{ editedMateriaList.length }}</span><span>/{{ materiaList.length }}</span>
        </span>
      </div>
      <div class="default-button-container-button">
        <van-button  :class="{'van-button--disabled': !isFlag}" class="button-info" round type="info" @click="onSubmit">保存</van-button>
        
        <!-- <p style="font-size: 12px;" v-if="!isFlag"><van-icon name="warning-o" color="#1989fa" /> 提示： <span>请完善所有物资发货信息</span></p> -->
      </div>
    </div>

      <!-- <div class="list-ul" style="margin-top: 26px; padding: 10px">
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
        <div style="padding-right: 0.3rem">
          <file-upload-view
            :required="false"
            class="outbound-field-uploader"
            title="装车照片"
            :fileList="zczp"
            businessType="01"
            accept=".jpg"
            :maxCount="100"
          />
        </div>
      </div> -->
      <!-- 编辑里的选择发货物资传的是planId -->
      <!-- <div class="default-button-container">
        <van-button
          size="mini"
          type="primary"
          round
          class="button-info"
          @click="chooseGoods(goodsId, text)"
          v-if="this.text == 'add'"
          >选择发货物资</van-button
        >
        <van-button
          size="mini"
          type="primary"
          round
          class="button-info"
          @click="editGoods('edit')"
          v-if="text == 'edit'"
          >选择发货物资</van-button
        >
      </div> -->
    <history-list ref="historyList" @historyClick="historyClick"></history-list>
    <!-- <edited-list ref="editedList" :editedData="materiaList" :editedMateriaList="editedMateriaList"
      @editedClick="editedClick"></edited-list> -->
  </div>
</template>
<script>
import Vue from "vue";
import editedStatus from '@/assets/img/editedStatus.png'
import editStatus from '@/assets/img/editStatus.png'
import editedList from './components/editedList'
import { Form } from "vant";
import { Field } from "vant";
import {
  demandSnedGoods,
  demandSnedGoodsUpload,
  demandSaveSendGoods,
} from "@/api/demand/demandManagement";
import { minioUpload } from "@/api/blcd-base/minio";
import { detailBySendEdit,detailByUpdateSend, modifySendGoods} from "@/api/demand/sendGoods";

import keepPages from "@/view/mixins/keepPages";
import historyList from "@/components/historyList";
import FileUploadView from "@/components/FileUploadView.vue";
import FileUploadViewType from "@/components/FileUploadViewType.vue";
import Calendar from "@/layout/components/calendar.vue";

import { Toast } from "vant";
import { Notify } from "vant";
Vue.use(Notify);
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);

export default {
  name: "SendGoods",
  mixins: [keepPages],
  components: { FileUploadView, historyList, FileUploadViewType, Calendar },
  data() {
    return {
      btnClickIndex: '0',
      materiaList: [],
      editMateriaList: [],
      editedMateriaList: [],
      editedStatus,
      editStatus,
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
      // 装车照片
      zczp: [],
      // 传过来的标识，用来判断是新增还是编辑
      text: "",
      fileDisabled: false,
      fileByList: "",
      planId:'',
      // 1未发货 2货运中 3已完成 供应中的物资仅允许修改附件信息
      status:'',
    };
  },
  computed: {
    isFlag() {
      const { receiver, arrivalDate } = this.params;

      let flag = false;

      this.materiaList.forEach(item => {
        if (item.manufactureDate && item.packagingFm && item.fileList01?.length > 0 ) {
          flag = true;
        } else {
          flag = false;
        }
      })

      return this.fileList?.length > 0 && receiver && arrivalDate && flag;
    }
  },
  activated() {
    // this.text = this.$route.query.text;
    // this.goodsId = this.$route.query.id;
    // this.planId = this.$route.query.planId;
    
    const historyData = this.$store.state.public.historyData || {};
    
    if (JSON.stringify(historyData) === '{}') {
      this.init()
      return
    }

    historyData.shippingAddress = historyData.shippingAddress || historyData.receiveraddress
    historyData.contacts = historyData.contacts || historyData.receiver
    historyData.contactsPhone = historyData.contactsPhone || historyData.phone
    
    const shipmentsInfo = this.$store.state.public.shipmentsInfo || {};

    if (Object.keys(shipmentsInfo).length > 0) {
      this.params = Object.assign({}, shipmentsInfo, historyData);
    } else {
      this.params = Object.assign({}, this.params, historyData)
    }

    // this.$store.dispatch('public/setHistoryData', {})
  },
  created() {
    this.init();
  },

  methods: {
    init() {
    this.text = this.$route.query.text;
    this.goodsId = this.$route.query.id;
    this.planId = this.$route.query.planId;
    

    //编辑
    if (this.text == "edit") {
      this.editDetails();
    }
    // 增加
    if (this.text == "add") {
      this.materiaList = this.historyCaches('selectGoodData');
    
      this.$store.dispatch('public/setSelectGoodData', this.materiaList)

      const shipmentsInfo = this.$store.state.public.shipmentsInfo || {};

      if (Object.keys(shipmentsInfo).length > 0) {
        this.params = Object.assign({}, this.params, shipmentsInfo);
      } else {
        this.params = {};
        this.fileList = [];
        this.zczp = [];
      }

      this.getSendGoods();
    }
    // 默认当前时间
    this.params.shippingDate = this.todayTime();
    },
    historyCaches(dataFun) {
      const data = this.$store.state.public?.[dataFun] || []
      const finallyData = data.map((item) => Object.assign({}, item, {
        supplyDate: item.supplyDate || parseTime(new Date(), '{y}-{m}-{d}'),
        minDate: this.minDate,
        showDatePicker: this.showDatePicker,
        planAmount: item.planAmount || item.amount - item.cumulativeAmount,
        allocationUniqueNumber: item.uniqueNumber || item.allocationUniqueNumber,
        field2: item.field2 || item.deliveryLocation,
      }))


      this.editedMateriaList = finallyData.filter(item => item.manufactureDate && item.packagingFm && item.fileList01?.length > 0 )
      this.editMateriaList = finallyData.filter(item => !(item.manufactureDate && item.packagingFm && item.fileList01?.length > 0 ))

      return finallyData
    },
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
    handlerShowCalendar(elementName) {
      this.$refs[elementName]?.handleCalendarShow();
    },
    // 编辑回显
    editDetails() {
      detailByUpdateSend(this.goodsId).then((res) => {
        if (res.code == 0) {
          // Toast.clear()
          // this.goodsMsg.planNumber = planNumber;
          // this.goodsMsg.sectionName = sectionName;
          // this.goodsMsg.contractName = contractName;
          this.status = res.data.status

          res.data.receiver = res.data.contacts;
          res.data.phone = res.data.contactsPhone;

          this.goodsMsg = res.data;

          const shipmentsInfo = this.$store.state.public.shipmentsInfo || {};

          const historyData = this.$store.state.public.historyData || {};

          if (Object.keys(shipmentsInfo).length > 0) {
            if (Object.keys(historyData).length > 0) {
                  historyData.shippingAddress = historyData.shippingAddress || historyData.receiveraddress
                  historyData.contacts = historyData.contacts || historyData.receiver
                  historyData.contactsPhone = historyData.contactsPhone || historyData.phone

                  this.params = Object.assign({}, this.params, shipmentsInfo, historyData);
            } else {
              this.params = Object.assign({}, this.params, shipmentsInfo);
            }
          } else {
            this.params = res.data;
            this.fileList = [];
            this.zczp = [];
          }

          const data = this.$store.state.public.selectGoodDataEdit?.length > 0 ? this.$store.state.public.selectGoodDataEdit : res.data?.materialCirculationDetailsTableDTOS;  

          const newData = data?.map(el => {
            let oldplanDetailId;

            if (this.text == "add") {
              oldplanDetailId = el.id;
            } else {
              oldplanDetailId = el.planDetailId;
            }

            return {
              ...el,
              manufactureDate:el?.manufactureDate ? this.formatDate(el.manufactureDate) : '',
              supplyDate: el?.supplyDate ? this.formatDate(el.supplyDate) : '',
              expirationDate: el.expirationDate ? this.formatDate(el.expirationDate):el.expirationDate,
              planDetailId: oldplanDetailId,
              sendTotal: el.sendTotal,
              fileList01: el?.fileList01 ? el.fileList01 : this.fileLists(el.fileByList),
              fileList02: el?.fileList02 ? el.fileList02 :this.fileListss(el.fileByList),
            }
          });

          this.$store.dispatch('public/setSelectGoodDataEdit', newData);

          this.materiaList = this.historyCaches('selectGoodDataEdit');

          let file = JSON.parse(res.data.fileByList);

           if (!this.params?.fileList?.length) {
            this.fileList.push({
              fileName: file.fhd[0].fileName,
              filePath: file.fhd[0].filePath,
            });
           } else {
            this.fileList = this.params.fileList;
           }


          // this.fileByList = file.fhd[0].fileName;
          this.params.shippingDate = this.formattedCreateDate(
            res.data.shippingDate
          );
          this.params.arrivalDate = this.formattedCreateDate(
            res.data.arrivalDate
          );
          // 装车照片
          if (!this.params?.zczp?.length) {
              this.zczp = file.zczp || []
           } else {
            this.zczp = this.params.zczp;
           }
          
        }
      });
    },
    // 用于编辑回显
    fileLists(data) {
      try {
        let imgUrl = JSON.parse(data)

        let img = [{ fileName: imgUrl.hgz[0].fileName, filePath: imgUrl.hgz[0].filePath }]
        return img
      } catch (error) {
        return []
      }
    },
    fileListss(data) {
      try {
        let imgUrl = JSON.parse(data)

        let img = [{ fileName: imgUrl.cjbg[0].fileName, filePath: imgUrl.cjbg[0].filePath }]
        return img
      } catch (error) {
        return []
      }
    },
    formatDate(dateString){
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）
      return `${year}-${month}-${day}`;
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
      this.$forceUpdate();
      // this.showCalendar = false;
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
      this.$forceUpdate();
      // this.sendStop = false;
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
          //装车照片
          let zczp = this.zczp.map(item => ({ fileName: item.fileName, filePath: item.filePath }))
          let fileByList = JSON.stringify({ fhd, zczp });
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
    containsChinese(str) {
      return /[\u4e00-\u9fa5]/.test(str);
    },
    onSubmit() {
     
      // console.log(this.$store.state.public.sendGoods, "this.$store.state.public.sendGoods")
      // console.log(this.params, this.fileList, this.materiaList, this.goodsMsg.sectionName, this.goodsMsg.planName, this.goodsMsg.id, "发货传参")
      if (this.containsChinese(this.params.oddNumbers)) {
        this.$notify({
          type: 'warning',
          message: '[物流单号]不可输入中文字符!',
        });
        return
      }

      if(!this.isFlag){
        this.$notify({
          type: 'warning',
          message: '请完善发货信息',
        });
        return
      }

      Toast.loading({
        duration: 0,
        message: '正在请求中...',
        forbidClick: true,
      });

      this.materiaList.forEach((item) => {
        let fileByList = {};
        //报验结果
        if (item.fileList01.length > 0) {
          this.$set(fileByList, "hgz", item.fileList01);
        }
        if (item.fileList02.length > 0) {
          this.$set(fileByList, "cjbg", item.fileList02);
        }
        item.fileByList = JSON.stringify(fileByList);
        if (this.text == "add") {
          item.planDetailId = item.id;
        } else {
          item.planDetailId = item.planDetailId;
        }
      });

      let fileByList = JSON.stringify({ fhd: this.fileList, zczp: this.zczp });

      let params = {
        ...this.params,
        fileList: this.fileList,
        materialCirculationDetailsTableParamList: this.materiaList,
        sectionName: this.goodsMsg.sectionName,
        planName: this.goodsMsg.planName,
        planId: this.goodsMsg.id,
        contractName: this.goodsMsg.contractName,
        fileByList: fileByList,
        oddNumbers: this.params?.oddNumbers || '',
      }

      const { addr, receiveraddress, phone, receiver, ...rest } = params;


      if (this.text == 'add') {
        demandSaveSendGoods(rest).then((res) => {
          if (res.code == 0) {
            Toast.success(res.data);
            this.$router.push({ path: "/Information" })
          }
        }).finally(() => {
                Toast.clear()
            })
      } else {
        modifySendGoods(rest).then((res) => {
          if (res.code == 0) {
            Toast.success(res.data);
            this.$router.push({ path: "/Information" })
          }
        }).finally(() => {
                Toast.clear()
              })
      }
    },
    btnClick(code) {
      this.btnClickIndex = code
    },
    editedClick(item, index) {
      this.$store.dispatch('public/setHistoryData', {});

      this.$store.dispatch('public/setMateriaData', { ...item, phone: '', receiver: item.receiver })

      this.$store.dispatch('public/setShipmentsInfo', { ...this.params, fileList: this.fileList, zczp: this.zczp })
      // const query = this.text == 'edit' ? { contractId: this.contractId, type: this.text, id: this.queryId } : { contractId: this.contractId }
      const query = { type: this.text, id: this.goodsId, planId: this.planId }
      this.$router.push({ name: 'EditedMaterialGoods', query })
    },
    deleteClick(index) {
      const row = this.materiaList[index]
      const uniqueNumber = row.uniqueNumber || row.allocationUniqueNumber
      this.editedMateriaList = this.editedMateriaList.filter(item => !(uniqueNumber === item.uniqueNumber || uniqueNumber === item.allocationUniqueNumber))
      this.editMateriaList = this.editMateriaList.filter(item => !(uniqueNumber === item.uniqueNumber || uniqueNumber === item.allocationUniqueNumber))
      this.materiaList.splice(index, 1)
      if(this.text == 'add') {
        this.$store.dispatch('public/setMateriaList', this.materiaList)
      } else {
        this.$store.dispatch('public/setSelectGoodDataEdit', this.materiaList)
      }
    },
    returnClick() {
      this.$store.dispatch('public/setHistoryData', {})
      // const query = this.queryType == 'update' ? { contractId: this.contractId, type: this.queryType, id: this.queryId, materialUsedRatio: this.materialUsedRatio } : { contractId: this.contractId, materialUsedRatio: this.materialUsedRatio }
      this.$store.dispatch('public/setShipmentsInfo', { ...this.params, fileList: this.fileList, zczp: this.zczp })
      const query = { planId: this.planId, text: this.text, id: this.goodsId };


      this.$router.push({ name: 'selectGoods', query })
    },
    receiptClick() {
      this.$store.dispatch('public/setHistoryData', {})

      this.$store.dispatch('public/setShipmentsInfo', { ...this.params, fileList: this.fileList, zczp: this.zczp })

      const {id, text, planId} = this.$route.query;
      this.$router.push({ name: 'ReceiptLists', query: { planId, type: text, id } })
    },
    createClick() {
      this.$store.dispatch('public/setHistoryData', {})

      this.$store.dispatch('public/setShipmentsInfo', { ...this.params, fileList: this.fileList, zczp: this.zczp })

      this.$router.push({ name: 'ReceiptOperates', query: { type: 'create' } })
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
    scrollToSection() {
      const element = document.getElementsByClassName('box-container-unedited')
      if (element.length) {
        element[0].scrollIntoView({ behavior: 'smooth' })
        return false
      }
      return true
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
/deep/.van-calendar__popup.van-popup--bottom, .van-calendar__popup.van-popup--top{
    height: 94% !important;
}

.outbound-field-uploader {
  ::v-deep li {
    display: block;
  }

  ::v-deep .file-info {
    width: auto !important;

    img {
      min-width: auto !important;
    }
    span{
      text-align: left;
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



.save-materials {
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;

  .box-containerA{
    margin-bottom: 0;
    margin-top: 8px;
  }

    .detail-floor-content {
    justify-content: space-between;
    padding: 5px 12px 2px 12px;

    span {
      color: #151b3e;
      font-weight: 400;
    }

    .van-button {
      border-radius: 5px;
      margin-right: 8px;
      height: 30px;
    }

    .van-button-selected {
      span {
        color: #0861db;
      }
    }

    .detail-floor-content-add {
      color: #1189f6;
      padding-right: 2px;
      font-size: 16px;
      vertical-align: middle;
    }
  }

  .detail-base-info-edited {
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    margin-bottom: 8px;
    margin-top: 8px;
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

      img {
        width: 26px;
        height: 26px;
      }

      span {
        line-height: 26px;
        margin-left: 0;
      }
    }

    .box-container-p{
      font-size: 11px;
      color: #4a4a4a;
      text-align: center;
      margin-top: 22px;
      margin-bottom: 13px;
      span{
        vertical-align: middle;
      }
    }

    .detail-title-content-edited {
      margin: 21px;
      text-align: center;
      font-size: 12px;

      .van-button {
        width: 110px;
        height: 28px;
        margin-right: 6px;
        font-size: 12px;
      }

      .detail-title-content-edited-add {
        width: 16px;
        height: 16px;
        vertical-align: sub;
      }
    }

    .detail-title-content-edited-button {
      margin-top: 10px;
      margin-bottom: 12px;
    }

    .detail-list-ul-edited {
      border-bottom: 1px solid #e3e3e3;
    }

    .detail-base-info-edited-all {
      text-align: right;
      font-size: 12px;
      padding-top: 10px;
      padding-right: 16px;

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }

    .detail-title-content-field {
      padding-left: 20px;
      padding-right: 10px;
      padding-bottom: 5px;

      .detail-base-info-edited-textarea {
        background: #f6f6f6;
        border-radius: 10px;
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

        li {
          span {
            text-align: left;
          }
        }
      }
    }

    .detail-title-edited-p {
      justify-content: space-between;

      p {
        img {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }

        &:nth-child(2) {
          padding-right: 10px;

          span {
            font-weight: 400;
            font-size: 12px;
          }
        }
      }
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
      margin-left: 2px;
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

  .detail-title-text {
    padding: 0 12px;

    p {
      &:nth-child(1) {
        font-size: 11px;
        color: #1159cc;
        padding-bottom: 5px;
      }

      &:nth-child(2) {
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }

  .detail-ul-text {
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;

    .detail-ul {
      padding: 10px 8px;
    }
  }

  .detail-floor-content {
    justify-content: space-between;
    padding: 5px 12px 2px 12px;

    span {
      color: #151b3e;
      font-weight: 400;
    }

    .van-button {
      border-radius: 5px;
      margin-right: 8px;
      height: 30px;
    }

    .van-button-selected {
      span {
        color: #0861db;
      }
    }

    .detail-floor-content-add {
      color: #1189f6;
      padding-right: 2px;
      font-size: 16px;
      vertical-align: middle;
    }
  }
   .detail-floor-content.detail-header {
    justify-content: flex-start;
  }

  .detail-list-ul {
    padding-left: 12px;

    .detail-list-ul-text {
      justify-content: space-between;

      img {
        width: 18px;
        height: 18px;
        flex: none;
        margin-top: 4px;
      }
    }
  }

  .default-button-container {
    justify-content: space-between;
    padding-left: 14px;
    padding-right: 19px;
    box-sizing: border-box;
    box-shadow: 4px 0px 5px rgba(32, 30, 74, 0.1);

    .default-button-container-selected {
      font-size: 13px;

      span {
        vertical-align: middle;
      }

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }

      .default-button-container-selected-img {
        transform: rotate(180deg)
      }
    }

    .default-button-container-button{
      display: flex;
      flex-direction: column;
      .button-info{
        margin-left: 10px;
      }
    }

    .button-info {
      width: 120px;
      height: 34px;
    }

    ::v-deep .file-add{
      margin: 0;
      padding: 0;
    }
  }
}
</style>