<template>
  <div class="default-containers" ref="container"
       :style="{ 'padding-bottom': (params.status == 1 || btnEvent==true) ? '1.3rem' : '0' }"
  >
    <div class="detail-base-info">
      <div class="detail-title-content" style="padding-left: 0.5rem;color: #0571ff; ">
        <span>发货单号：</span>
      </div>
      <div class="detail-title-content" style="padding-left: 0.5rem;">
        <!--                <img src="/static/icon-xqjh.png">-->
        <span style="font-size: 16px;font-weight: bold;">{{ params.shipmentBatchNumber }}</span>
        <div class="detail-title-status">
          <img :src="checkAuditStatus(params.status)"/>
          <span>{{ checkStatusText(params.status) }}</span>
        </div>
      </div>
    <div class="detail-ul-text">
      <ul class="detail-ul">
        <li>
          <span class="detail-label">发货时间：</span>
          <span class="detail-value">{{ params.shippingDate | formatDate }}</span>
        </li>
        <li>
          <span class="detail-label">操作人：</span>
          <span class="detail-value">{{ params.createUserName }}</span>
        </li>
        <li>
          <span class="detail-label">操作时间：</span>
          <span class="detail-value">{{ formatTimestamp(params.createDate) }}</span>
        </li>
        <li>
          <span class="detail-label">标段项目：</span>
          <span class="detail-value">{{ params.sectionName }}</span>
        </li>

      </ul>

    </div>

    </div>

    <div class="tabs">
      <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
                title-inactive-color="#2e2e2e">
        <van-tab title="发货基本信息" name="发货基本信息">
          <van-list>

            <div class="box-container">
              <div class="detail-title-contentA">
                <img src="/static/icon-file.png">
                <span>发货单</span>
              </div>
              <file-download-view class="outbound-field-uploader" style="width: 100%;"
                                  :fileList="filterList(params.fileByList, 'fhd') || []"/>
            </div>
            <div class="box-container">
              <div class="detail-title-contentA">
                <img src="/static/icon-file.png">
                <span>装车照片</span>
              </div>
              <file-download-view class="outbound-field-uploader" style="width: 100%;"
                                  :fileList="filterList(params.fileByList, 'zczp') || []"/>
            </div>
            <div class="box-container">
              <!--              <div class="detail-content">-->
              <!--          -->
              <!--                <span>物流信息</span>-->
              <!--              </div>-->
              <!--              <div class="detail-content">-->
              <!--&lt;!&ndash;                <img src="/static/icon-xqjh.png">&ndash;&gt;-->
              <!--                <span class="font-weight">供应需求名称：</span>-->
              <!--                <span class="font-weight">{{ params.planName }}</span>-->
              <!--              </div>-->


              <div class="detail-title-contentA">
                <img src="/static/car.png">
                <span>物流信息</span>
              </div>
              <ul class="detail-list-ul">
                <div class="file-download-title">
                  <span class="title">发货地址:</span>
                </div>
                <li class="li-item-remark">

                  <!--                  <span  class="detail-ul">{{ params.shippingAddress }}</span>-->
                  <div class="remark-detail">{{ params.shippingAddress }}</div>
                </li>

                <li>
                  <span>物流单号:</span>
                  <span>{{ !params.oddNumbers?'其它': params.oddNumbers}}</span>
                </li>

                <li>
                  <span>发货时间:</span>
                  <span v-if="params.shippingDate">{{
                      params.shippingDate | formatDate
                    }}</span>
                </li>
                <li>
                  <span style="min-width: 3rem;">预计到达时间:</span>
                  <span v-if="params.arrivalDate">{{
                      params.arrivalDate | formatDate
                    }}</span>
                </li>

                <li>
                  <span>车牌号:</span>
                  <span>{{ params.carNumber }}</span>
                </li>

                <li>
                  <span>联系人:</span>
                  <span>{{ params.contacts }}</span>
                </li>
                <li>
                  <span>联系电话:</span>
                  <span>{{ params.contactsPhone }}</span>
                </li>


                <!--                <li>-->
                <!--                  <span>建设项目：</span>-->
                <!--                  <span>{{ params.projectName }}</span>-->
                <!--                </li>-->
                <!--                <li>-->
                <!--                  <span>标段项目：</span>-->
                <!--                  <span class="text">{{ params.sectionName }}</span>-->
                <!--                </li>-->
                <!--                <li>-->
                <!--                  <span>发货单号:</span>-->
                <!--                  <span>{{ params.shipmentBatchNumber }}</span>-->
                <!--                </li>-->


              </ul>


              <!--              <div class="detail-title-content">-->
              <!--                <img :src="checkAuditStatus(params.status)"/>-->


              <!--              </div>-->
              <van-button  @click.stop="openInfo"   type="default" block round>查看物流详情</van-button>
              <!--              icon="plus"-->
            </div>
            <div class="box-container">
              <div class="detail-title-contentA">
                <img src="/static/icon-address.png">
                <span>货运位置</span>
              </div>
              <div class="locationsteps">
                <ul class="detail-list-ul" v-for="(item, index) in cargoList" :key="index">
                  <div class="file-download-title">
                    <span class="title">{{item.createDate | formatToDate}}</span>
                  </div>
                  <li class="li-item-remark">
                    <div class="remark-detail">{{ item.positionInformation }}</div>
                  </li>
                </ul>

                <!-- <van-steps direction="vertical" active-color="#0086ff" :active="0">
                  <van-step v-for="(item, index) in cargoList" :key="index">
                    <h3>{{ item.positionInformation }}</h3>
                    <p>{{ item.createDate | formatToDate }}</p>
                  </van-step>
                </van-steps> -->
              </div>
              <van-button @click.stop="createPosition(params.shipmentBatchNumber )" icon="plus"  type="info" plain block round>添加货运位置</van-button>
            </div>


          </van-list>

        </van-tab>
        <van-tab title="发货物资明细" name="发货物资明细">
          <div
              v-if="params.materialCirculationDetailsTableDTOS && params.materialCirculationDetailsTableDTOS.length > 0">
               <material-details :list="params.materialCirculationDetailsTableDTOS" :planStatus="params.planStatus"></material-details>
          </div>
          <div v-else>
            <van-empty description="暂无数据"/>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="default-button-container" v-if="params.status == 1">
      <van-button size="mini" type="info" round class="button-info"
                  @click="handleSendGoodsClick(params.id)" v-if="params.status == 1">确认发货
      </van-button>
    </div>
    <div class="default-button-container" v-if="btnEvent==true">
      <van-button size="mini" type="info" round class="button-info"
                  @click="handleDoAccept">初验收货
      </van-button>
    </div>
    <file-preview ref="filePreview"></file-preview>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import BackToTop from '@/components/BackToTop'
import {addList, detailBySend, snedGoodsSure} from '@/api/demand/sendGoods'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import MaterialDetails from './components/MaterialDetails.vue'
import indexMixin from '@/view/mixins'
import Vue from 'vue';
import {Dialog, Toast} from 'vant';

Vue.use(Dialog);
Vue.use(Toast);
export default {
  name: 'cargoDetails',
  mixins: [keepPages, indexMixin],
  components: {FilePreview, FileDownloadView, BackToTop,MaterialDetails},
    filters: {
    formatDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      }else{
        return ""
      }
    },
     formatToDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }else{
        return ""
      }
    }

  },
  data() {
    return {
      cargoList: "",
      menuActiveIndex: 0,

      formData: {
        keywords: '',
      },
      tabList: [
        {
          id: 1,
          title: '需求信息'
        },
        {
          id: 2,
          title: '发货物明细',
        },
      ],
      id: '',
      params: {},
      allLoading: false,
      allFinished: false,
      allRefreshLoading: false,
      allRefresh: false,
      btnEvent: false,
      statusArr: [
        {text: '全部', value: ''},
        {text: '未发货', value: '1'},
        {text: '货运中', value: '2'},
        {text: '已完成', value: '3'}
      ],
    };
  },
  created() {
    this.id = this.$route.query.id
    this.btnEvent = this.$route.query.btnEvent
    this.cargoDetails();
    // this.getOrderStatusOptions();
  },
  activated() {
    this.id = this.$route.query.id
    this.btnEvent = this.$route.query.btnEvent
    this.cargoDetails();
  },
  methods: {
    openInfo(){
      this.$router.push({ path: '/cargoInfo', query: { id:this.params.shipmentBatchNumber } })



    },
    createPosition(number){

      this.$router.push({ path: '/cargoPosition', query: { shipmentBatchNumber:number,page:'/cargoDetails' } })
      // this.formKey++
      // this.shipmentBatchNumber = number
      // let params = {
      //   shipmentBatchNumber: number
      // }
      // addList(params).then((res) => {
      //   if (res.code == 0) {
      //     this.cargoList = res.data.list
      //     // this.freightLocationDiaLog = true
      //
      //   }
      // })
    },
    cargoDetails() {
      detailBySend(this.id).then((res) => {
        if (res.code == 0) {
          this.params = res.data

          this.params.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item) => ({
            ...item,
            // fileByList: JSON.parse(item.fileByList)
          }))

          let params = {
            shipmentBatchNumber: this.params.shipmentBatchNumber,
          }
          addList(params).then((res) => {
            if (res.code == 0) {
              this.cargoList = res.data.list
              this.freightLocationDiaLog = true
            }
          })
        }
      })
    },
    tabsChange() {

    },
    imgClick(fileName, filePath) {
      this.$refs.filePreview.init(fileName, filePath)
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
    //确定已经发货
    handleSendGoodsClick(id) {
      Dialog.confirm({
        title: '',
        message: '确定已经发货？',
        confirmButtonColor: '#1989fa'
      })
          .then(() => {
            let params = {
              id: id,
              status: 2
            }
            snedGoodsSure(params).then((res) => {
              if (res.code == 0) {
                Toast.success(res.data);
                this.$router.push({path: '/Information'})
                //   window.history.back()
                //   this.params.pageNum = 1
                //   this.allRefreshLoading = true
                //   this.getList()
              }
            })
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      // this.$router.push({path:'/sendGoods'})
    },
    handleDoAccept() {
      this.$router.push({name: 'DoAccept', query: {id: this.id, tabs: true, takeStatus: item.takeStatus}})
    },
    checkAuditStatus(status) {
      // if (status == '0') {
      //     return '/static/icon-reject.png'
      // } else if (['5', '10'].includes(status)) {
      //     return '/static/icon-return.png'
      // } else {
      //     return '/static/icon-success.png'
      // }


      if ('2' == status) {
        return '/static/icon-send-midway.png'
      } else if ('3' == status) {
        return '/static/icon-send-success.png'
      } else {
        return '/static/icon-send-wait.png'
      }
    },
    checkStatusText(status) {
      let name = ''
      this.statusArr.forEach(item => {
        if (item.value === status) {
          name = item.text
        }
      })
      return name
    },
  },
};
</script>
<style lang="less" scoped>
.file-download-title {
    height: 40px;
    display: flex;
    align-items: center;
    position: relative;

    .title {
        font-size: 13px;
        color: #1c1c1c;
        font-weight: 600;
    }
    .title::after {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 25%;
        background: #028bff;
        position: absolute;
        left: -10px;
        top: 18px;
    }
}

.detail-title-content {
  position: relative;

  .detail-title-status {
    position: absolute;
    right: 10px;
    top: 0;
    display: flex;
    align-items: center;
    height: 0.55rem;

    img {
      width: 16px;
      height: 16px;
    }

    span {

      color: #134daa;
      font-size: 11px;
    }
  }

}

.detail-content {
  padding: 0 5px;
  margin: 5px 0;
  display: flex; // 使用 flex 布局确保同行显示
  align-items: center; // 垂直居中对齐
  gap: 8px; // 元素间间距

  img {
    width: 26px;
    height: 26px;
    flex-shrink: 0; // 防止图片被压缩
  }

  span {
    line-height: 26px;
    font-size: 13px;
    color: #333; // 深色值文字
    font-weight: bold;
    // 如果第一个 span 是标签，可以单独设置样式
    //&:first-child {
    //  color: #666; // 灰色标签文字
    //  font-weight: normal;
    //}

    // 第二个 span 是值
    //&:nth-child(2) {
    //
    //}
  }
}


.box-container {
  background: #fff; // 为每个容器设置白色背景
  margin-bottom: 10px; // 容器之间添加间距
  border-radius: 8px; // 添加圆角
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); // 添加轻微阴影增强分隔感
  overflow: hidden; // 确保圆角显示正常

  // 为连续的容器之间添加额外间距
  & + .box-container {
    margin-top: 10px;
  }
}

.detail-list-ul {
  // padding: 0.125rem 0.2rem 0.125rem 0.425rem;
  margin: 0 !important;
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

.list-ul {
  background: #fff;
  // margin: 0 10px;
  border-radius: 15px;
  padding: 10px;
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

// 调整列表容器的样式
.detail-ul-text {
  margin: 0; // 移除外部边距
  background: transparent; // 移除ul包装器的灰色背景
  padding-bottom: 5px;
}

// 调整列表样式
.detail-ul {
  background: #f8f8f8; // 使用稍浅的灰色背景
  margin: 10px; // 添加内边距
  border-radius: 4px; // 添加圆角
}

.detail-title-content {
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;

  img {
    width: 26px;
    height: 26px;
  }

  span {
    line-height: 26px;
    margin-left: 0;
    font-size: 13px;
  }
}

.detail-ul {
  padding-left: 16px;
  padding-right: 30px;
  border-top: 0.5px solid #e3e3e3;

  .detail-ul-p {
    display: flex;
    align-items: center;

    & :nth-child(1) {
      margin-right: 3px;
    }

    & :nth-child(2) {
      margin-right: 3px;
    }
  }
}

</style>
