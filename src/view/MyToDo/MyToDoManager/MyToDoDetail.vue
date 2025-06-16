<template>
    <div :class="{'detail-button-container':type == '0'}">
        <div class="box-container">
            <div>
                <ul class="detail-ul">
                    <li>
                        <span>需求名称：</span>
                        <span>南京枢纽（江北地区）和南通地区工程2025年5月甲供物资需求计划表</span>
                    </li>
                    <li>
                        <span>需求项目：</span>
                        <span>南京枢纽（江北地区）和南通地区工程2025年5月甲供物资需求计划表</span>
                    </li>
                    <li>
                        <span>需求组织：</span>
                        <span>施工单位名称</span>
                    </li>
                    <li class="li-item-both">
                        <div class="li-item-left">
                            <span>提报人：</span>
                            <span>张晓明</span>
                        </div>
                        <div class="li-item-right">
                            <span>提报时间：</span>
                            <span>2025-04-20</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="box-container detail-title-info">
            <span class="info-title">物资明细</span>
        </div>
         <div class="box-container" v-for="(item,index) in 5" :key="index">
            <div>
                <ul class="detail-ul">
                    <li>
                        <span>物资名称：</span>
                        <span>计算机连锁设备</span>
                    </li>
                    <li>
                        <span>供应商：</span>
                        <span>北京全路通信信号研究设计院集团有限公司</span>
                    </li>
                    <li>
                        <span>规格型号：</span>
                        <span>2x2取2s10组岔道</span>
                    </li>
                    <li class="li-item-both">
                        <div class="li-item-left">
                            <span>计量单位：</span>
                            <span>套</span>
                        </div>
                        <div class="li-item-right">
                            <span>合同数量：</span>
                            <span>10</span>
                        </div>
                    </li>
                    <li class="li-item-both">
                        <div class="li-item-left li-item-overlength">
                            <span>累计计划量（含本次）：</span>
                            <span>6</span>
                        </div>
                        <div class="li-item-right">
                            <span>本次计划量：</span>
                            <span>10</span>
                        </div>
                    </li>
                    <li>
                        <span>供应时间：</span>
                        <span>2025-07-15</span>
                    </li>
                    <li>
                        <span>使用地点：</span>
                        <span>华庄/永津路/高里东/浦口北</span>
                    </li>
                    <li class="li-item-overlength">
                        <span>收货人及联系方式：</span>
                        <span>张晓明 15888888888</span>
                    </li>
                    <li>
                        <span>投资方：</span>
                        <span>北京全路通信信号研究设计院集团有限公司</span>
                    </li>
                    <li>
                        <span>投资比例：</span>
                        <span>60%</span>
                    </li>
                    <li>
                        <span>备注：</span>
                        <span>备注内容备注内容备注内容备注内容</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="default-button-container" v-if="type == '0'">
            <van-button class="button-info" block type="info" round @click="handleReject()">不同意</van-button>
            <van-button class="button-info" block type="info" round @click="handleEditAdopt()">修改后同意</van-button>
            <van-button class="button-info" block type="info" round @click="handleAdopt()">同意</van-button>
        </div>
        <!--选择审批人弹框-->
        <van-popup v-model="assigneePopupShow" round :close-on-click-overlay="false">
            <div class="assignee-popup">
                <span>提示</span>
                <van-cell :title="assigner" required is-link center @click="handleAssigneePopupClick()"/>
                <div class="default-button-container">
                    <van-button class="button-info" plain block type="info" round @click="handleAssigneeCancel()">取消</van-button>
                    <van-button class="button-info" block type="info" round @click="handleAssigneeSubmit()">提交</van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import eventBus from '@/utils/eventBus.js'

export default {
    name: 'MyToDoDetail',
    mixins: [keepPages],
    components: {},

    data () {
        return {
            //页面类型 0：待审批
            type:'0',   
            //明细信息
            detailList:[],
            //是否显示选择审批人弹框
            assigneePopupShow:false,
            //审批人数据
            assigneeList:[
                { text: '张三', value: 0 },
                { text: '李四', value: 1 },
                { text: '王五', value: 2 },
            ],
            //审批人
            assigner: '请选择下一级审核人',
        }
    },
    created() {
        this.type = this.$route.params.type;
        // this.getActivitiList();
        
        //审核意见回调
        eventBus.$off('examineEditCallBack');
        eventBus.$on('examineEditCallBack',function(opinion,type){
            this.examineEditCallBack(opinion,type);
        }.bind(this));

        //选择审核人回调
        eventBus.$off('examineChoiceCallBack');
        eventBus.$on('examineChoiceCallBack',function(name){
            this.examineChoiceCallBack(name);
        }.bind(this));
    },
    activated() {
       
    },
    methods: {
        //获取审批日志
        async getActivitiList(id){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                id:this.orderDetail.id,
            }
            await gcywChangeRequestActivitiLog(params).then(({data}) => {
                this.activittList = data;
            }).catch((err) => {

            }).finally(() => {
                toast.clear();
            })
        },
        //不同意
        handleReject(){
            this.$router.push({
                name: "MyToDoExamineEdit",
                params: {
                    type: 'reject'
                },
            });
        },
        //修改后同意
        handleEditAdopt(){
            this.$router.push({
                name: "MyToDoExamineEdit",
                params: {
                    type: 'editAdopt'
                },
            });
        },
         //同意
        handleAdopt(){
            this.$router.push({
                name: "MyToDoExamineEdit",
                params: {
                    type: 'adopt'
                },
            });
        },
        //审核意见回调
        examineEditCallBack(opinion,type){
            if(type == 'reject'){

            }else if(type == 'editAdopt'){
                this.assigneePopupShow = true;
            }else if(type == 'adopt'){
                this.assigneePopupShow = true;
            }
        },
        //选择下一级审核人弹框点击
        handleAssigneePopupClick(){
            this.$router.push({
                name: "MyToDoExamineChoice",
                params: {
                    
                },
            });
        },
        //选择审核人回调
        examineChoiceCallBack(name){
            this.assigner = name;
        },
        //选择审核人取消
        handleAssigneeCancel(){
            this.assigneePopupShow = false;
            this.assigner = '请选择下一级审核人';
        },
        //选择审核人提交
        handleAssigneeSubmit(){
            this.$notify({
                type: 'success',
                message: "提交成功"
            });
            this.$router.push({
                name: 'MyToDoList',
                params: {
                    refresh:true,
                }
            });
        },
    },
}
</script>
<style lang="less" scoped>

</style>