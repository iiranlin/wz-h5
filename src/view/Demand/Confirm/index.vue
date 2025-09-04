<!-- <确认需求 -->
<template>
  <div>
    <van-form>
      <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0;">
        <template>
          <div class="detail-title-content">
          <img src="@/assets/img/Icon-invest.png" />
          <span>预计发货时间</span>
        </div>
        <div>
          <van-field readonly clickable required name="date" :value="params.date" label="选择时间" placeholder="请选择日期"
        @click="handlerShowCalendar('calendar')" :rules="[{ required: true, message: '请填写预计发货日期' }]" input-align="right" />
      <!-- <van-calendar v-model="showCalendar" @confirm="onConfirm" /> -->
                <Calendar ref="calendar" @onConfirm="onConfirm" />
        </div>
        </template>
      </div>

      <div class="detail-base-info detail-base-info-edited"  style="margin-top: 0;">
        <template>
          <div class="detail-title-content">
          <img src="@/assets/img/Icon_notarize.png" />
          <span>确认说明</span>
        </div>
        <div>
            <van-field class="detail-base-info-edited-textarea" v-model="params.remark" required type="textarea" name="remark" placeholder="请输入确认情况"
            :rules="[{ required: true, message: '请输入确认情况' }]" autosize/>
        </div>
        </template>
      </div>

    </van-form>
    <div class="default-button-container">
      <van-button class="button-info" round @click="onSubmit(false)">返回</van-button>
      <van-button class="button-info" round type="info" @click="onSubmit(true)">确认需求</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import { Toast } from 'vant';
import Calendar from "@/layout/components/calendar.vue";
import {demandSureSave} from '@/api/demand/demandManagement'
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
export default {
  components: {
   Calendar 
  },
  data() {
    return {
      value: '',
      password: '',
      showCalendar: false,
      id: '',
      params:{
        date:'',
        remark:''
      }
    };
  },
  created() {
    this.id = this.$route.query.id
  },
  methods: {
    handlerShowCalendar(elementName) {
      this.$refs[elementName]?.handleCalendarShow();
    },
    onConfirm(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）

      // 组合成YYYY-MM-DD格式
      this.params.date = `${year}-${month}-${day}`;
      this.$forceUpdate();

      // this.showCalendar = false;
    },
    onSubmit(values) {
      if (values) {
        if (!this.params.date) {
        this.$notify({
          type: "warning",
          message: "请填写预计发货日期!",
        });
        return;
      }
        if (!this.params.remark) {
        this.$notify({
          type: "warning",
          message: "请输入确认情况!",
        });
        return;
      }
        let params={
          confirmValidate:this.params.remark,
          shippingDate:this.params.date,
          id:this.id
        }
        demandSureSave(params).then((res)=>{
          if(res.code==0){
            Toast.success(res.message);
            this.$router.push({ path: '/dashboard' })
          }
        })
      } else {
        this.$router.push({ path: '/dashboard' })
      }

      // Toast.success('保存成功');
      // this.$router.push({ path: '/dashboard' })
    }
  },
};
</script>

<style lang="less" scoped>
/deep/.van-calendar__popup.van-popup--bottom, .van-calendar__popup.van-popup--top{
    height: 94% !important;
}

  ::v-deep .detail-base-info-edited-textarea .van-cell__value .van-field__body {
    background-color: #f2f2f2 !important;
  }

  .default-button-container {
    .button-info {
      width: 169px;
      height: 34px;
    }
  }
</style>