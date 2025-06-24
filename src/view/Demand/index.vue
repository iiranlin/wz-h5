<template>
  <div ref="container">
    <div class="list-search-container">
     <van-search v-model="formData.keywords" show-action shape="round" background="#eef6ff"
                placeholder="请输入搜索关键词">
                <template #action>
                    <div>搜索</div>
                </template>
            </van-search>
            <!-- <van-search 
                v-model="formData.keywords" 
                placeholder="输入关键字搜索" 
                shape="round" 
                background="#eef6ff"
                readonly
                @click="handeSearchClick()">
            </van-search> -->
    </div>
    <div class="tabs">
      <van-tabs v-model="menuActiveIndex" color="#0571ff" background="#eef6ff" title-active-color="#0571ff"
        @change="tabsChange" title-inactive-color="#2e2e2e">
        <van-tab v-for="item in tabList" :title="item.title" :key="item.id" :name="item.id">

          <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
            <van-list v-model="loading" :finished="allFinished" finished-text="没有更多了..." @load="onLoad">
              <div v-for="(item, index) in listGhsData" :key="index" class="box-container" @click="handleAllItemClick(item)">
                <ul class="list-ul">
                  <li>
                    <span class="font-weight">需求编号:</span>
                    <span class="font-weight">{{ item.planNumber }}</span>
                  </li>
                  <li>
                    <span style="width: 230px;">供应需求：</span>
                    <span class="text">{{ item.planName }}</span>
                  </li>
                  <li>
                    <span style="width: 230px;">需求项目：</span>
                    <span>{{ item.sectionName }}</span>
                  </li>
                  <li>
                    <span style="width: 230px;">需求计划表:</span>
                    <span style="color:#1989fa;">
                      <template>
                        <div v-for="(item1,index1) in item.fileList" :key="index1">
                          <div v-for="(item2,index2) in item1.fileList" :key="index2"> 
                            <a href="javascript:;" @click="dialogPopup(item2.filePath,item2.fileName)">{{ item2.fileName }}</a>
                          </div>
                        </div>
                      </template>
                    </span>
                  </li>
                  <li class="li-status">
                    <van-tag type="primary" round size="medium" v-if="item.status == 2">货运中</van-tag>
                    <van-tag type="primary" round size="medium" v-if="item.status == 1">未发货</van-tag>
                    <van-tag type="primary" round size="success" v-if="item.status == 4">供应中</van-tag>
                    <van-tag type="primary" round size="medium" v-if="item.status == 3" class="li-status-completed">已完成</van-tag>
                  </li>
                </ul>
                <div class="list-ul-button">
                  <van-button class="button-info" plain round type="info" @click="handleSupplyClick()"
                    v-if="[4, 5].includes(menuActiveIndex)">供应详情</van-button>
                  <van-button class="button-info" plain round type="info" @click="handleLookClick()"
                    v-if="[4, 5].includes(menuActiveIndex)">物流查看</van-button>
                  <van-button class="button-info" round type="info" @click="handleSendGoodsClick(item.id)"
                    v-if="[3, 4].includes(menuActiveIndex)">发货</van-button>
                  <van-button class="button-info" round type="info" @click="handleConfirmClick()"
                    v-if="[1, 2].includes(menuActiveIndex)">确认需求</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>

      </van-tabs>
    </div>
    <!-- 查看pdf -->
    <van-dialog v-model="showPdf" title="查看pdf" show-cancel-button>
      <img :src="`http://10.59.249.62:7890/api/blcd-base/minio/download?filePath=${filePath}&fileName=${fileName}`" style="height: 400px;width: 100%;"/>
    </van-dialog>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import {demandManagementList,demandManagementLookPdf} from '@/api/demand/demandManagement'
export default {
  name: 'MyToDoList',
  mixins: [keepPages],

  data() {
    return {
      menuActiveIndex: 0,
      showPdf:false,
      formData: {
        keywords: '',
      },
      //全部
      allOrderList: [],

      allRefreshLoading: false,
      allLoading: false,
      allFinished: false,
      params:{
        pageNum:1,
        pageSize:10
      },
      tabList: [
        {
          id: 1,
          title: '全部'
        },
        {
          id: 2,
          title: '未确认',
        },
        {
          id: 3,
          title: '已确认'
        },
        {
          id: 4,
          title: '供货中',
        },
        {
          id: 5,
          title: '已完成',
        }
      ],
      listGhsData:[],
      filePath:"",
      fileName:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //初始化请求
    getList(){
       this.loading = true;
      demandManagementList(this.params).then((res) => {
          if (res.code == 0) {
            this.loading = false
            this.allRefreshLoading = false;
            if(res.data.pageNum=1){
              this.listGhsData = res.data.list
            }else{
              this.listGhsData = this.listGhsData.concat(res.data.list)
            }
          }
        })
    },
    tabsChange(e) {
      this.params.pageNum = 1;
      this.allFinished = false;
      this.getList()
    },
    dialogPopup(path,name){
      let params={
        filePath:path,
        fileName:name
      }
      demandManagementLookPdf(params).then((res)=>{
        console.log(res)
      })
      // this.filePath = path
      // this.fileName = name
      // this.showPdf = true
    },
    //发货
    handleSendGoodsClick(id) {
      this.$router.push({ path: '/sendGoods',query:{id:id} })
    },
    //查看物流
    handleLookClick() {
      this.$router.push({ name: 'LogisticsView' })
    },
    //供应详情
    handleSupplyClick() {
      this.$router.push({ path: '/supplyMsg' })
    },
    //确认需求
    handleConfirmClick() {
      this.$router.push({ path: '/confirm' })
    },
    //获取全部订单
    getAllList() {
      this.allRefreshLoading = false;
      this.allFinished = true;
    },
    //全部列表刷新
    allRefresh() {
      this.params.pageNum=1
       this.allFinished = false;
     
      this.getList()
      
    },
     // 上拉加载处理函数
    // onLoad() {
    //  this.params.pageNum++;
    // // this.allRefreshLoading = false;
    //   // this.loading = true
    //   this.getList()
    // },
  },
};
</script>
<style lang="less" scoped>
.li-status {
  .van-tag--primary {
    color: #028bff;
    background: #edf4ff;
  }

  .van-tag--danger {
    color: #f83738;
    background: #ffe2e2;
  }

  .li-status-completed {
    color: #6f6f6f;
    background: #ededed;
  }
}

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

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button-info {
  width: 85px;
  font-size: 12px;
}
</style>