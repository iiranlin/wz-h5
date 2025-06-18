<template>
    <div class="default-container" ref="container">
        <ul class="list-ul">
            <li>
                <span style="width:480px;">供应需求名称：</span>
                <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
            </li>

            <li class="li-item-both">
                <span style="width:220px;">需求项目：</span>
                <span>标段项目名称</span>
            </li>
            <li>
                <span style="width: 220px;">合同名称：</span>
                <span>合同名称</span>
            </li>
        </ul>
        <div class="list-ul" style="margin-top: 26px;padding: 10px;">
            <van-form :key="formKey">
                <van-field v-model="username" name="物流单号" label="物流单号" placeholder="物流单号" input-align="right"
                    :rules="[{ required: true, message: '请填写物流单号' }]" />
                <van-field v-model="username" name="发货地址" label="发货地址" placeholder="发货地址" input-align="right"
                    :rules="[{ required: true, message: '请填写发货地址' }]" />
                <van-field readonly clickable name="calendar" :value="value" label="预计发货时间" input-align="right" placeholder="点击选择日期"
                    @click="showCalendar = true" :rules="[{ required: true, message: '请填写发货日期' }]" />
                <van-calendar v-model="showCalendar" @confirm="onConfirm" />
                <van-field readonly clickable name="calendar" :value="value" label="预计送达时间" input-align="right" placeholder="点击选择日期"
                    @click="showCalendar = true" :rules="[{ required: true, message: '请填写预计送达时间' }]" />
                <van-field v-model="username" name="车牌号" label="车牌号" placeholder="车牌号" input-align="right"/>
                <van-field v-model="username" name="联系人" label="联系人" placeholder="联系人" input-align="right"
                    :rules="[{ required: true, message: '请填写联系人' }]" />
                <van-field v-model="sms" center clearable label="发货单附件" placeholder="发货单附件" input-align="right"
                    :rules="[{ required: true, message: '请填写发货单附件' }]">
                    <template #button>
                        <van-uploader v-model="fileList" :before-read="beforeRead">
                            <van-button size="mini" class="button-info" type="primary">请上传发货单</van-button>
                        </van-uploader>
                        
                    </template>
                </van-field>
                <van-field v-model="sms" center clearable label="已选物资" placeholder="发货单附件" input-align="right">
                    <template #button>
                        <van-button size="mini" type="primary" class="button-info" @click="chooseGoods" >选择发货物资</van-button>
                        <van-button size="mini" type="primary" class="button-info" @click="lookGoods">查看发货物资</van-button> <!--保存完回显-->
                    </template>
                </van-field>
            </van-form>
        </div>
        <div class="default-button-container" v-if="paramsType == '1'">
          <van-button class="button-info" round type="info" @click="saveClick">确认</van-button>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';

Vue.use(Form);
Vue.use(Field);
export default {
    name: 'SendGoods',
    data() {
        return {
            formKey:"",
            username: '',
            password: '',
            value: '',
            showCalendar: false,
            paramsType: ''
        };
    },
    created() {
        // this.getOrderStatusOptions();
        this.paramsType = this.$route.params.type
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
            this.formKey++
            this.$router.push({ path: '/selectGoods' })
        },
        lookGoods(){
            this.formKey++
            this.$router.push({ path: '/finishGoods' })
        },
        uploadGoosSend(){
            this.formKey++
            alert('11')
        },
        saveClick () {
          this.$router.push({ path: '/dashboard' })
        }
    },
};
</script>
<style lang="less" scoped>
.default-container {
    padding-top: 10px;
}

li :nth-child(1) {
    min-width: 60px
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
/deep/.van-button--primary{
    background-color: #1989fa;
    border:1px solid #1989fa;
}
</style>