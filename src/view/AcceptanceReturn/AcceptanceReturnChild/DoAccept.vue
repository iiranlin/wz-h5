<template>
  <div class="save-materials">
    <div class="save-materials-contract">
      <ul class="detail-ul">
        <li>
          <span class="font-weight">供应需求：</span>
          <span class="font-weight">2025年5月甲供物资需求计划表–04</span>
        </li>
        <li>
          <span>需求项目：</span>
          <span>标段项目名称</span>
        </li>
        <li>
          <span>需求组织：</span>
          <span>施工单位名称（分部）</span>
        </li>
        <li>
          <span>供应商：</span>
          <span>供应商名称</span>
        </li>
        <li>
          <span>发货时间：</span>
          <span>2025年6月11日</span>
        </li>
      </ul>
    </div>

    <div class="detail-title">发货单附件</div>
    <div class="box-container">
      <ul class="detail-ul">
        <li style="color: #0689ff" @click="imgClick">发货单附件/清单.pdf</li>
      </ul>
    </div>

    <div class="detail-title">收货明细</div>
    <div class="box-container" v-for="(item, index) in dataList" :key="index">
      <ul class="detail-ul">
        <li class="save-materials-li">
          <span class="font-weight">物资名称：</span>
          <span class="font-weight">{{ item.materialName }}</span>
        </li>
        <li>
          <span>规格型号：</span>
          <span>{{ item.specificationModel }}</span>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>计量单位：</span>
            <span>{{ item.unit }}</span>
          </div>
          <div class="li-item-right li-item-overlength">
            <span>包装形式：</span>
            <span>{{ item.packagingForm }}</span>
          </div>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>需求数量：</span>
            <span>{{ item.demandQuantity }}</span>
          </div>
          <div class="li-item-right li-item-overlength">
            <span>本次发货数量：</span>
            <span>{{ item.shipmentQuantity }}</span>
          </div>
        </li>
        <li>
          <span>生产日期：</span>
          <span>{{ item.productionDate }}</span>
        </li>
        <li class="li-item-overlength">
          <span>有效期截止日期：</span>
          <span>{{ item.validUntil }}</span>
        </li>
        <li>
          <span>收货地址：</span>
          <span>{{ item.deliveryAddress }}</span>
        </li>
        <li>
          <span>供应时间：</span>
          <span>{{ item.supplyTime }}</span>
        </li>
        <li class="li-item-overlength">
          <span>收货时间及联系方式：</span>
          <span>{{ item.contactInfo }}</span>
        </li>
        <li>
          <span>投资方：</span>
          <span>{{ item.investor }}</span>
        </li>
        <li>
          <span>投资比例：</span>
          <span>{{ item.investmentRatio }}</span>
        </li>
        <template v-if="!isView">
          <van-cell-group>
            <van-field v-model="item.receiveQuantity" label="收货数量" placeholder="请输入数量" required clearable :label-width="240"
                       input-align="right"/>
            <van-field v-model="item.returnQuantity" label="退货数量" placeholder="请输入数量" required clearable :label-width="240"
                       input-align="right"/>
          </van-cell-group>
        </template>
        <template v-else>
          <li>
            <span>收货数量：</span>
            <span>{{ item.receiveQuantity }}</span>
          </li>
          <li>
            <span>退货数量：</span>
            <span>{{ item.returnQuantity }}</span>
          </li>
        </template>
        <li class="li-item-overlength">
          <span>合格证附件：</span>
          <span style="color: #0689ff" @click="imgClick">{{ item.certificatePath }}</span>
        </li>
        <li class="li-item-overlength">
          <span>厂检报告附件：</span>
          <span style="color: #0689ff" @click="imgClick">{{ item.inspectionReportPath }}</span>
        </li>
        <template v-if="!isView">
          <van-cell-group>
            <van-field required name="uploader" label="退货附件：">
              <template #input>
                <van-uploader>
                  <van-button round type="info" class="outbound-uploader">上传</van-button>
                </van-uploader>
              </template>
            </van-field>

            <van-field v-model="item.remark" label="备注" placeholder="请输入备注" required clearable :label-width="240"
                       input-align="right"/>
          </van-cell-group>
        </template>
        <template v-else>
          <li>
            <span>退货附件：</span>
            <span style="color: #0689ff" @click="imgClick">{{ item.returnAttachmentPath }}</span>
          </li>
          <li>
            <span>备注：</span>
            <span>{{ item.remark }}</span>
          </li>
        </template>
      </ul>
    </div>

    <div class="detail-title">初验信息</div>
    <div class="box-container">
      <ul class="detail-ul">
        <template v-if="!isView">
          <van-cell-group>
            <van-field
              readonly
              clickable
              required
              name="calendar"
              :value="formData.num1"
              label="收货时间："
              placeholder="点击选择日期"
              @click="showDatePicker = true"
            />
            <van-calendar v-model="showDatePicker" @confirm="onDateConfirm"/>

            <van-field required name="uploader" label="自检单：">
              <template #input>
                <van-uploader>
                  <van-button round type="info" class="outbound-uploader">上传</van-button>
                </van-uploader>
              </template>
            </van-field>

            <van-field name="uploader" label="其他资料：">
              <template #input>
                <van-uploader>
                  <van-button round type="info" class="outbound-uploader">上传</van-button>
                </van-uploader>
              </template>
            </van-field>
          </van-cell-group>
        </template>
        <template v-else>
          <li>
            <span>自检单：</span>
            <span style="color: #0689ff" @click="imgClick">自检单附件.pdf</span>
          </li>
          <li>
            <span>其他资料：</span>
            <span style="color: #0689ff" @click="imgClick">其他资料附件.pdf</span>
          </li>
        </template>
      </ul>
    </div>
    <div class="default-button-container" v-if="!isView">
      <van-button class="button-info" round type="info" @click="addClick">确定收货</van-button>
    </div>

    <van-popup v-model="showPopup" position="bottom">
      <van-image-preview v-model="showImg" :images="images" :startPosition="startPosition" :loop="false" @close="showPopup = false"/>
    </van-popup>
  </div>
</template>
<script>
import {parseTime} from '@/utils'
import imgMixin from '@/view/mixins/imgMixin'

export default {
  name: 'DoAccept',
  mixins: [imgMixin],
  props: {
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      minDate: new Date(),
      formData: {
        name: '',
        password: '',
        currentDate: '',
        num1: '',
        num2: '',
        remark: ''
      },
      showDatePicker: false, // 控制日期选择器显示
      dataList: [
        {
          materialName: '计算机联锁设备',
          specificationModel: '2x2取2s10组道岔',
          unit: '套',
          packagingForm: '捆包',
          demandQuantity: 5,
          shipmentQuantity: 2,
          productionDate: '2025年6月1日',
          validUntil: '2026年6月1日',
          supplyTime: '2025年6月16日',
          usageLocation: '地点1, 地点2',
          deliveryAddress: '领航科技大厦',
          contactInfo: '张晓明 15888888888',
          investor: '五道口投资公司',
          investmentRatio: '40%; 60%',
          receiveQuantity: null,
          returnQuantity: null,
          certificatePath: '道岔合格证.pdf',
          inspectionReportPath: '道岔厂检报告.pdf',
          returnAttachmentPath: '不合格道岔附件.pdf',
          remark: '不合格道岔进行退货处理'
        },
        {
          materialName: '计算机联锁设备',
          specificationModel: '2x2取2s10组道岔',
          unit: '套',
          packagingForm: '捆包',
          demandQuantity: 5,
          shipmentQuantity: 3,
          productionDate: '2025年6月1日',
          validUntil: '2026年6月1日',
          supplyTime: '2025年6月16日',
          usageLocation: '地点1, 地点2',
          deliveryAddress: '领航科技大厦',
          contactInfo: '张晓明 15888888888',
          investor: '五道口投资公司',
          investmentRatio: '40%; 60%',
          receiveQuantity: null,
          returnQuantity: null,
          certificatePath: '道岔合格证.pdf',
          inspectionReportPath: '道岔厂检报告.pdf',
          returnAttachmentPath: '不合格道岔附件.pdf',
          remark: ''
        },
        {
          materialName: '计算机联锁设备',
          specificationModel: '2x2取2s10组道岔',
          unit: '套',
          packagingForm: '捆包',
          demandQuantity: 5,
          shipmentQuantity: 2,
          productionDate: '2025年6月1日',
          validUntil: '2026年6月1日',
          supplyTime: '2025年6月16日',
          usageLocation: '地点1, 地点2',
          deliveryAddress: '领航科技大厦',
          contactInfo: '张晓明 15888888888',
          investor: '五道口投资公司',
          investmentRatio: '40%; 60%',
          receiveQuantity: null,
          returnQuantity: null,
          certificatePath: '道岔合格证.pdf',
          inspectionReportPath: '道岔厂检报告.pdf',
          returnAttachmentPath: '不合格道岔附件.pdf',
          remark: ''
        },
        {
          materialName: '计算机联锁设备',
          specificationModel: '2x2取2s10组道岔',
          unit: '套',
          packagingForm: '捆包',
          demandQuantity: 5,
          shipmentQuantity: 2,
          productionDate: '2025年6月1日',
          validUntil: '2026年6月1日',
          supplyTime: '2025年6月16日',
          usageLocation: '地点1, 地点2',
          deliveryAddress: '领航科技大厦',
          contactInfo: '张晓明 15888888888',
          investor: '五道口投资公司',
          investmentRatio: '40%; 60%',
          receiveQuantity: null,
          returnQuantity: null,
          certificatePath: '道岔合格证.pdf',
          inspectionReportPath: '道岔厂检报告.pdf',
          returnAttachmentPath: '不合格道岔附件.pdf',
          remark: ''
        },
        {
          materialName: '计算机联锁设备',
          specificationModel: '2x2取2s10组道岔',
          unit: '套',
          packagingForm: '捆包',
          demandQuantity: 5,
          shipmentQuantity: 1,
          productionDate: '2025年6月1日',
          validUntil: '2026年6月1日',
          supplyTime: '2025年6月16日',
          usageLocation: '地点1, 地点2',
          deliveryAddress: '领航科技大厦',
          contactInfo: '张晓明 15888888888',
          investor: '五道口投资公司',
          investmentRatio: '40%; 60%',
          receiveQuantity: null,
          returnQuantity: null,
          certificatePath: '道岔合格证.pdf',
          inspectionReportPath: '道岔厂检报告.pdf',
          returnAttachmentPath: '不合格道岔附件.pdf',
          remark: ''
        }
      ]
    }
  },
  methods: {
    onDateConfirm() {
      this.formData.currentDate = parseTime(this.minDate, '{y}-{m}-{d}')
      this.showDatePicker = false
    },
    addClick() {
      this.$toast('保存成功')
      this.$router.push({path: '/AcceptanceReturn'})
    },
    onClickBack() {
      this.$router.push({path: '/AcceptanceReturn'})
    }
  },
  mounted() {
    this.from = this.$route.query.from
  }
}
</script>
<style lang="less" scoped>
.save-materials {
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;

  .save-materials-contract {
    margin-top: 10px;
    box-sizing: border-box;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 10px;

    .li-status {
      top: auto;
      bottom: 12px;

      span {
        background-color: #edf2ff;
        border: 1px solid #289fec;
        color: #1d93ff;
      }
    }
  }

  .button-info {
    position: fixed;
    bottom: 10px;
    min-width: 200px;
    height: 30px;
    left: 50%;
    transform: translateX(-50%);
  }

  .van-cell {
    padding-left: 15px;
    padding-right: 0;
  }

  //列表ul
  .detail-ul {

    li {
      & :nth-child(2) {
        width: calc(100% - 40px);
        overflow: inherit;
        text-overflow: inherit;
        white-space: inherit;
      }
    }
  }
}

.detail-title {
  font-weight: bold;
  margin: 0.2rem;
}

.upload-btn {
  width: 100px;
  height: 30px;
}

.flex-box {
  position: relative;

  .save-materials {
    position: absolute;
    top: 1.5rem;
  }
}

.outbound-uploader {
  min-width: 80px;
  height: 25px;
}

</style>
