<!-- <确认需求 -->
<template>
  <div>
    <van-form @submit="onSubmit">
      <van-field readonly clickable required name="date" :value="params.date" label="预计发货时间" placeholder="请选择日期"
        @click="showCalendar = true" :rules="[{ required: true, message: '请填写发货日期' }]" input-align="right" />
      <van-calendar v-model="showCalendar" @confirm="onConfirm" />
      <van-field v-model="params.remark" required type="textarea" name="remark" label="确认说明" placeholder="请输入确认情况"
        :rules="[{ required: true, message: '请输入确认情况' }]" input-align="right" autosize/>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">确认需求</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import { Toast } from 'vant';
import {demandSureSave} from '@/api/demand/demandManagement'
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
export default {
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
    onConfirm(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）

      // 组合成YYYY-MM-DD格式
      this.params.date = `${year}-${month}-${day}`;

      this.showCalendar = false;
    },
    onSubmit(values) {
      let params={
        confirmValidate:values.remark,
        shippingDate:values.date,
        id:this.id
      }
      demandSureSave(params).then((res)=>{
        if(res.code==0){
          Toast.success(res.message);
          this.$router.push({ path: '/dashboard' })
        }
      })
      // Toast.success('保存成功');
      // this.$router.push({ path: '/dashboard' })
    }
  },
};
</script>

<style></style>