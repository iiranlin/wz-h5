<template>
    <div class="default-container" ref="container">
        <van-sticky>
            <div class="list-search-container">
                <van-search 
                    v-model="formData.keywords" 
                    placeholder="输入关键字搜索" 
                    shape="round" 
                    background="#8ebdec"
                    @search="handeSearch()">
                </van-search>
                <van-button class="cancel-button" size="small" round type="default" @click="handleCancelClick()">取消</van-button>
            </div>
        </van-sticky>
        <div class="tabs">
            <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
                <van-list 
                    v-model="loading" 
                    :finished="finished" 
                    finished-text="没有更多了..." 
                    @load="geList">

                    <div v-for="(item,index) in 10" :key="index" class="box-container" @click="handleAllItemClick(item)">
                        <ul class="list-ul">
                            <li>
                                <span class="font-weight">业务编号：</span>
                                <span class="font-weight">XQ2025050007</span>
                            </li>
                            <li>
                                <span>业务类型：</span>
                                <span>分部用料需求</span>
                            </li>
                            <li>
                                <span>需求项目：</span>
                                <span>标段项目名称</span>
                            </li>
                            <li>
                                <span>需求名称：</span>
                                <span>需求计划名称</span>
                            </li>
                            <li>
                                <span>审核时间：</span>
                                <span>2025-03-20 15:35</span>
                            </li>
                            <li>
                                <span>审核意见：</span>
                                <span>审核意见审核意见审核意见</span>
                            </li>
                        </ul>
                        <div class="list-ul-button">
                            <van-button class="button-info" plain round type="info" @click="handleProcessClick()">查看流程</van-button>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>  
</template>
<script>
import keepPages from '@/view/mixins/keepPages'

export default {
    name:'MyToDoSearch',
    mixins: [keepPages],

    data() {
        return {
            menuActiveIndex:0,

            formData: {
                keywords: '',
            },
            //列表数据
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
    activated () {
        if (this.$route.params.refresh) {
            this.waitRefresh();
            this.historyRefresh();
        }
        this.$store.commit('removeThisPage', 'MyToDoDetail')
    },
    methods: {
        //获取订单状态字典
        getOrderStatusOptions(){

            // getListByParentId('1522830760585670657').then(({data}) => {
            //     this.orderStatusOptions = data;
            // }).catch((err) => {
                
            // })
        },
        //获取列表数据
        geList(){
            // let toast = this.$toast.loading({
            //     duration: 0,
            //     message: "正在加载...",
            //     forbidClick: true
            // });
            // let  params = {
            //     reviewCompleted: '0',
            // }
            // gcywVehicleRequestListPageForH5(Object.assign({}, params,this.waitListQuery)).then(({ data }) => {
            //     if(this.waitRefreshLoading){
            //         this.waitOrderList = [];
                this.refreshLoading = false;
            //     }
            //     this.waitLoading = false;
            //     this.waitOrderList = [...this.waitOrderList, ...data.list];

            //     if (!data.hasNextPage) {
                    this.finished = true;
            //         return;
            //     }
            //     this.waitListQuery.pageNum = this.waitListQuery.pageNum + 1;
            // }).catch((error) => {
            //     this.waitLoading = false;
            //     this.waitFinished = true;
            // }).finally(() => {
            //     toast.clear();
            // });
        },
        //列表条目点击
        handleAllItemClick(item){

        },
        //查看流程点击
        handleProcessClick(){
            this.$router.push({
                name: "MyProcess",
                params: { 
                    
                },
            });
        },
        //搜索点击
        handeSearch(){
            
        },
        //取消点击
        handleCancelClick(){
            this.$router.back();
        },
        //列表刷新
        onRefresh(){
            this.refreshLoading = true;
            this.loading = true;
            this.finished = false;
            this.listQuery.pageNum = 1;
            this.geList();
        },
    },
};
</script>
<style lang="less" scoped>
.list-search-container {
    margin-bottom: 10px;
    background: #8ebdec;
    display: flex;
    align-items: center;

    .cancel-button {
        font-size: 12px;
        width: 18%;
        height: 34px;
    }
}
::v-deep .van-search {
    width: 80%;
}
</style>