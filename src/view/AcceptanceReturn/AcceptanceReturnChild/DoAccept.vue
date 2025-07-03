<template>
  <div class="save-materials">
    <div class="save-materials-contract">
      <ul class="detail-ul">
        <li class="li-item-overlength">
          <span class="font-weight">供应需求名称：</span>
          <span class="font-weight">{{dataList.planName}}</span>
        </li>
        <li>
          <span>需求项目：</span>
          <span>{{dataList.sectionName}}</span>
        </li> 
        <li>
          <span>需求组织：</span>
          <span>{{dataList.deptName}}</span>
        </li>
        <li>
          <span>操作人：</span>
          <span>{{dataList.createUserName}}</span>
        </li>
        <li v-if="isView">
          <span>收货时间：</span>
          <span>{{dataList.takeDate |formatDate }}</span>
        </li>
      </ul>
    </div>

    <div class="detail-title">发货单附件</div>
    <div class="box-container">
      <ul class="detail-ul">
        <li @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(dataList.fileByList, 'fhd')"
                  :key="imgItem.filePath">{{ imgItem.fileName }}</li>
      </ul>
    </div>
    <div class="detail-title">收货明细</div>
    <div class="box-container" v-for="(item, index) in dataList.materialCirculationDetailsTableDTOS" :key="index">
      <ul class="detail-ul">
        <li class="save-materials-li">
          <span class="font-weight">物资名称：</span>
          <span class="font-weight">{{ item.materialName }}</span>
        </li>
        <li>
          <span>规格型号：</span>
          <span>{{ item.specModel }}</span>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>计量单位：</span>
            <span>{{ item.unit }}</span>
          </div>
          <div class="li-item-right li-item-overlength">
            <span>包装形式：</span>
            <span>{{ item.packagingFm }}</span>
          </div>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>需求数量：</span>
            <span>{{ item.planAmount }}</span>
          </div>
          <div class="li-item-right li-item-overlength">
            <span>本次发货数量：</span>
            <span>{{ item.sendTotal }}</span>
          </div>
        </li>
        <li>
          <span>生产日期：</span>
          <span>{{ item.manufactureDate |formatToDate }}</span>
        </li>
        <li class="li-item-overlength">
          <span>有效期截止日期：</span>
          <span>{{ item.expirationDate }}</span>
        </li>
        <li>
          <span>使用地点：</span>
          <span>{{ item.addr }}</span>
        </li>
        <li>
          <span>收货地址：</span>
          <span>{{ item.field2 }}</span>
        </li>
        <li>
          <span>供应时间：</span>
          <span>{{ item.supplyDate |formatToDate}}</span>
        </li>
        <li class="li-item-overlength">
          <span>收货人及联系方式：</span>
          <span>{{ item.receiver }}</span>
        </li>
        <li>
          <span>投资方：</span>
          <span>{{ item.field0 }}</span>
        </li>
        <li>
          <span>投资比例：</span>
          <span>{{ item.field1 }}</span>
        </li>
        <li class="li-item-overlength">
          <span>合格证附件：</span>
          <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(item.fileByList, 'hgz')"
          :key="imgItem.filePath">{{ imgItem.fileName }}</span>
        </li>
        <li class="li-item-overlength">
          <span>厂检报告附件：</span>
           <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(item.fileByList, 'cjbg')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
        </li>
        <li>
            <span>备注：</span>
            <span>{{ item.remark }}</span>
        </li>
        <template v-if="!isView">
          <van-cell-group>
            <van-field v-model="item.putTotal" label="收货数量"   type="number" placeholder="请输入数量" required clearable :label-width="240"
                       input-align="right" @input="handleInput($event, index,item)" />
            <van-field v-model="item.refundTotal" label="退货数量" type="number" placeholder="请输入数量" required clearable :label-width="240"
                       input-align="right" @input="handleInput1($event, index,item)"/>
          </van-cell-group>
        </template>
        <template v-else>
          <li>
            <span>收货数量：</span>
            <span>{{ item.putTotal }}</span>
          </li>
          <li>
            <span>退货数量：</span>
            <span>{{ item.refundTotal }}</span>
          </li>
        </template>
        <template v-if="!isView">
          <van-cell-group>
            <van-field required name="uploader" label="退货附件：">
              <template #input>
                <van-uploader>
                  <van-button round type="info" class="outbound-uploader">上传</van-button>
                </van-uploader>
              </template>
            </van-field>

            <!-- <van-field v-model="item.remark" label="备注" placeholder="请输入备注" required clearable :label-width="240"
                       input-align="right"/> -->
          </van-cell-group>
        </template>
        <template v-else>
          <li>
            <span>退货附件：</span>
            <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(item.fileByList, 'thfj_sh')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
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
              :value="dataList.takeDate"
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
             <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(dataList.fileByList, 'zjd')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
          </li>
          <li>
            <span>其他资料：</span>
               <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(dataList.fileByList, 'qtzl')"
              :key="imgItem.filePath">{{ imgItem.fileName }}</span>
          </li>
        </template>
      </ul>
    </div>
    <div class="default-button-container" v-if="!isView">
      <van-button class="button-info" round type="info" @click="addClick">确定收货</van-button>
    </div>

    <file-preview ref="filePreview"></file-preview>
  </div>
</template>
<script>
import {parseTime} from '@/utils'
import indexMixin from '@/view/mixins'
import {saveTake,defaultTake} from '@/api/prodmgr-inv/AcceptanceReturn'
import FilePreview from "@/components/FilePreview.vue";
export default {
  name: 'DoAccept',
  mixins: [indexMixin],
  components: { FilePreview },
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
      id:"",
      dataList:[]
    }
  },
  filters: {
    formatDate(value) {
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
    },
    formatToDate(value) {
      if(value){
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      }else{
        return ""
      }  
    }
  },
  methods: {
    getDetailList(){
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
       defaultTake(this.id).then((res)=>{
          if(res.success){
            this.dataList = res.data
            if(this.isView==false){
              this.dataList.materialCirculationDetailsTableDTOS.forEach(el => {
                  el.putTotal = el.sendTotal
              })  
            }
          }
       }).finally(() => {
          toast.clear();
      });
    },
    handleInput(val,index,item){
      const num = Number(val);
      if (!isNaN(num) && num <= item.sendTotal) {
        this.dataList.materialCirculationDetailsTableDTOS[index].putTotal = num; 
        this.dataList.materialCirculationDetailsTableDTOS[index].refundTotal = this.dataList.materialCirculationDetailsTableDTOS[index].sendTotal - this.dataList.materialCirculationDetailsTableDTOS[index].putTotal
      } else {
        this.$toast('收货数量不能大于发货数量'); 
        this.dataList.materialCirculationDetailsTableDTOS[index].putTotal = 0; 
      }
    },
    handleInput1(val,index,item){
      const num = Number(val);
      if (!isNaN(num) && num <= item.sendTotal) {
        this.dataList.materialCirculationDetailsTableDTOS[index].refundTotal = num; 
        this.dataList.materialCirculationDetailsTableDTOS[index].putTotal = this.dataList.materialCirculationDetailsTableDTOS[index].sendTotal - this.dataList.materialCirculationDetailsTableDTOS[index].refundTotal
      } else {
        this.$toast('退货数量不能大于发货数量'); 
        this.dataList.materialCirculationDetailsTableDTOS[index].refundTotal=0 
      }
    },
    onDateConfirm(val) {
      this.dataList.takeDate = parseTime(val, '{y}-{m}-{d}')
      this.showDatePicker = false
    },
    addClick() {
      let params= this.dataList

      if(!params.takeDate){
        this.$toast('请选择收货时间'); 
        return
      }
      if(!JSON.parse(params.fileByList).zjd){
         this.$toast('请上传自检单'); 
         return
      }
      saveTake(params).then((res)=>{
        if(res.success){
          this.$toast('保存成功')
          this.$router.push({path: '/AcceptanceReturn'})  
        } 
      })
      
    },
    onClickBack() {
      this.$router.push({path: '/AcceptanceReturn'})
    },
    imgClick({ fileName, filePath }) {
      this.$refs.filePreview.init(fileName, filePath)
    }
  },
  mounted() {
    this.from = this.$route.query.from
    this.id = this.$route.query.id
    this.getDetailList()  
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
    .img-text {
      color: #0689ff;
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
