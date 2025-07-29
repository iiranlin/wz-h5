<template>
    <div class="default-container" ref="container">
        <van-sticky>
            <div class="list-search-container">
                <van-search 
                    v-model="formData.keywords" 
                    placeholder="输入关键字搜索" 
                    shape="round" 
                    left-icon="none"
                    @search="handeSearch()">
                    <template slot='right-icon'>
                        <van-icon name="search" @click="handeSearch()"/>
                    </template>
                </van-search>
            </div>
        </van-sticky>
        <div class="tabs">
            <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
                <van-list 
                    v-model="loading" 
                    :finished="finished" 
                    finished-text="没有更多了..." 
                    @load="getList">

                    <div v-for="(item,index) in dataList" :key="index" class="box-container" @click.stop="handleItemClick(item)">
                        <div class="list-title-content">
                            <span>业务编码：</span>
                            <span class="font-weight" style="color:#134daa;">{{item.businessCode}}</span>
                        </div>
                        <ul class="list-ul">
                            <li>
                                <span>业务类型：</span>
                                <span>{{item.businessType | orderTypeFilter(dict.flowBusinessType)}}</span>
                            </li>
                            <li>
                                <span>需求组织：</span>
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
                            <van-button class="button-info" round type="info" @click.stop="handleExamineClick(item)">审核</van-button>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
        <back-to-top :className="className"></back-to-top>
    </div>  
</template>
<script>
import BackToTop from '@/components/BackToTop'
import keepPages from '@/view/mixins/keepPages'
import { wfTodoList } from '@/api/myToDoList'
import indexMixin from '@/view/mixins'

export default {
    name:'WaitExamineList',
    mixins: [keepPages,indexMixin],
    components: {BackToTop},
    dicts: ['flowBusinessType'],
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('public/setScrollPosition', document.querySelector(this.className).scrollTop)
      next();
    },

    data() {
        return {
            className: '.default-container',
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
    mounted () {
      
    },
    created () {
        this.$store.commit('removeThisPage', 'DemandPlanningExamine')
    },
    activated () {
      this.scrollPositionInit(this.className, this.finished)
    },
    methods: {
        //获取列表数据
        getList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                status: '2',
            }
            wfTodoList(Object.assign({}, params,this.listQuery,this.formData)).then(({ data }) => {
                if(this.refreshLoading){
                    this.dataList = [];
                    this.refreshLoading = false;
                }
                this.loading = false;
                this.dataList = [...this.dataList, ...data.list];

                if (data?.list?.length === 0) {
                    this.finished = true;
                    return;
                }
                this.listQuery.pageNum = this.listQuery.pageNum + 1;
            }).catch((error) => {
                this.loading = false;
                this.finished = true;
            }).finally(() => {
                toast.clear();
            });
        },
        //列表条目点击
        handleItemClick(item){
            this.$router.push({
                name: "DemandPlanningExamine",
                params: { 
                    obj: JSON.stringify(item),
                    type: '0',
                },
            });
        },
        //去审核点击
        handleExamineClick(item){
            this.$router.push({
                name: "DemandPlanningExamine",
                params: { 
                    obj: JSON.stringify(item),
                    type: '0',
                },
            });
        },
        //搜索点击
        handeSearch(){
            this.onRefresh();
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
.list-search-container {
    margin-bottom: 10px;
}
</style>