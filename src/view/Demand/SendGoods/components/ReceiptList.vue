<template>
    <div class="detail-button-container">
        <div class="detail-floor-content">
            <img src="/static/icon-receipt.png"/>
            <span>选择收货信息</span>
        </div>
        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
            <van-list 
                v-model="loading" 
                :finished="finished" 
                finished-text="没有更多了..." 
                @load="getList">

                <div v-for="(item,index) in dataList" :key="index" class="box-container" @click="handleItemClick(index)">
                    <div class="single-list-title">
                        <img :src="currentIndex == index?'/static/icon-checked.png':'/static/icon-check-normal.png'"/>
                        <span>{{item.receiver}}</span>
                        <span>{{item.phone}}</span>
                    </div>
                    <ul class="single-list-ul">
                        <li>
                            <span>收货地址：</span>
                            <span>{{item.receiveraddress}}</span>
                        </li>
                        <!-- <li>
                            <span>使用地点：</span>
                            <span>{{item.addr}}</span>
                        </li> -->
                    </ul>
                    <div class="single-list-ul-button">
                        <div @click="handleDeleteClick(index)">
                            <img src="/static/icon-delete.png">
                            <span>删除</span>
                        </div>
                        <div @click="handleEditClick(index)">
                            <img src="/static/icon-edit.png">
                            <span>编辑</span>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
        <div class="default-button-container">
            <van-button class="button-info" block type="default" round icon="plus" @click="handleCreate()">新建收货人</van-button>
            <van-button class="button-info" block type="info" round @click="handleConfirm()">确定</van-button>
        </div>
    </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import {materialReceiverInformationList,materialReceiverInformationRemove} from '@/api/prodmgr-inv/receipt'

export default {
    name: 'ReceiptList',
    mixins: [keepPages],

    data () {
        return {
            refreshLoading:false,
            loading:false,
            finished:false,

            //列表数据
            dataList:[],
            //当前选中角标
            currentIndex: null,

            listQuery: {
                pageNum: 1,
                pageSize: 10,
            },
        }
    },
    created() {

    },
    activated() {
        if(this.$route.params.refresh){
            this.onRefresh();
        }
    },
    methods: {
        //获取数据
        getList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            materialReceiverInformationList(this.listQuery).then(({ data }) => {
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
        //删除条目
        handleDelete(index){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            materialReceiverInformationRemove(this.dataList[index].id).then(({ message }) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.onRefresh();
            }).catch((error) => {
                this.loading = false;
                this.finished = true;
            }).finally(() => {
                toast.clear();
            });
        },
        //条目点击
        handleItemClick(index){
            this.currentIndex = index;
        },
        //删除点击
        handleDeleteClick(index){
            this.$dialog.confirm({
                title: '标题',
                message: '是否确认删除？',
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                this.handleDelete(index);
            })
        },
        //编辑点击
        handleEditClick(index){
            this.$router.push({
                path: 'ReceiptOperategoods',
                query: {
                    type: 'update',
                    position: index,
                    obj: JSON.stringify(this.dataList[index]),
                },
            })
        },
        //新建点击
        handleCreate(){
            this.$router.push({
                path: 'ReceiptOperategoods',
                query: {
                    type: 'create',
                },
            })
        },
        //确定
        handleConfirm(){
          if(this.currentIndex == null){
            this.$notify({
                type: 'warning',
                message: '请选择收货信息!',
            });
            return
          }
          const data = this.dataList[this.currentIndex]
          this.$store.dispatch('public/setHistoryData', {receiver: data.receiver, phone: data.phone, receiveraddress: data.receiveraddress})
          const { uniqueNumber = null, contractId, type, id } = this.$route.query
          this.$router.push({name: 'EditedMaterialGoods', query: {uniqueNumber, contractId, type, id}})
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
}
</script>
<style lang="less" scoped>
.box-container {
    padding: 0px;
}
.button-info {
    width: 169px;
}
::v-deep .van-button__icon {
    line-height: 34px;
}
.single-list-title {
    display: flex;
    align-items: center;
    height: 34px;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;

    img {
        margin-right: 4px;
        width: 18px;
        height: 18px;
    }
    span {
        margin-right: 12px;
        color: #151b3e;
        font-size: 13px;
        font-weight: 600;
    }
}
.single-list-ul {
    padding-left: 30px;
    padding-right: 24px;
    padding-bottom: 5px;

    li {
        display: flex;
        font-size: 13px;
        color: #151b3e;
        line-height: 26px;

        & :nth-child(2){
            overflow: hidden;
            word-break: break-all;
            flex: 1;
        }
    }
}
.single-list-ul-button {
    width: 100%;
    height: 35px;
    padding-right: 24px;
    box-sizing: border-box;

    div {
        display: flex;
        align-items: center;
        float: right;
        margin-left: 24px;
        height: 100%;

        img {
            width: 24px;
            height: 24px;
        }
        span {
            color: #151b3e;
            font-size: 12px;
        }
    }
}
</style>