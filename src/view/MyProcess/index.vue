<template>
    <div class="default-container" ref="container">
        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
            <van-list 
                v-model="loading" 
                :finished="finished" 
                finished-text="没有更多了..." 
                @load="getList">

                <div v-for="(item,index) in 10" :key="index" class="box-container">
                    <ul class="list-ul">
                        <li>
                            <span class="font-weight">节点：</span>
                            <span class="font-weight">审核人</span>
                        </li>
                        <li>
                            <span>单位：</span>
                            <span>施工单位</span>
                        </li>

                        <li class="li-item-both">
                            <div class="li-item-left">
                                <span>操作人：</span>
                                <span>操作人</span>
                            </div>
                            <div class="li-item-right">
                                <span>操作时间：</span>
                                <span>2025-05-30 17:30:02</span>
                            </div>
                        </li>
                        <li class="li-status">
                            <span>状态：</span>
                            <span class="font-weight" style="color:#158aff">已同意</span>
                        </li>
                        <li>
                            <span>备注：</span>
                            <span>审核意见审核意见审核意见</span>
                        </li>
                    </ul>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>  
</template>
<script>

export default {
    name:'MyProcess',

    data() {
        return {
            dataList:[],

            refreshLoading:false,
            loading:false,
            finished:false,

            listQuery: {
                pageNum: 1,
                pageSize: 10,
            },
        };
    },
    created () {
        // this.getOrderStatusOptions();
    },
    methods: {
        //获取订单状态字典
        getOrderStatusOptions(){

            getListByParentId('1522830760585670657').then(({data}) => {
                this.orderStatusOptions = data;
            }).catch((err) => {
                
            })
        },
        //获取列表数据
        getList(){
            this.refreshLoading = false;
            this.finished = true;
        },
        //列表刷新
        onRefresh(){
            this.refreshLoading = true;
            this.loading = true;
            this.finished = false;
            this.listQuery.pageNum = 1;
            this.getList();
        },
    },
};
</script>
<style lang="less" scoped>
.default-container {
    padding-top: 10px;
}
li :nth-child(1){
    min-width: 60px
}
li :nth-child(2){
    width: initial;
}
.li-item-both {
    .li-item-right {
        flex: initial;
    }
}
</style>