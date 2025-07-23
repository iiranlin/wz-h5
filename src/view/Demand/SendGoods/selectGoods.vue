<template>
  <div class="select-materials">
    <div class="select-materials-search">
     <van-search v-model="searchQuery" placeholder="输入规格型号" left-icon="none" shape="round" :show-action="showAction"
          @search="onSearch">
          <template slot='right-icon'>
            <van-icon name="search" @click="statusChange()" />
          </template>
        </van-search>
      <!-- <van-search v-model="searchQuery" placeholder="输入关键字搜索" background="center" :show-action="showAction"
        @search="onSearch" @cancel="onCancel" @focus="onFocus" /> -->
    </div>
    <div class="tabs" v-if="filteredList.length">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
      <van-checkbox-group v-model="result" @change="selectGoods" ref="checkboxGroup">
        <!--本次需求未发货数量为0不可选-->
        <van-checkbox shape="square" :name="item.allocationUniqueNumber" v-for="(item, index) in filteredList" :key="index" :disabled="item.ssendTotal == 0 ? true : false" ref="checkboxGroup">
           <div class="detail-base-info">
                 <div class="detail-title-content">
            <img src="/static/icon-xqjh.png">
            <span>物资名称：</span>
            <span>{{item.materialName}}</span>
        </div>
          <ul class="list-ul">
            
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
            <li>
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
          </li>
          <li style="color: red;">
              <span>本次需求未发货数量：</span>
              <span >{{ item.ssendTotal }}</span>
            </li>
          </ul>
           </div>
           
        </van-checkbox>
      </van-checkbox-group>
    </van-list>
    </div>
    <van-empty v-else description="暂无数据" />

    <div class="default-button-container">
        <div class="allChoose">
          <van-checkbox v-model="isAllSelected" @change="toggleAll">全选</van-checkbox>
        </div>
        <div class="chooseNum">
            已选物资<span class="number">{{ selectTotal }}</span>项
        </div>
        <div class="btns">
          <van-button round type="info" @click="editBack(text,goodsId)" class="btn" v-if="text=='edit'">上一步</van-button>
          <van-button round type="info" @click="back" class="btn" v-else>上一步</van-button>
          <van-button round type="info" @click="editClick(text,goodsId)" class="btn" v-if="text=='edit'">下一步</van-button>
          <van-button round type="info" @click="addClick(text)" class="btn" v-else>下一步</van-button>
        </div>
    </div>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import {editSnedGoods,demandSnedGoodsUpload} from '@/api/demand/demandManagement'
import keepPages from '@/view/mixins/keepPages'
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'SelectMaterials',
   mixins: [keepPages],
  components: { BackToTop },
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
    if(this.text=='edit'){
    
     this.editDetails()
    }
    if(this.text=='add'){
       this.getSelectGoods()
    }
    
  },

  methods: {
    getSelectGoods(){
       Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
      editSnedGoods(this.goodsId).then((res)=>{
        if(res.code==0){
          Toast.clear()
          this.selectGoodsList = res.data.details.map(item => {
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
          this.selectGoodsList = res.data.details.map(item => {
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
          
           this.result = this.$store.state.public.goodsSelect.map(item => item.allocationUniqueNumber);
           
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
        this.$router.push({ path: '/finishGoods',query:{goodData:JSON.stringify(this.selectArrayData),id:this.goodsId,text:text} })
      }else{
        Toast.fail('请选择至少一项');
      }
    },
    editClick(text,id){
       if(this.selectArrayData.length>0){
        this.$router.push({ path: '/finishGoods',query:{goodData:JSON.stringify(this.selectArrayData),id:id,text:text,planId:this.planId} })
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
    }
  }
}
</script>
<style lang="less" scoped>
.select-materials {
  display: flex;
  flex-direction: column;

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

  .select-materials-search{
    display: flex;
    justify-content: space-between;
    .select-materials-search-p{
      font-size: 14px;
      line-height: 38px;
      padding: 0 10px;
    }
    .select-materials-select{
      font-size: 12px;
    }
    .select-materials-select-num{
      color: #1d93ff;
    }
  }
  
  .van-search {
    padding-top: 10px;
    width: 100%;
    // width: 165px;
    .van-search__content {
      border-radius: 15px;
    }

    .van-cell {
      border-radius: 15px;
    }
  }

  .van-list {
    background: #f8f8f8;
    padding-bottom: 40px;
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
    .allChoose{
      width: 15%;
    }
    .chooseNum{
      width: 28%;
      padding-left: 0.1rem;
    }
    .btns{
      flex: 1;
      display: flex;
      justify-content: space-around;
      .btn{
        margin: 0 0.1rem;
        display: flex;
        justify-content: center;
        height: 30px;
        width: 50%;
        font-size: 12px;
      }
    }
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