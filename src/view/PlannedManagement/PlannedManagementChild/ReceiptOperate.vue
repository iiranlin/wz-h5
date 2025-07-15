<template>
    <div class="detail-button-container">
        <div class="detail-floor-content">
            <img src="/static/icon-receipt-operate.png"/>
            <span>收货信息</span>
        </div>
        <van-field v-model="formData.receiver" name="收货人" label="收货人：" placeholder="请输入使用地点" required clearable
            input-align="right"/>
        <van-field v-model="formData.phone" name="联系电话" label="联系电话：" placeholder="请输入联系电话" clearable maxlength="11"
            input-align="right"/>
        <div class="detail-floor-content">
            <img src="/static/icon-receipt-operate.png"/>
            <span>收货地址</span>
        </div>
        <van-field
            class="van-edit"
            v-model="formData.receiveraddress"
            type="textarea"
            maxlength="200"
            rows="2"
            autosize
            placeholder="请输入收货地址"
            show-word-limit/>
        <div class="detail-floor-content">
            <img src="/static/icon-address.png"/>
            <span>使用地点</span>
        </div>
        <van-field
            class="van-edit"
            v-model="formData.addr"
            type="textarea"
            maxlength="200"
            rows="2"
            autosize
            placeholder="请输入使用地点"
            show-word-limit/>
        <div class="default-button-container">
            <van-button class="button-info" block type="default" round @click="handleBack()">返回</van-button>
            <van-button class="button-info" block type="info" round @click="handleConfirm()">确定</van-button>
        </div>
    </div>
</template>
<script>
import {materialReceiverInformationCreate,materialReceiverInformationModify} from '@/api/prodmgr-inv/receipt'

export default {
    name: '',
    
    data () {
        return {
            pattern: /^1[3456789]\d{9}$/,
            currentIndex: null,
            listObj:{},
            type:'',

            formData: {
                id:'',
                addr: '',   //使用地点
                phone: '',  //联系电话
                receiver: '',   //收货人
                receiveraddress: '', //收货地址
            }
        }
    },
    created () {
        this.type = this.$route.query.type;

        if(this.type == 'update'){
            this.currentIndex = this.$route.query.position;
            this.listObj = JSON.parse(this.$route.query.obj);

            this.formData.id = this.listObj.id;
            this.formData.addr = this.listObj.addr;
            this.formData.phone = this.listObj.phone;
            this.formData.receiver = this.listObj.receiver;
            this.formData.receiveraddress = this.listObj.receiveraddress;
        }
    },
    methods: {
        //返回
        handleBack(){
            this.$router.back();
        },
        //确定
        handleConfirm(){
            if(!this.formData.receiver){
                this.$notify({
                    type: 'warning',
                    message: '请填写收货人!',
                });
                return
            }
            if(!this.pattern.test(this.formData.phone)){
                this.$notify({
                    type: 'warning',
                    message: '手机号格式不正确!',
                });
                return
            }
            if(this.type == 'create'){
                this.handleCreate();
            }else if(this.type == 'update'){
                this.handleUpdate();
            }
        },
        //新增
        handleCreate(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            materialReceiverInformationCreate(this.formData).then(({ message }) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.$router.push({
                    name: "ReceiptList",
                    params: {
                        refresh: true,
                    },
                });
            }).catch((error) => {

            }).finally(() => {
                toast.clear();
            });
        },
        //修改
        handleUpdate(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            materialReceiverInformationModify(this.formData).then(({ message }) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.$router.push({
                    name: "ReceiptList",
                    params: {
                        refresh: true,
                    },
                });
            }).catch((error) => {

            }).finally(() => {
                toast.clear();
            });
        },
    },
}
</script>
<style lang="less" scoped>
.detail-button-container {
    background: #ffffff;
} 
.button-info {
    width: 169px;
}
.van-edit {

    ::v-deep .van-field__value {
        background: #f6f6f6;
        border-radius: 5px;
        padding: 7px 13px;
        font-size: 13px;
    }
}
</style>