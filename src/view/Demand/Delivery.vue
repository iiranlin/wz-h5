<template>
    <div ref="container">
        <div class="list-search-container">
            <van-search 
                v-model="formData.keywords" 
                placeholder="输入关键字搜索" 
                shape="round" 
                background="#eef6ff"
                readonly
                @click="handeSearchClick()">
            </van-search>
        </div>
        <div class="tabs">
            <van-tabs 
                v-model="menuActiveIndex" 
                color="#0571ff"
                background="#eef6ff"
                title-active-color="#0571ff"
                @change="tabsChange"
                title-inactive-color="#2e2e2e">
                <van-tab v-for="item in tabList" :title="item.title" :key="item.id" :name="item.title">
                    
                    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
                        <van-list 
                            v-model="allLoading" 
                            :finished="allFinished" 
                            finished-text="没有更多了..." 
                            @load="getAllList">

                            <div v-for="(item,index) in 10" :key="index" class="box-container" @click="handleAllItemClick(item)">
                                <ul class="list-ul">
                                     <li>
                                        <span class="font-weight">发货单号:</span>
                                        <span class="font-weight">FH20250531004</span>
                                    </li>
                                    <li>
                                        <span>需求编号:</span>
                                        <span>XQ2025050007</span>
                                    </li>
                                    <li>
                                        <span style="width: 230px;">供应需求：</span>
                                        <span class="text">南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
                                    </li>
                                    <li>
                                        <span style="width: 230px;">物流单号：</span>
                                        <span>ES5456889635545</span>
                                    </li>
                                     <li>
                                        <span style="width: 230px;">需求项目: </span>
                                        <span>项目名称</span>
                                    </li>
                                    <li>
                                        <span style="width: 230px;">发货单附件:</span>
                                        <span style="color:#1989fa;">查看附件</span>
                                    </li>
                                    <li class="li-status">
                                        <van-tag type="primary" round size="medium">未发货</van-tag>
                                        <!-- <van-tag type="primary" round size="medium">货运中</van-tag>
                                        <van-tag type="primary" round size="warning">已完成</van-tag> -->
                                    </li>
                                </ul>
                                <div class="list-ul-button">
                                    <!-- <van-button class="button-info" plain round type="info" @click="handleEditClick()">编辑</van-button>
                                    <van-button class="button-info" plain round type="warning" @click="handleDelClick()">删除</van-button> -->
                                    <van-button class="button-info" plain round type="info" @click="handleSendGoodsClick()">确认发货</van-button>
                                    <van-button class="button-info" round type="info" @click="handleLookClick()">查看物流</van-button>
                                       <van-button class="button-info" plain round type="info" @click="handleCarGoClick()">货运详情</van-button>
                                    <van-button class="button-info" round type="info" size="mini" @click="handleConfirmClick()">增加货运位置</van-button>
                                </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </van-tab>
         
            </van-tabs>
        </div>
    </div>  
</template>
<script>
import keepPages from '@/view/mixins/keepPages'

export default {
    name:'MyToDoList',
    mixins: [keepPages],

    data() {
        return {
            menuActiveIndex:0,

            formData: {
                keywords: '',
            },
            //全部
            allOrderList:[],

            allRefreshLoading:false,
            allLoading:false,
            allFinished:false,

            allListQuery: {
                pageNum: 1,
                pageSize: 10,
            },
            //待审批
            waitOrderList:[],

            waitRefreshLoading:false,
            waitLoading:false,
            waitFinished:false,

            waitListQuery: {
                pageNum: 1,
                pageSize: 10,
            },
            //待处理
            waitHandleList:[],

            waitHandleRefreshLoading:false,
            waitHandleLoading:false,
            waitHandleFinished:false,

            waitHandleListQuery: {
                pageNum: 1,
                pageSize: 10,
            },
            //已审批
            historyOrderList:[],

            historyRefreshLoading:false,
            historyLoading:false,
            historyFinished:false,

            historyListQuery: {
                pageNum: 1,
                pageSize: 10,
            },

            //订单状态字典
            orderStatusOptions:[],
            //优先保障字典
            guaranteeOptions:[],
            tabList:[
                {
                    id:1,
                    title:'全部'
                },
                {
                    id:2,
                    title:'未发货',
                },
                {
                    id:3,
                    title:'货运中'
                },
                {
                    id:4,
                    title:'已完成',
                }
            ]
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
        tabsChange(e){
            console.log(e)
        },
        //发货
        handleSendGoodsClick(){
            this.$router.push({path:'/sendGoods'})
        },
        //查看物流
        handleLookClick(){
            this.$router.push({path:'/lookCargo'})
        },
        //货运详情
        handleCarGoClick(){
            this.$router.push({path:'/cargoDetails'})
        },
        //确认需求
        handleConfirmClick(){
            this.$router.push({path:'/confirm'})
        },
        //获取全部订单
        getAllList(){
            this.allRefreshLoading = false;
            this.allFinished = true;
        },
        //编辑
        handleEditClick(){

        },
        //删除
         handleDelClick(){

        },
        //获取待审批的订单
        getWaitList(){
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
                this.waitRefreshLoading = false;
            //     }
            //     this.waitLoading = false;
            //     this.waitOrderList = [...this.waitOrderList, ...data.list];

            //     if (!data.hasNextPage) {
                    this.waitFinished = true;
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
        //获取待处理数据
        getWaitHandleList(){

        },
        
        //获取已审批订单
        getHistoryList(){
            // let toast = this.$toast.loading({
            //     duration: 0,
            //     message: "正在加载...",
            //     forbidClick: true
            // });
            // let  params = {
            //     reviewCompleted: '1',
            // }
            // gcywVehicleRequestListPageForH5(Object.assign({}, params,this.historyListQuery)).then(({ data }) => {
            //     if(this.historyRefreshLoading){
            //         this.historyOrderList = [];
                    this.historyRefreshLoading = false;
            //     }
            //     this.historyLoading = false;
            //     this.historyOrderList = [...this.historyOrderList, ...data.list];

            //     if (!data.hasNextPage) {
                    this.historyFinished = true;
            //         return;
            //     }
            //     this.historyListQuery.pageNum = this.historyListQuery.pageNum + 1;
            // }).catch((error) => {
            //     this.historyLoading = false;
            //     this.historyFinished = true;
            // }).finally(() => {
            //     toast.clear();
            // });
        },
        //全部列表条目点击
        handleAllItemClick(item){

        },
        //待审核列表条目点击
        handleWaitItemClick(item){
            // this.$router.push({
            //     name: "ApprovalDetail",
            //     params: { 
            //         id:item.id,
            //     },
            // });
        },
        //待处理列表条目点击
        handleWaitHandleItemClick(item){
            // this.$router.push({
            //     name: "ApprovalDetail",
            //     params: { 
            //         id:item.id,
            //     },
            // });
        },
        //已审核列表条目点击
        handleHistoryItemClick(item){
            // this.$router.push({
            //     name: "ApprovalDetail",
            //     params: { 
            //         id:item.id,
            //     },
            // });
        },
        //查看流程点击
        handleProcessClick(){
            this.$router.push({
                name: "MyProcess",
                params: { 
                    
                },
            });
        },
        //去审核点击
        handleExamineClick(){
            this.$router.push({
                name: "MyToDoDetail",
                params: { 
                    type: '0',
                },
            });
        },
        //搜索点击
        handeSearchClick(){
            this.$router.push({
                name: "MyToDoSearch",
                params: { 
                    type: '0',
                },
            });
        },
        //全部列表刷新
        allRefresh(){
            this.allRefreshLoading = true;
            this.allLoading = true;
            this.allFinished = false;
            this.allListQuery.pageNum = 1;
            this.getAllList();
        },
        //待审核列表刷新
        waitRefresh(){
            this.waitRefreshLoading = true;
            this.waitLoading = true;
            this.waitFinished = false;
            this.waitListQuery.pageNum = 1;
            this.getWaitList();
        },
        //待处理列表刷新
        waitHandleRefresh(){
            this.waitHandleRefreshLoading = true;
            this.waitHandleLoading = true;
            this.waitHandleFinished = false;
            this.waitHandleListQuery.pageNum = 1;
            this.getWaitHandleList();
        },
        //已审核列表刷新
        historyRefresh(){
            this.historyRefreshLoading = true;
            this.historyLoading = true;
            this.historyFinished = false;
            this.historyListQuery.pageNum = 1;
            this.getHistoryList();
        },
    },
};
</script>
<style lang="less" scoped>
::v-deep .van-tabs__content {
    height: calc(100vh - 162px);
    overflow-y: scroll;
}

.van-search {

  .van-search__content {
    border-radius: 50px;
    background: #fff;
  }

  .van-cell {
    border-radius: 50px;
    background: #fff;
  }
}
.text{
    white-space:nowrap;
    overflow: hidden;
   text-overflow: ellipsis;
}
.list-ul-button{
    display: flex;
}
.button-info{
    width: 85px;
    font-size: 12px;
}
</style>