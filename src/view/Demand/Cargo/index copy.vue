<template>
  <div class="default-containers" ref="container">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>需求名称：</span>
        <span>{{ params.planName }}</span>
      </div>
      <div class="detail-wrapper">
        <ul class="detail-ul">
          <li>
            <span>建设项目：</span>
            <span>{{ params.projectName }}</span>
          </li>
          <li>
            <span>标段项目：</span>
            <span>{{ params.sectionName }}</span>
          </li>
          <li>
            <span>需求编号：</span>
            <span>{{ params.planNumber }}</span>
          </li>
          <li>
            <span>填报组织：</span>
            <span>{{ params.deptName }}</span>
          </li>
          <li>
            <span>填报人：</span>
            <span>{{ params.createUserName }}</span>
          </li>
          <li>
            <span>填报时间：</span>
            <span v-if="params.createDate">{{ formattedCreateDate(params.createDate) }}</span>
          </li>
          <!-- <li class="li-status">
  <template v-for="row in statusArr">
    <van-tag :class="{ 'li-status-completed': row.value == '9' }"
      :type="['0', '5'].includes(row.value) ? 'danger' : 'primary'" round size="medium" :key="row.value"
      v-if="detail.planStatus == row.value">{{ row.text }}</van-tag>
  </template>
</li> -->
        </ul>
      </div>
    </div>
    <div class="tabs">
      <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
                title-inactive-color="#2e2e2e">
        <van-tab title="物流信息" name="物流信息">
          <van-list>
            <div class="box-container">
              <div class="detail-list-title-content">
                <span class="font-weight" style="min-width: 1.6rem;">发货单号：</span>
                <span class="font-weight">{{ logistics.shipmentBatchNumber }}</span>
              </div>
              <ul class="detail-list-ul">

                <!-- <li style="display: flex;justify-content:flex-start;">
                    <span class="font-weight dot-before">发货单号：</span>
                    <span class="font-weight">{{ logistics.shipmentBatchNumber }}</span>
                </li> -->
                <li>
                  <span>物流单号：</span>
                  <span class="text">{{ logistics.oddNumbers }}</span>
                </li>
                <li>
                  <span>发货时间：</span>
                  <span v-if="logistics.shippingDate">{{
                      formattedCreateDate(logistics.shippingDate)
                    }}</span>
                </li>
                <li>
                  <span>发货地址：</span>
                  <span>{{ logistics.shippingAddress }}</span>
                </li>
                <li>
                  <span>预计到达时间：</span>
                  <span v-if="logistics.arrivalDate">{{
                      formattedCreateDate(logistics.arrivalDate)
                    }}</span>
                </li>
                <li>
                  <span>车牌号：</span>
                  <span>{{ logistics.carNumber }}</span>
                </li>
                <li>
                  <span>联系人：</span>
                  <span>{{ logistics.contacts }}</span>
                </li>
                <li>
                  <span>联系电话：</span>
                  <span>{{ logistics.contactsPhone }}</span>
                </li>
              </ul>
              <div v-if="!logistics.oddNumbers">

                <div class="tab-div">
                  <van-row class="th-row" align="center">
                    <van-col span="10">操作人</van-col>
                    <van-col span="8">货运位置</van-col>
                    <van-col span="6">填写时间</van-col>
                  </van-row>
                  <van-row v-for="item in logistics.materialTrackMessageDTOS"
                           :key="item.id">
                    <van-col span="10">{{ item.createUserName }}</van-col>
                    <van-col span="8">{{ item.positionInformation }}</van-col>
                    <van-col span="6">{{ formattedCreateDate(item.createDate) }}</van-col>
                  </van-row>
                  <!-- <van-row class="th-row">
                      <van-col>操作人</van-col>
                      <van-col>货运位置</van-col>
                      <van-col>填写时间</van-col>
                  </van-row>
                  <van-row class="th-rows" v-for="item in logistics.materialTrackMessageDTOS"
                      :key="item.id">
                      <van-col>{{ item.createUserName }}</van-col>
                      <van-col>{{ item.positionInformation }}</van-col>
                      <van-col>{{ formattedCreateDate(item.createDate) }}</van-col>
                  </van-row> -->
                </div>
              </div>
              <div v-else>
                <div class="Logistics-Information-dt">
                  <wuliu :courierNumber="logistics.oddNumbers" @expressDataFun="expressDataFun"/>
                </div>
                <van-steps direction="vertical" active-color="#0086ff" :active="0">
                  <van-step v-for="(item, index) in cargoList" :key="index">
                    <div>
                      <p>{{ item.positionInformation }}</p>
                      <p class="Logistics-Information-text">{{ item.createUserName }}</p>
                    </div>
                    <div class="Logistics-Information-text">{{
                        formattedCreateDate(item.createDate)
                      }}
                    </div>
                  </van-step>
                </van-steps>
              </div>
            </div>
          </van-list>
        </van-tab>
        <van-tab title="发货物资明细" name="发货物资明细">
          <div
              v-if="logistics.materialCirculationDetailsTableDTOS && logistics.materialCirculationDetailsTableDTOS.length > 0">
            <van-list>
              <div class="box-container" v-for="(item, index) in logistics.materialCirculationDetailsTableDTOS"
                   :key="index">
                <div class="detail-list-title-content">
<!--                  <span class="font-weight" style="min-width: 1.6rem;">物资名称：</span>-->
                  <span class="font-weight" style="min-width: 1.6rem;">{{index+1}}.</span>
                  <span class="font-weight">{{ item.materialName }}</span>
                </div>
                <ul class="detail-list-ul"
                >

                  <li>
                    <span>规格型号:</span>
                    <span>{{ item.specModel }}</span>
                  </li>
                  <li>
                    <span>计量单位:</span>
                    <span>{{ item.unit }}</span>
                  </li>
                  <li>
                    <span>发货数量:</span>
                    <span class="li-span-click">{{ item.sendTotal }}</span>
                  </li>
                  <li>
                    <span style="min-width: 3rem;">本次计划数量:</span>
                    <span class="li-span-click">{{ item.planAmount }}</span>
                  </li>
                  <li>
                    <span>包装形式:</span>
                    <span>{{ item.packagingFm }}</span>
                  </li>
                  <li>
                    <span>生产日期:</span>
                    <span v-if="item.createDate">{{
                        formattedCreateDate(item.manufactureDate)
                      }}</span>
                  </li>
                  <li>
                    <span style="min-width: 3rem;">有效期截止日期:</span>
                    <span>{{ formattedCreateDate(item.expirationDate) }}</span>
                  </li>
                  <li>
                    <span>收货地址:</span>
                    <span>{{ item.field2 }}</span>
                  </li>
                  <li>
                    <span>使用地点:</span>
                    <span>{{ item.addr }}</span>
                  </li>
                  <li>
                    <span>供应时间:</span>
                    <span v-if="item.supplyDate">{{ formattedCreateDate(item.supplyDate) }}</span>
                  </li>
                  <li>
                    <span style="min-width: 3rem;">收货人及联系方式:</span>
                    <span>{{ item.receiver }}</span>
                  </li>
                  <li>
                    <span>投资方:</span>
                    <span>{{ item.field0 }}</span>
                  </li>
                  <li>
                    <span>投资比例:</span>
                    <span>{{ item.field1 }}</span>
                  </li>
                  <li class="li-item-remark">
                    <span>备注：</span>
                    <div class="remark-detail">{{ item.remark || '未填写' }}</div>
                  </li>

                </ul>
                <div class="detail-title-contentA">
                  <img src="/static/icon-file.png">
                  <span>合格证附件</span>
                </div>
                <file-download-view class="outbound-field-uploader" style="width: 100% !important;"
                                    :fileList="filterList(item.fileByList, 'hgz') || []"/>
                <div class="detail-title-contentA">
                  <img src="/static/icon-file.png">
                  <span>厂检报告附件</span>
                </div>

                <file-download-view class="outbound-field-uploader" style="width: 100% !important;"
                                    :fileList="filterList(item.fileByList, 'cjbg') || []"/>
              </div>
            </van-list>
          </div>
          <div v-else>
            <van-empty image="/empty-image-default.png" description="暂无数据"/>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <file-preview ref="filePreview"></file-preview>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import Vue from 'vue';

import {Sidebar, SidebarItem} from 'vant';
import BackToTop from '@/components/BackToTop'
import {Tab, Tabs} from 'vant';
import {Step, Steps} from 'vant';
import {lookGoodsDetails, shippingOrderNumber} from '@/api/demand/returnGoods'
import {listPcNumber} from '@/api/demand/demandManagement'
import {addList} from '@/api/demand/sendGoods'
import wuliu from '@/components/wuliu'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import indexMixin from '@/view/mixins'

Vue.use(Step);
Vue.use(Steps);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Sidebar);
Vue.use(SidebarItem);
export default {
  name: 'MyProcess',
  mixins: [indexMixin],
  components: {wuliu, FilePreview, FileDownloadView, BackToTop},
  data() {
    return {
      menuActiveIndex: 0,
      active: 2,
      activeKey: 0,
      username: '',
      password: '',
      value: '',
      showCalendar: false,
      showAction: false,
      loading: false,
      finished: false,
      result: [],
      list: [],
      params: {},
      logistics: {},
      cargoList: [],
      expressData: {},
      listPageQuery: {
        pageName: 1,
        pageSize: 10

      },
      shipmentBatchNumber: ""
      // logisticsNumber:""
    };
  },
  created() {
    this.wuLiuId = this.$route.query.id
    this.shipmentBatchNumber = this.$route.query.number
    //  this.logisticsNumber = this.$route.query.logisticsNumber //物流单号
    this.getDetails();
  },
  methods: {
    getDetails() {
      //需求信息
      lookGoodsDetails(this.wuLiuId).then((res) => {
        if (res.code == 0) {
          this.params = res.data
        }
      })
      // 获取发货单号
      listPcNumber(this.shipmentBatchNumber).then((res) => {
        if (res.code == 0) {
          // console.log(res.data[0].shipmentBatchNumber)
          // this.shipmentBatchNumber = JSON.stringify(res.data[0].shipmentBatchNumber)
          this.getOrderNumber(this.shipmentBatchNumber)
        }
      })
      let params = {
        pageName: this.listPageQuery.pageName,
        pageSize: this.listPageQuery.pageSize,
        shipmentBatchNumber: this.shipmentBatchNumber
      }
      //有单号就显示位置列表
      addList(params).then((res) => {
        if (res.code == 0) {
          this.cargoList = res.data.list
        }
      })


      //  detailBySend(this.wuLiuId).then((res) => {
      //     if (res.code == 0) {
      //         this.params = res.data
      //         this.params.fileByList = JSON.parse(res.data.fileByList)
      //         this.params.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item)=>({
      //             ...item,
      //             fileByList:JSON.parse(item.fileByList)
      //         }))
      //     }
      // })
    },
    onSubmit(values) {

    },
    getOrderNumber(parNumber) {
      //物流信息
      shippingOrderNumber(parNumber).then((res) => {
        if (res.code == 0) {
          this.logistics = res.data
          this.logistics.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item) => ({
            ...item,
            // fileByList: JSON.parse(item.fileByList)
          }))
        }
      })
    },
    onConfirm(date) {
      this.value = `${date.getMonth() + 1}/${date.getDate()}`;
      this.showCalendar = false;
    },
    chooseGoods() {
      this.$router.push({path: '/selectGoods'})
    },
    lookGoods() {

    },
    tabsChange() {

    },
    formatTimestamp(timestamp) {
      if (!timestamp) return ''; // 处理空值
      const date = new Date(timestamp); // 时间戳可以是毫秒或秒（需 * 1000）

      // 补零函数（确保个位数显示为两位，如 1 → '01'）
      const padZero = (num) => (num < 10 ? `0${num}` : num);

      const year = date.getFullYear();
      const month = padZero(date.getMonth() + 1); // 月份从 0 开始
      const day = padZero(date.getDate());
      const hours = padZero(date.getHours());
      const minutes = padZero(date.getMinutes());
      const seconds = padZero(date.getSeconds());

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 500);
    },
    formattedCreateDate(timestamp) {
      if (!timestamp) return ''; // 处理空值
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0
      return `${year}-${month}-${day}`;
    },
    expressDataFun(expressData) {
      //  console.log(expressData)
      this.expressData = expressData
    },
    imgClick(fileName, filePath) {
      this.$refs.filePreview.init(fileName, filePath)
    },
  },
};
</script>
<style lang="less" scoped>
.box-container {
  padding: 0px !important;
}

.detail-list-ul {
  margin: 0 !important;
}

.Logistics-Information-dt {
  width: 100%;

  img {
    width: 100%;
  }
}

.default-container {
  padding-top: 10px;
}

li :nth-child(1) {
  min-width: 60px
}

li :nth-child(2) {
  width: initial;
}

.li-item-both {
  .li-item-right {
    flex: initial;
  }
}

.list-ul {
  background: #fff;
  // margin: 0 10px;
  border-radius: 15px;
  padding: 10px;
}

.title {
  margin: 10px;
  font-size: 14px;
}

.sidebar {
  display: flex;
  justify-content: space-between;

  .sidebar-left {
    width: 20%;
    padding: 5px;
    background-color: #fff;
    // height: 0 auto;
    border-radius: 2px solid #f5f5f5;
  }

  .content {
    flex: 1;
    background-color: #fff;
    border-radius: 6px;
    margin-left: 10px;
  }
}

/deep/ .van-sidebar-item__text {
  width: 200px !important;
}

.tab-div {
  border: 1px solid #e9e9e9;
  border-bottom: 0;
  border-right: 0;

  .th-row {
    background-color: azure;
  }
}

.dot-before::before {
  content: "•";
  /* 圆点符号 */
  color: #1890ff;
  /* 蓝色（可自定义） */
  margin-right: 5px;
  /* 与文字的间距 */
  font-size: 1.2em;
  /* 可选：调整圆点大小 */
}

.Logistics-Information-dt {
  width: 100%;
  height: 300px;
  padding: 10px;
  box-sizing: border-box;
}

/deep/ .van-col {
  font-size: 0.3rem;
  padding: 0.2rem !important;
  text-align: center !important;
  border: 2px solid #fcfcfc;
}


// ul 样式
/* 外层容器 - 控制四周留白 */
.detail-wrapper {
  padding: 4px; /* 四周留白 */
}

/* 列表主体样式 */
.detail-ul {
  list-style: none;
  padding: 12px 16px;
  margin: 0;
  background-color: #f5f5f5; /* 灰色背景 */
  border-radius: 4px; /* 圆角 */
}

/* 列表项样式 */
.detail-ul li {
  display: flex;
  margin-bottom: 8px;
}

.detail-ul li:last-child {
  margin-bottom: 0; /* 最后一项去掉下边距 */
}

/* 文字样式 */
.detail-label {
  color: #666;
  min-width: 80px; /* 固定标签宽度保持对齐 */
}

.detail-value {
  color: #333;
  font-weight: 500;
}


.detail-title-contentA {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  padding-left: 2px;
  padding-right: 27px;
  box-sizing: border-box;
  border-top: 1px solid #f1f4f8;

  img {
    width: 25px;
    height: 25px;
  }

  & span:nth-child(2) {
    margin-left: 6px;
    color: #151b3e;
    font-size: 15px;
    font-weight: 600;
  }

  & span:nth-child(3) {
    color: #151b3e;
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
