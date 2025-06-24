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
            <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." @load="onLoad">

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
                            <a href="javascript:;" @click="dialogPopup(item2.filePath)">{{ item2.fileName }}</a>
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
                    v-if="[3, 4].includes(menuActiveIndex)">供应详情</van-button>
                  <van-button class="button-info" plain round type="info" @click="handleLookClick()"
                    v-if="[3, 4].includes(menuActiveIndex)">物流查看</van-button>
                  <van-button class="button-info" round type="info" @click="handleSendGoodsClick()"
                    v-if="[2, 3].includes(menuActiveIndex)">发货</van-button>
                  <van-button class="button-info" round type="info" @click="handleConfirmClick()"
                    v-if="[0, 1].includes(menuActiveIndex)">确认需求</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>

      </van-tabs>
    </div>
    <!-- 查看pdf -->
    <van-dialog v-model="showPdf" title="查看pdf" show-cancel-button>
      <img :src="imgPdf" />
    </van-dialog>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import {demandManagementList} from '@/api/demand/demandManagement'
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
          id: 0,
          title: '全部'
        },
        {
          id: 1,
          title: '未确认',
        },
        {
          id: 2,
          title: '已确认'
        },
        {
          id: 3,
          title: '供货中',
        },
        {
          id: 4,
          title: '已完成',
        }
      ],
      listGhsData:[
       {
         status:4,
         planName:'2025年6甲供物资需求-08',
         planNumber: "XQ2025060199",
         sectionName: "沪宁合高铁站前2标",
         fileList:[
          {
            fileList:[
              {
                fileName: "需求计划表.pdf",
                filePath: "sa/saleOrder/202506/9c83f0c415a24228a955afd5ba17322d.pdf"
              }
            ]
          }
         ],
         createUserName: "施工单位工程部_提报需求计划",
         submitTime: 1750309850000
       }
      ],
      imgPdf:""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //初始化请求
    getList(){
       this.allLoading = true;
      demandManagementList(this.params.pageNum,this.params.pageSize).then((res) => {
          if (res.code == 0) {
            this.allLoading = false
            this.params.pageNum++;
            if(this.listGhsData.length<1){
              this.listGhsData = res.data.list
            }else{
              this.listGhsData = this.listGhsData.concat(res.data.list)
            }
            this.pageTotal = res.data.total
          }
        })
    },
    tabsChange(e) {
      this.params.pageNum = 1;
      this.getList()
    },
    dialogPopup(path){
      this.imgPdf = path
      this.showPdf = true
    },
    //发货
    handleSendGoodsClick() {
      this.$router.push({ path: '/sendGoods' })
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
    onLoad() {
     this.params.pageNum++;
      // this.loading = true
      this.getList()
    },
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