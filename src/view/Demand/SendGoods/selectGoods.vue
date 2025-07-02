<template>
  <div class="select-materials">
    <div class="select-materials-search">
     
      <van-search v-model="value" placeholder="输入关键字搜索" background="center" :show-action="showAction"
        @search="onSearch" @cancel="onCancel" @focus="onFocus" />
    </div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-checkbox-group v-model="result" @change="selectGoods" ref="checkboxGroup">
        <van-checkbox shape="square" :name="item" v-for="(item, index) in selectGoodsList" :key="index" :disabled="item.ssendTotal==0?true:false"> 
          <ul class="list-ul">
            <li>
              <span class="font-weight">本次需求未发货数量：</span>
              <span class="font-weight">{{ item.ssendTotal }}</span>
            </li>
            <li>
              <span>规格型号：</span>
              <span>{{ item.specModel }}</span>
            </li>
             <li class="li-item-both">
              <div class="li-item-left">
                <span>计量单位:</span>
                <span>{{ item.unit }}</span>
              </div>
              <div class="li-item-right">
                <span>合同数量:</span>
                <span>{{ item.amount }}</span>
              </div>
            </li>
             <li class="li-item-both">
              <div class="li-item-left">
                <span>累计计划量(含本次):</span>
                <span>{{ item.cumulativeAmount }}</span>
              </div>
              <div class="li-item-right">
                <span>本次计划数量:</span>
                <span>{{ item.planAmount }}</span>
              </div>
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
              <span>收获地点:</span>
              <span>{{ item.shippingAddress }}</span>
            </li>
              <li>
              <span>收货人及联系方式:</span>
              <span>{{ item.receiver }}</span>
            </li>
             <li>
              <span>投资方:</span>
              <span>{{ item.field0 }}</span>
            </li>
             <li class="li-item-both">
              <div class="li-item-left">
                <span>投资比例:</span>
                <span>{{ item.field1 }}</span>
              </div>
              <!-- <div class="li-item-right" style="color:red;">
                <span >本次需求未发货数量:</span>
                <span>{{ item.ssendTotal }}</span>
              </div> -->
            </li>
            <li>
              <span>备注：</span>
              <span>{{ item.remark }}</span>
            </li>
          </ul>
        </van-checkbox>
      </van-checkbox-group>
    </van-list>
    <div class="default-button-container">
        <div class="chooseNum">
            已选物资<span class="number">{{ selectTotal }}</span>项
        </div>
        <div class="btns">
          <van-button round type="info" @click="back" class="btn">上一步</van-button>
          <van-button round type="info" @click="addClick(text)" class="btn">下一步</van-button>
        </div>
    </div>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import {demandChooseGoods,demandSnedGoodsUpload} from '@/api/demand/demandManagement'
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'SelectMaterials',
  components: { BackToTop },
  data() {
    return {
      value: '',
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
      editData:{}
    }
  },
  mounted() {
    // console.log(this.$store.public.sendGoods,'111')
   this.goodsId = this.$route.query.id 
  //  编辑时传过来的标识(应该存在缓存里的)
    this.text = this.$route.query.text
    console.log(this.text)
    if(this.text=='edit'){
        let arrdata = JSON.parse(this.$route.query.data)
       this.selectGoodsList = arrdata.map(item => {
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
      this.result = this.selectGoodsList.map(item => item);
    }else{
       this.getSelectGoods()
    }
  },
  methods: {
    getSelectGoods(){
       Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
      demandChooseGoods(this.goodsId).then((res)=>{
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
          // this.selectGoodsList = res.data.details
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
    back() {
      history.back()
    },
    selectClick () {
      this.$router.push({ name: 'SelectContract' })
    },
    // 点击下一步把选择的数据传过去
    addClick(text) {
      console.log(this.selectArrayData)
      if(this.selectArrayData.length>0){
        this.$router.push({ path: '/finishGoods',query:{goodData:JSON.stringify(this.selectArrayData),text:text} })
      }else{
        Toast.fail('请选择至少一项');
      }
      
    },
    selectGoods(e){
      // console.log(e.flat())
      this.selectArrayData=e.flat()
      
      this.selectTotal = e.length
    },
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
      background: #fff;
    }

    .van-cell {
      border-radius: 15px;
      background: #fff;
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
    justify-content:space-around;
    .chooseNum{
      width: 40%;
      padding-left: 10px;
    }
    .btns{
      flex: 1;
      display: flex;
      justify-content: space-around;
      .btn{
        margin: 0 10px;
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
</style>