<template>
    <div class="detail-container">
        <div class="box-container">
            <div class="detail-title-info">
                <span class="info-title">请选择审批人</span>
            </div>
            <van-list v-model="loading" offset="30" :finished="finished" finished-text="没有更多了..." @load="getAssigneeList">
                <div v-for="(item, index) in assigneeList" :key="index" class="item-container" @click="handleItemClick(item)">
                    <span>{{item.name}}</span>
                </div>
            </van-list>
        </div>
        <div class="default-button-container">
            <van-button class="button-info" icon="arrow-left" block type="default" round @click="handleCancel()">上一步</van-button>
        </div>
    </div>
</template>
<script>
import eventBus from '@/utils/eventBus.js'

export default {
    name: 'MyToDoExamineChoice',

    data () {
        return {
            loading: false,
            finished: true,

            //审核人信息
            assigneeList: [
                {
                    name: '张三',
                },
                {
                    name: '李四',
                },
                {
                    name: '王五',
                }
            ],
        }
    },
    created () {
        
    },
    methods: {
        //获取审核人
        getAssigneeList(params){
            // let toast = this.$toast.loading({
            //     duration: 0,
            //     message: "加载中..",
            //     forbidClick: true
            // });
            // getAvailableDriver(params).then(({data}) => {
            //     this.loading = true;
                this.finished = true;

            //     this.driverList = data;
            //     this.originalDriverList = data;
            // }).catch(() => {
                
            // }).finally(() => {
            //     toast.clear();
            // })
        },
        //列表条目点击
        handleItemClick(item){
            eventBus.$emit('examineChoiceCallBack',item.name);
            this.$router.back();
        },
        //上一步点击
        handleCancel(){
            this.$router.back();
        }
    }
}
</script>
<style lang="less" scoped>
.item-container {
    width: 100%;
    height: 58px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    position: relative;
    background: #ffffff;

    span {
        font-size: 14px;
        color: #2e2e2e;
        margin-left: 10px;
    } 
}
</style>