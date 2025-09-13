<template>
  <div class="select-materials">
    <div class="detail-base-info">
        <div class="detail-title-text">
          <p>需求名称：</p>
          <p>{{ goodsMsg.planName }}</p>
        </div>
        <div class="detail-ul-text">
          <ul class="detail-ul">
            <li>
              <span>建设项目：</span>
              <span>{{ goodsMsg.projectName }}</span>
            </li> 
            <li>
              <span>标段项目：</span>
              <span>{{ goodsMsg.sectionName }}</span>
            </li>
            <li>
              <span>合同名称：</span>
              <span class="text">{{ goodsMsg.contractName }}</span>
            </li>
          </ul>
        </div>
      </div>
    <div class="detail-base-info detail-base-info-edited">
      <template>
        <div class="detail-title-content">
          <img src="/static/icon-file.png" />
          <span>需求计划表</span>
        </div>
        
        <file-download-view class="outbound-field-uploader"
          :fileList="goodsMsg.fileList?.[0].fileList || []" />
      </template>
      </div>
    <van-sticky class="select-materials-sticky">
      <div class="select-materials-search">
        
        <p class="select-materials-search-p">
          <van-checkbox v-model="isAllSelected" @click="toggleAll">全选</van-checkbox>
        </p>
        <van-search v-model="searchQuery" placeholder="输入关键字搜索" left-icon="none" background="center" :show-action="showAction"
            @search="onSearch">
            <template slot='right-icon'>
              <van-icon name="search" @click="statusChange()" />
            </template>
          </van-search>
        <!-- <van-search v-model="searchQuery" placeholder="输入关键字搜索" background="center" :show-action="showAction"
          @search="onSearch" @cancel="onCancel" @focus="onFocus" /> -->
      </div>
    </van-sticky>
    <div class="select-materials-list">
      <div class="van-list">
          <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了"> -->
            <van-checkbox-group v-if="filteredList.length" v-model="result" @change="selectGoods" ref="checkboxGroup">
        <!--本次需求未发货数量为0不可选-->
        <van-checkbox shape="square" :name="item.allocationUniqueNumber" v-for="(item, index) in filteredList" :key="index" :disabled="item.ssendTotal == 0 ? true : false" ref="checkboxGroup">
           <div class="detail-base-info">
                 <!-- <div class="detail-title-content">
            <img src="/static/icon-xqjh.png">
            <span>物资名称：</span>
            <span>{{item.materialName}}</span>
        </div> -->
          <ul class="list-ul">
            <li>
                <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
              </li>
            <li>
              <span>规格型号：</span>
              <span>{{ item.specModel }}</span>
            </li>
              <li>
              <span>计量单位：</span>
              <span>{{ item.unit }}</span>
            </li>
             <li>
              <span>合同数量：</span>
              <span class="li-span-click">{{ item.amount }}</span>
            </li>
            <li>
              <span>累计计划量(含本次)：</span>
              <span class="li-span-click">{{ item.cumulativeAmount }}</span>
            </li>
            <li>
              <span>本次计划数量：</span>
              <span class="li-span-click">{{ item.planAmount }}</span>
            </li>
            <!-- <li>
              <span>供应时间:</span>
              <span>{{ item.supplyDate }}</span>
            </li>
                <li>
              <span>使用地点:</span>
              <span>{{ item.addr }}</span>
            </li>
             <li>
              <span>收货地点:</span>
              <span>{{ item.field2 }}</span>
            </li>
              <li>
              <span>收货人及联系方式:</span>
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
            <div class="remark-detail">{{item.remark || '未填写'}}</div>
          </li> -->
          <li style="color: red;">
              <span>本次需求未发货数量：</span>
              <span >{{ item.ssendTotal }}</span>
            </li>
            <li class="li-span-open">
                <span class="li-span-grey" @click.stop="openClick(item)">查看详情<van-icon name="arrow" /></span>
              </li>
          </ul>
           </div>
           
        </van-checkbox>
      </van-checkbox-group>
      <van-empty image="/empty-image-default.png" v-else description="暂无数据" />
    <!-- </van-list> -->
      </div>
    </div>

    <div class="default-button-container">
      <div class="default-button-container-selected" @click="selectedClick">
        <img src="@/assets/img/Icon.png" />
        <span>已选择 <span class="li-span-click">{{ result.length }}</span> 项</span>
        <img v-if="result.length"
        :class="{ 'default-button-container-selected-img': $refs.selectedList && $refs.selectedList.sheetShow }"
          src="@/assets/img/Icon-slideup.png" />

      </div>
        <!-- <div class="allChoose">
          <van-checkbox v-model="isAllSelected" @change="toggleAll">全选</van-checkbox>
        </div>
        <div class="chooseNum">
            已选物资<span class="number">{{ selectTotal }}</span>项
        </div> -->
        <!-- <div class="btns"> -->
          <!-- <van-button round type="info" @click="editBack(text,goodsId)" class="btn" v-if="text=='edit'">上一步</van-button>
          <van-button round type="info" @click="back" class="btn" v-else>上一步</van-button> -->
          <van-button  round type="info" @click="editClick(text,goodsId)" class="button-info" v-if="text=='edit'">下一步</van-button>
          <van-button round type="info" @click="addClick(text)" class="button-info" v-else>下一步</van-button>
        <!-- </div> -->
    </div>
    <back-to-top className=".default-container"></back-to-top>
    
    <selected-list ref="selectedList" :selectedData="selectArrayData"  @deleteCallback="deleteCallback"></selected-list>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'

import keepPages from '@/view/mixins/keepPages'
import selectedList from './components/selectedList'
import indexMixin from '@/view/mixins'
import FileDownloadView from "@/components/FileDownloadView.vue"
import {editSnedGoods, demandSnedGoods,demandSnedGoodsUpload} from '@/api/demand/demandManagement'
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'SelectMaterials',
   mixins: [indexMixin],
  components: { BackToTop, FileDownloadView, selectedList },
  data() {
    return {
      value: '',
      searchQuery:'',
      showAction: false,
      loading: false,
      finished: false,
      result: [],
      list: [],
      goodsId:'',
      goodsMsg: {},
      goodsList: [],
      selectGoodsList:[],
      selectTotal:0,
      //选择的物资
      selectArrayData:[],
     // 编辑时带过来的参数
      editData:{},
      fileDisabled:false,
      text:"",
      filteredItems: [],
      isAllSelected:false,
      planId:""
    }
  },
   computed: {
    filteredList() {
      if (!this.searchQuery) return this.selectGoodsList; // 如果搜索值为空，返回所有数据
      return this.selectGoodsList.filter(item => item.specModel.includes(this.searchQuery) ||
        item.materialName.includes(this.searchValue) ||
        item.unit.includes(this.searchValue) ||
        item.receiver.includes(this.searchValue) ||
        item.addr.includes(this.searchValue) ||
        item.field2.includes(this.searchValue) ||
        item.field0.includes(this.searchValue) ||
        item.field1.includes(this.searchValue)
      ); // 过滤匹配的数据项
    }
  },
  watch:{
    result:{
     handler(newVal) {
        this.selectGoods(newVal)
         this.updateAllSelected();
      },
      deep: true
    },
      // 监听selectedItems变化，动态更新全选状态
    selectedItems() {
      this.updateAllSelected();
    }
  },
  mounted() {
   this.goodsId = this.$route.query.id 
    this.planId = this.$route.query.planId
    this.text = this.$route.query.text
    
    this.getSendGoods();
    if(this.text=='edit'){
    
     this.editDetails()
    }
    if(this.text=='add'){
       this.getSelectGoods()
    }
    
  },

  methods: {
    getSendGoods() {
      demandSnedGoods(this.text == 'edit' ? this.planId : this.goodsId).then((res) => {
        if (res.code == 0) {
          // Toast.clear()
          this.goodsMsg = res.data;
        }
      });
    },
    getSelectGoods(){
       Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
      editSnedGoods(this.goodsId).then((res)=>{
              
        if(res.code==0){
          Toast.clear()
          const data = this.$store.state.public.selectGoodData || [];

          this.result = (data || []).map(item => item.uniqueNumber || item.allocationUniqueNumber);

          this.selectArrayData = data;

          let dataList = res.data.details.concat(data);

          dataList = dataList.filter((item, index, self) => {
          return self.findIndex(t => ((t.uniqueNumber || t.allocationUniqueNumber) === (item.uniqueNumber || item.allocationUniqueNumber))) === index;
        }).map(item => {
          item.sendTotal = item.ssendTotal;
          let Obj = item
          data.map((val) => {
            if ((item.uniqueNumber || item.allocationUniqueNumber) == val.allocationUniqueNumber) {
              Obj = Object.assign({}, item, val)
            }
          })
          
          return Obj
        })

          this.selectGoodsList = dataList.map(item => {
            // 辅助函数：格式化日期为 YYYY-MM-DD
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
              const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）
              return `${year}-${month}-${day}`;
            };
          
            return {
              ...item,
              createDate: formatDate(item.createDate),
              supplyDate: formatDate(item.supplyDate),
              updateDate: formatDate(item.updateDate)
            };
          });
        }
      })
    },
    editDetails(){
        editSnedGoods(this.planId).then((res)=>{
        if(res.code==0){
          const data = this.$store.state.public.selectGoodDataEdit || [];


          this.result = (data || []).map(item => item.uniqueNumber || item.allocationUniqueNumber);

          this.selectArrayData = data;

          let dataList = res.data.details.concat(data);

          dataList = dataList.filter((item, index, self) => {
          return self.findIndex(t => ((t.uniqueNumber || t.allocationUniqueNumber) === (item.uniqueNumber || item.allocationUniqueNumber))) === index;
        }).map(item => {
          item.sendTotal = item.ssendTotal;
          let Obj = item
          data.map((val) => {
            if ((item.uniqueNumber || item.allocationUniqueNumber) == val.allocationUniqueNumber) {
              Obj = Object.assign({}, item, val)
            }
          })
          
          return Obj
        })

          this.selectGoodsList = dataList.map(item => {
            // 辅助函数：格式化日期为 YYYY-MM-DD
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
              const day = date.getDate().toString().padStart(2, '0'); // 日期加0（可选）
              return `${year}-${month}-${day}`;
            };
          
            return {
              ...item,
              createDate: formatDate(item.createDate),
              supplyDate: formatDate(item.supplyDate),
              updateDate: formatDate(item.updateDate)
            };
          });
          
          //  this.result = this.$store.state.public.goodsSelect.map(item => item.allocationUniqueNumber);
           
          // this.selectGoodsList = res.data.details
        } else {
            this.$notify({
              type: 'warning',
              message: "暂无可选物资"
            });
            window.history.back()
          }
      })
    },

     formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString().replace(/\//g, "-"); // 或者使用其他格式化选项，如 toLocaleString 或 toISOString
    },
    onSearch() {
      this.$toast(this.value);
    },
    onFocus() {
      // this.showAction = true;
    },
    onCancel() {
      // this.showAction = false;
    },
    statusChange(){
    //   if (this.searchQuery.trim() === '') {
    //     if(this.text=='add'){
    //        this.getSelectGoods()
    //     }else{
    //       this.editDetails()
    //     }
       
    //     return;
    //   }
      
    //   const query = this.searchQuery.toLowerCase();
    // // 使用原始数据进行过滤，并创建新数组
    // this.selectGoodsList = this.selectGoodsList.filter(item => 
    //   item.materialName.toLowerCase().includes(query)
    // );
    },
    back() {
      history.back()
    },
    editBack(text,id){
      this.$router.push({path:'/sendGoods',query:{title:text,id:id,planId:this.planId}})
    },
    selectClick () {
      this.$router.push({ name: 'SelectContract' })
    },
    // 点击下一步把选择的数据传过去
    addClick(text) {
      if(this.selectArrayData.length>0){
        this.$store.dispatch('public/setSelectGoodData', this.selectArrayData);

        this.$router.push({ path: '/sendGoods',query:{goodData:JSON.stringify(this.selectArrayData),id:this.goodsId,text:text} })
      }else{
        Toast.fail('请选择至少一项');
      }
    },
    editClick(text,id){
       if(this.selectArrayData.length>0){
        this.$store.dispatch('public/setSelectGoodDataEdit', this.selectArrayData);

        this.$router.push({ path: '/sendGoods',query:{goodData:JSON.stringify(this.selectArrayData),id:id,text:text,planId:this.planId} })
      }else{
        Toast.fail('请选择至少一项');
      }
    },
    selectGoods(e){
      const targetIds = new Set(e);
      this.selectArrayData = this.selectGoodsList.filter(item => targetIds.has(item.allocationUniqueNumber));
      this.selectTotal = e.length
    },
   toggleAll() {
      if (this.isAllSelected) {
       this.result = this.selectGoodsList
      .filter(item => item.ssendTotal != 0)
      .map(item => item.allocationUniqueNumber);
      } else {
        this.result = [];
      }
    },
    // 监听选项变化，更新全选状态（可选）
    updateAllSelected() {
     const selectableNumbers = this.selectGoodsList
      .filter(item => item.ssendTotal != 0)
      .map(item => item.allocationUniqueNumber);
    this.isAllSelected = selectableNumbers.every(num => 
      this.result.includes(num)
    );
    },
    deleteCallback(index) {
      this.selectArrayData.splice(index, 1)
      this.result = this.selectArrayData.map(item => item.uniqueNumber || item.allocationUniqueNumber)
      if (!this.result.length) {
        this.$refs.selectedList.init()
      }
    },
    selectedClick() {
      if (this.result.length) {
        this.$refs.selectedList.init()
        return
      }
    },
    openClick(item) {
      if (this.text == 'add') { 
        this.$store.dispatch('public/setSelectGoodData', this.selectArrayData);
      } else {
        this.$store.dispatch('public/setSelectGoodDataEdit', this.selectArrayData);
      }
      this.$router.push({ name: 'MaterialDetailsGoodsView', query: { item: JSON.stringify(item) } })
    }
  }
}
</script>
<style lang="less" scoped>
.select-materials {
  display: flex;
  flex-direction: column;

  .detail-list-ul {
    padding-left: 22px;
  }

  .detail-base-info-edited {
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    // margin-bottom: 8px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 5px;
    display: flex;
    flex-direction: column;

    .detail-title-content {
      padding-left: 0;
      padding-right: 0;

      img {
        width: 26px;
        height: 26px;
      }

      span {
        line-height: 26px;
        margin-left: 0;
      }
    }

    .box-container-p{
      font-size: 11px;
      color: #4a4a4a;
      text-align: center;
      margin-top: 22px;
      margin-bottom: 13px;
      span{
        vertical-align: middle;
      }
    }

    .detail-title-content-edited {
      margin: 21px;
      text-align: center;
      font-size: 12px;

      .van-button {
        width: 110px;
        height: 28px;
        margin-right: 6px;
        font-size: 12px;
      }

      .detail-title-content-edited-add {
        width: 16px;
        height: 16px;
        vertical-align: sub;
      }
    }

    .detail-title-content-edited-button {
      margin-top: 10px;
      margin-bottom: 12px;
    }

    .detail-list-ul-edited {
      border-bottom: 1px solid #e3e3e3;
    }

    .detail-base-info-edited-all {
      text-align: right;
      font-size: 12px;
      padding-top: 10px;
      padding-right: 16px;

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }

    .detail-title-content-field {
      padding-left: 20px;
      padding-right: 10px;
      padding-bottom: 5px;

      .detail-base-info-edited-textarea {
        background: #f6f6f6;
        border-radius: 10px;
      }
    }

    .detail-ul-text {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 10px;
      background: #f2f2f2;
      border-radius: 5px;

      .detail-ul {
        padding: 10px 12px;

        li {
          span {
            text-align: left;
          }
        }
      }
    }

    .detail-title-edited-p {
      justify-content: space-between;

      p {
        img {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }

        &:nth-child(2) {
          padding-right: 10px;

          span {
            font-weight: 400;
            font-size: 12px;
          }
        }
      }
    }
  }

  .select-materials-sticky {
    ::v-deep .van-sticky {
      background: #f8f8f8;
    }
  }

  .select-materials-list {
    height: 100%;
  }

  .van-list {
    background: #f8f8f8;
    padding-bottom: 60px;

    .van-checkbox {
      box-sizing: border-box;
      margin-left: 6px;
      margin-right: 6px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
      position: relative;
      padding: 10px;
      align-items: baseline;

      ::v-deep .van-checkbox__icon {
        font-size: 18px;

        .van-icon {
          border: 1px solid #1989fa;
        }
      }

      ::v-deep .van-checkbox__label {
        width: calc(100% - 25px);

        .list-ul {
          li {
            span:nth-child(2) {
              width: auto !important;
            }
          }
        }
      }
    }
  }

  .select-materials-contract{
    margin-top: 10px;
    box-sizing: border-box;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow:0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 10px;
    .li-status{
      top: auto;
      bottom: 12px;
      span{
        background-color: #edf2ff;
        border: 1px solid #289fec;
        color: #1d93ff;
      }
    }
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

  .select-materials-search{
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
    // .select-materials-select{
    //   font-size: 12px;
    // }
    // .select-materials-select-num{
    //   color: #1d93ff;
    // }
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

  .van-list-div {
    background: #f8f8f8;
    padding-top: 5px;
    padding-bottom: 50px;
    .van-checkbox{
      box-sizing: border-box;
      margin-left: 8px;
      margin-right: 8px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 7px;
      box-shadow:0px 2px 5px rgba(32, 30, 74, 0.1);
      position: relative;
      padding: 10px;
      ::v-deep .van-checkbox__label{
        width: calc(100% - 25px);
        .list-ul{
          li{
            span:nth-child(2){
              width: auto !important;
            }
          }
        }
      }
    }
  }

  .select-Contract-p {
    padding-left: 10px;
    padding-bottom: 8px;
    font-size: 14px;
  }

  .button-info{
    min-width: 150px;
  }
}

.van-icon-plus {
  position: fixed;
  right: 20px;
  bottom: 150px;
  z-index: 999;
  width: 30px;
  height: 30px;
  background: #1989fa;
  border-radius: 30px;
  border: 1px solid #1989fa;
  text-align: center;
  line-height: 30px;
  color: #fff;
}
.default-button-container{
    display: flex;
    font-size: 14px;
    justify-content:space-between;
    padding: 0 0.2rem;
    box-sizing: border-box;
    box-shadow: 4px 0px 5px rgba(32, 30, 74, 0.1);
    z-index: 10000;
        
    .default-button-container-selected {
      font-size: 13px;

      &>span {
        vertical-align: middle;
      }

      img {
        width: 28px;
        height: 28px;
        vertical-align: middle;
      }

      .default-button-container-selected-img {
        transform: rotate(180deg)
      }
    }


    // .allChoose{
    //   width: 15%;
    // }
    // .chooseNum{
    //   width: 28%;
    //   padding-left: 0.1rem;
    // }
    .button-info {
      width: 169px;
      height: 34px;
    }
    // .btns{
    //   flex: 1;
    //   display: flex;
    //   justify-content: space-around;
    //   .btn{
    //     margin: 0 0.1rem;
    //     display: flex;
    //     justify-content: center;
    //     height: 30px;
    //     width: 50%;
    //     font-size: 12px;
    //   }
    // }
}
.number{
    font-size: 16px;
    margin: 0 5px;
    color: rgb(8, 49, 234);
    font-weight: 600;
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
</style>