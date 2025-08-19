<template>
  <div class="default-container" ref="container" >
    <div class="list-search-container">
      <van-search v-model="params.queryField" placeholder="输入关键字搜索" left-icon="none" shape="round" :show-action="showAction"
          @search="onSearch">
          <template slot='right-icon'>
            <van-icon name="search" @click="statusChange()" />
          </template>
        </van-search>
      <!-- <van-search v-model="params.planName" placeholder="输入关键字搜索" shape="round" background="#eef6ff"  @search="onSearch">
      </van-search> -->
    </div>
    <div class="tabs">
      <van-tabs v-model="menuActiveIndex" color="#0571ff" background="#ffffff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e"
        @change="tabsChange">
        <van-tab v-for="item in tabList" :title="item.title" :key="item.id" :name="item.status">
          <div v-if="listBySendData.length > 0">
            <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
              <van-list v-model="loading" :finished="finished" finished-text="没有更多了..." @load="onLoad" :offset="10"
                :immediate-check="false">
                <div class="detail-base-info">
                   <div v-for="(item, index) in listBySendData" :key="index" class="box-container"
                  @click="handleCarGoClick(item.id)">
                   <div class="list-title-content">

                                         <span style="color: gray;" >需求编号：</span>
                                         <span class="font-weight" style="color:gray;">{{ item.planNumber }}</span>

                    <div class="li-title-status">
                      <img :src="checkAuditStatus(item.status)" />
                      <span>{{ checkStatusText(item.status) }}</span>
                    </div>
                  </div>
                  <ul class="list-ul">
                    <li>
<!--                      <span>供应需求：</span>-->
                      <span class="text" style="font-weight: bold;" >{{ item.planName }}</span>
                    </li>
                   <!-- <li>-->
<!--                      <span>需求编号:</span>-->
<!--                      <span style="color:#1989fa;" @click.stop="requirementDetails(item.planId)">{{ item.planNumber-->
<!--                        }}</span>-->
<!--                    </li> -->

                   <li>
                     <span>建设项目：</span>
                     <span>{{ item.projectName }}</span>
                   </li>
                   <li>
                     <span>标段项目: </span>
                     <span>{{ item.sectionName }}</span>
                   </li>

                                        <!-- <li>
                                          <span>需求项目: </span>
                                          <span>{{ item.sectionName }}</span>
                                        </li> -->
                <li>
                  <span>发货单号：</span>
                   <span>{{ item.shipmentBatchNumber }}</span>
                </li>

                    <li>
                      <span>发货时间: </span>
                      <span>{{ formattedCreateDate(item.shippingDate) }}</span>
                    </li>
<!--                    <li>-->
<!--                      <span>物流单号：</span>-->
<!--                      <span style="color:#1989fa;" v-if="item.oddNumbers"-->
<!--                        @click.stop="handleLookClick(item.planId, item.shipmentBatchNumber, item.oddNumbers)"-->
<!--                      >{{-->
<!--                        item.oddNumbers }}</span>-->
<!--                      <span v-else style="color:#1989fa;">其他</span>-->
<!--                    </li>-->

                    <li>
                      <span>物流单号：</span>
                      <span  v-if="item.oddNumbers"

                      >{{
                          item.oddNumbers }}</span>
                      <span v-else >其他</span>
                    </li>

                    <li>
                      <span>操作人: </span>
                      <span>{{ item.createUserName }}</span>
                    </li>
                    <li>
                      <span>操作时间: </span>
                      <span>{{ formatTimestamp(item.createDate) }}</span>
                    </li>
<!--                    <li>-->
<!--                      <span style="width: 200px;">发货单附件:</span>-->
<!--                      <span style="color:#1989fa;"-->
<!--                        v-if="item.fileByList && item.fileByList.fhd && item.fileByList.fhd.length > 0"-->
<!--                        @click.stop="imgClick(item.fileByList.fhd[0].fileName, item.fileByList.fhd[0].filePath)">{{-->
<!--                          item.fileByList.fhd[0].fileName }}</span>-->
<!--                    </li>-->
                  </ul>
                  <div class="list-ul-button" v-if="item.status != 3">
                    <van-button class="button-info" plain round type="info" @click.stop="handleSendGoodsClick(item.id)"
                      v-if="item.status == 1">确认发货</van-button>
                    <van-button class="button-info"  plain round type="info"
                                style="color: black; border-color: #d9d9d9; background-color: white;"
                      @click.stop="handleEditClick(item.id, 'edit',item.planId)" v-if="item.status == 1">编辑</van-button>
                    <van-button class="button-info" plain round type="danger" @click.stop="handleDelClick(item.id)"
                                style="color: black; border-color: #d9d9d9; background-color: white;"
                                v-if="item.status == 1">删除</van-button>
                    <van-button
                        style="color: black; border-color: #d9d9d9; background-color: white;"
                        class="button-info" plain round type="info"
                      @click.stop="handleLookClick(item.planId, item.shipmentBatchNumber, item.oddNumbers)"
                      v-if="item.status == 2">物流查看</van-button>

                    <!-- 增加货运位置是根据物流单号来显示的 -->
                    <van-button
                        style="color: black; border-color: #d9d9d9; background-color: white;"
                        class="button-info" plain round type="info" size="mini"
                      @click.stop="handleUpload(item.id)" v-if="item.status == 2">修改附件</van-button>
                    <van-button
                        style="color: black; border-color: #d9d9d9; background-color: white;"
                        class="button-info" plain round type="info" @click.stop="handleCarGoClick(item.id)"
                      v-if="item.status == 2">货运详情</van-button>
                    <van-button class="button-info" plain round type="info" size="mini"
                    @click.stop="createPosition(item.shipmentBatchNumber)"
                      v-if="item.oddNumbers == '' && item.status == 2">增加货运位置</van-button>
<!--                    @click.stop="handleConfirmClick(item.shipmentBatchNumber)"-->
                  </div>
                </div>
                </div>

              </van-list>
            </van-pull-refresh>
          </div>
          <div v-else>
            <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
              <van-empty description="暂无数据" />
            </van-pull-refresh>
          </div>
        </van-tab>

      </van-tabs>
    </div>


    <!-- 增加货运位置 弹出框 -->
    <van-dialog v-model="freightLocationDiaLog" title="请填写货运当前位置" :show-cancel-button="false"
      :showConfirmButton="false">
      <div style="padding:10px;">
        <van-form @submit="onSubmit" ref="form" :key="formKey">
          <van-field v-model="positionInformation" name="positionInformation" label="当前位置" style="padding:13px 40px;"
            class="custom-border" placeholder="请输入货运当前位置" input-align="right"
            :rules="[{ required: true, message: '请填写当前位置' }]" required />
          <div class="locationsteps">
            <van-steps direction="vertical" active-color="#0086ff" :active="0">
              <van-step v-for="(item, index) in cargoList" :key="index">
                <h3>{{ item.positionInformation }}</h3>
                <p>{{ formattedCreateDate(item.createDate) }}</p>
              </van-step>
            </van-steps>
          </div>
          <div style="margin: 16px;" class="footer_button">
            <div><van-button round plain type="info" size="small" class="button-info"
                @click="cancelDiaLog">取消</van-button>
            </div>
            <div><van-button round block type="info" size="small" class="button-info"
                native-type="submit">提交</van-button>
            </div>
          </div>
        </van-form>
      </div>
    </van-dialog>
    <file-preview ref="filePreview"></file-preview>
    <back-to-top className=".van-tabs__content"></back-to-top>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import BackToTop from '@/components/BackToTop'
import Vue from 'vue';
import { Dialog } from 'vant';
import { Form } from 'vant';
import { Field } from 'vant';
import { Toast } from 'vant';
import { Step, Steps } from 'vant';
import FilePreview from "@/components/FilePreview.vue";
import { snedGoodsList, snedGoodsSure, deleteGoods, addFreightLocations, addList } from '@/api/demand/sendGoods'

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
  components: { FilePreview,BackToTop },
  data() {
    return {
      formKey: 0,
      menuActiveIndex: 0,
      showAction: false,
      formData: {
        keywords: '',
      },
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      finished: false,
      loading: false,
      // allRefresh:false,
      allRefreshLoading: false,
      //订单状态字典
      orderStatusOptions: [],
      //优先保障字典
      guaranteeOptions: [],
      tabList: [
        {
          id: 0,
          title: '全部',
          status: ''
        },
        {
          id: 1,
          title: '未发货',
          status: 1
        },
        {
          id: 2,
          title: '货运中',
          status: 2
        },
        {
          id: 3,
          title: '已完成',
          status: 3
        }
      ],
      freightLocationDiaLog: false,
      listBySendData: [],
      total: 0,
      positionInformation: "",
      //货运列表
      cargoList: "",
      //发货单号
      shipmentBatchNumber: '',
       statusArr: [
        { text: '全部', value: '' },
        { text: '未发货', value: '1' },
        { text: '货运中', value: '2' },
        { text: '已完成', value: '3' }
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      snedGoodsList(this.params).then((res) => {
        if (res.code == 0) {
          Toast.clear()
          if (this.allRefreshLoading) {
            this.listBySendData = [];
            this.allRefreshLoading = false;
          }
          this.total = res.data.total
          const newData = res.data.list.map((item) => ({
            ...item,
            fileByList: item.fileByList ? JSON.parse(item.fileByList) : '', // 默认值设为 [] 避免 JSON.parse 报错
          }));
          if (this.params.pageNum === 1) {
            this.listBySendData = newData
          } else {
            this.listBySendData = this.listBySendData.concat(newData)
          }
          if (this.listBySendData.length >= res.data.total) {
            this.finished = true;
          }
          this.loading = false;
          this.$forceUpdate(); // 强制更新视图
          // this.listBySendData = res.data.list
        }
      }).catch(() => {
        Toast.clear();
        Toast("网络错误，请重试");
      });
    },
    tabsChange(e) {
      // 每次切换把数组清空
      this.listBySendData = []
      this.params.status = e
      this.params.pageNum = 1
      this.finished = false;
      this.allRefreshLoading = true
      this.getList()
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
              this.params.pageNum = 1
              this.allRefreshLoading = true
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
      if (!timestamp) return ''; // 处理空值
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0
      return `${year}-${month}-${day}`;
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
    //查看物流
    handleLookClick(id, number, logisticsNumber) {
      this.$router.push({ path: '/lookCargo', query: { id: id, number: number, logisticsNumber: logisticsNumber } })
    },
    // 需求详情
    requirementDetails(id) {
      this.$router.push({ path: '/supplyMsg', query: { id: id } })
    },
    //货运详情分
    handleCarGoClick(id) {
      this.$router.push({ path: '/cargoDetails', query: { id: id,btnEvent:false } })
    },
    createPosition(number){

      this.$router.push({ path: '/cargoPosition', query: { shipmentBatchNumber:number,page:'/Information' } })
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


    //增加货运位置
    handleConfirmClick(number) {
      this.formKey++
      this.shipmentBatchNumber = number
      let params = {
        shipmentBatchNumber: number
      }
      addList(params).then((res) => {
        if (res.code == 0) {
          this.cargoList = res.data.list
          this.freightLocationDiaLog = true

        }
      })
    },
    //下拉刷新
    allRefresh() {
      this.params.pageNum = 1
      this.finished = false
      this.allRefreshLoading = true
      this.getList()
    },
    onSubmit(values) {
      let params = {
        shipmentBatchNumber: this.shipmentBatchNumber,
        positionInformation: values.positionInformation
      }
      this.$refs.form
        .validate()
        .then(() => {
          addFreightLocations(params).then((res) => {
            if (res.code == 0) {
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
    handleEditClick(id, title,planId) {
      this.$store.dispatch('public/setSelectGoodDataEdit', []);
      this.$router.push({ path: '/SendGoods', query: {goodData:JSON.stringify([]), id: id, text: title,planId:planId } })
    },
    //文件修改
    handleUpload(id) {
      this.$router.push({ path: '/Modifyfile', query: { id: id } })
    },
    //删除
    handleDelClick(id) {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要删除吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          ids: [id]
        }
        deleteGoods(params).then((res) => {
          if (res.code == 0) {
            Toast.success(res.message);
            this.allRefreshLoading = true
            this.finished = false
            this.params.pageNum = 1
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
    onLoad() {
      this.params.pageNum++
      this.getList()
    },
    onSearch() {
      this.allRefreshLoading = true
      this.params.pageNum = 1
      this.getList()
    },
     statusChange() {
      this.allRefreshLoading = true
      this.params.pageNum = 1
     this.getList()
    },
    imgClick(fileName, filePath) {
      this.$refs.filePreview.init(fileName, filePath)
    },
     checkAuditStatus(status) {
      console.log(status)
      //   2货运中 3 完成
      // if (status == '0') {
      //   return '/static/icon-send-success.png'
      // } else if (['5', '10'].includes(status)) {
      //   return '/static/icon-return.png'
      // } else {
      //   return '/static/icon-send-success.png'
      // }
       if (status == '2') {
         return '/static/icon-send-midway.png'
       } else if ('3'== status) {
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

.detail-ul-text {
  margin: 10px;
  background: #f2f2f2;
  border-radius: 5px;

  .detail-ul {
    padding: 10px 8px;
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

.detail-title-content{
  padding: 0;
  border-bottom: 0.025rem solid #e3e3e3;
  position: relative;
  .detail-title-status {
    position: absolute;
    right: 10px;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;

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
/deep/.arrow{
  width: 0.1rem !important;
}
.list-ul-button {
  display: flex;
  justify-content: flex-end;
}

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
  border: 1px solid rgb(208, 208, 208);
  border-radius: 4px;
  margin-bottom: 10px;

}

.li-status {
  background-color: #ffffff !important;
  .van-tag--primary {
    color: #028bff;
    // background: #edf4ff;
  }

  .van-tag--danger {
    color: #f83738;
    // background: #ffe2e2;
  }

  .li-status-completed {
    color: #6f6f6f;
    // background: #ededed;
  }
}

::v-deep .van-dialog__confirm {
  // color: #1989fa;
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
  }

  .van-cell {
    border-radius: 50px;
  }
}

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button-info {
  min-width: 2rem;
}

.footer_button {
  display: flex;
  justify-content: space-around;
}
</style>
