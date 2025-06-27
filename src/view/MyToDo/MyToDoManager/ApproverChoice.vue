<template>
    <div class="detail-container">
        <div class="box-container">
            <div class="detail-title-info">
                <span class="info-title">请选择审批人</span>
            </div>
            <van-list v-model="loading" offset="30" :finished="finished" finished-text="没有更多了...">
                <div v-for="(item, index) in assigneeList" :key="index" class="item-container" @click="handleItemClick(item)">
                    <span>{{item.nickName}}</span>
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
    name: 'ApproverChoice',

    data () {
        return {
            loading: false,
            finished: true,

            //审核人信息
            assigneeList: [],
        }
    },
    created () {
        this.assigneeList = JSON.parse(this.$route.params.obj);
    },
    methods: {
        //列表条目点击
        handleItemClick(item){
            eventBus.$emit('approverChoiceCallBack',item);
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
.detail-container {
    padding-top: 10px;
}
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