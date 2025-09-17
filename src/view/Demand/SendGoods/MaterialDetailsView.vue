<template>
  <div class="material-details">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>物资名称：</span>
        <span>{{ detailInfo.materialName }}</span>
      </div>
      <ul class="detail-list-ul">
                    <li>
              <span>规格型号：</span>
              <span>{{ detailInfo.specModel }}</span>
            </li>
              <li>
              <span>计量单位：</span>
              <span>{{ detailInfo.unit }}</span>
            </li>
             <li>
              <span>合同数量：</span>
              <span class="li-span-click">{{ detailInfo.amount }} {{ detailInfo.unit }}</span>
            </li>
            <li>
              <span>累计计划量(含本次)：</span>
              <span class="li-span-click">{{ detailInfo.cumulativeAmount }} {{ detailInfo.unit }}</span>
            </li>
            <li>
              <span>本次计划数量：</span>
              <span class="li-span-click">{{ detailInfo.planAmount }} {{ detailInfo.unit }}</span>
            </li>
            <li>
              <span>供应时间:</span>
              <span>{{ detailInfo.supplyDate }}</span>
            </li>
                <li>
              <span>使用地点:</span>
              <span>{{ detailInfo.addr }}</span>
            </li>
             <li>
              <span>收货地点:</span>
              <span>{{ detailInfo.field2 }}</span>
            </li>
              <li>
              <span>收货人及联系方式:</span>
              <span>{{ detailInfo.receiver }}</span>
            </li>
             <li>
              <span>投资方:</span>
              <span>{{ detailInfo.field0 }}</span>
            </li>
             <li>
              <span>投资比例:</span>
              <span>{{ detailInfo.field1 }}</span>
            </li>
             <li class="li-item-remark"> 
            <span>备注：</span>
            <div class="remark-detail">{{detailInfo.remark || '未填写'}}</div>
          </li>
          <li style="color: red;">
              <span>本次需求未发货数量：</span>
              <span >{{ detailInfo.ssendTotal }} {{ detailInfo.unit }}</span>
            </li>
        <!-- <li>
          <span>规格型号：</span>
          <span>{{ detailInfo.specModel }}</span>
        </li>
        <li>
          <span>计量单位：</span>
          <span>{{ detailInfo.unit }}</span>
        </li>
        <li>
          <span>合同数量：</span>
          <span>{{ detailInfo.amount }}</span>
        </li>
        <li>
          <span>已累计计划数量：</span>
          <span class="li-span-click">{{ detailInfo.cumulativeAmount }}</span>
        </li>
        <li v-if="detailInfo.deliveryDate">
          <span>供应时间：</span>
          <span>{{ detailInfo.deliveryDate }}</span>
        </li>
        <li>
          <span>收货人及联系方式：</span>
          <span>{{ detailInfo.receiver }}</span>
        </li>
        <li v-if="detailInfo.deliveryLocation">
          <span>交货地点：</span>
          <span>{{ detailInfo.deliveryLocation }}</span>
        </li> -->
        <!-- <li>
          <span>规格型号：</span>
          <span>{{ detailInfo.specModel }}</span>
        </li>
        <li>
          <span>计量单位：</span>
          <span>{{ detailInfo.unit }}</span>
        </li>
        <li>
          <span>需求数量：</span>
          <span>{{ detailInfo.amount }}</span>
        </li>
        <li>
          <span>发货数量：</span>
          <span>{{ detailInfo.cumulativeAmount }}</span>
        </li>
        <li>
          <span>退货数量：</span>
          <span></span>
        </li>
        <li>
          <span>收货人及联系方式：</span>
          <span>{{ detailInfo.receiver }}</span>
        </li>
        <li>
          <span>供应时间：</span>
          <span>{{ detailInfo.deliveryDate }}</span>
        </li>
        <li>
          <span>生产日期：</span>
          <span>{{ detailInfo.manufactureDate && parseTime(detailInfo.manufactureDate, '{y}-{m}-{d}') }}</span>
        </li>
        <li>
          <span>有效期截止日期：</span>
          <span>{{ detailInfo.expirationDate && parseTime(detailInfo.expirationDate, '{y}-{m}-{d}') }}</span>
        </li>
        <li>
          <span>投资方：</span>
          <span>{{ detailInfo.field0 }}</span>
        </li>
        <li>
          <span>投资比例：</span>
          <span>{{ detailInfo.field1 }}</span>
        </li> -->
      </ul>
      <!-- <div class="detail-list-title-content">
        <span>备注：</span>
        <div class="remark-detail">{{ detailInfo.remark || '未填写' }}</div>
      </div>
      <div class="detail-title-contentA">
        <img src="/static/icon-file.png">
        <span>附件</span>
      </div>
      <div class="detail-list-title-contentA">
        <file-download-view class="outbound-field-uploader" title="合格证附件："
          :fileList="filterList(detailInfo.fileByList, 'hgz') || []" />
        <file-download-view class="outbound-field-uploader" title="厂检报告附件："
          :fileList="filterList(detailInfo.fileByList, 'cjbg') || []" />
      </div> -->
    </div>
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
import FileDownloadView from "@/components/FileDownloadView.vue"
import { materialDemandPlanDetailsDetail } from '@/api/prodmgr-inv/materialDemandPlanDetails'
export default {
  name: 'MaterialDetailsView',
  mixins: [indexMixin],
  components: { FileDownloadView },
  data() {
    return {
      detailInfo: {
        fileByList: ''
      }
    }
  },
  activated() {
    this.init()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { item } = this.$route.query
      this.detailInfo = JSON.parse(item)
      // this.materialDemandPlanDetailsDetail(id)
    },
    materialDemandPlanDetailsDetail(id) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialDemandPlanDetailsDetail(id).then(({ data }) => {
        this.detailInfo = data
      }).finally(() => {
        toast.clear()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.material-details {

  .detail-list-ul {
    padding-left: 33px;
  }

  .detail-list-title-content {
    display: flex;
    flex-direction: column;
    height: 80px;
    padding-left: 33px;

    span:after {
      left: 20px;
    }

    .remark-detail {
      box-sizing: border-box;
      color: #272b31;
      font-size: 13px;
      line-height: 26px;
      background: #f6f6f6;
      border-radius: 3px;
      width: 100%;
      text-align: left;
      padding: 8px 14px;
      word-wrap: break-word;
      font-weight: 400;
    }
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

  .detail-list-title-contentA {
    padding-left: 10px;
  }
}
</style>