<template>
    <div class="my-process" ref="container">
        <van-list 
            v-model="loading" 
            :finished="finished" 
            finished-text="没有更多了..." 
            @load="getList">

            <div v-for="(item,index) in dataList" :key="index" class="box-container">
                <ul class="list-ul">
                    <li>
                        <span class="font-weight">节点：</span>
                        <span class="font-weight">{{item.actName}}</span>
                    </li>
                    <li>
                        <span>单位：</span>
                        <span>{{item.orgName}}</span>
                    </li>
                    <li>
                        <span>操作人：</span>
                        <span>{{item.assigneeName}}</span>
                    </li>
                    <li>
                        <span>操作时间：</span>
                        <span>{{item.endTime}}</span>
                    </li>
                    <li class="li-status">
                        <span>状态：</span>
                        <span class="font-weight" style="color:#158aff" v-if="item.status == '2'">通过</span>
                        <span class="font-weight" style="color:#ee0a24" v-if="item.status == '3'">驳回</span>
                    </li>
                    <li>
                        <span>意见：</span>
                        <span>{{item.message}}</span>
                    </li>
                </ul>
            </div>
        </van-list>
    </div>
</template>
<script>
import { wfHistoryList } from '@/api/myToDoList'

export default {
    name:'MyProcess',

    data() {
        return {
            businessId:'',
            dataList:[],
            loading:false,
            finished:false,
        }
    },
    created () {
        this.businessId = this.$route.params.businessId;
        this.getList();
    },
    methods: {
        //获取列表数据
        getList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            wfHistoryList(this.businessId).then(({ data }) => {
                this.dataList = data.recordList;
                this.loading = false;
                this.finished = true;
            }).catch((error) => {
                this.loading = false;
                this.finished = true;
            }).finally(() => {
                toast.clear();
            });
        },
    },
};
</script>
<style lang="less" scoped>
.my-process {
  padding-top: 10px;
}
</style>