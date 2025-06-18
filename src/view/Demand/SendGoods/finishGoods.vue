<template>
  <div class="finish">
    <div class="box">
      <div>
        <ul class="list-ul">
            <li class="list_title">
              <!-- <span class="dian"></span> -->
              <span class="font-weight">物资名称：</span>
              <span class="font-weight">计算机联锁设备</span>
            </li>
            <li>
              <span>规格型号：</span>
              <span>2x2取2s10组道岔</span>
            </li>
             <li class="li-item-both">
              <div class="li-item-left">
                <span>计量单位:</span>
                <span>套</span>
              </div>
              <div class="li-item-right">
                <span>合同数量:</span>
                <span>5</span>
              </div>
            </li>
            <li class="li-item-both">
              <div class="li-item-right" style="color:red;">
                <span style="width: 500px;">本次需求未发货数量:</span>
                <span>1</span>
              </div>
            </li>
          </ul>
      </div>
      <van-divider />
      <div class="list-ul" style="margin-top: 26px;padding: 10px;">
            <van-form>
                <van-field v-model="username" name="发货数量" label="发货数量" placeholder="发货数量"
                    :rules="[{ required: true, message: '请填写发货数量' }]" />
                <van-field v-model="username" name="包装形式" label="包装形式" placeholder="包装形式"
                    :rules="[{ required: true, message: '请填写包装形式' }]" />
                <van-field readonly clickable name="calendar" :value="value" label="生产日期" placeholder="点击选择日期"
                    @click="showCalendar = true" :rules="[{ required: true, message: '请填写生产日期' }]" />
                <van-calendar v-model="showCalendar" @confirm="onConfirm" />
                <van-field readonly clickable name="calendar" :value="value" label="有效期截止日期" placeholder="点击选择日期"
                    @click="showCalendar = true" />
                <van-field v-model="username" name="收货地址" label="收货地址" placeholder="收货地址" />
                <van-field readonly clickable name="calendar" :value="value" label="供应时间" placeholder="点击选择日期"
                    @click="showCalendar = true" :rules="[{ required: true, message: '请填写供应时间' }]" />
                <van-field v-model="username" name="收货人" label="收货人" placeholder="收货人"
                    :rules="[{ required: true, message: '请填写收货人' }]" />
                <van-field v-model="sms" center clearable label="联系方式" placeholder="联系方式"
                    :rules="[{ required: true, message: '请填写联系方式' }]">
                    
                </van-field>
                    <van-field v-model="username" name="投资方" label="投资方" placeholder="投资方"
                    :rules="[{ required: true, message: '请填写投资方' }]" />
                    <van-field v-model="username" name="投资比例" label="投资比例" placeholder="投资比例"
                    :rules="[{ required: true, message: '请填写投资比例' }]" />
                   <van-field v-model="sms" center clearable label="合格证附件" placeholder="合格证附件">
                    <template #button>
                        <van-button size="mini" type="primary" @click="chooseGoods">请上传合格证</van-button>
                    </template>
                </van-field>


              
                <van-field v-model="sms" center clearable label="厂检报告附件" placeholder="厂检报告附件">
                    <template #button>
                        <van-button size="mini" type="primary" @click="chooseGoods">请上传发货单</van-button>
                    </template>
                </van-field>
                <!-- <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">提交</van-button>
                </div> -->
            </van-form>
        </div>
    </div>
     <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="save">保存</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Divider } from 'vant';

Vue.use(Divider);
export default {

    data() {
        return {
            username: '',
            password: '',
            value: '',
            showCalendar: false,
        };
    },
    created() {
        // this.getOrderStatusOptions();
    },
    methods: {
        onSubmit(values) {
            console.log('submit', values);
        },
        onConfirm(date) {
            this.value = `${date.getMonth() + 1}/${date.getDate()}`;
            this.showCalendar = false;
        },
        chooseGoods() {
            this.$router.push({path:'/selectGoods'})
        },
        save(){

        }
    },
};
</script>

<style scoped lang="less">
.finish{
  height: 100vh;
  width: 100%;
  background: #f5f5f5;
  padding: 10px 10px 10px 10px;
  box-sizing: border-box;
  .box{
    height: calc(100vh - 90px);
    overflow: scroll;
     padding: 10px 10px 10px 10px;
    border-radius: 15px;
    background: #fff;
  }
  .box::-webkit-scrollbar{
    display: none;
  }
}
.list_title{
  position: relative;
}
.title::before{
  content: '';
  position: absolute;
  top: 50%;
  padding-left: 10px;
  width: 6px;
  height: 6px;
  background: blue;
}
/deep/.van-cell{
padding-left: 0;
}
// .dian{
//   background-color: blue;
//   height: 6px;
//   width: 6px;
// }
</style>