<template>
    <div class="requirement-details" ref="container">
                 <div class="detail-base-info">
            <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ params.planName }}</p>
        <div class="list-title-content">
            <p style="color: #656980; font-size: 14px;">
                <span>需求编号：</span>
                <span class="font-weight" style="color:#3D83E2;">{{ params.planNumber }}</span>
            </p>
            <div class="li-title-status">
                <img :src="checkAuditStatus(params.backNode)" />
                <span :style="handlerTextColor(statusArr, 'value', params.issueType)" style="font-size: 13px;">{{ checkStatusText(this.issueType) }}</span>
            </div>
        </div>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
         <li>
                        <span>需求项目：</span>
                        <span>{{ params.sectionName }}</span>
                    </li>
                    <li>
                        <span>需求组织：</span>
                        <span>{{ params.deptName }}</span>
                    </li>
                    <li>
                        <span>发货单号：</span>
                        <span>{{ params.shipmentBatchNumber }}</span>
                    </li>
                    <li>
                        <span>使用地点：</span>
                        <span>{{ params.addr }}</span>
                    </li>
                    <li>
                        <span>退货时间：</span>
                        <span>{{ formattedCreateDate(params.backDate) }}</span>
                    </li>
        </ul>
      </div>
      <div class="detail-ul-bottom-text">
        <ul class="detail-ul">
          <li>
            <span>退货物资项目：<span class="li-span-click">{{ params.materialCirculationDetailsTableDTOS ?
                            params.materialCirculationDetailsTableDTOS.length : 0 }}</span> 项</span>
          </li>
        </ul>
      </div>
        </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>退货明细</span>
      </div>
          <material-details :backNode="params.issueType" :list="params.materialCirculationDetailsTableDTOS" :planStatus="params.planStatus"></material-details>
    </div>

        <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>初验信息</span>
      </div>
               <!-- <div class="box-container"> -->
                    <file-download-view class="outbound-field-uploader" title="自检单："
                        :fileList="filterList(params.fileByList, 'zjd') || []" />
                    <file-download-view class="outbound-field-uploader" title="其他资料："
                        :fileList="filterList(params.fileByList, 'qtzl') || []" />
                <!-- </div> -->
    </div>
        <file-preview ref="filePreview"></file-preview>
        <back-to-top className=".default-container"></back-to-top>
    </div>
</template>
<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import { Toast } from 'vant';
import { returnGoodsDetails } from '@/api/demand/returnGoods'
import { detailBySBack } from '@/api/prodmgr-inv/AcceptanceReturn'
import indexMixin from '@/view/mixins'
import MaterialDetails from './components/MaterialDetails.vue'
import FilePreview from "@/components/FilePreview.vue";
import FileUploadView from "@/components/FileUploadView.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import BackToTop from '@/components/BackToTop'
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
export default {
    name: 'MyProcess',
    mixins: [indexMixin],
    components: { FilePreview, FileDownloadView, FileUploadView, BackToTop, MaterialDetails },
    data() {
        return {
            username: '',
            password: '',
            value: '',
            showCalendar: false,
            showAction: false,
            loading: false,
            finished: false,
            result: [],
            list: [],
            orderId: '',
            params: {},
            fileTHList: [],


            statusArr: [
                { text: '全部', value: '', color: '' },
                { text: '质检不通过', value: '2', color: '#FC5937' },
                { text: '收货不通过', value: '1', color: '#FC5937' }
            ],
            issueType: '',

        };
    },
    created() {
        this.orderId = this.$route.query.id
        this.issueType = this.$route.query.issueType
        console.log(this.issueType, 'issueType')
        this.getGoodsOrderDetails();
    },
    methods: {
        // 时间戳转换成日期格式
        formattedCreateDate(timestamp) {
            if (!timestamp) return ''; // 处理空值
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0
            return `${year}-${month}-${day}`;
        },
        getGoodsOrderDetails() {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });

            const detailsFun = this.issueType == 2 ? detailBySBack : returnGoodsDetails
            
            detailsFun(this.orderId).then((res) => {
                if (res.code == 0) {
                    Toast.clear()
                    this.params = {
                        ...res.data, // 展开原有属性
                        fileByList: res.data.fileByList
                    };
                }

            })
        },
        onSubmit(values) {

        },
        imgClick(fileName, filePath) {
            this.$refs.filePreview.init(fileName, filePath)
        },
            checkAuditStatus(status) {
      if (status == '0') {
        return '/static/icon-reject.png'
      } else if (['1', '2'].includes(status)) {
        return '/static/newIcon_InspectionFails.png'
      } else {
        return '/static/Icon_noPass.png'
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

    // }


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
.box-container {
    padding: 0px !important;
}

.detail-list-ul {
    margin: 0 !important;
}

.detail-title {
    font-weight: bold;
    margin: 0.2rem;
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

.detail-title-content-custom {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    padding-left: 20px;
}

.label {
    font-size: 13px;
    color: #3b7cff;
    line-height: 1;
}

.title-bold {
    font-size: 18px;
    font-weight: bold;
    color: #1a1a1a;
    margin-top: 4px;
    padding-left: 20px;
}



  .detail-ul-text{
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;
    .detail-ul{
      padding: 10px 12px;
    }
  }




</style>