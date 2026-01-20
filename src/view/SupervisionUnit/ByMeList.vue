 <template>
    <div class="default-container" ref="container">
        <van-sticky>
            <div class="list-search-container">
                <van-search 
                    v-model="formData.keywords" 
                    placeholder="输入关键字搜索" 
                    shape="round" 
                    left-icon="none"
                    @search="handeSearch()">
                    <template slot='right-icon'>
                        <van-icon name="search" @click="handeSearch()"/>
                    </template>
                </van-search>
            </div>
        </van-sticky>
        <div class="tabs" v-if="dataList.length > 0">
            <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
                <van-list 
                    v-model="loading" 
                    :finished="finished" 
                    finished-text="没有更多了..." 
                    :immediate-check="false"
                    @load="getList">

                    <div v-for="(item,index) in dataList" :key="index" class="box-container" @click.stop="handleItemClick(item)">
                        <div class="list-title-content">
                            <span>业务编码：</span>
                            <span class="font-weight" style="color:#134daa;">{{item.businessCode}}</span>
                            <div class="li-title-status">
                                <img :src="checkAuditStatus(item.auditStatus)"/>
                                <span>{{item.auditStatus | orderTypeFilter(dict.flowTaskStatus)}}</span>
                            </div>
                        </div>
                        <ul class="list-ul">
                            <li>
                                <span>业务类型：</span>
                                <span>{{item.businessType | orderTypeFilter(dict.flowBusinessType)}}</span>
                            </li>
                            <li>
                                <span>审核提交时间：</span>
                                <span>{{item.startTime | formatTime}}</span>
                            </li>
                        </ul>
                        <div class="list-ul-button">
                            <van-button class="button-info" plain round type="info"  @click.stop="handleProcessClick(item)">查看流程</van-button>
                            <!-- 催办按钮 -->
                            <van-button 
                                v-if="shouldShowUrgeButton(item)" 
                                class="button-info" 
                                plain 
                                round 
                                type="warning"
                                @click.stop="handleUrgeClick(item)">
                                催办
                            </van-button>
                            <!-- 已催办按钮 -->
                            <van-button 
                                v-if="shouldShowUrgedButton(item)" 
                                class="button-info" 
                                plain 
                                round 
                                type="default"
                                disabled>
                                已催办
                            </van-button>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
                        <div v-if="dataList.length == 0" >
                        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
            <van-empty image="/empty-image-default.png" description="暂无数据" />

                        </van-pull-refresh>
        </div>
        <back-to-top :className="className"></back-to-top>
    </div>  
</template>
<script>
import BackToTop from '@/components/BackToTop'
import keepPages from '@/view/mixins/keepPages'
import { wfTodoList } from '@/api/myToDoList'
import { urge } from '@/api/prodmgr-inv/audit'
import indexMixin from '@/view/mixins'
import { FLOW_ROUTE } from '@/utils/constant'
import dayjs from 'dayjs'

export default {
    // 我发起的
    name:'ByMeList',
    mixins: [keepPages,indexMixin],
    components: {BackToTop},
    dicts: ['flowBusinessType','flowTaskStatus'],
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('public/setScrollPosition', {[from.name]: document.querySelector(this.className).scrollTop})
      next();
    },
    filters: {
        formatTime(val) {
            return val ? dayjs(val).format('YYYY-MM-DD HH:mm') : ''
        }
    },

    data() {
        return {
            className: '.default-container',
            formData: {
                keywords: '',
            },
            //列表数据
            dataList:[],

            refreshLoading:false,
            loading:false,
            finished:false,

            listQuery: {
                pageNum: 1,
                pageSize: 10,
            },
        };
    },
    mounted () {
      this.getList();
    },
    created () {
        
    },
    activated () {
      this.onRefresh();
      this.scrollPositionInit(this.className, this.finished)
    },
    methods: {
        //查看流程点击
        handleProcessClick({ businessId, businessType, takeStatus }) {
            this.$router.push({ 
                name: "MyProcess", 
                params: { 
                    businessType,
                    businessId,
                    form: this.$route.name,
                } 
            })
        },
        //获取列表数据
        getList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
         
            wfTodoList(Object.assign({},this.listQuery,this.formData)).then(({ data }) => {
                if(this.refreshLoading){
                    this.dataList = [];
                    this.refreshLoading = false;
                }
                this.loading = false;
                this.dataList = [...this.dataList, ...data.list];

                if (this.dataList?.length >= data?.total) {
                    this.finished = true;
                    return;
                }
                this.listQuery.pageNum = this.listQuery.pageNum + 1;
            }).catch((error) => {
                this.loading = false;
                this.finished = true;
            }).finally(() => {
                toast.clear();
            });
        },
         //已审核状态图标判断
        checkAuditStatus(auditStatus){
            if(auditStatus == '2'){
                return '/static/icon-success.png'
            }else if(auditStatus == '3'){
                return '/static/icon-reject.png'
            }
            return '/static/icon-success.png'
        },
        //列表条目点击
        handleItemClick(item){
            this.$store.dispatch('public/setGoodsReceiptInfo', {});
            this.$store.dispatch('public/setSelectGoodData', []);
            
            const { businessType, businessId } = item
            if(Object.keys(FLOW_ROUTE).includes(businessType)){
                let name = FLOW_ROUTE[businessType]
                let query = { 
                    id: businessId,
                    from: this.$route.name,
                    ...(businessType === "SHLC" && { takeStatus: item.takeStatus }) 
                }
                this.$router.push({ name, query })
            } else {
                this.$router.push({
                    name: "DemandPlanningExamine",
                    params: { 
                        obj: JSON.stringify(item),
                        type: '1',
                    },
                });
            }
            
        },
        //搜索点击
        handeSearch(){
            this.onRefresh();
        },
        //列表刷新
        onRefresh(){
            this.refreshLoading = true;
            this.loading = true;
            this.finished = false;
            this.listQuery.pageNum = 1;
            this.getList();
        },
        
        // 判断是否显示催办按钮
        shouldShowUrgeButton(item) {
            // 1. currentHandlerUserIds 得有值
            if (!item.currentHandlerUserIds) {
                return false;
            }
            
            // 2. isReminder 等于 false 才显示催办
            if (item.isReminder === true) {
                return false;
            }
            
            // 3. lastHandleDate 时间戳和当前时间大于指定秒数
            if (!item.lastHandleDate) {
                return false;
            }
            
            const now = dayjs();
            const lastHandleTime = dayjs(item.lastHandleDate);
            const secondsDiff = now.diff(lastHandleTime, 'second'); // 改为秒级别计算
            
            // ⚠️ 测试配置: 5秒后显示催办按钮 (正式环境改为: 72 * 60 * 60 = 259200秒)
            const URGE_THRESHOLD_SECONDS = 50; // 可手动调整此值进行测试
            
            console.log(`[催办] 业务编码: ${item.businessCode}, 时间差: ${secondsDiff}秒, 阈值: ${URGE_THRESHOLD_SECONDS}秒`);
            
            return secondsDiff > URGE_THRESHOLD_SECONDS;
        },
        
        // 判断是否显示已催办按钮
        shouldShowUrgedButton(item) {
            // currentHandlerUserIds 有值且 isReminder 为 true 时显示已催办
            return item.currentHandlerUserIds && item.isReminder === true;
        },
        
        // 催办点击
        async handleUrgeClick(item) {
            try {
                await this.$dialog.confirm({
                    title: '催办确认',
                    message: '确定要发送催办提醒吗？',
                });
                
                const loading = this.$toast.loading({
                    duration: 0,
                    message: '正在发送催办...',
                    forbidClick: true,
                });
                
                const params = {
                    businessId: item.businessId,
                    businessCode: item.businessCode,
                    businessType: item.businessType,
                    currentHandlerUserIds: item.currentHandlerUserIds, 
                };
                
                await urge(params);
                
                loading.clear();
                
                this.$notify({
                    type: 'success',
                    message: '催办成功',
                });
                
                // 更新当前项的 isReminder 状态
                item.isReminder = true;
                
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('[催办] 催办失败:', error);
                    this.$notify({
                        type: 'warning',
                        message: '催办失败,请重试',
                    });
                }
            }
        },
    },
};
</script>
<style lang="less" scoped>
.list-search-container {
    margin-bottom: 10px;
}
</style>