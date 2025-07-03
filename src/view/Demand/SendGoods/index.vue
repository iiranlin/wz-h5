<template>
    <div class="default-container" ref="container">
        <ul class="list-ul">
            <li>
                <span>需求编号：</span>
                <span>{{ goodsMsg.planNumber }}</span>
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
            <van-form :key="formKey" ref="form">
                <van-field v-model="params.oddNumbers" :disabled="fileDisabled" name="物流单号" label="物流单号" placeholder="物流单号" input-align="right"
                    />
                <van-field v-model="params.shippingAddress" :disabled="fileDisabled" required name="发货地址" label="发货地址" placeholder="发货地址" input-align="right"
                    :rules="[{ required: true, message: '请填写发货地址' }]" />
                <van-field readonly clickable name="calendar" :disabled="fileDisabled" required v-model="params.shippingDate" label="发货日期" input-align="right" placeholder="点击选择日期"
                    @click="showCalendar = true" :rules="[{ required: true, message: '请填写发货日期' }]" />
                <van-calendar v-model="showCalendar" @confirm="onConfirm" />
                <van-field readonly clickable name="calendar" :disabled="fileDisabled" required :value="params.arrivalDate" label="预计送到时间" input-align="right" placeholder="点击选择日期"
                    @click="sendStop = true" :rules="[{ required: true, message: '请填写预计送达时间' }]" />
                <van-calendar v-model="sendStop" @confirm="onStopConfirm" />
                <van-field v-model="params.carNumber" label="车牌号" :disabled="fileDisabled" type="text" placeholder="车牌号" input-align="right"/>
                <van-field v-model="params.contacts" required label="联系人" :disabled="fileDisabled" placeholder="联系人" input-align="right" :rules="[{ required: true, message: '请填写联系人' }]"/>
                <van-field v-model="params.contactsPhone" required label="联系电话" :disabled="fileDisabled" placeholder="联系电话" input-align="right"
                    :rules="[{ required: true, message: '请填写手机号' },{ pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！'}]" />
                <van-field name="uploader" v-model="fileByList" label="发货单附件：" class="outbound-field-uploader" required
                >
                <template #button>
                  <van-uploader :preview-imag='false'
                   :after-read="beforeReadUpload" :before-read="beforeRead"
                    accept="">
                    <van-button type="info" size="small" class="outbound-uploader" native-type="button">请上传发货单</van-button>
                  </van-uploader>
                </template>
              </van-field>






                <!-- <van-field name="uploader" label="发货单附件" required :rules="[{ required: true, message: '请上传发货单附件' }]">
                    <template #input>
                        <van-uploader v-model="fileList" :after-read="beforeReadUpload" multiple :max-count="1"/>
                    </template>
                    </van-field> -->
            </van-form>
        </div>
        <div class="default-button-container">
            <van-button size="mini" type="primary" round class="button-info" @click="chooseGoods(goodsId,text)" v-if="this.text=='add'">选择发货物资</van-button>
            <!-- 编辑里的选择发货物资传的是planId -->
            <van-button size="mini" type="primary" round class="button-info" @click="editGoods(params.materialCirculationDetailsTableDTOS,'edit')" v-if="text=='edit'">选择发货物资</van-button>
             <van-button size="mini" type="primary" round class="button-info" @click="editGoods(params.materialCirculationDetailsTableDTOS,'file')" v-if="text=='file'">选择发货物资</van-button>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import {demandSnedGoods,demandSnedGoodsUpload,demandSaveSendGoods} from '@/api/demand/demandManagement'
import {detailBySendEdit} from '@/api/demand/sendGoods'
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
            //发货时传来的id
            goodsId:'',
            goodsMsg:{},
            params:{
                shipmentBatchNumber:'',
            },
            goodsList:[],
            fileList:[],
            // 传过来的标识，用来判断是新增还是编辑
            text:"",
            fileDisabled:false,
            fileByList:''
        };
    },
    created() {
        this.text = this.$route.query.title
        this.goodsId = this.$route.query.id
        //编辑
        if(this.text=='edit'){
           
            this.editDetails()
        }
        // 增加
        if(this.text=='add'){
             this.getSendGoods()
        }
        // 修改文件
        if(this.text=='file'){
             this.editDetails()
            this.fileDisabled=true
        }
       
        // // 编辑
        // if(this.text=='edit'){
        //     this.params = JSON.parse(this.$route.query.data)
        //     //发货日期格式化
        //       if (this.params.shippingDate) {
        //         const date = new Date(this.params.shippingDate);
        //         const year = date.getFullYear();
        //         const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
        //         const day = date.getDate().toString().padStart(2, '0'); // 日期加0
        //         this.params.shippingDate = `${year}-${month}-${day}`;
        //     }
        //     // 预计送达日期格式化
        //      if (this.params.arrivalDate) {
        //         const date = new Date(this.params.arrivalDate);
        //         const year = date.getFullYear();
        //         const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
        //         const day = date.getDate().toString().padStart(2, '0'); // 日期加0
        //         this.params.arrivalDate = `${year}-${month}-${day}`;
        //     }
        //     const {planNumber,sectionName,contractName}= JSON.parse(this.$route.query.data)
        //     this.goodsMsg.planNumber=planNumber
        //     this.goodsMsg.sectionName=sectionName
        //     this.goodsMsg.contractName=contractName
        //     // 回显图片
        //     let file = JSON.parse(this.params.fileByList)
        //     this.fileList.push({name:file.fhd[0].fileName,url:file.fhd[0].filePath})
        
        // }else{
            
        // }
    },
    
    methods: {
        getSendGoods(){
            demandSnedGoods(this.goodsId).then((res)=>{
                if(res.code == 0){
                    // Toast.clear()
                    this.goodsMsg = res.data
                }
            })
        },
        // 编辑回显
        editDetails(){
            detailBySendEdit(this.goodsId).then((res)=>{
                 if(res.code == 0){
                    // Toast.clear()
                        const {planNumber,sectionName,contractName}= res.data
                        this.goodsMsg.planNumber=planNumber
                        this.goodsMsg.sectionName=sectionName
                        this.goodsMsg.contractName=contractName
                        let file = JSON.parse(res.data.fileByList)
                        this.params = res.data
                        // this.fileList.push({name:file.fhd[0].fileName,url:file.fhd[0].filePath})
                        this.fileByList = file.fhd[0].fileName
                        this.params.shippingDate = this.formattedCreateDate(res.data.shippingDate)
                        this.params.arrivalDate = this.formattedCreateDate(res.data.arrivalDate)
                        

                }
            })
        },
         formattedCreateDate(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0
            return `${year}-${month}-${day}`;
            },
        //发货日期
        onConfirm(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）
            this.params.shippingDate = `${year}-${month}-${day}`;
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
        chooseGoods(id,text) {
            // this.formKey++
              this.$refs.form
                .validate()
                .then(() => {
                     let fileList=[]
                     let fhd = [];
                     if(this.fileList.length>0){
                         this.fileList.forEach(item=>{
                            fileList.push({fileName:item.name,filePath:item.url})
                            fhd.push({ fileName: item.name, filePath: item.url });
                        })
                     }
                     let fileByList = JSON.stringify({ fhd });
                   
                let params = {
                    ...this.params,
                    fileList:fileList,
                    fileByList:fileByList,
                    sectionName:this.goodsMsg.sectionName,
                    planName:this.goodsMsg.planName,
                    planId:this.goodsMsg.id,
                    id:"",
                    contractName:this.goodsMsg.contractName,
                }
                // 存到缓存里
                this.$store.dispatch('public/setGoodsList', params)
                // 携带参数跳转到选择商品页
                this.$router.push({ path: '/selectGoods',query:{id:id,text:text} })
               
                })
                .catch(() => {
                //验证失败

                })
        },
        // 编辑时选择的下一步传的参数
        editGoods(data,text){
            this.$refs.form
                .validate()
                .then(() => {
                     let fileList=[]
                     let fhd = [];
                     if(this.fileList.length>0){
                         this.fileList.forEach(item=>{
                            fileList.push({fileName:item.name,filePath:item.url})
                            fhd.push({ fileName: item.name, filePath: item.url });
                        })
                     }
                     let fileByList = JSON.stringify({ fhd });
                   
                let params = {
                    arrivalDate:this.params.arrivalDate,
                    carNumber: this.params.carNumber,
                    contacts: this.params.contacts,
                    contactsPhone:this.params.contactsPhone,
                    contractName:this.params.contractName,
                    oddNumbers:this.params.oddNumbers,
                    shipmentBatchNumber:this.params.shipmentBatchNumber,
                    shippingAddress:this.params.shippingAddress,
                    shippingDate:this.params.shippingDate,
                    // ...this.params,
                    fileByList:fileByList,
                    fileList:fileList,
                    sectionName:this.goodsMsg.sectionName,
                    planName:this.goodsMsg.planName,
                    planId:this.goodsMsg.id,
                    id:this.params.id,
                    contractName:this.goodsMsg.contractName,
                }
                // 存到缓存里
                this.$store.dispatch('public/setGoodsList', params)
                //判断有没有可供选择的物资
                if(data.length&&data.length>0){
                     // 携带参数跳转到选择商品页
                    this.$router.push({ path: '/selectGoods',query:{data:JSON.stringify(data),text:text} })
                }else{
                    Toast('没有可供选择的物资');
                }
               
               
                })
                .catch(() => {
                //验证失败

                })
            
        },
        lookGoods(id){
            this.formKey++
            this.$router.push({ path: '/selectGoods',query:{id:id} })
        },
        uploadGoosSend(){
            this.formKey++
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
                if(res.code==0){
                    Toast.success(res.data);
                    this.$router.push({path:"/Information"})
                }
            })
        },
        beforeReadUpload(file){
            
            let imgFile = new FormData();

            imgFile.append("businessType", '01');
            imgFile.append("key", file.file.name);
            imgFile.append("file", file.file);
            demandSnedGoodsUpload(imgFile).then((res)=>{
                if(res.code == 0){
                   this.fileList = [{
                        name: res.data.fileName,
                        url:res.data.filePath
                        }];
                    this.fileByList = this.fileList[0].name
                    // this.params = res.data
                    // this.params.fileName = res.data.fileName
                    // this.params.fileName = res.data.fileName
                }
            })
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
<style lang="less" scoped>
.default-container {
    padding-top: 10px;
    padding-bottom: 60px;
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