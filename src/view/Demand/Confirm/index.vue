<!-- <确认需求 -->
<template>
  <div>
    <van-form @submit="onSubmit">
    <van-field
      readonly
      clickable
      name="calendar"
      :value="value"
      label="预计发货时间"
      placeholder="点击选择日期"
      @click="showCalendar = true"
      :rules="[{ required: true, message: '请填写发货日期' }]"
    />
    <van-calendar v-model="showCalendar" @confirm="onConfirm" />
      <van-field
        v-model="password"
        type="text"
        name="确认说明"
        label="确认说明"
        placeholder="确认说明"
        :rules="[{ required: true, message: '请填写说明' }]"
      />
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

Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
export default {
  data() {
    return {
      value: '',
      password:'',
      showCalendar: false,
    };
  },
  methods: {
    onConfirm(date) {
      this.value = `${date.getMonth() + 1}/${date.getDate()}`;
      this.showCalendar = false;
    },
    onSubmit(values){
      Toast.success('保存成功');
        this.$router.push({path:'/dashboard'})
    }
  },
};
</script>

<style>

</style>