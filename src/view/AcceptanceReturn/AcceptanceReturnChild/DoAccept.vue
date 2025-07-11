<template>
  <div :class="[(isView||tabs)?'default-container1':'default-container','default-scroll']">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>供应需求名称：</span>
        <span>{{dataList.planName}}</span>
      </div>
      <div >
      <ul class="detail-ul">
        <li>
          <span>需求项目：</span>
          <span>{{dataList.sectionName}}</span>
        </li> 
        <li>
          <span>需求组织：</span>
          <span>{{dataList.deptName}}</span>
        </li>
        <li v-if="isLable">
          <span>操作人：</span>
          <span>{{dataList.createUserName}}</span>
        </li>
        <li v-if="isLable">
          <span>收货时间：</span>
          <span>{{dataList.takeDate |formatDate }}</span>
        </li>
      </ul>
      <file-download-view class="outbound-field-uploader" title="发货单附件" :fileList="filterList(dataList.fileByList, 'fhd') || []"/>
    </div>
    </div>
     <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
          title-inactive-color="#2e2e2e">
          <van-tab :title="`收货明细（共${dataList.materialCirculationDetailsTableDTOS?dataList.materialCirculationDetailsTableDTOS.length:0}项）`" name="0" key="0">
                <div class="box-container" v-for="(item, index) in dataList.materialCirculationDetailsTableDTOS" :key="index">
                  <div>
                    <div class="detail-list-title-content">
                        <span>物资名称：</span>
                        <span>{{item.materialName}}</span>
                    </div>
                  <ul class="detail-list-ul">
                    <li>
                      <span>规格型号：</span>
                      <span>{{ item.specModel }}</span>
                    </li>
                      <li>
                      <span>计量单位：</span>
                      <span>{{ item.unit }}</span>
                    </li>
                    <li>
                      <span>包装形式：</span>
                      <span>{{ item.packagingFm }}</span>
                    </li>
                    <li>
                      <span>需求数量：</span>
                      <span class="li-span-click">{{ item.planAmount }}</span>
                    </li>
                    <li class="li-item-overlength">
                      <span>本次发货数量：</span>
                      <span class="li-span-click">{{ item.sendTotal }}</span>
                    </li>
                    <li v-if="isView">
                      <span>生产日期：</span>
                      <span>{{ item.manufactureDate |formatToDate }}</span>
                    </li>
                    <li class="li-item-overlength" v-if="isView">
                      <span>有效期截止日期：</span>
                      <span>{{ item.expirationDate }}</span>
                    </li>
                    <li v-if="isView">
                      <span >使用地点：</span>
                      <span>{{ item.addr }}</span>
                    </li>
                    <li v-if="isView">
                      <span>收货地址：</span>
                      <span>{{ item.field2 }}</span>
                    </li>
                    <li v-if="isView">
                      <span>供应时间：</span>
                      <span>{{ item.supplyDate |formatToDate}}</span>
                    </li>
                    <li class="li-item-overlength" v-if="isView">
                      <span>收货人及联系方式：</span>
                      <span>{{ item.receiver }}</span>
                    </li>
                    <li v-if="isView">
                      <span>投资方：</span>
                      <span>{{ item.field0 }}</span>
                    </li>
                    <li v-if="isView">
                      <span>投资比例：</span>
                      <span>{{ item.field1 }}</span>
                    </li>
                    <li class="li-item-remark" v-if="isView">
                      <span>备注：</span>
                      <div class="remark-detail">{{item.remark || '未填写'}}</div>
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
                        <span class="li-span-click">{{ item.putTotal }}</span>
                      </li>
                      <li>
                        <span>退货数量：</span>
                        <span style="color: #e4393c;">{{ item.refundTotal }}</span>
                      </li>
                    </template>
                  
                  </ul>
                  <template v-if="!isView">
                      <van-cell-group>
                        <file-upload-view  title="退货附件" :fileList="getFile(item.id)" businessType="01"/>
                      </van-cell-group>
                    </template>
                    <template v-else>
                      <file-download-view class="outbound-field-uploader" title="退货附件：" :fileList="filterList(item.fileByList, 'thfj_sh') || []"/>
                    </template>
                  <file-download-view class="outbound-field-uploader" title="合格证附件：" :fileList="filterList(item.fileByList, 'hgz') || []"/>
                    <file-download-view class="outbound-field-uploader" title="厂检报告附件：" :fileList="filterList(item.fileByList, 'cjbg') || []"/>
                  </div>
                </div>
          </van-tab>
          <van-tab title="初验信息" name="1" key="1">
            <div class="box-container">
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
                        <file-upload-view  title="自检单：" :fileList="fileZjdList" businessType="01"/>
                        <file-upload-view title="其他资料："  :fileList="fileQtzlList" businessType="01"/>
                    </van-cell-group>
                  </template>
                  <template v-else>
                    <!-- <li>
                      <span>自检单：</span>
                      <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(dataList.fileByList, 'zjd')"
                        :key="imgItem.filePath">{{ imgItem.fileName }}</span>
                    </li> -->
                    <file-download-view class="outbound-field-uploader" title="自检单：" :fileList="filterList(dataList.fileByList, 'zjd') || []"/>
                    <file-download-view class="outbound-field-uploader" title="其他资料：" :fileList="filterList(dataList.fileByList, 'qtzl') || []"/>
                    <!-- <li>
                      <span>其他资料：</span>
                        <span @click="imgClick(imgItem)" class="img-text" v-for="imgItem in filterList(dataList.fileByList, 'qtzl')"
                        :key="imgItem.filePath">{{ imgItem.fileName }}</span>
                    </li> -->
                  </template>
              </div>
          </van-tab>
     </van-tabs>
    <file-preview ref="filePreview"></file-preview>
    <div class="default-button-container" v-if="!isView">
      <van-button class="button-info" round type="info" @click="addClick">确定收货</van-button>
    </div>
    <div class="default-button-container" v-if="!tabs">
      <van-button class="button-info" round type="info" @click="checkClick">初验收货</van-button>
    </div>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import {parseTime} from '@/utils'
import BackToTop from '@/components/BackToTop'
import indexMixin from '@/view/mixins'
import {saveTake,defaultTake} from '@/api/prodmgr-inv/AcceptanceReturn'
import FilePreview from "@/components/FilePreview.vue";
import FileUploadView from "@/components/FileUploadView.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";

export default {
  name: 'DoAccept',
  mixins: [indexMixin],
  components: { FilePreview,FileUploadView ,FileDownloadView,BackToTop},
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
      tabs:true,  
      isLable:false,
      dataList:[],
      fileTHList:[],
      fileZjdList:[],
      fileQtzlList:[],
      currentTime: new Date() ,// 获取当前时间
      menuActiveIndex: '0'
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
            this.dataList.takeDate = parseTime(this.currentTime, '{y}-{m}-{d}')
            if(this.isView==false){
              this.dataList.materialCirculationDetailsTableDTOS.forEach(el => {
                  el.putTotal = el.sendTotal
                  this.fileTHList.push({id:el.id,value:[]})
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
      this.currentTime = val
      this.dataList.takeDate = parseTime(val, '{y}-{m}-{d}')
      this.showDatePicker = false
    },
    addClick() {

      let status= false
      this.dataList.materialCirculationDetailsTableDTOS.some((item,index)=>{
        if(item.refundTotal){
          if(!this.fileTHList[index].value.length){
            this.$toast('收货明细第'+(index+1)+'条，有退货数量，请上传退货附件');
            status =true
          }
        }
      })
      if(status){
        return
      }
      this.fileTHList.forEach(item=>{
        if(item.value.length){
          let byList=this.dataList.materialCirculationDetailsTableDTOS.find(el=>el.id == item.id).fileByList
          let fileObj={
            thfj_sh:item.value
          }
          let newObj=Object.assign({}, JSON.parse(byList),fileObj)
          this.dataList.materialCirculationDetailsTableDTOS.find(el=>el.id == item.id).fileByList =  JSON.stringify(newObj)
        }
      })
      if(this.fileZjdList.length){
        let fileObj={
          zjd:this.fileZjdList
        }
        let newObj =Object.assign({}, JSON.parse(this.dataList.fileByList),fileObj) 
        this.dataList.fileByList = JSON.stringify(newObj)
      }

      if(this.fileQtzlList.length){
        let fileObj={
          qtzl:this.fileQtzlList
        }
        let newObj =Object.assign({}, JSON.parse(this.dataList.fileByList),fileObj) 
        this.dataList.fileByList = JSON.stringify(newObj)
      }

      let params= {
        createUserName:this.dataList.createUserName,
        deptName:this.dataList.deptName,
        fileByList:this.dataList.fileByList,
        id:this.dataList.id,
        materialCirculationDetailsTableParamList:this.dataList.materialCirculationDetailsTableDTOS,
        planName:this.dataList.planName,
        sectionName:this.dataList.sectionName,
        sellerName:this.dataList.sellerName,
        shippingDate:this.formatByDate(this.dataList.shippingDate),
        takeDate:new Date(this.currentTime.getTime() + this.currentTime.getTimezoneOffset() * 60000).toISOString()

      }

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
    checkClick(){
      this.$router.push({name: 'DoAccept',query: {id:this.id,tabs:true,isLable:false}})
    },
    formatByDate(value) {
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
    onClickBack() {
      this.$router.push({path: '/AcceptanceReturn'})
    },
    imgClick({ fileName, filePath }) {
      this.$refs.filePreview.init(fileName, filePath)
    },
    getFile(id){
      return  this.fileTHList.find(item=>item.id == id).value
    }
  },
  mounted() {
    this.from = this.$route.query.from
    this.id = this.$route.query.id
    this.tabs = this.$route.query.tabs==(true||'true')
    this.isLable =this.$route.query.isLable==(true||'true')
    this.getDetailList()  
  }
}
</script>
<style lang="less" scoped>
.default-container{
  padding-bottom: 10px;
}
.default-container1 {
 padding-bottom: 40px;
}
.box-container {
  padding: 0px;
}

</style>
