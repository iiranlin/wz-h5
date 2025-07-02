<template>
  <div ref="container">
    <div class="list-search-container">
       <van-search v-model="params.shipmentBatchNumber" show-action shape="round" background="#eef6ff"
                placeholder="请输入发货单号">
                <template #action>
                    <div @click="onSearch">搜索</div>
                </template>
            </van-search>
    </div>
    <div class="tabs" v-if="returnList.length>0">
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
        <van-list v-model="loading" :finished="finished " finished-text="没有更多了..." @load="onLoad" :offset="10" :immediate-check="false">
          <div v-for="(item, index) in returnList" :key="index" class="box-container" @click="handleDetailsItemClick(item.id)">
            <ul class="list-ul">
              <li>
                <span class="font-weight">退货单号:</span>
                <span class="font-weight" style="color:#1989fa;">{{ item.backNumber }}</span>
              </li>
              <li>
                <span>需求编号：</span>
                <span class="text" style="color:#1989fa;">{{ item.planNumber }}</span>
              </li>
              <li>
                <span>发货单号:</span>
                <span class="text" style="color:#1989fa;">{{ item.shipmentBatchNumber }}</span>
              </li>
              <li>
                <span style="width: 230px;">供应需求名称:</span>
                <span>{{ item.planName }}</span>
              </li>
              <li>
                <span>需求项目:</span>
                <span>{{ item.sectionName }}</span>
              </li>
              <li>
                <span>退货时间:</span>
                <span v-if="item.backDate !=''">{{ formattedCreateDate(item.backDate)}}</span>
              </li>
              <li class="li-status">
                <van-tag type="primary" round size="medium" v-if="item.backNode==2">收货不通过</van-tag>
                <van-tag type="primary" round size="medium" v-else>收货通过</van-tag>
              </li>
            </ul>
          </div>
        </van-list>
      </van-pull-refresh>

    </div>
    <div v-else>
      <van-empty description="暂无数据" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import keepPages from '@/view/mixins/keepPages'
import {returnGoodsList} from '@/api/demand/returnGoods'
import { getUserInfo } from '@/utils/user-info'
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'MyToDoList',
  mixins: [keepPages],

  data() {
    return {
      menuActiveIndex: 0,
      userInfo: getUserInfo(),
      formData: {
        keywords: '',
      },
      allRefreshLoading:false,
      finished :false,
      loading:false,
      params:{
        sellerId:"",
        pageNum:1,
        pageSize:10,
        isAsc:"",
        orderByColumn:"",
        shipmentBatchNumber:""
      },
      returnList:[],
      total:0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      let params = {
        sellerId:this.userInfo.id,
        pageNum:this.params.pageNum,
        pageSize:this.params.pageSize,
        isAsc:this.params.isAsc,
        orderByColumn:this.params.orderByColumn,
        shipmentBatchNumber:this.params.shipmentBatchNumber,
      }
      returnGoodsList(params).then((res)=>{
        if(res.code==0){
            Toast.clear()
            this.total = res.data.total
            if (this.allRefreshLoading) {
              this.returnList = [];
              this.allRefreshLoading = false;
            }
            if(res.data.list.length<1){
              this.returnList = res.data.list
            }else{
             
              this.returnList = this.returnList.concat(res.data.list)
            }
            if(this.returnList.length>=res.data.total){
              this.finished = true
            }
            this.loading = false


          //    if (this.allRefreshLoading) {
          //     this.listBySendData = [];
          //     this.allRefreshLoading = false;
          //   }
          //   this.total = res.data.total
          //    const newData = res.data.list.map((item) => ({
          //     ...item,
          //     fileByList: item.fileByList ? JSON.parse(item.fileByList) : '', // 默认值设为 [] 避免 JSON.parse 报错
          //   }));
          //   if(res.data.list.length<1){
          //     this.listBySendData = newData
          //   }else{
          //     this.listBySendData = this.listBySendData.concat(newData)
          //   }
          //  if (this.listBySendData.length >= res.data.total) {
          //     this.finished  = true;
          //   }
          //   this.loading = false;





        }
      })
    },
      formattedCreateDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0
      return `${year}-${month}-${day}`;
    },
    //全部列表条目点击
    handleDetailsItemClick(id) {
      this.$router.push({ path: '/returnDetails',query:{id:id} })
    },
    //全部列表刷新
    allRefresh() {
      this.params.pageNum = 1
      this.finished = false
      this.allRefreshLoading = true
      this.getList();
    },
    onLoad(){
      this.params.pageNum++;
      this.getList()
    },
    onSearch(){
      this.params.pageNum = 1
      this.getList();
    }
    //待审核列表刷新

  },
};
</script>
<style lang="less" scoped>
::v-deep .van-tabs__content {
  height: calc(100vh - 162px);
  overflow-y: scroll;
}

.tabs {
  height: calc(100vh - 62px);
  overflow: scroll;
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

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-ul-button {
  display: flex;
}

.button-info {
  width: 85px;
  font-size: 12px;
}
</style>