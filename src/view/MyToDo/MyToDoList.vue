<template>
    <div class="my-to-do-list">
        <van-sticky class="list-search-container">
            <van-search ref="getheight"
                v-model="formData.keywords" 
                placeholder="输入关键字搜索" 
                shape="round" 
                background="#eef6ff"
                readonly
                @click="handeSearchClick()">
            </van-search>
        </van-sticky>
        <div class="tabs">
            <van-tabs 
                sticky
                v-model="menuActiveIndex" 
                color="#0571ff"
                background="#eef6ff"
                title-active-color="#0571ff"
                title-inactive-color="#2e2e2e">
                <van-tab title="待审核">
                    <van-pull-refresh v-model="waitRefreshLoading" @refresh="waitRefresh" success-text="刷新成功">
                        <van-list 
                            v-model="waitLoading" 
                            :finished="waitFinished" 
                            finished-text="没有更多了..." 
                            @load="getWaitList">

                            <div v-for="(item,index) in waitOrderList" :key="index" class="box-container" @click="handleWaitItemClick(item)">
                                <ul class="list-ul">
                                    <li>
                                        <span class="font-weight">业务编码：</span>
                                        <span class="font-weight">{{item.businessCode}}</span>
                                    </li>
                                    <li>
                                        <span>业务类型：</span>
                                        <span>{{item.businessType | orderTypeFilter(dict.flowBusinessType)}}</span>
                                    </li>
                                    <li>
                                        <span>所属部门：</span>
                                        <span>{{item.startDeptName}}</span>
                                    </li>
                                    <li>
                                        <span>提交人：</span>
                                        <span>{{item.startUserName}}</span>
                                    </li>
                                    <li>
                                        <span>提交时间：</span>
                                        <span>{{parseTime(item.startTime,'{y}-{m}-{d}')}}</span>
                                    </li>
                                </ul>
                                <div class="list-ul-button">
                                    <van-button class="button-info" plain round type="info" @click.stop="handleProcessClick(item)">查看流程</van-button>
                                    <van-button class="button-info" round type="info" @click.stop="handleExamineClick()">去审核</van-button>
                                </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </van-tab>
                <van-tab title="待处理">
                    <van-pull-refresh v-model="waitHandleRefreshLoading" @refresh="waitHandleRefresh" success-text="刷新成功">
                        <van-list 
                            v-model="waitHandleLoading" 
                            :finished="waitHandleFinished" 
                            finished-text="没有更多了..." 
                            @load="getWaitHandleList">

                            <div v-for="(item,index) in waitHandleList" :key="index" class="box-container" @click="handleWaitHandleItemClick(item)">
                                <ul class="list-ul">
                                    <li>
                                        <span class="font-weight">业务编码：</span>
                                        <span class="font-weight">{{item.businessCode}}</span>
                                    </li>
                                    <li>
                                        <span>业务类型：</span>
                                        <span>{{item.businessType | orderTypeFilter(dict.flowBusinessType)}}</span>
                                    </li>
                                    <li>
                                        <span>审核人：</span>
                                        <span>{{item.assignee}}</span>
                                    </li>
                                    <li>
                                        <span>审核日期：</span>
                                        <span>{{item.auditDate}}</span>
                                    </li>
                                    <li>
                                        <span>驳回原因：</span>
                                        <span>{{item.message}}</span>
                                    </li>
                                </ul>
                                <div class="list-ul-button">
                                    <van-button class="button-info" plain round type="info" @click.stop="handleProcessClick(item)">查看流程</van-button>
                                </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </van-tab>
                <van-tab title="已审核">
                    <van-pull-refresh v-model="historyRefreshLoading" @refresh="historyRefresh" success-text="刷新成功">
                        <van-list 
                            v-model="historyLoading" 
                            :finished="historyFinished" 
                            finished-text="没有更多了..." 
                            @load="getHistoryList">

                            <div v-for="(item,index) in historyOrderList" :key="index" class="box-container" @click="handleHistoryItemClick(item)">
                                <ul class="list-ul">
                                    <li>
                                        <span class="font-weight">业务编码：</span>
                                        <span class="font-weight">{{item.businessCode}}</span>
                                    </li>
                                    <li>
                                        <span>业务类型：</span>
                                        <span>{{item.businessType | orderTypeFilter(dict.flowBusinessType)}}</span>
                                    </li>
                                    <li>
                                        <span>所属部门：</span>
                                        <span>{{item.startDeptName}}</span>
                                    </li>
                                    <li>
                                        <span>提交人：</span>
                                        <span>{{item.startUserName}}</span>
                                    </li>
                                    <li class="li-item-overlength">
                                        <span>审核开始时间：</span>
                                        <span>{{parseTime(item.startTime,'{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                                    </li>
                                    <li class="li-item-overlength">
                                        <span>审核结束时间：</span>
                                        <span>{{parseTime(item.endTime,'{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                                    </li>
                                    <li>
                                        <span>审核意见：</span>
                                        <span>{{item.message}}</span>
                                    </li>
                                    <li class="li-status">
                                        <van-tag :type="checkAuditStatus(item.auditStatus)" round size="medium">{{item.auditStatus | orderTypeFilter(dict.flowTaskStatus)}}</van-tag>
                                    </li>
                                </ul>
                                <div class="list-ul-button">
                                    <van-button class="button-info" plain round type="info" @click.stop="handleProcessClick(item)">查看流程</van-button>
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
import { wfTodoList,wfHandleList } from '@/api/myToDoList'
import indexMixin from '@/view/mixins'

export default {
    name:'MyToDoList',
    mixins: [keepPages, indexMixin],
    dicts: ['flowBusinessType','flowTaskStatus'],

    beforeRouteEnter (to, from, next) {
        next();
    },
    beforeRouteLeave (to, from, next) {
        from.meta.navIndex = this.menuActiveIndex;
        next();
    },

    data() {
        return {
            menuActiveIndex: 0,
            offsetTop: 0,

            formData: {
                keywords: '',
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
        };
    },
    mounted () {
      
    },
    created () {
        if(this.$route.meta.navIndex){
            this.menuActiveIndex = this.$route.meta.navIndex;
        }
    },
    activated () {
        
    },
    methods: {
        //获取待审批的订单
        getWaitList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                status: '2',
            }
            wfTodoList(Object.assign({}, params,this.waitListQuery)).then(({ data }) => {
                if(this.waitRefreshLoading){
                    this.waitOrderList = [];
                    this.waitRefreshLoading = false;
                }
                this.waitLoading = false;
                this.waitOrderList = [...this.waitOrderList, ...data.list];

                if (data?.list?.length === 0) {
                    this.waitFinished = true;
                    return;
                }
                this.waitListQuery.pageNum = this.waitListQuery.pageNum + 1;
            }).catch((error) => {
                this.waitLoading = false;
                this.waitFinished = true;
            }).finally(() => {
                toast.clear();
            });
        },
        //获取待处理数据
        getWaitHandleList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            wfHandleList(Object.assign({},this.waitHandleListQuery)).then(({ data }) => {
                if(this.waitHandleRefreshLoading){
                    this.waitHandleList = [];
                    this.waitHandleRefreshLoading = false;
                }
                this.waitHandleLoading = false;
                this.waitHandleList = [...this.waitHandleList, ...data.list];

                if (data?.list?.length === 0) {
                    this.waitHandleFinished = true;
                    return;
                }
                this.waitHandleListQuery.pageNum = this.waitHandleListQuery.pageNum + 1;
            }).catch((error) => {
                this.waitHandleLoading = false;
                this.waitHandleFinished = true;
            }).finally(() => {
                toast.clear();
            });
        },
        //获取已审批订单
        getHistoryList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                status: '3',
            }
            wfTodoList(Object.assign({}, params,this.historyListQuery)).then(({ data }) => {
                if(this.historyRefreshLoading){
                    this.historyOrderList = [];
                    this.historyRefreshLoading = false;
                }
                this.historyLoading = false;
                this.historyOrderList = [...this.historyOrderList, ...data.list];

                if (data?.list?.length === 0) {
                    this.historyFinished = true;
                    return;
                }
                this.historyListQuery.pageNum = this.historyListQuery.pageNum + 1;
            }).catch((error) => {
                this.historyLoading = false;
                this.historyFinished = true;
            }).finally(() => {
                toast.clear();
            });
        },
        //已审核状态图标判断
        checkAuditStatus(auditStatus){
            if(auditStatus == '2'){
                return 'primary'
            }else if(auditStatus == '3'){
                return 'danger'
            }
        },
        //待审核列表条目点击
        handleWaitItemClick(item){
            this.$router.push({
                name: "MyToDoDetail",
                params: { 
                    type: '0',
                },
            });
        },
        //待处理列表条目点击
        handleWaitHandleItemClick(item){
            this.$router.push({
                name: "MyToDoDetail",
                params: { 
                    type: '0',
                },
            });
        },
        //已审核列表条目点击
        handleHistoryItemClick(item){
            this.$router.push({
                name: "MyToDoDetail",
                params: { 
                    type: '1',
                },
            })
        },
        //查看流程点击
        handleProcessClick(item){
            this.$router.push({
                name: "MyProcess",
                params: { 
                    businessId: item.businessId,
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
.my-to-do-list{
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  .van-tabs{
    ::v-deep .van-sticky--fixed{
      top: 54px !important;
    }
  }
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
 .li-item-overlength {
    & :nth-child(1){
        margin-right: 10px;
    }
}
</style>