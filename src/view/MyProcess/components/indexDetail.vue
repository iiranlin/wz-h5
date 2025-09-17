<template>
    <div class="approval-process">
      <div class="process-title detail-floor-content list-title-content">
        <img src="@/assets/img/Icon-flow.png"/>
        <span>流程信息</span>
      </div>
      <div class="process-content">
        <!-- <van-list 
            v-model="loading" 
            :finished="finished" 
            finished-text="没有更多了..." 
            @load="getList"> -->
          <div class="process-content-list" v-for="(item,index) in dataList" :key="index">
              <div class="list-left">
                <p>{{item.actName}}</p>
                <span>{{item.endTime}}</span>    
              </div>
              <div class="list-middle">
                <p v-if="item.status == '2' || item.actId=='root'"><img src="@/assets/img/Icon-state-yes.png" alt=""></p>
                <p v-if="item.status == '3'"><img src="@/assets/img/Icon-state-no.png" alt=""></p>
                <p v-if="item.status == '6'"><img src="@/assets/img/Icon-state-goback.png" alt=""></p>
                <p v-if="item.status == '' && item.actId!='root'"><img src="@/assets/img/Icon-state-waiting.png" alt=""></p></p>
                <div class="middle-border"></div>
              </div>
              <div class="list-right">
                <div>
                  <span class="list-right-title">{{item.assigneeName}}</span>
                  <span v-if="item.status == '2'" style="color:rgba(19, 77, 170, 1);font-weight: 600">通过</span>
                  <span v-if="item.status == '3'"  style="color:rgba(244, 160, 47, 1);font-weight: 600">驳回</span>
                  <span v-if="item.status == '6'" style="color:rgba(19, 77, 170, 1);font-weight: 600">撤销审核</span>
                  <span v-if="item.status == '' && item.actId=='root'"  style="color:rgba(19, 77, 170, 1);font-weight: 600">发起</span>
                  <span v-if="item.status == '' && item.actId!='root'"  style="color:rgba(21, 27, 62, 0.5);font-weight: 400">未审批</span>
                </div>
                <p>单位：{{item.orgName}}</p>
                <p class="right-message" v-if="item.message">意见：{{item.message}}</p>
              </div>
          </div>
        <!-- </van-list> -->
      </div>
    </div>
</template>
<script>
import { wfHistoryList } from '@/api/myToDoList'
import { mergeByActId } from '@/utils/index.js'

export default {
    name:'MyProcess',

    data() {
        return {
            businessId:'',
            dataList:[],
            loading:false,
            finished:false,
        }
    },
    created () {
        let { workflowId, businessId } = this.$route.params
        this.businessId = workflowId || businessId
        this.getList();
    },
    methods: {
        //获取列表数据
        getList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            wfHistoryList(this.businessId).then(({ data }) => {
              this.dataList = mergeByActId(data.recordList);
                this.loading = false;
                this.finished = true;
            }).catch((error) => {
                this.loading = false;
                this.finished = true;
            }).finally(() => {
                toast.clear();
            });
      },
    },
};
</script>
<style lang="less" scoped>
.approval-process {
  margin: 0.1rem 0.25rem 0.25rem 0.25rem;
  border-radius: 6px;
  background: #fff;
  .detail-floor-content{
    padding: 5px 12px 2px 12px;
    span{
      color: #151b3e;
      font-weight: 600;
    }
    .van-button{
      border-radius: 5px;
      margin-right: 8px;
      height: 30px;
    }
    .van-button-selected{
      span{
        color: #0861db;
      }
    }
  }
  .process-content{
    font-size:13px;
    padding: 0.5rem;
    .process-content-list{
      display: flex;
      min-height: 100px;
      .list-left{
        width: 25%;
        text-align:right;
        p{
          font-weight: 600;
          margin-bottom: 0.2rem;
        }
        span{
          color: rgba(21, 27, 62, 0.5);
        }
      }
      .list-middle{
        text-align: center;
        width: 10%;
        p{
          img{
            width:14px;
            height: 14px;
            margin-top: 2px;
          }
        }
        span{
          display: inline-block;
          width:14px;
          height: 14px;
          border-radius: 14px;
          background:  rgba(21, 27, 62, 0.5);
           margin-top: 2px;
        }
        .middle-border{
          height:calc(100% - 16px);
          width: 1px;
          border-left: 1px dotted  rgba(120, 144, 177, 0.5);
          margin-left:calc(50% - 1px);
        }
      }
   
      .list-right{
        width: 65%;
        &>:nth-child(1){
          margin-bottom: 0.2rem;
        }
        &>p{
          color: rgba(21, 27, 62, 0.6);
        }

        &>p.right-message{
          margin-top: 0.2rem;
          padding: 0.1rem;
          color: rgba(21, 27, 62, 1);
          background: rgba(242, 242, 242, 1);
          border-radius: 3px;
        }
        &>div{
          .list-right-title{
            margin-right: 0.2rem;
          }
        }

      }
    }
    .process-content-list:nth-last-child(1){
      .list-middle{
          .middle-border{
          height:calc(100% - 16px);
          width: 0px;
          border-left: 1px dotted  rgba(21, 27, 62, 0);
        }
      }
    }
  }
  
}
</style>