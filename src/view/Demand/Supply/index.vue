<template>
    <div ref="container" class="requirement-details" :style="{ paddingBottom: result.status === 6 ? '0' : '1.3rem' }" >
         <div class="detail-base-info">
            <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ result.planName }}</p>
        <div class="list-title-content">
            <p style="color: #656980; font-size: 14px;">
                <span>需求编号：</span>
                <span class="font-weight" style="color:#3D83E2;">{{ result.planNumber }}</span>
            </p>
            <div class="li-title-status">
                <img :src="checkAuditStatus(result.status)" />
                <span style="color:#000; font-size: 14px;">{{ checkStatusText(result.status) }}</span>
            </div>
        </div>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>建设项目：</span>
            <span>{{ result.projectName }}</span>
          </li> 
          <li>
            <span>标段项目：</span>
            <span>{{ result.sectionName }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ result.deptName }}</span>
          </li>
          <li>
            <span>提报人：</span>
            <span>{{ result.createUserName }}</span>
          </li>
        </ul>
      </div>
      <div class="detail-ul-bottom-text">
        <ul class="detail-ul">
          <li>
            <span>物资项目：<span class="li-span-click">{{ result.demandPlanDetailsGyDTOList?.length }}</span> 项</span>
          </li>
        </ul>
      </div>
        </div>
        <div class="detail-base-info detail-base-info-edited" v-if="result.fileList?.[0]?.fileList.length">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>附件</span>
      </div>
      <file-download-view :fileList="result.fileList?.[0]?.fileList || []"></file-download-view>
    </div>
    <div class="detail-base-info detail-base-info-edited" v-if="dataPc.length">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-logistics.png" />
        <span>物流信息</span>
      </div>
      <ul class="detail-list-ul" v-for="(item, index) in dataPc" :key="index" @click="logisticsClick(item)">
        <li>
          <span>发货批次{{ index + 1 }}</span>
          <span><img class="detail-ul-bottom-text-Arrow" src="@/assets/img/Arrow-R.png" /></span>
        </li>
      </ul>
    </div>
        <van-sticky class="select-materials-sticky">
      <div class="select-materials-search">
        <van-search v-model="searchValue" placeholder="输入关键字搜索" left-icon="none" background="center"
          :show-action="showAction">
          <template slot='right-icon'>
            <van-icon name="search" />
          </template>
        </van-search>
        <div class="select-materials-search-switch" v-if="['6', '7', '8', '9'].includes(result.planStatus)">
          <van-switch v-model="searchChecked" /><span>显示供应概览</span>
        </div>
      </div>
    </van-sticky>
        <material-details :list="filteredList" :planStatus="result.planStatus" :searchChecked="searchChecked"></material-details>
        <div class="default-button-container" v-if="result.status == 2 || result.status == 4 || result.status == 3">
            <van-button size="mini" type="info" round  class="button-info" v-if="result.status == 2"
                @click="handleConfirmClick(result.id)">确认需求</van-button>
            <van-button size="mini" type="info" round  class="button-info" v-if="btnStatus && (result.status == 4 || result.status == 3)" @click="handleSendGoodsClick(result.id, 'add')">发货</van-button>
            <!-- 编辑里的选择发货物资传的是planId -->
        </div>
         <back-to-top className=".default-container"></back-to-top>
    </div>
</template>
<script>
import Vue from 'vue';
import BackToTop from '@/components/BackToTop'
import FileDownloadView from "@/components/FileDownloadView.vue"
import MaterialDetails from './components/MaterialDetails.vue'
import { listPc } from '@/api/prodmgr-inv/materialCirculationTableRest'
import { Form } from 'vant';
import { Field, Toast } from 'vant';
import { supplyDetails } from '@/api/demand/demandManagement'
Vue.use(Form);
Vue.use(Field);
Vue.use(Toast);
export default {
    name: 'MyProcess',
    components:{BackToTop,FileDownloadView,MaterialDetails},
    data() {
        return {
            dataPc: [],
            username: '',
            password: '',
            value: '',
            showCalendar: false,
            showAction: false,
            searchValue: '',
            searchChecked: true,
            loading: false,
            finished: false,
            result: {},
            btnStatus:false,
            list: [],
            allRefreshLoading: false,
            id: '',
            statusArr: [
        { text: '全部', value: '', imgPath: '' },
        { text: '已驳回', value: '0', imgPath: '/static/newIcon_Rejected.png' },
        { text: '未提交', value: '1', imgPath: '/static/newIcon_notfiled.png' },
        { text: '未确认', value: '2', imgPath: '/static/newIcon_unconfirmedT.png' },
        { text: '已确认', value: '3', imgPath: '/static/newIcon_confirmed.png' },
        { text: '供货中', value: '4', imgPath: '/static/newIcon_Supply.png' },
        { text: '已撤回', value: '5', imgPath: '/static/newIcon_Withdrawn.png' },
        { text: '已完成', value: '6', imgPath: '/static/newIcon_done.png' },
        { text: '收货完成', value: '7', imgPath: '/static/newIcon_received.png' },
        { text: '已入库', value: '8', imgPath: '/static/newIcon_Storage.png' },
        { text: '已完成', value: '9', imgPath: '/static/newIcon_done.png' },
        { text: '已退回', value: '10', imgPath: '/static/newIcon_Returned.png' },
      ],
        };
    },
    computed: {
    filteredList() {
      if (!this.searchValue) return this.result.demandPlanDetailsGyDTOList; // 如果搜索值为空，返回所有数据
      return this.result.demandPlanDetailsGyDTOList.filter(item => item.specModel.includes(this.searchValue) ||
        item.materialName.includes(this.searchValue) ||
        item.unit.includes(this.searchValue) ||
        item.receiver.includes(this.searchValue)
      ); // 过滤匹配的数据项
    },
    isJL() {
      const deptCode = this.userInfo.deptCode
      return !deptCode.startsWith('JL')
    }
  },
    created() {
        this.id = this.$route.query.id
        this.getList()
        this.getBatch(this.id)
    },
    methods: {
        async getBatch(id) {
      const res = await listPc(id)
      this.dataPc = res.data
    },
        getList() {
            let params = {
                id: this.id
            }
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            supplyDetails(params).then((res) => {
                if (res.code == 0) {
                    Toast.clear()
                    this.allRefreshLoading = false
                    this.finished = false
                    this.result = res.data
                    this.result.demandPlanDetailsGyDTOList.forEach(item=>{
                        if(item.ssendTotal>0){
                            this.btnStatus = true
                        }
                    })
                }
            })
        },
        onConfirm(date) {
            this.value = `${date.getMonth() + 1}/${date.getDate()}`;
            this.showCalendar = false;
        },
        logisticsClick(item) {
            this.$router.push({ name: 'LogisticsView', query: { id: this.result.id, shipmentBatchNumber: item.shipmentBatchNumber } })
        },
        chooseGoods() {
            this.$router.push({ path: '/selectGoods' })
        },
        lookGoods() {

        },
        //确认需求
        handleConfirmClick(id) {
            this.$router.push({ path: '/confirm', query: { id: id } })
        },
        //发货
        handleSendGoodsClick(id, title) {
            this.$store.dispatch('public/setSelectGoodData', []);
            
            this.$store.dispatch('public/setShipmentsInfo', {})
            
            this.$router.push({ path: '/selectGoods', query: { id: id, text: title } })
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
    checkAuditStatus(status) {
      // 获取状态对应图片路径
      let imgPath = this.statusArr.find(el => {
        return el.value === status
      })?.imgPath || "";

      return imgPath;
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
.requirement-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

  .list-title-content {
    display: flex;
    margin: 0 0 0 5px;
  }

  .li-title-status {
    margin-right: 15px;
  }

  .detail-title-text {
    padding: 0 12px;

    p {
      &:nth-child(1) {
        font-size: 11px;
        color: #1159cc;
        padding-bottom: 5px;
      }

      &:nth-child(2) {
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }

  .detail-ul-text {
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;

    .detail-ul {
      padding: 10px 8px;
    }
  }

  .detail-ul-bottom-text {
    padding-bottom: 10px;

    .detail-ul {
      padding: 0 22px;

      .detail-ul-bottom-text-span,
      img {
        vertical-align: middle;
      }

      .detail-ul-bottom-text-log {
        width: 13px;
        height: 14px;
      }
    }
  }

  .detail-base-info-edited {
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 0;
    display: flex;
    flex-direction: column;

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

    .detail-list-ul {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 8px;
      border-radius: 5px;
      padding-left: 17px;
      padding-right: 12px;
      background: #f0f2f6;
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

    .detail-base-info-edited-div {
      justify-content: space-between;

      .detail-base-info-edited-img {
        display: flex;
        align-items: center;
      }
    }
  }

  .detail-ul-bottom-text-Arrow {
    width: 14px !important;
    height: 14px !important;
  }

  .select-materials-sticky {
    ::v-deep .van-sticky {
      background: #f2f4f8;
    }
  }

  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      padding-left: 13px;

      .van-checkbox {
        height: 100%;
        margin-left: 2px;

        ::v-deep .van-checkbox__icon {
          font-size: 18px;

          .van-icon {
            border: 1px solid #1989fa;
          }
        }
      }
    }
  }

  .van-search {
    width: 222px;

    .van-search__content {
      border-radius: 50px;
      background: #fff;
    }

    .van-cell {
      border-radius: 50px;
      background: #fff;
    }
  }

  .select-materials-search-switch {
    display: flex;
    align-items: center;
    padding-right: 15px;

    span {
      margin-left: 5px;
      font-size: 12px;
    }

    .van-switch {
      width: 34px;
      height: 18px;
      font-size: inherit;

      ::v-deep .van-switch__node {
        width: 18px;
        height: 18px;
      }
    }
  }
  .default-button-container{
    .button-info{
      width: 169px;
      img{
        vertical-align: middle;
      }
    }
  }
}

// .detail-title-content{

//   position: relative;
//   .detail-title-status {
//     position: absolute;
//     right: 10px;
//     top: 0;
//     display: flex;
//     align-items: center;
//     height: 0.55rem;

//     img {
//       width: 16px;
//       height: 16px;
//     }

//     span {

//       color: #134daa;
//       font-size: 11px;
//     }
//   }

// }
// .box-container{
//     padding: 0px !important;
// }
// .detail-list-ul{
//     margin: 0 !important;
// }
// .default-container {
//     padding-top: 10px;
// }

// li :nth-child(1) {
//     min-width: 0.5rem;
// }

// li :nth-child(2) {
//     width: initial;
// }

// .li-item-both {
//     .li-item-right {
//         flex: initial;
//     }
// }

// .list-ul {
//     background: #fff;
//     // margin: 0 10px;
//     border-radius: 15px;
//     padding: 10px;

// }

// .title {
//     height: 0.85rem;
//     display: flex;
//     align-items: center;
//     margin: 10px;
//     font-size: 14px;
// }
// .dot-before::before {
//   content: "•";          /* 圆点符号 */
//   color: #1890ff;        /* 蓝色（可自定义） */
//   margin-right: 5px;     /* 与文字的间距 */
//   font-size: 1.2em;      /* 可选：调整圆点大小 */
// }
// .text{
//      white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
// }


// // ul 样式
// /* 外层容器 - 控制四周留白 */
// .detail-wrapper {
//   padding: 4px; /* 四周留白 */
// }

// /* 列表主体样式 */
// .detail-ul {
//   list-style: none;
//   padding: 12px 16px;
//   margin: 0;
//   background-color: #f5f5f5; /* 灰色背景 */
//   border-radius: 4px; /* 圆角 */
// }

// /* 列表项样式 */
// .detail-ul li {
//   display: flex;
//   margin-bottom: 8px;
// }

// .detail-ul li:last-child {
//   margin-bottom: 0; /* 最后一项去掉下边距 */
// }

// /* 文字样式 */
// .detail-label {
//   color: #666;
//   min-width: 80px; /* 固定标签宽度保持对齐 */
// }

// .detail-value {
//   color: #333;
//   font-weight: 500;
// }


</style>
