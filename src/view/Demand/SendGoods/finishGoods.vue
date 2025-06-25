<template>
  <div class="finish">
   
    <div class="main">
     
      <div class="box" v-for="(item, index) in goodsData" :key="index">
        <div>
          <ul class="list-ul">
            <li class="list_title">
              <!-- <span class="dian"></span> -->
              <span class="font-weight">物资名称：</span>
              <span class="font-weight">{{ item.materialName }}</span>
            </li>
            <li>
              <span>规格型号：</span>
              <span>{{ item.specModel }}</span>
            </li>
            <li class="li-item-both">
              <div class="li-item-left">
                <span>计量单位:</span>
                <span>{{ item.unit }}</span>
              </div>
              <div class="li-item-right">
                <span>合同数量:</span>
                <span>{{ item.amount }}</span>
              </div>
            </li>
            <li class="li-item-both">
              <div class="li-item-right" style="color:red;">
                <span style="width: 500px;">本次需求未发货数量:</span>
                <span>{{ item.ssendTotal }}</span>
              </div>
            </li>
          </ul>
        </div>
        <van-divider />
        <div class="list-ul" style="margin-top: 26px;padding: 10px;">
          <van-form ref="form">
            <van-field v-model="goodsData[index].ssendTotal" name="发货数量" label="发货数量" placeholder="发货数量"
              input-align="right" :rules="[{ required: true, message: '请填写发货数量' }]" />
            <van-field v-model="goodsData[index].unit" name="包装形式" label="包装形式" placeholder="请输入包装形式" input-align="right"
              :rules="[{ required: true, message: '请填写包装形式' }]" />
            <van-field readonly clickable v-model="goodsData[index].createDate" name="datetimePicker"
              :value="goodsData[index].createDate" label="生产日期" placeholder="点击选择日期"
              @click="showCalendars(item, index, 'show')" :rules="[{ required: true, message: '请填写生产日期' }]"
              input-align="right" />


            <van-field readonly clickable v-model="goodsData[index].updateDate" name="datetimePicker"
              :value="goodsData[index].updateDate" label="有效截止日期" placeholder="有效截止日期"
              @click="showCalendars(item, index, 'end')" :rules="[{ required: true, message: '请填写有效截止日期' }]"
              input-align="right" />


            <van-field v-model="goodsData[index].addr" label="收货地址" placeholder="收货地址" input-align="right" />
            <van-field readonly clickable v-model="goodsData[index].supplyDate" name="datetimePicker"
              :value="goodsData[index].supplyDate" label="供应时间" placeholder="点击选择时间" @click="showCalendars(item, index, 'gong')" 
              :rules="[{ required: true, message: '请填写供应时间' }]" input-align="right" />

            <van-field v-model="goodsData[index].receiver" name="收货人" label="收货人和电话" placeholder="收货人"
              input-align="right" :rules="[{ required: true, message: '请填写收货人和联系方式' }]" />
            <van-field v-model="goodsData[index].field0" :name="goodsData[index].field0" label="投资方" placeholder="投资方"
              disabled input-align="right" :rules="[{ required: true, message: '请填写投资方' }]" />
            <van-field v-model="goodsData[index].field1" name="投资比例" label="投资比例" disabled placeholder="投资比例"
              input-align="right" :rules="[{ required: true, message: '请填写投资比例' }]" />
            <van-field name="uploader" label="合格证附件" :max-count="1">
              <template #input>
                <van-uploader v-model="uploader" :after-read="passReadUpload" />
              </template>
            </van-field>

            <van-field name="uploader" label="厂检报告附件" :max-count="1">
              <template #input>
                <van-uploader v-model="uploader" :after-read="checkReadUpload" />
              </template>
            </van-field>
            <van-field v-model="goodsData[index].remark" label="备注" placeholder="请输入备注" input-align="right" />
          </van-form>
        </div>
      </div>
    </div>

    <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="save">保存</van-button>
    </div>
    <van-popup v-model="showCalendar" position="bottom">
      <van-datetime-picker type="date" title="选择年月日" @confirm="createConfirm" @cancel="showCalendar = false"
        :min-date="minDate" :max-date="maxDate" />
    </van-popup>
  </div>

</template>

<script>
import Vue from 'vue';
import { Divider } from 'vant';
import { Toast } from 'vant';
import { DatetimePicker } from 'vant';

import _ from 'lodash'
import { demandSnedGoods, demandSnedGoodsUpload } from '@/api/demand/demandManagement'
Vue.use(DatetimePicker);
Vue.use(Toast);
Vue.use(Divider);
export default {

  data() {
    return {
      stopDate: "",
      username: '',
      password: '',
      value: '',
      showCalendar: false,
      goodsData: [],
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17),
      value: '',
      showPicker: false,
      stopCalendar: false,
      uploader: [{ url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }],
      isActive:0,
      title:''
    };
  },
  created() {
    this.goodsData = _.cloneDeep(JSON.parse(this.$route.query.goodData));
    // this.getOrderStatusOptions();
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values);
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
      if(title == 'show'){
        // this.goodsData[index]
        this.showCalendar = true;
      }
      if(title == 'end'){
        this.showCalendar = true;
      }
      if(title == 'gong'){
        this.showCalendar = true;
      }
      // console.log(data,index,title)
    },
    // // 日期格式化
    createConfirm(time) {
      if(this.title == 'show'){
         this.goodsData[this.isActive].createDate =  new Date(time).toLocaleDateString().replace(/\//g, "-")
         this.showCalendar = false;
      }
     if(this.title == 'gong'){
        this.goodsData[this.isActive].supplyDate =  new Date(time).toLocaleDateString().replace(/\//g, "-")
        this.showCalendar = false;
     }
     if(this.title == 'end'){
      this.goodsData[this.isActive].updateDate =  new Date(time).toLocaleDateString().replace(/\//g, "-")
      this.showCalendar = false;
     }
      // 
      // 
      
    },
    passReadUpload(file) {
      console.log(file)
      let imgFile = new FormData();

      imgFile.append("businessType", '01');
      imgFile.append("key", file.file.name);
      imgFile.append("file", file.file);
      demandSnedGoodsUpload(imgFile).then((res) => {
        if (res.code == 0) {
          this.params.fileName = res.data.fileName
          this.params.filePath = res.data.filePath
        }
      })
    },
    //厂检
    checkReadUpload(file) {
      console.log(file)
      let imgFile = new FormData();

      imgFile.append("businessType", '01');
      imgFile.append("key", file.file.name);
      imgFile.append("file", file.file);
      demandSnedGoodsUpload(imgFile).then((res) => {
        if (res.code == 0) {
          this.params.fileName = res.data.fileName
          this.params.filePath = res.data.filePath
        }
      })
    },
    save() {
      for (let i = 0; i < this.goodsData.length; i++) {
        if (this.goodsData[i].supplyDate == '' || this.goodsData[i].createDate == '' || this.goodsData[i].updateDate == "") {
          alert('完善信息')
        }
      }
      this.$router.push({
        name:'SendGoods',
        params: { 
            goodsList: this.goodsData,
        }
      })
      // this.goodsData.forEach((item,index)=>{
      //   if(item)
      // })
      // Toast.success('保存成功');
      // this.$router.push({
      //   name:'SendGoods',
      //   params: { 
      //       type: '1',
      //   }
      // })
    }
  },
};
</script>

<style scoped lang="less">
.finish {
  height: 100vh;
  width: 100%;
  background: #f5f5f5;
  padding: 10px 10px 70px 10px;
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

/deep/.van-cell {
  padding-left: 0;
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