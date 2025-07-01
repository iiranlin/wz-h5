<template>
  <div ref="container">
    <div class="list-search-container">
        <van-search v-model="params.planName" show-action shape="round" background="#eef6ff"
                placeholder="请输入需求名称">
                <template #action>
                    <div @click="onSearch">搜索</div>
                </template>
            </van-search>
      <!-- <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" background="#eef6ff" readonly
        @click="handeSearchClick()">
      </van-search> -->
    </div>
    <div class="tabs">
      <van-tabs v-model="menuActiveIndex" color="#0571ff" background="#eef6ff" title-active-color="#0571ff"
        @change="tabsChange" title-inactive-color="#2e2e2e">
        <van-tab v-for="item in tabList" :title="item.title" :key="item.id" :name="item.status">

          <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
            <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." @load="onLoad" :offset="10" :immediate-check="false"> 
              <div v-for="(item, index) in listBySendData" :key="index" class="box-container">
                <ul class="list-ul">
                  <li>
                    <span class="font-weight">发货单号:</span>
                    <span class="font-weight">{{ item.shipmentBatchNumber }}</span>
                  </li>
                  <li>
                    <span>需求编号:</span>
                    <span>{{ item.planNumber }}</span>
                  </li>
                  <li>
                    <span>供应需求：</span>
                    <span class="text">{{ item.planName }}</span>
                  </li>
                  <li>
                    <span>物流单号：</span>
                    <span v-if="item.oddNumbers">{{ item.oddNumbers }}</span>
                    <span v-else>其他</span>
                  </li>
                  <li>
                    <span>需求项目: </span>
                    <span>{{ item.sectionName }}</span>
                  </li>
                  <li>
                    <span style="width: 200px;">发货单附件:</span>
                    <span style="color:#1989fa;" v-if="item.fileByList">{{ item.fileByList.fhd[0].fileName }}</span>
                  </li>
                  <li class="li-status">
                    <van-tag type="primary" round size="medium" v-if="item.status == 1">未发货</van-tag>
                    <van-tag type="primary" round size="medium" v-if="item.status == 2">货运中</van-tag>
                    <van-tag type="primary" round size="medium" v-if="item.status == 3" class="li-status-completed">已完成</van-tag>
                  </li>
                </ul>
                <div class="list-ul-button" v-if="item.status !=3">
                  <van-button class="button-info" plain round type="danger" @click="handleDelClick(item.id)"
                    v-if="item.status == 1">删除</van-button>
                  <van-button class="button-info" plain round type="info" @click="handleEditClick(item,'edit')"
                    v-if="item.status == 1" >编辑</van-button>
                  <van-button class="button-info" round type="info" @click="handleSendGoodsClick(item.id,item.status)"
                    v-if="item.status == 1">确认发货</van-button>
                    <!-- 增加货运位置是根据物流单号来显示的 -->
                  <van-button class="button-info" round type="info" size="mini" @click="handleConfirmClick(item.shipmentBatchNumber)"
                    v-if="item.oddNumbers == '' && item.status==2">增加货运位置</van-button>
                  <van-button class="button-info" plain round type="info" @click="handleCarGoClick(item.id)"
                    v-if="item.status == 2">货运详情</van-button>
                  <van-button class="button-info" plain round type="info" @click="handleLookClick(item.planId,item.shipmentBatchNumber,item.oddNumbers)"
                    v-if="item.status == 2">物流查看</van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>

      </van-tabs>
    </div>
    <!-- 增加货运位置 弹出框 -->
    <van-dialog v-model="freightLocationDiaLog" title="请填写货运当前位置" :show-cancel-button="false" 
      :showConfirmButton="false" >
      <div style="padding:10px;">
         <van-form @submit="onSubmit" ref="form" :key="formKey">
        <van-field v-model="positionInformation" name="positionInformation" label="当前位置" style="padding:13px 40px;" class="custom-border" placeholder="请输入货运当前位置" input-align="right"
          :rules="[{ required: true, message: '请填写当前位置' }]" required />
        <div class="locationsteps">
          <van-steps direction="vertical" :active="0">
            <van-step v-for="(item,index) in cargoList" :key="index">
              <h3>{{ item.positionInformation }}</h3>
              <p>{{ formattedCreateDate(item.createDate) }}</p>
            </van-step>
          </van-steps>
        </div>
        <div style="margin: 16px;" class="footer_button">
          <div><van-button round plain type="info" size="small" class="button-info"
              @click="cancelDiaLog">取消</van-button></div>
          <div><van-button round block type="info" size="small" class="button-info" native-type="submit">提交</van-button>
          </div>
        </div>
      </van-form>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import Vue from 'vue';
import { Dialog } from 'vant';
import { Form } from 'vant';
import { Field } from 'vant';
import { Toast } from 'vant';
import { Step, Steps } from 'vant';
import {snedGoodsList,snedGoodsSure,deleteGoods,addFreightLocations,addList} from '@/api/demand/sendGoods'
Vue.use(Step);
Vue.use(Steps);
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
// 全局注册
Vue.use(Dialog);
export default {
  name: 'Information',
  mixins: [keepPages],

  data() {
    return {
      formKey: 0,
      positionInformation: '',
      menuActiveIndex: 0,

      formData: {
        keywords: '',
      },
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      allFinished:false,
      allLoading:false,
      // allRefresh:false,
      allRefreshLoading:false,
      //订单状态字典
      orderStatusOptions: [],
      //优先保障字典
      guaranteeOptions: [],
      tabList: [
        {
          id: 0,
          title: '全部',
          status:''
        },
        {
          id: 1,
          title: '未发货',
          status:1
        },
        {
          id: 2,
          title: '货运中',
          status:2
        },
        {
          id: 3,
          title: '已完成',
          status:3
        }
      ],
      freightLocationDiaLog: false,
       listBySendData:[],
       total:0,
       positionInformation:"",
       //货运列表
       cargoList:"",
       //发货单号
       shipmentBatchNumber:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      snedGoodsList(this.params).then((res)=>{
        if(res.code==0){
            Toast.clear()
            this.total = res.data.total
            this.allRefreshLoading = false;
            if(this.total<=this.params.pageSize){
              this.listBySendData = res.data.list.map((item)=>({
                ...item,
                fileByList:item.fileByList ? JSON.parse(item.fileByList) : ''
              }))
            }else{
              this.params.pageNum++;
              let arr = res.data.list.map((item)=>({
                  ...item,
                  fileByList:item.fileByList ? JSON.parse(item.fileByList) : ''
              }))
              this.listBySendData = this.listBySendData.concat(arr)
            }
            if(this.listBySendData.length>=this.total){
              this.allFinished= true
            }
          // this.listBySendData = res.data.list
        }
      })
    },
    tabsChange(e) {
      // 每次切换把数组清空
      this.listBySendData = []
      this.params.status = e
      this.params.pageNum = 1
      this.allFinished = false;
      this.getList()
    },
    //发货
    handleSendGoodsClick(id,status) {
      Dialog.confirm({
        title: '',
        message: '确定已经发货！',
        confirmButtonColor:'#1989fa'
      })
        .then(() => {
          let params = {
            id:id,
            status:status
          }
          snedGoodsSure(params).then((res)=>{
            console.log(res)
            if(res.code==0){
              Toast.success(res.data);
              this.getList()
            }
          })
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
      // this.$router.push({path:'/sendGoods'})
    },
    // 日期格式化
     formattedCreateDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0
      return `${year}-${month}-${day}`;
    },
    //查看物流
    handleLookClick(id,number,logisticsNumber) {
      this.$router.push({ path: '/lookCargo',query:{id:id,number:number,logisticsNumber:logisticsNumber} })
    },
    //货运详情
    handleCarGoClick(id) {
      this.$router.push({ path: '/cargoDetails',query:{id:id} })
    },
    //增加货运位置
    handleConfirmClick(number) {
      this.formKey++
       this.shipmentBatchNumber = number
      addList(number).then((res)=>{
        if(res.code==0){
          this.cargoList = res.data.list
          this.freightLocationDiaLog = true
        }
      })
    },
    //下拉刷新
    allRefresh() {
      this.params.pageNum=1
      this.allFinished = false
      this.allRefreshLoading = true
      this.getList()
    },
    onSubmit(values) {
      let params={
        shipmentBatchNumber:this.shipmentBatchNumber,
        positionInformation:values.positionInformation
      }
      this.$refs.form
        .validate()
        .then(() => {
          addFreightLocations(params).then((res)=>{
            if(res.code==0){
              Toast.success(res.message);
              this.handleConfirmClick(this.shipmentBatchNumber)
            }
          })
          // 验证通过
          // Toast.success('添加成功');
          // this.freightLocationDiaLog = false
        })
        .catch(() => {
          //验证失败

        })
    },
    //编辑
    handleEditClick(data,title) {
      this.$router.push({ path: '/sendGoods',query:{data:JSON.stringify(data),title:title} })
    },
    //删除
    handleDelClick(id) {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要删除吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        let params={
          ids:[id]
        }
        deleteGoods(params).then((res)=>{
            if(res.code==0){
              Toast.success(res.message);
              this.getList();
            }
        })
        // this.$toast('删除成功');
      }).catch(() => {
      });
    },
    // 取消
    cancelDiaLog() {
      this.formKey++
      this.freightLocationDiaLog = false
      // this.username = null
    },
    onLoad(){
      this.getList()
    },
    onSearch(){
      this.params.pageNum=1
       this.getList()
    }
  },
};
</script>
<style lang="less" scoped>
.locationsteps {
    height: 200px;
    padding: 10px;
    background-color: rgb(245, 295, 255);
    overflow: scroll;
}
.locationsteps::-webkit-scrollbar {
    overflow-x: hidden;
}
.custom-border {
  border: 1px solid rgb(208,208,208);
  border-radius: 4px;
  margin-bottom: 10px;
 
}
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

::v-deep .van-dialog__confirm {
  color: #1989fa;
}

::v-deep .van-tabs__content {
  height: calc(100vh - 162px);
  overflow-y: scroll;
}

.locationsteps {
  padding: 10px;
  background-color: rgb(245, 295, 255);
}

/deep/.van-steps {
  background: transparent;
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

.footer_button {
  display: flex;
  justify-content: space-around;
}
</style>