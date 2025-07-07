<template>
  <div ref="container">
    <div class="list-search-container">
     <van-search v-model="params.planName" placeholder="输入关键字搜索" shape="round" background="#eef6ff"
        >
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
        <van-tab v-for="item in tabList" :title="item.title" :key="item.id" :name="item.status">
          <div v-if="total != 0">
            <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
              <van-list v-model="loading" :finished="allFinished" finished-text="没有更多了..." @load="onLoad">
                <div v-for="(item, index) in listGhsData" :key="index" class="box-container" @click="handleSupplyClick(item.id)">
                  <ul class="list-ul">
                    <li>
                      <span class="font-weight">需求编号:</span>
                      <span class="font-weight">{{ item.planNumber }}</span>
                    </li>
                    <li>
                      <span>需求名称：</span>
                      <span class="text">{{ item.planName }}</span>
                    </li>
                    <li>
                      <span>需求项目：</span>
                      <span>{{ item.sectionName }}</span>
                    </li>
                    <li>
                      <span>提报人：</span>
                      <span>{{ item.createUserName }}</span>
                    </li>
                    <li>
                      <span>提报时间：</span>
                      <span v-if="item.createDate">{{ formattedCreateDate(item.createDate) }}</span>
                    </li>
                    <li>
                      <span style="width: 200px;">需求计划表:</span>
                      <span style="color:#0689ff;">
                        <template>
                          <div v-for="(item1, index1) in item.fileList" :key="index1">
                            <div v-for="(item2, index2) in item1.fileList" :key="index2">
                              <a href="javascript:;" @click.stop="imgClick(item2)" style="color:#0689ff;">{{ item2.fileName
                                }}</a>
                            </div>
                          </div>
                        </template>
                      </span>
                    </li>
                    <li class="li-status">
                      <van-tag type="primary" round size="medium" v-if="item.status == 2">未确认</van-tag>
                      <van-tag type="primary" round size="medium" v-if="item.status == 3">已确认</van-tag>
                      <van-tag type="primary" round size="success" v-if="item.status == 4">供应中</van-tag>
                      <van-tag type="primary" round size="medium" v-if="item.status == 6"
                        class="li-status-completed">已完成</van-tag>
                    </li>
                  </ul>
                  <div class="list-ul-button">
                    <van-button class="button-info" plain round type="info" @click.stop="handleSupplyClick(item.id)"
                      v-if="item.status == 4 || item.status === 6">供应详情</van-button>
                    <van-button class="button-info" plain round type="info" @click.stop="handleLookClick(item)"
                      v-if="item.status == 4 || item.status === 6">物流查看</van-button>
                    <van-button class="button-info" round type="info" @click.stop="handleSendGoodsClick(item.id, 'add')"
                      v-if="item.status == 4 || item.status == 3">发货</van-button>
                    <van-button class="button-info" round type="info" v-if="item.status == 2"
                      @click.stop="handleConfirmClick(item.id)">确认需求</van-button>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
          <div v-if="total == 0">
            <van-empty description="暂无数据" />
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <file-preview ref="filePreview"></file-preview>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import { demandManagementList, demandManagementLookPdf } from '@/api/demand/demandManagement'
import FilePreview from "@/components/FilePreview.vue";
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'dashboard',
  mixins: [keepPages],
  components: { FilePreview },
  data() {
    return {
      menuActiveIndex: 0,
      showPdf: false,
      formData: {
        keywords: '',
      },
      //全部
      allOrderList: [],
      loading: false,
      allRefreshLoading: false,
      allLoading: false,
      allFinished: false,
      params: {
        planName: '',
        pageNum: 1,
        pageSize: 10
      },
      tabList: [
        {
          id: 1,
          status: '',
          title: '全部'
        },
        {
          id: 2,
          status: '2',
          title: '未确认',
        },
        {
          id: 3,
          status: '3',
          title: '已确认'
        },
        {
          id: 4,
          status: '4',
          title: '供货中',
        },
        {
          id: 6,
          status: '6',
          title: '已完成',
        }
      ],
      listGhsData: [],
      filePath: "",
      fileName: '',
      total: 0
    };
  },
  created() {

  },
  mounted() {
    this.getList();
  },
  methods: {
    //初始化请求
    getList() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      demandManagementList(this.params).then((res) => {
        if (res.code == 0) {
          Toast.clear()
          this.total = res.data.total
          if (this.allRefreshLoading) {
            this.listGhsData = [];
            this.allRefreshLoading = false;
          }
          if (this.params.pageNum === 1) {
            this.listGhsData = res.data.list
          } else {
            this.listGhsData = this.listGhsData.concat(res.data.list)
          }
          if (this.listGhsData.length >= res.data.total) {
            this.allFinished = true
          }
          this.loading = false
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
    tabsChange(e) {
      this.listGhsData = []
      this.params.pageNum = 1;
      this.params.status = e
      this.allFinished = false;
      this.allRefreshLoading = true
      this.getList()
    },
    //搜索
    onSearch() {
      this.params.pageNum = 1;
      this.getList()
    },
    //发货
    handleSendGoodsClick(id, title) {
      this.$router.push({ path: '/sendGoods', query: { id: id, title: title } })
    },
    //查看物流
    handleLookClick(item) {
      this.$router.push({ name: 'LogisticsView', query: { id: item.id } })
    },
    //供应详情
    handleSupplyClick(id) {
      this.$router.push({ path: '/supplyMsg', query: { id: id } })
    },
    //确认需求
    handleConfirmClick(id) {
      this.$router.push({ path: '/confirm', query: { id: id } })
    },
    //全部列表刷新
    allRefresh() {
      this.params.pageNum = 1
      this.allFinished = false;
      this.allRefreshLoading = true
      this.getList()

    },
    // 上拉加载处理函数
    onLoad() {
      this.params.pageNum++;
      this.getList()
    },
    imgClick({ fileName, filePath }) {
      this.$refs.filePreview.init(fileName, filePath)
    }
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