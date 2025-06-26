<template>
    <div class="default-container" ref="container"  v-bind:style="{ 'padding-bottom': paramsType ? '150px' : '0px' }">
        <ul class="list-ul">
            <li>
                <span>供应需求名称：</span>
                <span>{{ goodsMsg.planName }}</span>
            </li>

            <li class="li-item-both">
                <span>需求项目：</span>
                <span>{{ goodsMsg.sectionName }}</span>
            </li>
            <li>
                <span>合同名称：</span>
                <span>{{ goodsMsg.contractName }}</span>
            </li>
        </ul>
        <div class="list-ul" style="margin-top: 26px;padding: 10px;">
            <van-form :key="formKey">
                <van-field v-model="params.oddNumbers" name="物流单号" label="物流单号" placeholder="物流单号" input-align="right"
                    :rules="[{ validator: checkNotChinese, message: '物流单号不能包含汉字' }]" />
                <van-field v-model="params.shippingAddress" name="发货地址" label="发货地址" placeholder="发货地址" input-align="right"
                    :rules="[{ required: true, message: '请填写发货地址' }]" />
                <van-field readonly clickable name="calendar" v-model="params.shippingDate" :value="params.shippingDate" label="预计发货时间" input-align="right" placeholder="点击选择日期"
                    @click="showCalendar = true" :rules="[{ required: true, message: '请填写发货日期' }]" />
                <van-calendar v-model="showCalendar" @confirm="onConfirm" />
                <van-field readonly clickable name="calendar" :value="params.arrivalDate" label="预计送达时间" input-align="right" placeholder="点击选择日期"
                    @click="sendStop = true" :rules="[{ required: true, message: '请填写预计送达时间' }]" />
                <van-calendar v-model="sendStop" @confirm="onStopConfirm" />
                <van-field v-model="params.carNumber" name="车牌号" label="车牌号" placeholder="车牌号" input-align="right"/>
                <van-field v-model="params.contacts" name="联系人" label="联系人" placeholder="联系人" input-align="right"
                    :rules="[{ required: true, message: '请填写联系人' }]" />
                <van-field v-model="params.contactsPhone" label="手机号" placeholder="手机号" input-align="right"
                    :rules="[{ required: true, message: '请填写手机号' },{ pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！'}]" />
                <van-field name="uploader" label="发货单附件">
                    <template #input>
                        <van-uploader v-model="fileList" :after-read="beforeReadUpload" multiple :max-count="1"/>
                    </template>
                    </van-field>
                <!-- <van-field v-model="params.fileName" center clearable label="发货单附件" placeholder="发货单附件" input-align="right"
                    :rules="[{ required: true, message: '请填写发货单附件' }]">
                    <template #button>
                        <van-uploader :after-read="beforeReadUpload">
                            <van-button size="mini" class="button-info" type="primary">请上传发货单</van-button>
                        </van-uploader>
                        
                    </template>
                </van-field> -->
                <van-field v-model="params.number" center clearable label="已选物资" placeholder="发货单附件" input-align="right">
                    <template #button>
                        <van-button size="mini" type="primary" class="button-info" @click="chooseGoods(goodsId)" >选择发货物资</van-button>
                        <van-button size="mini" type="primary" class="button-info" @click="lookGoods(goodsId)" v-if="paramsType">查看发货物资</van-button> <!--保存完回显-->
                    </template>
                </van-field>
            </van-form>
        </div>
        <div class="default-button-container" v-if="paramsType">
          <van-button class="button-info" round type="info" @click="saveClick">确认</van-button>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import {demandSnedGoods,demandSnedGoodsUpload,demandSaveSendGoods} from '@/api/demand/demandManagement'
import keepPages from '@/view/mixins/keepPages'
import { Toast } from 'vant';
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);

export default {
    name: 'SendGoods',
    mixins: [keepPages],
    data() {
        return {
            formKey:"",
            username: '',
            password: '',
            value: '',
            showCalendar: false,
            sendStop:false,
            paramsType: false,
            goodsId:'',
            goodsMsg:{},
            params:{
                shipmentBatchNumber:''
            },
            goodsList:[],
            fileList:[]
        };
    },
    created() {
       
        this.goodsId = this.$route.query.id
        this.getSendGoods();
        // this.goodsList = this.$route.params.goodsList
        // console.log(this.goodsList.flat(),'11233')
        // if(Array.isArray(this.goodsList)){
        //     this.paramsType=1
        // }
       
        // this.paramsType = this.$route.params.type
    },
    mounted(){
        //如果缓存里有值就显示保存按钮

        if(this.$store.state.public.goodsList.length>0){
            this.params.number = this.$store.state.public.goodsList.length
            this.paramsType = true
        }
    },
    methods: {
        // 物流单号正则校验
        checkNotChinese(val){
            return /^[^\u4e00-\u9fa5]+$/.test(val);
        },
        getSendGoods(){
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            demandSnedGoods(this.goodsId).then((res)=>{
                if(res.code == 0){
                    Toast.clear()
                    this.goodsMsg = res.data
                }
            })
        },
        
        onSubmit(values) {
            console.log('submit', values);
        },
        //发货日期
        onConfirm(date) {
            // const date = new Date();
 
            // 获取年、月、日
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）
            
            // 组合成YYYY-MM-DD格式
            this.params.shippingDate = `${year}-${month}-${day}`;

            // this.params.shippingDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            this.showCalendar = false;
        },
        // 送达时间
        onStopConfirm(date){
           // 获取当前日期
            // const date = new Date();
            
            // 获取年、月、日
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）
            
            // 组合成YYYY-MM-DD格式
            this.params.arrivalDate = `${year}-${month}-${day}`;
            this.sendStop = false;
        },
        chooseGoods(id) {
            this.formKey++
            this.$router.push({ path: '/selectGoods',query:{id:id} })
        },
        lookGoods(id){
            this.formKey++
            this.$router.push({ path: '/selectGoods',query:{id:id} })
        },
        uploadGoosSend(){
            this.formKey++
            alert('11')
        },
        saveClick () {
            let fileList=[]
            this.fileList.forEach(item=>{
                fileList.push({fileName:item.name,filePath:item.url})
            })
            let params = {
                ...this.params,
                fileList:fileList,
                sectionName:this.goodsMsg.sectionName,
                planName:this.goodsMsg.planName,
                planId:this.goodsMsg.id,
                id:"",
                contractName:this.goodsMsg.contractName,
                materialCirculationDetailsTableParamList:this.$store.state.public.goodsList //取出store里的物资数据用于保存
            }
            demandSaveSendGoods(params).then((res)=>{
                console.log(res)
            })
            console.log(params,'1334')
            // demandSaveSendGoods(params).then((res)=>{
            //     console.log(res)
            // })
        //   this.$router.push({ path: '/dashboard' })
        },
        beforeReadUpload(file){
            
            let imgFile = new FormData();

            imgFile.append("businessType", '01');
            imgFile.append("key", file.file.name);
            imgFile.append("file", file.file);
            demandSnedGoodsUpload(imgFile).then((res)=>{
                if(res.code == 0){
                    // this.params.fileList = [{
                    // name: res.data.fileName,
                    // url: res.data.filePath
                    // }];
                   this.fileList = [{
                        name: res.data.filePath,
                        url:res.data.fileName // 注意Vant通常使用url而不是path
                        }];
                    this.params.fileByList = ''
                    // this.params = res.data
                    // this.params.fileName = res.data.fileName
                    // this.params.fileName = res.data.fileName
                }
            })
        }
    },
};
</script>
<style lang="less" scoped>
.default-container {
    padding-top: 10px;
    // padding-bottom: 150px;
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